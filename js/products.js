/* ============================================================
   عطر مهراب — Mehrab Perfume
   products.js — product catalogue (single source of truth)
   ------------------------------------------------------------
   Loaded before main.js / home.js / product-page.js on every
   page. Exposes window.MEHRAB_PRODUCTS (array) and a couple of
   small lookup helpers so pages don't repeat the same find().
   ============================================================ */
window.MEHRAB_PRODUCTS = [
  {
    id: "shab-e-mehrab",
    name: "شب مهراب",
    brandLine: "کالکشن خاص مهراب",
    family: "oud",
    familyLabel: "عودی",
    gender: "مردانه",
    genderKey: "male",
    isNew: false,
    createdAt: 1,
    rating: 4.8,
    reviewCount: 36,
    tint: "#6b3a22",
    discount: 15,
    variants: [
      { ml: 30, price: 2450000 },
      { ml: 50, price: 3450000 },
      { ml: 100, price: 4950000 }
    ],
    stock: 6,
    notes: { top: "زعفران، هل سیاه", heart: "چرم، گل محمدی", base: "عود، کهربا، مشک تیره" },
    description:
      "شب مهراب برای لحظه‌های سنگین و باشکوه ساخته شده — ترکیبی از عود تیره و کهربای گرم که با نتی از زعفران ایرانی آغاز می‌شود. رایحه‌ای که تا پاسی از شب روی پوست باقی می‌ماند و در هر حرکت، ردی از خود به‌جا می‌گذارد.",
    specs: {
      concentration: "ادو پرفیوم (EDP)",
      origin: "ساخت ایران، با اسانس اروپایی",
      gender: "مردانه",
      longevity: "۸ تا ۱۰ ساعت",
      sillage: "بالا",
      year: "۱۴۰۲"
    },
    reviews: [
      { name: "امیرحسین.ر", rating: 5, date: "۱۴۰۳/۰۲/۱۱", text: "پخش رایحه‌اش فوق‌العاده است، برای مهمانی‌های رسمی عالیه. ماندگاری روی لباس تا فردا صبح حس می‌شه." },
      { name: "سارا م.", rating: 5, date: "۱۴۰۳/۰۱/۰۴", text: "برای همسرم خریدم، رایحه سنگین و مردونه‌ای داره ولی زننده نیست. بسته‌بندی هم خیلی شیک بود." },
      { name: "محمد ک.", rating: 4, date: "۱۴۰۲/۱۱/۲۰", text: "عطر خیلی خوبیه فقط انتظار داشتم کمی گرم‌تر باز بشه. در کل راضی‌ام." }
    ]
  },
  {
    id: "zar-o-anbar",
    name: "زر و عنبر",
    brandLine: "کالکشن خاص مهراب",
    family: "amber",
    familyLabel: "کهربایی",
    gender: "یونیسکس",
    genderKey: "unisex",
    isNew: false,
    createdAt: 2,
    rating: 4.6,
    reviewCount: 21,
    tint: "#b8892f",
    discount: 0,
    variants: [
      { ml: 30, price: 2150000 },
      { ml: 50, price: 2950000 },
      { ml: 100, price: 4250000 }
    ],
    stock: 14,
    notes: { top: "دارچین، پرتقال تلخ", heart: "یاسمن، گل محمدی", base: "کهربای طلایی، وانیل" },
    description:
      "زر و عنبر گرمای طلایی کهربا را با شیرینی ملایم وانیل و دلنشینی یاسمن در هم می‌آمیزد. عطری میانه‌راه — نه خیلی سبک، نه خیلی سنگین — که هم در روز و هم در شب همراه شماست.",
    specs: {
      concentration: "ادو پرفیوم (EDP)",
      origin: "ساخت ایران، با اسانس اروپایی",
      gender: "یونیسکس",
      longevity: "۶ تا ۸ ساعت",
      sillage: "متوسط تا بالا",
      year: "۱۴۰۲"
    },
    reviews: [
      { name: "نگار ص.", rating: 5, date: "۱۴۰۳/۰۲/۲۸", text: "دقیقاً همون چیزی بود که دنبالش بودم؛ نه خیلی شیرین نه خیلی تلخ. عاشقشم." },
      { name: "رضا ن.", rating: 4, date: "۱۴۰۲/۱۲/۱۵", text: "کیفیت خوبی داره، فقط حجم ۳۰ میل به نظرم زود تموم میشه." }
    ]
  },
  {
    id: "yas-e-shabaneh",
    name: "یاس شبانه",
    brandLine: "کالکشن خاص مهراب",
    family: "floral",
    familyLabel: "گلی",
    gender: "زنانه",
    genderKey: "female",
    isNew: false,
    createdAt: 3,
    rating: 4.7,
    reviewCount: 29,
    tint: "#c084a0",
    discount: 10,
    variants: [
      { ml: 30, price: 1950000 },
      { ml: 50, price: 2650000 },
      { ml: 100, price: 3750000 }
    ],
    stock: 9,
    notes: { top: "برگاموت، لیمو عمانی", heart: "یاس، گل مریم", base: "مشک سفید، صندل" },
    description:
      "یاس شبانه رایحه‌ای زنانه و ظریف است؛ گشایشی تازه از برگاموت که به قلبی سرشار از یاس و گل مریم می‌رسد و در نهایت روی مشک سفید و صندل می‌نشیند. برای شب‌هایی که می‌خواهید به‌یاد بمانید.",
    specs: {
      concentration: "ادو پرفیوم (EDP)",
      origin: "ساخت ایران، با اسانس اروپایی",
      gender: "زنانه",
      longevity: "۶ تا ۸ ساعت",
      sillage: "متوسط",
      year: "۱۴۰۳"
    },
    reviews: [
      { name: "الهام ت.", rating: 5, date: "۱۴۰۳/۰۳/۰۲", text: "رایحه‌اش خیلی لطیف و زنونه‌ست، برای مهمونی خرید بودم واقعا همه تعریف کردن." },
      { name: "مریم ح.", rating: 4, date: "۱۴۰۳/۰۱/۱۸", text: "بوی خیلی خوبی داره ولی ماندگاریش روی پوستم متوسط بود." },
      { name: "فاطمه ز.", rating: 5, date: "۱۴۰۲/۱۲/۰۹", text: "بسته‌بندیش عالی بود و عطر هم دقیقا مثل عکس‌ها. حتما دوباره سفارش می‌دم." }
    ]
  },
  {
    id: "baran-e-bahar",
    name: "باران بهار",
    brandLine: "کالکشن خاص مهراب",
    family: "fresh",
    familyLabel: "تازه",
    gender: "یونیسکس",
    genderKey: "unisex",
    isNew: false,
    createdAt: 4,
    rating: 4.5,
    reviewCount: 17,
    tint: "#6e9e8f",
    discount: 0,
    variants: [
      { ml: 30, price: 1650000 },
      { ml: 50, price: 2250000 },
      { ml: 100, price: 3150000 }
    ],
    stock: 20,
    notes: { top: "لیمو‌ترش، نعنا", heart: "چای سبز، گل بابونه", base: "مشک ملایم، صندل روشن" },
    description:
      "باران بهار مثل اولین بارش بعد از زمستونه — تازه، سبک و پاک. مناسب استفاده روزانه و فضاهای کاری، با ماندگاری ملایم و رایحه‌ای که هیچ‌وقت خسته‌کننده نمی‌شه.",
    specs: {
      concentration: "ادو تویلت (EDT)",
      origin: "ساخت ایران، با اسانس اروپایی",
      gender: "یونیسکس",
      longevity: "۴ تا ۶ ساعت",
      sillage: "ملایم",
      year: "۱۴۰۳"
    },
    reviews: [
      { name: "پویا الف.", rating: 5, date: "۱۴۰۳/۰۲/۱۴", text: "برای هر روز استفاده می‌کنم، خیلی سبک و خنکه. قیمتشم منصفانه‌ست." },
      { name: "شیوا ب.", rating: 4, date: "۱۴۰۲/۱۱/۳۰", text: "بوی خیلی تمیزی داره، فقط کاش ماندگاریش یکم بیشتر بود." }
    ]
  },
  {
    id: "oud-e-soltani",
    name: "عود سلطانی",
    brandLine: "کالکشن خاص مهراب",
    family: "oud",
    familyLabel: "عودی",
    gender: "مردانه",
    genderKey: "male",
    isNew: false,
    createdAt: 5,
    rating: 4.9,
    reviewCount: 42,
    tint: "#4a3018",
    discount: 20,
    variants: [
      { ml: 30, price: 2850000 },
      { ml: 50, price: 3950000 },
      { ml: 100, price: 5650000 }
    ],
    stock: 5,
    notes: { top: "فلفل سیاه، دارچین", heart: "چوب عود، گل میخک", base: "چرم، پاچولی، عنبر" },
    description:
      "عود سلطانی پرمایه‌ترین ترکیب کالکشن ماست — چوب عود اصیل در کنار چرم و پاچولی، برای کسانی که حضورشان باید احساس بشه. یک عطر خاطره‌ساز، نه برای هر روز، بلکه برای روزهایی که مهم‌اند.",
    specs: {
      concentration: "پرفیوم (Extrait)",
      origin: "ساخت ایران، با اسانس اروپایی",
      gender: "مردانه",
      longevity: "۱۰+ ساعت",
      sillage: "بسیار بالا",
      year: "۱۴۰۲"
    },
    reviews: [
      { name: "بابک س.", rating: 5, date: "۱۴۰۳/۰۳/۰۹", text: "بهترین عودی که تا حالا امتحان کردم، حتی از چند برند خارجی که قبلا خریده بودم بهتره." },
      { name: "حسین د.", rating: 5, date: "۱۴۰۲/۱۲/۲۵", text: "سنگین و مردونه، دقیقا طبق توضیحات. فقط پیشنهاد می‌کنم کم بزنید چون خیلی پخش می‌شه." },
      { name: "کیانوش پ.", rating: 4, date: "۱۴۰۲/۱۰/۱۷", text: "کیفیت عالی، قیمتش یکم بالاست ولی ارزششو داره." }
    ]
  },
  {
    id: "golab-o-zafaran",
    name: "گلاب و زعفران",
    brandLine: "کالکشن خاص مهراب",
    family: "floral",
    familyLabel: "گلی",
    gender: "زنانه",
    genderKey: "female",
    isNew: false,
    createdAt: 6,
    rating: 4.7,
    reviewCount: 25,
    tint: "#a13d5c",
    discount: 0,
    variants: [
      { ml: 30, price: 2050000 },
      { ml: 50, price: 2850000 },
      { ml: 100, price: 4050000 }
    ],
    stock: 11,
    notes: { top: "زعفران، هل", heart: "گلاب، رز دمشقی", base: "عسل، صندل، مشک" },
    description:
      "گلاب و زعفران ادای احترامیست به عطرهای سنتی ایرانی، بازخوانی‌شده با زبانی امروزی. رز دمشقی و گلاب در قلب ترکیب می‌نشینند و زعفران، آن امضای اصیل ایرانی را به رایحه می‌بخشد.",
    specs: {
      concentration: "ادو پرفیوم (EDP)",
      origin: "ساخت ایران، با اسانس اروپایی",
      gender: "زنانه",
      longevity: "۷ تا ۹ ساعت",
      sillage: "بالا",
      year: "۱۴۰۳"
    },
    reviews: [
      { name: "پریسا گ.", rating: 5, date: "۱۴۰۳/۰۲/۰۵", text: "بوی گلاب و زعفرانش دقیقا یادآور خونه مادربزرگمه، فوق‌العاده اصیل و لوکسه." },
      { name: "آزاده ی.", rating: 4, date: "۱۴۰۲/۱۱/۱۱", text: "رایحه خیلی خاص و متفاوتیه، فقط یکم گرونه نسبت به حجمش." }
    ]
  },
  {
    id: "nasim-e-yasaman",
    name: "نسیم یاسمن",
    brandLine: "کالکشن خاص مهراب",
    family: "floral",
    familyLabel: "گلی",
    gender: "زنانه",
    genderKey: "female",
    isNew: true,
    createdAt: 7,
    rating: 4.6,
    reviewCount: 8,
    tint: "#d19bb0",
    discount: 0,
    variants: [
      { ml: 30, price: 2050000 },
      { ml: 50, price: 2750000 },
      { ml: 100, price: 3850000 }
    ],
    stock: 16,
    notes: { top: "لیمو، گل پرتقال", heart: "یاسمن سامباک، گل مریم", base: "مشک سفید، عنبر روشن" },
    description:
      "نسیم یاسمن تازه‌ترین عضو خانواده مهراب است — گشایشی نرم از گل پرتقال که به قلبی سرشار از یاسمن می‌رسد. رایحه‌ای سبک و امروزی برای کسانی که ظرافت را به سنگینی ترجیح می‌دهند.",
    specs: {
      concentration: "ادو پرفیوم (EDP)",
      origin: "ساخت ایران، با اسانس اروپایی",
      gender: "زنانه",
      longevity: "۵ تا ۷ ساعت",
      sillage: "متوسط",
      year: "۱۴۰۳"
    },
    reviews: [
      { name: "نیلوفر ک.", rating: 5, date: "۱۴۰۳/۰۳/۲۰", text: "تازه خریدم، خیلی سبک و بهاریه. عطر همه‌روزه خوبیه." },
      { name: "سمانه ر.", rating: 4, date: "۱۴۰۳/۰۳/۱۵", text: "بوی خیلی تمیزی داره، برای محیط کار عالیه." }
    ]
  },
  {
    id: "kahkeshan-e-kahroba",
    name: "کهکشان کهربا",
    brandLine: "کالکشن خاص مهراب",
    family: "amber",
    familyLabel: "کهربایی",
    gender: "یونیسکس",
    genderKey: "unisex",
    isNew: true,
    createdAt: 8,
    rating: 4.9,
    reviewCount: 5,
    tint: "#9c6b2e",
    discount: 0,
    variants: [
      { ml: 30, price: 2350000 },
      { ml: 50, price: 3250000 },
      { ml: 100, price: 4550000 }
    ],
    stock: 13,
    notes: { top: "انبه، هل سبز", heart: "کهربا، گل میخک", base: "چوب صندل، وانیل بوربن" },
    description:
      "کهکشان کهربا جدیدترین و پیچیده‌ترین ترکیب کالکشن ماست؛ گشایشی میوه‌ای غیرمنتظره که به قلبی کهربایی و پایه‌ای گرم از صندل و وانیل می‌رسد. رایحه‌ای که مرز بین امروزی و کلاسیک را محو می‌کند.",
    specs: {
      concentration: "ادو پرفیوم (EDP)",
      origin: "ساخت ایران، با اسانس اروپایی",
      gender: "یونیسکس",
      longevity: "۷ تا ۹ ساعت",
      sillage: "بالا",
      year: "۱۴۰۳"
    },
    reviews: [
      { name: "آرش ف.", rating: 5, date: "۱۴۰۳/۰۳/۲۵", text: "خیلی خاص و متفاوته، هیچ عطر دیگه‌ای شبیهش نداشتم." },
      { name: "لیلا س.", rating: 5, date: "۱۴۰۳/۰۳/۱۸", text: "برای هدیه گرفتم، خودمم عاشقش شدم و برای خودم هم سفارش دادم." }
    ]
  }
];

