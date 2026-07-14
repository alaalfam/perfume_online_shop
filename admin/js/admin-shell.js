/* ============================================================
   عطر مهراب — Mehrab Perfume — Admin Panel
   admin-shell.js — loaded on every admin page except the login
   screen. Builds the sidebar, wires the mobile toggle/logout, and
   exposes small shared helpers (toast, confirm) used by every
   admin-*.js page script.
   ============================================================ */
(function () {
  "use strict";

  window.MehrabAdminAuth.requireAuth();

  const NAV_ITEMS = [
    { href: "index.html", label: "داشبورد", icon: "▦" },
    { href: "products.html", label: "محصولات", icon: "◆" },
    { href: "orders.html", label: "سفارشات", icon: "⛁" },
    { href: "categories.html", label: "دسته‌بندی‌ها", icon: "▤" },
    { href: "coupons.html", label: "کدهای تخفیف", icon: "٪" },
    { href: "articles.html", label: "مقالات", icon: "✎" },
    { href: "pages.html", label: "صفحات و منو", icon: "▥" },
    { href: "settings.html", label: "بنر، پرداخت و ارسال", icon: "⚙" }
  ];

  function currentFile() {
    return window.location.pathname.split("/").pop() || "index.html";
  }

  function renderSidebar() {
    const sidebar = document.getElementById("adminSidebar");
    if (!sidebar) return;
    const current = currentFile();

    sidebar.innerHTML =
      '<a class="admin-brand" href="index.html">' +
        '<span class="admin-brand-mark" aria-hidden="true">◈</span>' +
        '<span>پنل مدیریت مهراب</span>' +
      "</a>" +
      '<nav class="admin-nav" aria-label="ناوبری پنل مدیریت">' +
        NAV_ITEMS.map(function (item) {
          return (
            '<a href="' + item.href + '" class="admin-nav-link' + (item.href === current ? " is-active" : "") + '">' +
              '<span class="admin-nav-icon" aria-hidden="true">' + item.icon + "</span>" +
              "<span>" + item.label + "</span>" +
            "</a>"
          );
        }).join("") +
      "</nav>" +
      '<div class="admin-sidebar-foot">' +
        '<a class="admin-nav-link" href="../index.html" target="_blank" rel="noopener">' +
          '<span class="admin-nav-icon" aria-hidden="true">↗</span><span>مشاهده سایت</span>' +
        "</a>" +
        '<button type="button" class="admin-nav-link admin-logout-btn" id="adminLogoutBtn">' +
          '<span class="admin-nav-icon" aria-hidden="true">⏻</span><span>خروج</span>' +
        "</button>" +
      "</div>";

    document.getElementById("adminLogoutBtn").addEventListener("click", window.MehrabAdminAuth.logout);
  }

  function initMobileToggle() {
    const toggle = document.getElementById("adminMenuToggle");
    const sidebar = document.getElementById("adminSidebar");
    const overlay = document.getElementById("adminSidebarOverlay");
    if (!toggle || !sidebar || !overlay) return;

    function close() {
      sidebar.classList.remove("is-open");
      overlay.classList.remove("is-open");
    }
    toggle.addEventListener("click", function () {
      sidebar.classList.toggle("is-open");
      overlay.classList.toggle("is-open");
    });
    overlay.addEventListener("click", close);
    sidebar.addEventListener("click", function (event) {
      if (event.target.tagName === "A") close();
    });
  }

  /* ---------- Shared small helpers for admin-*.js page scripts ---------- */
  let toastTimer = null;
  function showToast(message) {
    const el = document.getElementById("adminToast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-visible"); }, 2400);
  }

  function confirmDelete(message) {
    return window.confirm(message || "آیا از حذف این مورد مطمئن هستید؟ این عملیات قابل بازگشت نیست.");
  }

  window.MehrabAdmin = { showToast: showToast, confirmDelete: confirmDelete };

  renderSidebar();
  initMobileToggle();
})();
