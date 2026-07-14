/* ============================================================
   عطر مهراب — Mehrab Perfume — Admin Panel
   admin-auth.js — demo authentication for the admin panel.
   ------------------------------------------------------------
   There's no real backend, so "authentication" here means a fixed
   demo password checked client-side and a sessionStorage flag
   (cleared when the browser tab closes, unlike the customer-facing
   session in js/session.js which persists longer). This is loaded
   on every admin page; admin/index.html additionally has the login
   form logic, and every OTHER admin page calls requireAuth() first
   thing to bounce back to the login screen if not authenticated.
   ============================================================ */
window.MehrabAdminAuth = (function () {
  "use strict";

  const DEMO_PASSWORD = "mehrab-admin";
  const FLAG_KEY = "mehrab_admin_authed";

  function isAuthed() {
    try { return sessionStorage.getItem(FLAG_KEY) === "1"; } catch (err) { return false; }
  }

  function login(password) {
    if (password !== DEMO_PASSWORD) return false;
    try { sessionStorage.setItem(FLAG_KEY, "1"); } catch (err) { /* ignore */ }
    return true;
  }

  function logout() {
    try { sessionStorage.removeItem(FLAG_KEY); } catch (err) { /* ignore */ }
    window.location.href = "index.html";
  }

  /* Called at the top of every admin page except the login screen.
     Redirects immediately if not authenticated, before any page
     content or data would otherwise render. */
  function requireAuth() {
    if (!isAuthed()) {
      window.location.href = "index.html";
    }
  }

  return { DEMO_PASSWORD: DEMO_PASSWORD, isAuthed: isAuthed, login: login, logout: logout, requireAuth: requireAuth };
})();
