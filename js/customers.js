/* ============================================================
   عطر مهراب — Mehrab Perfume
   customers.js — store-backed customer directory shown in the
   admin panel. This site has no real multi-user backend (see
   session.js), so this list is demo data seeded once; it exists so
   the admin panel has something concrete to browse for phone
   numbers, referral source, and shipping address per customer.
   ============================================================ */
window.MehrabCustomers = (function (store) {
  "use strict";

  const KEY = "customers";

  const SEED = [
    {
      id: "c-1001",
      phone: "09121234567",
      firstName: "سارا",
      lastName: "احمدی",
      joinDate: "2025-11-02",
      lastLogin: "2026-07-10",
      referrer: "google",
      address: "تهران، خیابان ولیعصر، پلاک ۱۲۴، واحد ۳"
    },
    {
      id: "c-1002",
      phone: "09359876543",
      firstName: "امیر",
      lastName: "رضایی",
      joinDate: "2025-12-18",
      lastLogin: "2026-07-13",
      referrer: "direct",
      address: "اصفهان، خیابان چهارباغ بالا، کوچه ۸، پلاک ۵"
    },
    {
      id: "c-1003",
      phone: "09189876123",
      firstName: "نگار",
      lastName: "کریمی",
      joinDate: "2026-01-05",
      lastLogin: "2026-06-29",
      referrer: "google",
      address: "شیراز، بلوار زند، نبش کوچه ۱۴، پلاک ۹"
    },
    {
      id: "c-1004",
      phone: "09301112233",
      firstName: "محمد",
      lastName: "حسینی",
      joinDate: "2026-02-20",
      lastLogin: "2026-07-14",
      referrer: "direct",
      address: "مشهد، بلوار وکیل‌آباد، پلاک ۲۰۱"
    },
    {
      id: "c-1005",
      phone: "09121239988",
      firstName: "مریم",
      lastName: "صادقی",
      joinDate: "2026-04-11",
      lastLogin: "2026-07-01",
      referrer: "google",
      address: "کرج، عظیمیه، خیابان بهاران، پلاک ۴۵"
    }
  ];
  store.seed(KEY, SEED);

  function list() { return store.get(KEY, []); }

  return { list: list };
})(window.MehrabStore);
