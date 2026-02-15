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

const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
const isSmallScreen = window.matchMedia("(max-width: 820px)").matches;
const disableRevealMotion = reduceMotionQuery.matches || (isTouchDevice && isSmallScreen);

if (disableRevealMotion) {
  document.body.classList.add("no-motion");
}

const revealElements = document.querySelectorAll(".reveal");
if (!disableRevealMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("is-visible"));
}

const galleryItems = [...document.querySelectorAll(".gallery__item")];

let galleryTicking = false;
const updateGalleryActiveByScroll = () => {
  if (!galleryItems.length) return;

  const viewportCenter = window.innerHeight * 0.58;
  let nearest = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  galleryItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;
    const distance = Math.abs(elementCenter - viewportCenter);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = item;
    }
  });

  galleryItems.forEach((item) => item.classList.remove("is-active"));
  if (nearest) {
    nearest.classList.add("is-active");
  }
};

const onScrollGallery = () => {
  if (galleryTicking) return;
  galleryTicking = true;
  requestAnimationFrame(() => {
    updateGalleryActiveByScroll();
    galleryTicking = false;
  });
};

window.addEventListener("scroll", onScrollGallery, { passive: true });
window.addEventListener("resize", onScrollGallery);
updateGalleryActiveByScroll();

const rsvpLink = document.querySelector("[data-rsvp-link]");
if (rsvpLink) {
  rsvpLink.addEventListener("click", (event) => {
    if (rsvpLink.getAttribute("href") === "#") {
      event.preventDefault();
      alert("Cuando tengas tu formulario, reemplaza el # por tu enlace de RSVP.");
    }
  });
}
