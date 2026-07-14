/* ============================================================
   عطر مهراب — Mehrab Perfume
   article-page.js — renders one article on article.html, driven by
   ?slug=... (same "one template, many pages" pattern as product.html
   and category.html).
   ============================================================ */
(function () {
  "use strict";

  const articles = window.MehrabArticles;
  const root = document.getElementById("articleRoot");
  if (!root) return; /* not on this page */

  const params = new URLSearchParams(window.location.search);
  const article = articles.getBySlug(params.get("slug")) || articles.all()[0];

  const dom = {
    breadcrumbTitle: document.getElementById("breadcrumbArticleTitle"),
    category: document.getElementById("articleCategory"),
    title: document.getElementById("articleTitle"),
    meta: document.getElementById("articleMeta"),
    visual: document.getElementById("articleVisual"),
    body: document.getElementById("articleBody"),
    relatedGrid: document.getElementById("relatedArticlesGrid")
  };

  /* Injects admin-provided custom code — same trusted-admin-only
     reasoning as page-detail.js: this never comes from a visitor,
     only from the authenticated admin panel, so executing it is the
     intended feature. innerHTML won't run <script> tags inside the
     HTML block, so custom JS runs via a freshly created element. */
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
    dom.breadcrumbTitle.textContent = article.title;
    dom.category.textContent = article.category;
    dom.title.textContent = article.title;
    dom.meta.textContent = article.date + " · " + article.readMinutes.toLocaleString("fa-IR") + " دقیقه مطالعه";
    dom.visual.style.setProperty("--tint", article.tint);

    if (article.customHtml && article.customHtml.trim()) {
      injectCustomCode(dom.body, article.customHtml, article.customCss, article.customJs);
    } else {
      dom.body.innerHTML = (article.body || []).map(function (p) { return "<p>" + p + "</p>"; }).join("");
    }

    const related = articles.getRelated(article.slug, 3);
    dom.relatedGrid.innerHTML = related.map(function (a) {
      return (
        '<article class="article-card reveal is-visible">' +
          '<a class="article-card-visual" href="article.html?slug=' + a.slug + '" style="--tint:' + a.tint + '" aria-hidden="true"></a>' +
          '<div class="article-card-body">' +
            '<span class="article-card-meta">' + a.category + " · " + a.date + "</span>" +
            '<a class="article-card-title" href="article.html?slug=' + a.slug + '">' + a.title + "</a>" +
            '<a class="article-card-link" href="article.html?slug=' + a.slug + '">ادامه مطلب ←</a>' +
          "</div>" +
        "</article>"
      );
    }).join("");

    if (window.MehrabSEO) {
      const seo = window.MehrabSEO;
      const seoTitle = (article.seoTitle && article.seoTitle.trim()) || article.title;
      const seoDescription = (article.seoDescription && article.seoDescription.trim()) || article.excerpt;
      seo.update({
        title: seoTitle + " | مجله عطر مهراب",
        description: seoDescription,
        path: "/article.html?slug=" + article.slug,
        image: seo.BASE_URL + "/assets/og-image.png",
        jsonLdId: "articleJsonLd",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: seoTitle,
          description: seoDescription,
          image: seo.BASE_URL + "/assets/og-image.png",
          datePublished: article.isoDate,
          dateModified: article.isoDate,
          articleSection: article.category,
          author: { "@type": "Organization", name: "عطر مهراب" },
          publisher: {
            "@type": "Organization",
            name: "عطر مهراب",
            logo: { "@type": "ImageObject", url: seo.BASE_URL + "/assets/og-image.png" }
          },
          mainEntityOfPage: seo.BASE_URL + "/article.html?slug=" + article.slug
        }
      });
      seo.updateBreadcrumbJsonLd();
    }

    if (window.MehrabReveal) window.MehrabReveal.refresh();
  }

  render();
})();
