# LevelUp Academy

A premium online learning platform. One **$49.99 USD** one-time payment unlocks **every** course for life.

- **Stack:** Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · Supabase (Postgres, Auth, Storage, row level security) · Stripe Checkout + verified webhooks.
- **Content:** 8 courses, 88 step-by-step lessons. Every lesson has: Goal, Prerequisites, Step-by-step instructions, Tools and resources, Practical example, Expected costs, How this earns revenue, Common mistakes, Action checklist, and Next steps.

---

## 1. Run the website locally on your MacBook

You need three free programs.

1. **Node.js 20 or newer.** Download the LTS version from https://nodejs.org and install it.
2. **Docker Desktop.** Download it from https://www.docker.com/products/docker-desktop, install it, and **open it**. The local database runs inside Docker.
3. **Git.** Open Terminal and run `git --version`. If macOS offers to install developer tools, accept.

Then, in Terminal:

```bash
git clone <your repo URL>
cd website-/levelup-academy
npm install
npm run db:start            # first run downloads Supabase images (a few minutes)
```

`db:start` creates a local database, applies `supabase/migrations`, loads all course content from `supabase/seed.sql`, and prints local keys. Next:

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and fill in the local values printed by `npm run db:start`:
   - `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=` the `PUBLISHABLE_KEY` value
   - `SUPABASE_SECRET_KEY=` the `SECRET_KEY` value
   - `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

   Stripe keys are optional for now. Without them, the checkout page clearly says payments aren't configured. It never fakes a payment.
3. Start the site:
   ```bash
   npm run dev
   ```
   Open **http://localhost:3000**.

**Useful commands**

| Command | What it does |
|---|---|
| `npm run dev` | Start the site in development mode |
| `npm run db:reset` | Reset the local database and reload all course content |
| `npm run content:seed` | Rebuild `supabase/seed.sql` after editing files in `content/courses/` |
| `npm run lint` · `npm run typecheck` · `npm test` | Code checks and unit tests |
| `npm run test:integration` | Database and payment tests (needs `db:start` + `dev` running) |
| `npm run test:e2e` | Full browser tests on desktop and mobile (needs `db:start` + `dev` running) |

---

## 2. Create the Supabase project and configure the database

1. Go to https://supabase.com and create an account.
2. Click **New project**. Choose a name, a strong database password (save it), and a region close to your customers (e.g. Canada Central).
3. When it's ready, go to **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Publishable key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Secret key → `SUPABASE_SECRET_KEY` (**keep private**)
4. Push the database schema and course content from Terminal:
   ```bash
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF   # the ref is in your project URL
   npx supabase db push --include-seed
   ```
   This creates all tables, security policies, storage buckets and payment functions, and loads all 8 courses.
5. In Supabase go to **Authentication → URL Configuration**:
   - **Site URL:** `https://yourdomain.com`
   - **Redirect URLs:** add `https://yourdomain.com/**` (and `http://localhost:3000/**` for local testing)
6. In **Authentication → Sign In / Providers → Email**, keep "Confirm email" on (recommended). For real email volume, set up custom SMTP under **Authentication → Emails** (for example Resend or Postmark).

---

## 3. Configure Stripe and set the price to $49.99 USD

1. Create an account at https://dashboard.stripe.com and complete business verification (required before live payments).
2. Stay in **Test mode** (toggle at the top) while you set up.
3. **Developers → API keys:** copy the **Secret key** (`sk_test_...`) into `STRIPE_SECRET_KEY`.
4. **The price.** The app already charges exactly **$49.99 USD, one time** (`src/config/site.ts`). Optionally, create it in Stripe so it shows nicely in reports:
   - **Product catalog → Add product:** name "LevelUp Academy: Lifetime Access".
   - Pricing: **One-off**, **49.99**, **USD**.
   - Save, copy the price ID (`price_...`) into `STRIPE_PRICE_ID`.

   Either way, the webhook only grants access when Stripe confirms a paid amount of exactly 4999 cents in USD.
