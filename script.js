const weddingDate = new Date("2024-11-15T16:00:00");
const countdown = document.querySelector("[data-countdown]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

const pad = (value) => String(value).padStart(2, "0");

const updateCountdown = () => {
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();

  if (diff <= 0) {
    countdown.classList.add("countdown__timer--complete");
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysEl.textContent = pad(days);
  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);
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

  rsvpMessage.textContent = `¡Gracias, ${name}! Hemos registrado ${guests} invitado(s).`;
  rsvpForm.reset();
});
