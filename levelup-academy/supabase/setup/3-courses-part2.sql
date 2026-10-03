-- Paste into Supabase SQL Editor and click Run. Part 2 of 3 of the course content.
begin;

insert into public.courses (id, slug, title, subtitle, description, category, icon, position, is_published)
values ('45a989a0-17c5-dd7c-070f-e4341a0553fc', 'dropshipping-and-ecommerce', 'Dropshipping and E-commerce', 'Research products, verify suppliers, build a store, price for profit, fulfil orders and market, knowing the risks.', 'A realistic, step-by-step guide to starting an online store, including dropshipping. Covers product research, supplier verification, store setup, product pages, margin calculations, fulfilment, customer service, organic and paid marketing, and profit tracking. Many new stores lose money, and this course shows you how to test cheaply and limit that risk.', 'Dropshipping & E-commerce', 'cart', 4, true)
on conflict (id) do update set slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle,
  description = excluded.description, category = excluded.category, icon = excluded.icon,
  position = excluded.position, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('0c88cf39-de19-51f0-5e0a-25a1722e3e7c', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'How e-commerce works', 'Understand the main online-selling business models, the money flow of an order, and the realistic risks.', 1, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('c6360b4d-33bc-41b8-5b76-297c7bbd11f5', '0c88cf39-de19-51f0-5e0a-25a1722e3e7c', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'how-e-commerce-works', 'How e-commerce works', 'Understand the main online-selling business models, the money flow of an order, and the realistic risks.', 25, 1, true, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('c6360b4d-33bc-41b8-5b76-297c7bbd11f5', $md$## Goal

Understand how an online order flows from customer to supplier, where costs come from, and which business model fits your budget and risk tolerance.

## Prerequisites

- None.
- Startup cost: **$0** for this lesson.

## Step-by-step instructions

1. **Learn the main models:**
   - **Dropshipping:** you sell, a supplier ships directly to the customer. Low upfront inventory cost, lower margins, less control over quality and shipping.
   - **Wholesale or inventory:** you buy stock upfront and ship yourself or through a fulfilment centre. More cash at risk, more control.
   - **Print-on-demand:** products are printed when ordered. Low risk, but margins vary.
   - **Handmade or own brand:** you make or commission the product. Highest control, more work.
2. **Follow the money of one order:**
   1. The customer pays you (minus payment processing fees).
   2. You pay the supplier for the product and shipping.
   3. You pay platform fees and apps.
   4. You've usually already paid for marketing to get that customer.
   5. Refunds and chargebacks reduce profit.
3. **Understand your responsibilities.** Even if a supplier ships, **you** are the seller. Customers will hold you responsible for delivery times, quality, refunds and following consumer protection laws.
4. **Know the realistic risks:**
   - ad spend that doesn't produce sales;
   - unreliable suppliers;
   - long shipping times leading to refunds;
   - chargebacks;
   - account suspensions on ad platforms or payment processors.
   Many stores never become profitable. Start small and test cheaply.
5. **Set a maximum test budget** you can afford to lose completely, and write it down.

## Tools and resources

- Shopify's e-commerce guides: https://www.shopify.com/blog
- Competition Bureau Canada, consumer protection basics: https://competition-bureau.canada.ca

## Practical example

**One order of a $35 phone stand:**

| Line | Amount |
|---|---|
| Customer pays | $35.00 |
| Payment fee (about 3%) | −$1.05 |
| Product + shipping from supplier | −$14.00 |
| Apps and platform share (estimated) | −$1.50 |
| Average ad cost to get this sale | −$15.00 |
| **Profit** | **$3.45**, before any refunds |

One refund wipes out several orders of profit. This is why margins and ad costs matter so much.

## Expected costs

None for this lesson. Typical store startup costs are covered in later lessons.

## How this earns revenue

You earn the difference between what customers pay and all your costs. Profit depends on product choice, pricing, supplier reliability, marketing efficiency and customer service. It is never guaranteed.

## Common mistakes

- **Believing "passive income" claims.** Stores require ongoing work.
- **Ignoring ad costs** in profit calculations.
- **Selling products you can't legally sell,** such as counterfeits, trademarked designs or restricted items.

## Action checklist

- [ ] Choose a business model to explore.
- [ ] Write your maximum test budget.
- [ ] Recreate the order profit table with your own estimates.

## Next steps

Continue to **Understanding dropshipping**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('492c7c1c-b3f0-116e-5321-f6b451237e79', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'Understanding dropshipping', 'How dropshipping actually works, its pros and cons, legal responsibilities, and when to choose another model.', 2, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('ea6ab8fe-458c-d4ad-7c48-d7f53721388d', '492c7c1c-b3f0-116e-5321-f6b451237e79', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'understanding-dropshipping', 'Understanding dropshipping', 'How dropshipping actually works, its pros and cons, legal responsibilities, and when to choose another model.', 25, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('ea6ab8fe-458c-d4ad-7c48-d7f53721388d', $md$## Goal

Decide whether dropshipping suits you, and understand your obligations as the seller.

## Prerequisites

- *How e-commerce works*.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Learn the order process:**
   1. The customer orders on your store.
   2. You (or an app) forward the order to the supplier and pay them.
   3. The supplier ships to the customer.
   4. You send tracking to the customer.
   5. You handle questions and refunds.
2. **Know the pros:** low upfront inventory cost, easy to test products, and you can run it from anywhere.
3. **Know the cons:** thin margins, slower shipping (especially overseas), quality control issues, heavy competition, and reliance on paid ads.
4. **Know your legal responsibilities** as the seller of record:
   - accurate product descriptions;
   - honest delivery estimates;
   - clear refund policies;
   - collecting and remitting sales taxes where required (GST/HST in Canada once registered);
   - product safety rules (for example Health Canada for consumer products).
5. **Avoid prohibited products:**
   - counterfeit or "replica" branded goods;
   - items infringing trademarks or copyrights;
   - unsafe children's products;
   - supplements or cosmetics with medical claims;
   - weapons and other restricted items.
   Payment processors and platforms ban these, and selling them can bring legal action.
6. **Consider alternatives:** domestic suppliers or wholesale for faster shipping, or print-on-demand for custom designs.

## Tools and resources

- Health Canada consumer product safety: https://www.canada.ca/en/health-canada/services/consumer-product-safety.html
- Shopify's Acceptable Use Policy: https://www.shopify.com/legal/aup

## Practical example

Two options for selling pet accessories:

- **(A)** An overseas dropshipping supplier with a 10–20 day delivery estimate.
- **(B)** A North American supplier with 3–7 day delivery and higher unit cost.

The student models both. Option B has lower margins but likely fewer delivery complaints and refunds, so they test B first.

## Expected costs

$0 to research.

## How this earns revenue

Profit is per-order margin minus marketing and refunds. Dropshipping's low inventory risk is offset by lower margins and higher ad dependency.

## Common mistakes

- **Promising fast shipping** that the supplier can't meet.
- **Selling branded knock-offs.**
- **Ignoring that you're legally the seller.**

## Action checklist

- [ ] List 3 pros and 3 cons for your situation.
- [ ] Read your intended platform's acceptable use policy.
- [ ] Decide: dropshipping, wholesale, or print-on-demand.

## Next steps

Continue to **Product research**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('4872db25-38a5-2ef9-4890-0b1f10e7f397', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'Product research', 'Find products with real demand, a reachable audience and healthy margins, and avoid saturated or risky items.', 3, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('02147fe0-eaf8-a868-7ff5-be0515e15a9f', '4872db25-38a5-2ef9-4890-0b1f10e7f397', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'product-research', 'Product research', 'Find products with real demand, a reachable audience and healthy margins, and avoid saturated or risky items.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('02147fe0-eaf8-a868-7ff5-be0515e15a9f', $md$## Goal

Create a shortlist of 5 products scored on demand, margin, competition and risk.

## Prerequisites

- Model chosen.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Start with an audience, not a product.** Pick a niche you understand, such as hikers, home bakers or new dog owners. Niche stores build trust better than random "general stores".
2. **List problems that audience has.** Read niche forums, Reddit, Amazon reviews and YouTube comments.
3. **Find products that solve those problems.** Look on supplier directories, Amazon best-seller lists, Etsy and TikTok.
4. **Check demand:**
   - Google Trends for steady or rising interest (avoid one-week fads);
   - marketplace review counts;
   - search interest.
5. **Check margin.** Can you sell at roughly 2.5–3× your landed cost (product + shipping) and still be competitive? Below that, ads often make it unprofitable.
6. **Check competition:** how many stores sell it, and at what price? Could you offer something better, such as a bundle, better content or faster shipping?
7. **Check risk:** fragile, sized (lots of returns), electrical (safety certification), regulated, or trademarked? Avoid for your first store.
8. **Score 10 products** from 1 to 5 on demand, margin, competition (5 = less), risk (5 = lower) and shipping. Keep the top 5.

## Tools and resources

- Google Trends: https://trends.google.com
- Amazon Best Sellers: https://www.amazon.ca/gp/bestsellers
- Reddit niche communities.

## Practical example

**Niche:** home bakers.

**Shortlist:** a reusable silicone baking mat set, a dough scraper and bench knife bundle, a proofing basket kit, cake decorating turntables, and a digital kitchen scale.

The kitchen scale was dropped because it's electrical, has high return risk and heavy competition. The proofing basket kit scored well: steady interest, light weight, giftable, and good for bundles.

## Expected costs

$0.

## How this earns revenue

Product choice is the biggest driver of e-commerce success. Good margins leave room for marketing costs and occasional refunds.

## Common mistakes

- **Chasing viral products** with no margin left after ads.
- **Choosing items with high return rates** (clothing sizes) for a first store.
- **Trademarked or licensed designs.**

## Action checklist

- [ ] Pick a niche and list 10 problems.
- [ ] Score 10 products.
- [ ] Keep the top 5 with notes.

## Next steps

Continue to **Evaluating suppliers**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('a66672b5-8336-1300-b55a-f5a11f5f78d2', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'Evaluating suppliers', 'Verify suppliers with test orders, written terms and red-flag checks before selling anything.', 4, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('e2f626d5-596d-2fd0-72a0-db02f274d98f', 'a66672b5-8336-1300-b55a-f5a11f5f78d2', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'evaluating-suppliers', 'Evaluating suppliers', 'Verify suppliers with test orders, written terms and red-flag checks before selling anything.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('e2f626d5-596d-2fd0-72a0-db02f274d98f', $md$## Goal

Shortlist and verify 2 suppliers for your top product, including a test order.

## Prerequisites

- Product shortlist.
- Startup cost: the cost of sample orders (often $20–$80).

## Step-by-step instructions

1. **Find candidate suppliers** through dropshipping apps connected to your store platform, wholesale directories, domestic wholesalers, or manufacturers' wholesale programs.
2. **Check legitimacy:**
   - business registration details;
   - years in operation;
   - reviews from other sellers;
   - clear contact information;
   - realistic prices (too cheap is a red flag);
   - secure payment methods.
3. **Ask written questions:**
   - processing time;
   - shipping methods and realistic delivery times to your customers;
   - tracking;
   - defect and return process;
   - minimum orders;
   - whether they can omit invoices or promotional inserts (blind shipping);
   - product safety certifications if relevant.
4. **Place a test order** shipped to your own address. Measure order-to-delivery time, packaging quality, product quality versus photos, and tracking accuracy.
5. **Take your own photos and videos** of the sample. These will be better and more honest than supplier images.
6. **Compare 2 suppliers** on cost, speed, quality and communication. Pick a primary and a backup.
7. **Red flags (stop if you see any):**
   - asks for payment only through untraceable methods;
   - no tracking;
   - refuses samples;
   - inconsistent answers;
   - sells branded goods at impossible prices (likely counterfeit).
8. **Record terms** in a supplier sheet: costs, shipping times, defect policy and contact.

## Tools and resources

- Your platform's supplier apps (search the Shopify App Store for "dropshipping").
- A supplier comparison spreadsheet.

## Practical example

**Proofing basket kit**, two suppliers:

| | Supplier A (overseas) | Supplier B (domestic) |
|---|---|---|
| Cost | Cheaper | Higher |
| Delivery | 16 days | 5 days |
| Packaging | Crushed | Good |
| Product | Matched photos | Matched photos |

Choice: B as primary, with A as a possible backup if packaging improves.

## Expected costs

Samples and shipping: typically tens of dollars per supplier.

## How this earns revenue

Reliable suppliers reduce refunds, chargebacks and bad reviews, which protects your margin and your ability to keep selling.

## Common mistakes

- **Never ordering a sample.**
- **Trusting supplier delivery estimates** without testing.
- **No backup supplier.**

## Action checklist

- [ ] Contact 3 suppliers with your questions.
- [ ] Place at least 1 test order.
- [ ] Fill in the supplier comparison sheet.

## Next steps

Continue to **Building an online store**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('b22a896e-32ac-651d-9301-1663b9c3a70d', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'Building an online store', 'Set up a store with the essential pages, payments, shipping settings, taxes and policies.', 5, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('c7b0db1d-6708-04fc-2c3d-cf73ccd24c7f', 'b22a896e-32ac-651d-9301-1663b9c3a70d', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'building-an-online-store', 'Building an online store', 'Set up a store with the essential pages, payments, shipping settings, taxes and policies.', 45, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('c7b0db1d-6708-04fc-2c3d-cf73ccd24c7f', $md$## Goal

Build a store ready for test traffic, with payments, shipping, taxes and policies configured.

## Prerequisites

- A verified supplier.
- Startup cost: platform subscription (many offer free trials), a domain (around US$10–$25 per year), and apps.

## Step-by-step instructions

1. **Choose a platform:** Shopify (most dropshipping apps), WooCommerce (WordPress), Wix or Squarespace commerce, or Etsy for handmade.
2. **Start the trial** and pick a clean, fast theme.
3. **Set up the essentials:**
   - store name and logo (simple text logo is fine);
   - domain;
   - payment provider;
   - currency.
4. **Configure shipping:** rates and zones, plus honest delivery estimates based on your test order.
5. **Configure taxes:** in Canada, register for GST/HST when required and set up tax collection. Get professional advice for your situation.
6. **Write policies:**
   - Refund and returns: number of days, condition, who pays return shipping, and how defective items are handled.
   - Shipping: processing and delivery times.
   - Privacy policy.
   - Terms of service.
   - Contact page with a real email.
   Platform templates are a starting point. Edit them to match reality.
7. **Install minimal apps:** your supplier integration, reviews (real reviews only), and email capture. Avoid app overload, which slows the store.
8. **Test checkout** with the platform's test mode, and place one real low-value order to yourself if possible.

## Tools and resources

- Shopify: https://www.shopify.com
- WooCommerce: https://woocommerce.com
- CRA GST/HST registration: https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses.html

## Practical example

**"Proof & Crumb"** on Shopify:

- a light theme;
- 3 products: the basket kit plus 2 bundles;
- shipping: free over a threshold, flat rate below, with a 3–7 business day estimate;
- a 30-day returns policy for unused items, with free replacement for defects.

The test order was successful.

## Expected costs

- Platform monthly fee after the trial.
- Domain.
- Apps (many have free tiers).
- Payment processing fees per order.

## How this earns revenue

The store is your sales channel. A trustworthy, fast store with honest policies converts visitors more effectively and reduces disputes.

## Common mistakes

- **Copying policies** that don't match your actual supplier terms.
- **Too many apps.**
- **No real contact details.**

## Action checklist

- [ ] Set up the store and theme.
- [ ] Configure shipping and taxes.
- [ ] Write and publish policies.
- [ ] Test checkout.

## Next steps

Continue to **Product pages and product photography**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('cb392ccb-191d-fec0-52e2-ad901ee801c0', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'Product pages and product photography', 'Write honest, persuasive product pages and take your own product photos with a phone.', 6, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('0ec382dc-196d-ebc7-b356-aba109df655f', 'cb392ccb-191d-fec0-52e2-ad901ee801c0', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'product-pages-and-product-photography', 'Product pages and product photography', 'Write honest, persuasive product pages and take your own product photos with a phone.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('0ec382dc-196d-ebc7-b356-aba109df655f', $md$## Goal

Create a complete product page with your own photos, clear benefits, specifications, FAQs and honest shipping information.

## Prerequisites

- A sample product in hand.
- Startup cost: $0–$40 (optional backdrop and light).

## Step-by-step instructions

1. **Photograph the sample:**
   - near a window with diffuse light;
   - on a plain background;
   - clean the lens first;
   - shoot the main shot, angles, a scale shot (in a hand), details, packaging and the product in use.
2. **Edit lightly:** crop square, adjust brightness, and keep colours true to the real product.
3. **Write the title:** product + key feature + variant, e.g. "Banneton Proofing Basket Kit, 9-inch Round, with Liner & Scraper".
4. **Write the description:**
   1. Who it's for and the problem it solves.
   2. 3–5 benefit bullets.
   3. What's included.
   4. Specifications (size, materials, care).
   5. Shipping and returns summary.
5. **Add FAQs** based on real questions (from reviews of similar products).
6. **Be honest:** no fake "only 2 left" timers, no fake reviews, no unverifiable claims, no medical claims.
7. **Optimise:** compressed images, descriptive alt text, a clear price and an obvious add-to-cart button.

## Tools and resources

- Your phone camera, Snapseed or Lightroom Mobile (free editing).
- Canva for simple lifestyle graphics.

## Practical example

The basket kit page has:

- 7 original photos: kit, contents, in-hand scale, dough proofing, a finished loaf;
- benefits: "beautiful spiral crust pattern", "linen liner prevents sticking";
- an FAQ: "What size loaf does it fit?";
- a delivery estimate based on the tested supplier timeline.

## Expected costs

$0 with a phone. Optional lights, backdrops and props cost tens of dollars.

## How this earns revenue

Clear, honest product pages raise conversion rates and reduce returns caused by mismatched expectations.

## Common mistakes

- **Only using supplier photos** that thousands of other stores also use.
- **Exaggerated claims.**
- **Hiding shipping times.**

## Action checklist

- [ ] Shoot 6+ photos of your sample.
- [ ] Write the full product page.
- [ ] Ask someone to read it and list any unanswered questions.

## Next steps

Continue to **Pricing, margins, and shipping costs**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('954cd3c2-25cd-14e3-8bd0-0a2538332757', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'Pricing, margins, and shipping costs', 'Calculate landed cost, contribution margin and break-even ad cost before you spend on marketing.', 7, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('a7ba847e-ebae-935c-5b57-d62d23bb4171', '954cd3c2-25cd-14e3-8bd0-0a2538332757', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'pricing-margins-and-shipping-costs', 'Pricing, margins, and shipping costs', 'Calculate landed cost, contribution margin and break-even ad cost before you spend on marketing.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('a7ba847e-ebae-935c-5b57-d62d23bb4171', $md$## Goal

Build a pricing spreadsheet that calculates your profit per order and the maximum you can spend on ads to get a sale.

## Prerequisites

- Supplier costs.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Landed cost** = product cost + supplier shipping + packaging or inserts.
2. **Variable fees** = payment processing (%) + platform transaction fees + app fees per order.
3. **Expected refund cost:** estimate a refund rate (start conservatively, e.g. 5%) × landed cost.
4. **Contribution margin** = price − landed cost − variable fees − expected refund cost.
5. **Break-even cost per acquisition (CPA)** = contribution margin. If ads cost more than this per sale, you lose money on each order.
6. **Test price points.** Compare competitors and consider bundles to raise average order value.
7. **Choose a shipping strategy:**
   - "Free shipping" built into the price.
   - Flat rate.
   - Free over a threshold.
   Make sure each option still covers costs.
8. **Recalculate monthly** as supplier prices, fees and ad costs change.

## Tools and resources

- Google Sheets.
- Your payment provider's fee page.

## Practical example

| Line | Amount |
|---|---|
| Price | $39 |
| Landed cost | $15.50 |
| Fees (3% + $0.30) | $1.47 |
| Expected refunds | $0.78 |
| **Contribution margin** | **about $21.25** |

Break-even CPA is about $21. A bundle at $59 raises the margin, which allows a higher ad cost per sale while staying profitable.

## Expected costs

$0.

## How this earns revenue

Knowing your break-even CPA tells you whether marketing is making or losing money. It's the most important number in a dropshipping store.

## Common mistakes

- **Ignoring refunds, fees or ad costs.**
- **Underpricing to compete,** leaving no margin.
- **Not recalculating** when costs change.

## Action checklist

- [ ] Build the pricing sheet.
- [ ] Calculate the margin and break-even CPA for each product.
- [ ] Decide your shipping strategy.

## Next steps

Continue to **Customer service and returns**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('eb535d8f-d278-a80e-eb03-30fd89da7501', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'Customer service and returns', 'Fulfil orders reliably, communicate proactively, and handle returns, refunds and disputes.', 8, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('3c5408aa-8f1c-6bb8-e2a3-79dd81daeb35', 'eb535d8f-d278-a80e-eb03-30fd89da7501', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'customer-service-and-returns', 'Customer service and returns', 'Fulfil orders reliably, communicate proactively, and handle returns, refunds and disputes.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('3c5408aa-8f1c-6bb8-e2a3-79dd81daeb35', $md$## Goal

Set up an order fulfilment routine and customer service templates that prevent and resolve problems.

## Prerequisites

- A live store.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Fulfil daily:**
   1. Check new orders.
   2. Confirm the supplier received them.
   3. Add tracking numbers when available.
   4. Flag delays.
2. **Send automatic order confirmation and shipping emails** with tracking.
3. **Communicate proactively:** if an order is delayed, email the customer before they ask.
4. **Respond within 24 hours** on business days. Keep templates for common questions.
5. **Handle returns by your policy.** Collect a photo for defects, offer a replacement or refund, and claim from the supplier per your agreement.
6. **Prevent chargebacks:**
   - clear store name on bank statements;
   - fast, polite responses;
   - refund when appropriate.
   Respond to disputes in your payment dashboard with evidence: tracking and messages.
7. **Track issues** in a sheet (order, issue, resolution, cost) to spot bad products or suppliers.

**Delay template:**

> Hi [Name], thanks for your order #[number]. Your package is on its way but is running about [X] days behind our estimate due to [reason]. Here's your tracking link: [link]. If it hasn't arrived by [date], reply and we'll make it right with a replacement or refund.

## Tools and resources

- Your platform's order dashboard.
- Gmail templates or a helpdesk app (free tiers exist).
- The payment provider's dispute centre.

## Practical example

An order was delayed 4 days. A proactive email led to no complaint. One basket arrived cracked: the customer sent a photo, a replacement was sent, and the supplier credited the cost per the agreed defect policy.

## Expected costs

Refunds and replacements. Your pricing sheet's refund allowance should cover these.

## How this earns revenue

Good service protects revenue by reducing refunds, chargebacks and bad reviews, and creates repeat customers.

## Common mistakes

- **Ignoring emails.**
- **Arguing with customers.**
- **No records of issues,** which hides problem suppliers.

## Action checklist

- [ ] Write 5 customer service templates.
- [ ] Set up order confirmation and shipping emails.
- [ ] Create an issue-tracking sheet.

## Next steps

Continue to **Organic marketing**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('3eb3eec9-7b74-16cd-8d55-1d83300ce1ca', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'Organic marketing', 'Use content, communities, email and SEO to get your first visitors and sales without paid ads.', 9, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('4b9a44d8-7ee8-766a-7dc3-a72d8f8bc480', '3eb3eec9-7b74-16cd-8d55-1d83300ce1ca', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'organic-marketing', 'Organic marketing', 'Use content, communities, email and SEO to get your first visitors and sales without paid ads.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('4b9a44d8-7ee8-766a-7dc3-a72d8f8bc480', $md$## Goal

Run a 30-day organic marketing plan to test whether people want your product before spending on ads.

## Prerequisites

- A live store and product photos and videos.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Pick 1–2 platforms** where your audience spends time. TikTok, Instagram Reels or YouTube Shorts suit visual products. Pinterest suits home, food and DIY.
2. **Create useful content,** not just ads:
   - tutorials (how to proof sourdough);
   - before and after;
   - common mistakes;
   - product demos in real use.
3. **Post consistently** for 30 days, for example 1 short video a day. Track views, profile visits and link clicks.
4. **Engage in communities** helpfully, following their rules. Don't spam links.
5. **Capture email addresses** with a genuine incentive, such as a free guide (a "Beginner's Sourdough Schedule" PDF). Follow anti-spam consent rules (CASL in Canada).
6. **Basic SEO:**
   - descriptive product titles;
   - a blog post or two answering niche questions;
   - submit your sitemap to Google Search Console.
7. **Review after 30 days:** which content brought clicks and sales? Double down on what worked.

## Tools and resources

- CapCut (free video editing): https://www.capcut.com
- Klaviyo or Mailchimp free tiers for email.
- Google Search Console.

## Practical example

Proof & Crumb posted daily 20-second baking tips. Most got low views; three "mistake" videos performed much better and drove most store visits. The email guide collected subscribers who received a welcome email series.

## Expected costs

$0, plus your time.

## How this earns revenue

Organic content can bring sales without ad spend, and tells you which messages resonate before you pay for ads. Results vary widely and take consistent effort.

## Common mistakes

- **Only posting product ads.**
- **Giving up after a week.**
- **Collecting emails** without consent or an unsubscribe option.

## Action checklist

- [ ] Plan 30 content ideas.
- [ ] Post daily and track the results.
- [ ] Set up email capture with a lead magnet.

## Next steps

Continue to **Paid advertising fundamentals**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('0931e71e-1f82-f820-d1e0-b1280b076935', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'Paid advertising fundamentals', 'Run small, controlled ad tests with strict budgets and stop rules, so you learn without big losses.', 10, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('cb55b931-481d-fe74-a403-e11a065e9034', '0931e71e-1f82-f820-d1e0-b1280b076935', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'paid-advertising-fundamentals', 'Paid advertising fundamentals', 'Run small, controlled ad tests with strict budgets and stop rules, so you learn without big losses.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('cb55b931-481d-fe74-a403-e11a065e9034', $md$## Goal

Plan and run a small ad test with a fixed budget, clear success metrics and stop rules.

## Prerequisites

- Break-even CPA calculated.
- Content that performed well organically.
- Startup cost: your test budget. Only spend what you can afford to lose.

## Step-by-step instructions

1. **Choose one platform** (Meta Ads, TikTok Ads or Google Shopping) and set up the business account and tracking pixel or conversion API using official guides.
2. **Set a total test budget and daily cap.** For example: a fixed amount over 7 days. Never put more on a card than you're prepared to lose.
3. **Use your best organic content** as ad creative: 3–5 variations.
4. **Define success metrics:**
   - cost per click;
   - add-to-cart rate;
   - **cost per purchase versus your break-even CPA.**
5. **Write stop rules,** e.g. "If spend reaches 2× break-even CPA with no purchase, pause the ad."
6. **Launch and don't fiddle** for 2–3 days unless a stop rule triggers.
7. **Analyse:** if the cost per purchase is above break-even, the product, offer, page or creative needs to change, or the product isn't viable. Many tests fail. That's the purpose of testing small.
8. **Follow ad policies:** no misleading claims, no fake scarcity, accurate landing pages. Violations can get your account banned.

## Tools and resources

- Meta Business Help Center: https://www.facebook.com/business/help
- TikTok Ads Manager help: https://ads.tiktok.com/help
- Google Merchant Center and Ads: https://ads.google.com

## Practical example

A 7-day test with 4 video variations:

- one creative produced add-to-carts but purchases cost more than break-even;
- the product page was improved with an FAQ and a bundle offer, and a second small test was run;
- the cost per purchase came closer to break-even but was still above it, so the decision was to keep testing organically before spending more.

## Expected costs

Your test budget is at risk and may be lost entirely. Ad platforms charge for clicks or impressions whether or not you get sales.

## How this earns revenue

Paid ads can scale sales **only** when your cost per purchase is reliably below your contribution margin. Otherwise every sale loses money.

## Common mistakes

- **Spending without knowing your break-even CPA.**
- **Increasing budget on unprofitable ads** hoping they'll improve.
- **Misleading ad claims.**

## Action checklist

- [ ] Write your test plan: budget, metrics, stop rules.
- [ ] Prepare 3–5 creatives.
- [ ] After the test, record the results and the decision.

## Next steps

Continue to **Tracking expenses and profitability**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('e854a820-d5d2-416f-1e4a-6a5f715996a4', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'Tracking expenses and profitability', 'Track every expense, calculate real monthly profit, and decide when to scale, fix or stop.', 11, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('057f9791-71bf-9101-327f-cc5831cc1ef3', 'e854a820-d5d2-416f-1e4a-6a5f715996a4', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'tracking-expenses-and-profitability', 'Tracking expenses and profitability', 'Track every expense, calculate real monthly profit, and decide when to scale, fix or stop.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('057f9791-71bf-9101-327f-cc5831cc1ef3', $md$## Goal

Set up a monthly profit and loss tracker for your store and a simple decision framework.

## Prerequisites

- Store data.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Record all revenue:** gross sales, discounts and refunds.
2. **Record all costs:**
   - cost of goods;
   - shipping;
   - payment fees;
   - platform subscription;
   - apps;
   - ad spend;
   - samples;
   - domain;
   - tools.
3. **Calculate monthly profit** = revenue − all costs.
4. **Track key metrics:**
   - conversion rate;
   - average order value;
   - cost per purchase;
   - refund rate;
   - repeat purchase rate.
5. **Save receipts** for taxes, and keep business and personal spending separate.
6. **Use a decision framework each month:**
   - **Scale:** profitable with stable metrics.
   - **Fix:** close to profitable, with a clear issue to improve.
   - **Stop:** unprofitable after reasonable tests with no clear fix, or problems with the supplier or product.
7. **Get tax advice** about business income, GST/HST and deductible expenses.

## Tools and resources

- Google Sheets.
- Wave accounting (free): https://www.waveapps.com

## Practical example

**Month 1:**

- Revenue: $1,240
- COGS + shipping: $520
- Fees: $45
- Platform + apps: $70
- Ads: $600
- Samples: $60
- **Profit: −$55**

Decision: **Fix.** Organic sales were profitable, but ads weren't. Pause ads, improve the bundle offer and keep the organic content going.

## Expected costs

$0 for tracking.

## How this earns revenue

You can't improve what you don't measure. Many sellers think they're profitable until they include every cost.

## Common mistakes

- **Only tracking revenue.**
- **Forgetting subscriptions.**
- **Not stopping** a losing product.

## Action checklist

- [ ] Build a monthly profit and loss sheet.
- [ ] Enter last month's numbers, or estimates.
- [ ] Make a Scale/Fix/Stop decision.

## Next steps

Continue to **Common beginner mistakes**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('e62ed98e-7ef3-d58b-5786-63c90002994f', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'Common beginner mistakes', 'A pre-launch and monthly review checklist of the mistakes that cost beginners the most money.', 12, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('ee5ff757-8114-d36f-2aa1-51e93d9043f2', 'e62ed98e-7ef3-d58b-5786-63c90002994f', '45a989a0-17c5-dd7c-070f-e4341a0553fc', 'common-beginner-mistakes', 'Common beginner mistakes', 'A pre-launch and monthly review checklist of the mistakes that cost beginners the most money.', 25, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('ee5ff757-8114-d36f-2aa1-51e93d9043f2', $md$## Goal

Audit your store against the most common costly mistakes and fix the issues you find.

## Prerequisites

- Previous lessons.
- Startup cost: **$0**.

## Step-by-step instructions

Go through each point and mark it ✅ or ❌, then fix every ❌.

1. **Product:** has demand evidence, healthy margin, low return risk, and isn't counterfeit, trademarked or regulated.
2. **Supplier:** test order completed, delivery time measured, backup supplier identified.
3. **Store:** fast, mobile-friendly, real contact info, honest delivery estimates, accurate policies.
4. **Product page:** original photos, clear specs, FAQ, no fake scarcity or reviews.
5. **Money:** pricing sheet complete, break-even CPA known, all costs tracked.
6. **Marketing:** organic testing before ads, ad budget capped with stop rules.
7. **Operations:** daily fulfilment routine, customer service templates, issue tracking.
8. **Legal and tax:** policies published, tax registration considered, privacy policy, email consent.
9. **Mindset:** a written maximum loss budget, decisions based on data, no "get rich quick" expectations.

## Tools and resources

- This checklist; save it as a document and repeat it monthly.

## Practical example

The audit found:

- a shipping estimate still showing the overseas supplier's times;
- no backup supplier;
- ads running without stop rules.

All three were fixed before spending more.

## Expected costs

$0.

## How this earns revenue

Avoiding these mistakes protects your budget and gives your store a fair chance of becoming profitable. Profitability is still not guaranteed.

## Common mistakes

- **Running the audit once and never again.**

## Action checklist

- [ ] Complete the audit.
- [ ] Fix every ❌.
- [ ] Schedule the audit monthly.

## Next steps

You've completed the e-commerce pathway. Run small tests, track every dollar, and make decisions with data. **Digital Marketing** and **Content Creation** pair well with this course.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.courses (id, slug, title, subtitle, description, category, icon, position, is_published)
values ('8adc5a51-69a8-ba94-8798-99f4b573834b', 'trading-and-investing-education', 'Trading and Investing Education', 'Learn market fundamentals, order types, charts, risk management and paper trading, with no profit promises.', 'An educational introduction to financial markets for beginners. Learn how stocks, ETFs, forex and crypto work, how brokers and orders work, how to read charts, how to manage risk and position size, what leverage really does, and how to practise with paper trading and evaluate strategies honestly. Trading can lose money, including your entire investment. This course is general education, not financial advice.', 'Trading & Investing Education', 'chart', 5, true)
on conflict (id) do update set slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle,
  description = excluded.description, category = excluded.category, icon = excluded.icon,
  position = excluded.position, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('e4e81932-258b-6eaf-79d6-b19a6401d31b', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'Understanding financial markets', 'What markets are, who participates, how prices move, and the essential risk warnings every beginner must understand.', 1, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('8acb2764-0ade-67c1-eb87-0d4428cf3fff', 'e4e81932-258b-6eaf-79d6-b19a6401d31b', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'understanding-financial-markets', 'Understanding financial markets', 'What markets are, who participates, how prices move, and the essential risk warnings every beginner must understand.', 30, 1, true, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('8acb2764-0ade-67c1-eb87-0d4428cf3fff', $md$> **Risk warning:** This course is general education, not personalised financial, investment, tax or legal advice. Trading and investing involve risk. You can lose some or all of your money, and with leverage you can lose more than you deposit. Past performance does not guarantee future results. Consider speaking with a registered professional about your own situation.

## Goal

Understand what financial markets are, why prices move, the difference between investing and trading, and the realistic risks involved.

## Prerequisites

- None.
- Startup cost: **$0**. You won't use real money in this course.

## Step-by-step instructions

1. **Learn what a market is:** a place where buyers and sellers agree on prices for assets, such as company shares, bonds, currencies or commodities.
2. **Know the participants:** individual (retail) investors, institutions (pension funds, banks), market makers who provide liquidity, and regulators who supervise the markets.
3. **Understand why prices move:** supply and demand, driven by company earnings, interest rates, economic data, news, sentiment and liquidity. Prices can move sharply and unpredictably.
4. **Investing versus trading:**
   - **Investing:** usually long-term ownership of diversified assets.
   - **Trading:** short-term buying and selling to profit from price changes.
   Research consistently shows that most short-term retail traders do not beat simple long-term diversified investing after costs. Treat any claim of "consistent profits" with suspicion.
5. **Learn the regulators.** In Canada, investment dealers are overseen by the Canadian Investment Regulatory Organization (CIRO) and provincial securities commissions. In the US, the SEC and FINRA. Check that any firm you use is registered.
6. **Set personal rules before any money is involved:**
   - emergency savings first;
   - no borrowed money;
   - never invest money you need in the short term.

## Tools and resources

- Get Smarter About Money (Ontario Securities Commission): https://www.getsmarteraboutmoney.ca
- Canadian Securities Administrators, check registration: https://www.aretheyregistered.ca
- Investor.gov (US SEC): https://www.investor.gov

## Practical example

Two people each have $1,000:

- **Alex** buys a diversified index ETF and holds it for years. Returns depend on the overall market and may be negative in some years.
- **Jordan** day-trades a single volatile stock based on social media tips, paying fees on many trades.

Neither outcome is guaranteed. Jordan's approach carries far higher risk and costs, and the odds of underperforming are high.

## Expected costs

$0 for this lesson. Real investing involves fees, spreads and taxes, covered later.

## How this earns revenue

Investing can produce returns through price appreciation, dividends or interest over time, and losses are always possible. Trading attempts to profit from short-term moves, and many traders lose money. **This course does not teach a way to earn guaranteed income.** It teaches you to understand markets and protect yourself.

## Common mistakes

- **Believing social media profit screenshots.**
- **Starting with real money before understanding the risks.**
- **Using unregistered platforms.**

## Action checklist

- [ ] Write your personal rules: emergency fund, maximum risk, no borrowing.
- [ ] Look up your country's regulator and registration search tool.
- [ ] Read one beginner article on Get Smarter About Money.

## Next steps

Continue to **Stocks, ETFs, forex, and cryptocurrency basics**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('149c0441-a762-5a61-2700-2bf56ed96156', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'Stocks, ETFs, forex, and cryptocurrency basics', 'What each asset class is, how it can gain or lose value, and its specific risks.', 2, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('64d13b7b-e0bf-4815-9944-9048bde48330', '149c0441-a762-5a61-2700-2bf56ed96156', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'stocks-etfs-forex-and-cryptocurrency-basics', 'Stocks, ETFs, forex, and cryptocurrency basics', 'What each asset class is, how it can gain or lose value, and its specific risks.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('64d13b7b-e0bf-4815-9944-9048bde48330', $md$> **Risk warning:** Educational content only, not financial advice. All assets discussed can lose value.

## Goal

Explain in your own words what stocks, ETFs, forex and cryptocurrencies are, and the main risks of each.

## Prerequisites

- *Understanding financial markets*.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Stocks (shares):** part-ownership of a company. Value can rise or fall with the company's prospects and the market. The company can go bankrupt and shares can become worthless. Some pay dividends.
2. **ETFs (exchange-traded funds):** funds that trade like stocks and hold a basket of assets, such as an index of hundreds of companies. They offer diversification, but still carry market risk. Check the management expense ratio (MER) and what the ETF actually holds.
3. **Bonds (briefly):** loans to governments or companies that pay interest. Prices move with interest rates and credit risk.
4. **Forex (currencies):** trading one currency against another, like USD/CAD. Usually traded with leverage by retail traders, which makes it very high risk.
5. **Cryptocurrency:** digital assets like Bitcoin. Highly volatile. Some are unregulated or poorly regulated. Exchanges can fail or be hacked, and scams are common. Prices can fall dramatically.
6. **Compare them in a table** of volatility, regulation, typical costs, diversification and complexity.
7. **Understand diversification:** spreading money across many assets reduces the impact of any single one failing. It does not eliminate risk.

## Tools and resources

- Get Smarter About Money, investment types: https://www.getsmarteraboutmoney.ca
- Investor.gov, investment products: https://www.investor.gov/introduction-investing/investing-basics/investment-products

## Practical example

| Asset | Example | Key risks |
|---|---|---|
| Stock | One tech company | Company-specific failure, volatility |
| ETF | Broad market index ETF | Market declines, fees |
| Forex | USD/CAD with leverage | Leverage, rapid moves |
| Crypto | Bitcoin | Extreme volatility, exchange and security risk, scams |

## Expected costs

$0.

## How this earns revenue

Assets may gain value or pay income (dividends, interest). They can also lose value. Knowing how each works helps you avoid products you don't understand.

## Common mistakes

- **Buying things you can't explain.**
- **Putting everything into one asset.**
- **Assuming crypto or forex is "easy money".**

## Action checklist

- [ ] Write a one-sentence definition of each asset.
- [ ] Look up one broad index ETF's holdings and MER.
- [ ] List 3 risks specific to crypto.

## Next steps

Continue to **How exchanges and brokers work**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('0e2fe445-1f3f-101b-2ac8-c6e5e15a3327', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'How exchanges and brokers work', 'Exchanges, brokers, account types and order types, plus how to check a platform is legitimate.', 3, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('040caad9-51a0-e83d-02ee-b93220c6726a', '0e2fe445-1f3f-101b-2ac8-c6e5e15a3327', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'how-exchanges-and-brokers-work', 'How exchanges and brokers work', 'Exchanges, brokers, account types and order types, plus how to check a platform is legitimate.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('040caad9-51a0-e83d-02ee-b93220c6726a', $md$> **Risk warning:** Educational content only. Verify every platform's registration before depositing money.

## Goal

Understand how orders reach the market, the main order types, and how to evaluate a broker.

## Prerequisites

- Previous lessons.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Exchanges** (such as the TSX or NYSE) match buyers and sellers. **Brokers** give you access to exchanges and hold your account.
2. **Learn the order types:**
   - **Market order:** buy or sell immediately at the best available price. The fill can differ from the last price shown (slippage).
   - **Limit order:** buy or sell only at your price or better. It may not fill.
   - **Stop (stop-loss) order:** becomes a market order when a price is reached. It can fill at a worse price in fast markets or gaps.
   - **Stop-limit:** becomes a limit order at the trigger. It may not fill at all.
3. **Bid, ask and spread:** the bid is the highest buyer price, the ask is the lowest seller price, and the gap between them is the spread, a hidden cost of trading.
4. **Account types in Canada:** non-registered, TFSA and RRSP, each with different tax treatment. Check CRA rules and contribution limits. Day-trading inside a TFSA can create tax issues.
5. **Evaluate a broker:**
   - registered with CIRO (Canada) or the relevant regulator;
   - investor protection coverage (CIPF in Canada);
   - fees;
   - available assets;
   - platform quality;
   - customer support.
6. **Use 2-factor authentication** and never share login codes.

## Tools and resources

- CIRO: https://www.ciro.ca
- CIPF: https://www.cipf.ca
- CRA, TFSA: https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html

## Practical example

A stock shows a bid of $20.00 and an ask of $20.05.

- A market buy fills around $20.05.
- A limit buy at $20.00 waits.
- A stop-loss at $18.00 may fill below $18 if the stock opens much lower after bad news (a gap).

## Expected costs

Commissions (some brokers are commission-free), spreads, currency conversion fees and account fees. Check each broker's fee schedule.

## How this earns revenue

None directly. Understanding orders helps you avoid costly execution mistakes.

## Common mistakes

- **Using market orders on thinly traded assets.**
- **Assuming a stop-loss guarantees your exit price.**
- **Using unregistered offshore brokers.**

## Action checklist

- [ ] Define all four order types in your own words.
- [ ] Check one broker's registration and CIPF membership.
- [ ] Compare the fee schedules of 2 brokers.

## Next steps

Continue to **Candlestick charts and market terminology**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('46dac905-f833-516f-0106-1a212d62962a', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'Candlestick charts and market terminology', 'Read candlestick charts, timeframes, volume, trends, support and resistance, and understand their limits.', 4, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('3862a360-6d5c-c240-baa4-b11e03837da1', '46dac905-f833-516f-0106-1a212d62962a', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'candlestick-charts-and-market-terminology', 'Candlestick charts and market terminology', 'Read candlestick charts, timeframes, volume, trends, support and resistance, and understand their limits.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('3862a360-6d5c-c240-baa4-b11e03837da1', $md$> **Risk warning:** Chart patterns do not predict the future reliably. Educational content only.

## Goal

Read a candlestick chart and describe what happened in the price, without treating patterns as guarantees.

## Prerequisites

- A free charting account (TradingView basic) or your broker's charts.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Open a chart** of a broad index ETF on a daily timeframe.
2. **Read a candle:**
   - the body runs between open and close;
   - wicks show the high and low;
   - green or white means close above open; red or black means close below.
3. **Change timeframes** (1 hour, daily, weekly) and notice how the picture changes.
4. **Add volume:** the number of shares traded. Big moves on high volume involve more participation.
5. **Identify the trend:**
   - **uptrend:** higher highs and higher lows;
   - **downtrend:** lower highs and lower lows;
   - **range:** sideways.
6. **Mark support and resistance:** price areas where the price previously reversed. They are zones, not exact lines, and they often break.
7. **Learn key terms:**
   - **volatility:** how much prices move;
   - **liquidity:** how easily you can trade;
   - **gap:** a jump between one close and the next open;
   - **moving average:** the average price over time;
   - **bull / bear:** rising / falling market.
8. **Practise describing, not predicting.** Write what happened ("price fell 8% over 3 days on high volume") rather than what "will" happen.

## Tools and resources

- TradingView (free tier): https://www.tradingview.com
- Investopedia dictionary: https://www.investopedia.com

## Practical example

On a daily chart of a broad index ETF, the student marks:

- a rising trend over 6 months;
- a support zone where price bounced twice;
- a large red candle on high volume after an interest rate announcement.

They note that the support later broke, which shows that levels are not guarantees.

## Expected costs

$0 with free tools.

## How this earns revenue

Chart reading is a descriptive skill used by many traders, but no chart pattern reliably produces profits. Use it to understand price history and to plan risk, not as a prediction machine.

## Common mistakes

- **Seeing patterns everywhere** (confirmation bias).
- **Ignoring the bigger timeframe.**
- **Treating indicators as signals that "work".**

## Action checklist

- [ ] Annotate one chart with trend, support/resistance and volume notes.
- [ ] Write 5 descriptive observations.
- [ ] Define 8 key terms.

## Next steps

Continue to **Risk management**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('2b4a619b-c50d-01af-f92f-c1891a7ef31f', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'Risk management', 'Decide how much you can afford to risk, set maximum losses, use stops and diversification, and protect your capital.', 5, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('9729cef6-784c-5aec-aea4-815f6c7d75ed', '2b4a619b-c50d-01af-f92f-c1891a7ef31f', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'risk-management', 'Risk management', 'Decide how much you can afford to risk, set maximum losses, use stops and diversification, and protect your capital.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('9729cef6-784c-5aec-aea4-815f6c7d75ed', $md$> **Risk warning:** Risk management reduces but does not eliminate the possibility of loss.

## Goal

Write a personal risk plan that limits how much you can lose per trade, per day and overall.

## Prerequisites

- Previous lessons.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Separate your money:** an emergency fund (often 3–6 months of expenses), long-term savings, and, if you choose, a small "learning" amount you could lose entirely without hardship.
2. **Set a per-trade risk limit.** Many educational sources use 1% or less of the trading account per trade as a common example. That means the loss if your exit is hit should be at most that amount.
3. **Set daily and monthly loss limits:** stop trading for the day or month if they're hit.
4. **Define exits before entering:** where you're wrong (the stop level) and where you'd take profit. Remember stops can slip in fast markets.
5. **Understand risk-to-reward:** compare potential loss to potential gain. A good ratio doesn't help if the probability is poor.
6. **Diversify** long-term investments across many holdings and asset types.
7. **Control emotions:**
   - no revenge trading after losses;
   - no increasing size to "win it back";
   - keep a journal.
8. **Write it down** as a one-page risk plan and follow it, starting in paper trading.

## Tools and resources

- A spreadsheet for the risk plan and journal.
- Get Smarter About Money, risk and return: https://www.getsmarteraboutmoney.ca

## Practical example

**Paper account:** $5,000. Rules:

- maximum risk 1% per trade ($50);
- daily loss limit 2% ($100);
- monthly loss limit 6% ($300).

After two losing paper trades of $50 each, the daily limit is reached, so trading stops for the day.

## Expected costs

$0.

## How this earns revenue

Risk management doesn't create profits. It limits damage so that mistakes and losing streaks don't wipe you out.

## Common mistakes

- **No stop or exit plan.**
- **Risking large portions on one idea.**
- **Moving stops further away** to avoid taking a loss.

## Action checklist

- [ ] Write your one-page risk plan.
- [ ] Define per-trade, daily and monthly loss limits.
- [ ] Commit to paper trading first.

## Next steps

Continue to **Position sizing**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('2d33dab0-7f34-80e2-ae39-ce303293e33f', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'Position sizing', 'Calculate how many shares or units to buy so a stop-out loses only your planned amount.', 6, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('2942c2f4-0118-4615-f1ae-f22ab201e3a0', '2d33dab0-7f34-80e2-ae39-ce303293e33f', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'position-sizing', 'Position sizing', 'Calculate how many shares or units to buy so a stop-out loses only your planned amount.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('2942c2f4-0118-4615-f1ae-f22ab201e3a0', $md$> **Risk warning:** Correct sizing does not prevent losses, gaps or slippage. Educational content only.

## Goal

Calculate a position size from your account size, risk percentage, entry and stop.

## Prerequisites

- A risk plan.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Choose the risk amount** = account size × risk %. Example: $5,000 × 1% = $50.
2. **Determine the risk per share** = entry price − stop price (for a long position). Example: $40 − $38 = $2.
3. **Position size** = risk amount ÷ risk per share. Example: $50 ÷ $2 = 25 shares.
4. **Check the total cost:** 25 × $40 = $1,000. Make sure it's affordable and not over-concentrated.
5. **Add costs:** commissions, spreads and currency conversion slightly increase actual risk.
6. **Consider gaps:** if price opens far below the stop, the loss can exceed the plan. Volatile assets need smaller sizes.
7. **Build a calculator sheet** with inputs for account, risk %, entry and stop, and outputs for shares and capital used.

## Tools and resources

- A spreadsheet.
- Your broker's paper trading platform.

## Practical example

| Input | Value |
|---|---|
| Account | $5,000 |
| Risk | 1% = $50 |
| Entry | $12.50 |
| Stop | $11.90 (risk $0.60 per share) |

Size = 83 shares, about $1,038 of capital. In paper trading, an overnight gap filled the stop at $11.60, so the loss was about $75 instead of $50. That's a useful lesson about gap risk.

## Expected costs

$0.

## How this earns revenue

Position sizing doesn't make money. It keeps your losses consistent with your plan.

## Common mistakes

- **Sizing by "how confident I feel".**
- **Ignoring gaps and fees.**
- **Using all your capital on one position.**

## Action checklist

- [ ] Build the position size calculator.
- [ ] Calculate 5 example positions.
- [ ] Note the extra risk from gaps.

## Next steps

Continue to **Understanding leverage and margin**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('087aab8f-e5fe-85b3-e11a-59b3776eaa4e', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'Understanding leverage and margin', 'How margin and leverage magnify gains and losses, margin calls, and why beginners should avoid them.', 7, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('b327f9c7-ecc2-0f1a-4f00-c85dd9bbfd33', '087aab8f-e5fe-85b3-e11a-59b3776eaa4e', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'understanding-leverage-and-margin', 'Understanding leverage and margin', 'How margin and leverage magnify gains and losses, margin calls, and why beginners should avoid them.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('b327f9c7-ecc2-0f1a-4f00-c85dd9bbfd33', $md$> **Risk warning:** Leverage magnifies losses. You can lose more than your initial deposit. Many retail leveraged traders lose money.

## Goal

Understand how leverage works mathematically and why it greatly increases risk.

## Prerequisites

- Position sizing.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Margin** means borrowing from your broker to buy more than your cash allows. **Leverage** is the ratio of position size to your own money.
2. **Do the maths:**
   - With 1:1 (no leverage), a 10% price drop = 10% loss of your money.
   - With 5:1, a 10% drop = 50% loss.
   - With 10:1, a 10% drop = 100% loss, or more after fees.
3. **Margin calls:** if your account falls below the required level, the broker can demand more money or close your positions automatically, often at bad prices.
4. **Other leveraged products:** CFDs (restricted in some jurisdictions), options, futures and leveraged ETFs, each with complex risks. Leveraged ETFs can lose value over time even if the underlying index is flat.
5. **Interest costs:** borrowed money costs interest, which reduces returns.
6. **A beginner rule:** many educators recommend no leverage until you have long, consistent experience with a tested process, and even then only with strict limits.

## Tools and resources

- Investor.gov, margin: https://www.investor.gov/introduction-investing/investing-basics/glossary/margin-account
- Get Smarter About Money, leverage: https://www.getsmarteraboutmoney.ca

## Practical example

$1,000 of your own money with 10:1 leverage controls $10,000 of currency.

- A 2% adverse move = $200 loss = 20% of your money.
- A 10% adverse move would wipe out the entire $1,000 and could leave a negative balance on some platforms.

## Expected costs

Margin interest and fees, plus the potential for losses larger than your deposit.

## How this earns revenue

Leverage can amplify gains, which is why it's marketed heavily, but it amplifies losses equally or more after costs. It does not improve your odds.

## Common mistakes

- **Using maximum leverage offered.**
- **Not understanding margin call rules.**
- **Holding leveraged ETFs long-term** without understanding decay.

## Action checklist

- [ ] Calculate the loss at 1:1, 5:1 and 10:1 for a 5% move.
- [ ] Read your broker's margin call policy.
- [ ] Write a personal leverage rule.

## Next steps

Continue to **Trading fees and taxes**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('20733a06-6bb3-99a2-0c04-33b15cd0a529', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'Trading fees and taxes', 'All the costs that reduce returns, and the basics of how investment gains are taxed in Canada.', 8, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('c289ea53-f109-cc28-41b5-517e46b5cab8', '20733a06-6bb3-99a2-0c04-33b15cd0a529', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'trading-fees-and-taxes', 'Trading fees and taxes', 'All the costs that reduce returns, and the basics of how investment gains are taxed in Canada.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('c289ea53-f109-cc28-41b5-517e46b5cab8', $md$> **Risk warning and tax note:** General information only. Tax rules change and depend on your situation. Confirm with the CRA or a qualified tax professional.

## Goal

List every cost that affects your returns and understand the basics of investment taxation in Canada.

## Prerequisites

- Previous lessons.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Trading costs:** commissions, spreads, currency conversion (often significant for CAD↔USD), platform or data fees, and margin interest.
2. **Fund costs:** management expense ratios (MERs) on ETFs and funds, charged every year.
3. **Calculate the impact:** frequent trading multiplies costs. Track them in your journal.
4. **Canadian tax basics:**
   - **capital gains** on non-registered accounts are taxed under CRA rules;
   - **dividends and interest** are taxed differently;
   - TFSA growth is generally tax-free, but frequent trading in a TFSA may be considered business income;
   - RRSP contributions are deductible and withdrawals are taxed.
   Rules and inclusion rates can change. Check the CRA's current guidance.
5. **Business income versus capital gains:** frequent, short-term trading may be treated as business income, which is fully taxable. It depends on the facts.
6. **Keep records:** every trade's date, price, quantity, fees and currency. You'll need your adjusted cost base (ACB).
7. **Ask a professional** before trading actively.

## Tools and resources

- CRA, capital gains: https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains.html
- CRA, TFSA: https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html

## Practical example

20 round-trip trades in a month with currency conversion on each:

- commissions, conversion fees and spreads added up to a meaningful percentage of a small account;
- that's before any tax.

The same money held in one diversified ETF had only the yearly MER.

## Expected costs

The fees listed above. Tax depends on your situation.

## How this earns revenue

Lower costs mean you keep more of any returns. High costs can turn small gains into losses.

## Common mistakes

- **Ignoring currency conversion fees.**
- **No trade records.**
- **Assuming the TFSA makes all trading tax-free.**

## Action checklist

- [ ] List the full fee schedule for your broker.
- [ ] Create a trade records template including ACB.
- [ ] Read the CRA capital gains page.

## Next steps

Continue to **Long-term investing versus short-term trading**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('d3760098-0545-e41a-ce34-ff657bc0e9d4', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'Long-term investing versus short-term trading', 'Compare long-term diversified investing with active trading on cost, time, risk and evidence.', 9, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('c332d0de-44cb-25af-1361-ebeb0a065651', 'd3760098-0545-e41a-ce34-ff657bc0e9d4', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'long-term-investing-versus-short-term-trading', 'Long-term investing versus short-term trading', 'Compare long-term diversified investing with active trading on cost, time, risk and evidence.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('c332d0de-44cb-25af-1361-ebeb0a065651', $md$> **Risk warning:** Educational comparison, not a recommendation. Both approaches can lose money.

## Goal

Decide, based on evidence and your situation, which approach (or mix) fits your goals, time and risk tolerance.

## Prerequisites

- Previous lessons.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Define your goals and time horizon:** for example retirement in 30 years, a house in 5 years, or learning.
2. **Compare the approaches:**
   - **Long-term investing:** diversified, low-cost, low time commitment. Returns follow the broad market, which has had long declines in the past.
   - **Active trading:** high time commitment, higher costs, requires skill and discipline. Most retail traders underperform.
3. **Consider your time:** active trading requires hours of research and monitoring.
4. **Consider your behaviour:** can you follow rules after losses?
5. **Look at the evidence:** many studies find that most actively managed funds and retail traders underperform their benchmarks after fees over long periods. Read these from reputable sources.
6. **Write a policy statement:**
   - what percentage goes to long-term investing;
   - what (if anything) goes to learning trading;
   - your rules for both.
7. **Consider professional advice** for long-term financial planning.

## Tools and resources

- Get Smarter About Money, investing approaches: https://www.getsmarteraboutmoney.ca
- Investor.gov, compound interest calculator: https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator

## Practical example

**Policy statement:**

- Emergency fund first.
- Regular contributions to a diversified, low-cost portfolio for long-term goals.
- Active trading only in a paper account for 3 months, then possibly a very small learning account with strict rules, never money needed for goals.

## Expected costs

Depends on approach. Lower turnover generally means lower costs.

## How this earns revenue

Long-term investing aims for market returns over time, which are not guaranteed. Trading aims to beat the market, which most participants don't achieve.

## Common mistakes

- **Treating trading as a replacement for saving.**
- **No written policy.**
- **Switching approach after every loss.**

## Action checklist

- [ ] Write your goals and time horizons.
- [ ] Write your policy statement.
- [ ] Use the compound interest calculator with conservative assumptions.

## Next steps

Continue to **Paper trading and building a practice routine**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('4d974a26-943c-9cf5-23f9-ee6793b51373', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'Paper trading and building a practice routine', 'Practise with simulated money, keep a trading journal, and evaluate a strategy honestly before risking capital.', 10, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('c9434f19-5fed-d189-9bba-82eafd7e06b3', '4d974a26-943c-9cf5-23f9-ee6793b51373', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'paper-trading-and-building-a-practice-routine', 'Paper trading and building a practice routine', 'Practise with simulated money, keep a trading journal, and evaluate a strategy honestly before risking capital.', 45, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('c9434f19-5fed-d189-9bba-82eafd7e06b3', $md$> **Risk warning:** Paper results usually look better than live results (no emotions, perfect fills). Educational content only.

## Goal

Run a 60-day paper trading routine with a written plan and journal, then evaluate the results honestly.

## Prerequisites

- A risk plan and position sizing calculator.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Open a paper trading account,** usually offered by brokers or charting platforms.
2. **Write a simple, testable plan:**
   - the market and timeframe;
   - setup conditions;
   - entry rule;
   - stop rule;
   - exit rule;
   - position size rule.
   If you can't write it down, you can't test it.
3. **Trade only by the plan** for 60 days, sizing as if it were real money.
4. **Journal every trade:** date, asset, setup, entry, stop, exit, size, result, fees (estimated), screenshot, and emotional notes.
5. **Evaluate after at least 30–50 trades:**
   - win rate;
   - average win versus average loss;
   - expectancy = (win rate × average win) − (loss rate × average loss);
   - maximum drawdown;
   - whether results hold after realistic fees and slippage.
6. **Beware of small samples and overfitting.** A strategy that looks great over 20 trades may just be luck.
7. **Decide:** continue paper trading, adjust (and restart the count), or stop. Do not move to real money unless results are consistent over a meaningful sample, and even then use tiny sizes.

## Tools and resources

- Your broker's paper trading feature, or TradingView's paper trading.
- A journal template (spreadsheet).

## Practical example

**After 40 paper trades:**

- win rate 45%;
- average win $60, average loss $50;
- expectancy = (0.45 × 60) − (0.55 × 50) = $27 − $27.50 = **−$0.50 per trade** before fees.

Conclusion: **not viable as written.** Keep learning. Do not go live.

## Expected costs

$0.

## How this earns revenue

Paper trading costs nothing and reveals whether a plan has a positive expectancy before any money is at risk. Most plans don't, and finding that out on paper is a win.

## Common mistakes

- **Breaking your plan in paper trading** "because it's not real".
- **Going live after a short winning streak.**
- **Changing rules mid-test.**

## Action checklist

- [ ] Open a paper account.
- [ ] Write your plan.
- [ ] Journal 30+ trades.
- [ ] Calculate expectancy and drawdown.

## Next steps

Continue to **Common trading mistakes**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('886d059b-5fe5-b0af-7819-b87cb81483b3', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'Common trading mistakes', 'The behavioural and practical mistakes that cause most trading losses, and how to guard against them.', 11, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('712afb49-bdab-392a-7422-0e8f341c024b', '886d059b-5fe5-b0af-7819-b87cb81483b3', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'common-trading-mistakes', 'Common trading mistakes', 'The behavioural and practical mistakes that cause most trading losses, and how to guard against them.', 25, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('712afb49-bdab-392a-7422-0e8f341c024b', $md$> **Risk warning:** Avoiding mistakes doesn't guarantee profits. Educational content only.

## Goal

Identify your personal risk of common mistakes and add guardrails to your trading plan.

## Prerequisites

- Paper trading started.
- Startup cost: **$0**.

## Step-by-step instructions

Review each mistake, check your journal for evidence of it, and write a guardrail.

1. **No plan:** trading on impulse. Guardrail: no trade without a written setup.
2. **Oversizing:** too much risk per trade. Guardrail: use the calculator every time.
3. **Moving stops:** turning small losses into big ones. Guardrail: stops only move to reduce risk.
4. **Revenge trading:** chasing losses. Guardrail: a daily loss limit, then stop.
5. **Overtrading:** too many trades and too many fees. Guardrail: a maximum trades per day.
6. **FOMO:** buying after big rises because of hype. Guardrail: a 24-hour wait rule for social media ideas.
7. **Leverage misuse.** Guardrail: no leverage in your first year.
8. **Ignoring costs and taxes.** Guardrail: journal fees.
9. **Strategy hopping.** Guardrail: test one plan over a meaningful sample.
10. **Following "gurus".** Guardrail: verify registration, ignore profit screenshots.

## Tools and resources

- Your trading journal.
- Get Smarter About Money, investor psychology articles.

## Practical example

A journal review showed 6 of 10 losing trades were taken outside the plan after a previous loss: revenge trading. The guardrail added was "after 2 losses in a day, close the platform."

## Expected costs

$0.

## How this earns revenue

Avoiding these mistakes reduces avoidable losses. It does not create an edge on its own.

## Common mistakes

- **Reading this list without checking your own journal.**

## Action checklist

- [ ] Review your journal for each mistake.
- [ ] Write 5 personal guardrails.
- [ ] Add them to your plan.

## Next steps

Finish with **Recognizing trading scams**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('d1d5c703-2c1f-2093-211e-be744ec68fc9', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'Recognizing trading scams', 'Spot the warning signs of investment and trading scams, verify registration, and know how to report fraud.', 12, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('9cdb82be-0619-09c4-0198-9aed222ae3b8', 'd1d5c703-2c1f-2093-211e-be744ec68fc9', '8adc5a51-69a8-ba94-8798-99f4b573834b', 'recognizing-trading-scams', 'Recognizing trading scams', 'Spot the warning signs of investment and trading scams, verify registration, and know how to report fraud.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('9cdb82be-0619-09c4-0198-9aed222ae3b8', $md$> **Risk warning:** If something promises high returns with little or no risk, treat it as a probable scam.

## Goal

Recognise common trading and crypto scams, verify any person or platform, and know where to report fraud.

## Prerequisites

- None.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Learn the red flags:**
   - guaranteed or unusually high returns;
   - pressure to act fast;
   - unregistered sellers;
   - requests for crypto or gift-card payments;
   - "account managers" who trade for you;
   - celebrity endorsements (often fake);
   - recovery services that promise to get your lost money back.
2. **Know the common scams:**
   - fake trading platforms showing fake profits that block withdrawals;
   - romance and "pig butchering" scams;
   - pump-and-dump groups;
   - signal groups selling "guaranteed" trades;
   - Ponzi schemes;
   - fake crypto apps and airdrops;
   - impersonation of real firms.
3. **Verify before you trust:**
   - Search the registration database (aretheyregistered.ca in Canada).
   - Check regulator warning lists.
   - Search the name plus "scam" or "complaint".
4. **Protect yourself:**
   - never share passwords or 2FA codes;
   - never install remote access software at someone's request;
   - never send money to "unlock" withdrawals.
5. **Report fraud:** in Canada, the Canadian Anti-Fraud Centre and your provincial securities regulator; your bank; and the platform involved.
6. **Help others:** share warning signs with friends and family.

## Tools and resources

- Check registration: https://www.aretheyregistered.ca
- Canadian Anti-Fraud Centre: https://antifraudcentre-centreantifraude.ca
- CSA investor alerts: https://www.securities-administrators.ca
- Investor.gov fraud: https://www.investor.gov/protect-your-investments/fraud

## Practical example

Someone on social media offers "guaranteed 20% monthly returns" through their platform and pressures you to deposit crypto today.

**Red flags:** a guarantee, unrealistic returns, pressure, a crypto payment request.

The registration search finds nothing. Don't engage. Report it.

## Expected costs

$0. Avoiding scams protects your money.

## How this earns revenue

This lesson protects you. Scams cause some of the largest losses beginners experience.

## Common mistakes

- **Trusting screenshots of profits.**
- **Paying "fees" to withdraw money.**
- **Paying "recovery services".**

## Action checklist

- [ ] Bookmark the registration search and fraud reporting sites.
- [ ] Write your personal "never do" list.
- [ ] Share the red flags with one friend or family member.

## Next steps

You've completed the trading and investing education pathway. Keep paper trading with your plan and journal, focus on long-term financial basics, and consider professional advice for personal decisions. Remember: no course, strategy or tool can guarantee profits.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.courses (id, slug, title, subtitle, description, category, icon, position, is_published)
values ('ba63ae70-077e-0326-69f5-31a98592a742', 'content-creation-and-digital-products', 'Content Creation and Digital Products', 'Choose a niche, create content consistently, grow an audience, and sell digital products and affiliate offers.', 'Build an audience with short-form video and AI-assisted workflows, then monetise it honestly through affiliate links, digital products like templates and guides, email lists and landing pages. Step-by-step, with realistic expectations.', 'Content & Digital Products', 'play', 6, true)
on conflict (id) do update set slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle,
  description = excluded.description, category = excluded.category, icon = excluded.icon,
  position = excluded.position, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('b42b6ea8-d076-3288-988e-64a44a7ded49', 'ba63ae70-077e-0326-69f5-31a98592a742', 'Finding a content niche', 'Choose a niche at the intersection of your knowledge, audience demand and monetisation options.', 1, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('6d0a2e0e-efeb-3872-5120-0e2a4011cf5a', 'b42b6ea8-d076-3288-988e-64a44a7ded49', 'ba63ae70-077e-0326-69f5-31a98592a742', 'finding-a-content-niche', 'Finding a content niche', 'Choose a niche at the intersection of your knowledge, audience demand and monetisation options.', 30, 1, true, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('6d0a2e0e-efeb-3872-5120-0e2a4011cf5a', $md$## Goal

Choose a specific content niche and write a one-sentence channel promise.

## Prerequisites

- A phone.
- Startup cost: **$0**.

## Step-by-step instructions

1. **List 10 topics** you know, enjoy or are actively learning: cooking on a budget, beginner fitness, spreadsheets, studying, gardening, local food spots, and so on.
2. **Check audience demand:** search each on YouTube, TikTok and Google Trends. Are people searching and watching? Are there active creators and comments asking questions?
3. **Check monetisation:** could this niche support affiliate products, digital products (templates, guides), sponsorships, or services?
4. **Narrow it:** "Fitness" becomes "15-minute home workouts for busy parents". Specific niches are easier to grow and monetise.
5. **Study 5 creators** in the niche. Note their formats, posting frequency, what gets the most engagement and what's missing.
6. **Write your channel promise:** "I help [audience] [achieve result] with [content type]."
7. **Choose a handle and profile:** consistent name across platforms, a clear bio stating your promise, and a simple profile image.

## Tools and resources

- Google Trends: https://trends.google.com
- YouTube and TikTok search.

## Practical example

Topics were narrowed to "Google Sheets tips for small business owners". There was demand (questions in comments, search interest) and clear monetisation: templates as digital products and affiliate links to tools.

Promise: *"I help small business owners save hours each week with simple Google Sheets systems."*

## Expected costs

$0.

## How this earns revenue

The niche determines who watches and what they'll buy. A niche with buyer intent (people trying to solve a problem) monetises more easily than pure entertainment. Audience growth and income are never guaranteed.

## Common mistakes

- **Too broad** ("lifestyle").
- **A niche with no clear monetisation.**
- **Copying a creator's exact style** instead of finding your angle.

## Action checklist

- [ ] Score 10 topics on knowledge, demand and monetisation.
- [ ] Write your channel promise.
- [ ] Set up consistent profiles on 1–2 platforms.

## Next steps

Continue to **Creating short-form videos**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('bda7c970-ec4c-f5f5-3d90-7cc626e58d3d', 'ba63ae70-077e-0326-69f5-31a98592a742', 'Creating short-form videos', 'Plan, script, film and edit short vertical videos with a phone using a repeatable format.', 2, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('e3d3a50b-cc0d-6299-02bf-cf54fb46e882', 'bda7c970-ec4c-f5f5-3d90-7cc626e58d3d', 'ba63ae70-077e-0326-69f5-31a98592a742', 'creating-short-form-videos', 'Creating short-form videos', 'Plan, script, film and edit short vertical videos with a phone using a repeatable format.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('e3d3a50b-cc0d-6299-02bf-cf54fb46e882', $md$## Goal

Produce 5 short-form videos using a repeatable script structure.

## Prerequisites

- A niche and a phone.
- Startup cost: **$0**. An optional phone tripod and light cost about $20–$50.

## Step-by-step instructions

1. **Use a proven structure:**
   - **Hook** (first 1–2 seconds): the problem or a surprising result.
   - **Value:** 3 quick steps or one clear tip.
   - **Payoff:** the result.
   - **Call to action:** follow, comment or get the free resource.
2. **Write 10 hooks:** "Stop doing X in Google Sheets", "This formula saved me an hour", "3 mistakes beginners make with…"
3. **Script briefly:** 60–120 words for a 30–45 second video.
4. **Set up filming:**
   - vertical 9:16;
   - eye-level phone;
   - face a window for light;
   - quiet room;
   - clean background.
   For screen tutorials, record your screen.
5. **Film in short takes.** It's easier to edit.
6. **Edit:**
   - cut pauses;
   - add on-screen captions (many people watch muted);
   - zoom on key moments;
   - use licensed music from the app's library only.
7. **Export and post** with a clear caption and 2–3 relevant hashtags.
8. **Batch:** film 5 videos in one session to stay consistent.

## Tools and resources

- CapCut: https://www.capcut.com
- Screen recording: built into iOS, Android, macOS (Cmd+Shift+5) and Windows (Win+G).

## Practical example

**Video:** "Auto-highlight overdue invoices in Google Sheets".

- Hook: "Your overdue invoices should turn red automatically."
- 3 steps on screen.
- Payoff: the sheet with red rows.
- CTA: "Free template in my bio".

The video is 38 seconds long, with captions.

## Expected costs

$0, plus optional gear.

## How this earns revenue

Short-form video builds reach and trust. Views alone rarely pay much, so income comes from directing viewers to products, affiliate links, services or sponsorships (later lessons).

## Common mistakes

- **Slow intros.**
- **No captions.**
- **Using copyrighted music.**
- **Posting inconsistently.**

## Action checklist

- [ ] Write 10 hooks.
- [ ] Script and film 5 videos in one session.
- [ ] Edit with captions and post them.

## Next steps

Continue to **AI-assisted content workflows**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('fd995e04-0a8e-5246-64c0-080fc8b468e7', 'ba63ae70-077e-0326-69f5-31a98592a742', 'AI-assisted content workflows', 'Use AI to brainstorm, outline, script and repurpose content faster, while keeping it original and accurate.', 3, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('ed5f94ce-3f39-0bf4-9fea-b24903d3e9df', 'fd995e04-0a8e-5246-64c0-080fc8b468e7', 'ba63ae70-077e-0326-69f5-31a98592a742', 'ai-assisted-content-workflows', 'AI-assisted content workflows', 'Use AI to brainstorm, outline, script and repurpose content faster, while keeping it original and accurate.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('ed5f94ce-3f39-0bf4-9fea-b24903d3e9df', $md$## Goal

Set up a weekly content workflow where AI speeds up ideation and scripting, and you add the expertise and personality.

## Prerequisites

- An AI assistant and a content niche.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Ideation:** prompt *"List 30 beginner questions people ask about [niche], grouped by topic."* Pick the ones you can answer well.
2. **Research and verify:** for any fact or how-to, test it yourself or confirm it with reliable sources.
3. **Outline:** ask AI to turn your notes into a hook → 3 points → payoff outline.
4. **Script in your voice:** give AI 3 of your past scripts as style examples. Edit the output heavily so it sounds like you.
5. **Captions and descriptions:** ask AI for 3 caption options and choose or edit one.
6. **Create a weekly rhythm:**
   - Monday: ideas.
   - Tuesday: scripts.
   - Wednesday: film.
   - Thursday: edit.
   - Friday: schedule.
7. **Disclose where required.** Follow platform rules on labelling AI-generated media (for example synthetic voices or images).

## Tools and resources

- ChatGPT, Claude or Gemini.
- Notion or Google Sheets as a content calendar.
- Platform AI disclosure rules (check each platform's help centre).

## Practical example

One prompt produced 30 Google Sheets questions; 12 became video ideas. The student filmed each tip working, so the content is accurate and original. AI drafts were edited to add personal shortcuts and mistakes the creator had made.

## Expected costs

$0, or about US$20 per month for a paid AI plan.

## How this earns revenue

AI lets you publish more consistently, which helps audience growth. Your expertise and authenticity are what make people trust you enough to buy.

## Common mistakes

- **Publishing unverified AI facts.**
- **Generic AI voice.**
- **Mass-producing low-value content.**

## Action checklist

- [ ] Generate 30 ideas and choose 12.
- [ ] Create a 1-week content calendar.
- [ ] Script 3 videos with the AI workflow and edit them heavily.

## Next steps

Continue to **Editing and repurposing content**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('094462df-f2fc-6f5d-e1ef-53327536c07b', 'ba63ae70-077e-0326-69f5-31a98592a742', 'Editing and repurposing content', 'Turn one piece of content into many formats across platforms, efficiently and natively.', 4, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('0f3a580d-7898-1756-416a-4e8b4a218db1', '094462df-f2fc-6f5d-e1ef-53327536c07b', 'ba63ae70-077e-0326-69f5-31a98592a742', 'editing-and-repurposing-content', 'Editing and repurposing content', 'Turn one piece of content into many formats across platforms, efficiently and natively.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('0f3a580d-7898-1756-416a-4e8b4a218db1', $md$## Goal

Turn one long or core piece of content into 5+ platform-native pieces.

## Prerequisites

- At least one finished video or article.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Start with a core piece:** a 5–10 minute YouTube tutorial or a detailed blog post.
2. **Clip it** into 3–5 short vertical videos, each with its own hook.
3. **Write a carousel:** turn the steps into 6–8 slides in Canva.
4. **Write a text post** for LinkedIn or X summarising the key lesson.
5. **Write an email** to your list with the tip and a link to the full video.
6. **Adapt to each platform:** native captions, aspect ratios and posting style. Remove other platforms' watermarks.
7. **Track performance** per platform and do more of what works.

## Tools and resources

- CapCut (clipping), Canva (carousels), and Buffer or Later (scheduling, free tiers).

## Practical example

One 8-minute tutorial, "Build a simple invoice tracker", became:

- 4 shorts (formulas, conditional formatting, dashboard, common mistake);
- one Instagram carousel;
- one LinkedIn post;
- one newsletter email.

## Expected costs

$0.

## How this earns revenue

Repurposing increases reach without proportionally increasing work, and drives more people toward your offers and email list.

## Common mistakes

- **Posting the same video with another platform's watermark.**
- **Not adapting captions and hooks.**

## Action checklist

- [ ] Choose one core piece.
- [ ] Create 5 repurposed pieces.
- [ ] Schedule them across a week.

## Next steps

Continue to **Growing an audience**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('e93b67a7-e03f-fe4c-3ae8-ac85b2b5911b', 'ba63ae70-077e-0326-69f5-31a98592a742', 'Growing an audience', 'Grow with consistency, analytics and community engagement, not shortcuts like buying followers.', 5, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('8c183968-0f1a-51ff-93d6-c96bf2612274', 'e93b67a7-e03f-fe4c-3ae8-ac85b2b5911b', 'ba63ae70-077e-0326-69f5-31a98592a742', 'growing-an-audience', 'Growing an audience', 'Grow with consistency, analytics and community engagement, not shortcuts like buying followers.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('8c183968-0f1a-51ff-93d6-c96bf2612274', $md$## Goal

Run a 30-day growth sprint with a posting schedule, engagement routine and analytics review.

## Prerequisites

- Content workflow in place.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Set a sustainable schedule** that you can keep for 30 days, such as 4 shorts a week.
2. **Optimise your profile:** a clear bio promise, a link to a free resource, and pinned best posts.
3. **Engage daily for 15 minutes:** reply to every comment, and leave thoughtful comments on related creators' posts.
4. **Turn questions into content:** comments are free ideas.
5. **Review analytics weekly:** watch time and retention, saves, shares and profile visits. Find your top 3 posts and why they worked.
6. **Collaborate:** duets, stitches, guest posts or co-videos with creators of similar size.
7. **Avoid shortcuts:** never buy followers or engagement. It breaks platform rules and ruins your analytics.

## Tools and resources

- Built-in analytics on each platform.
- A tracking sheet.

## Practical example

After 30 days of 4 posts a week, most videos had modest views, but "mistake" videos consistently had higher retention. The plan was adjusted to 50% mistake-style hooks, and replying to comments turned questions into 8 new video ideas.

## Expected costs

$0.

## How this earns revenue

An engaged audience is what makes later monetisation possible. Growth speed varies hugely, and many creators take months to gain traction.

## Common mistakes

- **Chasing trends unrelated to your niche.**
- **Ignoring analytics.**
- **Inconsistency.**
- **Buying followers.**

## Action checklist

- [ ] Commit to a 30-day schedule.
- [ ] Optimise your profile.
- [ ] Do the weekly analytics review.

## Next steps

Continue to **Affiliate marketing fundamentals**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('b2c74601-9a1b-9661-2ff8-414e02e3eb30', 'ba63ae70-077e-0326-69f5-31a98592a742', 'Affiliate marketing fundamentals', 'Recommend products you trust, disclose properly, and track affiliate earnings.', 6, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('630cb52a-2587-5227-ee68-82d4fcb77421', 'b2c74601-9a1b-9661-2ff8-414e02e3eb30', 'ba63ae70-077e-0326-69f5-31a98592a742', 'affiliate-marketing-fundamentals', 'Affiliate marketing fundamentals', 'Recommend products you trust, disclose properly, and track affiliate earnings.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('630cb52a-2587-5227-ee68-82d4fcb77421', $md$## Goal

Join one or two relevant affiliate programs and create properly disclosed content that recommends products honestly.

## Prerequisites

- An audience or content in progress.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Understand the model:** you share a tracked link, and if someone buys, the company pays you a commission. Terms vary by program.
2. **Choose products you've actually used** and that fit your niche.
3. **Apply to programs:** company affiliate pages, Amazon Associates, or networks such as Impact or ShareASale. Read the terms, including where you can post links and the payout thresholds.
4. **Disclose clearly:** in Canada, the Competition Bureau expects clear disclosure of material connections. In the US, the FTC requires it. Put "affiliate link" or "#ad" where people will see it, not buried.
5. **Create helpful content:** honest reviews (pros and cons), tutorials using the product, and comparisons.
6. **Place links** in your bio link page, video descriptions and emails, following each platform's rules.
7. **Track clicks and conversions** in the affiliate dashboard. Drop products that don't serve your audience.

## Tools and resources

- Competition Bureau Canada, influencer marketing guidance: https://competition-bureau.canada.ca
- FTC Endorsement Guides: https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews
- Amazon Associates: https://affiliate-program.amazon.com

## Practical example

The Sheets creator joined an affiliate program for a form-builder tool they use, and made a tutorial "Collect orders with a form that feeds Google Sheets". The disclosure was stated on screen and in the description. They also listed one downside honestly: the free tier has submission limits.

## Expected costs

$0.

## How this earns revenue

Commissions on purchases made through your links. Earnings depend on audience size, trust, relevance and program terms, and many creators earn little at first.

## Common mistakes

- **Hidden or missing disclosures.**
- **Promoting products you haven't used.**
- **Breaking program terms**, such as Amazon's rules about link use.

## Action checklist

- [ ] Choose 2 relevant products you use.
- [ ] Apply to their programs.
- [ ] Create one disclosed tutorial or review.

## Next steps

Continue to **Creating digital products**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('2fbb7bf7-75f6-8cc9-6b09-ff0d92cf5d0c', 'ba63ae70-077e-0326-69f5-31a98592a742', 'Creating digital products', 'Validate, create and package a digital product (template, guide or toolkit) that solves a specific problem.', 7, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('6e4a4c80-3897-a433-b89d-ab247a0c4af9', '2fbb7bf7-75f6-8cc9-6b09-ff0d92cf5d0c', 'ba63ae70-077e-0326-69f5-31a98592a742', 'creating-digital-products', 'Creating digital products', 'Validate, create and package a digital product (template, guide or toolkit) that solves a specific problem.', 45, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('6e4a4c80-3897-a433-b89d-ab247a0c4af9', $md$## Goal

Create and validate your first digital product.

## Prerequisites

- An audience or niche.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Find the problem:** look for repeated questions in comments and DMs, and struggles you've solved for yourself.
2. **Choose a format:**
   - template (spreadsheet, Notion, Canva);
   - checklist or guide (PDF);
   - toolkit (bundle);
   - mini-course (videos).
   Start small.
3. **Validate before building fully:**
   - post about the problem and offer a waitlist;
   - pre-sell to a few people at an early price;
   - or ask "Would a template for X help?" and gauge the response.
4. **Create a version 1:** focused, usable within 15 minutes, with clear instructions.
5. **Test it with 3–5 people** and fix any confusion.
6. **Package it:** a cover image, a "how to use" page, and a licence terms note (personal or commercial use).
7. **Set a price** based on value, comparable products and your audience.
8. **Prepare support:** an FAQ and a contact email.

## Tools and resources

- Google Sheets, Notion, Canva, and Google Docs (export to PDF).

## Practical example

Product: **"Small Business Invoice & Expense Tracker"** (a Google Sheets template).

- Validated with a waitlist post.
- Version 1: invoice log, auto-overdue highlighting, monthly summary, and a "start here" tab.
- 4 testers found 2 confusing labels, which were fixed.

## Expected costs

$0–$30 for tools.

## How this earns revenue

Digital products can be sold repeatedly without inventory. Sales depend on audience trust, product usefulness and marketing. There is no guaranteed number of sales.

## Common mistakes

- **Building for months without validating.**
- **Products that are too big or vague.**
- **No instructions.**

## Action checklist

- [ ] List 10 audience problems.
- [ ] Validate one idea.
- [ ] Build version 1 and test it with 3 people.

## Next steps

Continue to **Selling templates, guides, and other digital downloads**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('2baab18c-af10-39f7-9f8e-0ffec6fcad47', 'ba63ae70-077e-0326-69f5-31a98592a742', 'Selling templates, guides, and other digital downloads', 'Set up a storefront and checkout, deliver files automatically, and handle taxes and refunds.', 8, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('9fe0dfd9-3df5-0cc5-731f-f99bf9d362c3', '2baab18c-af10-39f7-9f8e-0ffec6fcad47', 'ba63ae70-077e-0326-69f5-31a98592a742', 'selling-templates-guides-and-other-digital-downloads', 'Selling templates, guides, and other digital downloads', 'Set up a storefront and checkout, deliver files automatically, and handle taxes and refunds.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('9fe0dfd9-3df5-0cc5-731f-f99bf9d362c3', $md$## Goal

Launch your digital product for sale with automatic delivery.

## Prerequisites

- A finished product.
- Startup cost: $0 (platform fees per sale apply).

## Step-by-step instructions

1. **Choose a platform:**
   - **Gumroad** or **Lemon Squeezy:** simple, and they handle some tax obligations as merchant of record (check current terms).
   - **Payhip, Etsy** (templates are popular), **Shopify** with digital download apps, or **Stan Store**.
2. **Create the product listing:**
   - a clear title;
   - who it's for;
   - what's included;
   - screenshots or a preview video;
   - the format and requirements (for example "requires a free Google account");
   - licence terms;
   - a refund policy.
3. **Upload files or a template copy link.** For Google Sheets, deliver a "make a copy" link.
4. **Test the purchase flow** yourself (many platforms allow test purchases or discount codes).
5. **Taxes:** understand who collects sales tax. In Canada, GST/HST may apply once you're registered. Get advice.
6. **Launch:**
   - announce to your email list and social channels;
   - make a demo video;
   - pin a post.
7. **Gather feedback and reviews** (real only) and improve the product.

## Tools and resources

- Gumroad: https://gumroad.com · Lemon Squeezy: https://www.lemonsqueezy.com · Payhip: https://payhip.com · Etsy: https://www.etsy.com

## Practical example

The tracker was listed on Gumroad with 4 screenshots, a 60-second demo, a clear "Google Sheets required" note, and a refund policy for technical issues. It was announced with a tutorial video and an email to the waitlist.

## Expected costs

Platform fees per sale (percentage plus fixed fee, which vary), and payment processing.

## How this earns revenue

Each sale delivers automatically, so the product keeps earning as long as you keep marketing it.

## Common mistakes

- **Unclear requirements,** which lead to refund requests.
- **No preview.**
- **Not testing delivery.**

## Action checklist

- [ ] Create the product listing.
- [ ] Test the purchase and delivery.
- [ ] Launch to your audience.

## Next steps

Continue to **Landing pages and email lists**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('79a3cce6-9db1-e23e-eff8-03a7fab8e10e', 'ba63ae70-077e-0326-69f5-31a98592a742', 'Landing pages and email lists', 'Build a lead magnet, a landing page and a welcome email sequence that turns followers into subscribers and customers.', 9, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('11c56b41-e5e1-e5b7-102b-cdd1cfd4131a', '79a3cce6-9db1-e23e-eff8-03a7fab8e10e', 'ba63ae70-077e-0326-69f5-31a98592a742', 'landing-pages-and-email-lists', 'Landing pages and email lists', 'Build a lead magnet, a landing page and a welcome email sequence that turns followers into subscribers and customers.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('11c56b41-e5e1-e5b7-102b-cdd1cfd4131a', $md$## Goal

Set up a free lead magnet, a landing page, and a 3-email welcome sequence.

## Prerequisites

- A niche and ideally a product.
- Startup cost: **$0** (free tiers).

## Step-by-step instructions

1. **Create a lead magnet:** a small, valuable freebie such as a checklist, mini-template or cheat sheet.
2. **Choose an email platform:** Kit (ConvertKit), MailerLite or Mailchimp free tiers.
3. **Build a landing page:**
   - a headline (the result);
   - 3 bullets on what they get;
   - an image of the freebie;
   - an email form;
   - a privacy note.
4. **Get consent properly:** follow CASL in Canada with express consent, identification and an unsubscribe link. Don't add people without permission.
5. **Write a 3-email welcome sequence:**
   1. Deliver the freebie plus a quick win.
   2. Share your story and a useful tip.
   3. Introduce your product or affiliate recommendation with a soft call to action.
6. **Link the landing page** in your bio and mention the freebie in content.
7. **Email regularly,** for example weekly, with a tip plus a link to new content.

## Tools and resources

- Kit: https://kit.com · MailerLite: https://www.mailerlite.com
- CASL guidance: https://crtc.gc.ca/eng/com500/faq500.htm

## Practical example

Lead magnet: **"10 Google Sheets formulas every small business needs"** (PDF).

The landing page was built on MailerLite. The welcome sequence ends with the tracker template offer. The weekly newsletter repurposes that week's video.

## Expected costs

Free tiers up to a subscriber limit, then monthly fees.

## How this earns revenue

Email is a channel you control, unlike social algorithms. Subscribers who trust you are more likely to buy products and use your affiliate links.

## Common mistakes

- **No consent or unsubscribe link.**
- **Only emailing when selling.**
- **Weak lead magnets.**

## Action checklist

- [ ] Create a lead magnet.
- [ ] Build the landing page.
- [ ] Write and automate the 3 welcome emails.

## Next steps

Continue to **Monetization options**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('ee0151e2-6208-6181-1321-4d3b5f9f2f97', 'ba63ae70-077e-0326-69f5-31a98592a742', 'Monetization options', 'Compare ad revenue, sponsorships, affiliates, products, services and memberships, and plan your mix.', 10, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('6fb876be-9b16-efc0-ef0d-3aef6e0d6881', 'ee0151e2-6208-6181-1321-4d3b5f9f2f97', 'ba63ae70-077e-0326-69f5-31a98592a742', 'monetization-options', 'Monetization options', 'Compare ad revenue, sponsorships, affiliates, products, services and memberships, and plan your mix.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('6fb876be-9b16-efc0-ef0d-3aef6e0d6881', $md$## Goal

Create a monetisation plan that matches your audience size and niche.

## Prerequisites

- Previous lessons.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Know the options:**
   - **Platform payouts or ad revenue:** eligibility thresholds apply, and payouts vary widely.
   - **Affiliate commissions.**
   - **Digital products.**
   - **Services:** coaching, consulting, done-for-you.
   - **Sponsorships:** brands pay for mentions, which needs a defined audience.
   - **Memberships or communities.**
2. **Match options to your stage:**
   - **Early:** affiliates, small digital products, services.
   - **Growing:** more products, sponsorships.
   - **Established:** memberships, bigger launches.
3. **Create a media kit** for sponsors: audience description, real stats (screenshots), content examples, and offered formats with prices.
4. **Pitch relevant brands** with a short, specific email. Disclose sponsored content clearly.
5. **Track income by source** monthly, and diversify so you don't rely on one platform.
6. **Plan the next 90 days:** one main monetisation focus plus one experiment.

## Tools and resources

- Canva media kit templates.
- Platform creator monetisation pages (YouTube Partner Program, TikTok, Instagram) for current eligibility rules.

## Practical example

**90-day plan:**

- Focus: sell the tracker template and build the email list.
- Experiment: offer a "Sheets setup" service for 3 local businesses.
- Create a media kit for later sponsorship pitches.

## Expected costs

$0.

## How this earns revenue

Combining several sources reduces risk. Income depends on audience size, trust, niche and effort, and many creators earn modest amounts, especially early on.

## Common mistakes

- **Relying only on platform payouts.**
- **Accepting sponsors that don't fit your audience.**
- **Inflating stats in media kits.**

## Action checklist

- [ ] Choose your 90-day monetisation focus.
- [ ] Draft a media kit with real stats.
- [ ] Set up income tracking by source.

## Next steps

You've completed the content and digital products pathway. Keep publishing consistently, grow your email list, and improve your products from real feedback.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

commit;
