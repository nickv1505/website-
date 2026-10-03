import Link from 'next/link';
import { unstable_rethrow } from 'next/navigation';

import { CourseCard } from '@/components/course/course-card';
import { CurriculumPreview, type CurriculumCourse } from '@/components/marketing/curriculum-preview';
import { DashboardPreview } from '@/components/marketing/dashboard-preview';
import { Faq, faqs } from '@/components/marketing/faq';
import { PricingCard } from '@/components/marketing/pricing-card';
import { ButtonLink } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { offer, site } from '@/config/site';
import { catalogStats, getCatalog } from '@/lib/data/catalog';
import type { CourseWithModules } from '@/lib/types';

async function loadCatalog(): Promise<CourseWithModules[]> {
  try {
    return await getCatalog();
  } catch (err) {
    unstable_rethrow(err);
    console.error(err);
    return [];
  }
}

const steps = [
  { title: `Get lifetime access for ${offer.priceLabel}`, text: 'Create your account and pay once through secure Stripe checkout. No subscription.' },
  { title: 'Unlock the complete course library', text: 'Every course, module, lesson and resource is available in your dashboard straight away.' },
  { title: 'Learn at your own pace and put your skills into practice', text: 'Follow step-by-step lessons, complete the action checklists, and track your progress.' },
];

const reasons = [
  { icon: Icons.infinity, title: 'One-time payment', text: `Pay ${offer.priceLabel} once. That's the whole price.` },
  { icon: Icons.refresh, title: 'No monthly subscription', text: 'No renewals, no recurring charges, nothing to cancel.' },
  { icon: Icons.layers, title: 'Every included course', text: 'All eight courses are unlocked together. No upsells per course.' },
  { icon: Icons.clock, title: 'Learn at your own pace', text: 'Start, pause and resume anytime. Your progress is saved.' },
  { icon: Icons.book, title: 'Beginner-friendly lessons', text: 'Plain-English steps, prerequisites and costs explained up front.' },
  { icon: Icons.checkCircle, title: 'Practical exercises and projects', text: 'Checklists, templates and portfolio projects in every course.' },
  { icon: Icons.spark, title: 'Future course updates', text: 'Updates to the included library, for as long as the platform provides them.' },
  { icon: Icons.phone, title: 'Works on every device', text: 'Learn on your phone, tablet or laptop with synced progress.' },
];

export default async function HomePage() {
  const catalog = await loadCatalog();
  const stats = catalogStats(catalog);
  const curriculum: CurriculumCourse[] = catalog.map((c) => ({
    slug: c.slug,
    title: c.title,
    icon: c.icon,
    subtitle: c.subtitle,
    modules: c.modules.map((m) => ({
      title: m.title,
      summary: m.summary,
      lessonSlug: m.lessons[0]?.slug ?? '',
      minutes: m.lessons.reduce((n, l) => n + l.duration_minutes, 0),
      preview: m.lessons.some((l) => l.is_preview),
    })),
  }));

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
        <div className="absolute left-1/2 top-[-280px] -z-10 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[120px]" aria-hidden />
        <div className="container-page grid items-center gap-14 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.05fr_1fr] lg:pb-28">
          <div className="animate-fade-up">
            <p className="eyebrow">
              <span className="size-1.5 rounded-full bg-accent" /> {stats.lessons ? `${stats.courses} courses · ${stats.lessons} practical lessons` : 'The complete online-skills library'}
            </p>
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[4.4rem]">
              Your Next Income Stream <span className="text-accent">Starts Here.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{site.description}</p>
            <p className="mt-4 max-w-xl text-[0.95rem] text-fg/90">
              Get the entire learning library for one payment of <strong className="text-fg">{offer.priceLabelLong}</strong>, with lifetime access.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/checkout" size="lg">
                Unlock All Courses: {offer.priceLabel}
                <Icons.arrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </ButtonLink>
              <ButtonLink href="#curriculum" size="lg" variant="secondary">
                Explore the Curriculum
              </ButtonLink>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-subtle">
              {['One-time payment', 'No subscription', 'Free preview lessons'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Icons.check size={15} className="text-accent" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-fade-up [animation-delay:150ms]">
            <DashboardPreview courses={catalog} />
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="border-t border-line py-24 sm:py-32">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow">Course library</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Eight skill paths. One price.</h2>
              <p className="mt-4 text-lg text-muted">
                Each course teaches a real process step by step: the tools, the costs, how the work gets paid, and what to do next.
              </p>
            </div>
            <ButtonLink href="/courses" variant="secondary">
              Explore the Courses
            </ButtonLink>
          </div>
          {catalog.length ? (
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {catalog.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          ) : (
            <p className="mt-14 rounded-2xl border border-line p-8 text-center text-muted">
              Courses are loading. If this persists, the database may not be configured yet.
            </p>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-t border-line bg-surface/40 py-24 sm:py-32">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Three steps to the full library.</h2>
          </div>
          <ol className="mt-14 grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="card relative p-7">
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <h3 className="mt-8 text-xl font-semibold leading-snug tracking-tight">{s.title}</h3>
                <p className="mt-3 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WHY */}
      <section className="border-t border-line py-24 sm:py-32">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">Why {site.name}</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Built to be practical, priced to be simple.</h2>
          </div>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[1.25rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ icon: Icon, title, text }) => (
              <li key={title} className="bg-bg p-7 transition-colors hover:bg-surface">
                <span className="text-accent">
                  <Icon size={22} />
                </span>
                <h3 className="mt-6 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CURRICULUM PREVIEW */}
      <section id="curriculum" className="border-t border-line bg-surface/40 py-24 sm:py-32">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">Curriculum preview</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">See exactly what you get before you pay.</h2>
            <p className="mt-4 text-lg text-muted">
              Browse every module, then read the first lesson of each course for free. Each lesson includes a goal,
              prerequisites, numbered steps, tools, a worked example, costs, mistakes to avoid and an action checklist.
            </p>
          </div>
          <div className="mt-14">
            <CurriculumPreview courses={curriculum} />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="border-t border-line py-24 sm:py-32">
        <div className="container-page">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="eyebrow">Pricing</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">{offer.priceLabelLong}, lifetime access.</h2>
            <p className="mt-4 text-lg text-muted">One clear offer. No tiers, no subscriptions, no surprises.</p>
          </div>
          <PricingCard />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-line bg-surface/40 py-24 sm:py-32">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Questions, answered honestly.</h2>
          </div>
          <Faq />
          <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-subtle">
            {site.name} provides educational information only and does not guarantee income, business success, investment
            returns or employment. Results depend on individual effort, skills, market conditions and other factors.{' '}
            <Link href="/disclaimer" className="underline underline-offset-4 hover:text-fg">
              Read the full disclaimer
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-t border-line py-24 sm:py-32">
        <div className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.08] blur-[110px]" aria-hidden />
        <div className="container-page text-center">
          <h2 className="mx-auto max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Start learning the skills behind the online economy.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted">One payment. Every course. Lifetime access.</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/checkout" size="lg">
              Get Lifetime Access: {offer.priceLabel} <Icons.arrowRight size={18} />
            </ButtonLink>
            <ButtonLink href="/courses" size="lg" variant="secondary">
              Explore the Courses
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
