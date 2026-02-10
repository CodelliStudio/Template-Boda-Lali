const countdown = document.querySelector("[data-countdown]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

const parseWeddingDate = () => {
  const dateValue = countdown?.dataset.date;
  if (!dateValue) return null;

  const baseDate = new Date(dateValue);
  if (Number.isNaN(baseDate.getTime())) return null;

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
  if (!weddingDate) return;

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

const rsvpLink = document.querySelector("[data-rsvp-link]");

rsvpLink?.addEventListener("click", (event) => {
  if (rsvpLink.getAttribute("href") === "#") {
    event.preventDefault();
    alert("Cuando tengas tu formulario listo, pega aquí el enlace del RSVP.");
  }
});
