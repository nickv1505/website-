# West Coast Finish — website

A static website for West Coast Finish, a residential interior and exterior painting company in Metro Vancouver, BC. It's plain HTML, CSS and JavaScript with no build step, so it can be hosted anywhere (Netlify, Vercel, Cloudflare Pages, GitHub Pages, cPanel…).

```
index.html            Home page (all sections)
privacy.html          Privacy policy (linked from the forms)
404.html              Not-found page
assets/css/styles.css Design system + all styles
assets/js/main.js     Navigation, gallery, before/after slider, forms, uploads
assets/img/           Favicon/logo mark + "before" wear texture
robots.txt, sitemap.xml
```

Preview locally: `python3 -m http.server` → http://localhost:8000

## Before launch

1. **Contact details** — phone is set to (604) 377-9927. Replace the placeholder email
   `hello@westcoastfinish.ca` (search `index.html`, `privacy.html`).
2. **Domain** — replace `https://www.westcoastfinish.ca/` in `index.html` (canonical, Open Graph,
   JSON-LD), `robots.txt` and `sitemap.xml`.
3. **Form delivery** — the forms validate and show the confirmation message, but submissions are
   simulated until you set `data-endpoint="…"` on `#estimate-form` and `#contact-form`
   (e.g. a Formspree/Basin/Getform endpoint). Photos are sent as `photos` in multipart form data.
4. **Photos** — images are currently Unsplash stock photography (free for commercial use),
   hotlinked from `images.unsplash.com`. Replace them with photos of your own projects as soon as
   you have them — especially in *Our Work* and *Before & After*. The before/after sliders use one
   photo with a "worn paint" treatment on the before side; see the comment in `index.html` to
   switch a slider to real before/after photos.
5. **Reviews** — add genuine customer reviews to the `REVIEWS` array at the top of
   `assets/js/main.js`; the reviews block appears automatically once it has entries.
6. **Hours / service area** — adjust in the Contact section, footer and JSON-LD if needed.