/* ---------- Store-backed catalogue ---------- */
/* window.MEHRAB_PRODUCTS above is only the seed: the very first time
   the site runs in a browser, it's copied into MehrabStore under
   "products" and every read/write from here on goes through the
   store. This is what lets the admin panel add/edit/delete products
   and have the public site actually reflect it. */
window.MehrabCatalog = (function (store, seedProducts) {
  "use strict";

  const KEY = "products";
  store.seed(KEY, seedProducts);

  function products() { return store.get(KEY, []); }

  function all() { return products(); }

  function getById(id) {
    return products().find(function (p) { return p.id === id; }) || null;
  }

  function getRelated(id, limit) {
    const list = products();
    const current = getById(id);
    if (!current) return list.slice(0, limit || 4);
    const sameFamily = list.filter(function (p) { return p.id !== id && p.family === current.family; });
    const rest = list.filter(function (p) { return p.id !== id && p.family !== current.family; });
    return sameFamily.concat(rest).slice(0, limit || 4);
  }

  function priceFor(product, ml) {
    const variant = product.variants.find(function (v) { return v.ml === ml; });
    return variant ? variant.price : product.variants[0].price;
  }

  function discountedPrice(price, discountPercent) {
    if (!discountPercent) return price;
    return Math.round((price * (100 - discountPercent)) / 100 / 1000) * 1000;
  }

  function formatToman(value) {
    return value.toLocaleString("fa-IR") + " تومان";
  }

  function getNewest(limit) {
    return products().slice().sort(function (a, b) { return b.createdAt - a.createdAt; }).slice(0, limit || 4);
  }

  function getDiscounted(limit) {
    const list = products().filter(function (p) { return p.discount > 0; })
      .sort(function (a, b) { return b.discount - a.discount; });
    return limit ? list.slice(0, limit) : list;
  }

  /* Combined search/filter used by the shop grid: matches free-text
     search against the name and notes, plus optional family/gender
     constraints. Every argument is optional so callers only pass
     what they're actually filtering on. */
  function query(opts) {
    opts = opts || {};
    const term = (opts.q || "").trim().toLowerCase();
    return products().filter(function (p) {
      if (opts.family && opts.family !== "all" && p.family !== opts.family) return false;
      if (opts.gender && opts.gender !== "all" && p.genderKey !== opts.gender) return false;
      if (opts.discountOnly && !p.discount) return false;
      if (opts.newOnly && !p.isNew) return false;
      if (!term) return true;
      const haystack = (p.name + " " + p.familyLabel + " " + p.notes.top + " " + p.notes.heart + " " + p.notes.base).toLowerCase();
      return haystack.indexOf(term) !== -1;
    });
  }

  function sortList(list, mode) {
    const sorted = list.slice();
    switch (mode) {
      case "newest":
        return sorted.sort(function (a, b) { return b.createdAt - a.createdAt; });
      case "price-asc":
        return sorted.sort(function (a, b) { return priceFor(a, a.variants[0].ml) - priceFor(b, b.variants[0].ml); });
      case "price-desc":
        return sorted.sort(function (a, b) { return priceFor(b, b.variants[0].ml) - priceFor(a, a.variants[0].ml); });
      case "discount":
        return sorted.sort(function (a, b) { return b.discount - a.discount; });
      default:
        return sorted;
    }
  }

  /* ---------- Admin CRUD ---------- */
  function create(product) {
    const list = products();
    if (!product.id) product.id = store.slugify(product.name, "product");
    if (product.createdAt === undefined) {
      product.createdAt = list.reduce(function (max, p) { return Math.max(max, p.createdAt || 0); }, 0) + 1;
    }
    list.push(product);
    store.set(KEY, list);
    return product;
  }

  function update(id, patch) {
    const list = products();
    const idx = list.findIndex(function (p) { return p.id === id; });
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], patch, { id: list[idx].id });
    store.set(KEY, list);
    return list[idx];
  }

  function remove(id) {
    const list = products().filter(function (p) { return p.id !== id; });
    store.set(KEY, list);
  }

  return {
    all: all,
    getById: getById,
    getRelated: getRelated,
    priceFor: priceFor,
    discountedPrice: discountedPrice,
    formatToman: formatToman,
    getNewest: getNewest,
    getDiscounted: getDiscounted,
    query: query,
    sortList: sortList,
    create: create,
    update: update,
    remove: remove
  };
})(window.MehrabStore, window.MEHRAB_PRODUCTS);
