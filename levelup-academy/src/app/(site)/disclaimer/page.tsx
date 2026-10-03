import type { Metadata } from 'next';

import { LegalPage } from '@/components/site/legal-page';
import { site } from '@/config/site';

export const metadata: Metadata = { title: 'Educational Disclaimer' };

export default function DisclaimerPage() {
  return (
    <LegalPage title="Educational Disclaimer" updated="October 3, 2026">
      <h2>Education only</h2>
      <p>
        {site.name} provides general educational information. It is not financial, investment, legal, tax, accounting or other
        professional advice. Consider consulting a qualified professional about your specific situation.
      </p>
      <h2>No guarantee of results</h2>
      <p>
        We do not guarantee income, earnings, business success, clients, sales, investment returns or employment. Any examples
        in our lessons are illustrative only and are not promises or typical results. Your results depend on your effort,
        skills, experience, time, available capital, market conditions, demand, competition, costs and many other factors
        outside our control. Many people who start businesses or side projects do not earn money from them.
      </p>
      <h2>Trading and investing risk</h2>
      <p>
        Trading and investing involve significant risk. You can lose some or all of your money, and leverage can cause losses
        greater than your initial deposit. Past performance does not guarantee future results. Our trading course does not
        provide personalised advice, trade signals or strategies that guarantee profits. Before trading or investing, consider
        your situation and seek advice from a registered professional.
      </p>
      <h2>Business and legal requirements</h2>
      <p>
        Lessons about setting up a business, taxes and regulations (including Canadian requirements) are general information
        that can change and vary by province and situation. Verify requirements with official government sources and
        professionals.
      </p>
      <h2>Third-party tools</h2>
      <p>
        We mention third-party tools, platforms and their typical prices for educational purposes. We are not responsible for
        them, and their features, terms and prices change. Unless clearly stated, mentions are not paid endorsements.
      </p>
      <h2>No testimonials or income claims</h2>
      <p>We do not publish student earnings claims or testimonials that suggest typical results.</p>
    </LegalPage>
  );
}
