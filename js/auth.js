/* ============================================================
   عطر مهراب — Mehrab Perfume
   auth.js — login & signup forms. There's no real backend behind
   this site, so this validates input shape client-side and shows
   a clearly-labelled demo confirmation rather than pretending to
   authenticate anyone. On success it marks a demo session via
   session.js and returns to wherever "ادامه فرایند خرید" sent the
   person from (see the REDIRECT_KEY set in main.js), reopening
   their cart — which was never touched, since cart.js persists to
   localStorage independently of login state.
   ============================================================ */
(function () {
  "use strict";

  const REDIRECT_KEY = (window.MehrabPageTransition && window.MehrabPageTransition.REDIRECT_KEY)
    || "mehrab_redirect_after_login";

  function goAfterAuth() {
    let redirect = null;
    try {
      redirect = sessionStorage.getItem(REDIRECT_KEY);
      sessionStorage.removeItem(REDIRECT_KEY);
    } catch (err) { /* ignore — falls back to the homepage below */ }

    const target = redirect || "index.html";
    const separator = target.indexOf("?") === -1 ? "?" : "&";
    /* openCart=1 goes before the hash so it's still a query param
       when the target page reads it (e.g. "...#collection" stays
       last); URLSearchParams on the receiving end doesn't care about
       ordering, but this keeps the resulting URL readable. */
    const hashIndex = target.indexOf("#");
    const finalUrl = hashIndex === -1
      ? target + separator + "openCart=1"
      : target.slice(0, hashIndex) + separator + "openCart=1" + target.slice(hashIndex);

    if (window.MehrabPageTransition) window.MehrabPageTransition.navigateTo(finalUrl);
    else window.location.href = finalUrl;
  }

  /* ---------- Login ---------- */
  function initLogin() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const phone = document.getElementById("loginPhone");
    const password = document.getElementById("loginPassword");
    const error = document.getElementById("loginError");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const phoneValid = /^09\d{9}$/.test(phone.value.trim());
      const passValid = password.value.length >= 6;

      if (!phoneValid || !passValid) {
        error.textContent = !phoneValid
          ? "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)."
          : "رمز عبور باید حداقل ۶ کاراکتر باشد.";
        return;
      }

      error.textContent = "";
      window.MehrabSession.login({ phone: phone.value.trim() });
      window.MehrabToast.show("ورود موفق (نسخه نمایشی) — در حال انتقال...");
      setTimeout(goAfterAuth, 900);
    });
  }

  /* ---------- Signup ---------- */
  function initSignup() {
    const form = document.getElementById("signupForm");
    if (!form) return;

    const name = document.getElementById("signupName");
    const phone = document.getElementById("signupPhone");
    const password = document.getElementById("signupPassword");
    const confirm = document.getElementById("signupConfirm");
    const error = document.getElementById("signupError");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!name.value.trim()) {
        error.textContent = "لطفاً نام خود را وارد کنید.";
        return;
      }
      if (!/^09\d{9}$/.test(phone.value.trim())) {
        error.textContent = "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹).";
        return;
      }
      if (password.value.length < 6) {
        error.textContent = "رمز عبور باید حداقل ۶ کاراکتر باشد.";
        return;
      }
      if (password.value !== confirm.value) {
        error.textContent = "رمز عبور و تکرار آن یکسان نیستند.";
        return;
      }

      error.textContent = "";
      window.MehrabSession.login({ phone: phone.value.trim(), name: name.value.trim() });
      window.MehrabToast.show("ثبت‌نام موفق (نسخه نمایشی) — در حال انتقال...");
      setTimeout(goAfterAuth, 900);
    });
  }

  initLogin();
  initSignup();
})();
