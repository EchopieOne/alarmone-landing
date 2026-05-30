const yearNode = document.querySelector("[data-year]");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

document.querySelectorAll("[data-local-time]").forEach((node) => {
  const zone = node.getAttribute("data-local-time");
  if (!zone) return;

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: zone,
  });

  node.textContent = formatter.format(new Date());
});

/* ---- GSAP scroll animations ---- */

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReduced) {
  // Hero — fade in on load
  gsap.from(".hero-copy", {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: "power2.out",
  });

  gsap.from(".phone-stage", {
    opacity: 0,
    y: 60,
    duration: 0.9,
    delay: 0.2,
    ease: "power2.out",
  });

  // Feature cards — staggered reveal
  ScrollTrigger.batch(".feature", {
    onEnter: (elements) => {
      gsap.from(elements, {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        overwrite: true,
      });
    },
    start: "top 85%",
    once: true,
  });

  // Split sections — slide in from sides
  document.querySelectorAll(".split").forEach((section) => {
    const children = section.children;
    if (children.length < 2) return;

    gsap.from(children[0], {
      opacity: 0,
      x: -40,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        once: true,
      },
    });

    gsap.from(children[1], {
      opacity: 0,
      x: 40,
      duration: 0.7,
      delay: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        once: true,
      },
    });
  });

  // Timeline rows — staggered fade up
  ScrollTrigger.batch(".timeline-row", {
    onEnter: (elements) => {
      gsap.from(elements, {
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.12,
        ease: "power2.out",
        overwrite: true,
      });
    },
    start: "top 85%",
    once: true,
  });

  // Review cards — staggered reveal
  ScrollTrigger.batch(".review-card", {
    onEnter: (elements) => {
      gsap.from(elements, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        overwrite: true,
      });
    },
    start: "top 85%",
    once: true,
  });

  // FAQ items — fade up
  ScrollTrigger.batch(".faq", {
    onEnter: (elements) => {
      gsap.from(elements, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        overwrite: true,
      });
    },
    start: "top 88%",
    once: true,
  });

  // CTA — scale up
  gsap.from(".cta", {
    opacity: 0,
    scale: 0.95,
    duration: 0.7,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".cta",
      start: "top 85%",
      once: true,
    },
  });

  // Section headings — fade up
  gsap.utils.toArray(".section-head").forEach((head) => {
    gsap.from(head, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: head,
        start: "top 85%",
        once: true,
      },
    });
  });
}
