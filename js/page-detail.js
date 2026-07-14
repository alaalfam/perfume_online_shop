/* ============================================================
   عطر مهراب — Mehrab Perfume
   page-detail.js — renders one admin-added custom page (see
   admin/pages.html) on page.html, driven by ?slug=.
   ============================================================ */
(function () {
  "use strict";

  const root = document.getElementById("pageRoot");
  if (!root) return; /* not on this page */

  const settings = window.MehrabSiteSettings;
  const params = new URLSearchParams(window.location.search);
  const page = settings ? settings.getCustomPage(params.get("slug")) : null;

  const dom = {
    breadcrumbName: document.getElementById("breadcrumbName"),
    title: document.getElementById("pageTitle"),
    body: document.getElementById("pageBody"),
    notFound: document.getElementById("pageNotFound")
  };

  /* Injects admin-provided custom code. This content only ever comes
     from the authenticated admin panel (see admin/pages.html), never
     from a visitor, so executing it here is the intended feature —
     not an XSS path. innerHTML alone won't run <script> tags inside
     the HTML block, so custom JS is injected separately via a freshly
     created <script> element, which the browser does execute. */
  function injectCustomCode(container, html, css, js) {
    container.innerHTML = html || "";
    if (css && css.trim()) {
      const style = document.createElement("style");
      style.textContent = css;
      document.head.appendChild(style);
    }
    if (js && js.trim()) {
      const script = document.createElement("script");
      script.textContent = js;
      document.body.appendChild(script);
    }
  }

  function render() {
    if (!page) {
      dom.title.textContent = "صفحه یافت نشد";
      dom.body.innerHTML = "";
      dom.notFound.style.display = "block";
      return;
    }

    const seoTitle = (page.seoTitle && page.seoTitle.trim()) || page.title;
    const seoDescription = (page.seoDescription && page.seoDescription.trim())
      || (page.paragraphs && page.paragraphs[0])
      || page.title;

    document.title = page.title + " | عطر مهراب";
    dom.breadcrumbName.textContent = page.title;
    dom.title.textContent = page.title;

    if (page.customHtml && page.customHtml.trim()) {
      injectCustomCode(dom.body, page.customHtml, page.customCss, page.customJs);
    } else {
      dom.body.innerHTML = (page.paragraphs || []).map(function (p) { return "<p>" + p + "</p>"; }).join("");
    }

    if (window.MehrabSEO) {
      window.MehrabSEO.update({
        title: seoTitle + " | عطر مهراب",
        description: seoDescription.slice(0, 155),
        path: "/page.html?slug=" + page.slug,
        image: window.MehrabSEO.BASE_URL + "/assets/og-image.png"
      });
      window.MehrabSEO.updateBreadcrumbJsonLd();
    }

    if (window.MehrabReveal) window.MehrabReveal.refresh();
  }

  render();
})();
