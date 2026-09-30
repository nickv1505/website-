/* West Coast Finish (v2): no dependencies. Content works without JS. */
(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Photos that fail to load fall back to the tile's paint colour ---------- */
  $$(".tile__img img, .tile__bg img").forEach((img) => {
    const drop = () => img.remove();
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) drop();
    else img.addEventListener("error", drop, { once: true });
  });

  /* ---------- Opening animation (tap to skip) ---------- */
  const root = document.documentElement;
  const intro = $(".intro");
  if (intro && root.classList.contains("has-intro")) {
    let over = false;
    const end = (skip) => {
      if (over) return;
      over = true;
      if (skip) root.classList.remove("has-intro");
      root.classList.add("intro-done");
      intro.remove();
    };
    intro.addEventListener("animationend", (e) => e.animationName === "intro-out" && end(false));
    intro.addEventListener("click", () => end(true));
    addEventListener("keydown", () => end(true), { once: true });
    setTimeout(() => end(false), 4000);
  }

  /* ---------- Header + mobile dock ---------- */
  const top = $(".top");
  const dock = $(".dock");
  const hero = $(".hero");
  const estimate = $("#estimate");
  const onScroll = () => {
    top.classList.toggle("is-scrolled", window.scrollY > 8);
    if (dock) {
      const r = estimate.getBoundingClientRect();
      const show = window.scrollY > hero.offsetHeight * 0.7 && !(r.top < innerHeight && r.bottom > 0);
      dock.classList.toggle("is-on", show);
      dock.inert = !show;
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = $(".burger");
  const nav = $("#nav");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  burger.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  nav.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) { setMenu(false); burger.focus(); }
  });
  matchMedia("(min-width: 881px)").addEventListener("change", (e) => e.matches && setMenu(false));

  /* ---------- Active section in the nav ---------- */
  const links = $$('.nav a[href^="#"]:not(.btn)');
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.map((a) => $(a.getAttribute("href"))).filter(Boolean).forEach((s) => spy.observe(s));
  }

  /* ---------- Estimate links focus the first field ---------- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href="#estimate"]');
    if (!a) return;
    setTimeout(() => $("#f-name").focus({ preventScroll: true }), calm ? 0 : 700);
  });

  /* ---------- Scroll reveal ---------- */
  const reveals = $$(".reveal");
  if (!calm && "IntersectionObserver" in window) {
    document.documentElement.classList.add("reveal-on");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Colour playground ---------- */
  const room = $(".room .room__photo");
  const roomName = $("[data-room-name]");
  const now = $(".colour__now");
  const swatches = $$(".swatch");
  swatches.forEach((sw) => sw.addEventListener("click", () => {
    swatches.forEach((s) => s.setAttribute("aria-pressed", String(s === sw)));
    room.style.setProperty("--wall", getComputedStyle(sw).getPropertyValue("--c").trim());
    $("b", now).textContent = sw.dataset.name;
    $("span", now).textContent = sw.dataset.note;
    roomName.textContent = sw.dataset.name;
  }));

  /* ---------- Colour picker in the estimate form (100 colours) ---------- */
  const COLOURS = window.WCF_COLOURS || [];
  const MAX_COLOURS = 6;
  const picker = $(".picker");
  const chosen = [];
  let renderChosen = () => {};
  if (picker && COLOURS.length) {
    const grid = $(".picker__grid", picker);
    const fams = $(".picker__families", picker);
    const search = $(".picker__search", picker);
    const list = $(".picker__list", picker);
    const hidden = $("#f-colours");
    const hint = $(".picker__hint", picker);
    const hintText = hint.textContent;
    const pv = $(".picker__preview .room__photo", picker);
    const pvName = $(".picker__now b", picker);
    const pvMeta = $(".picker__now small", picker);
    const pvDot = $(".picker__dot", picker);
    let family = "All";

    ["All", ...new Set(COLOURS.map((c) => c.family))].forEach((f) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = f;
      b.setAttribute("aria-pressed", String(f === family));
      b.addEventListener("click", () => {
        family = f;
        $$("button", fams).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        filter();
      });
      fams.append(b);
    });

    const preview = (c, btn) => {
      pv.style.setProperty("--wall", c.hex);
      pvDot.style.setProperty("--c", c.hex);
      pvName.textContent = c.name;
      pvMeta.textContent = `${c.code} · ${c.family}`;
      $$(".pc.is-preview", grid).forEach((x) => x.classList.remove("is-preview"));
      if (btn) btn.classList.add("is-preview");
    };
    const buttons = COLOURS.map((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "pc";
      b.style.setProperty("--c", c.hex);
      b.setAttribute("aria-pressed", "false");
      b.setAttribute("aria-label", `${c.name}, ${c.code}`);
      b.innerHTML = `<span class="pc__chip" aria-hidden="true"></span><span class="pc__name">${c.name}</span><span class="pc__code">${c.code}</span>`;
      b.addEventListener("mouseenter", () => preview(c, b));
      b.addEventListener("focus", () => preview(c, b));
      b.addEventListener("click", () => {
        preview(c, b);
        const i = chosen.indexOf(c);
        if (i >= 0) chosen.splice(i, 1);
        else if (chosen.length >= MAX_COLOURS) { hint.textContent = `You can pick up to ${MAX_COLOURS} colours. Remove one to add another.`; return; }
        else chosen.push(c);
        hint.textContent = hintText;
        renderChosen();
      });
      grid.append(b);
      return b;
    });
    const empty = document.createElement("p");
    empty.className = "picker__empty-grid";
    empty.textContent = "No colours match. Try another word or family.";
    empty.hidden = true;
    grid.append(empty);

    const filter = () => {
      const q = search.value.trim().toLowerCase();
      let shown = 0;
      COLOURS.forEach((c, i) => {
        const ok = (family === "All" || c.family === family) && (!q || (c.name + " " + c.code + " " + c.family).toLowerCase().includes(q));
        buttons[i].hidden = !ok;
        if (ok) shown++;
      });
      empty.hidden = shown > 0;
    };
    search.addEventListener("input", filter);
    search.addEventListener("keydown", (e) => e.key === "Enter" && e.preventDefault());

    renderChosen = () => {
      list.innerHTML = "";
      chosen.forEach((c) => {
        const li = document.createElement("li");
        li.innerHTML = `<i style="--c:${c.hex}"></i>${c.name}`;
        const x = document.createElement("button");
        x.type = "button";
        x.setAttribute("aria-label", "Remove " + c.name);
        x.innerHTML = '<svg aria-hidden="true"><use href="#i-x"/></svg>';
        x.addEventListener("click", () => { chosen.splice(chosen.indexOf(c), 1); renderChosen(); });
        li.append(x);
        list.append(li);
      });
      COLOURS.forEach((c, i) => buttons[i].setAttribute("aria-pressed", String(chosen.includes(c))));
      hidden.value = chosen.map((c) => `${c.name} (${c.code}, ${c.hex})`).join("; ");
    };
    preview(COLOURS.find((c) => c.name === "English Bay Fog") || COLOURS[0]);
  }

  /* ---------- Photo upload ---------- */
  const MAX = 10, SIZE = 10 * 1024 * 1024;
  const form = $("#estimate-form");
  const files = [];
  const up = $("[data-upload]");
  const input = $("input[type=file]", up);
  const drop = $(".drop", up);
  const thumbs = $(".thumbs", up);
  const upErr = $(".field__err", up);
  const upMsg = (m) => { upErr.textContent = m; up.classList.toggle("is-bad", Boolean(m)); };
  const render = () => {
    thumbs.innerHTML = "";
    files.forEach((f, i) => {
      const li = document.createElement("li");
      const img = document.createElement("img");
      const url = URL.createObjectURL(f);
      img.src = url; img.alt = f.name;
      img.onload = () => URL.revokeObjectURL(url);
      img.onerror = () => { URL.revokeObjectURL(url); img.remove(); };
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Remove " + f.name);
      b.innerHTML = '<svg aria-hidden="true"><use href="#i-x"/></svg>';
      b.addEventListener("click", () => { files.splice(i, 1); upMsg(""); render(); input.focus(); });
      li.append(img, b);
      thumbs.append(li);
    });
  };
  const add = (list) => {
    const bad = [];
    for (const f of list) {
      if (!(f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name))) { bad.push(f.name + " isn’t a photo"); continue; }
      if (f.size > SIZE) { bad.push(f.name + " is over 10 MB"); continue; }
      if (files.some((g) => g.name === f.name && g.size === f.size)) continue;
      if (files.length >= MAX) { bad.push("You can add up to " + MAX + " photos"); break; }
      files.push(f);
    }
    upMsg(bad.length ? bad.join(". ") + "." : "");
    render();
  };
  input.addEventListener("change", () => { add(Array.from(input.files)); input.value = ""; });
  ["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("is-over"); }));
  ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, () => drop.classList.remove("is-over")));
  drop.addEventListener("drop", (e) => { e.preventDefault(); add(Array.from(e.dataTransfer.files || [])); });

  /* ---------- Validation + submit ---------- */
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const okPhone = (v) => { const d = v.replace(/\D/g, ""); return d.length === 10 || (d.length === 11 && d[0] === "1"); };
  const holder = (el) => el.closest(".field") || el.closest(".consent");
  const check = (el) => {
    const v = (el.value || "").trim();
    let ok = true;
    if (el.type === "radio") ok = $$(`input[name="${el.name}"]`, form).some((r) => r.checked);
    else if (el.type === "checkbox") ok = !el.required || el.checked;
    else if (el.required && !v) ok = false;
    else if (v && el.type === "email") ok = EMAIL.test(v);
    else if (v && el.hasAttribute("data-phone")) ok = okPhone(v);
    else if (v && el.minLength > 0) ok = v.length >= el.minLength;
    holder(el).classList.toggle("is-bad", !ok);
    el.setAttribute("aria-invalid", String(!ok));
    return ok;
  };
  const controls = () => $$("input:not([type=file]), select, textarea", form).filter((el) => el.name);
  controls().forEach((el) => {
    const ev = ["radio", "checkbox"].includes(el.type) || el.tagName === "SELECT" ? "change" : "blur";
    el.addEventListener(ev, () => check(el));
    el.addEventListener("input", () => holder(el).classList.contains("is-bad") && check(el));
  });
  $$("[data-phone]", form).forEach((el) => el.addEventListener("blur", () => {
    const d = el.value.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
    if (d.length === 10) el.value = `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }));

  const alertBox = $(".form__alert", form);
  const submit = $("button[type=submit]", form);
  const label = submit.innerHTML;
  const done = $("#estimate-done");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const seen = new Set();
    const bad = controls().filter((el) => {
      if (el.type === "radio") { if (seen.has(el.name)) return false; seen.add(el.name); }
      return !check(el);
    });
    if (bad.length) { alertBox.classList.add("is-on"); bad[0].focus(); return; }
    alertBox.classList.remove("is-on");
    const data = new FormData(form);
    files.forEach((f) => data.append("photos", f, f.name));
    submit.disabled = true;
    submit.innerHTML = '<span class="spin" aria-hidden="true"></span> Sending…';
    try {
      // Set data-endpoint on the form (e.g. a Formspree URL) to receive submissions.
      if (form.dataset.endpoint) {
        const res = await fetch(form.dataset.endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error("send failed");
      } else {
        await new Promise((r) => setTimeout(r, 800));
      }
      form.hidden = true;
      done.hidden = false;
      done.focus({ preventScroll: true });
      done.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "center" });
    } catch {
      $("span", alertBox).textContent = "Sorry, that didn’t send. Please try again or call (604) 377-9927.";
      alertBox.classList.add("is-on");
      alertBox.focus();
    } finally {
      submit.disabled = false;
      submit.innerHTML = label;
    }
  });
  $("[data-again]").addEventListener("click", () => {
    form.reset();
    files.length = 0; render(); upMsg("");
    chosen.length = 0; renderChosen();
    $$(".is-bad", form).forEach((f) => f.classList.remove("is-bad"));
    done.hidden = true; form.hidden = false;
    $("#f-name").focus();
  });
})();
