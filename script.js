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
const disableRevealMotion = reduceMotionQuery.matches;

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
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("is-visible"));
}

const gallerySection = document.querySelector(".gallery, [data-gallery]");
const galleryItems = [
  ...document.querySelectorAll(".gallery__item, .gallery-item, [data-gallery-item]")
];

const activateGalleryItem = (index) => {
  if (!galleryItems.length) return;

  const clampedIndex = Math.max(0, Math.min(index, galleryItems.length - 1));
  galleryItems.forEach((item, itemIndex) => {
    item.classList.toggle("is-active", itemIndex === clampedIndex);
  });
};

const updateGalleryByScroll = () => {
  if (!galleryItems.length) return;

  const viewportCenter = window.innerHeight * 0.56;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  galleryItems.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const distance = Math.abs(itemCenter - viewportCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  activateGalleryItem(closestIndex);
};

if (galleryItems.length) {
  let galleryTicking = false;

  const onGalleryScroll = () => {
    if (galleryTicking) return;
    galleryTicking = true;
    requestAnimationFrame(() => {
      updateGalleryByScroll();
      galleryTicking = false;
    });
  };

  window.addEventListener("scroll", onGalleryScroll, { passive: true });
  window.addEventListener("resize", onGalleryScroll);
  window.addEventListener("load", onGalleryScroll);

  if ("IntersectionObserver" in window) {
    const galleryObserver = new IntersectionObserver(
      () => onGalleryScroll(),
      {
        root: null,
        threshold: [0.2, 0.45, 0.7],
        rootMargin: "0px 0px -8% 0px"
      }
    );

    galleryItems.forEach((item) => galleryObserver.observe(item));
    if (gallerySection) {
      galleryObserver.observe(gallerySection);
    }
  }

  onGalleryScroll();
}

const rsvpLink = document.querySelector("[data-rsvp-link]");
if (rsvpLink) {
  rsvpLink.addEventListener("click", (event) => {
    if (rsvpLink.getAttribute("href") === "#") {
      event.preventDefault();
      alert("Cuando tengas tu formulario, reemplaza el # por tu enlace de RSVP.");
    }
  });
}
