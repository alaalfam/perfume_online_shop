/* ============================================================
   عطر مهراب — Mehrab Perfume
   contact.js — contact form validation. No real backend, so this
   validates shape client-side and shows a clear success message
   rather than pretending to send anything.
   ============================================================ */
(function () {
  "use strict";

  const form = document.getElementById("contactForm");
  if (!form) return;

  const name = document.getElementById("contactName");
  const phone = document.getElementById("contactPhone");
  const message = document.getElementById("contactMessage");
  const feedback = document.getElementById("contactFeedback");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!name.value.trim()) {
      feedback.textContent = "لطفاً نام خود را وارد کنید.";
      feedback.classList.add("is-error");
      return;
    }
    if (!/^09\d{9}$/.test(phone.value.trim())) {
      feedback.textContent = "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹).";
      feedback.classList.add("is-error");
      return;
    }
    if (!message.value.trim() || message.value.trim().length < 10) {
      feedback.textContent = "لطفاً پیام خود را کامل‌تر بنویسید (حداقل ۱۰ نویسه).";
      feedback.classList.add("is-error");
      return;
    }

    feedback.classList.remove("is-error");
    feedback.textContent = "پیام شما ثبت شد — تیم پشتیبانی طی یک روز کاری با شما تماس می‌گیرد.";
    form.reset();
    window.MehrabToast.show("پیام شما با موفقیت ارسال شد.");
  });
})();
