/* ============================================================
   عطر مهراب — Mehrab Perfume
   products-page.js — "همه محصولات": the full searchable/filterable/
   sortable shop grid, previously embedded in index.html's #collection
   section and now its own page so the homepage can show a short
   horizontal-scroll preview instead. Depends on products.js, cart.js,
   wishlist.js, categories.js, and main.js being loaded first.
   ------------------------------------------------------------
   Deep-linking: other pages/links point here with
   products.html?family=oud, ?gender=male, ?sort=newest, or
   ?focus=search — read once on load so those links genuinely filter
   or focus the grid.
   ============================================================ */
(function () {
  "use strict";

  const catalog = window.MehrabCatalog;
  const cart = window.MehrabCart;
  const wishlist = window.MehrabWishlist;

  const dom = {
    grid: document.getElementById("productGrid"),
    chips: document.getElementById("familyChips"),
    genderChips: document.getElementById("genderChips"),
    searchInput: document.getElementById("searchInput"),
    sortSelect: document.getElementById("sortSelect"),
    noResults: document.getElementById("noResults")
  };

  if (!dom.grid) return; /* not on this page */

  /* ---------- Read initial filters from the query string ---------- */
  const params = new URLSearchParams(window.location.search);
  const state = {
    family: params.get("family") || "all",
    gender: params.get("gender") || "all",
    q: params.get("q") || "",
    sort: params.get("sort") || "default"
  };

  function cardMarkup(p) {
    const base = catalog.priceFor(p, p.variants[0].ml);
    const price = catalog.discountedPrice(base, p.discount);
    const liked = wishlist.has(p.id);

    return (
      '<article class="product-card reveal is-visible" data-family="' + p.family + '" data-gender="' + p.genderKey + '" data-id="' + p.id + '">' +
        (p.discount ? '<span class="badge-discount">' + p.discount.toLocaleString("fa-IR") + "٪ تخفیف</span>" : "") +
        (p.isNew ? '<span class="badge-new">جدید</span>' : "") +
        '<button class="wishlist-btn' + (liked ? " is-active" : "") + '" data-wish="' + p.id + '" aria-label="افزودن به علاقه‌مندی‌ها" aria-pressed="' + liked + '">' +
          '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21s-7.5-4.6-10.2-9.1C.3 9 1 5.6 4 4.2c2.3-1 4.7-.1 6 1.8 1.3-1.9 3.7-2.8 6-1.8 3 1.4 3.7 4.8 2.2 7.7C19.5 16.4 12 21 12 21z"/></svg>' +
        "</button>" +
        '<a class="product-visual" href="product.html?id=' + p.id + '">' +
          '<div class="mini-bottle" style="--tint:' + p.tint + '" aria-hidden="true"></div>' +
        "</a>" +
        '<div class="product-info">' +
          '<a class="product-name" href="product.html?id=' + p.id + '">' + p.name + "</a>" +
          '<span class="product-family">' + p.familyLabel + " · " + p.gender + "</span>" +
          '<div class="product-buy">' +
            '<span class="product-price">' + catalog.formatToman(price) + "</span>" +
            '<button class="add-to-cart" data-add="' + p.id + '" data-ml="' + p.variants[0].ml + '">افزودن</button>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  /* ---------- Shop grid: search + family + gender + sort ---------- */
  function renderGrid() {
    let list = catalog.query({ family: state.family, gender: state.gender, q: state.q });
    list = catalog.sortList(list, state.sort);

    dom.grid.innerHTML = list.map(cardMarkup).join("");
    dom.noResults.classList.toggle("is-visible", list.length === 0);
  }

  /* Every filter/sort change fades the grid out, swaps the DOM, then
     fades it back in — see .product-grid.is-resorting in style.css. */
  function renderGridWithFade() {
    dom.grid.classList.add("is-resorting");
    setTimeout(function () {
      renderGrid();
      requestAnimationFrame(function () { dom.grid.classList.remove("is-resorting"); });
    }, 220);
  }

  function renderChips() {
    if (dom.chips) {
      const familyCats = window.MehrabCategories.byType("family");
      dom.chips.innerHTML = '<button class="chip" data-family="all">همه رایحه‌ها</button>' +
        familyCats.map(function (c) {
          return '<button class="chip" data-family="' + c.key + '">' + c.chipLabel + "</button>";
        }).join("");
    }
    if (dom.genderChips) {
      const genderCats = window.MehrabCategories.byType("gender");
      dom.genderChips.innerHTML = '<button class="chip" data-gender="all">همه</button>' +
        genderCats.map(function (c) {
          return '<button class="chip" data-gender="' + c.key + '">' + c.chipLabel + "</button>";
        }).join("");
    }
  }

  function initChips() {
    renderChips();

    if (dom.chips) {
      dom.chips.querySelectorAll(".chip").forEach(function (c) {
        c.classList.toggle("is-active", c.dataset.family === state.family);
      });
      dom.chips.addEventListener("click", function (event) {
        const chip = event.target.closest(".chip");
        if (!chip) return;
        state.family = chip.dataset.family;
        dom.chips.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("is-active", c === chip); });
        renderGridWithFade();
      });
    }

    if (dom.genderChips) {
      dom.genderChips.querySelectorAll(".chip").forEach(function (c) {
        c.classList.toggle("is-active", c.dataset.gender === state.gender);
      });
      dom.genderChips.addEventListener("click", function (event) {
        const chip = event.target.closest(".chip");
        if (!chip) return;
        state.gender = chip.dataset.gender;
        dom.genderChips.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("is-active", c === chip); });
        renderGridWithFade();
      });
    }
  }

  function initSearch() {
    if (!dom.searchInput) return;
    dom.searchInput.value = state.q;
    dom.searchInput.addEventListener("input", function () {
      state.q = dom.searchInput.value;
      renderGrid(); /* instant — typing shouldn't feel debounced/laggy */
    });
  }

  function initSort() {
    if (!dom.sortSelect) return;
    dom.sortSelect.value = state.sort;
    dom.sortSelect.addEventListener("change", function () {
      state.sort = dom.sortSelect.value;
      renderGridWithFade();
    });
  }

  function initGridActions() {
    dom.grid.addEventListener("click", function (event) {
      const addBtn = event.target.closest("[data-add]");
      const wishBtn = event.target.closest("[data-wish]");

      if (addBtn) {
        cart.add(addBtn.dataset.add, parseInt(addBtn.dataset.ml, 10), 1);
        const product = catalog.getById(addBtn.dataset.add);
        window.MehrabToast.show((product ? product.name : "کالا") + " به سبد خرید افزوده شد");
      }

      if (wishBtn) {
        event.preventDefault();
        const active = wishlist.toggle(wishBtn.dataset.wish);
        wishBtn.classList.toggle("is-active", active);
        wishBtn.setAttribute("aria-pressed", String(active));
      }
    });
  }

  function init() {
    renderGrid();
    initChips();
    initSearch();
    initSort();
    initGridActions();

    if (window.MehrabReveal) window.MehrabReveal.refresh();

    /* Arrived via the header search icon (from this or another page) —
       focus the field once everything above has rendered. */
    if (dom.searchInput && params.get("focus") === "search") {
      dom.searchInput.focus();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
