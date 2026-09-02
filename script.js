"use strict";

/* ================================================================
   RÉSERVATIONS — CONFIGURATION RAPIDE

   Option A (recommandée) : collez votre lien Formspree dans endpoint.
   Option B : ajoutez le numéro WhatsApp du restaurant (sans + ni espaces).

   Si les deux champs restent vides, le formulaire fonctionne en mode démo
   et conserve les demandes uniquement sur l'appareil utilisé.
   ================================================================ */
const RESERVATION_CONFIG = {
  endpoint: "",
  whatsapp: "",
};

const state = {
  language: localStorage.getItem("jafood_language") || "fr",
  filter: "all",
};

const messages = {
  fr: {
    navLabelOpen: "Ouvrir le menu",
    navLabelClose: "Fermer le menu",
    required: "Ce champ est obligatoire.",
    invalidEmail: "Entrez une adresse e-mail valide.",
    invalidPhone: "Entrez un numéro de téléphone valide.",
    invalidDate: "Choisissez une date à partir d'aujourd'hui.",
    consent: "Votre accord est nécessaire pour envoyer la demande.",
    sending: "Envoi en cours…",
    success: (reference) => `Merci ! Votre demande ${reference} a bien été envoyée. L'équipe JaFood vous contactera pour la confirmer.`,
    whatsapp: (reference) => `Votre demande ${reference} est prête. Envoyez maintenant le message WhatsApp pour la transmettre à JaFood.`,
    demo: (reference) => `Mode démo — votre demande ${reference} a été enregistrée sur cet appareil. Ajoutez Formspree ou WhatsApp dans script.js avant la mise en ligne.`,
    error: "Impossible d'envoyer la demande pour le moment. Vérifiez votre connexion et réessayez.",
    reservationText: (data, reference) =>
      `Bonjour JaFood ! Je souhaite réserver une table.\nRéférence : ${reference}\nNom : ${data.name}\nTéléphone : ${data.phone}\nE-mail : ${data.email}\nDate : ${data.date}\nHeure : ${data.time}\nPersonnes : ${data.guests}\nNote : ${data.notes || "—"}`,
  },
  en: {
    navLabelOpen: "Open navigation",
    navLabelClose: "Close navigation",
    required: "This field is required.",
    invalidEmail: "Enter a valid email address.",
    invalidPhone: "Enter a valid phone number.",
    invalidDate: "Choose a date from today onward.",
    consent: "Your consent is required to send the request.",
    sending: "Sending…",
    success: (reference) => `Thank you! Your request ${reference} has been sent. The JaFood team will contact you to confirm it.`,
    whatsapp: (reference) => `Your request ${reference} is ready. Send the WhatsApp message now to deliver it to JaFood.`,
    demo: (reference) => `Demo mode — request ${reference} was saved on this device. Add Formspree or WhatsApp in script.js before publishing.`,
    error: "We couldn't send your request right now. Check your connection and try again.",
    reservationText: (data, reference) =>
      `Hello JaFood! I would like to book a table.\nReference: ${reference}\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nDate: ${data.date}\nTime: ${data.time}\nGuests: ${data.guests}\nNote: ${data.notes || "—"}`,
  },
};

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const languageButtons = document.querySelectorAll("[data-lang]");
const filterButtons = document.querySelectorAll("[data-filter]");
const menuItems = document.querySelectorAll("[data-menu-item]");
const visibleCount = document.querySelector("#visible-count");
const reservationForm = document.querySelector("#reservation-form");
const formStatus = document.querySelector("#form-status");
const submitLabel = document.querySelector("[data-submit-label]");

