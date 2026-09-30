# West Coast Finish — website

A static website for West Coast Finish, a residential interior and exterior painting company in Metro Vancouver, BC. It's plain HTML, CSS and JavaScript with no build step, so it can be hosted anywhere (Netlify, Vercel, Cloudflare Pages, GitHub Pages, cPanel…).

```
index.html            Home page (all sections)
privacy.html          Privacy policy (linked from the forms)
404.html              Not-found page
assets/css/styles.css Design system + all styles
assets/js/main.js     Navigation, gallery, before/after slider, forms, uploads
assets/img/           Favicon/logo mark and photos/ (all site photos)
tools/render_photos.py  Renders the stand-in wall-painting photos
robots.txt, sitemap.xml
```

Preview locally: `python3 -m http.server` → http://localhost:8000

## Before launch

1. **Contact details** — set: (604) 377-9927 and pacificcompany@yahoo.com.
2. **Domain** — replace `https://www.westcoastfinish.ca/` in `index.html` (canonical, Open Graph,
   JSON-LD), `robots.txt` and `sitemap.xml`.
3. **Form delivery** — the forms validate and show the confirmation message, but submissions are
   simulated until you set `data-endpoint="…"` on `#estimate-form` and `#contact-form`
   (e.g. a Formspree/Basin/Getform endpoint). Photos are sent as `photos` in multipart form data.
4. **Photos**: all photos live in `assets/img/photos/`. They are computer-rendered stand-ins
   made by `tools/render_photos.py` (run `python3 tools/render_photos.py` to re-render; needs
   numpy, scipy and pillow). To use real or AI-generated photos instead, follow
   `IMAGE-PROMPTS.md` and upload files with the same names; no code changes needed.
5. **Reviews** — add genuine customer reviews to the `REVIEWS` array at the top of
   `assets/js/main.js`; the reviews block appears automatically once it has entries.
6. **Hours / service area** — adjust in the Contact section, footer and JSON-LD if needed.
