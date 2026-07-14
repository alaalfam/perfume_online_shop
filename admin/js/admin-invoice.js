/* ============================================================
   عطر مهراب — Mehrab Perfume — Admin Panel
   admin-invoice.js — renders one order as a printable invoice,
   driven by ?id=. This page has no sidebar (admin-shell.js isn't
   loaded here — nothing on a print sheet should show the admin
   chrome), so it calls the auth guard directly.
   ============================================================ */
(function () {
  "use strict";

  window.MehrabAdminAuth.requireAuth();

  const catalog = window.MehrabCatalog;
  const orders = window.MehrabOrdersStore;
  const settings = window.MehrabSiteSettings;

  const params = new URLSearchParams(window.location.search);
  const order = orders.getById(params.get("id"));

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });
    } catch (err) {
      return iso;
    }
  }

  function render() {
    if (!order) {
      document.getElementById("invoiceSheet").style.display = "none";
      document.getElementById("invoiceNotFound").style.display = "block";
      return;
    }

    document.title = "فاکتور سفارش " + order.id + " | عطر مهراب";
    document.getElementById("invNumber").textContent = order.id;
    document.getElementById("invDate").textContent = formatDate(order.createdAt);

    document.getElementById("invCustName").textContent = order.customerName || "—";
    document.getElementById("invCustPhone").textContent = order.customerPhone || "—";
    document.getElementById("invCustAddress").textContent = order.customerAddress || "—";

    const contact = settings ? settings.getPageContent("contact") : null;
    document.getElementById("invSellerAddress").textContent = (contact && contact.address) || "تهران، خیابان ولیعصر";
    document.getElementById("invSellerPhone").textContent = (contact && contact.phone) || "۰۲۱-۰۰۰۰۰۰۰۰";

    document.getElementById("invItemsBody").innerHTML = order.items.map(function (it, i) {
      return (
        "<tr>" +
          "<td>" + (i + 1).toLocaleString("fa-IR") + "</td>" +
          "<td>" + it.name + "</td>" +
          "<td>" + it.ml.toLocaleString("fa-IR") + " میل‌لیتر</td>" +
          "<td>" + it.qty.toLocaleString("fa-IR") + "</td>" +
          "<td>" + catalog.formatToman(it.unitPrice) + "</td>" +
          "<td>" + catalog.formatToman(it.unitPrice * it.qty) + "</td>" +
        "</tr>"
      );
    }).join("");

    const totalsRows = [["جمع جزء", catalog.formatToman(order.subtotal)]];
    if (order.couponCode) totalsRows.push(["تخفیف (" + order.couponCode + ")", "−" + catalog.formatToman(order.discount)]);
    totalsRows.push(["هزینه ارسال (" + order.shippingMethodName + ")", order.shippingCost > 0 ? catalog.formatToman(order.shippingCost) : "رایگان"]);
    totalsRows.push(["مبلغ نهایی قابل پرداخت", catalog.formatToman(order.total)]);

    document.getElementById("invTotals").innerHTML = totalsRows.map(function (r, i) {
      const isLast = i === totalsRows.length - 1;
      return '<div class="invoice-total-row' + (isLast ? " is-grand" : "") + '"><span>' + r[0] + "</span><span>" + r[1] + "</span></div>";
    }).join("");

    document.getElementById("invPaymentInfo").textContent =
      "شیوه پرداخت: " + order.paymentMethodLabel + " — وضعیت: " + (order.paid ? "پرداخت‌شده" : "پرداخت‌نشده");
  }

  function init() {
    render();
    const printBtn = document.getElementById("printBtn");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });
  }

  init();
})();
