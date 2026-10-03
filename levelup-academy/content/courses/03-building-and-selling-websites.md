---course
slug: building-and-selling-websites
title: Building and Selling Websites
subtitle: Build professional websites for local businesses, publish them, find clients, quote, get paid and offer maintenance.
category: Website Development
icon: code
description: Go from zero to selling websites. Choose the right tool, build a site for a real type of business (including with AI coding tools like Claude Code), publish it on a domain, find businesses that need one, present a preview, price the project, collect payment, deliver, and earn recurring maintenance revenue.
---

===module
title: Website development fundamentals
slug: website-development-fundamentals
summary: Understand how websites work and choose the right building approach for each client.
minutes: 30
preview: true
===
## Goal

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

Continue to **Using AI coding tools**.

===module
title: Using AI coding tools
slug: using-ai-coding-tools
summary: Use AI assistants to write, explain and fix website code, safely and with understanding.
minutes: 35
===
## Goal

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

Continue to **Building websites with Claude Code**.

===module
title: Building websites with Claude Code
slug: building-websites-with-claude-code
summary: Use Claude Code, an agentic coding tool, to plan, build, test and revise a multi-page business website.
minutes: 45
===
## Goal

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

Continue to **Planning and designing a business website**.

===module
title: Planning and designing a business website
slug: planning-and-designing-a-business-website
summary: Plan pages, content and design that turn visitors into enquiries for a local business.
minutes: 35
===
## Goal

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

Continue to **Using domains and web hosting**.

===module
title: Using domains and web hosting
slug: using-domains-and-web-hosting
summary: Register a domain in the client's name, choose hosting, connect DNS and enable HTTPS.
minutes: 35
===
## Goal

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

Continue to **Publishing a website**.

===module
title: Publishing a website
slug: publishing-a-website
summary: Run a pre-launch checklist, deploy, test and hand over a live website.
minutes: 30
===
## Goal

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

Continue to **Contact forms and lead generation**.

===module
title: Contact forms and lead generation
slug: contact-forms-and-lead-generation
summary: Build forms and calls-to-action that make it easy for visitors to become enquiries, and track them.
minutes: 30
===
## Goal

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

Continue to **Building websites for local businesses**.

===module
title: Building websites for local businesses
slug: building-websites-for-local-businesses
summary: Build a reusable local-business website template you can customize quickly for each new client.
minutes: 40
===
## Goal

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

Continue to **Finding potential clients**.

===module
title: Finding potential clients
slug: finding-potential-clients
summary: Find local businesses with missing or weak websites, qualify them, and record them in a pipeline.
minutes: 35
===
## Goal

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

Continue to **Creating website proposals**.

===module
title: Creating website proposals
slug: creating-website-proposals
summary: Contact prospects, show a preview, run a discovery call and send a clear website proposal.
minutes: 40
===
## Goal

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

Continue to **Pricing website projects**.

===module
title: Pricing website projects
slug: pricing-website-projects
summary: Price websites by scope, collect deposits, and handle payment and delivery professionally.
minutes: 30
===
## Goal

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

Continue to **Website maintenance and recurring revenue**.

===module
title: Website maintenance and recurring revenue
slug: website-maintenance-and-recurring-revenue
summary: Offer maintenance plans that keep client sites healthy and create recurring monthly revenue.
minutes: 30
===
## Goal

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

Finish the course with the **Practical project**.

===module
title: "Practical project: build a complete business website"
slug: practical-project-build-a-complete-business-website
summary: Capstone project. Build, publish and present a complete website for a real or realistic local business, start to finish.
minutes: 120
===
## Goal

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

You've completed the website pathway. Keep a weekly rhythm: 5 hours building, 3 hours prospecting, 1 hour on maintenance clients. Consider **Digital Marketing** next so you can offer local SEO and lead generation alongside websites.
