-- Paste into Supabase SQL Editor and click Run. Part 1 of 3 of the course content.
begin;


insert into public.courses (id, slug, title, subtitle, description, category, icon, position, is_published)
values ('11ab9621-635d-c98f-bc29-51fd114338be', 'making-money-with-ai', 'Making Money With AI', 'Use AI tools to produce useful work, package it as a service, and find clients who pay for it.', 'A practical path from "I''ve tried ChatGPT" to selling a responsible AI-assisted service. You will learn which tools to use, how to get reliable output, how to build portfolio samples, how to find businesses that need the work, and how to price and deliver it.', 'Artificial Intelligence', 'spark', 1, true)
on conflict (id) do update set slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle,
  description = excluded.description, category = excluded.category, icon = excluded.icon,
  position = excluded.position, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('ac44cd19-de71-26f0-3624-13ed969b375b', '11ab9621-635d-c98f-bc29-51fd114338be', 'Introduction to AI tools', 'Set up the core AI tools, learn how to write prompts that produce usable work, and check output before you rely on it.', 1, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('44d12bbc-40be-7ac5-5c69-8ecdc3f04778', 'ac44cd19-de71-26f0-3624-13ed969b375b', '11ab9621-635d-c98f-bc29-51fd114338be', 'introduction-to-ai-tools', 'Introduction to AI tools', 'Set up the core AI tools, learn how to write prompts that produce usable work, and check output before you rely on it.', 30, 1, true, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('44d12bbc-40be-7ac5-5c69-8ecdc3f04778', $md$## Goal

By the end of this lesson you will have accounts on two general-purpose AI assistants, know how to write a structured prompt, and have produced (and fact-checked) your first piece of genuinely useful work with AI.

## Prerequisites

- A computer with a modern browser. A phone works, but a keyboard makes prompting much easier.
- An email address for sign-ups.
- Startup cost: **$0**. Every tool in this lesson has a free tier. Paid plans are optional and covered under Expected costs.

## Step-by-step instructions

1. **Create accounts on two assistants.** Sign up for ChatGPT (chatgpt.com) and Claude (claude.ai). Optionally add Google Gemini (gemini.google.com). Using two lets you compare answers and catch mistakes.
2. **Learn the four-part prompt.** Good prompts usually contain:
   - **Role:** "You are an experienced bookkeeper for small trades businesses."
   - **Task:** "Write a checklist for month-end bookkeeping."
   - **Context:** "The business is a two-person plumbing company in Ontario using QuickBooks."
   - **Format:** "Return a numbered list of no more than 12 steps, in plain English."
3. **Run the same prompt in both assistants.** Paste the identical prompt into each. Note which answer is clearer, more specific and more accurate.
4. **Iterate instead of starting over.** Reply with corrections: "Make step 4 more specific", "Remove jargon", "Add an example for step 7". AI output improves most through follow-up instructions.
5. **Fact-check anything factual.** AI can state wrong information confidently (often called "hallucination"). For any fact, number, law, price or quote, verify it with an official or reputable source before using it.
6. **Save your best prompts.** Create a document called "Prompt Library". For each prompt, record what it does, the prompt text, and notes on what worked.
7. **Learn the privacy basics.** Do not paste passwords, client financial data, health information or anything confidential into an AI tool unless the client has agreed and the tool's settings and terms allow it. Check each tool's data and privacy settings.

## Tools and resources

- ChatGPT: https://chatgpt.com
- Claude: https://claude.ai
- Google Gemini: https://gemini.google.com
- A notes app (Google Docs, Notion or Apple Notes) for your Prompt Library.

## Practical example

**Prompt:**

> You are an experienced office manager for small service businesses. Write a one-page "new customer welcome email" for a residential cleaning company in Calgary. Context: the company offers weekly and biweekly cleans, customers must leave a key or door code, and payment is by e-transfer after each clean. Format: subject line plus an email under 200 words, friendly and professional.

**What to do with the output:** Compare both assistants. Pick the better draft. Ask for one improvement ("add a line about rescheduling with 24 hours' notice"). Then check every factual claim. Here there are none to verify, which makes this a good beginner task.

## Expected costs

- Free tiers: enough for learning and light client work.
- Paid plans: most assistants offer a personal plan of roughly US$20 per month. Check the current price on each site. Upgrade only once you are doing regular paid work and are hitting free-tier limits.

## How this earns revenue

On its own, knowing how to use AI is not a business. You earn when you use AI to deliver an **outcome a business will pay for**, such as written content, organized data, automated tasks or research summaries. The client pays for the result and your judgment, not for the fact that you used AI. Later modules show you how to package and sell this.

## Common mistakes

- **Vague prompts** ("write a blog post"). Always add role, context and format.
- **Publishing without checking.** You are responsible for anything you deliver, including errors the AI made.
- **Pasting confidential data** into tools without permission.
- **Jumping between ten tools.** Get good with one or two first.

## Action checklist

- [ ] Create ChatGPT and Claude accounts.
- [ ] Write one four-part prompt for a real local business type.
- [ ] Run it in both tools and compare the results.
- [ ] Improve the best answer with two follow-up instructions.
- [ ] Start your Prompt Library document with this prompt.

## Next steps

Move on to **Using AI to research business ideas**, where you will use these prompting skills to find and test service ideas you could sell.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('baff6e35-d4c6-0cdf-0d56-85d24528b115', '11ab9621-635d-c98f-bc29-51fd114338be', 'Using AI to research business ideas', 'Use AI to generate service ideas, then validate them with real-world evidence before spending money.', 2, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('3fbe6ac8-ae39-cd35-aabe-6398bee23e2b', 'baff6e35-d4c6-0cdf-0d56-85d24528b115', '11ab9621-635d-c98f-bc29-51fd114338be', 'using-ai-to-research-business-ideas', 'Using AI to research business ideas', 'Use AI to generate service ideas, then validate them with real-world evidence before spending money.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('3fbe6ac8-ae39-cd35-aabe-6398bee23e2b', $md$## Goal

Produce a shortlist of three AI-assisted service ideas, each backed by evidence that real businesses already pay for that kind of work.

## Prerequisites

- Completed *Introduction to AI tools*.
- A spreadsheet (Google Sheets or Excel).
- Startup cost: **$0**.

## Step-by-step instructions

1. **List your raw ingredients.** Write down your skills, past jobs, industries you know and things friends ask you for help with. These are your unfair advantages.
2. **Generate ideas with AI.** Prompt: *"Here are my skills and background: [list]. Suggest 20 services I could offer to small businesses using AI tools to speed up the work. For each, name the target customer and the problem it solves. Avoid anything requiring a licence."*
3. **Filter to 8 ideas** that meet all three tests: you understand the customer, you could deliver a sample this week, and the work is not regulated (legal, medical, tax filing or financial advice).
4. **Look for demand evidence for each idea.** Search freelance marketplaces (Upwork, Fiverr) and job boards for the service. Count active listings and note typical price ranges. Search Google for "[service] for [industry]" and see whether agencies or freelancers sell it.
5. **Use AI to summarize, not to invent.** Paste in real listings you found and ask AI to summarize common requirements and price ranges. Do not ask AI to estimate demand from nothing. It will make numbers up.
6. **Score each idea** in your spreadsheet from 1 to 5 on: demand evidence, your ability to deliver, ease of finding customers, and price potential. Keep the top three.
7. **Write a one-sentence offer for each:** "I help [customer] get [result] by [service], delivered in [timeframe]."

## Tools and resources

- Upwork: https://www.upwork.com
- Fiverr: https://www.fiverr.com
- Google Trends: https://trends.google.com (compares interest over time)
- Your AI assistant of choice.

## Practical example

Background: worked in retail, good at writing.

AI suggested 20 ideas. The filtered top three were:

1. Product description rewriting for small online shops.
2. Monthly social media caption packs for local cafés.
3. FAQ and policy page drafting for new e-commerce stores (customer service pages only, not legal advice).

Evidence: freelance marketplaces showed many active listings for product descriptions, at prices that varied widely by quality and volume. The offer sentence: *"I help small Shopify stores get clear, searchable product descriptions, delivered within 5 business days for up to 50 products."*

## Expected costs

$0. Research uses free tools. Paid keyword tools are not needed at this stage.

## How this earns revenue

Your shortlisted ideas are services. Businesses pay per project (for example per 50 product descriptions) or per month (for example a monthly content pack). Evidence that others already sell the service tells you customers exist. Your job later is to reach them and offer a clear, reliable result.

## Common mistakes

- **Trusting AI-generated market sizes or income numbers.** Always verify with real listings and sources.
- **Picking ideas you can't deliver** to a professional standard yet.
- **Choosing regulated work** such as legal documents, tax filing or medical content without proper credentials.

## Action checklist

- [ ] Write your skills and background list.
- [ ] Generate 20 ideas with AI and filter them to 8.
- [ ] Collect demand evidence for each of the 8.
- [ ] Score them and pick your top 3.
- [ ] Write one offer sentence per idea.

## Next steps

Continue to **AI-assisted writing and content creation** to build the core skill behind most AI services: producing writing a business can actually use.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('19986ecf-618f-5dbe-d5c2-21f1a6ee108c', '11ab9621-635d-c98f-bc29-51fd114338be', 'AI-assisted writing and content creation', 'A repeatable workflow for producing client-ready writing with AI: brief, draft, edit, fact-check, deliver.', 3, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('3ed21d5f-1dc8-4afe-a1b4-17f6086eceee', '19986ecf-618f-5dbe-d5c2-21f1a6ee108c', '11ab9621-635d-c98f-bc29-51fd114338be', 'ai-assisted-writing-and-content-creation', 'AI-assisted writing and content creation', 'A repeatable workflow for producing client-ready writing with AI: brief, draft, edit, fact-check, deliver.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('3ed21d5f-1dc8-4afe-a1b4-17f6086eceee', $md$## Goal

Learn a five-stage writing workflow you can reuse for blog posts, emails, product descriptions and social captions, and produce one portfolio-ready sample.

## Prerequisites

- An AI assistant account.
- Google Docs or Word.
- A free grammar checker (optional).
- Startup cost: **$0**.

## Step-by-step instructions

1. **Write a brief before you prompt.** Cover audience, goal, tone, key points, length, the call to action and words to avoid. Clients often won't give you a brief, so ask them these questions.
2. **Give the AI the brief plus examples.** Paste the brief and one or two examples of writing the client likes. Ask for an outline first, not the full text.
3. **Approve and adjust the outline**, then ask for the draft one section at a time. Shorter sections give better quality and are easier to edit.
4. **Edit like a human editor:**
   - Cut filler phrases ("in today's fast-paced world").
   - Add specific details only you or the client know: local names, real products, real prices.
   - Read it aloud and fix anything that sounds robotic.
5. **Fact-check.** Verify every statistic, claim and link. Remove anything you can't verify.
6. **Run a final quality pass:** spelling and grammar, consistent tone, a clear call to action, correct formatting for where it will be published.
7. **Deliver in the client's format,** such as a Google Doc with headings or a spreadsheet for product copy, with a short note listing anything they should double-check (prices, opening hours).

## Tools and resources

- AI assistant (ChatGPT, Claude or Gemini).
- Grammarly (free tier): https://www.grammarly.com, or LanguageTool: https://languagetool.org
- Hemingway Editor for readability: https://hemingwayapp.com

## Practical example

**Brief:** a 600-word blog post for a local bike repair shop titled "How often should you service your bike?". The audience is casual commuters. Tone is friendly and practical. The call to action is to book a tune-up online.

**Workflow:**

1. Prompt for an outline: intro, signs your bike needs service, a simple schedule by riding frequency, a home-care checklist, and when to visit a shop.
2. Draft each section.
3. Edit: add the shop's actual services and booking link (from the client), and remove generic filler.
4. Fact-check any maintenance intervals against the manufacturer or reputable cycling sources, and phrase them as "general guidance".

The result is a sample for your portfolio. Label it a "sample project" if the business didn't commission it.

## Expected costs

$0 on free tiers. A paid AI plan (around US$20 per month) helps once you produce content daily.

## How this earns revenue

Businesses buy writing as:

- per-piece projects, such as a blog post or product page;
- monthly packages, such as 4 posts plus 20 social captions;
- per-item bulk work, such as product descriptions.

Price for the value and your editing time, not the seconds the AI took. Typical market rates vary enormously by niche and quality, so research current rates on freelance marketplaces for your service.

## Common mistakes

- **Delivering raw AI output.** Clients notice, and it often contains errors.
- **No brief,** which leads to endless revisions.
- **Keyword stuffing** or copying competitors' text. Write original content.

## Action checklist

- [ ] Create a reusable brief template.
- [ ] Produce one 500–800 word sample using the five-stage workflow.
- [ ] Get feedback from one person in the target audience.
- [ ] Save the final version to a "Portfolio" folder.

## Next steps

Next: **AI image generation**, so you can add visuals to your writing services or offer them on their own.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('91b52d13-9fc2-0af9-ec29-0858b72a53f0', '11ab9621-635d-c98f-bc29-51fd114338be', 'AI image generation', 'Create on-brand images with AI responsibly, covering prompting, editing, usage rights and what to avoid.', 4, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('e5b7e108-cd29-298a-b632-8dbc4bfac21d', '91b52d13-9fc2-0af9-ec29-0858b72a53f0', '11ab9621-635d-c98f-bc29-51fd114338be', 'ai-image-generation', 'AI image generation', 'Create on-brand images with AI responsibly, covering prompting, editing, usage rights and what to avoid.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('e5b7e108-cd29-298a-b632-8dbc4bfac21d', $md$## Goal

Generate and edit a set of consistent images suitable for a small business's social media or website, while understanding the usage rules.

## Prerequisites

- An account with at least one image tool.
- Startup cost: **$0** using free tiers.

## Step-by-step instructions

1. **Pick a tool.** Good beginner options are Canva's AI image features, Adobe Firefly, or the image generation built into ChatGPT or Gemini.
2. **Read the tool's usage terms.** Confirm commercial use is allowed on your plan, and note any restrictions.
3. **Build a style prompt** you can reuse for consistency. It should name the subject, setting, lighting, style, colour palette and aspect ratio. Example: *"Flat-lay photo style, warm natural light, a latte and croissant on a light oak table, muted cream and brown palette, 4:5 aspect ratio."*
4. **Generate in batches** of four or more, then pick the best. Change one variable at a time (lighting, angle) to learn what each word does.
5. **Edit in a design tool.** Crop, add brand colours, text and a logo in Canva. Make sure any text is legible on a phone.
6. **Avoid restricted content.** Never generate:
   - real people without consent;
   - celebrities;
   - logos and trademarks belonging to others;
   - copyrighted characters;
   - anything that could mislead customers, such as showing a product the business doesn't sell or presenting AI images as real photos of their premises.
7. **Disclose when appropriate.** Some platforms require AI-generated content labels. Follow each platform's rules.

## Tools and resources

- Canva: https://www.canva.com
- Adobe Firefly: https://firefly.adobe.com
- ChatGPT or Gemini image generation (availability depends on plan).

## Practical example

A café wants 8 Instagram graphics announcing a fall menu.

1. Generate abstract seasonal backgrounds and close-up textures (leaves, steam, ceramics) rather than fake photos of their actual drinks.
2. Overlay the café's own product photos where possible, plus text: menu names, prices and dates supplied by the client.
3. Export at 1080×1350.
4. Deliver in a shared folder with a caption for each image.

## Expected costs

- Free tiers have monthly limits.
- Paid creative plans typically cost US$10–$30 per month. Check current pricing.

## How this earns revenue

Image work is usually sold as part of a package, for example "monthly social media pack: 12 graphics plus captions", or as one-off sets such as event promotions or blog header images. The value is consistent, on-brand visuals delivered quickly.

## Common mistakes

- **Faking real products or locations,** which can mislead customers.
- **Inconsistent style** across posts. Reuse your style prompt.
- **Unreadable text** on small screens.
- **Ignoring licence terms.**

## Action checklist

- [ ] Read the commercial-use terms of your chosen tool.
- [ ] Write a reusable style prompt.
- [ ] Create a set of 6 consistent graphics for an imaginary local business.
- [ ] Add them to your portfolio, labelled as sample work.

## Next steps

Continue to **AI automation for small businesses** to learn how to save clients time, which is often worth more than content.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('f67b90e6-2f68-45dd-4f01-8414d050f9b8', '11ab9621-635d-c98f-bc29-51fd114338be', 'AI automation for small businesses', 'Map a business''s repetitive tasks and build a simple, reliable automation with no-code tools.', 5, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('57585db1-af31-7630-d887-2176ded81a76', 'f67b90e6-2f68-45dd-4f01-8414d050f9b8', '11ab9621-635d-c98f-bc29-51fd114338be', 'ai-automation-for-small-businesses', 'AI automation for small businesses', 'Map a business''s repetitive tasks and build a simple, reliable automation with no-code tools.', 45, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('57585db1-af31-7630-d887-2176ded81a76', $md$## Goal

Build one working automation, such as "new website enquiry → AI-drafted reply → saved to spreadsheet → notification", and learn how to scope automation work safely.

## Prerequisites

- A free account on an automation platform (Zapier or Make).
- A Google account for Sheets and Gmail.
- Startup cost: **$0** on free plans for simple automations.

## Step-by-step instructions

1. **Map the process first.** With the business owner, list every step of one repetitive task, such as handling a new enquiry. Note who does it, how long it takes and what goes wrong.
2. **Pick a small, high-frequency task.** Good candidates: sorting enquiries, drafting standard replies, logging orders, summarizing reviews. Avoid anything where a mistake causes financial or legal harm.
3. **Design the automation on paper:**
   - Trigger: new form submission.
   - Steps: send the text to AI with instructions → save the result to a sheet → email the owner a draft.
   - Output: a reply draft the owner approves.
4. **Build it in Zapier or Make:**
   - Trigger: Google Forms or website form → new response.
   - Action: AI step (ChatGPT or Claude integration) with a prompt like *"Draft a polite reply to this enquiry for [business]. Use only these facts: [hours, prices]. If the question isn't covered, say the owner will reply personally."*
   - Action: add a row to Google Sheets.
   - Action: Gmail → create a **draft**, not send automatically.
5. **Keep a human in the loop.** Drafts, not auto-sends, until the client has reviewed many outputs.
6. **Test with 10 realistic examples,** including weird ones (an angry customer, an off-topic message, a message in another language). Adjust the prompt.
7. **Document it:** what it does, where the data goes, how to turn it off, and who to contact.

## Tools and resources

- Zapier: https://zapier.com
- Make: https://www.make.com
- Google Sheets and Gmail.
- AI integrations, which may require an API key from the AI provider (OpenAI or Anthropic). API usage is billed separately from chat subscriptions.

## Practical example

A dog groomer receives enquiries through a website form. The automation:

1. Saves each enquiry to a sheet.
2. Asks AI to classify it (booking, price question, complaint, other) and draft a reply using the groomer's price list.
3. Creates a Gmail draft.

The owner reviews and sends each reply in 30 seconds instead of writing it from scratch.

## Expected costs

- Automation platforms: free tiers cover low volumes. Paid plans start around US$10–$30 per month.
- AI API usage: usually small amounts per message, but check the provider's pricing and set spending limits.
- Usually the client pays these subscriptions directly in their own accounts.

## How this earns revenue

- **Setup fee** per automation, priced by complexity.
- **Monthly maintenance** for monitoring, fixing breaks and adjusting prompts.

Clients pay for time saved and fewer missed leads. Set up automations in the client's own accounts so they own them.

## Common mistakes

- **Fully automatic customer replies** with no review.
- **Running automations on your own accounts,** which causes ownership and data problems later.
- **No documentation,** so nobody can fix it when it breaks.
- **Sending personal data to tools** without the client's consent.

## Action checklist

- [ ] Build the enquiry-to-draft automation using your own test form.
- [ ] Test it with 10 different sample messages.
- [ ] Write a one-page document explaining the automation.
- [ ] Record a 2-minute screen video demonstrating it for your portfolio.

## Next steps

Next, **Building AI-assisted services** turns these skills into packaged offers with a clear scope and price.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('bc26fa73-f78f-7089-a2e1-eb1ed3739829', '11ab9621-635d-c98f-bc29-51fd114338be', 'Building AI-assisted services', 'Turn a skill into a packaged service with a defined scope, deliverables, turnaround and price.', 6, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('f75ac14a-4c4b-57a1-9e94-47ae62edba71', 'bc26fa73-f78f-7089-a2e1-eb1ed3739829', '11ab9621-635d-c98f-bc29-51fd114338be', 'building-ai-assisted-services', 'Building AI-assisted services', 'Turn a skill into a packaged service with a defined scope, deliverables, turnaround and price.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('f75ac14a-4c4b-57a1-9e94-47ae62edba71', $md$## Goal

Create a one-page service sheet for one AI-assisted service that a client could say yes to.

## Prerequisites

- Your top idea from *Using AI to research business ideas*.
- At least one sample of the work.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Name the outcome, not the tool.** Say "Monthly social media content pack", not "ChatGPT posts".
2. **Define deliverables precisely.** For example: 12 captions, 12 graphics, 1 content calendar, 1 round of revisions.
3. **Define what's not included.** For example: posting to accounts, paid ads, photography.
4. **Set turnaround and process:** client onboarding form → draft in 5 business days → feedback → final in 2 business days.
5. **Write your quality promise honestly.** "Every piece is edited and fact-checked by me before delivery" is good. Avoid promises about results you can't control, such as follower growth or sales.
6. **Decide pricing structure:** fixed project price, monthly retainer, or per-item. See *Pricing and selling AI services*.
7. **Create an onboarding questionnaire** in Google Forms covering business details, audience, tone, examples they like, things to avoid, and logins if needed (shared securely).
8. **Put it on one page:** a Google Doc or PDF with the service name, who it's for, deliverables, timeline, price, and how to start.

## Tools and resources

- Google Docs or Canva for the service sheet.
- Google Forms or Tally (https://tally.so) for onboarding.

## Practical example

**Service sheet: "Product Description Refresh"**

- **For:** Shopify stores with 20–200 products.
- **Deliverables:** rewritten titles and descriptions for up to 50 products, a spreadsheet ready to import, and 1 revision round.
- **Not included:** product photography, uploading to the store, SEO audits.
- **Timeline:** 5 business days after the onboarding form.
- **Price:** fixed project fee. Set your own after researching rates.
- **Start:** complete the onboarding form and pay the deposit.

## Expected costs

$0 to create. Optional design tools are free.

## How this earns revenue

A clear package shortens sales conversations, because the client sees exactly what they get and what it costs. Packages also let you deliver efficiently with templates, which improves your hourly earnings.

## Common mistakes

- **Unlimited revisions.** Always cap them.
- **Vague deliverables** like "social media help".
- **Promising outcomes** such as rankings, sales or followers that you can't guarantee.

## Action checklist

- [ ] Draft your service sheet.
- [ ] Build the onboarding form.
- [ ] Ask one person to read the sheet and explain back what they'd get. If they can't, simplify it.

## Next steps

Continue to **Finding clients who need AI services**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('eea2ab05-1937-17fd-67bb-d0dbfeebc0d5', '11ab9621-635d-c98f-bc29-51fd114338be', 'Finding clients who need AI services', 'Build a targeted prospect list and contact businesses with personalised, respectful outreach.', 7, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('b9209e1f-39c8-1295-113c-f651bd62d5c2', 'eea2ab05-1937-17fd-67bb-d0dbfeebc0d5', '11ab9621-635d-c98f-bc29-51fd114338be', 'finding-clients-who-need-ai-services', 'Finding clients who need AI services', 'Build a targeted prospect list and contact businesses with personalised, respectful outreach.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('b9209e1f-39c8-1295-113c-f651bd62d5c2', $md$## Goal

Build a list of 30 qualified prospects and send your first 10 personalised outreach messages.

## Prerequisites

- A service sheet and at least one portfolio sample.
- A professional email address. A free Gmail address using your name is fine to start.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Choose one niche and one location or platform.** Examples: independent cafés in your city, or Etsy sellers in home décor.
2. **Find prospects.** Search Google Maps for the business type in your area, look through local business directories, browse Instagram by location tags, and use marketplaces (Etsy, Shopify store directories).
3. **Qualify each one.** Look for a visible gap your service fixes:
   - outdated posts;
   - thin product descriptions;
   - no replies to reviews;
   - slow responses to enquiries.
4. **Record them in a spreadsheet:** name, contact, website or social link, the gap you noticed, status, and follow-up date.
5. **Write a personalised message** using the template below. Mention the specific gap and offer something small and free, such as one rewritten description or 3 sample captions.
6. **Send 10 messages a day,** not 200. Quality beats volume and protects your accounts from spam flags.
7. **Follow up once** after 4–5 business days. Stop if there's no reply. Never message people who asked you to stop.
8. **Follow the rules.** In Canada, commercial electronic messages are covered by Canada's Anti-Spam Legislation (CASL). Other countries have similar rules. Learn the basics: identify yourself, include contact information, offer an easy way to opt out, and only email addresses that are published for business enquiries. When unsure, contact through the business's own contact form or in person.

**Outreach template:**

> Subject: Quick idea for [Business] product pages
>
> Hi [Name],
>
> I was looking at [Business]'s [product/page] and noticed [specific observation, e.g. the descriptions are only one line, so customers don't see sizing or materials].
>
> I help small shops write clear product descriptions that answer buyers' questions. To show you what I mean, I rewrote one of yours here: [link]. Feel free to use it either way.
>
> If it's useful, I can do the same for the rest of the catalogue. Happy to share details.
>
> [Your name] · [website/portfolio] · [phone]
> If you'd prefer not to hear from me again, just reply "no thanks".

## Tools and resources

- Google Maps, Instagram, Etsy.
- Google Sheets as a simple CRM.
- CASL guidance from the Government of Canada: https://crtc.gc.ca/eng/com500/faq500.htm

## Practical example

Niche: independent bakeries in Winnipeg.

1. Found 30 on Google Maps; 18 had Instagram accounts that hadn't posted in two months.
2. Messaged 10 through their website contact forms, each with 3 sample captions written about their actual menu items (from their public menu).
3. Followed up once after five days.

Track replies and refine your message based on what gets responses.

## Expected costs

$0. Optional: a custom domain email (around US$6–$12 per month) looks more professional.

## How this earns revenue

Outreach creates conversations. Conversations become calls or emails where you present your service sheet and price. Expect most messages to get no reply. That's normal. Response rates depend on niche, message quality and timing, and no particular rate is guaranteed.

## Common mistakes

- **Mass generic messages:** "Do you need AI services?"
- **Leading with "AI"** instead of the business problem.
- **Too many follow-ups,** or ignoring opt-outs.
- **Free work that's too big.** Keep samples small.

## Action checklist

- [ ] Pick a niche and location.
- [ ] Build a 30-row prospect sheet with a noted gap for each.
- [ ] Create one small sample per prospect for your first 10.
- [ ] Send 10 personalised messages.
- [ ] Schedule follow-ups.

## Next steps

Continue to **Creating a portfolio of AI projects** so every message links to strong examples.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('fb0bff03-3331-5d5a-deeb-5ac82272906b', '11ab9621-635d-c98f-bc29-51fd114338be', 'Creating a portfolio of AI projects', 'Build three portfolio case studies that show the problem, your process and the result, honestly labelled.', 8, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('62a6ac30-9e9d-e44a-e259-9de601b06f62', 'fb0bff03-3331-5d5a-deeb-5ac82272906b', '11ab9621-635d-c98f-bc29-51fd114338be', 'creating-a-portfolio-of-ai-projects', 'Creating a portfolio of AI projects', 'Build three portfolio case studies that show the problem, your process and the result, honestly labelled.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('62a6ac30-9e9d-e44a-e259-9de601b06f62', $md$## Goal

Publish a simple online portfolio with three project write-ups that prospects can review in under two minutes.

## Prerequisites

- 2–3 completed samples (from earlier lessons).
- Startup cost: **$0**.

## Step-by-step instructions

1. **Choose three projects** that match the service you sell. Three strong ones beat ten random ones.
2. **Use a simple case-study structure for each:**
   - **Client type:** e.g. "Independent bakery (sample project)".
   - **Problem:** what was missing or slow.
   - **What I did:** your process, including where AI helped and where you edited or checked.
   - **Deliverables:** screenshots or excerpts.
   - **Result:** only real, verifiable outcomes. For sample projects, describe what the client would receive, not invented metrics.
3. **Label sample work honestly.** Projects you created for practice must be called "sample" or "concept" work. Never claim a business was your client if it wasn't.
4. **Build the page.** Use Google Sites, Notion, Canva Websites, or a simple website (see the Website Development course). Include your name, service, three case studies, and how to contact you.
5. **Add a clear call to action:** "Want this for your business? Email me at …"
6. **Ask permission** before showing real client work, and remove anything confidential.

## Tools and resources

- Google Sites: https://sites.google.com
- Notion: https://www.notion.so
- Canva Websites: https://www.canva.com/websites/

## Practical example

**"Concept project: Product descriptions for a candle shop"**

- **Problem:** one-line descriptions with no scent notes, burn time or care instructions.
- **Process:** a brief, AI drafts, manual editing, and checking against product details.
- **Deliverable:** before-and-after excerpts for 5 products.
- **Note:** "Concept project created for my portfolio; not commissioned by the business."

## Expected costs

$0 with free builders. A custom domain is optional, around US$10–$20 per year.

## How this earns revenue

Your portfolio is your proof. It turns "trust me" into "here's what I do", and makes outreach and proposals far more convincing.

## Common mistakes

- **Fake testimonials or results.** This destroys trust and may break advertising laws.
- **Showing raw AI output** rather than finished, edited work.
- **Too much text.** Use visuals and short bullet points.

## Action checklist

- [ ] Write three case studies.
- [ ] Publish your portfolio page.
- [ ] Add the link to your email signature and outreach template.

## Next steps

Continue to **Pricing and selling AI services**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('f430909e-1d8c-59ed-8a36-3c02c4ad07b6', '11ab9621-635d-c98f-bc29-51fd114338be', 'Pricing and selling AI services', 'Set prices, write a simple proposal, handle the sales conversation, and collect payment professionally.', 9, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('2b564e35-a773-6f07-0546-f04debf98ef4', 'f430909e-1d8c-59ed-8a36-3c02c4ad07b6', '11ab9621-635d-c98f-bc29-51fd114338be', 'pricing-and-selling-ai-services', 'Pricing and selling AI services', 'Set prices, write a simple proposal, handle the sales conversation, and collect payment professionally.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('2b564e35-a773-6f07-0546-f04debf98ef4', $md$## Goal

Set a price for your service, write a proposal, and set up a way to invoice and collect payment.

## Prerequisites

- A service sheet and portfolio.
- Startup cost: **$0** (invoicing tools have free options).

## Step-by-step instructions

1. **Calculate a floor price.** Estimate your hours per project, including edits and communication. Multiply by your target hourly rate. Add the cost of any tools used for the client. This is your minimum.
2. **Research market prices** for similar services on marketplaces and freelancer sites in your niche. Position yourself sensibly for your experience.
3. **Choose a pricing model:**
   - **Fixed project price,** for well-defined work.
   - **Monthly retainer,** for ongoing work.
   - **Per-item,** for bulk tasks.
4. **Use a deposit.** Common practice is 50% upfront for projects, or full payment upfront for monthly packages.
5. **Write a one-page proposal** (template below).
6. **Run the sales conversation.** Ask questions first (goals, current process, budget, deadline), then present the package that fits. If the budget is lower, reduce the scope, not your rate.
7. **Invoice and collect payment** with an invoicing tool that accepts cards or bank transfers. Keep records for taxes.

**Proposal template:**

> **Proposal: [Service] for [Business]**
>
> **Goal:** [their goal in their words]
>
> **Deliverables:** [list]
>
> **Timeline:** [dates]
>
> **Price:** [amount], with [deposit terms]
>
> **Included revisions:** [number]
>
> **Not included:** [list]
>
> **What I need from you:** [inputs, access]
>
> **Next step:** Reply "approved" and I'll send the deposit invoice.

## Tools and resources

- Wave (free invoicing, Canada and US): https://www.waveapps.com
- Stripe Invoicing: https://stripe.com/invoicing
- PayPal invoicing: https://www.paypal.com

## Practical example

**Social media caption pack for a café**

- Estimate: 6 hours a month.
- Target rate × 6, plus tool costs, gives your floor.
- Market research shows comparable packages priced above your floor, so price within that range.
- Offer: monthly retainer, paid upfront on the 1st, with a 3-month initial term and one revision round per batch.

## Expected costs

Payment processors charge fees per transaction, typically a few percent. Check current rates and include them in your pricing.

## How this earns revenue

This lesson is where revenue happens. A written proposal, a deposit and a clear scope protect your income and your time. Retainers create more predictable monthly revenue, but no client volume is guaranteed. Income depends on your outreach, quality and demand in your niche.

## Common mistakes

- **Starting work without a deposit** or written approval.
- **Pricing by "how long the AI took".**
- **Discounting your rate** instead of reducing scope.
- **No records** for tax time. You may need to register for GST/HST in Canada once your revenue crosses the small-supplier threshold. See the Starting an Online Business course.

## Action checklist

- [ ] Calculate your floor price.
- [ ] Research 5 comparable market prices.
- [ ] Write your proposal template.
- [ ] Set up a free invoicing account.

## Next steps

Finish with **Practical beginner projects** to build skills and portfolio pieces quickly.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('d54ed14c-3e36-89c0-8aac-288bb584d061', '11ab9621-635d-c98f-bc29-51fd114338be', 'Practical beginner projects', 'Five guided mini-projects that each produce a portfolio piece and practise a sellable skill.', 10, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('41356965-ef12-ecf9-5475-20faacd095f1', 'd54ed14c-3e36-89c0-8aac-288bb584d061', '11ab9621-635d-c98f-bc29-51fd114338be', 'practical-beginner-projects', 'Practical beginner projects', 'Five guided mini-projects that each produce a portfolio piece and practise a sellable skill.', 60, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('41356965-ef12-ecf9-5475-20faacd095f1', $md$## Goal

Complete at least three of the five projects below. Each produces a portfolio-ready sample you can show to prospects.

## Prerequisites

- Lessons 1–9 of this course.
- Startup cost: **$0**.

## Step-by-step instructions

Complete each project using the workflow brief → draft → edit → check → deliver.

1. **Product description refresh.** Pick a small online store (as a concept project). Rewrite 5 product descriptions with benefits, specs, sizing and care. Present them as before-and-after.
2. **Local business FAQ page.** For a service business type (dentist office admin FAQs, a gym, a dog groomer), write 10 FAQs using only verifiable general information. Mark anything business-specific as "[confirm with business]".
3. **Monthly content calendar.** Create a 4-week calendar for a café with 12 caption drafts and 4 graphic concepts.
4. **Enquiry automation demo.** Build the enquiry-to-draft automation from the automation lesson with a test form, then record a 2-minute demo video.
5. **Review response kit.** Write 10 response templates for positive, neutral and negative reviews for a restaurant, plus guidance on when the owner should reply personally.

For each project:

- Time yourself, so you can price future work.
- Write a short case study using the portfolio structure.
- Label it as a concept or sample project.

## Tools and resources

- Your AI assistant, Canva, Google Docs and Sheets, Zapier or Make, and Loom (https://www.loom.com) for demo videos.

## Practical example

**Project 5 output:**

- A Google Doc with 10 response templates.
- A tone guide (warm, specific, never defensive).
- A rule: "Never offer refunds or admit fault in writing without the owner's approval."

That last line shows clients you understand business risk, which is the kind of judgment they pay for.

## Expected costs

$0.

## How this earns revenue

These projects are your inventory of proof. Each matches a service you can offer. Use them in outreach ("here's an example of what I'd do for you") and price future work using the time you recorded.

## Common mistakes

- **Skipping the case study write-up.**
- **Doing projects unrelated to the service you sell.**
- **Presenting concept work as paid client work.**

## Action checklist

- [ ] Complete 3 of the 5 projects.
- [ ] Record the hours each one took.
- [ ] Add each to your portfolio.
- [ ] Send 10 outreach messages featuring the most relevant project.

## Next steps

You've completed the AI course pathway. Repeat the outreach cycle every week and refine your offer based on feedback. Consider taking **Freelancing From Zero** next to strengthen your client management and delivery systems.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.courses (id, slug, title, subtitle, description, category, icon, position, is_published)
values ('e46faa14-7394-cb7c-d104-88b4db005e7d', 'freelancing-from-zero', 'Freelancing From Zero', 'Choose a service, build a portfolio, win clients, deliver great work, and turn projects into repeat business.', 'The complete freelance workflow for beginners, covering positioning, portfolio, prospecting, outreach, proposals, pricing, client communication, delivery, invoicing and repeat work, with templates you can copy.', 'Freelancing', 'briefcase', 2, true)
on conflict (id) do update set slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle,
  description = excluded.description, category = excluded.category, icon = excluded.icon,
  position = excluded.position, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('51ab342e-075e-886c-4112-b59613fec2b3', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'How freelancing works', 'Understand the freelance business model, where clients come from, and what you need set up before your first project.', 1, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('584e99f4-1093-b54e-7097-34c8c0ff01fd', '51ab342e-075e-886c-4112-b59613fec2b3', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'how-freelancing-works', 'How freelancing works', 'Understand the freelance business model, where clients come from, and what you need set up before your first project.', 25, 1, true, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('584e99f4-1093-b54e-7097-34c8c0ff01fd', $md$## Goal

Understand how freelancers get paid, the main ways clients are found, and set up the basic admin you need before taking on work.

## Prerequisites

- A computer, an email address and a phone.
- Startup cost: **$0–$50** (optional domain and email).

## Step-by-step instructions

1. **Understand the model.** A freelancer is self-employed and sells services to clients per project, per hour or per month. You set prices, choose clients and handle your own taxes, invoices and admin.
2. **Know the three client channels:**
   - **Marketplaces** such as Upwork and Fiverr. Clients come to you, but competition and platform fees are high.
   - **Direct outreach** to businesses you choose. More effort, but you keep all fees and set your positioning.
   - **Referrals and network** from past clients, friends and local groups. This is often the best long-term channel.
3. **Set up a work identity:** a professional email (yourname@gmail.com is fine), a short bio, and a profile photo or logo.
4. **Create your admin folder** with sub-folders: Clients, Proposals, Contracts, Invoices, Receipts, Portfolio.
5. **Set up a simple money system.** Open a separate bank account for freelance income if you can, and track income and expenses in a spreadsheet from day one.
6. **Learn your tax basics.** In Canada, self-employment income is reported on your personal return, and you may need to register for GST/HST once you pass the small-supplier threshold. See the Starting an Online Business course, and check canada.ca for current rules or ask an accountant. Rules differ in other countries.
7. **Decide your weekly hours** for client work, outreach and learning. Consistency matters more than intensity.

## Tools and resources

- Upwork: https://www.upwork.com
- Fiverr: https://www.fiverr.com
- Canada Revenue Agency, self-employment: https://www.canada.ca/en/services/taxes/income-tax/personal-income-tax/self-employed.html

## Practical example

Sam wants to freelance as a video editor for 10 hours a week alongside a job. Sam:

- creates a Gmail and a short bio;
- sets up folders and a spreadsheet;
- opens a separate bank account;
- blocks Tuesday and Thursday evenings plus Saturday mornings: 6 hours of client work, 3 hours of outreach and 1 hour of admin.

## Expected costs

- Free setup is possible.
- Optional: domain and email (around US$10–$20 per year for the domain, plus email hosting), and accounting software.

## How this earns revenue

Clients pay for outcomes: edited videos, designed logos, written copy, built websites. Your income is your rate multiplied by billable work, minus fees and expenses. It depends entirely on how many clients you win and keep, so there is no fixed or guaranteed amount.

## Common mistakes

- **Mixing personal and business money.**
- **Ignoring taxes** until the end of the year.
- **Only using marketplaces** and never building direct relationships.

## Action checklist

- [ ] Choose your weekly freelance schedule.
- [ ] Create your folders and income/expense spreadsheet.
- [ ] Write a two-sentence bio.
- [ ] Read the CRA self-employment page (or your country's equivalent).

## Next steps

Continue to **Choosing a profitable service**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('89e6d122-8a99-72b8-362e-5698831f6560', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'Choosing a profitable service', 'Pick one service with clear demand, a reachable buyer, and a result you can deliver reliably.', 2, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('bbfb892b-c532-be84-2990-41c1a27bdcd2', '89e6d122-8a99-72b8-362e-5698831f6560', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'choosing-a-profitable-service', 'Choosing a profitable service', 'Pick one service with clear demand, a reachable buyer, and a result you can deliver reliably.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('bbfb892b-c532-be84-2990-41c1a27bdcd2', $md$## Goal

Choose a single service to sell, written as a clear offer statement.

## Prerequisites

- *How freelancing works*.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Brainstorm 15 services** you could learn or already do: video editing, bookkeeping support, social media management, copywriting, web design, virtual assistance, graphic design, data entry, translation, transcription, email marketing and so on.
2. **Check demand.** Search each on Upwork, Fiverr and Google ("hire [service] for small business") and note the number of listings and the price ranges.
3. **Check buyer reachability.** Can you name who buys it and where they are, such as "real estate agents in my city on Instagram"?
4. **Check deliverability.** Can you produce a professional sample within 2 weeks?
5. **Check value.** Does the result save the client money or time, or help them earn more? Higher-value outcomes support higher prices.
6. **Pick one service and one niche.** "Video editing for real estate agents" is easier to sell than "video editing for anyone".
7. **Write your offer:** "I help [niche] get [result] with [service]."

## Tools and resources

- Upwork, Fiverr and LinkedIn job search.
- A scoring spreadsheet.

## Practical example

Scores (1–5) across demand, reachability, deliverability and value:

| Service | Score |
|---|---|
| Video editing for real estate agents | 17 / 20 |
| General data entry | 11 / 20 (low price, high competition) |

Offer: *"I help real estate agents turn raw walkthrough footage into polished 60-second listing videos within 48 hours."*

## Expected costs

$0 to choose. Some services need tools. Video editing can start with free software such as DaVinci Resolve or CapCut.

## How this earns revenue

A niche service makes your marketing specific, which makes it easier to find buyers, charge appropriately and build referrals within one community.

## Common mistakes

- **Offering everything to everyone.**
- **Choosing purely on "what pays most"** without the skill to deliver.
- **Choosing regulated work** (legal, accounting sign-offs) without credentials.

## Action checklist

- [ ] Score 15 services.
- [ ] Pick one service and one niche.
- [ ] Write your offer statement.

## Next steps

Continue to **Identifying skills you can sell**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('7b773895-f41a-d12e-78f0-e017887577e9', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'Identifying skills you can sell', 'Audit your skills, close the gaps for your chosen service, and prove you can deliver with a practice project.', 3, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('9b546da1-4316-550c-87d9-6bf5e684adb6', '7b773895-f41a-d12e-78f0-e017887577e9', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'identifying-skills-you-can-sell', 'Identifying skills you can sell', 'Audit your skills, close the gaps for your chosen service, and prove you can deliver with a practice project.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('9b546da1-4316-550c-87d9-6bf5e684adb6', $md$## Goal

Create a skills gap plan for your service and complete one practice deliverable that meets a professional standard.

## Prerequisites

- A chosen service and niche.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Break the service into skills.** Real estate video editing, for example, needs cutting, colour correction, music licensing, captions, export settings and file delivery.
2. **Rate yourself 1–5** on each skill.
3. **Find free training for any gaps** (skills rated 3 or lower): official software tutorials, YouTube channels from tool makers, and practice files.
4. **Study three professional examples.** Find top-rated freelancers or agencies in your niche, note what makes their work look professional, and copy the standard, not the content.
5. **Complete a practice project** using free or self-made assets.
6. **Get feedback** from someone in the niche (for example a local agent) or an online community. Ask, "What would make this good enough to pay for?"
7. **Fix and finalize** the piece. It becomes portfolio item #1.

## Tools and resources

- Free learning: official tool tutorials (Adobe, Canva, DaVinci Resolve, Figma), freeCodeCamp (https://www.freecodecamp.org), Google Skillshop (https://skillshop.withgoogle.com).
- Feedback: niche communities (subreddits, Facebook groups). Follow their rules on self-promotion.

## Practical example

Skill gaps for real estate video editing were colour correction (2/5) and licensed music (1/5).

- **Plan:** follow 3 colour-correction tutorials in DaVinci Resolve, and learn royalty-free music licensing terms (YouTube Audio Library and paid libraries).
- **Practice:** shoot a walkthrough of your own home on a phone and edit a 60-second listing-style video.

## Expected costs

Mostly free. Paid courses or asset libraries are optional.

## How this earns revenue

Clients pay for reliable quality. Closing skill gaps before you sell avoids refunds, bad reviews and lost referrals.

## Common mistakes

- **Endless learning without shipping a sample.** Set a deadline.
- **Using copyrighted music or images** in samples.
- **Asking friends who'll only say "looks great".**

## Action checklist

- [ ] Write your skills breakdown and ratings.
- [ ] Complete training for your top 2 gaps.
- [ ] Finish one practice project.
- [ ] Get one round of honest feedback.

## Next steps

Continue to **Building a professional portfolio**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('2878ed64-1148-9011-b06d-09b4a8de4977', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'Building a professional portfolio', 'Create 3 strong samples and present them on a simple portfolio page with a clear call to action.', 4, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('eed1a921-0f31-ce39-7160-4565326e9c32', '2878ed64-1148-9011-b06d-09b4a8de4977', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'building-a-professional-portfolio', 'Building a professional portfolio', 'Create 3 strong samples and present them on a simple portfolio page with a clear call to action.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('eed1a921-0f31-ce39-7160-4565326e9c32', $md$## Goal

Publish a one-page portfolio with three relevant samples, a short bio and a contact method.

## Prerequisites

- One finished practice project.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Create two more samples** in your niche so you have three in total. Vary them, for example a 60-second listing video, a 15-second vertical teaser and a branded intro.
2. **Use spec projects ethically.** Create concept work for imaginary or anonymised businesses, or redo a public example in your own style. Label it as concept work.
3. **Offer 1–2 discounted or free pilot projects** to real people in your network (a friend's business, a local non-profit) in exchange for permission to show the work and honest feedback. Agree the scope in writing.
4. **Write each sample up:** client type, goal, what you did, the final result, and turnaround time.
5. **Build the page:** headline (your offer statement), 3 samples, a short bio, your process in 4 steps, and contact details. Use Google Sites, Carrd, Notion or a simple website.
6. **Add proof only if it's real.** Testimonials must be genuine and attributable, with permission.
7. **Test it on your phone.** Most prospects will view it there.

## Tools and resources

- Carrd: https://carrd.co
- Google Sites: https://sites.google.com
- Behance (designers): https://www.behance.net
- Vimeo or YouTube (unlisted) for video samples.

## Practical example

Portfolio headline: *"Listing videos for real estate agents, delivered in 48 hours."*

- Three embedded videos, each with a one-line caption.
- Process: send footage → edit → one revision → final files.
- Contact: email plus a link to a booking form.

## Expected costs

$0 with free builders. Carrd's paid plan and a domain are optional and inexpensive.

## How this earns revenue

Every outreach message and proposal links here. A strong, specific portfolio raises the share of conversations that turn into paid work.

## Common mistakes

- **Showing unrelated work** that confuses your niche.
- **Fake testimonials or logos** of businesses you didn't work with.
- **No call to action.**

## Action checklist

- [ ] Finish 3 samples.
- [ ] Publish the portfolio page.
- [ ] Ask 2 people to review it on their phones.

## Next steps

Continue to **Finding clients online**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('f1df6da5-7866-c7ea-2dbf-d8380365ae08', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'Finding clients online', 'Use marketplaces, direct prospecting and communities in parallel, and track everything in a simple pipeline.', 5, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('0a714ba4-5292-3656-fdcf-1f1e3e056338', 'f1df6da5-7866-c7ea-2dbf-d8380365ae08', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'finding-clients-online', 'Finding clients online', 'Use marketplaces, direct prospecting and communities in parallel, and track everything in a simple pipeline.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('0a714ba4-5292-3656-fdcf-1f1e3e056338', $md$## Goal

Set up a client pipeline across three channels and fill it with 40 prospects.

## Prerequisites

- Your portfolio.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Create a pipeline sheet** with columns: name, business, channel, link, observation, status (New → Contacted → Replied → Call → Proposal → Won/Lost), and next action date.
2. **Channel 1: Marketplaces.**
   - Create a complete Upwork or Fiverr profile focused on your niche: specific title, portfolio samples, clear packages.
   - Apply only to jobs that match your niche, with tailored proposals (see *Creating proposals*).
3. **Channel 2: Direct prospecting.**
   - Find businesses in your niche through Google Maps, Instagram, LinkedIn and industry directories.
   - Note a specific opportunity for each (for example "listings have photos but no video").
4. **Channel 3: Communities and network.**
   - Tell friends, family and past colleagues exactly what you do and who for.
   - Join 2–3 niche communities, contribute helpful answers, and follow their rules about promotion.
5. **Aim for 40 prospects.** Each one needs a specific observation recorded.
6. **Block time daily:** 30–60 minutes of prospecting and outreach, every working day.

## Tools and resources

- Upwork, Fiverr and LinkedIn: https://www.linkedin.com
- Google Maps and Instagram.
- Google Sheets, or a free CRM such as HubSpot CRM (https://www.hubspot.com/products/crm).

## Practical example

| Channel | Prospects |
|---|---|
| Agents from 3 local brokerages' websites | 25 |
| Agents active on Instagram but not posting videos | 10 |
| Upwork jobs tagged "real estate video" | 5 |

Each row notes something specific, such as "Posts photo carousels weekly; no reels in 3 months".

## Expected costs

- Marketplaces charge service fees on earnings and sometimes for bids. Check current fees.
- Direct outreach is free.

## How this earns revenue

A full pipeline is how freelancers avoid feast-or-famine. Consistent prospecting leads to consistent conversations, which lead to proposals and projects. Results vary and aren't guaranteed.

## Common mistakes

- **Waiting for marketplaces to send work.**
- **No tracking,** which means forgotten follow-ups.
- **Spamming communities.**

## Action checklist

- [ ] Build the pipeline sheet.
- [ ] Complete one marketplace profile.
- [ ] Add 40 prospects with observations.
- [ ] Tell 10 people in your network what you do.

## Next steps

Continue to **Writing outreach messages**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('f21a0f78-f27b-3239-d6e0-5c7129ce7fa7', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'Writing outreach messages', 'Write short, specific, permission-respecting outreach messages and follow-ups that start conversations.', 6, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('4605039d-4a36-2b18-39b7-043f4307fa5f', 'f21a0f78-f27b-3239-d6e0-5c7129ce7fa7', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'writing-outreach-messages', 'Writing outreach messages', 'Write short, specific, permission-respecting outreach messages and follow-ups that start conversations.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('4605039d-4a36-2b18-39b7-043f4307fa5f', $md$## Goal

Write and send 15 personalised outreach messages plus scheduled follow-ups.

## Prerequisites

- A pipeline with observations.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Use the 4-line structure:**
   1. A specific observation about them.
   2. The problem or opportunity it creates.
   3. How you help, with one relevant sample link.
   4. A low-pressure question.
2. **Keep it under 120 words.** No attachments on the first contact.
3. **Personalise line 1 for every prospect.** It's the line that gets read.
4. **Send through the right channel:** a published business email, a contact form, LinkedIn or Instagram DM. Follow anti-spam laws (CASL in Canada): identify yourself and offer an opt-out.
5. **Follow up once after 4–5 business days** with something useful, then stop.
6. **Log every message and reply** in your pipeline.

**Template:**

> Hi [Name],
>
> Saw your listing at [address/area]. The photos are great, but there's no walkthrough video, and video listings often hold attention longer on social media.
>
> I edit 60-second listing videos for agents, turned around in 48 hours. Here's one: [link].
>
> Would it be useful if I edited a short sample from footage of your next listing?
>
> [Name] · [portfolio] · Reply "stop" and I won't contact you again.

**Follow-up:**

> Hi [Name], quick follow-up. Here's a 15-second vertical version of that sample, which works well for reels: [link]. Happy to help if listing videos are on your radar.

## Tools and resources

- Your pipeline sheet.
- Gmail with scheduled send.
- LinkedIn or Instagram.

## Practical example

Of 15 messages sent:

- 2 asked for pricing;
- 1 sent footage for a paid trial;
- 12 didn't reply.

Two follow-ups produced one more reply. Track your numbers so you can improve line 1 and your offer.

## Expected costs

$0.

## How this earns revenue

Outreach is the top of your sales funnel. Better-targeted, more personal messages lead to more replies, which lead to more proposals.

## Common mistakes

- **Talking about yourself first.**
- **Long messages with your whole résumé.**
- **Fake familiarity** ("as we discussed").
- **More than one or two follow-ups.**

## Action checklist

- [ ] Write 15 personalised messages.
- [ ] Send them and log them.
- [ ] Schedule follow-ups.

## Next steps

Continue to **Creating proposals**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('62a19bbb-21d7-a730-dd98-954cba8bf160', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'Creating proposals', 'Turn a discovery conversation into a clear written proposal with scope, timeline, price and terms.', 7, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('7fa2a3f5-03fc-0101-2183-a09e8ed54f55', '62a19bbb-21d7-a730-dd98-954cba8bf160', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'creating-proposals', 'Creating proposals', 'Turn a discovery conversation into a clear written proposal with scope, timeline, price and terms.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('7fa2a3f5-03fc-0101-2183-a09e8ed54f55', $md$## Goal

Run a short discovery call and send a one-page proposal the client can approve.

## Prerequisites

- An interested prospect.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Hold a 15–20 minute discovery call.** Ask:
   - What are you trying to achieve?
   - How do you handle this now?
   - What does success look like?
   - What's your deadline?
   - Is there a budget range you're working with?
   - Who approves the decision?
2. **Repeat back their goal** in your own words to confirm you understood.
3. **Send the proposal within 24 hours** using the template below.
4. **Offer 2–3 options** if helpful (for example 1 video, a 4-video pack, or a monthly package). Keep them simple.
5. **Include terms:** payment schedule, revisions, what's not included, how long the proposal is valid, and cancellation.
6. **Ask for a clear yes:** "Reply 'approved' and I'll send the deposit invoice and onboarding form."
7. **For larger work, use a simple contract.** Many freelancers use a services agreement template reviewed by a lawyer for their jurisdiction.

**Proposal template:**

> **[Client] · [Service] proposal** · Valid until [date]
>
> **Your goal:** …
>
> **What you'll get:** …
>
> **Timeline:** …
>
> **Investment:** Option A … / Option B …
>
> **Payment:** 50% deposit to start, 50% on delivery (or monthly in advance)
>
> **Revisions:** 1 round included; extra rounds billed at [rate]
>
> **Not included:** …
>
> **Next step:** …

## Tools and resources

- Google Docs or Canva for proposals.
- Zoom, Google Meet or a phone call for discovery.
- Calendly (https://calendly.com), free tier, for booking calls.

## Practical example

An agent wants videos for 3 listings this month. The proposal offers:

- **Option A:** single video.
- **Option B:** 3-video pack at a lower per-video price.

Both include a 48-hour turnaround and one revision round. The agent chooses B and pays the deposit.

## Expected costs

$0.

## How this earns revenue

A written proposal prevents misunderstandings, sets payment terms and makes it easy for clients to say yes. Offering a package raises the average project size.

## Common mistakes

- **Sending a price without understanding the goal.**
- **Unlimited revisions.**
- **No deposit.**
- **Proposals that are too long.**

## Action checklist

- [ ] Write your discovery questions.
- [ ] Build your proposal template.
- [ ] Find a reputable services agreement template and have it reviewed if you can.

## Next steps

Continue to **Setting prices**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('f9c72be2-d89f-a843-54d1-f4f054954b86', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'Setting prices', 'Calculate a sustainable rate, choose a pricing model, and raise prices as you gain proof.', 8, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('b406422e-34c7-3363-f884-93058d50fb31', 'f9c72be2-d89f-a843-54d1-f4f054954b86', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'setting-prices', 'Setting prices', 'Calculate a sustainable rate, choose a pricing model, and raise prices as you gain proof.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('b406422e-34c7-3363-f884-93058d50fb31', $md$## Goal

Set your starting price for your main service using a cost-based floor and market research.

## Prerequisites

- Time estimates from practice projects.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Estimate total hours per project,** including communication, revisions and admin, not just production.
2. **Set your target hourly income.** Consider living costs, taxes, unpaid time (outreach, admin) and tool costs.
3. **Calculate the floor:** hours × target rate + direct costs (stock assets, software) + payment fees.
4. **Research the market.** Find 10 comparable offers and note their range.
5. **Choose a model:**
   - **Fixed project:** best for clear scope.
   - **Packages:** good for repeat work.
   - **Retainer:** monthly ongoing work.
   - **Hourly:** for unclear scope, with a cap.
6. **Set your price** at or above your floor and within the market range for your experience level.
7. **Plan raises:** review prices every 3–5 projects as your portfolio and speed improve. Give existing clients notice.

## Tools and resources

- A spreadsheet with a pricing calculator.
- Marketplace listings for research.

## Practical example

| Item | Amount |
|---|---|
| Time per listing video (including revisions and communication) | 3 hours |
| Target rate | your number |
| Music licence | proportional share |
| Payment fees | about 3% |

The floor is the total of these. Comparable offers sat in a range above it, so a beginner price slightly below the middle of the range was chosen, with a plan to raise it after 5 projects.

## Expected costs

- Payment processing fees.
- Tool subscriptions. Spread these across projects.

## How this earns revenue

Correct pricing means each project actually covers your time and costs. Underpricing feels safer but often leads to burnout and lower-quality clients.

## Common mistakes

- **Forgetting non-billable hours.**
- **Competing on the lowest price.**
- **Not accounting for tax.**
- **Never raising prices.**

## Action checklist

- [ ] Build your pricing calculator.
- [ ] Set your current price.
- [ ] Write it into your proposal template.

## Next steps

Continue to **Communicating with clients**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('be02a18c-599a-eb2d-3bb3-bbaf171ce052', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'Communicating with clients', 'Onboard clients smoothly, set expectations, handle feedback and scope changes professionally.', 9, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('57b1cc08-0c49-31cb-bc93-c9f54f9d923b', 'be02a18c-599a-eb2d-3bb3-bbaf171ce052', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'communicating-with-clients', 'Communicating with clients', 'Onboard clients smoothly, set expectations, handle feedback and scope changes professionally.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('57b1cc08-0c49-31cb-bc93-c9f54f9d923b', $md$## Goal

Create an onboarding process and communication templates that keep projects on track.

## Prerequisites

- A won project, or a practice scenario.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Send a welcome email** after the deposit, covering what happens next, the timeline, how and when you communicate, and what you need from them.
2. **Collect everything with an onboarding form:** brand assets, logins (shared securely, never by plain email if avoidable), examples and contacts.
3. **Set communication rules:** your response time (for example within 1 business day), working hours and preferred channel.
4. **Send short progress updates** at agreed milestones.
5. **Handle feedback structurally.** Ask for all revision notes in one message. Confirm the list back before making changes.
6. **Handle scope changes.** If they ask for something outside scope, reply: "Happy to add that. It's outside the current scope, so it would be [price/time]. Want me to add it?"
7. **Deal with problems early.** If you'll miss a deadline, tell them before it passes, with a new date.

**Scope-change template:**

> Thanks, [Name]! Adding [request] is outside the original scope ([original deliverables]). I can do it for [price] and deliver by [date]. Shall I go ahead?

## Tools and resources

- Google Forms or Tally for onboarding.
- Google Drive or Dropbox for files.
- A password manager such as Bitwarden (https://bitwarden.com) for securely shared logins.

## Practical example

The agent asks for a fourth video mid-project. Using the scope template, it is quoted and approved, and an invoice is sent before work starts.

## Expected costs

$0.

## How this earns revenue

Smooth communication leads to happy clients, which leads to repeat work and referrals. Clear scope-change handling turns extra requests into extra revenue instead of unpaid work.

## Common mistakes

- **Silent periods** that make clients anxious.
- **Agreeing to extras for free.**
- **Taking feedback in scattered messages.**

## Action checklist

- [ ] Write a welcome email template.
- [ ] Create an onboarding form.
- [ ] Save the scope-change template.

## Next steps

Continue to **Delivering work and getting paid**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('a0e67122-c22c-1560-2242-cd86521c5c40', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'Delivering work and getting paid', 'Deliver professionally, invoice correctly, follow up on late payments, and keep records.', 10, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('c66197f5-84a6-9869-6183-8165d7f1db0a', 'a0e67122-c22c-1560-2242-cd86521c5c40', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'delivering-work-and-getting-paid', 'Delivering work and getting paid', 'Deliver professionally, invoice correctly, follow up on late payments, and keep records.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('c66197f5-84a6-9869-6183-8165d7f1db0a', $md$## Goal

Run a clean delivery process: quality check, delivery package, invoice and payment follow-up.

## Prerequisites

- A project in progress.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Quality check against the proposal.** Is every deliverable included, correct and in the right format?
2. **Package the delivery:** organised files, clear file names, and a short note on how to use them.
3. **Send the final invoice** with your business name and contact, the client's details, invoice number, date, description, amount, taxes if registered, due date and payment methods.
4. **Use clear payment terms,** for example "Due within 7 days".
5. **Follow up on late payments politely:**
   - Day 1 overdue: friendly reminder.
   - Day 7: firmer reminder.
   - Day 14: phone call.
   - Keep records of everything.
6. **Release final files after payment** where appropriate. Agree this upfront in your terms.
7. **Record income and expenses** immediately and save receipts.

**Reminder template:**

> Hi [Name], a friendly reminder that invoice #[number] for [project] was due on [date]. Here's the payment link: [link]. Let me know if you have any questions!

## Tools and resources

- Wave: https://www.waveapps.com
- Stripe Invoicing: https://stripe.com/invoicing
- PayPal: https://www.paypal.com

## Practical example

Delivery of the 3-video pack:

- Files: `123-Main-St_60s.mp4`, `123-Main-St_vertical_15s.mp4`, plus captions.
- Invoice #0007 for the 50% balance, due in 7 days, payable by card or bank transfer.
- Paid in 3 days and recorded in the spreadsheet.

## Expected costs

Payment fees of a few percent per transaction. Check your provider.

## How this earns revenue

This is where you actually get paid. Professional invoices and steady follow-up reduce late payments.

## Common mistakes

- **Delivering everything before the final payment** on the first project with a new client.
- **Vague invoices.**
- **Not tracking overdue invoices.**

## Action checklist

- [ ] Create an invoice template in an invoicing tool.
- [ ] Write a delivery note template.
- [ ] Save the reminder templates.

## Next steps

Continue to **Turning one-time projects into repeat business**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('99f4cad2-b046-04bf-bc56-2c7ddfc5715b', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'Turning one-time projects into repeat business', 'Ask for feedback and referrals, offer ongoing packages, and stay in touch so clients come back.', 11, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('e57922b3-d58d-5b8b-b656-f25cf9ef48ea', '99f4cad2-b046-04bf-bc56-2c7ddfc5715b', 'e46faa14-7394-cb7c-d104-88b4db005e7d', 'turning-one-time-projects-into-repeat-business', 'Turning one-time projects into repeat business', 'Ask for feedback and referrals, offer ongoing packages, and stay in touch so clients come back.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('e57922b3-d58d-5b8b-b656-f25cf9ef48ea', $md$## Goal

Convert at least one finished client into repeat work or a referral using a simple follow-up system.

## Prerequisites

- At least one completed project.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Ask for feedback** within a week of delivery: "What worked well? What could be better?"
2. **Request a testimonial** if they're happy, and ask permission to display it with their name or business.
3. **Offer a natural next step,** such as a monthly package based on what they bought (for example "videos for every new listing, billed monthly").
4. **Ask for referrals specifically:** "Do you know another agent who'd find this useful? I'd be grateful for an intro."
5. **Schedule check-ins** at 30, 60 and 90 days with something useful: an idea, a trend or a quick tip.
6. **Track client lifetime value** in your sheet (total earned per client) so you can see which client types to focus on.
7. **Raise prices for new clients** first, and give existing clients notice before increasing theirs.

**Retainer offer template:**

> Hi [Name], glad the listing videos worked well! Since you list regularly, I can handle videos for every new listing for a fixed monthly fee covering up to [X] videos, with 48-hour turnaround. Want me to send details?

## Tools and resources

- Your pipeline sheet (add a "Clients" tab).
- Calendar reminders.

## Practical example

After delivering 3 videos, Sam asked for feedback and got a testimonial. Sam then offered a monthly package for up to 4 videos. The agent agreed to a 3-month trial and introduced Sam to a colleague.

## Expected costs

$0.

## How this earns revenue

Keeping a client is usually easier than finding a new one. Retainers and referrals make income steadier over time, though nothing is guaranteed.

## Common mistakes

- **Disappearing after delivery.**
- **Never asking for referrals.**
- **Retainers without clear limits.**

## Action checklist

- [ ] Send feedback requests to all finished clients.
- [ ] Create a retainer offer.
- [ ] Set 30/60/90-day reminders.

## Next steps

You've completed the freelancing pathway. Repeat the prospecting → proposal → delivery → repeat cycle weekly. Pair this course with a skills course (AI, Websites or Digital Marketing) to deepen your service.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.courses (id, slug, title, subtitle, description, category, icon, position, is_published)
values ('c7d4cddb-573d-ce49-2e92-1e8451e89298', 'building-and-selling-websites', 'Building and Selling Websites', 'Build professional websites for local businesses, publish them, find clients, quote, get paid and offer maintenance.', 'Go from zero to selling websites. Choose the right tool, build a site for a real type of business (including with AI coding tools like Claude Code), publish it on a domain, find businesses that need one, present a preview, price the project, collect payment, deliver, and earn recurring maintenance revenue.', 'Website Development', 'code', 3, true)
on conflict (id) do update set slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle,
  description = excluded.description, category = excluded.category, icon = excluded.icon,
  position = excluded.position, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('31c90ea5-f6de-ef5d-b7e9-ba0474183bb7', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'Website development fundamentals', 'Understand how websites work and choose the right building approach for each client.', 1, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('2063b010-ba25-04cc-a623-40617c129a08', '31c90ea5-f6de-ef5d-b7e9-ba0474183bb7', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'website-development-fundamentals', 'Website development fundamentals', 'Understand how websites work and choose the right building approach for each client.', 30, 1, true, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('2063b010-ba25-04cc-a623-40617c129a08', $md$## Goal

Understand the parts of a website (domain, hosting, pages, forms) and choose between a website builder and custom code for a given client.

## Prerequisites

- A computer and a browser.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Learn the core parts:**
   - **Domain:** the address, e.g. `joesplumbing.ca`.
   - **Hosting:** the server that stores and serves the site.
   - **Pages:** HTML for structure, CSS for design, JavaScript for interactivity.
   - **DNS:** points the domain at the hosting.
   - **SSL/HTTPS:** encryption, usually free and automatic on modern hosts.
2. **Know the three ways to build:**
   - **Website builders** (Wix, Squarespace, Shopify for stores): fast, with monthly fees paid by the client and easy client editing.
   - **WordPress:** flexible and huge ecosystem, but needs maintenance and security updates.
   - **Custom code** (HTML/CSS/JS or frameworks, often written with AI coding tools): fast, cheap hosting and full control, but the client usually needs you for edits.
3. **Match the tool to the client** with this decision guide:
   - Client wants to edit pages themselves often → builder.
   - Online store → Shopify or another e-commerce builder.
   - Simple brochure site, client happy for you to make edits → custom code or a builder.
   - Blog-heavy → WordPress or a builder with a good blog.
4. **Learn what a small business site needs:** a clear headline, services, location and service area, contact details, a click-to-call button, a contact form, reviews or proof (real only), photos, opening hours, and a mobile-friendly layout.
5. **Study 5 good local business websites** and note what makes them easy to use on a phone.

## Tools and resources

- MDN Web Docs (learn HTML/CSS): https://developer.mozilla.org/en-US/docs/Learn
- Wix: https://www.wix.com · Squarespace: https://www.squarespace.com · Shopify: https://www.shopify.com · WordPress.org: https://wordpress.org

## Practical example

**Client:** a two-person landscaping company. They want a simple site and rarely change it, and they want enquiries.

**Choice:** a fast custom-coded or builder site with Home, Services, Gallery and Contact. The form sends to their email, and there's a click-to-call button. Hosting is low-cost or free. You offer edits as part of a maintenance plan.

## Expected costs

| Item | Typical cost |
|---|---|
| Domain | About US$10–$25 per year |
| Builders | Monthly subscriptions, usually paid by the client |
| Custom static hosting | Often free on platforms like Netlify, Vercel or Cloudflare Pages for small sites (check current limits) |

## How this earns revenue

Businesses pay for:

- the build (one-time project fee);
- ongoing maintenance and edits (monthly);
- sometimes hosting management.

The value is more enquiries and credibility. You never promise a specific number of leads.

## Common mistakes

- **Choosing a tool the client can't afford** to keep paying for.
- **Ignoring mobile users.**
- **Forgetting basics** like a phone number at the top.

## Action checklist

- [ ] Write definitions of domain, hosting, DNS and SSL in your own words.
- [ ] Review 5 local business websites on your phone and list 3 strengths and 3 problems for each.
- [ ] Decide which building approach you'll learn first.

## Next steps

Continue to **Using AI coding tools**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('70acb5d3-01b9-770a-ca46-f2571bf1ef08', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'Using AI coding tools', 'Use AI assistants to write, explain and fix website code, safely and with understanding.', 2, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('f8634def-e308-2cbd-5d25-760eb243b9b9', '70acb5d3-01b9-770a-ca46-f2571bf1ef08', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'using-ai-coding-tools', 'Using AI coding tools', 'Use AI assistants to write, explain and fix website code, safely and with understanding.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('f8634def-e308-2cbd-5d25-760eb243b9b9', $md$## Goal

Build and edit a simple one-page website with an AI assistant, understanding what each part of the code does.

## Prerequisites

- A free AI assistant account.
- A code editor: Visual Studio Code (free).
- Startup cost: **$0**.

## Step-by-step instructions

1. **Install VS Code** (https://code.visualstudio.com) and create a folder called `first-site`.
2. **Ask AI for a starter page:** *"Create a single index.html file with embedded CSS for a mobile-friendly one-page website for a dog grooming business. Include a header with a click-to-call button, services with prices as placeholders, a gallery section using placeholder boxes, opening hours, and a contact section. Use semantic HTML and accessible colour contrast."*
3. **Save the code** as `index.html` and open it in your browser.
4. **Ask AI to explain it:** "Explain this file section by section for a beginner." Read the explanation. This is how you learn rather than just copy.
5. **Make three edits yourself,** then ask AI to check them: change colours, add a section, fix spacing on mobile.
6. **Test on mobile size:** in Chrome, right-click → Inspect → toggle device toolbar.
7. **Use AI to debug:** paste any error or describe the visual problem, and ask for the minimal fix.
8. **Keep versions:** save copies before big changes, or learn basic Git later.

## Tools and resources

- VS Code: https://code.visualstudio.com
- MDN Web Docs: https://developer.mozilla.org
- AI assistants: Claude (https://claude.ai), ChatGPT (https://chatgpt.com)

## Practical example

A beginner builds "Pawfect Grooming" as a one-page site in an afternoon. They change the colour palette, add a "First visit? Here's what to expect" section, and fix a mobile layout issue where buttons overlapped, by asking AI: *"On a 375px-wide screen the two buttons overlap. Fix only the CSS for that."*

## Expected costs

$0.

## How this earns revenue

AI coding tools let you build client sites faster. You still sell the outcome: a professional site that works, loads fast and brings in enquiries. Speed lets you charge competitively while keeping a healthy hourly return.

## Common mistakes

- **Copying code you don't understand.** Always ask for explanations.
- **Huge prompts that rebuild everything.** Request small, specific changes.
- **Never testing on a real phone.**

## Action checklist

- [ ] Install VS Code.
- [ ] Generate, explain and edit a one-page site.
- [ ] Fix one mobile layout issue.

## Next steps

Continue to **Building websites with Claude Code**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('55936885-a69f-596b-1ade-5b2f1c170aaa', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'Building websites with Claude Code', 'Use Claude Code, an agentic coding tool, to plan, build, test and revise a multi-page business website.', 3, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('470b76d7-20c3-2586-689c-3aa2c3fb93d9', '55936885-a69f-596b-1ade-5b2f1c170aaa', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'building-websites-with-claude-code', 'Building websites with Claude Code', 'Use Claude Code, an agentic coding tool, to plan, build, test and revise a multi-page business website.', 45, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('470b76d7-20c3-2586-689c-3aa2c3fb93d9', $md$## Goal

Use Claude Code to build a multi-page business website from a written brief, review its changes, and iterate.

## Prerequisites

- A Claude account with access to Claude Code (check current plan requirements at https://claude.com/claude-code).
- Comfort opening a terminal, or use Claude Code in the desktop or web app.
- Startup cost: depends on your Claude plan.

## Step-by-step instructions

1. **Install or open Claude Code.** Follow the official setup guide at https://docs.claude.com/en/docs/claude-code/overview. You can use the terminal, an IDE extension, or the web version.
2. **Create a project folder** and start Claude Code inside it.
3. **Write a clear brief** covering:
   - business name and type, location and service area;
   - pages: Home, Services, About, Gallery, Contact;
   - brand colours;
   - must-haves: click-to-call, contact form, opening hours, mobile-first, fast loading, basic SEO titles and descriptions;
   - what to avoid: fake reviews, stock photos of people.
4. **Ask it to plan first:** *"Read this brief and propose a file structure and page outline before writing code."* Approve or adjust.
5. **Let it build, then review.** Read the summary of changes, open the files, and run the site locally (ask Claude Code how: often just opening `index.html` or running a dev server).
6. **Iterate in small requests:** "Make the header sticky on mobile", "Replace placeholder text on Services with this copy: …".
7. **Ask it to test:** check broken links, check mobile layout, and validate HTML. Ask it to explain anything you don't understand.
8. **Set up the contact form** with a form service (such as Formspree) or the host's built-in forms, and test that submissions arrive.
9. **Keep it in Git** so you can roll back changes. Claude Code can initialise a repository for you.

## Tools and resources

- Claude Code docs: https://docs.claude.com/en/docs/claude-code/overview
- Formspree: https://formspree.io
- Netlify Forms: https://docs.netlify.com/forms/setup/

## Practical example

**Brief:** "Northside Auto Detailing" in Surrey, BC, with services and price ranges supplied by the owner, a gallery of the owner's own photos, and a booking request form.

Claude Code proposed 5 HTML pages plus shared CSS and JS. After the first build, the student asked for:

- larger tap targets for phone buttons;
- a "Service area" section listing nearby cities;
- an image compression pass.

The form was connected to Formspree and tested with a real submission.

## Expected costs

- Claude plan cost (see the current pricing page).
- Form services have free tiers with monthly submission limits.

## How this earns revenue

Agentic tools reduce build time for standard business sites, so you can deliver more projects or offer quicker turnaround. Your value is the brief, design judgment, testing, content quality, publishing and ongoing support.

## Common mistakes

- **Vague briefs,** which produce generic sites.
- **Not reviewing changes** before delivering.
- **Placeholder text left in production.** Search for "Lorem" and "placeholder" before launch.

## Action checklist

- [ ] Write a full brief for a real type of local business.
- [ ] Build a 4–5 page site with Claude Code.
- [ ] Test the contact form and mobile layout.
- [ ] Commit the project to Git.

## Next steps

Continue to **Planning and designing a business website**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('b867abbc-f5e7-3aae-5131-323a79406f1e', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'Planning and designing a business website', 'Plan pages, content and design that turn visitors into enquiries for a local business.', 4, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('72d1999d-f276-5461-3e43-9c3a373e7a70', 'b867abbc-f5e7-3aae-5131-323a79406f1e', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'planning-and-designing-a-business-website', 'Planning and designing a business website', 'Plan pages, content and design that turn visitors into enquiries for a local business.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('72d1999d-f276-5461-3e43-9c3a373e7a70', $md$## Goal

Produce a one-page site plan (sitemap, page sections, content list and style guide) before building.

## Prerequisites

- Fundamentals lesson.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Define the goal:** usually calls, form enquiries or bookings.
2. **Define the visitor:** who they are, what they need to know, and what makes them hesitate (price, trust, availability).
3. **Create a sitemap:** Home, Services (or one page per main service), About, Gallery or Projects, Contact. Add FAQ and Service Area pages if useful.
4. **Plan the homepage from top to bottom:**
   1. Headline (what you do, where).
   2. Call-to-action buttons.
   3. Services.
   4. Proof: real reviews with permission, licences or insurance if applicable.
   5. Process.
   6. Gallery.
   7. FAQ.
   8. Contact.
5. **Gather content from the client:** logo, photos, services and prices, real reviews, hours, service area, and licence or insurance details. Use a content checklist.
6. **Make a simple style guide:** 2 fonts, 3–5 colours from their logo, button style and photo style.
7. **Sketch the layout** on paper or in Figma for mobile first, then desktop.
8. **Plan basic SEO:** a unique page title and meta description per page, the location mentioned naturally, and a Google Business Profile link.

## Tools and resources

- Figma (free tier): https://www.figma.com
- Google Fonts: https://fonts.google.com
- Coolors (palette tool): https://coolors.co

## Practical example

**Plumber homepage plan:**

- Headline: "Licensed plumbing repairs in Kelowna. Same-week appointments."
- Buttons: Call now, Request a quote.
- Services: 6 cards.
- Real Google reviews (with permission) and licence number.
- A 3-step process, a photo gallery, an FAQ about pricing and emergencies, and a contact form plus map.

## Expected costs

$0.

## How this earns revenue

Good planning means fewer revisions and a site that actually converts visitors into enquiries, which is what keeps clients paying for maintenance and referring others.

## Common mistakes

- **Designing before getting content.**
- **Hiding the phone number.**
- **Using fake reviews or claims.**

## Action checklist

- [ ] Create a content checklist to send to clients.
- [ ] Make a sitemap and homepage outline for one business type.
- [ ] Create a simple style guide.

## Next steps

Continue to **Using domains and web hosting**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('6c3aecd1-ee3e-5cb9-7ecf-a35da621bd27', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'Using domains and web hosting', 'Register a domain in the client''s name, choose hosting, connect DNS and enable HTTPS.', 5, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('00f59ed3-8563-d7c1-e8f8-9d31ae9ae418', '6c3aecd1-ee3e-5cb9-7ecf-a35da621bd27', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'using-domains-and-web-hosting', 'Using domains and web hosting', 'Register a domain in the client''s name, choose hosting, connect DNS and enable HTTPS.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('00f59ed3-8563-d7c1-e8f8-9d31ae9ae418', $md$## Goal

Understand how to register a domain, choose hosting and connect them, including who should own each account.

## Prerequisites

- A finished site, or a practice site.
- Startup cost: around US$10–$25 for a practice domain (optional).

## Step-by-step instructions

1. **Ownership rule:** register the domain in the **client's name and account** (or transfer it to them). Owning a client's domain yourself can damage trust.
2. **Pick a registrar:** Cloudflare Registrar, Namecheap, Google Domains' successor Squarespace Domains, or a local registrar for .ca (must be CIRA-certified).
3. **Choose a domain:** short, easy to spell, ideally `.ca` or `.com` with the business name or name plus city.
4. **Choose hosting by site type:**
   - Static or custom sites: Netlify, Vercel or Cloudflare Pages.
   - WordPress: managed WordPress hosting.
   - Builders: hosting is included.
5. **Connect DNS.** Follow the host's instructions to add the A, CNAME or nameserver records at the registrar. DNS changes can take minutes to hours.
6. **Enable HTTPS.** Most modern hosts issue free SSL certificates automatically. Check for the padlock.
7. **Set up business email** if needed, using the client's own account (for example Google Workspace or Microsoft 365).
8. **Document everything** for the client: registrar, renewal date, hosting, logins (stored in their password manager) and DNS records.

## Tools and resources

- Cloudflare Registrar: https://www.cloudflare.com/products/registrar/
- Namecheap: https://www.namecheap.com
- CIRA (.ca registrars): https://www.cira.ca
- Netlify: https://www.netlify.com · Vercel: https://vercel.com · Cloudflare Pages: https://pages.cloudflare.com

## Practical example

**Northside Auto Detailing:**

1. The client registered `northsidedetailing.ca` in their own Namecheap account and gave the developer delegated access.
2. The site was deployed to Netlify, and the domain added in Netlify.
3. The DNS records Netlify specified were added at Namecheap.
4. HTTPS was active within an hour.
5. A one-page "Website Accounts" document was handed over.

## Expected costs

| Item | Typical cost |
|---|---|
| Domain | About US$10–$25 per year (.ca and .com vary) |
| Static hosting | Often free for small sites |
| Managed WordPress | Monthly fees |
| Business email | Per user per month |

## How this earns revenue

You can charge a setup fee for domain, DNS and hosting configuration, and include monitoring and renewals in a maintenance plan.

## Common mistakes

- **Registering client domains in your own name.**
- **Letting domains expire.** Turn on auto-renew in the client's account.
- **Sharing passwords insecurely.**

## Action checklist

- [ ] Write a "Website Accounts" handover template.
- [ ] Deploy a practice site to a free host.
- [ ] Optional: connect a practice domain and verify HTTPS.

## Next steps

Continue to **Publishing a website**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('fe0300b9-31a6-957f-db5e-a92357fce3a1', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'Publishing a website', 'Run a pre-launch checklist, deploy, test and hand over a live website.', 6, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('f86eb2dd-a143-5a8c-28a3-508c646eefc6', 'fe0300b9-31a6-957f-db5e-a92357fce3a1', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'publishing-a-website', 'Publishing a website', 'Run a pre-launch checklist, deploy, test and hand over a live website.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('f86eb2dd-a143-5a8c-28a3-508c646eefc6', $md$## Goal

Launch a website using a professional pre-launch checklist.

## Prerequisites

- A finished site plus hosting.
- Startup cost: as above.

## Step-by-step instructions

1. **Content check:** no placeholder text, correct phone, address, hours and prices, and correct spelling.
2. **Function check:** every link works, the contact form delivers (test with a real submission), click-to-call works on a phone, and the map loads.
3. **Mobile check:** test on at least one iPhone and one Android-size screen.
4. **Speed check:** compress images (WebP or JPEG), and run Google PageSpeed Insights.
5. **SEO basics:** page titles and descriptions, image alt text, a favicon, a sitemap, and robots settings that allow indexing.
6. **Legal basics:** a privacy policy if the form collects personal info, and cookie or analytics notices if required where the client operates.
7. **Deploy** to production and connect the domain.
8. **Post-launch:**
   - Submit the sitemap to Google Search Console in the client's account.
   - Link the site from their Google Business Profile.
   - Test everything again on the live domain.

## Tools and resources

- PageSpeed Insights: https://pagespeed.web.dev
- Google Search Console: https://search.google.com/search-console
- Google Business Profile: https://www.google.com/business/
- Squoosh (image compression): https://squoosh.app

## Practical example

Before launch, the checklist caught:

- an old phone number in the footer;
- a contact form that went to the developer's email instead of the client's;
- 4 MB gallery images, compressed to under 300 KB each.

After the fixes, the site was deployed and the client was shown how a form submission arrives.

## Expected costs

$0 beyond hosting and domain.

## How this earns revenue

A clean launch is what you're paid the final instalment for. A launch checklist is also a professional selling point: "Every site goes through a 30-point launch checklist."

## Common mistakes

- **Forms that go nowhere.**
- **Giant images.**
- **Forgetting to update the Google Business Profile link.**

## Action checklist

- [ ] Create your 30-point launch checklist.
- [ ] Run it on your practice site.
- [ ] Check your site's PageSpeed scores and fix the top 2 issues.

## Next steps

Continue to **Contact forms and lead generation**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('7bd2f8bc-fd31-bfd4-cd4b-fac7498b5b59', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'Contact forms and lead generation', 'Build forms and calls-to-action that make it easy for visitors to become enquiries, and track them.', 7, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('0d568463-3e9a-0084-cd3a-7143b5675cf1', '7bd2f8bc-fd31-bfd4-cd4b-fac7498b5b59', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'contact-forms-and-lead-generation', 'Contact forms and lead generation', 'Build forms and calls-to-action that make it easy for visitors to become enquiries, and track them.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('0d568463-3e9a-0084-cd3a-7143b5675cf1', $md$## Goal

Add a working, spam-protected contact form, clear calls-to-action, and simple enquiry tracking.

## Prerequisites

- A live or practice site.
- Startup cost: **$0** (free tiers).

## Step-by-step instructions

1. **Put calls-to-action everywhere they help:** a phone button in the header, a "Request a quote" button after the services, and a form on the contact page.
2. **Keep forms short:** name, phone or email, service needed, message, and optionally a preferred date or photos.
3. **Connect the form** using a form service or the host's forms, sending to the client's email and optionally a spreadsheet.
4. **Add spam protection:** a honeypot field, or a CAPTCHA option from the form provider.
5. **Show a clear success message:** "Thanks! We reply within 1 business day."
6. **Set up an auto-reply** to the customer confirming receipt, if the form service supports it.
7. **Track enquiries:** add privacy-respecting analytics (such as Plausible, or Google Analytics with consent where required) and count form submissions as conversions.
8. **Review monthly with the client:** number of enquiries, the sources and common questions. Use the questions to improve the FAQ.

## Tools and resources

- Formspree: https://formspree.io · Netlify Forms: https://docs.netlify.com/forms/setup/
- Plausible: https://plausible.io · Google Analytics: https://analytics.google.com

## Practical example

**Landscaper site:**

- The form has a "Project type" dropdown (lawn care, garden design, cleanup) and an optional photo upload.
- Submissions go to the owner's email and a Google Sheet.
- The success message promises a reply within 24 hours on weekdays.

## Expected costs

- Form services: free tiers with monthly limits; paid plans are a few dollars a month.
- Analytics: free (Google) or paid (privacy-focused tools).

## How this earns revenue

Lead tracking proves your website's value to the client, which supports renewals and maintenance plans. "Lead generation setup" can be sold as an add-on.

## Common mistakes

- **Long forms** that scare people off.
- **No spam protection.**
- **Collecting data** without a privacy policy.

## Action checklist

- [ ] Add a working form with honeypot spam protection to your practice site.
- [ ] Set up an auto-reply.
- [ ] Add analytics and test one conversion.

## Next steps

Continue to **Building websites for local businesses**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('a739f101-1bad-5ced-859b-ee2154e382e3', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'Building websites for local businesses', 'Build a reusable local-business website template you can customize quickly for each new client.', 8, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('aeb9336e-a4f6-4dd3-437c-2c9de7634ea9', 'a739f101-1bad-5ced-859b-ee2154e382e3', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'building-websites-for-local-businesses', 'Building websites for local businesses', 'Build a reusable local-business website template you can customize quickly for each new client.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('aeb9336e-a4f6-4dd3-437c-2c9de7634ea9', $md$## Goal

Create a reusable website template plus a build checklist, so each new local-business site takes hours instead of days.

## Prerequisites

- Lessons 1–7.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Pick 2–3 industries to specialise in** (for example trades, salons, restaurants). Specialisation makes templates and marketing easier.
2. **Build a master template** with all the standard sections: hero with CTAs, services, proof, process, gallery, FAQ, service area, contact, and footer with hours.
3. **Make it easy to customise:** colours and fonts in one CSS variables block, and content in clearly marked sections.
4. **Create industry variants:**
   - Trades: emergency banner, licence or insurance section.
   - Salon: booking button, price menu.
   - Restaurant: menu, hours, reservations or ordering links.
5. **Write a build checklist:** content received → customise colours → replace content → optimise images → connect form → SEO titles → launch checklist.
6. **Time a full build** using the template, and record it for pricing.
7. **Build a demo site** for each industry with clearly labelled sample content. These become your portfolio and sales previews.

## Tools and resources

- Your preferred stack (custom code with an AI coding tool, or a builder template).
- Unsplash (https://unsplash.com) for licence-friendly placeholder images. Replace them with the client's real photos before launch.

## Practical example

A "Trades" template was built once, then customised for an electrician in 4 hours: new colours, the client's services, real photos, their licence number and service area cities. The demo version, "Sample Electric Co.", stays on the portfolio, clearly marked as a demo.

## Expected costs

$0.

## How this earns revenue

Templates raise your effective hourly rate on fixed-price projects and let you offer faster turnaround. Demo sites help prospects picture their own site, which makes selling easier.

## Common mistakes

- **Every client getting an identical-looking site.** Customise colours, photos and copy meaningfully.
- **Leaving demo content in client sites.**

## Action checklist

- [ ] Build one master template.
- [ ] Create one industry demo site.
- [ ] Time a full customisation.

## Next steps

Continue to **Finding potential clients**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('f8336f8e-f6a7-a07c-042b-7d5190a6e44d', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'Finding potential clients', 'Find local businesses with missing or weak websites, qualify them, and record them in a pipeline.', 9, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('aae578fd-a96c-c182-46da-9c4f855f30ef', 'f8336f8e-f6a7-a07c-042b-7d5190a6e44d', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'finding-potential-clients', 'Finding potential clients', 'Find local businesses with missing or weak websites, qualify them, and record them in a pipeline.', 35, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('aae578fd-a96c-c182-46da-9c4f855f30ef', $md$## Goal

Build a list of 40 local businesses that clearly need a new or improved website.

## Prerequisites

- A demo site.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Search Google Maps** for your target industry plus your city ("roofing Kamloops").
2. **Check each listing:**
   - No website?
   - A website that's broken, not mobile-friendly, very slow, outdated (old copyright year) or has no contact form?
   - Only a Facebook page?
3. **Score the opportunity:**
   - **High:** active business with good reviews but no or poor website.
   - **Low:** a recently built professional site.
4. **Record them in your pipeline:** business, owner name if listed, phone, email or contact form, website status, specific issues, and Google rating.
5. **Check whether they're active:** recent reviews, recent posts and posted hours.
6. **Also use:** local Facebook groups (follow the rules), chamber of commerce directories, networking events, and referrals from businesses you already know.
7. **Prioritise 10** to contact first: active, well-reviewed, with clear website problems.

## Tools and resources

- Google Maps.
- PageSpeed Insights to check slow sites.
- Your pipeline spreadsheet.

## Practical example

Searching "mobile dog grooming Halifax" found 22 businesses:

- 9 had no website, only Facebook or Instagram;
- 5 had sites that weren't mobile-friendly.

The top 10 had 4.5+ star ratings and recent reviews, which means active businesses likely to value more online enquiries.

## Expected costs

$0.

## How this earns revenue

A qualified list means your outreach goes to businesses with a real, visible problem you can fix, which raises the chance of a sale. Expect many to say no or not reply. That's normal.

## Common mistakes

- **Targeting businesses that already have good sites.**
- **Not noting specific problems**, which makes outreach generic.
- **Ignoring closed or inactive businesses.**

## Action checklist

- [ ] Build a 40-business list.
- [ ] Note specific issues for each.
- [ ] Pick your first 10.

## Next steps

Continue to **Creating website proposals**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('559842fc-fb77-da95-dc12-113fc97cab1b', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'Creating website proposals', 'Contact prospects, show a preview, run a discovery call and send a clear website proposal.', 10, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('5b6b5e4b-ac82-7a8e-04ca-95b21103f51b', '559842fc-fb77-da95-dc12-113fc97cab1b', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'creating-website-proposals', 'Creating website proposals', 'Contact prospects, show a preview, run a discovery call and send a clear website proposal.', 40, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('5b6b5e4b-ac82-7a8e-04ca-95b21103f51b', $md$## Goal

Contact your top prospects, present a preview, and send a written proposal.

## Prerequisites

- A qualified list and a demo site.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Choose your approach:**
   - **Email or contact form,** with a link to an industry demo.
   - **Phone call,** short and respectful.
   - **In person,** at a quiet time, with a demo on your phone.
2. **Consider a personalised preview.** For high-priority prospects, create a quick homepage mock-up using their public information, clearly marked "Preview, not live". Don't publish it publicly under their name, and don't copy their photos without permission. Use placeholders or describe where their photos will go.
3. **Send the outreach** (template below), following anti-spam rules.
4. **Run the discovery call:** goals, services to feature, who their customers are, budget range, timeline, and who will provide content.
5. **Send the proposal** covering:
   - pages and features;
   - the content they provide;
   - timeline;
   - price and payment terms (for example 50% deposit, 50% at launch);
   - revisions included;
   - what's not included;
   - ongoing costs (domain, hosting) and the maintenance plan option.
6. **Follow up after 3 business days** if there's no reply.

**Outreach template:**

> Hi [Name], I found [Business] on Google Maps. Your reviews are excellent, but I couldn't find a website, so customers searching online only see your phone number. I build simple, mobile-friendly websites for [industry] businesses in [city]. Here's an example: [demo link]. Would you like me to put together a free homepage preview for [Business]? No obligation. [Your name, phone] · Reply "no thanks" to opt out.

## Tools and resources

- Your demo sites.
- Google Docs or Canva for proposals.
- Calendly for calls.

## Practical example

The mobile groomer agreed to a preview. It showed their name, services and a booking form layout, with "Your photos here" placeholders. On the call, the owner wanted online booking requests and a price list. The proposal covered a 4-page site, a booking request form, 2 revision rounds and a 3-week timeline, with an optional monthly maintenance plan.

## Expected costs

$0, apart from your time on previews. Limit previews to strong prospects.

## How this earns revenue

Previews make the value concrete. Proposals with deposits and clear scope turn interest into paid projects.

## Common mistakes

- **Building full sites for free** before any commitment.
- **Using a business's photos or logo publicly** without permission.
- **Vague proposals** without ongoing cost details.

## Action checklist

- [ ] Contact 10 prospects.
- [ ] Create up to 3 personalised previews.
- [ ] Send at least one proposal.

## Next steps

Continue to **Pricing website projects**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('4ab9d27e-1b64-08d1-bd8a-396a7e5ccc2a', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'Pricing website projects', 'Price websites by scope, collect deposits, and handle payment and delivery professionally.', 11, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('255d4ac7-196c-899f-9c8a-f37b7d726abe', '4ab9d27e-1b64-08d1-bd8a-396a7e5ccc2a', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'pricing-website-projects', 'Pricing website projects', 'Price websites by scope, collect deposits, and handle payment and delivery professionally.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('255d4ac7-196c-899f-9c8a-f37b7d726abe', $md$## Goal

Create a website price list and payment process you can use in every proposal.

## Prerequisites

- Time data from your template builds.
- Startup cost: **$0**.

## Step-by-step instructions

1. **Calculate your cost floor:** hours (including meetings, revisions and launch) × target rate + tools.
2. **Create packages:**
   - **Starter:** 1–3 pages, form, launch.
   - **Standard:** 4–6 pages, gallery, FAQ, basic SEO, analytics.
   - **Plus:** extra features such as booking integration, a multilingual site or a blog setup.
3. **Research local market prices** by checking freelancer profiles and agency pricing pages where published. Position yourself appropriately for your experience.
4. **Price add-ons:** extra pages, copywriting, logo design, photography coordination, Google Business Profile setup.
5. **Set payment terms:** a deposit before work starts, and the balance before launch or domain switch.
6. **Collect payment** with invoicing tools (Stripe, Wave, PayPal) or e-Transfer in Canada. Keep records.
7. **Deliver:** launch, handover document, a 30-minute training on how to request edits or use the builder, and a "Website Accounts" document.
8. **Explain ongoing costs clearly:** domain renewal, hosting or builder subscription, and an optional maintenance plan.

## Tools and resources

- Wave: https://www.waveapps.com · Stripe Invoicing: https://stripe.com/invoicing

## Practical example

**Standard package:** 5 pages, 2 revision rounds, a 3-week timeline. 50% deposit invoiced through Wave. The balance was paid before the domain was pointed to the new site. Delivery included a handover PDF and a recorded walkthrough video.

## Expected costs

Payment processing fees. Account for them in pricing.

## How this earns revenue

Packages make pricing quick and consistent. Deposits protect your time. Clear ongoing costs prevent surprises that damage relationships.

## Common mistakes

- **Hourly pricing for clearly scoped sites,** which penalises you for being efficient.
- **Launching before final payment.**
- **Hiding ongoing costs.**

## Action checklist

- [ ] Write your 3 packages and add-ons.
- [ ] Create invoice templates.
- [ ] Write a handover document template.

## Next steps

Continue to **Website maintenance and recurring revenue**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('07ff193f-520f-99b6-fc50-073396106b46', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'Website maintenance and recurring revenue', 'Offer maintenance plans that keep client sites healthy and create recurring monthly revenue.', 12, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('17d6ef95-a9c8-c096-2462-93c35980cb2d', '07ff193f-520f-99b6-fc50-073396106b46', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'website-maintenance-and-recurring-revenue', 'Website maintenance and recurring revenue', 'Offer maintenance plans that keep client sites healthy and create recurring monthly revenue.', 30, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('17d6ef95-a9c8-c096-2462-93c35980cb2d', $md$## Goal

Create a maintenance plan offer and a monthly maintenance routine.

## Prerequisites

- At least one launched site (practice is fine).
- Startup cost: **$0**.

## Step-by-step instructions

1. **Define what's included:**
   - monthly content edits (for example up to 1 hour);
   - uptime monitoring;
   - backups;
   - software and plugin updates (WordPress);
   - form testing;
   - a monthly report: enquiries, top pages, issues fixed.
2. **Define what's not included:** new pages, redesigns and large features, which are quoted separately.
3. **Set a monthly price** based on time plus tools. Offer a discount for annual prepayment if you like.
4. **Set up monitoring:** a free uptime monitor emails you if the site goes down.
5. **Run a monthly routine:**
   1. Check uptime.
   2. Test the form.
   3. Run updates and backups.
   4. Check PageSpeed.
   5. Make requested edits.
   6. Send the report.
6. **Bill automatically** with recurring invoices or subscriptions in your invoicing tool, with the client's agreement.
7. **Offer the plan at launch** as part of the proposal, so it feels like a natural continuation.

## Tools and resources

- UptimeRobot (free tier): https://uptimerobot.com
- Recurring invoices: Wave or Stripe.

## Practical example

**"Website Care" plan:**

- up to 60 minutes of edits per month;
- monthly form test and backup;
- uptime monitoring;
- a quarterly SEO check;
- one-page monthly report.

The detailer client used the edit time to post seasonal promotions.

## Expected costs

Monitoring is free at small scale. Backup tools vary.

## How this earns revenue

Maintenance is recurring revenue. Over time, several maintenance clients can provide a steadier monthly base than one-off projects, depending on how many clients you keep.

## Common mistakes

- **Unlimited edits** for a fixed fee.
- **No monthly report**, so the client forgets the value.
- **Forgetting to test forms.**

## Action checklist

- [ ] Write your maintenance plan offer.
- [ ] Set up uptime monitoring on your practice site.
- [ ] Create a monthly report template.

## Next steps

Finish the course with the **Practical project**.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

insert into public.modules (id, course_id, title, summary, position, is_published)
values ('8e5498b0-9e56-c4eb-e02b-818e9fa61486', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'Practical project: build a complete business website', 'Capstone project. Build, publish and present a complete website for a real or realistic local business, start to finish.', 13, true)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, position = excluded.position, updated_at = now();
insert into public.lessons (id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status)
values ('582ebb86-f94c-8686-1a5d-9401c53baa94', '8e5498b0-9e56-c4eb-e02b-818e9fa61486', 'c7d4cddb-573d-ce49-2e92-1e8451e89298', 'practical-project-build-a-complete-business-website', 'Practical project: build a complete business website', 'Capstone project. Build, publish and present a complete website for a real or realistic local business, start to finish.', 120, 1, false, 'published')
on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,
  duration_minutes = excluded.duration_minutes, is_preview = excluded.is_preview, status = excluded.status, updated_at = now();
insert into public.lesson_content (lesson_id, body_md)
values ('582ebb86-f94c-8686-1a5d-9401c53baa94', $md$## Goal

Complete a full website project from brief to launch, and produce a case study and a sales-ready demo.

## Prerequisites

- All previous lessons in this course.
- Startup cost: **$0–$25** (optional domain).

## Step-by-step instructions

1. **Choose the business.** Ideally a real local business that agrees to a pilot project. Otherwise, a realistic fictional business clearly labelled as a concept.
2. **Write the brief:** goals, audience, pages, features, brand, content list.
3. **Plan:** sitemap, homepage outline, style guide.
4. **Build:** use your template, an AI coding tool such as Claude Code, or a builder.
5. **Add essentials:** click-to-call, a contact form (tested), hours, service area, basic SEO and a privacy policy.
6. **Run the launch checklist,** including mobile, speed and content checks.
7. **Publish** to free hosting, with a domain if you have one.
8. **Write a handover document** and a maintenance plan offer.
9. **Write a case study:** problem, process, result (real outcomes only) and screenshots.
10. **Present it:** record a 3-minute walkthrough video you can send to prospects.

## Tools and resources

- Everything from this course: VS Code or Claude Code, Netlify, Vercel or Cloudflare Pages, Formspree, PageSpeed Insights and Loom.

## Practical example

**Concept project: "Harbour Yoga Studio".**

- Pages: Home, Classes and Schedule, Pricing, Teachers (placeholder bios marked as sample), and Contact.
- A booking button links to their scheduling tool.
- The site was published on a free Netlify subdomain.
- A 3-minute walkthrough was recorded, and the case study clearly says "Concept project".

## Expected costs

- $0 using a free subdomain.
- Optional domain: about US$10–$25 per year.

## How this earns revenue

This capstone gives you a complete portfolio piece, a reusable process and a demo to show prospects: the three things you need to start selling websites.

## Common mistakes

- **Skipping the launch checklist.**
- **Presenting a concept project as client work.**
- **Leaving placeholders live.**

## Action checklist

- [ ] Complete all 10 steps.
- [ ] Publish the site.
- [ ] Add the case study and walkthrough video to your portfolio.
- [ ] Send the walkthrough to your first 10 prospects.

## Next steps

You've completed the website pathway. Keep a weekly rhythm: 5 hours building, 3 hours prospecting, 1 hour on maintenance clients. Consider **Digital Marketing** next so you can offer local SEO and lead generation alongside websites.$md$)
on conflict (lesson_id) do update set body_md = excluded.body_md, updated_at = now();

commit;
