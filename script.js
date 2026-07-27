const WHATSAPP_NUMBER = "919487411599";

const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");

/* ---------- Mobile nav ---------- */

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    const item = link.closest(".nav-item");
    // On mobile, first tap on a dropdown parent opens the submenu
    if (item && link.parentElement === item && window.matchMedia("(max-width: 920px)").matches) {
      if (!item.classList.contains("is-open")) {
        event.preventDefault();
        item.classList.add("is-open");
        return;
      }
    }
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
}

/* ---------- Active nav link ---------- */

const currentPage = (location.pathname.split("/").pop() || "index.html").split("#")[0];
document.querySelectorAll(".main-nav a").forEach((link) => {
  const target = (link.getAttribute("href") || "").split("/").pop().split("#")[0];
  if (
    target === currentPage ||
    (currentPage === "" && target === "index.html") ||
    target.replace(".html", "") === currentPage
  ) {
    link.classList.add("is-active");
  }
});

/* ---------- Hero slider ---------- */

const slider = document.querySelector("[data-slider]");
if (slider) {
  const slides = [...slider.querySelectorAll(".slide")];
  const dotsWrap = slider.querySelector("[data-slider-dots]");
  let index = 0;
  let timer = null;

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => {
      goTo(i);
      restart();
    });
    dotsWrap?.appendChild(dot);
    return dot;
  });

  const goTo = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((slide, n) => slide.classList.toggle("is-active", n === index));
    dots.forEach((dot, n) => dot.classList.toggle("is-active", n === index));
  };

  const restart = () => {
    clearInterval(timer);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = setInterval(() => goTo(index + 1), 5500);
    }
  };

  goTo(0);
  restart();
}

/* ---------- Reveal on scroll ---------- */

const revealables = document.querySelectorAll(".reveal, [data-stagger]");
if ("IntersectionObserver" in window && revealables.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" }
  );
  revealables.forEach((el) => revealObserver.observe(el));
} else {
  revealables.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- Animated counters ---------- */

const counters = document.querySelectorAll("[data-count]");
const animateCounter = (el) => {
  const target = Number(el.dataset.count || 0);
  const suffix = el.dataset.suffix || "";
  const duration = 1800;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString("en-IN") + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window && counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((el) => counterObserver.observe(el));
} else {
  counters.forEach((el) => {
    el.textContent = Number(el.dataset.count || 0).toLocaleString("en-IN") + (el.dataset.suffix || "");
  });
}

/* ---------- WhatsApp forms (hero enquiry + booking form) ---------- */

const FIELD_LABELS = {
  name: "Name",
  phone: "Phone",
  trip: "Trip type",
  destination: "Destination",
  pickup: "Pickup",
  dates: "Travel dates",
  passengers: "Passengers",
  details: "Details",
};

document.querySelectorAll("[data-wa-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const lines = ["Hello CPGS Tours & Travels! I would like to plan a trip.", ""];

    Object.keys(FIELD_LABELS).forEach((key) => {
      const value = data.get(key)?.toString().trim();
      if (value) lines.push(`*${FIELD_LABELS[key]}:* ${value}`);
    });

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener");

    const statusLine = form.querySelector("[data-form-status]");
    if (statusLine) {
      const name = data.get("name")?.toString().trim();
      statusLine.textContent = `Thanks, ${name || "traveller"}! Opening WhatsApp to send your request…`;
    }
    form.reset();
  });
});


/* ---------- FAQ tabs ---------- */

document.querySelectorAll("[data-faq-tabs]").forEach((wrap) => {
  const tabs = [...wrap.querySelectorAll("[data-faq-tab]")];
  const panels = [...wrap.querySelectorAll("[data-faq-panel]")];
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.getAttribute("data-faq-tab");
      tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
      panels.forEach((p) => p.classList.toggle("is-active", p.getAttribute("data-faq-panel") === key));
    });
  });

  // open a tab from URL hash (#wdt-tabs-0 style or #passport/#group/#honeymoon)
  const hash = location.hash.replace("#", "");
  const map = { "wdt-tabs-0": "passport", "wdt-tabs-1": "group", "wdt-tabs-2": "honeymoon" };
  const target = map[hash] || hash;
  const match = tabs.find((t) => t.getAttribute("data-faq-tab") === target);
  if (match) match.click();
});
