/* ============================================================
   عطر مهراب — Mehrab Perfume — Admin Panel
   admin-dashboard.js — admin/index.html is special: it has to show
   the login form OR the dashboard depending on auth state, so it
   can't use admin-shell.js (which unconditionally redirects
   unauthenticated visitors away). This handles both states itself.
   ============================================================ */
(function () {
  "use strict";

  const auth = window.MehrabAdminAuth;

  const loginWrap = document.getElementById("loginWrap");
  const dashboardWrap = document.getElementById("dashboardWrap");

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

  function renderSidebar() {
    const sidebar = document.getElementById("adminSidebar");
    if (!sidebar) return;
    sidebar.innerHTML =
      '<a class="admin-brand" href="index.html">' +
        '<span class="admin-brand-mark" aria-hidden="true">◈</span><span>پنل مدیریت مهراب</span>' +
      "</a>" +
      '<nav class="admin-nav" aria-label="ناوبری پنل مدیریت">' +
        NAV_ITEMS.map(function (item) {
          return (
            '<a href="' + item.href + '" class="admin-nav-link' + (item.href === "index.html" ? " is-active" : "") + '">' +
              '<span class="admin-nav-icon" aria-hidden="true">' + item.icon + "</span><span>" + item.label + "</span>" +
            "</a>"
          );
        }).join("") +
      "</nav>" +
      '<div class="admin-sidebar-foot">' +
        '<a class="admin-nav-link" href="../index.html" target="_blank" rel="noopener"><span class="admin-nav-icon" aria-hidden="true">↗</span><span>مشاهده سایت</span></a>' +
        '<button type="button" class="admin-nav-link admin-logout-btn" id="adminLogoutBtn"><span class="admin-nav-icon" aria-hidden="true">⏻</span><span>خروج</span></button>' +
      "</div>";
    document.getElementById("adminLogoutBtn").addEventListener("click", auth.logout);
  }

  function initMobileToggle() {
    const toggle = document.getElementById("adminMenuToggle");
    const sidebar = document.getElementById("adminSidebar");
    const overlay = document.getElementById("adminSidebarOverlay");
    if (!toggle || !sidebar || !overlay) return;
    function close() { sidebar.classList.remove("is-open"); overlay.classList.remove("is-open"); }
    toggle.addEventListener("click", function () {
      sidebar.classList.toggle("is-open");
      overlay.classList.toggle("is-open");
    });
    overlay.addEventListener("click", close);
    sidebar.addEventListener("click", function (event) { if (event.target.tagName === "A") close(); });
  }

  function renderStats() {
    const grid = document.getElementById("statGrid");
    if (!grid) return;
    const ordersAll = window.MehrabOrdersStore ? window.MehrabOrdersStore.all() : [];
    const stats = [
      { label: "محصول", value: window.MehrabCatalog.all().length },
      { label: "سفارش ثبت‌شده", value: ordersAll.length },
      { label: "سفارش تایید‌نشده", value: ordersAll.filter(function (o) { return o.status === "pending"; }).length },
      { label: "مقاله", value: window.MehrabArticles.all().length },
      { label: "کد تخفیف فعال", value: window.MehrabCoupons.list().filter(function (c) { return c.active; }).length },
      { label: "صفحه سفارشی", value: window.MehrabSiteSettings.getCustomPages().length }
    ];
    grid.innerHTML = stats.map(function (s) {
      return '<div class="admin-stat-card"><span class="admin-stat-num">' + s.value.toLocaleString("fa-IR") + '</span><span class="admin-stat-label">' + s.label + "</span></div>";
    }).join("");
  }

  function showDashboard() {
    loginWrap.style.display = "none";
    dashboardWrap.style.display = "block";
    renderSidebar();
    initMobileToggle();
    renderStats();
  }

  function showLogin() {
    dashboardWrap.style.display = "none";
    loginWrap.style.display = "grid";
  }

  function initLoginForm() {
    const form = document.getElementById("adminLoginForm");
    const input = document.getElementById("adminPassword");
    const error = document.getElementById("adminLoginError");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (auth.login(input.value)) {
        error.textContent = "";
        showDashboard();
      } else {
        error.textContent = "رمز عبور نادرست است.";
      }
    });
  }

  if (auth.isAuthed()) showDashboard(); else showLogin();
  initLoginForm();
})();
