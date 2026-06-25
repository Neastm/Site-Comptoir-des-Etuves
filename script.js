const REVIEWS_INTERVAL_MS = 9000;

const REVIEWS_DATA = [
  {
    author: "Clément",
    rating: 5,
    text: "Service rapide, portions généreuses et super accueil. Je recommande les wraps.",
    date: "il y a 2 semaines"
  },
  {
    author: "Julie",
    rating: 5,
    text: "Très bon snack en centre-ville. Les formules sont claires et le rapport qualité/prix est top.",
    date: "il y a 1 mois"
  },
  {
    author: "Andreas",
    rating: 4,
    text: "Burgers bien garnis et desserts gourmands. Pratique pour commander vite.",
    date: "il y a 3 semaines"
  },
  {
    author: "Xavier",
    rating: 5,
    text: "J'aime beaucoup l'ambiance et la rapidité de service. Bon plan du quartier.",
    date: "il y a 1 semaine"
  }
];

(function initMenu() {
  const menu = document.getElementById("siteMenu");
  const toggle = document.querySelector(".menu-toggle");
  const openButtons = document.querySelectorAll(".menu-open-btn");
  const close = document.querySelector(".menu-close");
  if (!menu || !toggle) return;

  const openMenu = () => {
    menu.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", openMenu);
  openButtons.forEach((button) => {
    button.addEventListener("click", openMenu);
  });
  close?.addEventListener("click", closeMenu);
  menu.addEventListener("click", (event) => {
    if (event.target === menu) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) closeMenu();
  });
})();

(function initMenuAttentionAnimation() {
  const toggle = document.querySelector(".menu-toggle");
  if (!toggle) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    return;
  }

  const label = document.createElement("div");
  label.className = "menu-falling-text";
  label.setAttribute("aria-hidden", "true");

  const fallSettings = [
    { x: "-18px", y: "86px", r: "-18deg" },
    { x: "-4px", y: "104px", r: "14deg" },
    { x: "12px", y: "92px", r: "-10deg" },
    { x: "26px", y: "110px", r: "22deg" }
  ];

  "MENU".split("").forEach((letter, index) => {
    const span = document.createElement("span");
    const settings = fallSettings[index];
    span.textContent = letter;
    span.style.setProperty("--letter-index", index);
    span.style.setProperty("--fall-x", settings.x);
    span.style.setProperty("--fall-y", settings.y);
    span.style.setProperty("--fall-rotate", settings.r);
    label.append(span);
  });

  document.body.append(label);

  let hasDropped = false;
  let dropTimer;

  const positionLabel = () => {
    const toggleBounds = toggle.getBoundingClientRect();
    const hero = document.querySelector(".home-hero, .product-hero, .page-hero");
    const heroBounds = hero?.getBoundingClientRect();
    const labelBounds = label.getBoundingClientRect();
    const safeGap = 18;
    const fallbackTop = toggleBounds.bottom + 34;
    const startTop = heroBounds
      ? heroBounds.top + Math.min(72, Math.max(34, heroBounds.height * 0.12))
      : fallbackTop;
    const startLeft = Math.min(
      window.innerWidth - labelBounds.width - safeGap,
      Math.max(safeGap, toggleBounds.right - labelBounds.width - 14)
    );

    label.style.left = `${startLeft}px`;
    label.style.top = `${Math.max(toggleBounds.bottom + 12, startTop)}px`;
  };

  const finishAnimation = () => {
    label.remove();
    window.setTimeout(() => {
      toggle.classList.remove("menu-toggle--is-absorbing");
    }, 360);
  };

  const setAbsorbTargets = () => {
    const toggleBounds = toggle.getBoundingClientRect();
    const targetX = toggleBounds.left + toggleBounds.width / 2;
    const targetY = toggleBounds.top + toggleBounds.height / 2;

    label.querySelectorAll("span").forEach((span) => {
      const letterBounds = span.getBoundingClientRect();
      span.style.setProperty("--suck-x", `${targetX - (letterBounds.left + letterBounds.width / 2)}px`);
      span.style.setProperty("--suck-y", `${targetY - (letterBounds.top + letterBounds.height / 2)}px`);
    });
  };

  const dropLetters = () => {
    if (hasDropped) return;
    hasDropped = true;
    window.clearTimeout(dropTimer);
    setAbsorbTargets();
    toggle.classList.add("menu-toggle--is-absorbing");
    label.classList.add("is-dropping");
    window.removeEventListener("resize", positionLabel);
    window.removeEventListener("scroll", positionLabel);
    window.removeEventListener("scroll", dropLetters);
    window.setTimeout(finishAnimation, 1320);
  };

  positionLabel();
  requestAnimationFrame(() => label.classList.add("is-visible"));
  window.addEventListener("resize", positionLabel);
  window.addEventListener("scroll", positionLabel, { passive: true });
  window.addEventListener("scroll", dropLetters, { once: true, passive: true });
  dropTimer = window.setTimeout(dropLetters, 3000);
})();

