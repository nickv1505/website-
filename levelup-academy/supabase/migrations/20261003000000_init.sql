-- =============================================================================
-- LevelUp Academy: core schema
-- Users, courses, modules, lessons, lesson content, resources, progress,
-- payments, a single lifetime entitlement per user, and processed Stripe events.
--
-- Security model
--  * Course/module/lesson METADATA (titles, summaries) of published content is
--    public so visitors can browse the curriculum.
--  * Lesson CONTENT and RESOURCES are readable only when the lesson is a
--    published free preview, or the user holds an active lifetime entitlement,
--    or the user is an admin. Enforced by RLS, not just the UI.
--  * Payments / entitlements / stripe_events are written ONLY by the server
--    using the service role (Stripe webhook). Users can read their own rows.
--  * The admin role lives in profiles.role and can only be changed with SQL
--    (users have no UPDATE privilege on that column).
-- =============================================================================

create type public.app_role as enum ('student', 'admin');
create type public.lesson_status as enum ('draft', 'published');
create type public.resource_kind as enum ('pdf', 'template', 'worksheet', 'link', 'file');

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text not null default '' check (char_length(full_name) <= 120),
  role public.app_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  category text not null,
  icon text not null default 'spark',
  thumbnail_url text,
  position integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  summary text not null default '',
  position integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index modules_course_idx on public.modules (course_id, position);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  summary text not null default '',
  duration_minutes integer not null default 10 check (duration_minutes >= 0),
  position integer not null default 0,
  is_preview boolean not null default false,
  status public.lesson_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, slug)
);
create index lessons_module_idx on public.lessons (module_id, position);

-- Keep lessons.course_id consistent with its module.
create or replace function public.lessons_set_course()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  select m.course_id into new.course_id from public.modules m where m.id = new.module_id;
  if new.course_id is null then
    raise exception 'module % not found', new.module_id;
  end if;
  return new;
end;
$$;

create trigger lessons_set_course
  before insert or update of module_id on public.lessons
  for each row execute function public.lessons_set_course();

-- Protected lesson body, kept apart from the public metadata.
create table public.lesson_content (
  lesson_id uuid primary key references public.lessons (id) on delete cascade,
  body_md text not null default '',
  video_url text,          -- external video (YouTube, Vimeo, direct .mp4 URL)
  video_path text,         -- or a file in the private "course-files" bucket
  updated_at timestamptz not null default now()
);

create table public.lesson_resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  title text not null,
  kind public.resource_kind not null default 'file',
  storage_path text,       -- file in the private "course-files" bucket
  external_url text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  check (storage_path is not null or external_url is not null)
);
create index lesson_resources_lesson_idx on public.lesson_resources (lesson_id, position);