function updateLanguage(language) {
  state.language = language;
  document.documentElement.lang = language;
  localStorage.setItem("jafood_language", language);

  document.querySelectorAll("[data-fr][data-en]").forEach((element) => {
    element.textContent = element.dataset[language];
  });

  document.querySelectorAll("[data-placeholder-fr][data-placeholder-en]").forEach((element) => {
    element.placeholder = element.dataset[`placeholder${language === "fr" ? "Fr" : "En"}`];
  });

  document.querySelectorAll("[data-alt-fr][data-alt-en]").forEach((element) => {
    element.setAttribute("aria-label", element.dataset[`alt${language === "fr" ? "Fr" : "En"}`]);
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  updateNavToggleLabel();
  document.title = language === "fr"
    ? "JaFood — Menu & Réservation | Hamra, Beirut"
    : "JaFood — Menu & Reservations | Hamra, Beirut";
}

function updateNavToggleLabel() {
  const isOpen = navToggle?.getAttribute("aria-expanded") === "true";
  if (navToggle) {
    navToggle.setAttribute(
      "aria-label",
      isOpen ? messages[state.language].navLabelClose : messages[state.language].navLabelOpen,
    );
  }
}

function closeNavigation() {
  navToggle?.setAttribute("aria-expanded", "false");
  siteNav?.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  updateNavToggleLabel();
}

navToggle?.addEventListener("click", () => {
  const willOpen = navToggle.getAttribute("aria-expanded") !== "true";
  navToggle.setAttribute("aria-expanded", String(willOpen));
  siteNav?.classList.toggle("is-open", willOpen);
  document.body.classList.toggle("nav-open", willOpen);
  updateNavToggleLabel();
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => updateLanguage(button.dataset.lang));
});

function applyMenuFilter(filter) {
  state.filter = filter;
  let count = 0;

  menuItems.forEach((item) => {
    const matches = filter === "all" || item.dataset.category === filter;
    item.classList.toggle("is-hidden", !matches);
    if (matches) count += 1;
  });

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (visibleCount) visibleCount.textContent = String(count);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => applyMenuFilter(button.dataset.filter));
});

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const dateInput = reservationForm?.elements.namedItem("date");
if (dateInput instanceof HTMLInputElement) {
  const today = getLocalDateString();
  dateInput.min = today;
}

function setFieldError(field, message = "") {
  const error = reservationForm?.querySelector(`[data-error-for="${field.name}"]`);
  field.classList.toggle("is-invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  if (error) error.textContent = message;
}

function validateField(field) {
  const copy = messages[state.language];
  const value = field.type === "checkbox" ? field.checked : field.value.trim();
  let error = "";

  if (field.required && !value) {
    error = field.name === "consent" ? copy.consent : copy.required;
  } else if (field.name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    error = copy.invalidEmail;
  } else if (field.name === "phone" && value && !/^[+\d][\d\s().-]{6,}$/.test(value)) {
    error = copy.invalidPhone;
  } else if (field.name === "date" && value && value < getLocalDateString()) {
    error = copy.invalidDate;
  }

  setFieldError(field, error);
  return !error;
}

reservationForm?.querySelectorAll("input, select").forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.classList.contains("is-invalid")) validateField(field);
  });
});

function createReference() {
  const date = new Date();
  const stamp = `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `JF-${stamp}-${random}`;
}

function showStatus(message, isError = false) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.hidden = false;
  formStatus.classList.toggle("is-error", isError);
  formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function saveDemoReservation(payload) {
  const key = "jafood_reservations";
  let reservations = [];
  try {
    reservations = JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    reservations = [];
  }
  reservations.push(payload);
  localStorage.setItem(key, JSON.stringify(reservations));
}

reservationForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!reservationForm || !submitLabel) return;

  const requiredFields = [...reservationForm.querySelectorAll("[required]")];
  const isValid = requiredFields.map(validateField).every(Boolean);

  if (!isValid) {
    reservationForm.querySelector(".is-invalid")?.focus();
    return;
  }

  const formData = new FormData(reservationForm);
  const data = Object.fromEntries(formData.entries());
  delete data.consent;
  const reference = createReference();
  const payload = {
    ...data,
    reference,
    language: state.language,
    createdAt: new Date().toISOString(),
  };

  const originalLabel = submitLabel.textContent;
  submitLabel.textContent = messages[state.language].sending;
  reservationForm.querySelector("button[type='submit']")?.classList.add("is-loading");
  formStatus.hidden = true;

  try {
    if (RESERVATION_CONFIG.endpoint) {
      const response = await fetch(RESERVATION_CONFIG.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Reservation service returned ${response.status}`);
      showStatus(messages[state.language].success(reference));
      reservationForm.reset();
    } else if (RESERVATION_CONFIG.whatsapp) {
      const text = messages[state.language].reservationText(data, reference);
      const url = `https://wa.me/${RESERVATION_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      showStatus(messages[state.language].whatsapp(reference));
    } else {
      saveDemoReservation(payload);
      showStatus(messages[state.language].demo(reference));
      reservationForm.reset();
    }
  } catch (error) {
    console.error(error);
    showStatus(messages[state.language].error, true);
  } finally {
    submitLabel.textContent = originalLabel;
    reservationForm.querySelector("button[type='submit']")?.classList.remove("is-loading");
  }
});

const revealElements = document.querySelectorAll(".reveal");
revealElements.forEach((element) => {
  const delay = Number(element.dataset.delay || 0);
  element.style.setProperty("--reveal-delay", `${delay}ms`);
});

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" },
  );
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

window.addEventListener(
  "scroll",
  () => header?.classList.toggle("is-scrolled", window.scrollY > 24),
  { passive: true },
);

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeNavigation();
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
updateLanguage(state.language === "en" ? "en" : "fr");
applyMenuFilter(state.filter);
