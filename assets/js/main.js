/* ==========================================================================
   West Coast Finish — site behaviour
   No dependencies. Everything degrades gracefully without JS.
   ========================================================================== */

/*
  CUSTOMER REVIEWS
  Add genuine reviews here once you have them (e.g. copied from Google with the
  customer's permission). While the list is empty the reviews block stays hidden.

  Example:
  { name: "First name + last initial", area: "Burnaby", project: "Interior repaint", rating: 5, text: "…" }
*/
const REVIEWS = [];

/*
  FORM DELIVERY
  The forms work fully on the front end. To actually receive submissions, set
  data-endpoint="…" on each <form> in index.html to a form backend URL
  (e.g. Formspree, Basin, Getform, or your own server). The form posts
  multipart/form-data, including uploaded photos. With no endpoint set, the
  submission is simulated so the confirmation flow can be previewed.
*/

(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Image fallback ---------- */
  const markFailed = (img) => {
    const frame = img.closest(".frame");
    if (frame) frame.classList.add("img-failed");
  };
  $$(".frame img").forEach((img) => {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) markFailed(img);
    img.addEventListener("error", () => markFailed(img), { once: true });
  });

  /* ---------- Header ---------- */
  const header = $(".site-header");
  const hero = $(".hero");
  const mobileCta = $(".mobile-cta");
  const estimate = $("#estimate");

  const onScroll = () => {
    const y = window.scrollY;
    const solidAt = hero ? 40 : -1;
    header.classList.toggle("is-solid", y > solidAt);

    if (mobileCta && hero && estimate) {
      const pastHero = y > hero.offsetHeight * 0.6;
      const r = estimate.getBoundingClientRect();
      const inEstimate = r.top < window.innerHeight && r.bottom > 0;
      const show = pastHero && !inEstimate;
      mobileCta.classList.toggle("is-visible", show);
      mobileCta.inert = !show;
    }
  };
  if (header) {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav ---------- */
  const toggle = $(".nav-toggle");
  const nav = $("#site-nav");
  const setNav = (open) => {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  if (toggle && nav) {
    toggle.addEventListener("click", () => setNav(!document.body.classList.contains("nav-open")));
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        setNav(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => e.matches && setNav(false));
  }

  /* ---------- Active nav link ---------- */
  const navLinks = $$(".nav__link[href^='#']");
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === id));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- In-page links: focus target for keyboard/screen-reader users ---------- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href^='#']");
    if (!a) return;
    const id = a.getAttribute("href");
    if (id === "#" || id === "#top") return;
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", id);
    // Move focus to the first field of forms, otherwise to the section itself
    const focusTarget = id === "#estimate" ? $("#est-name") : target;
    if (focusTarget) {
      if (!focusTarget.hasAttribute("tabindex") && !/^(INPUT|SELECT|TEXTAREA|BUTTON|A)$/.test(focusTarget.tagName)) {
        focusTarget.setAttribute("tabindex", "-1");
      }
      setTimeout(() => focusTarget.focus({ preventScroll: true }), reduceMotion ? 0 : 600);
    }
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$("[data-reveal]");
  if (!reduceMotion && "IntersectionObserver" in window && revealEls.length) {
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Hero: fresh coat rolls over the old paint once the photo is in view ---------- */
  const wall = $("[data-paint-wall]");
  if (wall) {
    const photo = $(".paint-wall__old img", wall);
    const label = $(".paint-wall__label", wall);
    const replay = $(".paint-wall__replay", wall);
    const strokes = $$(".paint-wall__coat span", wall);
    const done = () => {
      wall.classList.remove("is-playing");
      wall.classList.add("is-done");
      label.textContent = "After";
      if (!reduceMotion) replay.hidden = false;
    };
    const play = () => {
      replay.hidden = true;
      label.textContent = "Before";
      wall.classList.remove("is-playing", "is-done");
      void wall.offsetWidth; // restart the CSS animation
      wall.classList.add("is-playing");
      strokes[strokes.length - 1].addEventListener("animationend", done, { once: true });
    };
    replay.addEventListener("click", play);
    const start = () => {
      if (reduceMotion || !("IntersectionObserver" in window)) return done();
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { io.disconnect(); play(); }
      }, { threshold: 0.5 });
      io.observe(wall);
    };
    if (photo.complete && photo.naturalWidth) start();
    else {
      photo.addEventListener("load", start, { once: true });
      photo.addEventListener("error", done, { once: true });
    }
  }

  /* ---------- Lightbox (Our Work gallery and Before & After photos) ---------- */
  const lightbox = $("#lightbox");
  const zoomables = $$("[data-lightbox]");
  if (lightbox && typeof lightbox.showModal === "function") {
    const lbImg = $("img", lightbox);
    const lbTitle = $("figcaption strong", lightbox);
    const lbSub = $("figcaption span", lightbox);
    let group = [];
    let current = 0;

    const show = (item) => {
      const img = $("img", item);
      lightbox.classList.toggle("is-before", item.hasAttribute("data-before"));
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbTitle.textContent = item.dataset.title || "";
      lbSub.textContent = item.dataset.sub || "";
    };
    const step = (d) => {
      current = (current + d + group.length) % group.length;
      show(group[current]);
    };

    zoomables.forEach((item) =>
      item.addEventListener("click", () => {
        group = zoomables.filter((z) => z.dataset.lightbox === item.dataset.lightbox);
        current = group.indexOf(item);
        show(item);
        lightbox.showModal();
      })
    );
    $(".lightbox__close", lightbox).addEventListener("click", () => lightbox.close());
    $(".lightbox__prev", lightbox).addEventListener("click", () => step(-1));
    $(".lightbox__next", lightbox).addEventListener("click", () => step(1));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  /* ---------- Reviews (renders only when REVIEWS has entries) ---------- */
  const reviewsSlot = $("#reviews");
  if (reviewsSlot && REVIEWS.length) {
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const star = '<svg aria-hidden="true"><use href="#i-star"/></svg>';
    reviewsSlot.innerHTML = REVIEWS.map(
      (r) => `<figure class="review-card">
        <div class="review-card__stars" role="img" aria-label="${Number(r.rating) || 5} out of 5 stars">${star.repeat(Number(r.rating) || 5)}</div>
        <blockquote>${esc(r.text)}</blockquote>
        <figcaption><cite>${esc(r.name)}<span>${esc([r.area, r.project].filter(Boolean).join(" · "))}</span></cite></figcaption>
      </figure>`
    ).join("");
    reviewsSlot.hidden = false;
  }

  /* ---------- Photo upload ---------- */
  const MAX_FILES = 10;
  const MAX_SIZE = 10 * 1024 * 1024;
  const uploads = new WeakMap(); // form -> File[]

  $$("[data-upload]").forEach((field) => {
    const form = field.closest("form");
    const input = $("input[type=file]", field);
    const zone = $(".dropzone", field);
    const list = $(".previews", field);
    const err = $(".field__error span", field);
    let files = [];
    uploads.set(form, files);

    const showError = (msg) => {
      err.textContent = msg;
      field.classList.toggle("has-error", Boolean(msg));
    };

    const render = () => {
      list.innerHTML = "";
      files.forEach((file, idx) => {
        const li = document.createElement("li");
        li.className = "preview";
        const url = URL.createObjectURL(file);
        const img = document.createElement("img");
        img.alt = file.name;
        img.src = url;
        img.onload = () => URL.revokeObjectURL(url);
        img.onerror = () => {
          // e.g. HEIC in browsers that can't preview it — still uploaded
          URL.revokeObjectURL(url);
          img.remove();
        };
        const name = document.createElement("span");
        name.className = "preview__name";
        name.textContent = file.name;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "preview__remove";
        btn.setAttribute("aria-label", `Remove ${file.name}`);
        btn.innerHTML = '<svg aria-hidden="true"><use href="#i-x"/></svg>';
        btn.addEventListener("click", () => {
          files.splice(idx, 1);
          showError("");
          render();
          input.focus();
        });
        li.append(img, name, btn);
        list.append(li);
      });
    };

    const add = (incoming) => {
      const problems = [];
      for (const file of incoming) {
        const isImage = file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);
        if (!isImage) { problems.push(`${file.name} isn’t an image`); continue; }
        if (file.size > MAX_SIZE) { problems.push(`${file.name} is larger than 10 MB`); continue; }
        if (files.some((f) => f.name === file.name && f.size === file.size)) continue;
        if (files.length >= MAX_FILES) { problems.push(`You can upload up to ${MAX_FILES} photos`); break; }
        files.push(file);
      }
      showError(problems.length ? problems.join(". ") + "." : "");
      render();
    };

    input.addEventListener("change", () => {
      add(Array.from(input.files));
      input.value = ""; // allow re-selecting the same file
    });
    ["dragenter", "dragover"].forEach((t) => zone.addEventListener(t, (e) => { e.preventDefault(); zone.classList.add("is-over"); }));
    ["dragleave", "dragend", "drop"].forEach((t) => zone.addEventListener(t, () => zone.classList.remove("is-over")));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      add(Array.from(e.dataTransfer.files || []));
    });

    form.addEventListener("reset", () => {
      files.length = 0;
      showError("");
      render();
    });
  });

  /* ---------- Form validation & submit ---------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const validPhone = (v) => {
    const digits = v.replace(/\D/g, "");
    return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
  };

  const validateField = (el) => {
    const field = el.closest(".field");
    if (!field) return true;
    let ok = true;
    const v = (el.value || "").trim();

    if (el.type === "radio") {
      ok = $$(`input[name="${el.name}"]`, el.form).some((r) => r.checked);
    } else if (el.type === "checkbox") {
      ok = !el.required || el.checked;
    } else if (el.required && !v) {
      ok = false;
    } else if (v) {
      if (el.type === "email") ok = EMAIL_RE.test(v);
      else if (el.dataset.validate === "phone") ok = validPhone(v);
      else if (el.minLength > 0) ok = v.length >= el.minLength;
    }

    field.classList.toggle("has-error", !ok);
    const targets = el.type === "radio" ? $$(`input[name="${el.name}"]`, el.form) : [el];
    targets.forEach((t) => t.setAttribute("aria-invalid", String(!ok)));
    return ok;
  };

  // Format phone as (604) 555-0123 on blur
  $$("[data-validate=phone]").forEach((el) =>
    el.addEventListener("blur", () => {
      const d = el.value.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
      if (d.length === 10) el.value = `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    })
  );

  $$(".js-form").forEach((form) => {
    const controls = () => $$("input:not([type=file]), select, textarea", form).filter((el) => el.name);
    const alertBox = $(".form-alert", form);
    const submitBtn = $("button[type=submit]", form);
    const success = document.getElementById(form.dataset.success);

    // Validate on blur; once a field has shown an error, re-validate as the user types
    controls().forEach((el) => {
      const evt = el.type === "radio" || el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "blur";
      el.addEventListener(evt, () => validateField(el));
      el.addEventListener("input", () => {
        if (el.closest(".field")?.classList.contains("has-error")) validateField(el);
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const seen = new Set();
      const invalid = controls().filter((el) => {
        if (el.type === "radio") {
          if (seen.has(el.name)) return false;
          seen.add(el.name);
        }
        return !validateField(el);
      });

      if (invalid.length) {
        alertBox.classList.add("is-visible");
        invalid[0].focus();
        return;
      }
      alertBox.classList.remove("is-visible");

      const data = new FormData(form);
      data.delete("photos");
      (uploads.get(form) || []).forEach((f) => data.append("photos", f, f.name));

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending…';

      try {
        const endpoint = form.dataset.endpoint;
        if (endpoint) {
          const res = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
          if (!res.ok) throw new Error("Request failed");
        } else {
          await new Promise((r) => setTimeout(r, 900)); // simulated send (no endpoint configured)
        }
        form.hidden = true;
        success.hidden = false;
        success.focus({ preventScroll: true });
        success.closest(".form-card").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      } catch (err) {
        alertBox.querySelector("span").textContent =
          "Sorry — something went wrong sending your request. Please try again, or call us at (604) 377-9927.";
        alertBox.classList.add("is-visible");
        alertBox.focus();
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `${submitBtn.dataset.label} <svg aria-hidden="true"><use href="#i-arrow"/></svg>`;
      }
    });
  });

  // "Submit another" buttons
  $$("[data-reset]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const form = document.getElementById(btn.dataset.reset);
      form.reset();
      $$(".has-error", form).forEach((f) => f.classList.remove("has-error"));
      $$("[aria-invalid]", form).forEach((f) => f.removeAttribute("aria-invalid"));
      $(".form-alert", form).classList.remove("is-visible");
      btn.closest(".form-success").hidden = true;
      form.hidden = false;
      $("input", form).focus();
    })
  );
})();
