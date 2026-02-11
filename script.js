/* COUNTDOWN */
const countdown = document.querySelector("[data-countdown]");
const d = (q) => document.querySelector(q);

const els = {
  days: d("[data-days]"),
  hours: d("[data-hours]"),
  minutes: d("[data-minutes]"),
  seconds: d("[data-seconds]")
};

const weddingDate = new Date("2026-11-07T16:00:00");
const pad = (n) => String(n).padStart(2, "0");

function updateCountdown() {
  const diff = weddingDate - new Date();
  if (diff <= 0) return;

  const t = Math.floor(diff / 1000);
  els.days.textContent = pad(Math.floor(t / 86400));
  els.hours.textContent = pad(Math.floor((t % 86400) / 3600));
  els.minutes.textContent = pad(Math.floor((t % 3600) / 60));
  els.seconds.textContent = pad(t % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* SCROLL REVEAL */
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.15 }
);

reveals.forEach((el) => observer.observe(el));

/* RSVP */
document
  .querySelector("[data-rsvp-link]")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Aquí puedes colocar el enlace a tu formulario RSVP.");
  });
