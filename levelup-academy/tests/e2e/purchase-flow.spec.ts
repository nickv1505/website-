import { createClient } from '@supabase/supabase-js';
import { expect, test, type Page } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import Stripe from 'stripe';

const env = Object.fromEntries(
  readFileSync(path.join(__dirname, '../../.env.local'), 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)])
);
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });
const stripe = new Stripe('sk_test_unused');
const PASSWORD = 'correct-horse-battery-9';
const PAID_LESSON = '/courses/building-and-selling-websites/building-websites-with-claude-code';

/** Simulates Stripe confirming payment by sending a genuinely signed webhook. */
async function payViaWebhook(userId: string) {
  const sessionId = `cs_test_${randomUUID().replace(/-/g, '')}`;
  const payload = JSON.stringify({
    id: `evt_${randomUUID().replace(/-/g, '')}`,
    object: 'event',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: sessionId, object: 'checkout.session', mode: 'payment', payment_status: 'paid', amount_total: 4999, currency: 'usd',
        client_reference_id: userId, metadata: { product: 'lifetime_all_access', user_id: userId }, payment_intent: `pi_${sessionId.slice(-12)}`, customer: 'cus_e2e',
      },
    },
  });
  const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/stripe-webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'stripe-signature': stripe.webhooks.generateTestHeaderString({ payload, secret: env.STRIPE_WEBHOOK_SECRET }) },
    body: payload,
  });
  expect(res.status).toBe(200);
  return sessionId;
}

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

test('visitor → sign up → pay → every course unlocked → sign out/in keeps access', async ({ page }, info) => {
  const email = `e2e-${info.project.name}-${randomUUID().slice(0, 6)}@test.local`;
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  // 1. Visitor browses courses and a free preview without paying.
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your Next Income Stream');
  await noHorizontalScroll(page);
  await page.goto('/courses/making-money-with-ai/introduction-to-ai-tools');
  await expect(page.getByRole('heading', { name: 'Step-by-step instructions' })).toBeVisible();
  await page.goto(PAID_LESSON);
  await expect(page.getByText('This lesson is part of the full library')).toBeVisible();

  // 2. Sign up from the checkout CTA.
  await page.goto('/checkout');
  await expect(page).toHaveURL(/\/signup\?next=(%2F|\/)checkout/);
  await page.getByLabel('Full name').fill('E2E Student');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByRole('heading', { name: 'Unlock the full library' })).toBeVisible();
  const { data: user } = await admin.from('profiles').select('id').eq('email', email).single();

  // The Pay button asks the create-checkout function for a Stripe URL. Stripe's API
  // is unreachable from this test sandbox, so we expect a clear error, never a fake success.
  await page.getByRole('button', { name: /Pay \$49\.99 with Stripe/ }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page).toHaveURL(/\/checkout$/);

  // 3. Opening the success URL WITHOUT a verified payment unlocks nothing.
  await page.goto('/checkout/success?session_id=cs_test_forged_session');
  await expect(page.getByRole('heading', { name: 'Finishing up your purchase' })).toBeVisible();
  await page.goto(PAID_LESSON);
  await expect(page.getByText('This lesson is part of the full library')).toBeVisible();
  expect((await admin.from('entitlements').select('id').eq('user_id', user!.id)).data).toHaveLength(0);

  // 4. Stripe confirms the $49.99 payment via the signed webhook.
  await payViaWebhook(user!.id);
  await page.goto('/checkout/success?session_id=cs_test_after_webhook');
  await expect(page.getByRole('heading', { name: /You.re in/ })).toBeVisible();
  await page.getByRole('link', { name: /Go to my dashboard/ }).click();

  // 5. Dashboard shows all eight courses unlocked.
  await expect(page.getByText('Lifetime access active. All 8 courses are unlocked.')).toBeVisible();
  await expect(page.getByText('8 courses', { exact: true })).toBeVisible();
  await noHorizontalScroll(page);
  await page.screenshot({ path: `test-results/${info.project.name}-dashboard.png`, fullPage: true });

  // 6. A paid lesson from every course opens.
  const { data: firstPaid } = await admin
    .from('lessons')
    .select('slug, courses(slug)')
    .eq('is_preview', false)
    .eq('status', 'published')
    .eq('position', 1);
  const perCourse = new Map<string, string>();
  for (const l of firstPaid ?? []) {
    const c = (l.courses as unknown as { slug: string }).slug;
    if (!perCourse.has(c)) perCourse.set(c, l.slug);
  }
  expect(perCourse.size).toBe(8);
  for (const [course, lesson] of perCourse) {
    await page.goto(`/courses/${course}/${lesson}`);
    await expect(page.getByRole('heading', { name: 'Action checklist' })).toBeVisible();
  }

  // 7. Mark complete and see progress.
  await page.goto(PAID_LESSON);
  await noHorizontalScroll(page);
  await page.screenshot({ path: `test-results/${info.project.name}-lesson.png` });
  await page.getByRole('button', { name: /Mark as complete/ }).click();
  await expect(page).not.toHaveURL(new RegExp(`${PAID_LESSON}$`));
  await page.goto(PAID_LESSON);
  await expect(page.getByRole('button', { name: 'Completed' })).toBeVisible();

  // 8. Sign out and back in: access and progress persist.
  await page.goto('/account');
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto(PAID_LESSON);
  await expect(page.getByText('This lesson is part of the full library')).toBeVisible();
  await page.goto(`/login?next=${encodeURIComponent(PAID_LESSON)}`);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(new RegExp(`${PAID_LESSON}$`));
  await expect(page.getByRole('button', { name: 'Completed' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Step-by-step instructions' })).toBeVisible();

  expect(errors).toEqual([]);
  await admin.auth.admin.deleteUser(user!.id);
});

test('non-admins cannot open the admin area; admins can', async ({ page }, info) => {
  const email = `admin-${info.project.name}-${randomUUID().slice(0, 6)}@test.local`;
  const { data } = await admin.auth.admin.createUser({ email, password: PASSWORD, email_confirm: true });
  await page.goto('/login?next=/admin');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();

  await admin.from('profiles').update({ role: 'admin' }).eq('id', data.user!.id);
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Courses' })).toBeVisible();
  await page.getByRole('link', { name: /Making Money With AI/ }).click();
  await expect(page.getByRole('heading', { name: 'Modules and lessons' })).toBeVisible();

  // Edit a lesson and upload a downloadable resource to private storage.
  await page.getByRole('link', { name: 'Practical beginner projects' }).click();
  await expect(page.getByLabel('Lesson content (Markdown)')).toHaveValue(/## Goal/);
  await page.getByRole('button', { name: 'Save lesson' }).click();
  await expect(page.getByText('Saved and published.')).toBeVisible();
  const title = `Worksheet ${info.project.name} ${randomUUID().slice(0, 4)}`;
  await page.getByLabel('Resource title').fill(title);
  await page.locator('input[name=file]').setInputFiles({ name: 'worksheet.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 test') });
  await page.getByRole('button', { name: 'Add resource' }).click();
  await expect(page.getByText('Resource added.')).toBeVisible();
  const { data: res } = await admin.from('lesson_resources').select('id, storage_path').eq('title', title).single();
  expect(res!.storage_path).toMatch(/^lessons\//);
  // Visitors cannot see paid-lesson resources.
  const anon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false } });
  expect((await anon.from('lesson_resources').select('id').eq('id', res!.id)).data).toHaveLength(0);
  await admin.storage.from('course-files').remove([res!.storage_path!]);
  await admin.from('lesson_resources').delete().eq('id', res!.id);
  await admin.auth.admin.deleteUser(data.user!.id);
});
