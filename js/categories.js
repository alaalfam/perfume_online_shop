/* ============================================================
   عطر مهراب — Mehrab Perfume
   categories.js — the 7 family/gender categories, store-backed.
   ------------------------------------------------------------
   Single source of truth for what home.js's category cards render
   AND what category.html looks up by ?family=/?gender=. Previously
   these were two separate hardcoded objects that could drift out of
   sync; now both read from here, and the admin panel writes here.
   ============================================================ */
window.MehrabCategories = (function (store) {
  "use strict";

  const KEY = "categories";

  const SEED = [
    { type: "family", key: "oud", icon: "◆", chipLabel: "عودی", pageTitle: "رایحه‌های عودی", pageDesc: "اقتدار خاموش عود، چرم و کهربای تیره — برای کسانی که حضورشان باید احساس شود." },
    { type: "family", key: "amber", icon: "✦", chipLabel: "کهربایی", pageTitle: "رایحه‌های کهربایی", pageDesc: "گرمای طلایی رزین، وانیل و بالزام؛ میانه‌ای دلنشین میان سبکی و سنگینی." },
    { type: "family", key: "floral", icon: "❀", chipLabel: "گلی", pageTitle: "رایحه‌های گلی", pageDesc: "باغ‌هایی در اوج شکوفایی — یاسمن، رز و گل مریم با پرداختی امروزی." },
    { type: "family", key: "fresh", icon: "❉", chipLabel: "تازه", pageTitle: "رایحه‌های تازه", pageDesc: "آب سرد و برگ سبز؛ مرکبات و چای سبز با ماندگاری ملایم و روزمره." },
    { type: "gender", key: "male", icon: "♂", chipLabel: "مردانه", pageTitle: "عطرهای مردانه", pageDesc: "ترکیب‌هایی با شخصیت و اقتدار، برای حضوری که فراموش نمی‌شود." },
    { type: "gender", key: "female", icon: "♀", chipLabel: "زنانه", pageTitle: "عطرهای زنانه", pageDesc: "ظرافت و عمق در کنار هم؛ رایحه‌هایی که داستان می‌گویند." },
    { type: "gender", key: "unisex", icon: "⚥", chipLabel: "یونیسکس", pageTitle: "عطرهای یونیسکس", pageDesc: "فراتر از مرزهای جنسیتی، رایحه‌هایی برای هر روح آزاده." }
  ];
  store.seed(KEY, SEED);

  function all() { return store.get(KEY, []); }

  function byType(type) { return all().filter(function (c) { return c.type === type; }); }

  function find(type, key) {
    return all().find(function (c) { return c.type === type && c.key === key; }) || null;
  }

  /* ---------- Admin CRUD ---------- */
  function create(category) {
    const items = all();
    if (!category.key) category.key = store.slugify(category.chipLabel, "cat");
    items.push(category);
    store.set(KEY, items);
    return category;
  }

  function update(type, key, patch) {
    const items = all();
    const idx = items.findIndex(function (c) { return c.type === type && c.key === key; });
    if (idx === -1) return null;
    items[idx] = Object.assign({}, items[idx], patch, { type: items[idx].type, key: items[idx].key });
    store.set(KEY, items);
    return items[idx];
  }

  function remove(type, key) {
    const items = all().filter(function (c) { return !(c.type === type && c.key === key); });
    store.set(KEY, items);
  }

  return { all: all, byType: byType, find: find, create: create, update: update, remove: remove };
})(window.MehrabStore);
