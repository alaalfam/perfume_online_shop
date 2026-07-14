/* ============================================================
   عطر مهراب — Mehrab Perfume
   session.js — demo "logged in" state, persisted to localStorage.
   ------------------------------------------------------------
   There's no real backend behind this site (see auth.js), so this
   just remembers whether the demo login/signup flow completed and
   which phone number was used — enough to gate checkout and show
   the header icon's logged-in state.
   ============================================================ */
window.MehrabSession = (function () {
  "use strict";

  const STORAGE_KEY = "mehrab_session_v1";
  const EVENT_NAME = "mehrab:sessionchange";

  function get() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn("Session could not be read:", err);
      return null;
    }
  }

  function login(data) {
    const record = Object.assign({ loggedInAt: Date.now() }, data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch (err) {
      console.warn("Session could not be saved:", err);
    }
    document.dispatchEvent(new CustomEvent(EVENT_NAME));
    return record;
  }

  function logout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("Session could not be cleared:", err);
    }
    document.dispatchEvent(new CustomEvent(EVENT_NAME));
  }

  function isLoggedIn() { return !!get(); }

  return { get: get, login: login, logout: logout, isLoggedIn: isLoggedIn, EVENT_NAME: EVENT_NAME };
})();
