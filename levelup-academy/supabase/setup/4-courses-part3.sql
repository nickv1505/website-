-- Paste into Supabase SQL Editor and click Run. Part 3 of 3 of the course content.
begin;

insert into public.courses (id, slug, title, subtitle, description, category, icon, position, is_published)
values ('3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'digital-marketing', 'Digital Marketing', 'Learn the core marketing skills businesses pay for, then package and sell them as a service.', 'Practical marketing fundamentals covering social media, SEO, copywriting, email, local business marketing, lead generation and analytics, followed by how to build a portfolio and sell marketing services to small businesses.', 'Digital Marketing', 'megaphone', 7, true)
on conflict (id) do update set slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle,
  description = excluded.description, category = excluded.category, icon = excluded.icon,
  position = excluded.position, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('64b744c2-63db-a9e8-9898-42ce07791d6d', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'Marketing fundamentals', 'Define the customer, the offer, the message and the channel, and write a one-page marketing plan.', 1, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('d1b735cb-02f5-7027-912b-3841cb2f89e2', '64b744c2-63db-a9e8-9898-42ce07791d6d', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'marketing-fundamentals', 'Marketing fundamentals', 'Define the customer, the offer, the message and the channel, and write a one-page marketing plan.', 30, 1, true, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('d1b735cb-02f5-7027-912b-3841cb2f89e2', $md$## Goal

Write a one-page marketing plan for a real or realistic small business.

## Prerequisites

- None.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Pick a business** to practise on, such as a local bakery, gym or dog walker.
2. **Define the customer:**
   - who they are;
   - what problem they have;
   - where they spend time online and offline;
   - what makes them hesitate to buy.
3. **Define the offer:** what's being sold, the price, and why it's better or different (the unique value).
4. **Write the core message:** "For [customer] who [problem], [business] offers [solution] so they can [result]."
5. **Map the funnel:**
   - **Awareness:** how they discover you.
   - **Consideration:** why they trust you.
   - **Conversion:** how they buy or book.
   - **Retention:** why they come back.
6. **Choose 2–3 channels** that fit the customer, such as Google Business Profile, Instagram and email.
7. **Set measurable goals,** for example "30 website enquiries per month", and how you'll track them.
8. **Put it on one page.**

## Tools and resources

- Google Docs.
- The free "Marketing Plan" template in Canva.

## Practical example

**Dog walker in Ottawa:**

- **Customer:** busy professionals with dogs, worried about trust and reliability.
- **Offer:** midday walks with GPS photo updates.
- **Channels:** Google Business Profile (people searching "dog walker near me"), Nextdoor or neighbourhood groups, and referral cards.
- **Goal:** 10 new trial walks per month, tracked via a booking form.

## Expected costs

$0.

## How this earns revenue

Businesses pay for marketing that brings customers. The plan is the foundation for any marketing service you sell: it shows you think about results, not just posts.

## Common mistakes

- **Starting with tactics** ("let's post on TikTok") before knowing the customer.
- **No measurable goal.**
- **Trying every channel at once.**

## Action checklist

- [ ] Complete a one-page plan for one business.
- [ ] Write the core message sentence.
- [ ] Define one measurable goal.

## Next steps

Continue to **Social media marketing**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('a19b4632-a112-ef46-e9e9-7e3ed2e0ffea', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'Social media marketing', 'Create a content strategy, calendar and posting system for a small business account.', 2, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('d2386be2-ba0f-5b65-fd49-f84f01d12215', 'a19b4632-a112-ef46-e9e9-7e3ed2e0ffea', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'social-media-marketing', 'Social media marketing', 'Create a content strategy, calendar and posting system for a small business account.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('d2386be2-ba0f-5b65-fd49-f84f01d12215', $md$## Goal

Build a 30-day social media content calendar and posting system for a business.

## Prerequisites

- A marketing plan.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Choose 1–2 platforms** based on the customer: Instagram or Facebook for local consumer businesses, LinkedIn for B2B, TikTok for younger audiences.
2. **Define 3–4 content pillars,** for example:
   - Educate (tips);
   - Show (behind the scenes);
   - Prove (real reviews and results, with permission);
   - Offer (promotions).
3. **Plan 30 days:** 3–5 posts per week mixing the pillars. Note the format (reel, carousel, photo), caption idea and call to action.
4. **Create content in batches:** photo or video sessions, plus Canva templates for consistent branding.
5. **Write captions:** a hook line, value, a call to action, and relevant hashtags or location tags.
6. **Schedule** with the native schedulers or a free tool.
7. **Engage:** reply to comments and messages within a day, and engage with local accounts.
8. **Review monthly:** reach, engagement, profile visits, link clicks and enquiries from social.

## Tools and resources

- Meta Business Suite (free scheduling for Facebook and Instagram): https://business.facebook.com
- Canva, and Buffer (free tier): https://buffer.com

## Practical example

**Bakery 30-day calendar:**

- Mon: tip (how to store bread).
- Wed: behind-the-scenes reel of a morning bake.
- Fri: weekend specials.
- Sun: a customer review graphic (real, with permission).

Everything was batched in a 2-hour monthly shoot.

## Expected costs

$0 with native tools.

## How this earns revenue

Businesses pay monthly for social media management: planning, content creation, posting and reporting. Results depend on the business, content quality and consistency.

## Common mistakes

- **Only posting promotions.**
- **No call to action.**
- **Inconsistent branding.**
- **Ignoring messages.**

## Action checklist

- [ ] Define the content pillars.
- [ ] Build the 30-day calendar.
- [ ] Create 5 template designs in Canva.

## Next steps

Continue to **Search engine optimization basics**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('b872cb50-f02f-d7a4-efe4-4eb03d66138e', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'Search engine optimization basics', 'Do keyword research, on-page SEO and local SEO so a business can be found on Google.', 3, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('895c6c9c-1914-a7a3-be3f-8b048e8bd1d9', 'b872cb50-f02f-d7a4-efe4-4eb03d66138e', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'search-engine-optimization-basics', 'Search engine optimization basics', 'Do keyword research, on-page SEO and local SEO so a business can be found on Google.', 45, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('895c6c9c-1914-a7a3-be3f-8b048e8bd1d9', $md$## Goal

Complete a basic SEO audit and improvement plan for a small business website.

## Prerequisites

- Access to a website (yours, a practice site, or a client's with permission).
- Startup cost: **$0**.

## Step-by-step instructions

1. **Set up Google Search Console** for the site to see search queries, clicks and indexing issues.
2. **Do keyword research:**
   - list the services plus the location ("emergency plumber Hamilton");
   - use Google autocomplete and "People also ask";
   - use free keyword tools for rough volumes.
3. **Map keywords to pages:** one main topic per page.
4. **On-page SEO:**
   - a unique title tag (around 50–60 characters);
   - a meta description;
   - one H1;
   - clear headings;
   - the keyword used naturally;
   - descriptive image alt text;
   - internal links;
   - a fast mobile page.
5. **Local SEO:**
   - complete the Google Business Profile (categories, services, hours, photos);
   - keep name, address and phone consistent across directories;
   - ask happy customers for honest reviews (never buy or gate reviews).
6. **Content:** add helpful pages answering real customer questions, such as FAQs and service area pages with genuine information.
7. **Technical basics:** HTTPS, a sitemap submitted, no broken links, and reasonable speed.
8. **Track monthly:** clicks and impressions in Search Console, calls and direction requests in the Google Business Profile.

## Tools and resources

- Google Search Console: https://search.google.com/search-console
- Google Business Profile: https://www.google.com/business/
- Google's SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide

## Practical example

**Plumber audit:**

- every page title was "Home";
- no service pages;
- the Google Business Profile was missing hours.

The plan:

1. Unique titles for every page.
2. Create 5 service pages with real details.
3. Complete the profile.
4. Start a review request card after each job.

## Expected costs

$0, plus optional paid SEO tools.

## How this earns revenue

Local businesses pay for SEO audits, setup projects and monthly SEO. SEO results take time and no ranking can be guaranteed, so never promise "#1 on Google".

## Common mistakes

- **Keyword stuffing.**
- **Fake reviews.**
- **Guaranteeing rankings.**
- **Ignoring the Google Business Profile.**

## Action checklist

- [ ] Run the audit checklist on one site.
- [ ] Write 5 improved title tags and meta descriptions.
- [ ] Create a Google Business Profile improvement list.

## Next steps

Continue to **Copywriting**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('eb164b30-d710-8af5-b2e2-49488eea69ff', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'Copywriting', 'Write clear, persuasive, honest copy for websites, ads and emails using proven frameworks.', 4, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('d3a26d50-e9e0-3865-3eb3-577ce4ddaa30', 'eb164b30-d710-8af5-b2e2-49488eea69ff', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'copywriting', 'Copywriting', 'Write clear, persuasive, honest copy for websites, ads and emails using proven frameworks.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('d3a26d50-e9e0-3865-3eb3-577ce4ddaa30', $md$## Goal

Rewrite a homepage hero section and a short ad using copywriting frameworks.

## Prerequisites

- Marketing fundamentals.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Research the customer's words:** read reviews (of the business and its competitors) and note the exact phrases customers use.
2. **Lead with the outcome:** "Fresh sourdough every morning, made in Leslieville" beats "Welcome to our bakery".
3. **Use a framework:**
   - **PAS:** Problem → Agitate → Solution.
   - **AIDA:** Attention → Interest → Desire → Action.
   - **Features → Benefits:** "GPS tracking" → "Know exactly when your dog was walked".
4. **Be specific:** numbers, details, timeframes. Only claim what's true and verifiable.
5. **One call to action** per section, and make it obvious ("Book a free trial walk").
6. **Edit ruthlessly:**
   - short sentences;
   - remove jargon;
   - read aloud;
   - check that it works on mobile.
7. **Follow advertising laws:** no false or misleading claims (the Competition Act in Canada), and substantiate claims like "best" or "fastest".

## Tools and resources

- Hemingway Editor: https://hemingwayapp.com
- Competition Bureau, deceptive marketing practices: https://competition-bureau.canada.ca

## Practical example

**Before:** "We are a dog walking company dedicated to excellence."

**After:** "Midday dog walks in Centretown, with a photo and GPS update after every walk. Book a free trial walk."

## Expected costs

$0.

## How this earns revenue

Copywriting is sold on its own (website copy, ads, emails) and makes every other marketing service more effective.

## Common mistakes

- **Vague superlatives.**
- **Talking about the business** instead of the customer.
- **Multiple competing calls to action.**
- **Unprovable claims.**

## Action checklist

- [ ] Collect 20 customer phrases from reviews.
- [ ] Rewrite one hero section.
- [ ] Write a 3-line ad using PAS.

## Next steps

Continue to **Email marketing**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('7e9f99d1-5004-bd04-523c-af89c0d9567e', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'Email marketing', 'Set up a compliant email list, a welcome sequence and a regular newsletter that drives repeat sales.', 5, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('7c8fdb66-af3c-7515-cf17-85cca830a2f3', '7e9f99d1-5004-bd04-523c-af89c0d9567e', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'email-marketing', 'Email marketing', 'Set up a compliant email list, a welcome sequence and a regular newsletter that drives repeat sales.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('7c8fdb66-af3c-7515-cf17-85cca830a2f3', $md$## Goal

Set up email marketing for a business: consent-based signup, a welcome email and a monthly newsletter template.

## Prerequisites

- Copywriting basics.
- Startup cost: **$0** (free tiers).

## Step-by-step instructions

1. **Choose a platform:** MailerLite, Mailchimp or Klaviyo (for e-commerce).
2. **Collect consent properly:**
   - signup forms with clear wording;
   - express consent;
   - business identification;
   - an unsubscribe link (CASL in Canada).
   Don't import contacts who haven't consented.
3. **Offer a reason to subscribe:** a first-order discount, a helpful guide, or early access.
4. **Write a welcome email:** thanks, what to expect, the best product or service, and a simple call to action.
5. **Create a monthly newsletter template:** one main story, one tip, one offer, and a footer with contact and unsubscribe.
6. **Segment simply:** new subscribers, customers, and lapsed customers.
7. **Measure:**
   - open rates (less reliable due to privacy features);
   - click rate;
   - conversions;
   - unsubscribes.
   Improve subject lines and content.

## Tools and resources

- MailerLite: https://www.mailerlite.com · Mailchimp: https://mailchimp.com · Klaviyo: https://www.klaviyo.com
- CASL: https://crtc.gc.ca/eng/com500/faq500.htm

## Practical example

**Bakery:** a signup form at the counter (tablet) and on the website, offering a free cookie with the first order.

- The welcome email introduces the weekend specials.
- The monthly newsletter has the seasonal menu, a storage tip, and a pre-order link for holidays.

## Expected costs

Free tiers up to a subscriber limit.

## How this earns revenue

Email drives repeat purchases at low cost. Businesses pay for setup and ongoing newsletter management.

## Common mistakes

- **Buying lists.**
- **No unsubscribe link.**
- **Only sending discounts,** which trains customers to wait for sales.

## Action checklist

- [ ] Create a free account and signup form.
- [ ] Write the welcome email.
- [ ] Design the newsletter template.

## Next steps

Continue to **Local business marketing**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('5be84d89-4a5a-4bd6-f9f7-6f5072120d2f', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'Local business marketing', 'Help local businesses win nearby customers with Google Business Profile, reviews, community and simple offers.', 6, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('e99da53d-873e-33fe-3223-fd378a640332', '5be84d89-4a5a-4bd6-f9f7-6f5072120d2f', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'local-business-marketing', 'Local business marketing', 'Help local businesses win nearby customers with Google Business Profile, reviews, community and simple offers.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('e99da53d-873e-33fe-3223-fd378a640332', $md$## Goal

Create a local marketing action plan for a neighbourhood business.

## Prerequisites

- SEO basics.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Optimise the Google Business Profile:**
   - correct categories;
   - services and products;
   - hours (including holidays);
   - real photos;
   - weekly updates or offers;
   - answers to common questions.
2. **Build a review system:**
   - ask every happy customer (QR code card, follow-up email);
   - reply to every review politely.
   Never offer incentives for positive reviews, and never post fake ones.
3. **Ensure listing consistency:** same name, address and phone on Apple Maps, Bing, Yelp and industry directories.
4. **Community marketing:** local Facebook or Nextdoor groups (follow the rules), sponsoring local events, and partnerships with complementary businesses.
5. **Use simple, measurable offers:** "Mention this post for a free coffee with any pastry". Track redemptions.
6. **Referral programs:** reward customers who refer friends, with clear and honest terms.
7. **Track:** profile calls, direction requests, website clicks and offer redemptions.

## Tools and resources

- Google Business Profile, Apple Business Connect (https://businessconnect.apple.com), Bing Places (https://www.bingplaces.com).

## Practical example

**A café's plan:**

1. Update the Google Business Profile weekly with the special.
2. QR review cards at the till.
3. A partnership with a nearby yoga studio for a "post-class latte" offer.
4. A monthly community board post.

Calls and direction requests are tracked monthly in the profile's insights.

## Expected costs

$0 to low (printing QR cards).

## How this earns revenue

Local businesses often lack time for marketing. A "Local Visibility" monthly package is a common, understandable service to sell.

## Common mistakes

- **Fake or incentivised reviews.**
- **Inconsistent listings.**
- **Not replying to reviews.**

## Action checklist

- [ ] Audit one business's Google Business Profile.
- [ ] Design a review request card.
- [ ] Write a 30-day local action plan.

## Next steps

Continue to **Lead generation**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('43f5754d-8b1c-0568-f199-e7b84b484387', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'Lead generation', 'Design simple lead-generation systems (offers, landing pages, forms and follow-up) for service businesses.', 7, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('5d4aae61-6017-26ad-3859-f3d9b1059780', '43f5754d-8b1c-0568-f199-e7b84b484387', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'lead-generation', 'Lead generation', 'Design simple lead-generation systems (offers, landing pages, forms and follow-up) for service businesses.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('5d4aae61-6017-26ad-3859-f3d9b1059780', $md$## Goal

Build a lead-generation system for a service business: an offer, a landing page, a form, and a follow-up process.

## Prerequisites

- Copywriting and email lessons.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Define a lead:** a person who requests a quote, books a call or downloads a guide, with their contact details.
2. **Create a low-friction offer:** a free estimate, a consultation or a checklist.
3. **Build a focused landing page:**
   - one offer;
   - benefits;
   - real proof;
   - a short form;
   - no distracting navigation.
4. **Connect the form** to email and a spreadsheet or CRM, and send an instant confirmation to the lead.
5. **Set up follow-up:**
   - contact within hours (speed matters);
   - a reminder sequence if there's no response.
6. **Drive traffic:** Google Business Profile, social posts, small paid tests, and referrals.
7. **Track:**
   - visitors → leads (conversion rate);
   - leads → customers;
   - cost per lead if using ads.

## Tools and resources

- Carrd or a website builder for landing pages.
- Tally or Google Forms.
- HubSpot free CRM: https://www.hubspot.com/products/crm

## Practical example

**Window cleaner:**

- Offer: "Free same-week quote."
- A landing page with photos of real jobs and a 4-field form.
- Leads go to a Google Sheet and a text notification.
- The owner calls within 2 hours.

Conversion was tracked weekly.

## Expected costs

$0–$20 per month for tools, plus optional ad spend.

## How this earns revenue

Businesses value leads directly. You can charge for building lead systems and managing them monthly. Pay-per-lead arrangements exist, but need clear written agreements.

## Common mistakes

- **Long forms.**
- **Slow follow-up.**
- **Not tracking where leads come from.**

## Action checklist

- [ ] Build one landing page with a form.
- [ ] Set up the confirmation and notification.
- [ ] Create a lead tracking sheet.

## Next steps

Continue to **Analytics and conversion tracking**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('2abf24ad-3390-f801-b8cf-f63a6774bb22', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'Analytics and conversion tracking', 'Set up analytics, define conversions, and produce a simple monthly report a business owner understands.', 8, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('62931877-7711-2c55-ffc2-07d21512983d', '2abf24ad-3390-f801-b8cf-f63a6774bb22', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'analytics-and-conversion-tracking', 'Analytics and conversion tracking', 'Set up analytics, define conversions, and produce a simple monthly report a business owner understands.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('62931877-7711-2c55-ffc2-07d21512983d', $md$## Goal

Install analytics, track key conversions, and create a one-page monthly report.

## Prerequisites

- A website.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Choose analytics:** Google Analytics 4 (free) or a privacy-focused tool (Plausible, Fathom).
2. **Install it** via the site builder's integration or a tag. Respect consent requirements where the business operates.
3. **Define conversions:** form submissions, phone clicks, bookings and purchases. Set them up as key events.
4. **Use UTM links** for campaigns (emails, social bios) to see which channel drove visits. Use Google's Campaign URL Builder.
5. **Check data quality:** test each conversion yourself and confirm it appears.
6. **Build a monthly report** with:
   - visitors;
   - top channels;
   - conversions by channel;
   - top pages;
   - what changed;
   - next month's actions.
   Keep it to one page.
7. **Explain insights in plain English:** "Most enquiries came from Google Maps. Let's add more photos to the profile."

## Tools and resources

- Google Analytics: https://analytics.google.com
- Campaign URL Builder: https://ga-dev-tools.google/campaign-url-builder/
- Looker Studio (free dashboards): https://lookerstudio.google.com

## Practical example

**Landscaper report:**

- 1,200 visits; 38 form leads.
- 60% of leads came from Google organic or Maps.
- The "Spring cleanup" page converted best.

Next action: promote spring cleanup in the email newsletter and on the profile.

## Expected costs

$0.

## How this earns revenue

Reporting proves your value and keeps clients on retainers. Analytics setup can also be sold as a standalone project.

## Common mistakes

- **Tracking pageviews but not conversions.**
- **Reports full of jargon.**
- **Ignoring consent rules.**

## Action checklist

- [ ] Install analytics on a practice site.
- [ ] Set up 2 conversions and test them.
- [ ] Create the one-page report template.

## Next steps

Continue to **Building a simple marketing portfolio**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('79469e22-2dbc-9706-d181-7208b0b69cee', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'Building a simple marketing portfolio', 'Create 3 case studies showing strategy, execution and real (or clearly labelled sample) results.', 9, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('96bca316-21f7-f627-d2e7-95f385a7d7f9', '79469e22-2dbc-9706-d181-7208b0b69cee', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'building-a-simple-marketing-portfolio', 'Building a simple marketing portfolio', 'Create 3 case studies showing strategy, execution and real (or clearly labelled sample) results.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('96bca316-21f7-f627-d2e7-95f385a7d7f9', $md$## Goal

Publish a marketing portfolio with 3 case studies.

## Prerequisites

- Work from previous lessons.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Choose 3 projects:** for example a social media calendar, an SEO audit plus fixes, and a lead-generation landing page.
2. **Get real experience if possible:** offer a small pilot to a local business or non-profit with a written scope, in exchange for permission to share results.
3. **Write each case study:**
   - client type;
   - the challenge;
   - the strategy (why);
   - the execution (what);
   - results (real numbers with permission, or "sample project" with no invented metrics);
   - screenshots.
4. **Create a portfolio page** with your services, the 3 case studies, your process, and contact.
5. **Add credentials** you've actually earned, such as free Google or HubSpot certifications.
6. **Share it** in outreach, on LinkedIn and in your email signature.

## Tools and resources

- Google Skillshop (free certifications): https://skillshop.withgoogle.com
- HubSpot Academy: https://academy.hubspot.com
- Carrd, Google Sites or Notion.

## Practical example

**Case study:** "Pilot: Google Business Profile optimisation for a family bakery" (real, with permission).

- Completed profile, weekly posts and a review card system.
- Result: the number of reviews and photos added over 2 months, using real figures from the owner's profile insights, shown with permission.

## Expected costs

$0.

## How this earns revenue

Case studies are your main sales tool. Real pilot results, even small ones, are far more persuasive than claims.

## Common mistakes

- **Invented metrics.**
- **Sharing client data without permission.**
- **No clear service offer** alongside the portfolio.

## Action checklist

- [ ] Complete 3 case studies.
- [ ] Earn one free certification.
- [ ] Publish the portfolio page.

## Next steps

Continue to **Selling marketing services**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('d0583abc-7b6c-edb8-f3a7-2407696aca91', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'Selling marketing services', 'Package, price and sell monthly marketing services to small businesses, and retain them with reporting.', 10, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('004ec6cb-464e-5275-4333-f9f53de2abe9', 'd0583abc-7b6c-edb8-f3a7-2407696aca91', '3032ec1b-cc0f-5cc8-a2c3-4e72784139a6', 'selling-marketing-services', 'Selling marketing services', 'Package, price and sell monthly marketing services to small businesses, and retain them with reporting.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('004ec6cb-464e-5275-4333-f9f53de2abe9', $md$## Goal

Create a service package, find 20 prospects, and run your first sales conversations.

## Prerequisites

- A portfolio.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Package your service.** Examples:
   - **"Local Visibility":** Google Business Profile management, 8 social posts, review system, monthly report.
   - **"Lead Engine":** landing page, form, CRM setup, monthly optimisation.
2. **Define the scope:** deliverables, what's excluded, communication, reporting and minimum term.
3. **Price it:** calculate hours × rate plus tools, compare with market prices, and set monthly retainer pricing.
4. **Find prospects:**
   - Google Maps businesses with weak profiles or few reviews;
   - outdated social accounts;
   - no website.
   Record specific observations.
5. **Do respectful outreach:** a personalised note mentioning one specific improvement, with a free mini-audit offer. Follow CASL.
6. **Run the discovery call:** goals, current marketing, budget, capacity to handle more customers.
7. **Send a proposal:** the package, timeline, price, term, reporting and next steps.
8. **Onboard and report monthly.** The report is what keeps clients.

**Mini-audit outreach:**

> Hi [Name], I was looking at [Business] on Google Maps. Your reviews are great, but the profile is missing [hours/photos/services], which can make it harder for nearby customers to choose you. I put together a free 5-point checklist of quick fixes: [link]. Happy to walk you through it. [Your name] · Reply "no thanks" to opt out.

## Tools and resources

- Your portfolio, proposal template, Google Maps and pipeline sheet.

## Practical example

20 prospects contacted with a free mini-audit:

- 3 asked for a call;
- 1 signed a 3-month "Local Visibility" retainer starting with profile optimisation and a review system.

These numbers are illustrative only. Your results will vary.

## Expected costs

$0.

## How this earns revenue

Monthly retainers create recurring revenue. Clients stay when they see clear reports and improvements, though no outcome can be guaranteed.

## Common mistakes

- **Guaranteeing rankings, followers or sales.**
- **Vague packages.**
- **No minimum term or reporting.**

## Action checklist

- [ ] Write your service package.
- [ ] Contact 20 prospects with a mini-audit.
- [ ] Send at least one proposal.

## Next steps

You've completed the digital marketing pathway. Combine it with **Building and Selling Websites** to offer websites plus marketing, a natural package for local businesses.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.courses (id, slug, title, subtitle, description, category, icon, position, is_published)
values ('3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'starting-an-online-business', 'Starting an Online Business', 'Find an opportunity, validate demand cheaply, set up your business properly in Canada, and grow carefully.', 'A step-by-step guide to starting a small online business the careful way. Find and validate opportunities before spending money, understand customers and competitors, build an offer, calculate margins, register and set up a business in Canada, keep proper records, acquire customers and scale responsibly.', 'Online Business', 'rocket', 8, true)
on conflict (id) do update set slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle,
  description = excluded.description, category = excluded.category, icon = excluded.icon,
  position = excluded.position, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('4567cb2c-b599-cf4d-0d9a-84dc4db7a4d4', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'Finding business opportunities', 'Generate business ideas from real problems, your skills and market trends, then shortlist the best.', 1, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('7884ecca-e704-7ca3-093d-10c06e0189ad', '4567cb2c-b599-cf4d-0d9a-84dc4db7a4d4', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'finding-business-opportunities', 'Finding business opportunities', 'Generate business ideas from real problems, your skills and market trends, then shortlist the best.', 30, 1, true, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('7884ecca-e704-7ca3-093d-10c06e0189ad', $md$## Goal

Generate 20 business ideas from real evidence and shortlist the top 3.

## Prerequisites

- None.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Look for problems, not ideas.** For one week, write down every frustration you hear about at work, from friends, in online reviews and in community forums.
2. **List your assets:** skills, experience, contacts, available time, budget and things you enjoy.
3. **Use idea sources:**
   - complaints in 1–3 star reviews of existing products;
   - "is there a tool that…" posts;
   - tasks businesses outsource;
   - local services with long wait times.
4. **Choose business models to consider:**
   - a service (fastest to start);
   - digital products;
   - e-commerce;
   - content and affiliate;
   - software (most complex).
5. **Generate 20 ideas** that combine a problem with your assets and a model.
6. **Shortlist using filters:**
   - Can I reach these customers?
   - Will they pay?
   - Can I start for under my budget?
   - Do I want to work on this for a year?
7. **Pick the top 3** for validation.

## Tools and resources

- A notes app for the "problem journal".
- Reddit, Google reviews and Amazon reviews.
- Google Trends.

## Practical example

Problem journal entries included:

- "My mom can't figure out her new phone";
- "Our restaurant's online menu is always outdated";
- "Hard to find someone to assemble furniture on weekends".

The shortlist was tech help for seniors (service), menu update management for restaurants (service), and a furniture assembly booking service (local).

## Expected costs

$0.

## How this earns revenue

Every business earns by solving a problem someone will pay to fix. Starting from real problems increases the chance that customers exist. It's still not a guarantee.

## Common mistakes

- **Starting with a solution** looking for a problem.
- **Ideas you can't reach customers for.**
- **Ignoring your own constraints** of time and budget.

## Action checklist

- [ ] Keep a problem journal for 7 days.
- [ ] Generate 20 ideas.
- [ ] Shortlist 3.

## Next steps

Continue to **Validating demand before spending money**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('916cfce3-2e58-5838-2002-e055fbf6eef8', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'Validating demand before spending money', 'Test whether people will actually pay, using conversations, landing pages and pre-sales, before building.', 2, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('a592d9e5-803c-fc9f-680d-23cf80d500af', '916cfce3-2e58-5838-2002-e055fbf6eef8', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'validating-demand-before-spending-money', 'Validating demand before spending money', 'Test whether people will actually pay, using conversations, landing pages and pre-sales, before building.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('a592d9e5-803c-fc9f-680d-23cf80d500af', $md$## Goal

Run a low-cost validation test for your top idea and make an evidence-based go/no-go decision.

## Prerequisites

- A shortlist.
- Startup cost: **$0–$50**.

## Step-by-step instructions

1. **Write your assumptions:** who the customer is, the problem, how much they'd pay, and how you'll reach them.
2. **Run 10 problem interviews** with potential customers. Ask about their past behaviour: "How do you handle X now?", "What have you tried?", "What did it cost?" Don't pitch yet.
3. **Create a simple landing page** describing the offer, price and a call to action ("Book a session", "Join the waitlist").
4. **Drive a small amount of traffic:** share in relevant communities (follow the rules), with your network, or with a tiny ad test.
5. **Ask for commitment:** a pre-order, a deposit or a booked paid pilot. Commitments are stronger evidence than "sounds great!"
6. **Set success criteria in advance,** e.g. "5 paid bookings from 50 conversations within 2 weeks."
7. **Decide:**
   - **Go:** criteria met.
   - **Adjust:** some interest, so change the offer, price or audience and retest.
   - **Stop:** little interest.

## Tools and resources

- Carrd (https://carrd.co) or Google Sites for landing pages.
- Calendly for bookings, Stripe Payment Links for deposits (https://stripe.com/payments/payment-links).

## Practical example

**Tech help for seniors:**

- 10 interviews with adult children of seniors: 7 had spent hours helping parents with devices.
- A landing page for "1-hour in-home tech help" with a booking form, shared in 3 local community groups and with friends.
- Result: 6 paid bookings in 2 weeks, which beat the criteria of 4. **Go.**

## Expected costs

$0–$50 (landing page, small ad test).

## How this earns revenue

Validation prevents spending months or savings on something nobody buys. Pre-sales can fund the first version.

## Common mistakes

- **Asking "would you buy this?"** People say yes to be polite.
- **No success criteria.**
- **Building the full product first.**

## Action checklist

- [ ] Write your assumptions.
- [ ] Run 10 interviews.
- [ ] Launch a landing page and ask for commitments.
- [ ] Make the go/adjust/stop decision.

## Next steps

Continue to **Identifying target customers**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('a79dc609-8717-3d69-8e58-2e83b14b4309', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'Identifying target customers', 'Define your ideal customer profile and where to find them, using real interview data.', 3, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('a5784b98-7f07-5f40-6ca2-b24d48c5ea41', 'a79dc609-8717-3d69-8e58-2e83b14b4309', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'identifying-target-customers', 'Identifying target customers', 'Define your ideal customer profile and where to find them, using real interview data.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('a5784b98-7f07-5f40-6ca2-b24d48c5ea41', $md$## Goal

Write an ideal customer profile (ICP) and list the specific places to reach those customers.

## Prerequisites

- Validation interviews.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Review your interview notes** and highlight repeated phrases, triggers ("after Dad got a new phone…"), and objections.
2. **Define the ICP:**
   - demographics or firmographics (for B2B);
   - situation;
   - problem;
   - trigger events;
   - budget;
   - decision maker;
   - objections.
3. **Separate the buyer and the user.** For example, an adult child pays while a senior uses the service.
4. **List where they gather:** specific groups, websites, events, newsletters and local places.
5. **Write their language:** the exact words they use for the problem. Use these in your marketing.
6. **Define who is not a fit,** to save time.

## Tools and resources

- Interview notes.
- A one-page ICP template (Google Docs).

## Practical example

**ICP:** adults aged 35–60 in [city] with a parent aged 70+ living independently.

- **Trigger:** a new device or a scam scare.
- **Budget:** willing to pay for peace of mind.
- **Objection:** trust (who's entering the home?).
- **Where:** local parent and community Facebook groups, community centres, seniors' residence bulletin boards (with permission).

## Expected costs

$0.

## How this earns revenue

A clear ICP makes marketing cheaper and more effective, because you speak to the right people in the right places.

## Common mistakes

- **"Everyone" as the customer.**
- **Inventing personas** without interview data.
- **Ignoring the buyer versus user difference.**

## Action checklist

- [ ] Write the ICP.
- [ ] List 10 places to reach customers.
- [ ] Collect 15 customer phrases.

## Next steps

Continue to **Competitor research**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('e59b2ee4-2b6d-e740-f236-34e52175dc21', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'Competitor research', 'Analyse competitors'' offers, prices, reviews and gaps to position your business clearly.', 4, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('7d46d2cd-6168-45e5-a865-4cfd301185c3', 'e59b2ee4-2b6d-e740-f236-34e52175dc21', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'competitor-research', 'Competitor research', 'Analyse competitors'' offers, prices, reviews and gaps to position your business clearly.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('7d46d2cd-6168-45e5-a865-4cfd301185c3', $md$## Goal

Build a competitor table and write your positioning statement.

## Prerequisites

- An ICP.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Find 5–10 competitors:** direct (same service), indirect (different solution, such as family members helping for free or big-box store tech services) and online alternatives.
2. **Record for each:**
   - offer;
   - price;
   - target customer;
   - channels;
   - strengths;
   - weaknesses;
   - review themes.
3. **Read their 1–3 star reviews.** These reveal unmet needs.
4. **Identify gaps:** underserved customers, poor service, missing features, slow response or confusing pricing.
5. **Write your positioning:** "For [ICP] who [need], [business] is the [category] that [key difference], unlike [alternative]."
6. **Never copy** competitors' content, branding or trademarks.

## Tools and resources

- Google Maps, competitor websites, review sites and a spreadsheet.

## Practical example

Competitors were big-box tech services (in-store, impersonal) and general handymen (not tech-focused).

Gap: patient, in-home help with written instructions left behind.

**Positioning:** "For families with ageing parents, [Business] is the in-home tech helper that leaves simple written guides after every visit, unlike in-store tech desks."

## Expected costs

$0.

## How this earns revenue

Clear positioning lets you compete on value rather than lowest price.

## Common mistakes

- **Assuming you have no competitors.**
- **Competing only on price.**
- **Copying competitors.**

## Action checklist

- [ ] Complete the competitor table.
- [ ] Summarise 3 review themes.
- [ ] Write your positioning statement.

## Next steps

Continue to **Creating an offer**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('73c4acf3-8a41-4e5b-53c1-2b602aec4dd4', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'Creating an offer', 'Package your product or service into a clear offer with deliverables, price, guarantee terms and a call to action.', 5, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('2b98cbd3-726b-8cb5-7a82-ca1b9a1e6e91', '73c4acf3-8a41-4e5b-53c1-2b602aec4dd4', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'creating-an-offer', 'Creating an offer', 'Package your product or service into a clear offer with deliverables, price, guarantee terms and a call to action.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('2b98cbd3-726b-8cb5-7a82-ca1b9a1e6e91', $md$## Goal

Write a complete offer page your customers can say yes to.

## Prerequisites

- Positioning.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Name the offer** by its outcome, e.g. "Tech Confidence Session".
2. **List deliverables:** time, what's included, what they keep (for example written guides).
3. **Add packages** if useful: single session, a 3-session bundle, or a monthly check-in.
4. **Address objections** in the copy: trust (background check if you have one, clear policies), price and time.
5. **Set honest terms:** cancellation, refund or satisfaction policy (only promises you can keep), service area.
6. **Write a clear call to action** and make booking or buying easy.
7. **Make sure all claims are true** and avoid misleading pricing (for example hidden fees).

## Tools and resources

- The landing page tool from validation, and Google Docs.

## Practical example

**Tech Confidence Session:**

- 60 minutes in-home;
- set up and explain up to 2 devices;
- a printed step-by-step guide left behind;
- one follow-up phone call within 7 days.

There's also a 3-session bundle, and free rescheduling with 24 hours' notice.

## Expected costs

$0.

## How this earns revenue

A clear offer converts better and supports higher prices than "I can help with tech stuff".

## Common mistakes

- **Vague deliverables.**
- **Guarantees you can't honour.**
- **Hidden fees.**

## Action checklist

- [ ] Write the offer and packages.
- [ ] Answer the top 3 objections.
- [ ] Update your landing page.

## Next steps

Continue to **Calculating costs and profit margins**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('ad72f2fc-fa88-6026-71fc-74e81823a10c', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'Calculating costs and profit margins', 'Calculate startup costs, fixed and variable costs, margins and break-even, so you price for profit.', 6, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('6ccb4922-c692-e46f-53e5-e0dc3a7ed229', 'ad72f2fc-fa88-6026-71fc-74e81823a10c', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'calculating-costs-and-profit-margins', 'Calculating costs and profit margins', 'Calculate startup costs, fixed and variable costs, margins and break-even, so you price for profit.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('6ccb4922-c692-e46f-53e5-e0dc3a7ed229', $md$## Goal

Build a simple financial model with startup costs, monthly costs, unit margin and break-even point.

## Prerequisites

- An offer and price.
- Startup cost: **$0**.

## Step-by-step instructions

1. **List startup costs:** registration, domain, equipment, initial marketing and insurance.
2. **List monthly fixed costs:** software, phone, insurance, website and accounting.
3. **List variable costs per sale:** materials, travel, payment fees and contractor costs.
4. **Calculate unit margin** = price − variable cost per sale.
5. **Calculate break-even** = monthly fixed costs ÷ unit margin, which gives the number of sales needed per month.
6. **Include your time:** estimate hours per sale and calculate your effective hourly earnings.
7. **Include taxes:** set aside a percentage of profit for income tax, and charge GST/HST once registered.
8. **Stress test:** what if sales are half your estimate? What if costs rise 20%?

## Tools and resources

- Google Sheets.
- BDC (Business Development Bank of Canada) articles and templates: https://www.bdc.ca

## Practical example

| Item | Amount |
|---|---|
| Session price | $90 |
| Variable costs (travel, printing, payment fees) | $14 |
| **Unit margin** | **$76** |
| Monthly fixed costs (phone share, software, insurance, website) | $120 |
| **Break-even** | **2 sessions per month** |

At 1.75 hours per session including travel, the effective hourly rate is about $43 before tax.

## Expected costs

$0.

## How this earns revenue

Understanding margins tells you whether the business can actually pay you, and how many sales you need.

## Common mistakes

- **Forgetting your own time.**
- **Ignoring taxes and fees.**
- **No stress test.**

## Action checklist

- [ ] Build the financial model.
- [ ] Calculate break-even.
- [ ] Run 2 stress scenarios.

## Next steps

Continue to **Setting up a business in Canada**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('310e4b5a-e4a9-e93e-1361-b22fc9edb51c', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'Setting up a business in Canada', 'Choose a business structure, register your business name, get a business number, and understand GST/HST, licences and insurance.', 7, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('0cbe019c-67a7-f31c-7e3e-23e5d65ebcc5', '310e4b5a-e4a9-e93e-1361-b22fc9edb51c', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'setting-up-a-business-in-canada', 'Setting up a business in Canada', 'Choose a business structure, register your business name, get a business number, and understand GST/HST, licences and insurance.', 45, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('0cbe019c-67a7-f31c-7e3e-23e5d65ebcc5', $md$> **Important:** General information only, not legal or tax advice. Requirements vary by province, municipality and business type, and rules change. Verify on official government sites and consider speaking with an accountant or lawyer.

## Goal

Understand the setup steps for a small business in Canada and create your personal setup checklist.

## Prerequisites

- A validated business idea.
- Startup cost: varies (registration fees are typically modest, and vary by province).

## Step-by-step instructions

1. **Choose a structure:**
   - **Sole proprietorship:** simplest; you and the business are legally the same, and you're personally liable.
   - **Partnership:** two or more owners. Get a written partnership agreement.
   - **Corporation** (federal or provincial): a separate legal entity, more paperwork and cost, with potential tax and liability differences. Get advice.
2. **Register your business name.** Sole proprietors using a name other than their own legal name generally must register it with their province (for example the Ontario Business Registry, or BC Registries). Corporations register when incorporating.
3. **Get a Business Number (BN)** from the CRA when you need a program account, such as GST/HST, payroll or import/export.
4. **GST/HST:** you generally must register once your worldwide taxable supplies exceed **$30,000** in a single calendar quarter or over four consecutive calendar quarters (the small supplier threshold). You can register voluntarily before that. Confirm current rules on canada.ca.
5. **Provincial sales tax:** some provinces (BC, Saskatchewan, Manitoba, Quebec) have separate sales taxes with their own rules.
6. **Licences and permits:** check municipal business licences, home-based business rules, and industry-specific requirements. Use BizPaL to find permits for your location and industry.
7. **Insurance:** consider general liability and professional liability insurance, especially for in-home or client services.
8. **Banking:** open a separate business bank account.
9. **Privacy:** if you collect personal information, understand PIPEDA (federal) or provincial privacy laws, and publish a privacy policy.

## Tools and resources

- Canada Business (start a business): https://www.canada.ca/en/services/business/start.html
- BizPaL (permits and licences): https://www.bizpal-perle.ca
- CRA Business Number: https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/registering-your-business/you-need-a-business-number-a-program-account.html
- GST/HST registration: https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/account-register.html
- Corporations Canada: https://ised-isde.canada.ca/site/corporations-canada/en
- Office of the Privacy Commissioner (PIPEDA): https://www.priv.gc.ca

## Practical example

**Tech help service in Ontario:**

- Starts as a sole proprietor.
- Registers the business name "Patient Tech Help" on the Ontario Business Registry.
- Opens a business bank account.
- Checks BizPaL for municipal requirements.
- Gets general liability insurance (in-home visits).
- Tracks revenue to know when the GST/HST threshold approaches.
- Publishes a privacy policy because booking forms collect client information.

## Expected costs

| Item | Cost |
|---|---|
| Name registration | Provincial fee, varies |
| Incorporation | Higher fees |
| Insurance | Annual premiums, varies by coverage |
| Accounting advice | Varies |

## How this earns revenue

Proper setup lets you invoice professionally, accept payments, build trust, and avoid penalties that cut into profit.

## Common mistakes

- **Missing GST/HST registration** once over the threshold.
- **No insurance** for in-home work.
- **Mixing personal and business accounts.**
- **Assuming another province's rules apply to you.**

## Action checklist

- [ ] Choose a structure (get advice if considering incorporation).
- [ ] Check name registration requirements in your province.
- [ ] Run a BizPaL search.
- [ ] Get insurance quotes.
- [ ] Open a business bank account.

## Next steps

Continue to **Basic bookkeeping and recordkeeping**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('001420d7-42e9-a495-3bb7-acefff3776de', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'Basic bookkeeping and recordkeeping', 'Set up a simple bookkeeping system, track income and expenses, keep receipts, and prepare for tax time.', 8, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('5638c2c0-d890-7a1b-9e93-e61536652558', '001420d7-42e9-a495-3bb7-acefff3776de', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'basic-bookkeeping-and-recordkeeping', 'Basic bookkeeping and recordkeeping', 'Set up a simple bookkeeping system, track income and expenses, keep receipts, and prepare for tax time.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('5638c2c0-d890-7a1b-9e93-e61536652558', $md$> **Important:** General information only. Confirm tax obligations with the CRA or an accountant.

## Goal

Set up a bookkeeping system you'll keep up with weekly, and understand record retention.

## Prerequisites

- A business bank account (recommended).
- Startup cost: **$0** with free tools.

## Step-by-step instructions

1. **Choose a tool:** a spreadsheet to start, or accounting software (Wave is free; QuickBooks and FreshBooks are paid).
2. **Set categories:**
   - revenue;
   - cost of goods or services;
   - advertising;
   - software;
   - phone and internet (business portion);
   - vehicle (business use, with a logbook);
   - home office (if eligible);
   - professional fees;
   - insurance;
   - bank fees.
3. **Record every transaction** weekly: date, description, amount, category, GST/HST charged or paid.
4. **Keep receipts:** photograph them and store them digitally in dated folders. The CRA generally requires records to be kept for six years from the end of the tax year they relate to.
5. **Issue numbered invoices,** including your GST/HST number once registered.
6. **Reconcile monthly:** match bookkeeping to bank statements.
7. **Set aside tax money:** move a percentage of each payment into a savings account for income tax and GST/HST.
8. **At year end,** produce a profit and loss summary and talk to an accountant about filing (self-employed income is typically reported on form T2125).

## Tools and resources

- Wave: https://www.waveapps.com
- CRA keeping records: https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/keeping-records.html
- CRA T2125 guide: https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4002.html

## Practical example

Every Friday at 4 pm (15 minutes):

1. Categorise the week's transactions in Wave.
2. Photograph receipts.
3. Move 25% of the week's income to the "Tax" savings account. The percentage is a personal estimate; ask an accountant.

## Expected costs

$0–$30 per month for software. Accountant fees for year-end are optional but often worthwhile.

## How this earns revenue

Good records help you see what's profitable, claim legitimate deductions, and avoid penalties.

## Common mistakes

- **Leaving bookkeeping until tax season.**
- **Lost receipts.**
- **Spending GST/HST collected,** which isn't your money.

## Action checklist

- [ ] Choose a tool and set up categories.
- [ ] Create a receipts folder system.
- [ ] Open a tax savings account.
- [ ] Schedule weekly bookkeeping time.

## Next steps

Continue to **Customer acquisition**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('e246c42d-287b-77cb-550a-9fd0690c1877', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'Customer acquisition', 'Get your first 10 customers with direct outreach, partnerships, referrals and content, then systemise what works.', 9, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('2c3febeb-304a-ea59-ef16-38f8fdfe0c2f', 'e246c42d-287b-77cb-550a-9fd0690c1877', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'customer-acquisition', 'Customer acquisition', 'Get your first 10 customers with direct outreach, partnerships, referrals and content, then systemise what works.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('2c3febeb-304a-ea59-ef16-38f8fdfe0c2f', $md$## Goal

Create and execute a plan to win your first 10 customers, and track the cost and source of each.

## Prerequisites

- An offer, ICP and setup.
- Startup cost: $0–$200 (optional printing and ads).

## Step-by-step instructions

1. **Start with warm channels:** tell everyone you know exactly what you do and who it's for, and ask for introductions.
2. **Direct outreach:** contact people or businesses matching your ICP with a personalised message. Follow CASL for electronic messages.
3. **Partnerships:** find businesses that serve the same customers (for a seniors' tech service: pharmacies, community centres, seniors' residences) and propose referral arrangements or workshops.
4. **Local presence:** a Google Business Profile, local directory listings and community events.
5. **Content:** helpful posts or short videos answering common questions.
6. **Referrals:** ask every happy customer for an introduction. Consider an honest referral reward.
7. **Track each customer:** source, cost to acquire, revenue and repeat purchases.
8. **Double down** on the 1–2 channels that produce customers at an acceptable cost.

## Tools and resources

- Google Business Profile, Canva for flyers, a pipeline spreadsheet or HubSpot free CRM.

## Practical example

First 10 customers for the tech help service:

| Source | Customers |
|---|---|
| Friends and family introductions | 4 |
| Community centre workshop | 3 |
| Facebook community group post | 2 |
| Google Business Profile | 1 |

Focus going forward: monthly workshops plus referrals.

## Expected costs

Low for direct and referral channels. Paid ads need a budget and testing.

## How this earns revenue

Customers are revenue. Tracking acquisition cost by channel ensures you spend where it's profitable.

## Common mistakes

- **Only using paid ads.**
- **Not asking for referrals.**
- **Not tracking where customers came from.**

## Action checklist

- [ ] List 50 warm contacts and tell them about your business.
- [ ] Propose 3 partnerships.
- [ ] Track the source of every customer.

## Next steps

Finish with **Scaling carefully**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('75b49c6a-e325-0e26-0d91-b0922c3d7b54', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'Scaling carefully', 'Grow without breaking the business. Document processes, hire or outsource wisely, and manage cash flow and risk.', 10, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('eba8b927-f2c9-68d3-8afe-bb5a99274542', '75b49c6a-e325-0e26-0d91-b0922c3d7b54', '3d50e3c9-6ab1-8af3-22dd-bea3d34104b0', 'scaling-carefully', 'Scaling carefully', 'Grow without breaking the business. Document processes, hire or outsource wisely, and manage cash flow and risk.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('eba8b927-f2c9-68d3-8afe-bb5a99274542', $md$## Goal

Decide whether you're ready to scale, and create a careful growth plan.

## Prerequisites

- Consistent customers and profit data.
- Startup cost: depends on the plan.

## Step-by-step instructions

1. **Check readiness:**
   - consistent demand for 3+ months;
   - a positive margin after all costs;
   - documented processes;
   - cash reserves.
2. **Document processes:** write step-by-step SOPs (standard operating procedures) for delivery, onboarding, invoicing and customer service.
3. **Find bottlenecks:** what limits growth? Your time, cash, marketing or delivery capacity?
4. **Choose a growth lever:**
   - raise prices;
   - add a package;
   - add a channel;
   - automate admin;
   - hire or subcontract.
5. **Hire or outsource carefully:**
   - understand employee versus contractor rules in Canada (the CRA has guidance);
   - use written agreements;
   - check references;
   - provide training using your SOPs.
6. **Manage cash flow:** forecast 3–6 months of income and expenses, and keep a reserve before taking on fixed costs.
7. **Manage risk:** insurance, contracts, data security and not relying on one client or channel.
8. **Grow in steps:** test each change, measure, then expand.

## Tools and resources

- CRA employee or self-employed guidance: https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/rc4110.html
- BDC growth resources: https://www.bdc.ca
- Google Docs or Notion for SOPs.

## Practical example

The tech help business was fully booked on weekends.

- **Bottleneck:** the owner's time.
- **Plan:**
  1. Raise the price modestly for new clients.
  2. Document the session process.
  3. Trial one contractor (with a written agreement and insurance check) for 2 months.
  4. Keep 3 months of expenses in reserve.

## Expected costs

Depends on the lever. Hiring adds the largest fixed costs.

## How this earns revenue

Careful scaling increases capacity and revenue while protecting quality and cash flow. Growth also brings new risks, so take it step by step.

## Common mistakes

- **Scaling before the business is profitable.**
- **Hiring without processes.**
- **Ignoring cash flow.**
- **Misclassifying workers.**

## Action checklist

- [ ] Complete the readiness check.
- [ ] Write your first 3 SOPs.
- [ ] Create a 6-month cash flow forecast.
- [ ] Choose one growth lever to test.

## Next steps

You've completed the online business pathway. Revisit your numbers monthly, keep talking to customers, and grow one careful step at a time. The skills courses (AI, Freelancing, Websites, Marketing) can become services or tools for your business.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();


commit;