(function initLanguagePrompt() {
  const pageLang = document.documentElement.lang || "fr";
  if (!pageLang.toLowerCase().startsWith("fr")) return;

  const browserLang = (navigator.languages && navigator.languages[0]) || navigator.language || "";
  if (!browserLang || browserLang.toLowerCase().startsWith("fr")) return;

  try {
    if (sessionStorage.getItem("languagePromptDismissed") === "1") return;
  } catch (error) {
    // Storage can be disabled; the prompt still works without persistence.
  }

  const pageName = window.location.pathname.split("/").pop();
  const languagePath = pageName && pageName !== "index.html" ? pageName : "";
  const baseUrl = `${window.location.origin}/`;
  const englishHref = new URL(`en/${languagePath}`, baseUrl).href;
  const spanishHref = new URL(`es/${languagePath}`, baseUrl).href;
  const isSpanishPreferred = browserLang.toLowerCase().startsWith("es");
  const languageLinks = isSpanishPreferred
    ? `
        <a href="${spanishHref}" lang="es" hreflang="es"><span aria-hidden="true">🇪🇸</span> Español</a>
        <a href="${englishHref}" lang="en" hreflang="en"><span aria-hidden="true">🇬🇧</span> English</a>
      `
    : `
        <a href="${englishHref}" lang="en" hreflang="en"><span aria-hidden="true">🇬🇧</span> English</a>
        <a href="${spanishHref}" lang="es" hreflang="es"><span aria-hidden="true">🇪🇸</span> Español</a>
      `;

  const prompt = document.createElement("section");
  prompt.className = "language-prompt";
  prompt.setAttribute("role", "dialog");
  prompt.setAttribute("aria-modal", "true");
  prompt.setAttribute("aria-labelledby", "languagePromptTitle");
  prompt.innerHTML = `
    <article class="language-prompt-card">
      <h2 id="languagePromptTitle">Choose your language</h2>
      <p>This site is available in English and Spanish. Select a version to continue.</p>
      <div class="language-prompt-actions">
        ${languageLinks}
      </div>
      <button class="language-prompt-close" type="button">Continue in French</button>
    </article>
  `;

  const closePrompt = () => {
    prompt.hidden = true;
    try {
      sessionStorage.setItem("languagePromptDismissed", "1");
    } catch (error) {
      // Ignore storage errors.
    }
  };

  prompt.querySelector(".language-prompt-close").addEventListener("click", closePrompt);
  prompt.addEventListener("click", (event) => {
    if (event.target === prompt) closePrompt();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !prompt.hidden) closePrompt();
  });

  document.body.appendChild(prompt);
})();

(function initReviews() {
  const track = document.getElementById("reviewCarouselTrack");
  if (!track) return;

  document.documentElement.style.setProperty(
    "--reviews-scroll-duration",
    `${Math.max(12000, REVIEWS_INTERVAL_MS * 2) / 1000}s`
  );

  const renderCard = (item) => {
    const stars = "*".repeat(Math.max(0, Math.min(5, item.rating || 0)));
    return `
      <article class="review">
        <p>"${item.text}"</p>
        <div class="review-meta">
          <span>${item.author}</span>
          <span>${stars}</span>
        </div>
        <small>${item.date || ""}</small>
      </article>
    `;
  };

  track.innerHTML = [...REVIEWS_DATA, ...REVIEWS_DATA].map(renderCard).join("");
})();

(function initCategoryCarouselDrag() {
  const viewport = document.querySelector(".category-viewport");
  const track = viewport?.querySelector(".category-scroll");
  if (!viewport || !track) return;

  let pointerId = null;
  let startX = 0;
  let startScrollLeft = 0;
  let hasDragged = false;
  let suppressClick = false;

  const stopDrag = () => {
    pointerId = null;
    viewport.classList.remove("is-dragging");
  };

  viewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;

    pointerId = event.pointerId;
    startX = event.clientX;
    startScrollLeft = viewport.scrollLeft;
    hasDragged = false;
    viewport.classList.add("is-dragging");
    viewport.setPointerCapture(pointerId);
  });

  viewport.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;

    const distance = event.clientX - startX;
    if (Math.abs(distance) > 6) {
      hasDragged = true;
      suppressClick = true;
    }

    viewport.scrollLeft = startScrollLeft - distance;
  });

  viewport.addEventListener("pointerup", (event) => {
    if (event.pointerId !== pointerId) return;
    stopDrag();
  });

  viewport.addEventListener("pointercancel", stopDrag);
  viewport.addEventListener(
    "click",
    (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    },
    true
  );
})();

