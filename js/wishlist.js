/* ============================================================
   عطر مهراب — Mehrab Perfume
   wishlist.js — "favorites" state, persisted to localStorage.
   Small and separate from cart.js on purpose: wishlist is a set
   of product ids (no quantity/variant), a genuinely different
   shape of data, so keeping it in its own module avoids
   overloading cart.js with an unrelated concern.
   ============================================================ */
window.MehrabWishlist = (function () {
  "use strict";

  const STORAGE_KEY = "mehrab_wishlist_v1";
  const EVENT_NAME = "mehrab:wishlistchange";

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.warn("Wishlist could not be restored:", err);
      return [];
    }
  }

  let ids = load();

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (err) {
      console.warn("Wishlist could not be saved:", err);
    }
    document.dispatchEvent(new CustomEvent(EVENT_NAME));
  }

  function has(id) { return ids.indexOf(id) !== -1; }

  function list() { return ids.slice(); }

  function toggle(id) {
    if (has(id)) ids = ids.filter(function (x) { return x !== id; });
    else ids.push(id);
    save();
    return has(id);
  }

  return { has: has, list: list, toggle: toggle, EVENT_NAME: EVENT_NAME };
})();
