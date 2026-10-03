/**
 * Brand and offer settings. Change the name, price or copy here and it updates
 * across the site. Colours live in src/app/globals.css (the @theme block).
 */
export const site = {
  name: 'LevelUp Academy',
  shortName: 'LevelUp',
  tagline: 'Your Next Income Stream Starts Here.',
  description:
    'Learn the skills behind the online economy, from AI and freelancing to web development, e-commerce, and more. One payment. Every course. Lifetime access.',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@example.com',
  // Legal entity shown on legal pages. Replace before launch.
  legalName: 'LevelUp Academy (operator name to be added)',
  jurisdiction: 'Ontario, Canada',
} as const;

/** The single product. Webhook verification checks the paid amount against this. */
export const offer = {
  productKey: 'lifetime_all_access',
  name: 'LevelUp Academy: Lifetime Access',
  priceCents: 4999,
  currency: 'usd',
  priceLabel: '$49.99',
  priceLabelLong: '$49.99 USD',
} as const;

export function siteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  return url.replace(/\/+$/, '');
}

/**
 * Refund policy used across the FAQ and Refund Policy page.
 * REVIEW BEFORE LAUNCH: this is a business decision with consumer-law implications.
 * Refunds processed in Stripe automatically revoke access (via the webhook).
 */
export const refundPolicy = {
  days: 14,
  summary:
    'If the platform is not right for you, email us within 14 days of purchase for a full refund. Refunded purchases lose access to the library.',
} as const;
