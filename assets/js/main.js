/* ============================================================
   RIYASA 2026 — site engine
   One file drives header, footer and dynamic widgets for every
   page. Edit assets/data/site-config.json to change nav, dates,
   contact details, and homepage content across the portal.
   ============================================================ */

(function () {
  const DEPTH = (document.body.dataset.depth || "0") | 0;
  const ROOT = "../".repeat(DEPTH);
  const CONFIG_PATH = ROOT + "assets/data/site-config.json";

  function fmtDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }

  function formatDateEntry(d) {
    if (!d.endDate) return fmtDate(d.date);
    const start = new Date(d.date + "T00:00:00");
    const end = new Date(d.endDate + "T00:00:00");
    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    const startDay = start.toLocaleDateString("en-GB", { day: "2-digit" });
    if (sameMonth) {
      const endFormatted = end.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      return `${startDay}–${endFormatted}`;
    }
    return `${fmtDate(d.date)} – ${fmtDate(d.endDate)}`;
  }

  function currentFile() {
    const parts = window.location.pathname.split("/");
    return parts[parts.length - 1] || "index.html";
  }

  function basename(href) {
    return href.split("/").pop();
  }

  function buildNav(nav) {
    const here = currentFile();
    return nav
      .map((item) => {
        const isParent = !!item.children;
        const active =
          !isParent && basename(item.href) === here
            ? " active"
            : isParent && item.children.some((c) => basename(c.href) === here)
            ? " active"
            : "";
        if (isParent) {
          return `
          <li class="nav-item has-children${active}">
            <button class="nav-link nav-toggle" aria-expanded="false">${item.label}<span class="caret" aria-hidden="true"></span></button>
            <ul class="dropdown">
              ${item.children
              .map(
                (c) =>
                  `<li><a href="${c.external ? c.href : ROOT + c.href}"${c.external ? ' target="_blank" rel="noopener"' : ""}${c.href === here ? ' class="active"' : ""}>${c.label}</a></li>`
              )
              .join("")}
            </ul>
          </li>`;
        }
        return `<li class="nav-item"><a class="nav-link${active}" href="${ROOT}${item.href}">${item.label}</a></li>`;
      })
      .join("");
  }

  function renderHeader(cfg) {
    const mount = document.getElementById("site-header");
    if (!mount) return;
    mount.innerHTML = `
    <header class="site-header">
      <div class="container header-inner">
        <img class="header-logo header-logo-left" src="${ROOT}${cfg.bcrecLogo}" alt="Dr. B. C. Roy Engineering College, Durgapur">
        <a class="brand" href="${ROOT}index.html">
          <span class="brand-text">
            <strong><span class="brand-name">RAESA</span> <span class="brand-year">2027</span></strong>
            <small>${cfg.tagline}</small>
          </span>
        </a>
        <img class="header-logo header-logo-right" src="${ROOT}assets/images/logo/raesa-logo.jpeg" alt="${cfg.siteName} logo">
        <button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="nav-strip">
        <div class="container">
          <nav class="site-nav">
            <ul>${buildNav(cfg.nav)}</ul>
          </nav>
        </div>
      </div>
      <div class="topbar">
        <div class="topbar-marquee">
          <span class="topbar-track">${cfg.fullName} &nbsp;&nbsp;•&nbsp;&nbsp; ${cfg.conferenceDates} &middot; ${cfg.venueShort} &nbsp;&nbsp;•&nbsp;&nbsp; ${cfg.fullName} &nbsp;&nbsp;•&nbsp;&nbsp; ${cfg.conferenceDates} &middot; ${cfg.venueShort}</span>
        </div>
      </div>
    </header>`;

    wireHeaderInteractions();
    syncHeaderOffset();
  }

  function syncHeaderOffset() {
    document.body.style.removeProperty("padding-top");
  }

  function resolveAssetUrl(src) {
    if (!src) return "";
    try {
      return new URL(src, window.location.href).href;
    } catch {
      return src;
    }
  }

  function renderHeroSlides(cfg) {
    document.querySelectorAll("[data-widget='hero-slideshow']").forEach((el) => {
      const slides = cfg.heroSlides || [];
      if (!slides.length) {
        el.innerHTML = `<div class="slides-container"><div class="slide"><div class="placeholder">Add hero images via site-config.json</div></div></div>`;
        return;
      }
      el.innerHTML = `
        <div class="slides-container">${slides.map((s, i) => `<div class="slide${i === 0 ? ' active' : ''}" data-index="${i}">${s ? `<img src="${resolveAssetUrl(s)}" alt="slide-${i+1}">` : `<div class="placeholder">Image ${i + 1}</div>`}</div>`).join('')}</div>
        
        <button class="arrow arrow-left" aria-label="Previous slide">❮</button>
        <button class="arrow arrow-right" aria-label="Next slide">❯</button>
        <div class="controls">${slides.map((_, i) => `<div class="dot" data-index="${i}"></div>`).join('')}</div>`;

      const container = el.querySelector('.slides-container');
      const dots = el.querySelectorAll('.dot');
      const leftBtn = el.querySelector('.arrow-left');
      const rightBtn = el.querySelector('.arrow-right');
      let idx = 0;
      let autoPlayTimer = null;

      function show(i) {
        idx = ((i % slides.length) + slides.length) % slides.length;
        el.querySelectorAll('.slide').forEach((s, j) => s.classList.toggle('active', j === idx));
        dots.forEach((d, j) => d.classList.toggle('active', j === idx));
      }

      function next() {
        show((idx + 1) % slides.length);
        resetTimer();
      }

      function prev() {
        show((idx - 1 + slides.length) % slides.length);
        resetTimer();
      }

      function autoPlay() {
        autoPlayTimer = setInterval(() => show((idx + 1) % slides.length), 5000);
      }

      function resetTimer() {
        clearInterval(autoPlayTimer);
        autoPlay();
      }

      leftBtn.addEventListener('click', prev);
      rightBtn.addEventListener('click', next);
      dots.forEach((d) => d.addEventListener('click', () => {
        show(Number(d.dataset.index));
        resetTimer();
      }));

      el.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
      el.addEventListener('mouseleave', () => autoPlay());

      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
      });

      show(0);
      autoPlay();
    });
  }

  function wireHeaderInteractions() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    toggle?.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    document.querySelectorAll(".nav-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const li = btn.closest(".has-children");
        const isOpen = li.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(isOpen));
      });
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".has-children")) {
        document.querySelectorAll(".has-children.open").forEach((li) => li.classList.remove("open"));
      }
    });
  }

  function initScrollNav() {
    const sourceNav = document.querySelector(".site-nav");
    const header = document.querySelector(".site-header");
    if (!sourceNav || !header || document.querySelector(".scroll-nav")) return;

    const scrollNav = document.createElement("div");
    scrollNav.className = "scroll-nav";
    scrollNav.setAttribute("aria-label", "Compact navigation");
    scrollNav.innerHTML = '<div class="container"><nav class="site-nav"></nav></div>';
    scrollNav.querySelector(".site-nav").innerHTML = sourceNav.innerHTML;
    document.body.appendChild(scrollNav);

    scrollNav.querySelectorAll(".nav-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const item = button.closest(".has-children");
        const open = item.classList.toggle("open");
        button.setAttribute("aria-expanded", String(open));
      });
    });

    const updateVisibility = () => {
      scrollNav.classList.toggle("visible", header.getBoundingClientRect().bottom <= 0);
    };
    window.addEventListener("scroll", updateVisibility, { passive: true });
    updateVisibility();
  }

  function renderFooter(cfg) {
    const mount = document.getElementById("site-footer");
    if (!mount) return;
    const quickLinks = cfg.nav
      .flatMap((i) => (i.children ? i.children : [i]))
      .filter((i) => cfg.footerQuickLinks.includes(i.href));

    mount.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div>
            <strong>${cfg.siteName}</strong>
            <p>${cfg.fullName}</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>${quickLinks.map((l) => `<li><a href="${ROOT}${l.href}">${l.label}</a></li>`).join("")}</ul>
          </div>
          <div>
            <h4>Contact</h4>
            <p>Email: <a href="mailto:${cfg.email}">${cfg.email}</a></p>
            <p>Phone: ${cfg.phone}</p>
          </div>
        </div>
        <div class="container footer-bottom">
          <span>&copy; <span id="year"></span> ${cfg.siteName}. All rights reserved.</span>
        </div>
      </footer>`;
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  function renderDatesTable(cfg) {
    document.querySelectorAll("[data-widget='important-dates']").forEach((el) => {
      el.innerHTML = `
        <ol class="dates-ledger">
          ${cfg.importantDates
            .map(
              (d, i) => `
            <li class="${d.done ? "is-done" : ""}">
              <span class="ledger-index">${String(i + 1).padStart(2, "0")}</span>
              <span class="ledger-label">${d.label}</span>
              <span class="ledger-date${d.date ? "" : " tba"}">${d.date ? formatDateEntry(d) : "To be announced"}</span>
            </li>`
            )
            .join("")}
        </ol>`;
    });
  }

  function renderHeroHighlights(cfg) {
    document.querySelectorAll("[data-widget='hero-highlights']").forEach((el) => {
      if (!cfg.highlights?.length) return;
      el.innerHTML = cfg.highlights
        .map(
          (item) => `
          <div class="highlight-card">
            <strong>${item.value}</strong>
            <span>${item.label}</span>
            <small>${item.caption}</small>
          </div>`
        )
        .join("");
    });
  }

  function renderConferenceTracks(cfg) {
    document.querySelectorAll("[data-widget='conference-tracks']").forEach((el) => {
      if (!cfg.conferenceTracks?.length) return;
      el.innerHTML = cfg.conferenceTracks
        .map(
          (track) => `
          <article class="card reveal">
            <h3>${track.title}</h3>
            <p>${track.text}</p>
          </article>`
        )
        .join("");
      initReveal();
    });
  }

  function renderCmtLinks(cfg) {
    document.querySelectorAll("[data-widget='cmt-link']").forEach((el) => {
      el.setAttribute("href", cfg.cmtLink);
    });
  }

  function renderSimpleFields(cfg) {
    document.querySelectorAll("[data-field]").forEach((el) => {
      const key = el.dataset.field;
      if (cfg[key] === undefined) return;
      el.textContent = cfg[key];
      if (el.tagName === "A" && key === "email") el.setAttribute("href", "mailto:" + cfg[key]);
    });
  }

  function initReveal() {
    if (!"IntersectionObserver" in window) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  async function init() {
    wireHeaderInteractions();
    syncHeaderOffset();
    initScrollNav();

    let cfg;
    try {
      const res = await fetch(CONFIG_PATH, { cache: "no-store" });
      cfg = await res.json();
    } catch (err) {
      console.error("Could not load site-config.json — check that the site is served over http(s), not opened as a local file.", err);
      return;
    }
    renderFooter(cfg);
    renderDatesTable(cfg);
    renderHeroSlides(cfg);
    renderHeroHighlights(cfg);
    renderConferenceTracks(cfg);
    renderCmtLinks(cfg);
    renderSimpleFields(cfg);
    initReveal();

    window.addEventListener("resize", syncHeaderOffset);
    window.addEventListener("load", syncHeaderOffset);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
