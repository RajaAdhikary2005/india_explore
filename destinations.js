// ==============================
// Destinations page logic
// - Category filters (Spiritual / Hill / Beach / City / Heritage)
// - Search
// - "Load more" button
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".destination-card"));
  const filterButtons = document.querySelectorAll(".filter-pill");
  const searchInput = document.querySelector(".filter-search");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  if (!cards.length || !loadMoreBtn) return;

  // ---- STATE ----
  let activeCategory = "all";
  let searchTerm = "";
  const initialVisible = 6;   // show first N cards
  const batchSize = 6;        // load N more when button clicked
  let visibleCount = 0;
  let filteredCards = cards.slice();

  // ---- HELPERS ----
  function hideCard(card) {
    card.style.display = "none";
    card.style.opacity = "0";
    card.style.transform = "translateY(10px)";
  }

  function showCard(card) {
    card.style.display = "block";
    requestAnimationFrame(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    });
  }

  function hideAllCards() {
    cards.forEach(hideCard);
  }

  function updateButtonVisibility() {
    if (visibleCount >= filteredCards.length || filteredCards.length === 0) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "inline-flex";
    }
  }

  function applyFilterAndSearch() {
    filteredCards = cards.filter((card) => {
      const cat = (
        card.getAttribute("data-category") ||
        card.getAttribute("data-region") ||
        ""
      ).trim().toLowerCase();

      const title = (card.querySelector("h3")?.innerText || "").toLowerCase();

      const categoryOk = activeCategory === "all" || activeCategory === cat;
      const searchOk = !searchTerm || title.includes(searchTerm);

      return categoryOk && searchOk;
    });

    renderVisible(true);
  }

  function renderVisible(reset) {
    hideAllCards();

    if (reset) {
      visibleCount = 0;
    }

    const limit =
      visibleCount === 0
        ? Math.min(initialVisible, filteredCards.length)
        : Math.min(visibleCount, filteredCards.length);

    for (let i = 0; i < limit; i++) {
      showCard(filteredCards[i]);
    }

    visibleCount = limit;
    updateButtonVisibility();
  }

  function loadMore() {
    const remaining = filteredCards.length - visibleCount;
    if (remaining <= 0) {
      updateButtonVisibility();
      return;
    }

    const toShow = Math.min(batchSize, remaining);
    const start = visibleCount;
    const end = visibleCount + toShow;

    for (let i = start; i < end; i++) {
      showCard(filteredCards[i]);
    }

    visibleCount = end;
    updateButtonVisibility();
  }

  // ---- FILTER BUTTONS (header pills and region cards) ----
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = (btn.getAttribute("data-filter") || "all").toLowerCase();
      activeCategory = cat;
      searchTerm = "";
      if (searchInput) searchInput.value = "";

      filterButtons.forEach((b) => b.classList.remove("active-filter"));
      btn.classList.add("active-filter");

      applyFilterAndSearch();

      const listSection = document.querySelector(".destinations-list");
      if (listSection) {
        listSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ---- SEARCH ----
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchTerm = searchInput.value.toLowerCase().trim();
      activeCategory = "all";

      filterButtons.forEach((b) => b.classList.remove("active-filter"));

      applyFilterAndSearch();
    });
  }

  // ---- LOAD MORE BUTTON ----
  loadMoreBtn.addEventListener("click", () => {
    loadMore();
  });

  // ---- INITIAL RENDER ----
  applyFilterAndSearch();
});
