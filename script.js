const WHATSAPP_NUMBER = "919487411599";

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");
const form = document.querySelector("[data-booking-form]");
const statusLine = document.querySelector("[data-form-status]");

/* ---------- Header state ---------- */

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (toggle && nav && header) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    header.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* ---------- Active nav link ---------- */

const currentPage = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".main-nav a").forEach((link) => {
  const target = link.getAttribute("href") || "";
  const targetPage = target.split("/").pop().split("#")[0] || "index.html";
  if (
    targetPage === currentPage ||
    (currentPage === "" && targetPage === "index.html") ||
    targetPage.replace(".html", "") === currentPage
  ) {
    link.classList.add("is-active");
  }
});

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

/* ---------- Booking form -> WhatsApp ---------- */

if (form && statusLine) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get("name")?.toString().trim() || "";
    const phone = data.get("phone")?.toString().trim() || "";
    const trip = data.get("trip")?.toString().trim() || "";
    const pickup = data.get("pickup")?.toString().trim() || "";
    const dates = data.get("dates")?.toString().trim() || "";
    const passengers = data.get("passengers")?.toString().trim() || "";
    const details = data.get("details")?.toString().trim() || "";

    const lines = [
      "Hello CPGS Tours & Travels! I would like to book a trip.",
      "",
      `*Name:* ${name}`,
      `*Phone:* ${phone}`,
      `*Trip type:* ${trip}`,
    ];
    if (pickup) lines.push(`*Pickup:* ${pickup}`);
    if (dates) lines.push(`*Travel dates:* ${dates}`);
    if (passengers) lines.push(`*Passengers:* ${passengers}`);
    if (details) lines.push(`*Details:* ${details}`);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener");
    statusLine.textContent = `Thanks, ${name || "traveller"}! Opening WhatsApp to send your booking request…`;
    form.reset();
  });
}
