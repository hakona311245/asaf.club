const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));

const setRevealDelay = (selector, step) => {
  document.querySelectorAll(selector).forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${index * step}ms`);
  });
};

const showAllReveals = () => {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");
    item.style.removeProperty("--reveal-delay");
  });
};

const enableMotion = () => {
  if (reduceMotionQuery.matches) {
    document.body.classList.remove("motion-ready", "motion-loaded");
    showAllReveals();
    return;
  }

  document.body.classList.add("motion-ready");
  setRevealDelay(".drink-grid [data-reveal]", 85);
  setRevealDelay(".space-collage [data-reveal]", 120);
  setRevealDelay(".gallery-grid [data-reveal]", 70);

  requestAnimationFrame(() => {
    document.body.classList.add("motion-loaded");
  });

  if (!("IntersectionObserver" in window)) {
    showAllReveals();
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        window.setTimeout(() => {
          entry.target.style.removeProperty("--reveal-delay");
        }, 950);
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.14,
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
};

enableMotion();

if (typeof reduceMotionQuery.addEventListener === "function") {
  reduceMotionQuery.addEventListener("change", enableMotion);
} else if (typeof reduceMotionQuery.addListener === "function") {
  reduceMotionQuery.addListener(enableMotion);
}