-- ---------------------------------------------------------------------------
-- Learning progress
-- ---------------------------------------------------------------------------
create table public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table public.lesson_visits (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  visited_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create index lesson_visits_recent_idx on public.lesson_visits (user_id, visited_at desc);

-- ---------------------------------------------------------------------------
-- Payments and access
-- ---------------------------------------------------------------------------
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text unique,
  stripe_customer_id text,
  amount_total integer not null,
  currency text not null,
  status text not null check (status in ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index payments_user_idx on public.payments (user_id);

-- One row per user. A single lifetime entitlement unlocks the whole library.
create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  product text not null default 'lifetime_all_access' check (product = 'lifetime_all_access'),
  status text not null default 'active' check (status in ('active', 'revoked')),
  payment_id uuid references public.payments (id) on delete set null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table public.stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Helper functions used by policies
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.has_full_access()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.entitlements e
    where e.user_id = auth.uid() and e.status = 'active'
  );
$$;

create or replace function public.lesson_is_live(p_lesson_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.lessons l
    join public.modules m on m.id = l.module_id
    join public.courses c on c.id = l.course_id
    where l.id = p_lesson_id
      and l.status = 'published'
      and m.is_published
      and c.is_published
  );
$$;

create or replace function public.can_read_lesson(p_lesson_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin()
    or (
      public.lesson_is_live(p_lesson_id)
      and (
        (select l.is_preview from public.lessons l where l.id = p_lesson_id)
        or public.has_full_access()
      )
    );
$$;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_content enable row level security;
alter table public.lesson_resources enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.lesson_visits enable row level security;
alter table public.payments enable row level security;
alter table public.entitlements enable row level security;
alter table public.stripe_events enable row level security;

-- profiles
create policy "read own profile" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "update own profile" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
-- Users may only change their display name, never their role or email copy.
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (full_name, updated_at) on public.profiles to authenticated;

-- courses
create policy "public reads published courses" on public.courses
  for select to anon, authenticated using (is_published or public.is_admin());
create policy "admins manage courses" on public.courses
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- modules
create policy "public reads published modules" on public.modules
  for select to anon, authenticated using (
    public.is_admin()
    or (is_published and exists (
      select 1 from public.courses c where c.id = course_id and c.is_published))
  );
create policy "admins manage modules" on public.modules
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- lessons (metadata only: titles, summaries, flags)
create policy "public reads published lesson metadata" on public.lessons
  for select to anon, authenticated using (public.is_admin() or public.lesson_is_live(id));
create policy "admins manage lessons" on public.lessons
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- lesson content / resources: previews for everyone, the rest for paid users
create policy "read unlocked lesson content" on public.lesson_content
  for select to anon, authenticated using (public.can_read_lesson(lesson_id));
create policy "admins manage lesson content" on public.lesson_content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "read unlocked resources" on public.lesson_resources
  for select to anon, authenticated using (public.can_read_lesson(lesson_id));
create policy "admins manage resources" on public.lesson_resources
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- progress: own rows only, and only for lessons the user can open
create policy "read own progress" on public.lesson_progress
  for select to authenticated using (user_id = auth.uid());
create policy "complete unlocked lessons" on public.lesson_progress
  for insert to authenticated
  with check (user_id = auth.uid() and public.can_read_lesson(lesson_id));
create policy "uncomplete own lessons" on public.lesson_progress
  for delete to authenticated using (user_id = auth.uid());

create policy "read own visits" on public.lesson_visits
  for select to authenticated using (user_id = auth.uid());
create policy "record own visits" on public.lesson_visits
  for insert to authenticated
  with check (user_id = auth.uid() and public.can_read_lesson(lesson_id));
create policy "update own visits" on public.lesson_visits
  for update to authenticated using (user_id = auth.uid())
  with check (user_id = auth.uid() and public.can_read_lesson(lesson_id));

-- payments / entitlements: read own. No write policies: only the service role writes.
create policy "read own payments" on public.payments
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "read own entitlement" on public.entitlements
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
revoke insert, update, delete on public.payments, public.entitlements, public.stripe_events
  from anon, authenticated;
-- stripe_events: no policies at all (service role only).

-- ---------------------------------------------------------------------------
-- Payment processing (called by the Stripe webhook with the service role)
-- Runs in one transaction. A Stripe event id is processed at most once.
-- ---------------------------------------------------------------------------
create or replace function public.record_paid_checkout(
  p_event_id text,
  p_event_type text,
  p_user_id uuid,
  p_session_id text,
  p_payment_intent_id text,
  p_customer_id text,
  p_amount_total integer,
  p_currency text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_payment_id uuid;
begin
  insert into public.stripe_events (id, type) values (p_event_id, p_event_type)
  on conflict (id) do nothing;
  if not found then
    return 'duplicate_event';
  end if;

  if not exists (select 1 from auth.users u where u.id = p_user_id) then
    raise exception 'unknown user %', p_user_id;
  end if;

  insert into public.payments (
    user_id, stripe_checkout_session_id, stripe_payment_intent_id,
    stripe_customer_id, amount_total, currency, status
  )
  values (
    p_user_id, p_session_id, p_payment_intent_id,
    p_customer_id, p_amount_total, lower(p_currency), 'paid'
  )
  on conflict (stripe_checkout_session_id) do update
    set status = 'paid',
        stripe_payment_intent_id = coalesce(excluded.stripe_payment_intent_id, public.payments.stripe_payment_intent_id),
        stripe_customer_id = coalesce(excluded.stripe_customer_id, public.payments.stripe_customer_id),
        updated_at = now()
  returning id into v_payment_id;

  insert into public.entitlements (user_id, product, status, payment_id)
  values (p_user_id, 'lifetime_all_access', 'active', v_payment_id)
  on conflict (user_id) do update
    set status = 'active',
        revoked_at = null,
        payment_id = coalesce(public.entitlements.payment_id, excluded.payment_id)
    where public.entitlements.status <> 'active';

  return 'granted';
end;
$$;

create or replace function public.record_checkout_status(
  p_event_id text,
  p_event_type text,
  p_user_id uuid,
  p_session_id text,
  p_payment_intent_id text,
  p_customer_id text,
  p_amount_total integer,
  p_currency text,
  p_status text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_status not in ('pending', 'failed') then
    raise exception 'invalid status %', p_status;
  end if;
  insert into public.stripe_events (id, type) values (p_event_id, p_event_type)
  on conflict (id) do nothing;
  if not found then
    return 'duplicate_event';
  end if;

  insert into public.payments (
    user_id, stripe_checkout_session_id, stripe_payment_intent_id,
    stripe_customer_id, amount_total, currency, status
  )
  values (
    p_user_id, p_session_id, p_payment_intent_id,
    p_customer_id, p_amount_total, lower(p_currency), p_status
  )
  on conflict (stripe_checkout_session_id) do update
    set status = excluded.status, updated_at = now()
    where public.payments.status not in ('paid', 'refunded');
  return 'recorded';
end;
$$;

create or replace function public.record_refund(
  p_event_id text,
  p_event_type text,
  p_payment_intent_id text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_payment public.payments%rowtype;
begin
  insert into public.stripe_events (id, type) values (p_event_id, p_event_type)
  on conflict (id) do nothing;
  if not found then
    return 'duplicate_event';
  end if;

  update public.payments
     set status = 'refunded', updated_at = now()
   where stripe_payment_intent_id = p_payment_intent_id
   returning * into v_payment;
  if not found then
    return 'unknown_payment';
  end if;

  -- Revoke only if no other paid payment backs this user's access.
  if not exists (
    select 1 from public.payments p
    where p.user_id = v_payment.user_id and p.status = 'paid'
  ) then
    update public.entitlements
       set status = 'revoked', revoked_at = now()
     where user_id = v_payment.user_id;
  end if;
  return 'refunded';
end;
$$;

revoke execute on function public.record_paid_checkout(text, text, uuid, text, text, text, integer, text) from public, anon, authenticated;
revoke execute on function public.record_checkout_status(text, text, uuid, text, text, text, integer, text, text) from public, anon, authenticated;
revoke execute on function public.record_refund(text, text, text) from public, anon, authenticated;
grant execute on function public.record_paid_checkout(text, text, uuid, text, text, text, integer, text) to service_role;
grant execute on function public.record_checkout_status(text, text, uuid, text, text, text, integer, text, text) to service_role;
grant execute on function public.record_refund(text, text, text) to service_role;

-- ---------------------------------------------------------------------------
-- Storage
--  course-files  (private): lesson PDFs, templates, videos. Readable only for
--                 lessons the user can open; signed URLs are created server-side.
--  public-assets (public):  course thumbnails and other marketing images.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('course-files', 'course-files', false), ('public-assets', 'public-assets', true)
on conflict (id) do nothing;

create policy "read unlocked course files" on storage.objects
  for select to authenticated using (
    bucket_id = 'course-files' and (
      public.is_admin()
      or exists (
        select 1 from public.lesson_resources r
        where r.storage_path = name and public.can_read_lesson(r.lesson_id))
      or exists (
        select 1 from public.lesson_content c
        where c.video_path = name and public.can_read_lesson(c.lesson_id))
    )
  );
create policy "admins write course files" on storage.objects
  for insert to authenticated with check (bucket_id in ('course-files', 'public-assets') and public.is_admin());
create policy "admins update course files" on storage.objects
  for update to authenticated using (bucket_id in ('course-files', 'public-assets') and public.is_admin());
create policy "admins delete course files" on storage.objects
  for delete to authenticated using (bucket_id in ('course-files', 'public-assets') and public.is_admin());
