/* ============================================================
   عطر مهراب — Mehrab Perfume
   site-settings.js — everything about the site's structure and
   storefront configuration that isn't a product/article/coupon:
   which nav items show in the tab bar and in what order, the
   homepage banner, static page content (about/contact), payment
   method (gateway vs. bank card), shipping methods, trust badges /
   licenses, and admin-added custom pages.
   ------------------------------------------------------------
   All of it lives under one store key as a single object, since
   these are all facets of "site configuration" edited from the
   same admin area (admin/pages.html, admin/settings.html) rather
   than independent collections like products or articles.
   ============================================================ */
window.MehrabSiteSettings = (function (store) {
  "use strict";

  const KEY = "site_settings";

  const SEED = {
    nav: [
      { key: "shop", label: "فروشگاه", href: "index.html#collection", type: "link", visible: true, order: 1 },
      { key: "categories", label: "دسته‌بندی‌ها", type: "dropdown", visible: true, order: 2 },
      { key: "discounts", label: "تخفیف‌های ویژه", href: "discounts.html", type: "link", visible: true, order: 3 },
      { key: "articles", label: "مقالات", href: "articles.html", type: "link", visible: true, order: 4 },
      { key: "track-order", label: "پیگیری سفارش", href: "track-order.html", type: "link", visible: true, order: 5 },
      { key: "wishlist", label: "علاقه‌مندی‌ها", href: "wishlist.html", type: "link", visible: true, order: 6 },
      { key: "about", label: "درباره ما", href: "about.html", type: "link", visible: true, order: 7 },
      { key: "contact", label: "ارتباط با ما", href: "contact.html", type: "link", visible: true, order: 8 }
    ],

    banner: {
      eyebrow: "مجموعه اختصاصی مهراب",
      title1: "رایحه‌ای که",
      title2: "در ذهن می‌ماند",
      lede: "هشت ترکیب اصیل، از عود سلطانی تا کهکشان کهربا — دست‌ساز، با اسانس اروپایی و امضایی کاملاً ایرانی.",
      ctaLabel: "مشاهده فروشگاه",
      ctaHref: "index.html#collection",
      secondaryLabel: "تخفیف‌های ویژه",
      secondaryHref: "discounts.html",
      tint: "#b8892f"
    },

    pages: {
      about: {
        heading: "از دل هنر ایرانی، برای زندگی امروز",
        paragraphs: [
          "«مهراب» نامی‌ست برگرفته از قوس محرابِ معماری ایرانی — نقطه‌ای که نور و طلاکاری در آن به هم می‌رسند؛ جایی که هندسه و معنویت در یک قاب می‌نشینند. عطر مهراب همین ایده را در بطری بازآفرینی می‌کند.",
          "ما در سال ۱۳۹۷ با یک پرسش ساده شروع کردیم: چرا عطرهای ایرانی باید یا کاملاً سنتی باشند یا کاملاً غربی؟",
          "هر فرمول پیش از عرضه، هفته‌ها در آزمایشگاه ما استراحت می‌کند تا لایه‌های رایحه به‌درستی روی هم بنشینند."
        ]
      },
      contact: {
        phone: "۰۲۱-۰۰۰۰۰۰۰۰",
        email: "info@mehrab-parfum.ir",
        address: "تهران، خیابان ولیعصر",
        hours: "شنبه تا پنج‌شنبه، ۹ تا ۱۸"
      }
    },

    payment: {
      method: "gateway",
      gatewayName: "درگاه پرداخت زرین‌پال",
      bankName: "بانک ملت",
      cardNumber: "۶۱۰۴-۰۰۰۰-۰۰۰۰-۰۰۰۰",
      cardHolder: "شرکت عطر مهراب",
      iban: "IR00 0000 0000 0000 0000 0000 00"
    },

    shippingMethods: [
      { id: "post-express", name: "پست پیشتاز", price: 0, etaDays: "۲ تا ۳ روز کاری", active: true },
      { id: "tipax", name: "تیپاکس", price: 150000, etaDays: "۱ تا ۲ روز کاری", active: true },
      { id: "in-person", name: "تحویل حضوری از فروشگاه", price: 0, etaDays: "همان روز (تهران)", active: false }
    ],

    trustBadges: [
      { id: "enamad", name: "نماد اعتماد الکترونیکی (اینماد)", active: false, note: "در انتظار دریافت مجوز" },
      { id: "samandehi", name: "نماد ساماندهی", active: false, note: "در انتظار دریافت مجوز" }
    ],

    customPages: []
  };

  store.seed(KEY, SEED);

  function get() { return store.get(KEY, SEED); }

  function save(next) {
    store.set(KEY, next);
    return next;
  }

  /* ---------- Nav ---------- */
  function getNav() {
    return get().nav.slice().sort(function (a, b) { return a.order - b.order; });
  }
  function updateNavItem(key, patch) {
    const s = get();
    s.nav = s.nav.map(function (n) { return n.key === key ? Object.assign({}, n, patch) : n; });
    return save(s);
  }
  function reorderNav(orderedKeys) {
    const s = get();
    s.nav = s.nav.map(function (n) {
      const idx = orderedKeys.indexOf(n.key);
      return idx === -1 ? n : Object.assign({}, n, { order: idx + 1 });
    });
    return save(s);
  }

  /* ---------- Banner ---------- */
  function getBanner() { return get().banner; }
  function updateBanner(patch) {
    const s = get();
    s.banner = Object.assign({}, s.banner, patch);
    return save(s);
  }

  /* ---------- Static page content ---------- */
  function getPageContent(pageKey) { return get().pages[pageKey] || null; }
  function updatePageContent(pageKey, patch) {
    const s = get();
    s.pages[pageKey] = Object.assign({}, s.pages[pageKey], patch);
    return save(s);
  }

  /* ---------- Payment ---------- */
  function getPayment() { return get().payment; }
  function updatePayment(patch) {
    const s = get();
    s.payment = Object.assign({}, s.payment, patch);
    return save(s);
  }

  /* ---------- Shipping methods ---------- */
  function getShippingMethods(onlyActive) {
    const list = get().shippingMethods;
    return onlyActive ? list.filter(function (m) { return m.active; }) : list;
  }
  function addShippingMethod(method) {
    const s = get();
    if (!method.id) method.id = store.slugify(method.name, "shipping");
    if (method.active === undefined) method.active = true;
    s.shippingMethods.push(method);
    save(s);
    return method;
  }
  function updateShippingMethod(id, patch) {
    const s = get();
    s.shippingMethods = s.shippingMethods.map(function (m) { return m.id === id ? Object.assign({}, m, patch, { id: m.id }) : m; });
    return save(s);
  }
  function removeShippingMethod(id) {
    const s = get();
    s.shippingMethods = s.shippingMethods.filter(function (m) { return m.id !== id; });
    return save(s);
  }

  /* ---------- Trust badges / licenses ---------- */
  function getTrustBadges(onlyActive) {
    const list = get().trustBadges;
    return onlyActive ? list.filter(function (b) { return b.active; }) : list;
  }
  function addTrustBadge(badge) {
    const s = get();
    if (!badge.id) badge.id = store.slugify(badge.name, "badge");
    s.trustBadges.push(badge);
    save(s);
    return badge;
  }
  function updateTrustBadge(id, patch) {
    const s = get();
    s.trustBadges = s.trustBadges.map(function (b) { return b.id === id ? Object.assign({}, b, patch, { id: b.id }) : b; });
    return save(s);
  }
  function removeTrustBadge(id) {
    const s = get();
    s.trustBadges = s.trustBadges.filter(function (b) { return b.id !== id; });
    return save(s);
  }

  /* ---------- Custom pages (admin-added) ---------- */
  function getCustomPages() { return get().customPages; }
  function getCustomPage(slug) {
    return get().customPages.find(function (p) { return p.slug === slug; }) || null;
  }
  function addCustomPage(page) {
    const s = get();
    if (!page.slug) page.slug = store.slugify(page.title, "page");
    if (page.showInNav === undefined) page.showInNav = false;
    s.customPages.push(page);
    save(s);
    if (page.showInNav) {
      s.nav.push({ key: "custom:" + page.slug, label: page.title, href: "page.html?slug=" + page.slug, type: "link", visible: true, order: s.nav.length + 1 });
      save(s);
    }
    return page;
  }
  function updateCustomPage(slug, patch) {
    const s = get();
    s.customPages = s.customPages.map(function (p) { return p.slug === slug ? Object.assign({}, p, patch, { slug: p.slug }) : p; });
    save(s);
    if (patch.title) {
      s.nav = s.nav.map(function (n) { return n.key === "custom:" + slug ? Object.assign({}, n, { label: patch.title }) : n; });
      save(s);
    }
    return getCustomPage(slug);
  }
  function removeCustomPage(slug) {
    const s = get();
    s.customPages = s.customPages.filter(function (p) { return p.slug !== slug; });
    s.nav = s.nav.filter(function (n) { return n.key !== "custom:" + slug; });
    return save(s);
  }

  return {
    get: get,
    getNav: getNav, updateNavItem: updateNavItem, reorderNav: reorderNav,
    getBanner: getBanner, updateBanner: updateBanner,
    getPageContent: getPageContent, updatePageContent: updatePageContent,
    getPayment: getPayment, updatePayment: updatePayment,
    getShippingMethods: getShippingMethods, addShippingMethod: addShippingMethod,
    updateShippingMethod: updateShippingMethod, removeShippingMethod: removeShippingMethod,
    getTrustBadges: getTrustBadges, addTrustBadge: addTrustBadge,
    updateTrustBadge: updateTrustBadge, removeTrustBadge: removeTrustBadge,
    getCustomPages: getCustomPages, getCustomPage: getCustomPage, addCustomPage: addCustomPage,
    updateCustomPage: updateCustomPage, removeCustomPage: removeCustomPage
  };
})(window.MehrabStore);
