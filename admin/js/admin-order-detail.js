/* ============================================================
   عطر مهراب — Mehrab Perfume — Admin Panel
   admin-order-detail.js — full order detail page, driven by ?id=
   (same "one template, many records" pattern as the public site's
   product.html / category.html / article.html).
   ============================================================ */
(function () {
  "use strict";

  const catalog = window.MehrabCatalog;
  const orders = window.MehrabOrdersStore;
  const admin = window.MehrabAdmin;

  const params = new URLSearchParams(window.location.search);
  let order = orders.getById(params.get("id"));

  const dom = {
    title: document.getElementById("orderTitle"),
    subtitle: document.getElementById("orderSubtitle"),
    notFound: document.getElementById("orderNotFound"),
    content: document.getElementById("orderContent"),
    invoiceLink: document.getElementById("invoiceLink"),
    custName: document.getElementById("custName"),
    custPhone: document.getElementById("custPhone"),
    custAddress: document.getElementById("custAddress"),
    statusSelect: document.getElementById("orderStatusSelect"),
    paidBtn: document.getElementById("paidToggleBtn"),
    itemsTable: document.getElementById("orderItemsTable"),
    summaryTable: document.getElementById("orderSummaryTable")
  };

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch (err) {
      return iso;
    }
  }

  function render() {
    if (!order) {
      dom.title.textContent = "سفارش یافت نشد";
      dom.content.style.display = "none";
      dom.invoiceLink.style.display = "none";
      dom.notFound.style.display = "block";
      return;
    }

    document.title = "سفارش " + order.id + " | پنل مدیریت مهراب";
    dom.title.textContent = "سفارش " + order.id;
    dom.subtitle.textContent = "ثبت‌شده در " + formatDate(order.createdAt);
    dom.invoiceLink.href = "invoice.html?id=" + order.id;

    dom.custName.textContent = order.customerName || "—";
    dom.custPhone.textContent = order.customerPhone || "—";
    dom.custAddress.textContent = order.customerAddress || "—";

    dom.statusSelect.innerHTML = orders.STATUS_ORDER.map(function (s) {
      return '<option value="' + s + '"' + (s === order.status ? " selected" : "") + '>' + orders.STATUS_LABELS[s] + "</option>";
    }).join("");

    renderPaidButton();

    dom.itemsTable.innerHTML = order.items.map(function (it) {
      return (
        "<div class='spec-row'>" +
          "<span class='spec-label'>" + it.name + " · " + it.ml.toLocaleString("fa-IR") + " میل‌لیتر × " + it.qty.toLocaleString("fa-IR") + "</span>" +
          "<span class='spec-value'>" + catalog.formatToman(it.unitPrice * it.qty) + "</span>" +
        "</div>"
      );
    }).join("");

    const summaryRows = [
      ["شیوه ارسال", order.shippingMethodName + " (" + (order.shippingCost > 0 ? catalog.formatToman(order.shippingCost) : "رایگان") + ")"],
      ["شیوه پرداخت", order.paymentMethodLabel]
    ];
    if (order.couponCode) summaryRows.push(["کد تخفیف", order.couponCode + " (−" + catalog.formatToman(order.discount) + ")"]);
    summaryRows.push(["جمع جزء", catalog.formatToman(order.subtotal)]);
    summaryRows.push(["مبلغ نهایی", catalog.formatToman(order.total)]);

    dom.summaryTable.innerHTML = summaryRows.map(function (r) {
      return "<div class='spec-row'><span class='spec-label'>" + r[0] + "</span><span class='spec-value'>" + r[1] + "</span></div>";
    }).join("");
  }

  function renderPaidButton() {
    dom.paidBtn.textContent = order.paid ? "پرداخت‌شده ✓ (کلیک برای لغو)" : "پرداخت‌نشده (کلیک برای ثبت پرداخت)";
    dom.paidBtn.style.color = order.paid ? "#235c39" : "var(--ink)";
    dom.paidBtn.style.borderColor = order.paid ? "#235c39" : "var(--line)";
  }

  function init() {
    render();
    if (!order) return;

    dom.statusSelect.addEventListener("change", function () {
      order = orders.updateStatus(order.id, dom.statusSelect.value);
      admin.showToast("وضعیت سفارش به‌روزرسانی شد.");
    });

    dom.paidBtn.addEventListener("click", function () {
      order = orders.updatePaid(order.id, !order.paid);
      renderPaidButton();
      admin.showToast("وضعیت پرداخت به‌روزرسانی شد.");
    });
  }

  init();
})();
