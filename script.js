const REVIEWS_INTERVAL_MS = 9000;

const REVIEWS_DATA = [
  {
    author: "Ines M.",
    rating: 5,
    text: "Service rapide, portions généreuses et super accueil. Je recommande les wraps.",
    date: "il y a 2 semaines"
  },
  {
    author: "Samir K.",
    rating: 5,
    text: "Très bon snack en centre-ville. Les formules sont claires et le rapport qualité/prix est top.",
    date: "il y a 1 mois"
  },
  {
    author: "Laura T.",
    rating: 4,
    text: "Burgers bien garnis et desserts gourmands. Pratique pour commander vite.",
    date: "il y a 3 semaines"
  },
  {
    author: "Nicolas R.",
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

(function initProductDetails() {
  const cards = Array.from(document.querySelectorAll(".product-card"));
  if (!cards.length) return;

  const menuPriceByPage = {
    "wraps.html": "Menu frites + boisson : 11,90 EUR",
    "sandwichs-chauds.html": "Menu frites + boisson : 13,90 EUR",
    "sandwichs-froids.html": "Menu : prix sur demande",
    "burgers.html": "Menu : prix sur demande",
    "salades.html": "Menu : prix sur demande",
    "americains.html": "Menu boisson : 11,00 EUR",
    "assiettes.html": "Menu : prix sur demande",
    "boissons.html": "Menu : selon formule",
    "desserts.html": "Menu : selon formule"
  };
  const pageName = window.location.pathname.split("/").pop() || "index.html";
  const menuPrice = menuPriceByPage[pageName];

  if (menuPrice) {
    cards.forEach((card) => {
      if (card.querySelector(".menu-price")) return;
      const node = document.createElement("p");
      node.className = "menu-price";
      node.textContent = menuPrice;
      card.appendChild(node);
    });
  }

  const modal = document.createElement("section");
  modal.className = "product-modal";
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "productModalTitle");
  modal.innerHTML = `
    <div class="product-modal-backdrop" data-close-product-modal></div>
    <article class="product-modal-card">
      <button class="product-modal-close" type="button" aria-label="Fermer le detail" data-close-product-modal>&times;</button>
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
    const cardPrice = card.querySelector("p");

    if (!cardTitle) return;
    title.textContent = cardTitle.textContent.trim();
    price.textContent = cardPrice ? cardPrice.textContent.trim() : "Prix sur demande";
    price.hidden = !price.textContent;
    detail.textContent = "Pain ou base préparée à la commande, garniture généreuse, sauces au choix selon disponibilité.";

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
    card.setAttribute("aria-label", `Voir le detail ${card.querySelector("h2")?.textContent.trim() || "du produit"}`);
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
