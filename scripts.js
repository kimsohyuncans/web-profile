(function () {
  "use strict";

  /* ---------- Theme toggle ---------- */
  function initTheme() {
    const toggle = document.getElementById("theme-toggle");
    const label = toggle?.querySelector("[data-theme-label]");
    const html = document.documentElement;

    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved || (prefersDark ? "dark" : "light");
    apply(initial);

    toggle?.addEventListener("click", () => {
      const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      localStorage.setItem("theme", next);
    });

    function apply(theme) {
      html.setAttribute("data-theme", theme);
      if (label) label.textContent = theme === "dark" ? "Dark" : "Light";
    }
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const targets = [
      ".eyebrow",
      ".hero__name",
      ".hero__lede",
      ".facts",
      ".hero__cta",
      ".section__head",
      ".entry",
      ".work",
      ".stack > div",
      ".contact__lede",
      ".contact__list",
    ];

    const nodes = document.querySelectorAll(targets.join(","));
    nodes.forEach((el, i) => {
      el.setAttribute("data-reveal", "");
      // stagger items inside the same section
      const delay = Math.min(i * 40, 600);
      el.style.setProperty("--reveal-delay", `${delay}ms`);
    });

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    nodes.forEach((n) => io.observe(n));
  }

  /* ---------- Active nav link ---------- */
  function initNavSpy() {
    const links = document.querySelectorAll(".nav a[href^='#']");
    if (!links.length || !("IntersectionObserver" in window)) return;

    const map = new Map();
    links.forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      const section = document.getElementById(id);
      if (section) map.set(section, a);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const link = map.get(e.target);
          if (!link) return;
          if (e.isIntersecting) {
            links.forEach((l) => l.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    map.forEach((_link, section) => io.observe(section));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initReveal();
    initNavSpy();
  });
})();
