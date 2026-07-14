/* ============================================================
   عطر مهراب — Mehrab Perfume
   articles-page.js — renders the article grid on articles.html.
   ============================================================ */
(function () {
  "use strict";

  const articles = window.MehrabArticles;
  const grid = document.getElementById("articlesGrid");
  if (!grid) return; /* not on this page */

  function cardMarkup(a) {
    return (
      '<article class="article-card reveal is-visible">' +
        '<a class="article-card-visual" href="article.html?slug=' + a.slug + '" style="--tint:' + a.tint + '" aria-hidden="true"></a>' +
        '<div class="article-card-body">' +
          '<span class="article-card-meta">' + a.category + " · " + a.date + " · " + a.readMinutes.toLocaleString("fa-IR") + " دقیقه مطالعه</span>" +
          '<a class="article-card-title" href="article.html?slug=' + a.slug + '">' + a.title + "</a>" +
          '<p class="article-card-excerpt">' + a.excerpt + "</p>" +
          '<a class="article-card-link" href="article.html?slug=' + a.slug + '">ادامه مطلب ←</a>' +
        "</div>" +
      "</article>"
    );
  }

  grid.innerHTML = articles.all().map(cardMarkup).join("");
  if (window.MehrabReveal) window.MehrabReveal.refresh();
})();
