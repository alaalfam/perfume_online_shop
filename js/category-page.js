/* ============================================================
   عطر مهراب — Mehrab Perfume
   category-page.js — one template, seven categories.
   Reads ?family=oud|amber|floral|fresh or ?gender=male|female|unisex
   from the URL (set by the nav dropdown / homepage category cards)
   and renders that category's own hero copy + filtered grid — the
   same "one HTML file driven by a query param" pattern product.html
   already uses for individual products.
   ============================================================ */
(function () {
  "use strict";

  const catalog = window.MehrabCatalog;
  const cart = window.MehrabCart;
  const wishlist = window.MehrabWishlist;

  const grid = document.getElementById("categoryGrid");
  if (!grid) return; /* not on this page */

  const dom = {
    eyebrow: document.getElementById("categoryEyebrow"),
    title: document.getElementById("categoryTitle"),
    desc: document.getElementById("categoryDesc"),
    breadcrumbName: document.getElementById("breadcrumbName"),
    empty: document.getElementById("categoryEmpty"),
    otherLinks: document.getElementById("otherCategoryLinks")
  };

  const categories = window.MehrabCategories;

  const params = new URLSearchParams(window.location.search);
  const familyParam = params.get("family");
  const genderParam = params.get("gender");

  function resolveMeta() {
    let cat = familyParam ? categories.find("family", familyParam) : null;
    if (!cat) cat = genderParam ? categories.find("gender", genderParam) : null;
    /* No/invalid params — fall back to the first category rather than
       showing a broken empty page. */
    if (!cat) cat = categories.all()[0];
    return { type: cat.type, key: cat.key, title: cat.pageTitle, desc: cat.pageDesc };
  }

  const meta = resolveMeta();

  function cardMarkup(p) {
    const base = catalog.priceFor(p, p.variants[0].ml);
    const price = catalog.discountedPrice(base, p.discount);
    const liked = wishlist.has(p.id);

    return (
      '<article class="product-card reveal is-visible" data-id="' + p.id + '">' +
        (p.discount ? '<span class="badge-discount">' + p.discount.toLocaleString("fa-IR") + "٪ تخفیف</span>" : "") +
        (p.isNew ? '<span class="badge-new">جدید</span>' : "") +
        '<button class="wishlist-btn' + (liked ? " is-active" : "") + '" data-wish="' + p.id + '" aria-label="افزودن به علاقه‌مندی‌ها" aria-pressed="' + liked + '">' +
          '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21s-7.5-4.6-10.2-9.1C.3 9 1 5.6 4 4.2c2.3-1 4.7-.1 6 1.8 1.3-1.9 3.7-2.8 6-1.8 3 1.4 3.7 4.8 2.2 7.7C19.5 16.4 12 21 12 21z"/></svg>' +
        "</button>" +
        '<a class="product-visual" href="product.html?id=' + p.id + '">' +
          '<div class="mini-bottle" style="--tint:' + p.tint + '" aria-hidden="true"></div>' +
        "</a>" +
        '<div class="product-info">' +
          '<a class="product-name" href="product.html?id=' + p.id + '">' + p.name + "</a>" +
          '<span class="product-family">' + p.familyLabel + " · " + p.gender + "</span>" +
          '<div class="product-buy">' +
            '<span class="product-price">' + catalog.formatToman(price) + "</span>" +
            '<button class="add-to-cart" data-add="' + p.id + '" data-ml="' + p.variants[0].ml + '">افزودن</button>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function render() {
    dom.eyebrow.textContent = meta.type === "family" ? "دسته‌بندی رایحه" : "دسته‌بندی جنسیت";
    dom.title.textContent = meta.title;
    dom.desc.textContent = meta.desc;
    dom.breadcrumbName.textContent = meta.title;

    const query = meta.type === "family" ? { family: meta.key } : { gender: meta.key };
    const list = catalog.query(query);

    grid.innerHTML = list.map(cardMarkup).join("");
    dom.empty.classList.toggle("is-visible", list.length === 0);

    dom.otherLinks.innerHTML = categories.all()
      .filter(function (c) { return !(c.type === meta.type && c.key === meta.key); })
      .map(function (c) {
        return '<a class="chip" href="category.html?' + c.type + '=' + c.key + '">' + c.chipLabel + "</a>";
      }).join("");

    if (window.MehrabSEO) {
      const seo = window.MehrabSEO;
      const paramName = meta.type === "family" ? "family" : "gender";
      seo.update({
        title: meta.title + " | فروشگاه عطر مهراب",
        description: meta.desc + " — " + list.length.toLocaleString("fa-IR") + " محصول در فروشگاه عطر مهراب.",
        path: "/category.html?" + paramName + "=" + meta.key,
        image: seo.BASE_URL + "/assets/og-image.png",
        jsonLdId: "categoryJsonLd",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: meta.title,
          description: meta.desc,
          url: seo.BASE_URL + "/category.html?" + paramName + "=" + meta.key,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: list.map(function (p, i) {
              return {
                "@type": "ListItem",
                position: i + 1,
                url: seo.BASE_URL + "/product.html?id=" + p.id,
                name: p.name
              };
            })
          }
        }
      });
      seo.updateBreadcrumbJsonLd();
    }

    if (window.MehrabReveal) window.MehrabReveal.refresh();
  }

  function initActions() {
    grid.addEventListener("click", function (event) {
      const addBtn = event.target.closest("[data-add]");
      const wishBtn = event.target.closest("[data-wish]");
      if (addBtn) {
        cart.add(addBtn.dataset.add, parseInt(addBtn.dataset.ml, 10), 1);
        const product = catalog.getById(addBtn.dataset.add);
        window.MehrabToast.show((product ? product.name : "کالا") + " به سبد خرید افزوده شد");
      }
      if (wishBtn) {
        event.preventDefault();
        const active = wishlist.toggle(wishBtn.dataset.wish);
        wishBtn.classList.toggle("is-active", active);
        wishBtn.setAttribute("aria-pressed", String(active));
      }
    });
  }

  render();
  initActions();
})();
