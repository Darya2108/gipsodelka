const store = window.GipsodelkaCatalog;
const state = store ? store.load() : { site: {}, products: [] };

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxTitle = document.querySelector(".lightbox-title");
const closeButton = document.querySelector(".lightbox-close");
const prevButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");
const track = document.querySelector(".popular-track");
const carouselPrev = document.querySelector(".carousel-prev");
const carouselNext = document.querySelector(".carousel-next");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));

let imageButtons = [];
let currentIndex = 0;

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function phoneHref(phone) {
  return `tel:${String(phone || "").replace(/[^\d+]/g, "")}`;
}

function whatsappHref(site, productTitle = "") {
  const number = String(site.whatsapp || site.phonePrimary || "").replace(/\D/g, "");
  const text = productTitle ? `Здравствуйте! Хочу заказать: ${productTitle}` : "Здравствуйте! Хочу оформить заказ.";
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

function renderProducts(products, site) {
  const grid = document.querySelector(".product-grid");

  if (!grid || !Array.isArray(products) || products.length === 0) {
    return;
  }

  grid.innerHTML = products
    .map((product) => {
      const colors = Array.isArray(product.colors) ? product.colors : [];
      const swatches = colors
        .filter(Boolean)
        .map((color) => `<span style="--swatch:${escapeHtml(color)}"></span>`)
        .join("");

      return `
        <article class="product-card">
          <button class="product-photo-button" type="button" data-full="${escapeHtml(product.image)}" data-title="${escapeHtml(product.title)}">
            <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}">
          </button>
          <div class="product-body">
            <span class="product-type">${escapeHtml(product.type)}</span>
            <h3>${escapeHtml(product.title)}</h3>
            <dl class="product-meta">
              <div><dt>${escapeHtml(product.sizeLabel || "Размер")}</dt><dd>${escapeHtml(product.size)}</dd></div>
              <div><dt>Стоимость</dt><dd>${escapeHtml(product.price)}</dd></div>
            </dl>
            <div class="swatches" aria-label="Варианты цветов">${swatches}</div>
            <a class="order-button" href="${whatsappHref(site, product.title)}" target="_blank" rel="noreferrer">Заказать</a>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSiteInfo(site) {
  const heroTitle = document.querySelector("#hero-title");
  const heroCopy = document.querySelector(".hero-copy");
  const aboutTitle = document.querySelector("#about-title");
  const aboutParagraphs = document.querySelectorAll(".about-copy h2 ~ p");
  const contactDetails = document.querySelector(".contact-details");

  if (heroTitle) heroTitle.textContent = site.heroTitle;
  if (heroCopy) heroCopy.textContent = site.heroSubtitle;
  if (aboutTitle) aboutTitle.textContent = site.aboutTitle;
  if (aboutParagraphs[0]) aboutParagraphs[0].textContent = site.aboutText1;
  if (aboutParagraphs[1]) aboutParagraphs[1].textContent = site.aboutText2;

  document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => {
    link.href = whatsappHref(site);
  });

  if (contactDetails) {
    contactDetails.innerHTML = `
      <strong>${escapeHtml(site.contactOwner)}</strong>
      <a href="${escapeHtml(site.vk)}" target="_blank" rel="noreferrer">VK: ${escapeHtml(site.vk.replace(/^https?:\/\//, ""))}</a>
      <a href="${escapeHtml(site.telegram)}" target="_blank" rel="noreferrer">Telegram: ${escapeHtml(site.telegramLabel || site.telegram.replace(/^https?:\/\/t.me\//, "@"))}</a>
      <a href="${whatsappHref(site)}" target="_blank" rel="noreferrer">WhatsApp: ${escapeHtml(site.phonePrimary)}</a>
      <a href="${phoneHref(site.phonePrimary)}">Телефон: ${escapeHtml(site.phonePrimary)}</a>
      <a href="${phoneHref(site.phoneSecondary)}">Телефон: ${escapeHtml(site.phoneSecondary)}</a>
      <a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a>
    `;
  }
}

function collectImageButtons() {
  imageButtons = Array.from(document.querySelectorAll(".product-photo-button, .gallery-item"));
}

function openLightbox(index) {
  const item = imageButtons[index];

  if (!item || !lightbox) {
    return;
  }

  currentIndex = index;
  lightboxImage.src = item.dataset.full;
  lightboxImage.alt = item.dataset.title;
  lightboxTitle.textContent = item.dataset.title;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  closeButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

function showSibling(direction) {
  const total = imageButtons.length;
  currentIndex = (currentIndex + direction + total) % total;
  openLightbox(currentIndex);
}

function bindLightbox() {
  collectImageButtons();
  imageButtons.forEach((button, index) => {
    button.addEventListener("click", () => openLightbox(index));
  });

  closeButton?.addEventListener("click", closeLightbox);
  prevButton?.addEventListener("click", () => showSibling(-1));
  nextButton?.addEventListener("click", () => showSibling(1));

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

function scrollPopular(direction) {
  if (!track) {
    return;
  }

  const card = track.querySelector(".popular-card");
  const amount = card ? card.getBoundingClientRect().width + 18 : 320;
  track.scrollBy({ left: amount * direction, behavior: "smooth" });
}

function updateActiveNav() {
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const current = sections
    .map((section) => ({
      id: `#${section.id}`,
      top: Math.abs(section.getBoundingClientRect().top - 110),
    }))
    .sort((a, b) => a.top - b.top)[0];

  if (!current) {
    return;
  }

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === current.id);
  });
}

renderSiteInfo(state.site);
renderProducts(state.products, state.site);
bindLightbox();

carouselPrev?.addEventListener("click", () => scrollPopular(-1));
carouselNext?.addEventListener("click", () => scrollPopular(1));
window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showSibling(-1);
  if (event.key === "ArrowRight") showSibling(1);
});
updateActiveNav();
