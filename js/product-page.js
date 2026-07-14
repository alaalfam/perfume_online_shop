/* ============================================================
   عطر مهراب — Mehrab Perfume
   product-page.js — everything on product.html:
     gallery · breadcrumb · variant + price · qty stepper ·
     tabs (description / notes / specs / reviews) · review form ·
     related products · sticky mobile buy bar
   Reads the product id from ?id= in the URL.
   ============================================================ */
(function () {
  "use strict";

  const catalog = window.MehrabCatalog;
  const cart = window.MehrabCart;
  const wishlist = window.MehrabWishlist;

  const root = document.getElementById("productRoot");
  if (!root) return; /* not on this page */

  const params = new URLSearchParams(window.location.search);
  const product = catalog.getById(params.get("id")) || catalog.all()[0];

  /* mutable per-page state */
  let selectedMl = product.variants[0].ml;
  let qty = 1;
  let activeReviews = product.reviews.slice();

  const dom = {
    breadcrumbName: document.getElementById("breadcrumbName"),
    galleryMain:    document.getElementById("galleryMain"),
    galleryThumbs:  document.getElementById("galleryThumbs"),
    title:          document.getElementById("productTitle"),
    brandLine:      document.getElementById("productBrandLine"),
    ratingStars:    document.getElementById("ratingStars"),
    ratingCount:    document.getElementById("ratingCount"),
    priceNow:       document.getElementById("priceNow"),
    priceWas:       document.getElementById("priceWas"),
    discountBadge:  document.getElementById("discountBadge"),
    variantGroup:   document.getElementById("variantGroup"),
    stockBadge:     document.getElementById("stockBadge"),
    qtyValue:       document.getElementById("qtyValue"),
    qtyMinus:       document.getElementById("qtyMinus"),
    qtyPlus:        document.getElementById("qtyPlus"),
    addToCartBtn:   document.getElementById("addToCartBtn"),
    wishlistBtn:    document.getElementById("wishlistBtn"),
    tabButtons:     document.querySelectorAll(".tab-btn"),
    tabPanels:      document.querySelectorAll(".tab-panel"),
    descriptionText:document.getElementById("descriptionText"),
    notesTop:       document.getElementById("notesTop"),
    notesHeart:     document.getElementById("notesHeart"),
    notesBase:      document.getElementById("notesBase"),
    specsTable:     document.getElementById("specsTable"),
    reviewList:     document.getElementById("reviewList"),
    reviewSummaryStars: document.getElementById("reviewSummaryStars"),
    reviewSummaryText:  document.getElementById("reviewSummaryText"),
    reviewForm:     document.getElementById("reviewForm"),
    reviewNameInput:document.getElementById("reviewName"),
    reviewTextInput:document.getElementById("reviewText"),
    reviewStarsInput: document.getElementById("reviewStarsInput"),
    relatedGrid:    document.getElementById("relatedGrid"),
    stickyBar:      document.getElementById("stickyBuyBar"),
    stickyAddBtn:   document.getElementById("stickyAddBtn"),
    stickyPrice:    document.getElementById("stickyPrice"),
    buyBox:         document.getElementById("buyBox")
  };

  /* ---------- Helpers ---------- */

  function starString(rating) {
    const full = Math.round(rating);
    return "★★★★★☆☆☆☆☆".slice(5 - full, 10 - full);
  }

  function currentBasePrice() {
    return catalog.priceFor(product, selectedMl);
  }

  function currentPrice() {
    return catalog.discountedPrice(currentBasePrice(), product.discount);
  }

  /* ---------- Gallery ---------- */
  /* No real photography — the "gallery" is the same CSS bottle
     illustration rendered from three angles/backgrounds, matching
     the visual language used across the rest of the catalogue. */
  function renderGallery() {
    const views = ["front", "detail", "swatch"];
    dom.galleryMain.innerHTML =
      '<div class="gallery-frame gallery-view-front is-active" data-view="front" style="--tint:' + product.tint + '">' +
        '<div class="mini-bottle mini-bottle-lg" aria-hidden="true"></div>' +
      "</div>" +
      '<div class="gallery-frame gallery-view-detail" data-view="detail" style="--tint:' + product.tint + '">' +
        '<div class="mini-bottle mini-bottle-lg mini-bottle-zoom" aria-hidden="true"></div>' +
      "</div>" +
      '<div class="gallery-frame gallery-view-swatch" data-view="swatch" style="--tint:' + product.tint + '">' +
        '<div class="ingredient-swatch" aria-hidden="true"></div>' +
      "</div>";

    dom.galleryThumbs.innerHTML = views.map(function (v, i) {
      return (
        '<button class="thumb' + (i === 0 ? " is-active" : "") + '" data-thumb="' + v + '" style="--tint:' + product.tint + '" aria-label="نمای ' + (i + 1) + '">' +
          '<span class="thumb-swatch"></span>' +
        "</button>"
      );
    }).join("");

    dom.galleryThumbs.addEventListener("click", function (event) {
      const btn = event.target.closest("[data-thumb]");
      if (!btn) return;
      dom.galleryThumbs.querySelectorAll(".thumb").forEach(function (t) { t.classList.toggle("is-active", t === btn); });
      dom.galleryMain.querySelectorAll(".gallery-frame").forEach(function (f) {
        f.classList.toggle("is-active", f.dataset.view === btn.dataset.thumb);
      });
    });
  }

  /* ---------- Header info ---------- */
  function renderHeaderInfo() {
    dom.breadcrumbName.textContent = product.name;
    dom.title.textContent = product.name;
    dom.brandLine.textContent = product.brandLine + " · " + product.familyLabel + " · " + product.gender;
    dom.ratingStars.textContent = starString(product.rating);
    dom.ratingCount.textContent = product.rating.toLocaleString("fa-IR") + " از ۵ (" + product.reviewCount.toLocaleString("fa-IR") + " دیدگاه)";

    const liked = wishlist.has(product.id);
    dom.wishlistBtn.classList.toggle("is-active", liked);
    dom.wishlistBtn.setAttribute("aria-pressed", String(liked));
  }

  /* ---------- SEO: title/description/canonical/OG + Product JSON-LD ---------- */
  function updateSEO() {
    if (!window.MehrabSEO) return;
    const seo = window.MehrabSEO;
    const priceToman = catalog.discountedPrice(catalog.priceFor(product, product.variants[0].ml), product.discount);

    seo.update({
      title: product.name + " | " + product.familyLabel + " " + product.gender + " | عطر مهراب",
      description: product.description.length > 155 ? product.description.slice(0, 152) + "…" : product.description,
      path: "/product.html?id=" + product.id,
      image: seo.BASE_URL + "/assets/og-image.png",
      jsonLdId: "productJsonLd",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        sku: product.id,
        brand: { "@type": "Brand", name: "عطر مهراب" },
        image: seo.BASE_URL + "/assets/og-image.png",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount
        },
        offers: {
          "@type": "Offer",
          url: seo.BASE_URL + "/product.html?id=" + product.id,
          priceCurrency: "IRR",
          price: priceToman * 10, /* schema.org expects Rial, site displays Toman */
          availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        }
      }
    });

    seo.updateBreadcrumbJsonLd();
  }

  /* ---------- Variants & price ---------- */
  function renderVariants() {
    dom.variantGroup.innerHTML = product.variants.map(function (v) {
      return (
        '<button class="variant-btn' + (v.ml === selectedMl ? " is-active" : "") + '" data-ml="' + v.ml + '">' +
          v.ml.toLocaleString("fa-IR") + " میل‌لیتر" +
        "</button>"
      );
    }).join("");
  }

  function renderPrice() {
    const base = currentBasePrice();
    const now = currentPrice();

    dom.priceNow.textContent = catalog.formatToman(now);
    if (product.discount) {
      dom.priceWas.textContent = catalog.formatToman(base);
      dom.priceWas.classList.add("is-visible");
      dom.discountBadge.textContent = product.discount.toLocaleString("fa-IR") + "٪ تخفیف";
      dom.discountBadge.classList.add("is-visible");
    } else {
      dom.priceWas.classList.remove("is-visible");
      dom.discountBadge.classList.remove("is-visible");
    }
    dom.stickyPrice.textContent = catalog.formatToman(now);
  }

  function renderStock() {
    if (product.stock <= 0) {
      dom.stockBadge.textContent = "ناموجود";
      dom.stockBadge.className = "stock-badge stock-out";
      dom.addToCartBtn.disabled = true;
      dom.stickyAddBtn.disabled = true;
    } else if (product.stock <= 8) {
      dom.stockBadge.textContent = "تنها " + product.stock.toLocaleString("fa-IR") + " عدد باقی مانده";
      dom.stockBadge.className = "stock-badge stock-low";
    } else {
      dom.stockBadge.textContent = "موجود در انبار";
      dom.stockBadge.className = "stock-badge stock-in";
    }
  }

  function initVariantEvents() {
    dom.variantGroup.addEventListener("click", function (event) {
      const btn = event.target.closest("[data-ml]");
      if (!btn) return;
      selectedMl = parseInt(btn.dataset.ml, 10);
      dom.variantGroup.querySelectorAll(".variant-btn").forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      renderPrice();
    });
  }

  /* ---------- Quantity ---------- */
  function renderQty() { dom.qtyValue.textContent = qty.toLocaleString("fa-IR"); }

  function initQtyEvents() {
    dom.qtyMinus.addEventListener("click", function () {
      qty = Math.max(1, qty - 1);
      renderQty();
    });
    dom.qtyPlus.addEventListener("click", function () {
      qty = Math.min(product.stock || 99, qty + 1);
      renderQty();
    });
  }

  /* ---------- Add to cart / wishlist ---------- */
  function initBuyEvents() {
    function doAdd() {
      cart.add(product.id, selectedMl, qty);
      window.MehrabToast.show(product.name + " (" + selectedMl.toLocaleString("fa-IR") + " میل‌لیتر) به سبد خرید افزوده شد");
    }
    dom.addToCartBtn.addEventListener("click", doAdd);
    dom.stickyAddBtn.addEventListener("click", doAdd);

    dom.wishlistBtn.addEventListener("click", function () {
      const active = wishlist.toggle(product.id);
      dom.wishlistBtn.classList.toggle("is-active", active);
      dom.wishlistBtn.setAttribute("aria-pressed", String(active));
    });
  }

  /* ---------- Sticky mobile buy bar ---------- */
  function initStickyBar() {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        dom.stickyBar.classList.toggle("is-visible", !entry.isIntersecting);
      });
    }, { threshold: 0 });
    observer.observe(dom.buyBox);
  }

  /* ---------- Tabs ---------- */
  function initTabs() {
    dom.tabButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        dom.tabButtons.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
        dom.tabPanels.forEach(function (panel) {
          panel.classList.toggle("is-active", panel.id === "panel-" + btn.dataset.tab);
        });
      });
    });
  }

  /* ---------- Description / notes / specs ---------- */
  function renderContent() {
    dom.descriptionText.textContent = product.description;
    dom.notesTop.textContent = product.notes.top;
    dom.notesHeart.textContent = product.notes.heart;
    dom.notesBase.textContent = product.notes.base;

    const specLabels = {
      concentration: "غلظت عطر",
      origin: "مبدأ ساخت",
      gender: "دسته‌بندی",
      longevity: "ماندگاری",
      sillage: "پخش رایحه",
      year: "سال تولید"
    };
    dom.specsTable.innerHTML = Object.keys(specLabels).map(function (key) {
      return (
        '<div class="spec-row">' +
          '<span class="spec-label">' + specLabels[key] + "</span>" +
          '<span class="spec-value">' + product.specs[key] + "</span>" +
        "</div>"
      );
    }).join("");
  }

  /* ---------- Reviews ---------- */
  function renderReviews() {
    const avg = activeReviews.reduce(function (s, r) { return s + r.rating; }, 0) / activeReviews.length;
    dom.reviewSummaryStars.textContent = starString(avg);
    dom.reviewSummaryText.textContent = avg.toFixed(1).toLocaleString("fa-IR") + " از ۵ · بر اساس " + activeReviews.length.toLocaleString("fa-IR") + " دیدگاه";

    dom.reviewList.innerHTML = activeReviews.map(function (r) {
      return (
        '<li class="review-item">' +
          '<div class="review-head">' +
            '<span class="review-name">' + r.name + "</span>" +
            '<span class="review-date">' + r.date + "</span>" +
          "</div>" +
          '<div class="review-stars">' + starString(r.rating) + "</div>" +
          '<p class="review-text">' + r.text + "</p>" +
        "</li>"
      );
    }).join("");
  }

  function initReviewForm() {
    let draftRating = 5;

    dom.reviewStarsInput.querySelectorAll("[data-star]").forEach(function (starBtn) {
      starBtn.addEventListener("click", function () {
        draftRating = parseInt(starBtn.dataset.star, 10);
        dom.reviewStarsInput.querySelectorAll("[data-star]").forEach(function (b) {
          b.classList.toggle("is-filled", parseInt(b.dataset.star, 10) <= draftRating);
        });
      });
    });

    dom.reviewForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = dom.reviewNameInput.value.trim();
      const text = dom.reviewTextInput.value.trim();
      if (!name || !text) {
        window.MehrabToast.show("لطفاً نام و متن دیدگاه را وارد کنید.");
        return;
      }

      activeReviews = [{
        name: name,
        rating: draftRating,
        date: "همین الان",
        text: text
      }].concat(activeReviews);

      renderReviews();
      dom.reviewForm.reset();
      draftRating = 5;
      dom.reviewStarsInput.querySelectorAll("[data-star]").forEach(function (b) {
        b.classList.toggle("is-filled", parseInt(b.dataset.star, 10) <= 5);
      });
      window.MehrabToast.show("دیدگاه شما ثبت شد. سپاس از نظر شما!");
    });
  }

  /* ---------- Related products ---------- */
  function renderRelated() {
    const related = catalog.getRelated(product.id, 4);
    dom.relatedGrid.innerHTML = related.map(function (p) {
      const price = catalog.discountedPrice(catalog.priceFor(p, p.variants[0].ml), p.discount);
      return (
        '<article class="product-card reveal" data-id="' + p.id + '">' +
          (p.discount ? '<span class="badge-discount">' + p.discount.toLocaleString("fa-IR") + "٪ تخفیف</span>" : "") +
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
    }).join("");

    dom.relatedGrid.addEventListener("click", function (event) {
      const btn = event.target.closest("[data-add]");
      if (!btn) return;
      cart.add(btn.dataset.add, parseInt(btn.dataset.ml, 10), 1);
      const p = catalog.getById(btn.dataset.add);
      window.MehrabToast.show((p ? p.name : "کالا") + " به سبد خرید افزوده شد");
    });

    if (window.MehrabReveal) window.MehrabReveal.refresh();
  }

  /* ---------- Init ---------- */
  function init() {
    renderGallery();
    renderHeaderInfo();
    updateSEO();
    renderVariants();
    renderPrice();
    renderStock();
    renderQty();
    renderContent();
    renderReviews();
    renderRelated();

    initVariantEvents();
    initQtyEvents();
    initBuyEvents();
    initTabs();
    initReviewForm();
    initStickyBar();

    if (window.MehrabReveal) window.MehrabReveal.refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
