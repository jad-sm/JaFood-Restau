"use strict";

/* ==================================================================
   LIVE RESERVATION DELIVERY

   Option 1: add your Formspree endpoint.
   Option 2: add the restaurant WhatsApp number (country code included,
             without +, spaces or dashes).

   With both values empty, reservations run in honest demo mode and are
   stored only on the visitor's device.
   ================================================================== */
const RESERVATION_CONFIG = {
  endpoint: "",
  whatsapp: "96176545146",
};

const state = {
  language: localStorage.getItem("jafood_v2_language") || "en",
};

const copy = {
  en: {
    openNav: "Open navigation",
    closeNav: "Close navigation",
    required: "This field is required.",
    invalidEmail: "Enter a valid email address.",
    invalidPhone: "Enter a valid phone number.",
    invalidDate: "Choose a date from today onward.",
    consent: "Your consent is required to send the request.",
    sending: "Sending request…",
    success: (reference) => `Thank you. Request ${reference} has been sent to JaFood. Our team will contact you to confirm availability.`,
    whatsapp: (reference) => `Request ${reference} is ready. Send the WhatsApp message that just opened to deliver it to JaFood.`,
    demo: (reference) => `Demo mode — request ${reference} was saved on this device. Add Formspree or WhatsApp in script.js before publishing the website.`,
    error: "We couldn't send the request right now. Check your connection and try again.",
    whatsappMessage: (data, reference) =>
      `Hello JaFood! I would like to request a table.\nReference: ${reference}\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nDate: ${data.date}\nTime: ${data.time}\nGuests: ${data.guests}\nNotes: ${data.notes || "—"}`,
  },
  fr: {
    openNav: "Ouvrir la navigation",
    closeNav: "Fermer la navigation",
    required: "Ce champ est obligatoire.",
    invalidEmail: "Entrez une adresse e-mail valide.",
    invalidPhone: "Entrez un numéro de téléphone valide.",
    invalidDate: "Choisissez une date à partir d'aujourd'hui.",
    consent: "Votre accord est nécessaire pour envoyer la demande.",
    sending: "Envoi de la demande…",
    success: (reference) => `Merci. La demande ${reference} a été envoyée à JaFood. Notre équipe vous contactera pour confirmer la disponibilité.`,
    whatsapp: (reference) => `La demande ${reference} est prête. Envoyez le message WhatsApp qui vient de s'ouvrir pour la transmettre à JaFood.`,
    demo: (reference) => `Mode démo — la demande ${reference} a été enregistrée sur cet appareil. Ajoutez Formspree ou WhatsApp dans script.js avant de publier le site.`,
    error: "Impossible d'envoyer la demande pour le moment. Vérifiez votre connexion et réessayez.",
    whatsappMessage: (data, reference) =>
      `Bonjour JaFood ! Je souhaite demander une table.\nRéférence : ${reference}\nNom : ${data.name}\nTéléphone : ${data.phone}\nE-mail : ${data.email}\nDate : ${data.date}\nHeure : ${data.time}\nPersonnes : ${data.guests}\nNotes : ${data.notes || "—"}`,
  },
};

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".primary-nav");
const languageButtons = document.querySelectorAll("[data-language]");
const categoryLinks = document.querySelectorAll("[data-category-link]");
const categorySections = document.querySelectorAll("[data-category-section]");
const reservationForm = document.querySelector("#reservation-form");
const formStatus = document.querySelector("#form-status");
const submitLabel = document.querySelector("[data-submit-label]");

function languageDatasetKey(prefix, language) {
  return `${prefix}${language === "en" ? "En" : "Fr"}`;
}

function updateNavLabel() {
  if (!navToggle) return;
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-label", isOpen ? copy[state.language].closeNav : copy[state.language].openNav);
}

