import { previewRotation } from "./rotation-preview.mjs";

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

const menu = document.querySelector(".menu-toggle");
const links = document.querySelector(".nav-links");
if (menu && links) {
  menu.hidden = false;
  links.dataset.enhanced = "";
  const closeMenu = () => {
    links.classList.remove("is-open");
    menu.setAttribute("aria-expanded", "false");
    menu.textContent = "Menu";
  };
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    links.classList.toggle("is-open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.textContent = open ? "Close" : "Menu";
  });
  links.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menu.focus();
    }
  });
}

const form = document.querySelector("[data-home-rotation]");
if (form) {
  const grid = document.querySelector("[data-home-days]");
  const result = document.querySelector("[data-home-result]");
  const range = document.querySelector("[data-home-range]");
  const error = document.querySelector("[data-home-error]");
  const presets = document.querySelector(".rotation-presets");
  const fields = form.elements;
  const now = new Date();
  fields.start.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  const fullDate = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  const asDate = (value) => new Date(`${value}T00:00:00Z`);
  const showError = (message) => {
    error.textContent = message;
    error.hidden = !message;
  };

  function render() {
    if (!form.checkValidity()) {
      const invalid = [...fields].find((field) => !field.validity.valid);
      showError(invalid ? `${invalid.labels[0].textContent}: ${invalid.validationMessage}` : "Check your schedule settings.");
      return;
    }
    try {
      const work = Number(fields.work.value);
      const rest = Number(fields.rest.value);
      const time = fields.time.value;
      const days = previewRotation(fields.start.value, work, rest);
      const fragment = document.createDocumentFragment();
      const offset = (asDate(days[0].date).getUTCDay() + 6) % 7;
      for (let i = 0; i < offset; i += 1) {
        const empty = document.createElement("li");
        empty.className = "empty-day";
        empty.setAttribute("aria-hidden", "true");
        fragment.append(empty);
      }
      for (const day of days) {
        const item = document.createElement("li");
        item.className = day.work ? "work-day" : "rest-day";
        item.setAttribute("aria-label", `${fullDate.format(asDate(day.date))}, ${day.work ? `work, alarm at ${time}` : "rest, no alarm"}`);
        const date = document.createElement("time");
        date.dateTime = day.date;
        date.textContent = String(asDate(day.date).getUTCDate());
        const status = document.createElement("span");
        status.className = "day-status";
        status.textContent = day.work ? "Work" : "Rest";
        item.append(date, status);
        fragment.append(item);
      }
      grid.replaceChildren(fragment);
      const alarms = days.filter((day) => day.work).length;
      range.textContent = `${shortDate.format(asDate(days[0].date))} – ${shortDate.format(asDate(days.at(-1).date))}`;
      result.textContent = `${work} work ${work === 1 ? "day" : "days"}, then ${rest} rest ${rest === 1 ? "day" : "days"}. ${alarms} ${alarms === 1 ? "alarm" : "alarms"} in the next 30 days, at ${time}.`;
      presets.querySelectorAll("button").forEach((button) => {
        button.setAttribute("aria-pressed", String(Number(button.dataset.work) === work && Number(button.dataset.rest) === rest));
      });
      showError("");
    } catch (failure) {
      showError(failure.message);
    }
  }

  form.hidden = false;
  presets.hidden = false;
  form.addEventListener("input", render);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    render();
  });
  presets.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    fields.work.value = button.dataset.work;
    fields.rest.value = button.dataset.rest;
    render();
  });
  render();
}

// The header follows each chapter's own ground; the page never recolours mid-section.
const header = document.querySelector(".site-header");
const chapters = [...document.querySelectorAll("main > section, .site-footer")];
let headerFrame = 0;
function updateHeader() {
  headerFrame = 0;
  if (!header) return;
  const line = header.getBoundingClientRect().bottom + 1;
  const chapter = chapters.find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= line && rect.bottom > line;
  });
  let tone = "paper";
  if (chapter?.matches(".hero")) {
    const seam = chapter.getBoundingClientRect().top + parseFloat(getComputedStyle(chapter, "::before").height);
    tone = seam <= line ? "blue" : "paper";
  } else if (chapter?.matches(".widget-section, .featured-guide")) tone = "blue";
  else if (chapter?.matches(".world-section, .close-section, .final-cta, .site-footer")) tone = "dark";
  else if (chapter?.matches(".rotation-section, .article-hero")) tone = "ice";
  if (header.dataset.tone !== tone) header.dataset.tone = tone;
}
function scheduleHeader() {
  if (!headerFrame) headerFrame = requestAnimationFrame(updateHeader);
}
addEventListener("scroll", scheduleHeader, { passive: true });
addEventListener("resize", scheduleHeader, { passive: true });
updateHeader();

// GSAP is already bundled with the site. Every static state remains readable without it.
function startMotion() {
  const gsap = window.gsap;
  if (!gsap) return;
  document.documentElement.dataset.gsap = gsap.version;
  const media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", () => {
    const title = document.querySelector(".hero-display, .blog-hero h1, .article-hero h1");
    if (title) gsap.from(title, { y: 18, duration: 0.8, ease: "power3.out", clearProps: "transform" });
    const shots = document.querySelectorAll(".product-shot");
    if (shots.length) gsap.from(shots, { y: 40, scale: 0.97, stagger: 0.08, duration: 0.9, ease: "power3.out", clearProps: "transform" });

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const picture = entry.target.matches("figure");
        const row = entry.target.matches(".capability, .faq, .guide-row");
        gsap.from(entry.target, {
          y: row ? 0 : 24,
          x: row ? 16 : 0,
          scale: picture ? 0.97 : 1,
          opacity: picture ? 1 : 0.55,
          duration: picture ? 0.95 : 0.72,
          ease: "power3.out",
          clearProps: "transform,opacity",
        });
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    document.querySelectorAll([
      ".rotation-controls > h2", ".rotation-controls > p", ".rotation-presets", ".rotation-field", ".date-time-fields",
      ".world-heading", ".world-portrait", ".world-copy > *",
      ".features-heading", ".capability", ".guide-links",
      ".widget-copy > *", ".widget-picture", ".faq-header > *", ".faq",
      ".close-section > h2", ".close-bottom > p", ".footer-wordmark",
      ".featured-copy > *", ".featured-picture", ".guides-header > h2", ".guide-row",
      ".article-body article > section > h2", ".article-illustration", ".table-scroll", ".related-reading li",
    ].join(",")).forEach((element) => observer.observe(element));

    // A small scroll-linked drift carries the real product screens across the colour seam.
    const stage = document.querySelector(".product-stage");
    if (!stage) return () => observer.disconnect();
    const drift = gsap.quickTo(stage, "y", { duration: 0.35, ease: "power2.out" });
    let driftFrame = 0;
    const updateDrift = () => {
      driftFrame = 0;
      if (!document.hidden) drift(Math.min(32, scrollY * 0.045));
    };
    const onScroll = () => {
      if (!driftFrame) driftFrame = requestAnimationFrame(updateDrift);
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(driftFrame);
    };
  });
}
if (document.readyState === "loading") addEventListener("DOMContentLoaded", startMotion, { once: true });
else startMotion();
