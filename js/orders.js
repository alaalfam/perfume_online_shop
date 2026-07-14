/* ============================================================
   عطر مهراب — Mehrab Perfume
   orders.js — demo order records for the order-tracking page.
   ------------------------------------------------------------
   There's no real backend here, so this is a small fixed dataset
   the tracking form matches against by code + phone. Steps mirror
   a typical Iranian courier flow: ثبت سفارش → پردازش → ارسال شده
   → تحویل داده شده.
   ============================================================ */
window.MehrabOrders = (function () {
  "use strict";

  const STEPS = ["ثبت سفارش", "در حال پردازش", "ارسال شده", "تحویل داده شده"];

  const ORDERS = [
    {
      code: "MHR-10234",
      phone: "09121234567",
      currentStep: 2,
      courier: "پست پیشتاز",
      trackingCode: "IR-88291733",
      updatedAt: "۱۴۰۳/۰۴/۱۰",
      items: [
        { name: "عود سلطانی", ml: 50, qty: 1 },
        { name: "زر و عنبر", ml: 30, qty: 1 }
      ]
    },
    {
      code: "MHR-10199",
      phone: "09351112233",
      currentStep: 3,
      courier: "تیپاکس",
      trackingCode: "IR-77120456",
      updatedAt: "۱۴۰۳/۰۴/۰۲",
      items: [
        { name: "یاس شبانه", ml: 50, qty: 2 }
      ]
    },
    {
      code: "MHR-10301",
      phone: "09190009988",
      currentStep: 0,
      courier: "—",
      trackingCode: "—",
      updatedAt: "۱۴۰۳/۰۴/۱۳",
      items: [
        { name: "کهکشان کهربا", ml: 30, qty: 1 }
      ]
    }
  ];

  function find(code, phone) {
    const c = (code || "").trim().toUpperCase();
    const p = (phone || "").trim();
    return ORDERS.find(function (o) { return o.code.toUpperCase() === c && o.phone === p; }) || null;
  }

  return { STEPS: STEPS, find: find };
})();
