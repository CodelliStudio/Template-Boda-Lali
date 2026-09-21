const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbw0z2rcQ_p_6ln7ObBQ3bhPzXnfBbmRf1X8RglRJQRYvSoJgyzrZaGo7f_BcQXBHdPv/exec";

const form = document.querySelector("[data-rsvp-form]");
const statusEl = document.querySelector("[data-rsvp-status]");
const submitButton = document.querySelector("[data-rsvp-submit]");
const confirmedCountEl = document.querySelector("[data-confirmed-count]");
const attendingFields = [...document.querySelectorAll("[data-attending-field]")];
const guestNameEl = document.querySelector("[data-rsvp-guest-name]");
const guestPassesEl = document.querySelector("[data-rsvp-guest-passes]");
const backLink = document.querySelector("[data-rsvp-back-link]");

const params = new URLSearchParams(window.location.search);
const guestId = params.get("guestId");
const guest = guestId && window.guests ? window.guests[guestId] : null;

const guestName = guest?.name || "";
const allowedPasses = guest?.passes || 0;

const setStatus = (message, state = "") => {
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.dataset.state = state;
};

const getSelectedAttendance = () => {
  const selected = attendingFields.find((field) => field.checked);
  return selected?.value || "Sí, asistiremos";
};

const fillConfirmedCountOptions = (maxPasses) => {
  if (!confirmedCountEl) return;

  confirmedCountEl.innerHTML = "";

  for (let count = 1; count <= maxPasses; count += 1) {
    const option = document.createElement("option");
    option.value = String(count);
    option.textContent = String(count);
    confirmedCountEl.appendChild(option);
  }
};

const setDeclinedCount = () => {
  if (!confirmedCountEl) return;

  confirmedCountEl.innerHTML = "";

  const option = document.createElement("option");
  option.value = "0";
  option.textContent = "0";

  confirmedCountEl.appendChild(option);
  confirmedCountEl.value = "0";
  confirmedCountEl.disabled = true;
};

const setAcceptedCount = () => {
  if (!confirmedCountEl || !guest) return;

  fillConfirmedCountOptions(allowedPasses);
  confirmedCountEl.disabled = false;
  confirmedCountEl.value = "1";
};

const syncAttendanceState = () => {
  if (!guest) return;

  if (getSelectedAttendance() === "No podremos asistir") {
    setDeclinedCount();
    return;
  }

  setAcceptedCount();
};

const disableInvalidRsvp = () => {
  if (guestNameEl) {
    guestNameEl.textContent = "Invitación no identificada";
  }

  if (guestPassesEl) {
    guestPassesEl.textContent =
      "Por favor, ingrese desde el enlace personalizado que recibió.";
  }

  if (submitButton) {
    submitButton.disabled = true;
  }

  if (confirmedCountEl) {
    confirmedCountEl.disabled = true;
  }

  attendingFields.forEach((field) => {
    field.disabled = true;
  });

  if (form) {
    const messageField = form.elements.message;

    if (messageField) {
      messageField.disabled = true;
    }
  }

  setStatus(
    "No pudimos identificar su invitación. Abra nuevamente el enlace personalizado que recibió.",
    "error"
  );
};

const initRsvpPage = () => {
  if (!guest) {
    disableInvalidRsvp();

    if (backLink) {
      backLink.href = "index.html";
    }

    return;
  }

  if (guestNameEl) {
    guestNameEl.textContent = guestName;
  }

  if (guestPassesEl) {
    guestPassesEl.textContent =
      `${allowedPasses} ${
        allowedPasses === 1 ? "espacio reservado" : "espacios reservados"
      }`;
  }

  if (backLink) {
    backLink.href =
      `index.html?guestId=${encodeURIComponent(guestId)}`;
  }

  if (form) {
    form.elements.guestId.value = guestId;
    form.elements.guestName.value = guestName;
    form.elements.allowedPasses.value = String(allowedPasses);
  }

  setAcceptedCount();

  attendingFields.forEach((field) => {
    field.addEventListener("change", syncAttendanceState);
  });
};

const getPayload = () => {
  const attending = getSelectedAttendance();

  const confirmedCount =
    attending === "No podremos asistir"
      ? "0"
      : confirmedCountEl?.value || "1";

  return new URLSearchParams({
    guestId: form.elements.guestId.value,
    guestName: form.elements.guestName.value,
    allowedPasses: form.elements.allowedPasses.value,
    attending,
    confirmedCount,
    message: form.elements.message.value.trim()
  });
};

const submitRsvp = async (event) => {
  event.preventDefault();

  if (!form || !submitButton) return;

  // Seguridad: nunca enviar una confirmación sin invitado válido.
  if (!guest || !guestId) {
    setStatus(
      "No pudimos identificar su invitación. Abra nuevamente el enlace personalizado que recibió.",
      "error"
    );

    submitButton.disabled = true;
    return;
  }

  setStatus("Enviando confirmación...", "loading");
  submitButton.disabled = true;

  try {
    await fetch(RSVP_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: getPayload()
    });

    setStatus(
      "Gracias, hemos recibido tu confirmación.",
      "success"
    );
  } catch (error) {
    submitButton.disabled = false;

    setStatus(
      "No pudimos enviar la confirmación. Inténtelo nuevamente.",
      "error"
    );
  }
};

initRsvpPage();

if (form) {
  form.addEventListener("submit", submitRsvp);
}