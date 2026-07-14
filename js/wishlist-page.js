/* ============================================================
   عطر مهراب — Mehrab Perfume
   wishlist-page.js — renders the products the person has favorited
   (js/wishlist.js persists the id list to localStorage). Removing a
   favorite from here re-renders immediately so the grid never shows
   a stale item.
   ============================================================ */
(function () {
  "use strict";

  const catalog = window.MehrabCatalog;
  const cart = window.MehrabCart;
  const wishlist = window.MehrabWishlist;

  const grid = document.getElementById("wishlistGrid");
  if (!grid) return; /* not on this page */

  const emptyEl = document.getElementById("wishlistEmpty");

  function cardMarkup(p) {
    const base = catalog.priceFor(p, p.variants[0].ml);
    const price = catalog.discountedPrice(base, p.discount);

    return (
      '<article class="product-card reveal is-visible" data-id="' + p.id + '">' +
        (p.discount ? '<span class="badge-discount">' + p.discount.toLocaleString("fa-IR") + "٪ تخفیف</span>" : "") +
        '<button class="wishlist-btn is-active" data-wish="' + p.id + '" aria-label="حذف از علاقه‌مندی‌ها" aria-pressed="true">' +
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

  function render() {
    const products = wishlist.list().map(catalog.getById).filter(Boolean);
    grid.innerHTML = products.map(cardMarkup).join("");
    emptyEl.classList.toggle("is-visible", products.length === 0);
    if (window.MehrabReveal) window.MehrabReveal.refresh();
  }

  function initActions() {
    grid.addEventListener("click", function (event) {
      const addBtn = event.target.closest("[data-add]");
      const wishBtn = event.target.closest("[data-wish]");

      if (addBtn) {
        cart.add(addBtn.dataset.add, parseInt(addBtn.dataset.ml, 10), 1);
        const product = catalog.getById(addBtn.dataset.add);
        window.MehrabToast.show((product ? product.name : "کالا") + " به سبد خرید افزوده شد");
      }

      if (wishBtn) {
        event.preventDefault();
        wishlist.toggle(wishBtn.dataset.wish);
        render(); /* the item leaves the list entirely, unlike other pages' in-place toggle */
      }
    });
  }

  render();
  initActions();
})();
