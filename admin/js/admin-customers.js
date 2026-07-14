/* ============================================================
   عطر مهراب — Mehrab Perfume — Admin Panel
   admin-customers.js — read-only customer directory table with
   name/phone search.
   ============================================================ */
(function () {
  "use strict";

  const customers = window.MehrabCustomers;

  const dom = {
    tbody: document.getElementById("customersTableBody"),
    search: document.getElementById("searchCustomers")
  };

  const REFERRER_LABEL = { google: "گوگل", direct: "لینک مستقیم" };

  function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });
  }

  function matches(customer, term) {
    if (!term) return true;
    const haystack = (customer.firstName + " " + customer.lastName + " " + customer.phone).toLowerCase();
    return haystack.indexOf(term.toLowerCase()) !== -1;
  }

  function render() {
    const term = dom.search.value.trim();
    const list = customers.list().filter(function (c) { return matches(c, term); });

    if (!list.length) {
      dom.tbody.innerHTML = '<tr class="admin-empty-row"><td colspan="7">مشتری‌ای یافت نشد.</td></tr>';
      return;
    }

    dom.tbody.innerHTML = list.map(function (c) {
      return (
        "<tr>" +
          "<td style='direction:ltr;text-align:right'>" + c.phone + "</td>" +
          "<td>" + c.firstName + "</td>" +
          "<td>" + c.lastName + "</td>" +
          "<td>" + formatDate(c.joinDate) + "</td>" +
          "<td>" + formatDate(c.lastLogin) + "</td>" +
          "<td>" + (REFERRER_LABEL[c.referrer] || c.referrer || "—") + "</td>" +
          "<td>" + c.address + "</td>" +
        "</tr>"
      );
    }).join("");
  }

  function init() {
    render();
    dom.search.addEventListener("input", render);
  }

  init();
})();
