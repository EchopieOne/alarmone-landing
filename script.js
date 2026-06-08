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

/* ---- GSAP motion ---- */

if (typeof window.gsap !== "undefined") {
  document.documentElement.dataset.gsap = gsap.version;

  const mm = gsap.matchMedia();

  mm.add(
    {
      reduceMotion: "(prefers-reduced-motion: reduce)",
      desktop: "(min-width: 900px)",
    },
    (context) => {
      const { reduceMotion, desktop } = context.conditions;
      if (reduceMotion) return;

      gsap.defaults({
        duration: 0.72,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.from(".site-header", {
        y: -12,
        autoAlpha: 0,
        duration: 0.5,
        clearProps: "all",
      });

      gsap.from(".hero-copy > *", {
        y: 28,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.78,
        clearProps: "all",
      });

      gsap.from(".phone-stage", {
        y: desktop ? 36 : 24,
        scale: desktop ? 0.96 : 0.98,
        autoAlpha: 0,
        delay: 0.18,
        duration: 0.86,
        clearProps: "all",
      });

      const revealTargets = [
        ".section-kicker",
        ".section-head",
        ".feature",
        ".scenario",
        ".timeline-row",
        ".review-card",
        ".faq",
        ".blog-preview",
        ".final-cta-inner",
        ".article-hero > *",
        ".article-body section",
        ".blog-card",
      ].join(",");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            observer.unobserve(entry.target);
            gsap.from(entry.target, {
              y: 24,
              autoAlpha: 0,
              duration: 0.62,
              clearProps: "all",
            });
          });
        },
        {
          rootMargin: "0px 0px -12% 0px",
          threshold: 0.12,
        }
      );

      document.querySelectorAll(revealTargets).forEach((node) => {
        observer.observe(node);
      });

      return () => observer.disconnect();
    }
  );
}