5. Optional: enable Stripe's email receipts under **Settings → Customer emails**.

## 4. Set up the payment webhook

The webhook is how the site learns, securely, that a payment succeeded. **Access is only granted here**, never by the success page.

1. **Developers → Webhooks → Add endpoint.**
2. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
3. Select these events:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `charge.refunded`
4. Save, click **Reveal signing secret**, and copy it (`whsec_...`) into `STRIPE_WEBHOOK_SECRET`.

**Local testing with real Stripe test payments:** install the Stripe CLI (`brew install stripe/stripe-cli/stripe`), then run:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the `whsec_...` it prints into `.env.local` and restart `npm run dev`.

## 5. Create your admin account

Admins can only be created with your secret key. Nobody can make themselves an admin from the website.

1. Sign up on your site with your own email (and confirm it).
2. In Terminal, with `.env.local` pointing at the database you want (local or production):
   ```bash
   npm run make-admin -- you@example.com
   ```
   Alternatively, in Supabase **SQL Editor**:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
3. Sign out and back in. You'll see **Admin** in the header, at `/admin`.

## 6. Add your own course videos and lessons

Everything is editable in **/admin**. No code needed.

- **Courses:** edit the title, description, category, icon and publish status, or create a new course.
- **Modules:** add, rename, reorder (arrows), hide or delete.
- **Lessons:** click a lesson to edit its title, summary, duration and text (Markdown). Status is **Draft** (hidden) or **Published**. Tick **Free preview** to let visitors read it before paying. Drafts are never shown to students.
- **Videos:**
  - paste a YouTube (unlisted), Vimeo or direct `.mp4` link; or
  - upload a video file. It's stored privately and served with expiring links only to students who have access.

  Supabase's default upload limit is 50 MB. Raise it in **Storage → Settings**, or host long videos on Vimeo or YouTube (unlisted).
- **Downloads:** upload PDFs, templates or worksheets, or add links. Only students who can open the lesson can download them.

**Markdown cheat sheet:**

| Write | Result |
|---|---|
| `## Heading` | Section heading |
| `1. Step` | Numbered steps |
| `- item` | Bullet list |
| `- [ ] task` | Checklist item |
| `> note` | Callout |
| `**bold**` | Bold text |
| `[text](https://link)` | Link |

**Bulk editing in code:** lessons also live in `content/courses/*.md`. After editing, run `npm run content:seed` then `npm run db:reset` (local) or `npx supabase db push --include-seed` (production). Seeding overwrites the seeded lessons with the file versions; lessons you created in /admin are untouched.

## 7. Test a purchase

1. Use **test mode** keys (`sk_test_...`) and a test-mode webhook (or `stripe listen` locally).
2. On your site, sign up, then click **Get Full Access** and pay with test card **4242 4242 4242 4242**, any future expiry date, any CVC and any postcode.
3. You'll return to the success page, which shows "You're in" within seconds once the webhook confirms the payment. The dashboard shows all 8 courses unlocked.
4. Check the record in Supabase **Table Editor → payments / entitlements**.
5. Try a refund in Stripe (**Payments → the payment → Refund**). Access is removed automatically.
6. Sign out, sign back in, and confirm your access and progress are still there.

