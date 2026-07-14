/* ============================================================
   عطر مهراب — Mehrab Perfume — Admin Panel
   admin-orders.js — order list with status/payment management,
   plus the abandoned-carts view.
   ============================================================ */
(function () {
  "use strict";

  const catalog = window.MehrabCatalog;
  const orders = window.MehrabOrdersStore;
  const carts = window.MehrabAbandonedCarts;
  const admin = window.MehrabAdmin;

  let statusFilter = "all";
  let searchTerm = "";

  /* ---------- Tabs ---------- */
  function initTabs() {
    const buttons = document.querySelectorAll(".admin-tab-btn");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
        document.querySelectorAll(".admin-tab-panel").forEach(function (panel) {
          panel.classList.toggle("is-active", panel.id === "panel-" + btn.dataset.tab);
        });
      });
    });
  }

  /* ---------- Stats ---------- */
  function renderStats() {
    const all = orders.all();
    const grid = document.getElementById("orderStatGrid");
    const stats = [
      { label: "کل سفارشات", value: all.length },
      { label: "تایید نشده", value: all.filter(function (o) { return o.status === "pending"; }).length },
      { label: "در حال ارسال", value: all.filter(function (o) { return o.status === "shipping"; }).length },
      { label: "پرداخت‌نشده", value: all.filter(function (o) { return !o.paid; }).length }
    ];
    grid.innerHTML = stats.map(function (s) {
      return '<div class="admin-stat-card"><span class="admin-stat-num">' + s.value.toLocaleString("fa-IR") + '</span><span class="admin-stat-label">' + s.label + "</span></div>";
    }).join("");
  }

  /* ---------- Orders table ---------- */
  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });
    } catch (err) {
      return iso;
    }
  }

  function itemCount(order) {
    return order.items.reduce(function (sum, it) { return sum + it.qty; }, 0);
  }

  function renderOrders() {
    const tbody = document.getElementById("ordersTableBody");
    const term = searchTerm.trim().toLowerCase();

    const list = orders.all().filter(function (o) {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!term) return true;
      return o.id.toLowerCase().indexOf(term) !== -1 || o.customerPhone.toLowerCase().indexOf(term) !== -1;
    });

    if (!list.length) {
      tbody.innerHTML = '<tr class="admin-empty-row"><td colspan="8">سفارشی یافت نشد.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(function (o) {
      return (
        "<tr class='admin-clickable-row' data-row-link='order-detail.html?id=" + o.id + "'>" +
          "<td style='font-weight:700'>" + o.id + "</td>" +
          "<td>" + formatDate(o.createdAt) + "</td>" +
          "<td>" + (o.customerName || "—") + "</td>" +
          "<td style='direction:ltr;text-align:right'>" + o.customerPhone + "</td>" +
          "<td>" + itemCount(o).toLocaleString("fa-IR") + " قلم</td>" +
          "<td>" + catalog.formatToman(o.total) + "</td>" +
          "<td>" +
            '<select class="admin-status-select" data-status-for="' + o.id + '">' +
              orders.STATUS_ORDER.map(function (s) {
                return '<option value="' + s + '"' + (s === o.status ? " selected" : "") + '>' + orders.STATUS_LABELS[s] + "</option>";
              }).join("") +
            "</select>" +
          "</td>" +
          "<td><button type='button' class='admin-badge " + (o.paid ? "is-on" : "is-off") + "' data-toggle-paid='" + o.id + "' style='border:none;cursor:pointer'>" + (o.paid ? "پرداخت‌شده" : "پرداخت‌نشده") + "</button></td>" +
          "<td><a href='order-detail.html?id=" + o.id + "' class='admin-icon-btn' aria-label='مشاهده جزئیات' data-row-ignore>›</a></td>" +
        "</tr>"
      );
    }).join("");
  }

  /* ---------- Abandoned carts ---------- */
  function renderAbandoned() {
    const tbody = document.getElementById("abandonedTableBody");
    const list = carts.all();
    if (!list.length) {
      tbody.innerHTML = '<tr class="admin-empty-row"><td colspan="5">سبد رهاشده‌ای ثبت نشده است.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(function (c) {
      const itemsSummary = c.items.map(function (it) { return it.name + " ×" + it.qty.toLocaleString("fa-IR"); }).join("، ");
      return (
        "<tr>" +
          "<td>" + (c.isLive ? '<span class="admin-badge is-on">سبد فعلی مرورگر</span>' : '<span class="admin-badge is-off">نمونه رهاشده</span>') + "</td>" +
          "<td style='direction:ltr;text-align:right'>" + c.customerPhone + "</td>" +
          "<td>" + itemsSummary + "</td>" +
          "<td>" + catalog.formatToman(c.total) + "</td>" +
          "<td>" + formatDate(c.updatedAt) + "</td>" +
        "</tr>"
      );
    }).join("");
  }

  function init() {
    renderStats();
    renderOrders();
    renderAbandoned();
    initTabs();

    document.getElementById("statusFilter").addEventListener("change", function (event) {
      statusFilter = event.target.value;
      renderOrders();
    });
    document.getElementById("searchOrders").addEventListener("input", function (event) {
      searchTerm = event.target.value;
      renderOrders();
    });

    document.getElementById("ordersTableBody").addEventListener("change", function (event) {
      const select = event.target.closest("[data-status-for]");
      if (!select) return;
      orders.updateStatus(select.dataset.statusFor, select.value);
      admin.showToast("وضعیت سفارش به‌روزرسانی شد.");
      renderStats();
    });

    document.getElementById("ordersTableBody").addEventListener("click", function (event) {
      const payBtn = event.target.closest("[data-toggle-paid]");
      if (payBtn) {
        event.stopPropagation();
        const order = orders.getById(payBtn.dataset.togglePaid);
        orders.updatePaid(payBtn.dataset.togglePaid, !order.paid);
        admin.showToast("وضعیت پرداخت به‌روزرسانی شد.");
        renderOrders();
        renderStats();
        return;
      }

      /* row click navigates to the order detail page, unless the
         click landed on an interactive control (status select, the
         pay-toggle button already handled above, or the explicit
         view link) that should handle itself instead */
      if (event.target.closest("[data-row-ignore], select, a")) return;
      const row = event.target.closest("[data-row-link]");
      if (row) window.location.href = row.dataset.rowLink;
    });
  }

  init();
})();
