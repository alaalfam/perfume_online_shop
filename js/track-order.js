/* ============================================================
   عطر مهراب — Mehrab Perfume
   track-order.js — order tracking form + timeline rendering.
   Depends on orders.js and main.js.
   ============================================================ */
(function () {
  "use strict";

  const orders = window.MehrabOrders;

  const dom = {
    form: document.getElementById("trackForm"),
    code: document.getElementById("orderCode"),
    phone: document.getElementById("orderPhone"),
    result: document.getElementById("trackResult"),
    error: document.getElementById("trackError"),
    timeline: document.getElementById("timeline"),
    meta: document.getElementById("trackMeta"),
    items: document.getElementById("trackItems")
  };

  if (!dom.form) return; /* not on this page */

  const STEP_DESCRIPTIONS = [
    "سفارش شما ثبت و برای پردازش ارسال شد.",
    "سفارش شما در حال آماده‌سازی و بسته‌بندی در انبار ماست.",
    "سفارش شما تحویل پیک/پست داده شد و در مسیر است.",
    "سفارش با موفقیت به دست شما رسید."
  ];

  function renderTimeline(order) {
    dom.timeline.innerHTML = orders.STEPS.map(function (label, i) {
      const done = i <= order.currentStep;
      return (
        '<li class="timeline-step' + (done ? " is-done" : "") + '">' +
          '<span class="timeline-dot" aria-hidden="true">' + (done ? "✓" : (i + 1).toLocaleString("fa-IR")) + "</span>" +
          '<div class="timeline-body">' +
            "<h4>" + label + "</h4>" +
            "<p>" + STEP_DESCRIPTIONS[i] + "</p>" +
          "</div>" +
        "</li>"
      );
    }).join("");
  }

  function renderMeta(order) {
    dom.meta.innerHTML =
      "<span>کد سفارش: <strong>" + order.code + "</strong></span>" +
      "<span>شرکت پست: <strong>" + order.courier + "</strong></span>" +
      "<span>کد رهگیری: <strong>" + order.trackingCode + "</strong></span>" +
      "<span>آخرین بروزرسانی: <strong>" + order.updatedAt + "</strong></span>";
  }

  function renderItems(order) {
    dom.items.innerHTML = order.items.map(function (item) {
      return "<li>" + item.name + " — " + item.ml.toLocaleString("fa-IR") + " میل‌لیتر × " + item.qty.toLocaleString("fa-IR") + "</li>";
    }).join("");
  }

  function showResult(order) {
    renderMeta(order);
    renderTimeline(order);
    renderItems(order);
    dom.error.classList.remove("is-visible");
    dom.result.classList.remove("is-hidden");
    requestAnimationFrame(function () { dom.result.classList.add("is-visible"); });
  }

  function showError() {
    dom.result.classList.remove("is-visible");
    dom.result.classList.add("is-hidden");
    dom.error.classList.add("is-visible");
  }

  function init() {
    dom.form.addEventListener("submit", function (event) {
      event.preventDefault();
      const order = orders.find(dom.code.value, dom.phone.value.trim());
      if (order) {
        showResult(order);
      } else {
        showError();
      }
    });
  }

  init();
})();
