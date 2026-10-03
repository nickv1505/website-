/**
 * Integration tests against a running local stack:
 *   npm run db:start   (local Supabase with migrations + seed)
 *   npm run dev        (Next.js on :3000 with STRIPE_WEBHOOK_SECRET from .env.local)
 *   npm run test:integration
 *
 * They exercise the real database policies and the real webhook endpoint with
 * genuinely signed Stripe payloads (signature verification is not mocked).
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import Stripe from 'stripe';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const env = Object.fromEntries(
  readFileSync(path.join(__dirname, '../../.env.local'), 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)])
);
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const PUBLIC_KEY = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const SECRET_KEY = env.SUPABASE_SECRET_KEY;
const WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;
const APP = process.env.APP_URL || 'http://localhost:3000';
const PASSWORD = 'correct-horse-battery-9';

const admin = createClient(URL_, SECRET_KEY, { auth: { persistSession: false } });
const anon = createClient(URL_, PUBLIC_KEY, { auth: { persistSession: false } });
const stripe = new Stripe('sk_test_unused');
const created: string[] = [];

async function newStudent(): Promise<{ id: string; email: string; client: SupabaseClient }> {
  const email = `student-${randomUUID().slice(0, 8)}@test.local`;
  const { data, error } = await admin.auth.admin.createUser({ email, password: PASSWORD, email_confirm: true, user_metadata: { full_name: 'Test Student' } });
  if (error) throw error;
  created.push(data.user.id);
  return { id: data.user.id, email, client: await signIn(email) };
}

async function signIn(email: string) {
  const client = createClient(URL_, PUBLIC_KEY, { auth: { persistSession: false } });
  const { error } = await client.auth.signInWithPassword({ email, password: PASSWORD });
  if (error) throw error;
  return client;
}

function sessionEvent(userId: string, opts: { eventId?: string; sessionId?: string; amount?: number; type?: string; paymentStatus?: string } = {}) {
  const sessionId = opts.sessionId ?? `cs_test_${randomUUID().replace(/-/g, '')}`;
  return {
    id: opts.eventId ?? `evt_${randomUUID().replace(/-/g, '')}`,
    object: 'event',
    type: opts.type ?? 'checkout.session.completed',
    data: {
      object: {
        id: sessionId,
        object: 'checkout.session',
        mode: 'payment',
        payment_status: opts.paymentStatus ?? 'paid',
        amount_total: opts.amount ?? 4999,
        currency: 'usd',
        client_reference_id: userId,
        metadata: { product: 'lifetime_all_access', user_id: userId },
        payment_intent: `pi_${sessionId.slice(-16)}`,
        customer: 'cus_test_123',
      },
    },
  };
}

async function postWebhook(event: unknown, secret = WEBHOOK_SECRET) {
  const payload = JSON.stringify(event);
  const header = stripe.webhooks.generateTestHeaderString({ payload, secret });
  const res = await fetch(`${APP}/api/stripe/webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'stripe-signature': header },
    body: payload,
  });
  return { status: res.status, body: await res.json() };
}

let lessons: { id: string; is_preview: boolean; course_id: string }[] = [];
let previewLesson: string;
let paidLesson: string;

beforeAll(async () => {
  const { data, error } = await admin.from('lessons').select('id, is_preview, course_id').eq('status', 'published');
  if (error) throw error;
  lessons = data;
  previewLesson = lessons.find((l) => l.is_preview)!.id;
  paidLesson = lessons.find((l) => !l.is_preview)!.id;
});

afterAll(async () => {
  for (const id of created) await admin.auth.admin.deleteUser(id);
});

describe('visitor without an account', () => {
  it('can browse all eight courses and their curriculum', async () => {
    const { data } = await anon.from('courses').select('slug, modules(id, lessons(id, title))').eq('is_published', true);
    expect(data).toHaveLength(8);
    expect(data!.flatMap((c) => c.modules.flatMap((m) => m.lessons)).length).toBe(lessons.length);
  });

  it('can read free preview lessons but not paid lessons', async () => {
    const preview = await anon.from('lesson_content').select('body_md').eq('lesson_id', previewLesson).maybeSingle();
    expect(preview.data?.body_md).toContain('## Goal');
    const paid = await anon.from('lesson_content').select('body_md').eq('lesson_id', paidLesson).maybeSingle();
    expect(paid.data).toBeNull();
    const { data: all } = await anon.from('lesson_content').select('lesson_id');
    expect(all!.length).toBe(lessons.filter((l) => l.is_preview).length);
  });
});

describe('signed-in student who has NOT paid', () => {
  let s: Awaited<ReturnType<typeof newStudent>>;
  beforeAll(async () => {
    s = await newStudent();
  });

  it('cannot read protected lessons', async () => {
    const { data } = await s.client.from('lesson_content').select('lesson_id');
    expect(data!.every((r) => lessons.find((l) => l.id === r.lesson_id)?.is_preview)).toBe(true);
  });

  it('cannot grant itself access, change its role, or call the payment function', async () => {
    const ent = await s.client.from('entitlements').insert({ user_id: s.id });
    expect(ent.error).not.toBeNull();
    await s.client.from('profiles').update({ role: 'admin' }).eq('id', s.id);
    const { data: profile } = await admin.from('profiles').select('role').eq('id', s.id).single();
    expect(profile!.role).toBe('student');
    const rpc = await s.client.rpc('record_paid_checkout', {
      p_event_id: 'evt_fake', p_event_type: 'x', p_user_id: s.id, p_session_id: 'cs_fake',
      p_payment_intent_id: null, p_customer_id: null, p_amount_total: 4999, p_currency: 'usd',
    });
    expect(rpc.error).not.toBeNull();
    const { data: still } = await admin.from('entitlements').select('id').eq('user_id', s.id);
    expect(still).toHaveLength(0);
  });

  it('can track progress on previews but not on locked lessons', async () => {
    expect((await s.client.from('lesson_progress').insert({ user_id: s.id, lesson_id: previewLesson })).error).toBeNull();
    expect((await s.client.from('lesson_progress').insert({ user_id: s.id, lesson_id: paidLesson })).error).not.toBeNull();
  });

  it('rejects webhooks with an invalid signature', async () => {
    const res = await postWebhook(sessionEvent(s.id), 'whsec_wrong_secret');
    expect(res.status).toBe(400);
    const { data } = await admin.from('entitlements').select('id').eq('user_id', s.id);
    expect(data).toHaveLength(0);
  });

  it('is not unlocked by a payment for the wrong amount', async () => {
    const res = await postWebhook(sessionEvent(s.id, { amount: 100 }));
    expect(res.body.result).toBe('rejected');
    const { data } = await admin.from('entitlements').select('id').eq('user_id', s.id);
    expect(data).toHaveLength(0);
  });

  it('is not unlocked by an unpaid (pending) checkout', async () => {
    const res = await postWebhook(sessionEvent(s.id, { paymentStatus: 'unpaid' }));
    expect(res.body.result).toBe('recorded');
    const { data } = await admin.from('entitlements').select('id').eq('user_id', s.id);
    expect(data).toHaveLength(0);
  });
});

describe('verified $49.99 payment', () => {
  let s: Awaited<ReturnType<typeof newStudent>>;
  const event = { id: '', sessionId: '' };

  beforeAll(async () => {
    s = await newStudent();
  });

  it('unlocks every published lesson in all eight courses', async () => {
    const e = sessionEvent(s.id);
    event.id = e.id;
    event.sessionId = e.data.object.id;
    const res = await postWebhook(e);
    expect(res.status).toBe(200);
    expect(res.body.result).toBe('granted');

    const { data: ent } = await s.client.from('entitlements').select('status, product').eq('user_id', s.id).single();
    expect(ent).toEqual({ status: 'active', product: 'lifetime_all_access' });

    const { data: readable } = await s.client.from('lesson_content').select('lesson_id');
    expect(readable!.length).toBe(lessons.length);
    const courses = new Set(lessons.filter((l) => readable!.some((r) => r.lesson_id === l.id)).map((l) => l.course_id));
    expect(courses.size).toBe(8);
  });

  it('allows progress tracking on paid lessons', async () => {
    expect((await s.client.from('lesson_progress').insert({ user_id: s.id, lesson_id: paidLesson })).error).toBeNull();
  });

  it('ignores duplicate deliveries of the same event, including concurrent ones', async () => {
    const replay = sessionEvent(s.id, { eventId: event.id, sessionId: event.sessionId });
    const results = await Promise.all(Array.from({ length: 5 }, () => postWebhook(replay)));
    for (const r of results) {
      expect(r.status).toBe(200);
      expect(r.body.result).toBe('duplicate_event');
    }
    const { data: ents } = await admin.from('entitlements').select('id').eq('user_id', s.id);
    const { data: pays } = await admin.from('payments').select('id, status').eq('user_id', s.id).eq('status', 'paid');
    expect(ents).toHaveLength(1);
    expect(pays).toHaveLength(1);
  });

  it('keeps one consistent record when Stripe sends a second event for the same session', async () => {
    const res = await postWebhook(sessionEvent(s.id, { sessionId: event.sessionId, type: 'checkout.session.async_payment_succeeded' }));
    expect(res.status).toBe(200);
    const { data: ents } = await admin.from('entitlements').select('id').eq('user_id', s.id);
    const { data: pays } = await admin.from('payments').select('id').eq('user_id', s.id).eq('stripe_checkout_session_id', event.sessionId);
    expect(ents).toHaveLength(1);
    expect(pays).toHaveLength(1);
  });

  it('keeps access after signing out and back in (new session, new device)', async () => {
    await s.client.auth.signOut();
    const again = await signIn(s.email);
    const { data: ent } = await again.from('entitlements').select('status').single();
    expect(ent!.status).toBe('active');
    const { data: content } = await again.from('lesson_content').select('body_md').eq('lesson_id', paidLesson).single();
    expect(content!.body_md).toContain('## Step-by-step instructions');
    const { data: progress } = await again.from('lesson_progress').select('lesson_id').eq('lesson_id', paidLesson);
    expect(progress).toHaveLength(1);
  });

  it('revokes access after a full refund', async () => {
    const refund = {
      id: `evt_${randomUUID().replace(/-/g, '')}`,
      object: 'event',
      type: 'charge.refunded',
      data: { object: { id: 'ch_1', object: 'charge', refunded: true, payment_intent: `pi_${event.sessionId.slice(-16)}` } },
    };
    const res = await postWebhook(refund);
    expect(res.body.result).toBe('refunded');
    const client = await signIn(s.email);
    const { data: ent } = await client.from('entitlements').select('status').single();
    expect(ent!.status).toBe('revoked');
    const { data: content } = await client.from('lesson_content').select('lesson_id').eq('lesson_id', paidLesson).maybeSingle();
    expect(content).toBeNull();
  });
});
