const countdown = document.querySelector("[data-countdown]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

const parseWeddingDate = () => {
  const dateValue = countdown?.dataset.date;
  if (!dateValue) {
    return null;
  }
  const baseDate = new Date(dateValue);
  if (Number.isNaN(baseDate.getTime())) {
    return null;
  }

  const now = new Date();
  if (baseDate.getTime() < now.getTime()) {
    const nextYear = new Date(baseDate);
    nextYear.setFullYear(now.getFullYear() + 1);
    return nextYear;
  }
  return baseDate;
};

const weddingDate = parseWeddingDate();
const pad = (value) => String(value).padStart(2, "0");

const updateCountdown = () => {
  if (!weddingDate) {
    return;
  }
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();

  if (diff <= 0) {
    countdown?.classList.add("countdown__timer--complete");
    if (daysEl) daysEl.textContent = "00";
    if (hoursEl) hoursEl.textContent = "00";
    if (minutesEl) minutesEl.textContent = "00";
    if (secondsEl) secondsEl.textContent = "00";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (daysEl) daysEl.textContent = pad(days);
  if (hoursEl) hoursEl.textContent = pad(hours);
  if (minutesEl) minutesEl.textContent = pad(minutes);
  if (secondsEl) secondsEl.textContent = pad(seconds);
};

updateCountdown();
setInterval(updateCountdown, 1000);

const calendarButton = document.querySelector("[data-calendar]");
const reminderButton = document.querySelector("[data-reminder]");
const pinterestButton = document.querySelector("[data-pinterest]");
const galleryButton = document.querySelector("[data-gallery]");

calendarButton?.addEventListener("click", () => {
  window.open("https://calendar.google.com", "_blank");
});

reminderButton?.addEventListener("click", () => {
  window.open("https://calendar.google.com", "_blank");
});

pinterestButton?.addEventListener("click", () => {
  window.open("https://www.pinterest.com", "_blank");
});

galleryButton?.addEventListener("click", () => {
  alert("Muy pronto podrás subir tus fotos a nuestra galería.");
});

const rsvpForm = document.querySelector("[data-rsvp]");
const rsvpMessage = document.querySelector("[data-rsvp-message]");

rsvpForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(rsvpForm);
  const name = formData.get("name");
  const guests = formData.get("guests");

  if (rsvpMessage) {
    rsvpMessage.textContent = `¡Gracias, ${name}! Hemos registrado ${guests} invitado(s).`;
  }
  rsvpForm.reset();
});