(function initProductDetails() {
  const cards = Array.from(document.querySelectorAll(".product-card"));
  if (!cards.length) return;

  const pageLang = document.documentElement.lang || "fr";
  const lang = pageLang.toLowerCase().startsWith("es")
    ? "es"
    : pageLang.toLowerCase().startsWith("en")
      ? "en"
      : "fr";
  const copyByLang = {
    fr: {
      closeLabel: "Fermer le detail",
      defaultPrice: "Prix sur demande",
      defaultDetail: "Pain ou base préparée à la commande, garniture généreuse, sauces au choix selon disponibilité.",
      extrasPrefix: "Extras",
      menuPriceByPage: {
        "tacos.html": "Menu frites + boisson : +4 EUR"
      },
      viewDetails: (title) => `Voir le detail ${title || "du produit"}`
    },
    en: {
      closeLabel: "Close details",
      defaultPrice: "Price on request",
      defaultDetail: "Prepared to order with generous filling and sauces to choose, depending on availability.",
      extrasPrefix: "Extras",
      menuPriceByPage: {
        "tacos.html": "Fries + drink menu: +4 EUR"
      },
      viewDetails: (title) => `View details for ${title || "this product"}`
    },
    es: {
      closeLabel: "Cerrar detalles",
      defaultPrice: "Precio a consultar",
      defaultDetail: "Preparado al momento con relleno generoso y salsas a elegir, segun disponibilidad.",
      extrasPrefix: "Extras",
      menuPriceByPage: {
        "tacos.html": "Menu patatas + bebida: +4 EUR"
      },
      viewDetails: (title) => `Ver detalles de ${title || "este producto"}`
    }
  };
  const copy = copyByLang[lang];
  const menuPriceByPage = {
    "tacos.html": copy.menuPriceByPage["tacos.html"]
  };
  const pageName = window.location.pathname.split("/").pop() || "index.html";
  const menuPrice = menuPriceByPage[pageName];

  cards.forEach((card) => {
    const cardMenuPrice = card.hasAttribute("data-no-menu-price") ? "" : card.dataset.menuPrice || menuPrice;
    if (cardMenuPrice) {
      if (card.querySelector(".menu-price")) return;
      const node = document.createElement("p");
      node.className = "menu-price";
      node.textContent = cardMenuPrice;
      card.appendChild(node);
    }
  });

  const modal = document.createElement("section");
  modal.className = "product-modal";
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "productModalTitle");
  modal.innerHTML = `
    <div class="product-modal-backdrop" data-close-product-modal></div>
    <article class="product-modal-card">
      <button class="product-modal-close" type="button" aria-label="${copy.closeLabel}" data-close-product-modal>&times;</button>
      <img class="product-modal-image" alt="" />
      <h2 id="productModalTitle"></h2>
      <p class="product-modal-price"></p>
      <p class="product-modal-detail"></p>
    </article>
  `;
  document.body.appendChild(modal);

  const image = modal.querySelector(".product-modal-image");
  const title = modal.querySelector("#productModalTitle");
  const price = modal.querySelector(".product-modal-price");
  const detail = modal.querySelector(".product-modal-detail");

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  };

  const openModal = (card) => {
    const cardImage = card.querySelector("img");
    const cardTitle = card.querySelector("h2");
    const cardPrice = card.hasAttribute("data-no-price") ? null : card.querySelector("p");

    if (!cardTitle) return;
    title.textContent = cardTitle.textContent.trim();
    price.textContent = cardPrice ? cardPrice.textContent.trim() : card.hasAttribute("data-no-price") ? "" : copy.defaultPrice;
    price.hidden = !price.textContent;
    const menuText = card.querySelector(".menu-price")?.textContent.trim();
    const detailText = card.dataset.detail?.trim();
    const extrasText = card.dataset.extras?.trim();
    const detailItems = [];

    if (menuText) detailItems.push(menuText);
    if (detailText) detailItems.push(detailText);
    if (extrasText) detailItems.push(`${copy.extrasPrefix} : ${extrasText}`);

    detail.textContent = detailItems.length
      ? detailItems.join("\n")
      : copy.defaultDetail;

    if (cardImage) {
      image.src = cardImage.getAttribute("src");
      image.alt = cardImage.getAttribute("alt") || cardTitle.textContent.trim();
      image.hidden = false;
    } else {
      image.hidden = true;
    }

    modal.hidden = false;
    document.body.classList.add("modal-open");
  };

  cards.forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", copy.viewDetails(card.querySelector("h2")?.textContent.trim()));
    card.addEventListener("click", () => openModal(card));
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openModal(card);
    });
  });

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-product-modal]")) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
})();
