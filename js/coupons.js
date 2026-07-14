/* ============================================================
   عطر مهراب — Mehrab Perfume
   coupons.js — discount codes, store-backed so the admin panel can
   add/edit/delete/deactivate them and the public cart drawer picks
   up the change immediately (localStorage is shared, no reload
   needed within the same tab since MehrabStore is read live).
   ============================================================ */
window.MehrabCoupons = (function (store) {
  "use strict";

  const KEY = "coupons";

  const SEED = [
    { code: "MEHRAB10", type: "percent", value: 10, label: "۱۰٪ تخفیف", active: true },
    { code: "OUD20", type: "percent", value: 20, label: "۲۰٪ تخفیف ویژه عود", active: true },
    { code: "WELCOME50", type: "flat", value: 500000, label: "۵۰۰٬۰۰۰ تومان تخفیف", active: true }
  ];
  store.seed(KEY, SEED);

  function list() { return store.get(KEY, []); }

  function find(code) {
    const key = (code || "").trim().toUpperCase();
    if (!key) return null;
    const match = list().find(function (c) { return c.code === key && c.active !== false; });
    return match ? Object.assign({}, match) : null;
  }

  /* Rounds to the nearest 1,000 toman like the product-level discount
     math in products.js, so totals never show odd trailing digits. */
  function apply(coupon, total) {
    if (!coupon || !total) return total;
    if (coupon.type === "percent") {
      return Math.max(0, Math.round((total * (100 - coupon.value)) / 100 / 1000) * 1000);
    }
    return Math.max(0, total - coupon.value);
  }

  /* ---------- Admin CRUD ---------- */
  function create(coupon) {
    const items = list();
    coupon.code = (coupon.code || "").trim().toUpperCase();
    if (coupon.active === undefined) coupon.active = true;
    items.push(coupon);
    store.set(KEY, items);
    return coupon;
  }

  function update(code, patch) {
    const items = list();
    const idx = items.findIndex(function (c) { return c.code === code; });
    if (idx === -1) return null;
    items[idx] = Object.assign({}, items[idx], patch, { code: items[idx].code });
    store.set(KEY, items);
    return items[idx];
  }

  function remove(code) {
    const items = list().filter(function (c) { return c.code !== code; });
    store.set(KEY, items);
  }

  return { list: list, find: find, apply: apply, create: create, update: update, remove: remove };
})(window.MehrabStore);
