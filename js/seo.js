/* ============================================================
   عطر مهراب — Mehrab Perfume
   seo.js — shared SEO helpers, loaded on every page.
   ------------------------------------------------------------
   Two jobs:

   1. Dynamic pages (product.html, category.html, article.html)
      render their real content via JS from a ?id=/?slug=/?family=
      query param, so the <title>/<meta description>/canonical/OG
      tags written into the static HTML are only placeholders.
      MehrabSEO.update({...}) lets each page's render() function
      overwrite them with the specific product/category/article's
      real info — this is what makes each one legitimately
      indexable and shareable as its own page rather than all
      collapsing to one generic preview.

   2. Every page with a visible breadcrumb gets a matching
      BreadcrumbList JSON-LD block generated automatically from
      that same breadcrumb nav, so there's exactly one source of
      truth (the visible text) instead of hand-maintaining two
      copies that can drift out of sync.
   ============================================================ */
window.MehrabSEO = (function () {
  "use strict";

  const BASE_URL = "https://www.mehrab-parfum.ir";

  function setMetaByName(name, content) {
    if (content === undefined || content === null) return;
    let el = document.querySelector('meta[name="' + name + '"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function setMetaByProperty(prop, content) {
    if (content === undefined || content === null) return;
    let el = document.querySelector('meta[property="' + prop + '"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("property", prop);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function setCanonical(path) {
    const href = BASE_URL + path;
    let el = document.querySelector('link[rel="canonical"]');
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", "canonical");
      document.head.appendChild(el);
    }
    el.setAttribute("href", href);
    return href;
  }

  function setJsonLd(id, data) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  }

  /* opts: { title, description, path, image, jsonLd, jsonLdId } */
  function update(opts) {
    opts = opts || {};

    if (opts.title) {
      document.title = opts.title;
      setMetaByProperty("og:title", opts.title);
      setMetaByName("twitter:title", opts.title);
    }
    if (opts.description) {
      setMetaByName("description", opts.description);
      setMetaByProperty("og:description", opts.description);
      setMetaByName("twitter:description", opts.description);
    }
    if (opts.path) {
      const canonicalUrl = setCanonical(opts.path);
      setMetaByProperty("og:url", canonicalUrl);
    }
    if (opts.image) {
      setMetaByProperty("og:image", opts.image);
      setMetaByName("twitter:image", opts.image);
    }
    if (opts.jsonLd) {
      setJsonLd(opts.jsonLdId || "pageJsonLd", opts.jsonLd);
    }
  }

  /* ---------- Auto breadcrumb structured data ---------- */
  /* Reads whatever is currently in the page's .breadcrumb nav, so
     callers on dynamic pages should invoke this AFTER they've
     filled in the real product/category/article name — calling it
     again later simply overwrites the JSON-LD with the current
     (correct) state. */
  function updateBreadcrumbJsonLd() {
    const nav = document.querySelector(".breadcrumb");
    if (!nav) return;

    const nodes = nav.querySelectorAll("a, span[aria-current]");
    const items = [];
    nodes.forEach(function (el, i) {
      const name = el.textContent.trim();
      if (!name) return;
      const entry = { "@type": "ListItem", position: i + 1, name: name };
      if (el.tagName === "A") {
        const href = el.getAttribute("href") || "";
        entry.item = href.indexOf("http") === 0 ? href : BASE_URL + "/" + href;
      }
      items.push(entry);
    });
    if (!items.length) return;

    setJsonLd("breadcrumbJsonLd", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items
    });
  }

  return {
    BASE_URL: BASE_URL,
    update: update,
    updateBreadcrumbJsonLd: updateBreadcrumbJsonLd
  };
})();
