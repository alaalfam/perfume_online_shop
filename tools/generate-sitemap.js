/* ============================================================
   عطر مهراب — Mehrab Perfume
   tools/generate-sitemap.js — regenerates sitemap.xml from the
   actual product/category/article data, so it never drifts out of
   sync with the catalogue the way a hand-maintained list would.

   Usage:
     node tools/generate-sitemap.js > sitemap.xml

   Re-run this any time products.js or articles.js gains/loses an
   entry. Static pages and their priorities are listed below in
   STATIC_PAGES; add new ones there when a new top-level page is
   added to the site.
   ============================================================ */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const BASE_URL = "https://www.mehrab-parfum.ir";
const TODAY = new Date().toISOString().slice(0, 10);

function loadBrowserGlobal(file, globalName, sandboxWindow) {
  const code = fs.readFileSync(path.join(ROOT, file), "utf8");
  // eslint-disable-next-line no-new-func
  new Function("window", "localStorage", "document", "CustomEvent", code)(
    sandboxWindow, sandboxWindow.localStorage, sandboxWindow.document, sandboxWindow.CustomEvent
  );
  return sandboxWindow[globalName];
}

/* Minimal in-memory stand-ins so store.js (localStorage-backed) and
   the modules built on it can run outside a browser. Node has none
   of these globals, and this script only ever reads seed data — it
   never needs a real localStorage or DOM. */
const memoryStorage = {};
const fakeWindow = {
  localStorage: {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(memoryStorage, k) ? memoryStorage[k] : null; },
    setItem: function (k, v) { memoryStorage[k] = String(v); }
  },
  document: { dispatchEvent: function () {} },
  CustomEvent: function CustomEvent() {}
};

loadBrowserGlobal("js/store.js", "MehrabStore", fakeWindow);
const catalog = loadBrowserGlobal("js/products.js", "MehrabCatalog", fakeWindow);
const articles = loadBrowserGlobal("js/articles.js", "MehrabArticles", fakeWindow);

const FAMILIES = ["oud", "amber", "floral", "fresh"];
const GENDERS = ["male", "female", "unisex"];

const STATIC_PAGES = [
  { loc: "/index.html", priority: "1.0", changefreq: "daily" },
  { loc: "/discounts.html", priority: "0.7", changefreq: "daily" },
  { loc: "/articles.html", priority: "0.6", changefreq: "weekly" },
  { loc: "/about.html", priority: "0.5", changefreq: "monthly" },
  { loc: "/contact.html", priority: "0.5", changefreq: "monthly" }
];

const urls = [];

STATIC_PAGES.forEach(function (p) {
  urls.push({ loc: p.loc, priority: p.priority, changefreq: p.changefreq });
});

catalog.all().forEach(function (product) {
  urls.push({
    loc: "/product.html?id=" + product.id,
    priority: "0.8",
    changefreq: "weekly"
  });
});

FAMILIES.forEach(function (f) {
  urls.push({ loc: "/category.html?family=" + f, priority: "0.7", changefreq: "weekly" });
});
GENDERS.forEach(function (g) {
  urls.push({ loc: "/category.html?gender=" + g, priority: "0.7", changefreq: "weekly" });
});

articles.all().forEach(function (article) {
  urls.push({
    loc: "/article.html?slug=" + article.slug,
    priority: "0.6",
    changefreq: "monthly",
    lastmod: article.isoDate
  });
});

function escapeXml(s) {
  return s.replace(/&/g, "&amp;");
}

const body = urls.map(function (u) {
  return (
    "  <url>\n" +
    "    <loc>" + escapeXml(BASE_URL + u.loc) + "</loc>\n" +
    "    <lastmod>" + (u.lastmod || TODAY) + "</lastmod>\n" +
    "    <changefreq>" + u.changefreq + "</changefreq>\n" +
    "    <priority>" + u.priority + "</priority>\n" +
    "  </url>"
  );
}).join("\n");

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  body + "\n" +
  "</urlset>\n";

process.stdout.write(xml);
