/* ============================================================
   عطر مهراب — Mehrab Perfume
   discounts.js — "تخفیف‌های ویژه" page: countdown timer + the
   full grid of discounted products. Depends on products.js,
   cart.js, wishlist.js, main.js.
   ============================================================ */
(function () {
  "use strict";

  const catalog = window.MehrabCatalog;
  const cart = window.MehrabCart;
  const wishlist = window.MehrabWishlist;

  const grid = document.getElementById("discountsGrid");
  if (!grid) return; /* not on this page */

  const countdownEls = {
    days: document.getElementById("cdDays"),
    hours: document.getElementById("cdHours"),
    minutes: document.getElementById("cdMinutes"),
    seconds: document.getElementById("cdSeconds")
  };

  /* Demo countdown: always ~2 days out from page load, computed once
     so it counts down consistently for the rest of the session. */
  const target = Date.now() + (2 * 24 + 6) * 60 * 60 * 1000;

  function pad(n) { return n.toLocaleString("fa-IR", { minimumIntegerDigits: 2 }); }

  function tickCountdown() {
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (countdownEls.days) countdownEls.days.textContent = pad(days);
    if (countdownEls.hours) countdownEls.hours.textContent = pad(hours);
    if (countdownEls.minutes) countdownEls.minutes.textContent = pad(minutes);
    if (countdownEls.seconds) countdownEls.seconds.textContent = pad(seconds);
  }

  function cardMarkup(p) {
    const base = catalog.priceFor(p, p.variants[0].ml);
    const price = catalog.discountedPrice(base, p.discount);
    const liked = wishlist.has(p.id);

    return (
      '<article class="product-card reveal" data-id="' + p.id + '">' +
        '<span class="badge-discount">' + p.discount.toLocaleString("fa-IR") + "٪ تخفیف</span>" +
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

  function render() {
    const list = catalog.getDiscounted();
    grid.innerHTML = list.map(cardMarkup).join("");
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
        const active = wishlist.toggle(wishBtn.dataset.wish);
        wishBtn.classList.toggle("is-active", active);
        wishBtn.setAttribute("aria-pressed", String(active));
      }
    });
  }

  function init() {
    render();
    initActions();
    tickCountdown();
    setInterval(tickCountdown, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
