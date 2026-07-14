/* ============================================================
   عطر مهراب — Mehrab Perfume
   store.js — generic localStorage persistence layer shared by the
   public site and the admin panel (admin/).
   ------------------------------------------------------------
   Every editable collection (products, articles, coupons,
   categories, site settings...) is just a JSON value under one
   localStorage key. This module is the only thing that talks to
   localStorage directly; everything else (products.js, articles.js,
   admin/js/admin-*.js) goes through it, so there's one place that
   handles seeding, parsing, and change notification.
   ============================================================ */
window.MehrabStore = (function () {
  "use strict";

  const PREFIX = "mehrab_store_";

  function get(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch (err) {
      console.warn("Store read failed for " + key + ":", err);
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (err) {
      console.warn("Store write failed for " + key + ":", err);
    }
    document.dispatchEvent(new CustomEvent("mehrab:store:" + key, { detail: value }));
    document.dispatchEvent(new CustomEvent("mehrab:store:change", { detail: { key: key, value: value } }));
    return value;
  }

  /* Writes `seed` under `key` only if nothing is stored there yet —
     used once per collection so the site works with sensible
     defaults on a fresh browser, but never overwrites edits made
     through the admin panel on a later visit. */
  function seed(key, seedValue) {
    const existing = get(key, undefined);
    if (existing === undefined) {
      set(key, seedValue);
      return seedValue;
    }
    return existing;
  }

  /* Small helper for generating readable, collision-resistant ids
     from a name (e.g. "زر و عنبر" -> "zar-o-anbar-8x2q"). Admin forms
     use this for new products/articles/categories so slugs stay
     URL-friendly without asking the person to invent one by hand. */
  function slugify(text, fallbackPrefix) {
    const base = String(text || "")
      .trim()
      .toLowerCase()
      .replace(/[^\w\u0600-\u06FF]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const suffix = Math.random().toString(36).slice(2, 6);
    return (base || fallbackPrefix || "item") + "-" + suffix;
  }

  return { get: get, set: set, seed: seed, slugify: slugify };
})();
