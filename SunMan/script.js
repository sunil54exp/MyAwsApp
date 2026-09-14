(() => {
  "use strict";

  // Replace this with the couple's WhatsApp number, including country code.
  const WHATSAPP_NUMBER = "919999999999";
  const weddingDate = new Date("2026-10-12T08:30:00+05:30").getTime();

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  function updateCountdown() {
    const remaining = Math.max(0, weddingDate - Date.now());
    const values = [
      Math.floor(remaining / 86400000),
      Math.floor((remaining % 86400000) / 3600000),
      Math.floor((remaining % 3600000) / 60000),
      Math.floor((remaining % 60000) / 1000)
    ];
    ["cd-days", "cd-hours", "cd-minutes", "cd-seconds"].forEach((id, index) => {
      const element = document.getElementById(id);
      if (element) element.textContent = String(values[index]).padStart(2, "0");
    });
  }

  function setLanguage(language) {
    document.body.classList.toggle("kn", language === "kn");
    $$("[data-en][data-kn]").forEach((element) => {
      element.innerHTML = language === "kn" ? element.dataset.kn : element.dataset.en;
    });
    $("#lang-en").classList.toggle("active", language === "en");
    $("#lang-kn").classList.toggle("active", language === "kn");
    document.documentElement.lang = language === "kn" ? "kn" : "en";
  }

  function createPetals() {
    const container = $("#petals");
    if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < 22; i += 1) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDuration = `${6 + Math.random() * 8}s`;
      petal.style.animationDelay = `${-Math.random() * 12}s`;
      petal.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
      container.appendChild(petal);
    }
  }

  function setupGallery() {
    const lightbox = $("#lightbox");
    const lightboxImage = $("#lightbox-image");
    const galleryPhotos = [...$$(".gallery-photo")].map((photo) => {
      const img = photo.querySelector("img");
      const realSrc = img ? (img.currentSrc || img.src) : photo.dataset.image;
      photo.dataset.image = realSrc || photo.dataset.image || "";
      return { photo, src: realSrc || photo.dataset.image || "" };
    });
    let currentPhotoIndex = 0;

    function openLightbox(index) {
      if (!galleryPhotos.length) return;
      currentPhotoIndex = index;
      lightboxImage.src = galleryPhotos[currentPhotoIndex].src;
      lightbox.classList.add("open");
    }

    function showAdjacentImage(direction) {
      if (!galleryPhotos.length) return;
      currentPhotoIndex = (currentPhotoIndex + direction + galleryPhotos.length) % galleryPhotos.length;
      lightboxImage.src = galleryPhotos[currentPhotoIndex].src;
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      lightboxImage.src = "";
    }

    galleryPhotos.forEach(({ photo }, index) => {
      photo.addEventListener("click", () => {
        openLightbox(index);
      });
    });

    $("#lightbox-close").addEventListener("click", closeLightbox);
    $("#lightbox-prev").addEventListener("click", () => showAdjacentImage(-1));
    $("#lightbox-next").addEventListener("click", () => showAdjacentImage(1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showAdjacentImage(-1);
      if (event.key === "ArrowRight") showAdjacentImage(1);
    });
  }

  function setupRSVP() {
    $("#rsvp-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const name = $("#guest-name").value.trim();
      const guests = $("#guest-count").value;
      const attendance = $("#attendance").value;
      const message = $("#message").value.trim();
      const whatsappMessage = [
        "Wedding RSVP",
        `Name: ${name}`,
        `Guests: ${guests}`,
        `Attendance: ${attendance}`,
        `Message: ${message || "No message"}`
      ].join("\n");
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      $("#rsvp-result").textContent = "Your WhatsApp message is ready. ♥";
    });
  }

  function setupNavigation() {
    const menuButton = $("#menu-button");
    const mobileMenu = $("#mobile-menu");
    menuButton.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
    $$("#mobile-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
    $("#directions-button").addEventListener("click", () => {
      const query = encodeURIComponent("Jayanagar Bengaluru Karnataka");
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank", "noopener,noreferrer");
    });
  }

  $("#lang-en").addEventListener("click", () => setLanguage("en"));
  $("#lang-kn").addEventListener("click", () => setLanguage("kn"));

  updateCountdown();
  setInterval(updateCountdown, 1000);
  createPetals();
  setupGallery();
  setupRSVP();
  setupNavigation();
})();
