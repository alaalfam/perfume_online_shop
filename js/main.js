/* ============================================================
   عطر مهراب — Mehrab Perfume
   main.js — shared site chrome (loaded on every page):
     mobile nav · cart drawer · header scroll shadow · toast ·
     page fade-in/out transitions · scroll-to-top button
   Page-specific rendering lives in home.js / product-page.js.
   Visibility is toggled with classes (.is-open / .is-visible),
   never the `hidden` attribute — see note in style.css.
   ============================================================ */
(function () {
  "use strict";

  const catalog = window.MehrabCatalog;
  const cart = window.MehrabCart;
  const session = window.MehrabSession;
  const coupons = window.MehrabCoupons;

  const REDIRECT_KEY = "mehrab_redirect_after_login";
  let appliedCoupon = null;
  const couponDom = {};

  const dom = {
    header:      document.getElementById("siteHeader"),
    navToggle:   document.getElementById("navToggle"),
    primaryNav:  document.getElementById("primaryNav"),
    navOverlay:  document.getElementById("navOverlay"),
    navClose:    document.getElementById("navClose"),
    cartButton:  document.getElementById("cartButton"),
    cartCount:   document.getElementById("cartCount"),
    cartDrawer:  document.getElementById("cartDrawer"),
    cartOverlay: document.getElementById("cartOverlay"),
    cartClose:   document.getElementById("cartClose"),
    cartItems:   document.getElementById("cartItems"),
    cartEmpty:   document.getElementById("cartEmpty"),
    cartFoot:    document.getElementById("cartFoot"),
    cartTotal:   document.getElementById("cartTotal"),
    checkoutBtn: document.getElementById("checkoutBtn"),
    toast:       document.getElementById("toast")
  };

  /* Cart drawer and mobile nav are both modal side-drawers with a
     click-outside-to-close overlay; while either is open, body scroll
     is locked — but only cleared once *neither* is open, in case both
     somehow got triggered at once. */
  function syncBodyScrollLock() {
    const navOpen = dom.primaryNav && dom.primaryNav.classList.contains("is-open");
    const cartOpen = dom.cartDrawer.classList.contains("is-open");
    document.body.style.overflow = (navOpen || cartOpen) ? "hidden" : "";
  }

  /* ---------- Mobile nav ---------- */
  function openNav() {
    dom.primaryNav.classList.add("is-open");
    if (dom.navOverlay) dom.navOverlay.classList.add("is-open");
    dom.navToggle.classList.add("is-open");
    dom.navToggle.setAttribute("aria-expanded", "true");
    syncBodyScrollLock();
  }

  function closeNav() {
    dom.primaryNav.classList.remove("is-open");
    if (dom.navOverlay) dom.navOverlay.classList.remove("is-open");
    dom.navToggle.classList.remove("is-open");
    dom.navToggle.setAttribute("aria-expanded", "false");
    syncBodyScrollLock();
  }

  function initNav() {
    if (!dom.navToggle) return;
    dom.navToggle.addEventListener("click", function () {
      if (dom.primaryNav.classList.contains("is-open")) closeNav(); else openNav();
    });
    if (dom.navOverlay) dom.navOverlay.addEventListener("click", closeNav);
    if (dom.navClose) dom.navClose.addEventListener("click", closeNav);
    dom.primaryNav.addEventListener("click", function (event) {
      if (event.target.tagName === "A" && dom.primaryNav.classList.contains("is-open")) closeNav();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && dom.primaryNav.classList.contains("is-open")) closeNav();
    });
  }

  /* ---------- Cart drawer ---------- */
  function openCart() {
    dom.cartDrawer.classList.add("is-open");
    dom.cartOverlay.classList.add("is-open");
    dom.cartDrawer.setAttribute("aria-hidden", "false");
    syncBodyScrollLock();
  }

  function closeCart() {
    dom.cartDrawer.classList.remove("is-open");
    dom.cartOverlay.classList.remove("is-open");
    dom.cartDrawer.setAttribute("aria-hidden", "true");
    syncBodyScrollLock();
  }

  function renderCart() {
    const lines = cart.lines();
    const count = cart.totalCount();

    dom.cartCount.textContent = String(count);
    dom.cartCount.classList.toggle("is-visible", count > 0);

    dom.cartItems.innerHTML = lines.map(function (line) {
      return (
        '<li class="cart-item">' +
          '<div class="cart-item-swatch" style="--tint:' + line.product.tint + '" aria-hidden="true"></div>' +
          "<div class=\"cart-item-body\">" +
            '<p class="cart-item-name">' + line.product.name + "</p>" +
            '<p class="cart-item-meta">' + line.ml + " میل‌لیتر · " + catalog.formatToman(line.unitPrice) + "</p>" +
            '<div class="cart-item-qty">' +
              '<button class="qty-btn" data-dec="' + line.id + '" data-ml="' + line.ml + '" aria-label="کاهش تعداد">−</button>' +
              "<span>" + line.qty.toLocaleString("fa-IR") + "</span>" +
              '<button class="qty-btn" data-inc="' + line.id + '" data-ml="' + line.ml + '" aria-label="افزایش تعداد">+</button>' +
            "</div>" +
          "</div>" +
          '<button class="cart-item-remove" data-remove="' + line.id + '" data-ml="' + line.ml + '" aria-label="حذف از سبد">×</button>' +
        "</li>"
      );
    }).join("");

    dom.cartTotal.textContent = catalog.formatToman(cart.totalPrice());
    dom.cartEmpty.classList.toggle("is-visible", lines.length === 0);
    dom.cartFoot.classList.toggle("is-visible", lines.length > 0);

    /* Cart went empty (or a coupon was never applied) — nothing to
       discount, so hide the payable row rather than showing a
       misleading total. */
    if (!lines.length) appliedCoupon = null;
    if (couponDom.payableRow) {
      const raw = cart.totalPrice();
      const showPayable = !!appliedCoupon && lines.length > 0;
      couponDom.payableRow.classList.toggle("is-visible", showPayable);
      if (showPayable) {
        couponDom.payable.textContent = catalog.formatToman(coupons.apply(appliedCoupon, raw));
      }
    }
  }

  /* ---------- Discount code ---------- */
  /* Injected into #cartFoot rather than repeated as static markup on
     all six pages — same reasoning as the scroll-to-top button. */
  function initCoupon() {
    const wrap = document.createElement("div");
    wrap.className = "cart-coupon";
    wrap.innerHTML =
      '<div class="cart-coupon-row">' +
        '<label class="sr-only" for="couponInput">کد تخفیف</label>' +
        '<input type="text" id="couponInput" placeholder="کد تخفیف را وارد کنید" />' +
        '<button type="button" class="btn-coupon" id="couponApplyBtn">اعمال</button>' +
      "</div>" +
      '<p class="coupon-feedback" id="couponFeedback"></p>' +
      '<div class="cart-payable-row" id="cartPayableRow">' +
        "<span>مبلغ قابل پرداخت</span>" +
        '<strong id="cartPayable">۰ تومان</strong>' +
      "</div>";

    dom.cartFoot.insertBefore(wrap, dom.checkoutBtn);

    couponDom.input = wrap.querySelector("#couponInput");
    couponDom.applyBtn = wrap.querySelector("#couponApplyBtn");
    couponDom.feedback = wrap.querySelector("#couponFeedback");
    couponDom.payableRow = wrap.querySelector("#cartPayableRow");
    couponDom.payable = wrap.querySelector("#cartPayable");

    couponDom.applyBtn.addEventListener("click", function () {
      const found = coupons.find(couponDom.input.value);
      if (!found) {
        appliedCoupon = null;
        couponDom.feedback.textContent = "کد تخفیف نامعتبر است.";
        couponDom.feedback.classList.add("is-error");
        renderCart();
        return;
      }
      appliedCoupon = found;
      couponDom.feedback.classList.remove("is-error");
      couponDom.feedback.textContent = "کد «" + found.code + "» اعمال شد — " + found.label + ".";
      renderCart();
    });
  }

  function bumpCartCount() {
    dom.cartCount.classList.remove("bump");
    void dom.cartCount.offsetWidth;
    dom.cartCount.classList.add("bump");
    setTimeout(function () { dom.cartCount.classList.remove("bump"); }, 300);
  }

  /* ---------- Checkout panel: shipping method + payment method ---------- */
  /* Injected into #cartFoot like the coupon block. Shows the admin's
     configured shipping methods and payment method (gateway button,
     or bank card details if the admin switched to "card" mode) once
     the person clicks checkout while logged in. */
  const checkoutDom = {};
  let selectedShippingId = null;
  let customerName = "";
  let customerPhone = "";
  let customerAddress = "";

  function initCheckoutPanel() {
    const wrap = document.createElement("div");
    wrap.className = "checkout-panel";
    wrap.id = "checkoutPanel";
    dom.cartFoot.insertBefore(wrap, dom.checkoutBtn);
    checkoutDom.panel = wrap;

    const user = session.get();
    if (user && user.phone) customerPhone = user.phone;
  }

  function renderCheckoutPanel() {
    const settings = window.MehrabSiteSettings;
    if (!settings) return;

    const shippingMethods = settings.getShippingMethods(true);
    const payment = settings.getPayment();

    if (!selectedShippingId && shippingMethods.length) selectedShippingId = shippingMethods[0].id;

    const shippingHtml = shippingMethods.map(function (m) {
      return (
        '<label class="shipping-option">' +
          '<input type="radio" name="shippingMethod" value="' + m.id + '"' + (m.id === selectedShippingId ? " checked" : "") + " />" +
          '<span class="shipping-option-name">' + m.name + "</span>" +
          '<span class="shipping-option-meta">' + m.etaDays + "</span>" +
          '<span class="shipping-option-price">' + (m.price > 0 ? catalog.formatToman(m.price) : "رایگان") + "</span>" +
        "</label>"
      );
    }).join("");

    const paymentHtml = payment.method === "card"
      ? (
        '<div class="payment-card-info">' +
          '<p class="payment-card-label">پرداخت کارت‌به‌کارت</p>' +
          '<p class="payment-card-number">' + payment.cardNumber + "</p>" +
          '<p class="payment-card-meta">به نام ' + payment.cardHolder + " · " + payment.bankName + "</p>" +
        "</div>"
      )
      : '<p class="payment-gateway-info">پرداخت از طریق ' + payment.gatewayName + "</p>";

    checkoutDom.panel.innerHTML =
      '<div class="checkout-section">' +
        '<p class="field-label">اطلاعات گیرنده (الزامی)</p>' +
        '<div class="checkout-customer-fields">' +
          '<input type="text" id="checkoutName" placeholder="نام و نام خانوادگی" value="' + customerName.replace(/"/g, "&quot;") + '" required />' +
          '<input type="tel" id="checkoutPhone" placeholder="شماره تماس" value="' + customerPhone.replace(/"/g, "&quot;") + '" inputmode="numeric" required />' +
          '<textarea id="checkoutAddress" placeholder="آدرس کامل پستی" rows="2" required>' + customerAddress + "</textarea>" +
        "</div>" +
      "</div>" +
      '<div class="checkout-section">' +
        '<p class="field-label">شیوه ارسال</p>' +
        '<div class="shipping-options">' + (shippingHtml || "<p>روش ارسالی فعال نیست.</p>") + "</div>" +
      "</div>" +
      '<div class="checkout-section">' +
        '<p class="field-label">شیوه پرداخت</p>' +
        paymentHtml +
      "</div>" +
      '<button type="button" class="btn btn-solid btn-block" id="confirmCheckoutBtn">تأیید نهایی و ثبت سفارش</button>';

    /* re-renders happen when a shipping option changes; keep typed
       customer info instead of losing it to the innerHTML rebuild */
    document.getElementById("checkoutName").addEventListener("input", function (e) { customerName = e.target.value; });
    document.getElementById("checkoutPhone").addEventListener("input", function (e) { customerPhone = e.target.value; });
    document.getElementById("checkoutAddress").addEventListener("input", function (e) { customerAddress = e.target.value; });

    checkoutDom.panel.querySelectorAll('input[name="shippingMethod"]').forEach(function (input) {
      input.addEventListener("change", function () { selectedShippingId = input.value; renderCheckoutPanel(); });
    });

    document.getElementById("confirmCheckoutBtn").addEventListener("click", function () {
      const lines = cart.lines();
      if (!lines.length) return;

      if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
        showToast("نام، شماره تماس و آدرس برای ثبت سفارش الزامی است.");
        return;
      }

      const raw = cart.totalPrice();
      const payable = appliedCoupon ? coupons.apply(appliedCoupon, raw) : raw;
      const shipping = shippingMethods.find(function (m) { return m.id === selectedShippingId; });
      const shippingCost = shipping ? shipping.price : 0;
      const total = payable + shippingCost;

      if (window.MehrabOrdersStore) {
        const order = window.MehrabOrdersStore.create({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerAddress: customerAddress.trim(),
          items: lines.map(function (line) {
            return { productId: line.id, name: line.product.name, ml: line.ml, qty: line.qty, unitPrice: line.unitPrice };
          }),
          shippingMethodName: shipping ? shipping.name : "—",
          shippingCost: shippingCost,
          paymentMethod: payment.method,
          paymentMethodLabel: payment.method === "card" ? "کارت‌به‌کارت" : payment.gatewayName,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          subtotal: raw,
          discount: raw - payable,
          total: total,
          status: window.MehrabOrdersStore.STATUS.PENDING,
          paid: false
        });
        showToast("سفارش شما با کد " + order.id + " ثبت شد — مبلغ نهایی " + catalog.formatToman(total) + " (پرداختی واقعی انجام نمی‌شود).");
      } else {
        showToast("تسویه‌حساب نمایشی است — مبلغ " + catalog.formatToman(total) + " (پرداختی انجام نمی‌شود).");
      }

      if (window.MehrabAbandonedCarts) window.MehrabAbandonedCarts.clearLive();
      cart.clear();
      appliedCoupon = null;
      customerName = "";
      customerAddress = "";
      checkoutDom.panel.classList.remove("is-visible");
    });
  }

  function initCart() {
    initCoupon();  /* must run before the first renderCart() so couponDom is populated */
    initCheckoutPanel();
    renderCart();

    dom.cartButton.addEventListener("click", openCart);
    dom.cartClose.addEventListener("click", closeCart);
    dom.cartOverlay.addEventListener("click", closeCart);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && dom.cartDrawer.classList.contains("is-open")) closeCart();
    });

    dom.cartItems.addEventListener("click", function (event) {
      const inc = event.target.closest("[data-inc]");
      const dec = event.target.closest("[data-dec]");
      const rm  = event.target.closest("[data-remove]");
      if (inc) cart.changeQty(inc.dataset.inc, parseInt(inc.dataset.ml, 10), 1);
      if (dec) cart.changeQty(dec.dataset.dec, parseInt(dec.dataset.ml, 10), -1);
      if (rm)  cart.remove(rm.dataset.remove, parseInt(rm.dataset.ml, 10));
    });

    /* Checkout is gated on the demo login state. Cart contents live in
       localStorage regardless (see cart.js), so nothing is lost by the
       trip to login.html — we just remember where to send the person
       back to, and ask index.html/product.html/etc. to reopen the
       cart drawer once they're back (see the openCart=1 check below). */
    dom.checkoutBtn.addEventListener("click", function () {
      if (!session.isLoggedIn()) {
        try {
          sessionStorage.setItem(REDIRECT_KEY, window.location.pathname + window.location.search);
        } catch (err) { /* ignore — worst case, login just returns to the homepage */ }
        showToast("برای ادامه فرایند خرید ابتدا وارد حساب کاربری خود شوید...");
        setTimeout(function () { navigateTo("login.html"); }, 700);
        return;
      }
      const isOpen = checkoutDom.panel.classList.contains("is-visible");
      if (isOpen) {
        checkoutDom.panel.classList.remove("is-visible");
      } else {
        renderCheckoutPanel();
        checkoutDom.panel.classList.add("is-visible");
      }
    });

    /* Returning from a successful login/signup with a cart to show. */
    const params = new URLSearchParams(window.location.search);
    if (params.get("openCart") === "1") {
      setTimeout(openCart, 550);
    }

    document.addEventListener(cart.EVENT_NAME, function () {
      renderCart();
      bumpCartCount();
      if (window.MehrabAbandonedCarts) {
        const user = session.get();
        window.MehrabAbandonedCarts.syncLive(cart.lines(), cart.totalPrice(), user && user.phone);
      }
    });
  }

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function showToast(message) {
    if (!dom.toast) return;
    dom.toast.textContent = message;
    dom.toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { dom.toast.classList.remove("is-visible"); }, 2600);
  }
  window.MehrabToast = { show: showToast };

  /* ---------- Header shadow on scroll ---------- */
  function initHeaderShadow() {
    let ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        dom.header.classList.toggle("is-scrolled", window.scrollY > 8);
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Scroll reveal (shared by every page) ---------- */
  /* Elements with .reveal fade+slide in when they enter the viewport
     AND fade back out when they leave it — the observer never
     unobserves, it just toggles .is-visible with the intersection
     state, so scrolling up re-triggers the fade-out/fade-in in both
     directions rather than a one-time reveal. */
  function initScrollReveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (el) { observer.observe(el); });
  }
  window.MehrabReveal = { init: initScrollReveal, refresh: initScrollReveal };

  /* ---------- Animated stat counters (shared by home.js / about.html) ---------- */
  function initCounters() {
    const nums = document.querySelectorAll(".stat-num[data-count]");
    if (!nums.length || !("IntersectionObserver" in window)) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseInt(el.dataset.count, 10);
        observer.unobserve(el);
        if (reduce) { el.textContent = end.toLocaleString("fa-IR"); return; }

        const start = performance.now();
        const duration = 1300;
        function tick(now) {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(end * eased).toLocaleString("fa-IR");
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });

    nums.forEach(function (el) { observer.observe(el); });
  }
  window.MehrabCounters = { init: initCounters };

  /* ---------- Search icon ---------- */
  /* Jumps to the shop grid and focuses the real search input there.
     If we're not already on the home page, navigate first (through
     the fade transition) and let home.js focus the field once the
     new page has rendered — see the #collection hash check there. */
  function initSearchIcon() {
    const btn = document.getElementById("searchToggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        document.getElementById("collection").scrollIntoView({ behavior: "smooth" });
        setTimeout(function () { searchInput.focus(); }, 350);
      } else {
        navigateTo("index.html?focus=search#collection");
      }
    });
  }

  /* ---------- Page fade-in / fade-out transitions ---------- */
  /* body starts at opacity:0 (see style.css); adding .is-ready fades
     it in. Cross-page navigation (plain <a href="*.html"> links, not
     # anchors, not new tabs, not modified clicks) fades the page out
     first so moving between pages feels continuous rather than a
     hard cut. fadeIn() is idempotent and called from several places
     as a safety net — nothing should ever leave the body stuck at
     opacity:0. */
  function fadeIn() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { document.body.classList.add("is-ready"); });
    });
  }

  function navigateTo(href) {
    document.body.classList.remove("is-ready");
    document.body.classList.add("is-leaving");
    setTimeout(function () { window.location.href = href; }, 320);
  }
  window.MehrabPageTransition = { navigateTo: navigateTo, REDIRECT_KEY: REDIRECT_KEY };

  function initPageTransitions() {
    document.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = event.target.closest("a[href]");
      if (!link) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;

      const href = link.getAttribute("href");
      if (!href || href.charAt(0) === "#" || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) return;

      /* Links that point at the current page itself — e.g. a category
         card linking to "index.html?family=oud#collection" while
         already on index.html — only change the query string/hash.
         This was the actual bug: forcing the fade-out -> setTimeout ->
         location.href flow on these could race the browser's own
         same-document navigation (the anchor scroll), leaving body
         stuck at opacity:0 — a blank, scrolled page. These links still
         need a full reload (home.js only reads filters once, on load),
         so just let the browser handle it natively instead of
         reimplementing that ourselves. `link.pathname` is the resolved
         absolute path, so this comparison is reliable even though the
         href attribute itself is relative. */
      if (link.pathname === window.location.pathname) return;

      event.preventDefault();
      navigateTo(href);
    });
  }

  /* ---------- Scroll-to-top button ---------- */
  /* Injected once so the six pages on this site don't each need to
     repeat identical markup for a widget with zero page-specific
     content. */
  function initScrollTop() {
    const btn = document.createElement("button");
    btn.className = "scroll-top-btn";
    btn.id = "scrollTopBtn";
    btn.setAttribute("aria-label", "بازگشت به بالای صفحه");
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btn);

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    let ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        btn.classList.toggle("is-visible", window.scrollY > 480);
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Header auth icon ---------- */
  /* Reflects the demo session: logged-out shows the usual "ورود /
     ثبت‌نام" link to login.html; logged-in relabels it and turns the
     click into a logout action instead of re-opening the login form. */
  function initAuthIcon() {
    const link = document.querySelector('.header-actions a[href="login.html"]');
    if (!link) return;

    function refresh() {
      const user = session.get();
      const loggedIn = !!user;
      link.classList.toggle("is-logged-in", loggedIn);
      link.setAttribute("aria-label", loggedIn ? "خروج از حساب کاربری" : "ورود یا ثبت‌نام");
      link.setAttribute("title", loggedIn ? "خروج از حساب" : "ورود / ثبت‌نام");
    }

    link.addEventListener("click", function (event) {
      if (session.get()) {
        event.preventDefault();
        session.logout();
        showToast("از حساب خود خارج شدید.");
        refresh();
      }
      /* logged-out: let the normal <a href="login.html"> navigation
         (and the page-fade interceptor) handle it as usual */
    });

    document.addEventListener(session.EVENT_NAME, refresh);
    refresh();
  }

  /* ---------- Category dropdown in the primary nav ---------- */
  function initCategoryDropdown() {
    const item = document.querySelector(".nav-item.has-dropdown");
    if (!item) return;
    const toggle = item.querySelector(".nav-dropdown-toggle");
    const panel = item.querySelector(".nav-dropdown");
    if (!toggle || !panel) return;

    function close() {
      item.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
    function open() {
      item.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      if (item.classList.contains("is-open")) close(); else open();
    });

    document.addEventListener("click", function (event) {
      if (!item.contains(event.target)) close();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") close();
    });

    /* closing the mobile hamburger nav (initNav, above) should also
       close this so it doesn't reopen stale next time the menu shows */
    if (dom.primaryNav) {
      dom.primaryNav.addEventListener("click", function (event) {
        if (event.target === toggle || toggle.contains(event.target)) return;
        if (event.target.tagName === "A") close();
      });
    }
  }

  /* ---------- Nav visibility & order (admin-configurable) ---------- */
  function initNavVisibility() {
    const settings = window.MehrabSiteSettings;
    if (!settings || !dom.primaryNav) return;

    const navConfig = settings.getNav(); /* already sorted by order */
    const container = dom.primaryNav;

    navConfig.forEach(function (item) {
      const el = container.querySelector('[data-navkey="' + item.key + '"]');
      if (el) {
        el.style.display = item.visible === false ? "none" : "";
        el.style.order = item.order;
      }
    });

    /* custom admin-added pages that opted into the nav */
    const customSlot = document.getElementById("customNavItems");
    if (customSlot) {
      const customItems = navConfig.filter(function (item) { return item.key.indexOf("custom:") === 0 && item.visible !== false; });
      customSlot.innerHTML = customItems.map(function (item) {
        return '<a href="' + item.href + '" style="order:' + item.order + '">' + item.label + "</a>";
      }).join("");
    }
  }

  /* ---------- Static page content overrides (about/contact) ---------- */
  function initPageContentOverrides() {
    const settings = window.MehrabSiteSettings;
    if (!settings) return;

    const aboutHeading = document.getElementById("aboutHeading");
    if (aboutHeading) {
      const content = settings.getPageContent("about");
      if (content) {
        aboutHeading.textContent = content.heading;
        const wrap = document.getElementById("aboutParagraphs");
        if (wrap && content.paragraphs) {
          wrap.innerHTML = content.paragraphs.map(function (p) { return "<p>" + p + "</p>"; }).join("");
        }
      }
    }

    const contactPhone = document.getElementById("contactPhoneLink");
    if (contactPhone) {
      const content = settings.getPageContent("contact");
      if (content) {
        contactPhone.textContent = content.phone;
        contactPhone.setAttribute("href", "tel:" + content.phone.replace(/[^\d+]/g, ""));
        const email = document.getElementById("contactEmailLink");
        if (email) { email.textContent = content.email; email.setAttribute("href", "mailto:" + content.email); }
        const addr = document.getElementById("contactAddressText");
        if (addr) addr.textContent = content.address;
        const hours = document.getElementById("contactHoursText");
        if (hours) hours.textContent = content.hours;
      }
    }
  }

  /* ---------- Footer trust badges (licenses / نماد الکترونیک) ---------- */
  /* Only renders badges the admin has actually marked active — an
     unearned trust seal is worse than none, so inactive ones (the
     default state until the real license arrives) never show. */
  function initTrustBadges() {
    const settings = window.MehrabSiteSettings;
    const slot = document.getElementById("footerTrustBadges");
    if (!settings || !slot) return;

    const badges = settings.getTrustBadges(true);
    if (!badges.length) return;

    slot.innerHTML = badges.map(function (b) {
      return '<span class="trust-badge-pill">' + b.name + "</span>";
    }).join("");
    slot.classList.add("is-visible");
  }

  function init() {
    /* Fire the fade-in first and unconditionally — if any of the
       calls below ever throws, the page must still become visible.
       The window "load" listener and hard timeout below are further
       belt-and-suspenders in case something delays or blocks the
       DOMContentLoaded path itself. fadeIn() is idempotent. */
    fadeIn();
    window.addEventListener("load", fadeIn);
    setTimeout(fadeIn, 800);

    initNav();
    initCart();
    initHeaderShadow();
    initScrollReveal();
    initCounters();
    initSearchIcon();
    initAuthIcon();
    initCategoryDropdown();
    initNavVisibility();
    initPageContentOverrides();
    initTrustBadges();
    initPageTransitions();
    initScrollTop();

    if (window.MehrabSEO) window.MehrabSEO.updateBreadcrumbJsonLd();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