function setLanguage(language) {
  state.language = language === "fr" ? "fr" : "en";
  localStorage.setItem("jafood_v2_language", state.language);
  document.documentElement.lang = state.language;

  document.querySelectorAll("[data-en][data-fr]").forEach((element) => {
    element.textContent = element.dataset[state.language];
  });

  document.querySelectorAll("[data-placeholder-en][data-placeholder-fr]").forEach((element) => {
    element.placeholder = element.dataset[languageDatasetKey("placeholder", state.language)];
  });

  document.querySelectorAll("[data-alt-en][data-alt-fr]").forEach((element) => {
    element.alt = element.dataset[languageDatasetKey("alt", state.language)];
  });

  languageButtons.forEach((button) => {
    const active = button.dataset.language === state.language;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  document.title = state.language === "en"
    ? "JaFood — Menu & Reservations | Hamra, Beirut"
    : "JaFood — Menu & Réservations | Hamra, Beyrouth";

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content = state.language === "en"
      ? "Explore JaFood's contemporary Lebanese menu in Hamra, Beirut, organized by category, and request your table online."
      : "Découvrez le menu libanais contemporain de JaFood à Hamra, Beyrouth, classé par catégorie, et demandez votre table en ligne.";
  }

  updateNavLabel();
}

function closeNavigation() {
  if (!navToggle || !primaryNav) return;
  navToggle.setAttribute("aria-expanded", "false");
  primaryNav.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  updateNavLabel();
}

navToggle?.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") !== "true";
  navToggle.setAttribute("aria-expanded", String(open));
  primaryNav?.classList.toggle("is-open", open);
  document.body.classList.toggle("nav-open", open);
  updateNavLabel();
});

primaryNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

function setActiveCategory(category) {
  categoryLinks.forEach((link) => {
    const active = link.dataset.categoryLink === category;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

categoryLinks.forEach((link) => {
  link.addEventListener("click", () => setActiveCategory(link.dataset.categoryLink));
});

if ("IntersectionObserver" in window) {
  const categoryObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveCategory(visible.target.dataset.categorySection);
    },
    { rootMargin: "-20% 0px -62% 0px", threshold: [0.05, 0.2, 0.4] },
  );
  categorySections.forEach((section) => categoryObserver.observe(section));
}

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const dateField = reservationForm?.elements.namedItem("date");
if (dateField instanceof HTMLInputElement) dateField.min = localDateString();

function setFieldError(field, message = "") {
  const error = reservationForm?.querySelector(`[data-error-for="${field.name}"]`);
  field.classList.toggle("is-invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  if (error) error.textContent = message;
}

function validateField(field) {
  const messages = copy[state.language];
  const value = field.type === "checkbox" ? field.checked : String(field.value).trim();
  let error = "";

  if (field.required && !value) {
    error = field.name === "consent" ? messages.consent : messages.required;
  } else if (field.name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    error = messages.invalidEmail;
  } else if (field.name === "phone" && value && !/^[+\d][\d\s().-]{6,}$/.test(value)) {
    error = messages.invalidPhone;
  } else if (field.name === "date" && value && value < localDateString()) {
    error = messages.invalidDate;
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

function showFormStatus(message, isError = false) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.hidden = false;
  formStatus.classList.toggle("is-error", isError);
  formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function saveDemoReservation(payload) {
  const key = "jafood_v2_reservations";
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
  const valid = requiredFields.map(validateField).every(Boolean);

  if (!valid) {
    reservationForm.querySelector(".is-invalid")?.focus();
    return;
  }

  const data = Object.fromEntries(new FormData(reservationForm).entries());
  delete data.consent;
  const reference = createReference();
  const payload = {
    ...data,
    reference,
    language: state.language,
    createdAt: new Date().toISOString(),
  };

  const previousLabel = submitLabel.textContent;
  const submitButton = reservationForm.querySelector("button[type='submit']");
  submitLabel.textContent = copy[state.language].sending;
  submitButton?.classList.add("is-loading");
  formStatus.hidden = true;

  try {
    if (RESERVATION_CONFIG.endpoint) {
      const response = await fetch(RESERVATION_CONFIG.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Reservation endpoint returned ${response.status}`);
      showFormStatus(copy[state.language].success(reference));
      reservationForm.reset();
    } else if (RESERVATION_CONFIG.whatsapp) {
      const message = copy[state.language].whatsappMessage(data, reference);
      const url = `https://wa.me/${RESERVATION_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      showFormStatus(copy[state.language].whatsapp(reference));
    } else {
      saveDemoReservation(payload);
      showFormStatus(copy[state.language].demo(reference));
      reservationForm.reset();
    }
  } catch (error) {
    console.error(error);
    showFormStatus(copy[state.language].error, true);
  } finally {
    submitLabel.textContent = previousLabel;
    submitButton?.classList.remove("is-loading");
  }
});

const revealElements = document.querySelectorAll(".reveal");
revealElements.forEach((element) => {
  element.style.setProperty("--reveal-delay", `${Number(element.dataset.delay || 0)}ms`);
});

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -35px" },
  );
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 920) closeNavigation();
});

const year = document.querySelector("#current-year");
if (year) year.textContent = new Date().getFullYear();

setLanguage(state.language);
setActiveCategory("breakfast");
updateHeader();
