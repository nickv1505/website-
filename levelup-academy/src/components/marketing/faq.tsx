import { Icons } from '@/components/ui/icons';
import { offer, refundPolicy, site } from '@/config/site';

export const faqs: { q: string; a: string }[] = [
  {
    q: 'Is this a one-time payment?',
    a: `Yes. You pay ${offer.priceLabelLong} once. There are no subscriptions, renewals or recurring fees, and no individual course is ever charged separately.`,
  },
  {
    q: 'Do I get access to every course?',
    a: 'Yes. One purchase unlocks every course, module, lesson and downloadable resource in the library, including the eight core courses, for the lifetime of the platform.',
  },
  {
    q: 'Is this suitable for beginners?',
    a: 'Yes. Every lesson starts from the basics and walks through the process step by step, with prerequisites, costs, examples and a checklist so you know exactly what to do next.',
  },
  {
    q: 'How do I access my courses after purchasing?',
    a: 'Create an account, complete checkout with Stripe, and your account is upgraded as soon as Stripe confirms the payment, usually within seconds. Sign in on any device to reach your dashboard.',
  },
  {
    q: 'Do I need previous experience?',
    a: 'No. Lessons list any tools or accounts you need and explain free options wherever possible. Some paths, like selling services, simply take practice.',
  },
  {
    q: 'Can I access the courses on my phone?',
    a: 'Yes. The platform works in any modern browser on phones, tablets and computers, and your progress syncs across devices.',
  },
  {
    q: 'Are earnings guaranteed?',
    a: 'No. These are educational courses. Any results depend on your own effort, skills, the time you invest, market demand, competition, costs and many other factors. We do not promise income, clients, sales or business success.',
  },
  {
    q: 'Is trading risk-free?',
    a: 'No. Trading and investing involve significant risk, including the loss of your entire investment, and leverage can magnify losses. The trading course is general education, not financial advice.',
  },
  {
    q: 'What happens if I forget my password?',
    a: 'Use “Forgot password” on the sign-in page. We will email you a secure link to set a new one. Your purchase stays attached to your account.',
  },
  {
    q: 'What is the refund policy?',
    a: `${refundPolicy.summary} See the Refund Policy page for full details, or contact ${site.supportEmail}.`,
  },
];

export function Faq() {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-line border-y border-line">
      {faqs.map((f) => (
        <details key={f.q} className="group py-1 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[1.05rem] font-medium">
            {f.q}
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line-strong text-muted transition-transform duration-300 group-open:rotate-180 group-open:text-fg">
              <Icons.chevronDown size={16} />
            </span>
          </summary>
          <p className="pb-6 pr-12 leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
