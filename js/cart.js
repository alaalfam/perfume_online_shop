/* ============================================================
   عطر مهراب — Mehrab Perfume
   cart.js — cart state, persisted to localStorage.
   ------------------------------------------------------------
   Cart entries are keyed "<productId>:<ml>" so the same
   fragrance in two different sizes is tracked separately, the
   way the volume selector on the product page requires.
   ============================================================ */
window.MehrabCart = (function (catalog) {
  "use strict";

  const STORAGE_KEY = "mehrab_cart_v1";
  const EVENT_NAME = "mehrab:cartchange";

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.warn("Cart could not be restored:", err);
      return {};
    }
  }

  let cart = load();

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.warn("Cart could not be saved:", err);
    }
    document.dispatchEvent(new CustomEvent(EVENT_NAME));
  }

  function key(id, ml) { return id + ":" + ml; }

  function add(id, ml, qty) {
    const k = key(id, ml);
    cart[k] = (cart[k] || 0) + (qty || 1);
    save();
  }

  function setQty(id, ml, qty) {
    const k = key(id, ml);
    if (qty <= 0) delete cart[k];
    else cart[k] = qty;
    save();
  }

  function changeQty(id, ml, delta) {
    const k = key(id, ml);
    setQty(id, ml, (cart[k] || 0) + delta);
  }

  function remove(id, ml) {
    delete cart[key(id, ml)];
    save();
  }

  /* Empties the whole cart — called once a real order is placed
     (see the checkout-confirm handler in main.js), since the items
     have now become an order rather than a pending cart. */
  function clear() {
    cart = {};
    save();
  }

  /* Resolves stored keys into full line items with product + price data,
     dropping any entries whose product no longer exists in the catalogue. */
  function lines() {
    return Object.keys(cart).map(function (k) {
      const parts = k.split(":");
      const id = parts[0];
      const ml = parseInt(parts[1], 10);
      const product = catalog.getById(id);
      if (!product) return null;
      const base = catalog.priceFor(product, ml);
      const price = catalog.discountedPrice(base, product.discount);
      return { id: id, ml: ml, qty: cart[k], product: product, unitPrice: price };
    }).filter(Boolean);
  }

  function totalCount() {
    return Object.values(cart).reduce(function (sum, qty) { return sum + qty; }, 0);
  }

  function totalPrice() {
    return lines().reduce(function (sum, line) { return sum + line.unitPrice * line.qty; }, 0);
  }

  return {
    add: add,
    setQty: setQty,
    changeQty: changeQty,
    remove: remove,
    clear: clear,
    lines: lines,
    totalCount: totalCount,
    totalPrice: totalPrice,
    EVENT_NAME: EVENT_NAME
  };
})(window.MehrabCatalog);