When everything works, switch Stripe to **live mode**, replace both Stripe variables with live values (live secret key plus a live-mode webhook's signing secret), and redeploy.

## 8. Deploy the website publicly (Vercel)

1. Push this repository to GitHub.
2. Go to https://vercel.com, sign in with GitHub, and click **Add New → Project**. Import the repo and set **Root Directory** to `levelup-academy`.
3. Add every environment variable from the list below in **Settings → Environment Variables**, with `NEXT_PUBLIC_SITE_URL` set to your real domain.
4. Click **Deploy**.
5. **Settings → Domains:** add your domain and follow the DNS instructions at your registrar.
6. Update the Supabase **Site URL / Redirect URLs** and the Stripe webhook URL to use your domain.
7. Do one real purchase in live mode with your own card, then refund it.

## Environment variables

| Variable | Where it comes from | Secret? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your domain, e.g. `https://levelupacademy.com` | No |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Your support email | No |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | No |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → API (publishable key) | No (safe in browser; protected by RLS) |
| `SUPABASE_SECRET_KEY` | Supabase → API (secret key) | **Yes, server only** |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys | **Yes, server only** |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → your endpoint | **Yes, server only** |
| `STRIPE_PRICE_ID` | Stripe → your $49.99 one-off price (optional) | No |

See `.env.example`.

---

## How access control works

- **Database (`supabase/migrations`):**
  - `profiles` (with a server-assigned `role`);
  - `courses → modules → lessons` (public metadata) and `lesson_content` / `lesson_resources` (protected);
  - `lesson_progress`, `lesson_visits`;
  - `payments`, `entitlements` (one lifetime row per user), `stripe_events`.
- **Row level security:**
  - lesson bodies and resources are readable only when the lesson is a published free preview, the user has an active lifetime entitlement, or the user is an admin;
  - payments and entitlements can only be **written** by the service role (the webhook);
  - users can only change their own display name.
- **Payments:**
  - `/api/checkout` creates a one-time Stripe Checkout Session tied to the signed-in user;
  - `/api/stripe/webhook` verifies Stripe's signature on the raw body, checks the product, user and exact amount ($49.99 USD), then calls `record_paid_checkout()`, which inserts the Stripe event ID, payment and entitlement **in one transaction**. Duplicate or concurrent deliveries return `duplicate_event` and change nothing;
  - refunds revoke access.
- **Admin:** the role is stored in the database and checked on the server for every admin page and action, and again by RLS.

## Before launch: review checklist

Items marked ⚠️ need your attention.

- ⚠️ **Legal pages** (`src/app/(site)/terms|privacy|refunds|disclaimer`) are templates and show a "review before launch" banner. Have them reviewed for Canadian privacy law (PIPEDA and provincial laws), consumer protection rules in your customers' provinces and countries, and your refund terms. Then remove the banner in `src/components/site/legal-page.tsx`.
- ⚠️ **Refund policy:** the default is a 14-day full refund (`src/config/site.ts → refundPolicy`). Decide what you want.
- ⚠️ **Operator details:** set `legalName` and `jurisdiction` in `src/config/site.ts`.
- ⚠️ **Tax:** selling digital products may require collecting GST/HST or other sales taxes (e.g. once over the small-supplier threshold, and for some foreign customers). Ask an accountant; Stripe Tax can automate collection.
- ⚠️ **Course content:** written as accurate general education with no income claims, but tool prices, platform rules and government thresholds change. Review lessons, especially the Canadian business and trading lessons, before launch and periodically.
- Branding: name, price and copy live in `src/config/site.ts`; colours in `src/app/globals.css` (`@theme`).

## Tests

| Suite | Tests | What it covers |
|---|---|---|
| Unit (`npm test`) | 117 | Webhook decision logic (grant only for verified paid $49.99 USD sessions; reject wrong amount, currency, product, user or mode; refunds); checkout parameters (one-time payment, never subscription); content validation (every lesson has all 10 sections and a checklist, risk disclaimers); redirect safety |
| Integration (`npm run test:integration`) | 14 | Real database and real signed webhooks: visitors browse all courses and read only previews; unpaid students can't read paid lessons, grant themselves access, become admin or call the payment function; invalid signatures, wrong amounts and unpaid sessions grant nothing; a verified payment unlocks every published lesson in all 8 courses; 5 concurrent duplicate deliveries create exactly one payment and one entitlement; sign-out/in keeps access and progress; refunds revoke access |
| Browser E2E (`npm run test:e2e`, desktop and mobile) | 4 | Full journey: browse → free preview → sign up → forged success URL unlocks nothing → webhook → success page → dashboard with all 8 courses → a paid lesson in every course → mark complete → sign out/in keeps access; non-admins get 404 on /admin; admins can edit lessons and upload files |
