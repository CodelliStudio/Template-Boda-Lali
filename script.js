const countdown = document.querySelector("[data-countdown]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

const parseTargetDate = () => {
  const raw = countdown?.dataset.date;
  if (!raw) return null;

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const targetDate = parseTargetDate();
const pad = (value) => String(value).padStart(2, "0");

const updateCountdown = () => {
  if (!targetDate) return;

  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    if (daysEl) daysEl.textContent = "00";
    if (hoursEl) hoursEl.textContent = "00";
    if (minutesEl) minutesEl.textContent = "00";
    if (secondsEl) secondsEl.textContent = "00";
    return;
  }

  const total = Math.floor(diff / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  if (daysEl) daysEl.textContent = pad(days);
  if (hoursEl) hoursEl.textContent = pad(hours);
  if (minutesEl) minutesEl.textContent = pad(minutes);
  if (secondsEl) secondsEl.textContent = pad(seconds);
};

updateCountdown();
setInterval(updateCountdown, 1000);


/* ===============================
    REVEAL
================================= */

const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const disableRevealMotion = reduceMotionQuery.matches;

if (disableRevealMotion) {
  document.body.classList.add("no-motion");
}

const revealElements = document.querySelectorAll(".reveal");

if (!disableRevealMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => { //NO CAMBIAR ESTA LINEA
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); //NO CAMBIAR ESTA LINEA
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("is-visible"));
}


/* ===============================
    GALLERY
    Desktop → Hover
    Mobile → Scroll centrado
    NO TOCAR DE AQUÍ ABAJO EN FUTUROS CAMBIOS AL JS
================================= */

const galleryItems = [
  ...document.querySelectorAll(".gallery__item")
];

// Detectar si el dispositivo tiene hover real (desktop)
const hasRealHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (!hasRealHover && galleryItems.length) {
  // SOLO activar scroll en móvil

  const activateGalleryItem = (index) => {
    const clampedIndex = Math.max(0, Math.min(index, galleryItems.length - 1));

    galleryItems.forEach((item, itemIndex) => {
      item.classList.toggle("is-active", itemIndex === clampedIndex);
    });
  };

  const updateGalleryByScroll = () => {
    const viewportCenter = window.innerHeight * 0.55;
    let closestIndex = 0;
    let closestDistance = Infinity;

    galleryItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect();

      // Ignorar elementos fuera del viewport
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const itemCenter = rect.top + rect.height / 2;
      const distance = Math.abs(itemCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    activateGalleryItem(closestIndex);
  };

  let ticking = false;

  const onGalleryScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateGalleryByScroll();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", onGalleryScroll, { passive: true });
  window.addEventListener("resize", onGalleryScroll);
  window.addEventListener("load", onGalleryScroll);

  updateGalleryByScroll();
}


/* ===============================
    RSVP
================================= */

const rsvpLink = document.querySelector("[data-rsvp-link]");
if (rsvpLink) {
  rsvpLink.addEventListener("click", (event) => {
    if (rsvpLink.getAttribute("href") === "#") {
      event.preventDefault();
      alert("Falta añadir enlace.");
    }
  });
}
