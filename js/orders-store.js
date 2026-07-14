/* ============================================================
   عطر مهراب — Mehrab Perfume
   orders-store.js — real orders created through checkout (see the
   confirm-checkout handler in main.js), plus abandoned-cart
   tracking. Two related but distinct concerns in one file:

   MehrabOrdersStore   — orders once someone completes checkout.
   MehrabAbandonedCarts — a live snapshot of the current browser's
     cart while it has items and hasn't been checked out, plus a
     couple of seeded historical examples so the admin table isn't
     empty on first load. There's no real multi-user backend here,
     so "abandoned cart" honestly means "this browser's cart right
     now" rather than a cross-session customer history — the admin
     page label reflects that.
   ============================================================ */
window.MehrabOrdersStore = (function (store) {
  "use strict";

  const KEY = "orders";

  const STATUS = {
    PENDING: "pending",
    PREPARING: "preparing",
    SHIPPING: "shipping",
    DELIVERED: "delivered"
  };

  const STATUS_LABELS = {
    pending: "تایید نشده",
    preparing: "در حال آماده‌سازی",
    shipping: "در حال ارسال",
    delivered: "تحویل داده شده"
  };

  const STATUS_ORDER = [STATUS.PENDING, STATUS.PREPARING, STATUS.SHIPPING, STATUS.DELIVERED];

  const SEED = [
    {
      id: "MHR-10234", createdAt: "2026-06-28T10:15:00.000Z", customerPhone: "09121234567",
      customerName: "امیرحسین رضایی", customerAddress: "تهران، خیابان ولیعصر، پلاک ۱۲، واحد ۳",
      items: [
        { productId: "oud-e-soltani", name: "عود سلطانی", ml: 50, qty: 1, unitPrice: 3160000 },
        { productId: "zar-o-anbar", name: "زر و عنبر", ml: 30, qty: 1, unitPrice: 2150000 }
      ],
      shippingMethodName: "پست پیشتاز", shippingCost: 0,
      paymentMethod: "gateway", paymentMethodLabel: "درگاه پرداخت زرین‌پال",
      couponCode: null, subtotal: 5310000, discount: 0, total: 5310000,
      status: "shipping", paid: true
    },
    {
      id: "MHR-10199", createdAt: "2026-06-20T14:40:00.000Z", customerPhone: "09351112233",
      customerName: "نگار صادقی", customerAddress: "شیراز، بلوار زند، کوچه ۸، پلاک ۲۴",
      items: [{ productId: "yas-e-shabaneh", name: "یاس شبانه", ml: 50, qty: 2, unitPrice: 2385000 }],
      shippingMethodName: "تیپاکس", shippingCost: 150000,
      paymentMethod: "card", paymentMethodLabel: "کارت‌به‌کارت",
      couponCode: "MEHRAB10", discount: 530000, subtotal: 4770000, total: 4390000,
      status: "delivered", paid: true
    },
    {
      id: "MHR-10301", createdAt: "2026-07-10T09:05:00.000Z", customerPhone: "09190009988",
      customerName: "بابک سلطانی", customerAddress: "اصفهان، خیابان چهارباغ بالا، پلاک ۵۵",
      items: [{ productId: "kahkeshan-e-kahroba", name: "کهکشان کهربا", ml: 30, qty: 1, unitPrice: 2350000 }],
      shippingMethodName: "پست پیشتاز", shippingCost: 0,
      paymentMethod: "gateway", paymentMethodLabel: "درگاه پرداخت زرین‌پال",
      couponCode: null, subtotal: 2350000, discount: 0, total: 2350000,
      status: "preparing", paid: true
    },
    {
      id: "MHR-10345", createdAt: "2026-07-13T18:22:00.000Z", customerPhone: "09121112233",
      customerName: "پریسا گلستانی", customerAddress: "تهران، سعادت‌آباد، خیابان علامه شمالی، پلاک ۹",
      items: [
        { productId: "golab-o-zafaran", name: "گلاب و زعفران", ml: 50, qty: 1, unitPrice: 2850000 },
        { productId: "baran-e-bahar", name: "باران بهار", ml: 30, qty: 1, unitPrice: 1650000 }
      ],
      shippingMethodName: "پست پیشتاز", shippingCost: 0,
      paymentMethod: "card", paymentMethodLabel: "کارت‌به‌کارت",
      couponCode: null, subtotal: 4500000, discount: 0, total: 4500000,
      status: "pending", paid: false
    }
  ];

  store.seed(KEY, SEED);

  function all() {
    return store.get(KEY, []).slice().sort(function (a, b) { return b.createdAt.localeCompare(a.createdAt); });
  }

  function getById(id) {
    return store.get(KEY, []).find(function (o) { return o.id === id; }) || null;
  }

  function generateOrderNumber() {
    const list = store.get(KEY, []);
    const nums = list.map(function (o) {
      const m = /MHR-(\d+)/.exec(o.id);
      return m ? parseInt(m[1], 10) : 10000;
    });
    const next = (nums.length ? Math.max.apply(null, nums) : 10000) + 1;
    return "MHR-" + next;
  }

  /* Called from the real checkout flow in main.js once someone
     confirms their order — this is the one place a "pending" order
     actually gets created, as opposed to the seeded demo rows above. */
  function create(order) {
    const list = store.get(KEY, []);
    if (!order.id) order.id = generateOrderNumber();
    if (!order.createdAt) order.createdAt = new Date().toISOString();
    if (!order.status) order.status = STATUS.PENDING;
    if (order.paid === undefined) order.paid = false;
    list.push(order);
    store.set(KEY, list);
    return order;
  }

  function updateStatus(id, status) {
    const list = store.get(KEY, []);
    const idx = list.findIndex(function (o) { return o.id === id; });
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], { status: status });
    store.set(KEY, list);
    return list[idx];
  }

  function updatePaid(id, paid) {
    const list = store.get(KEY, []);
    const idx = list.findIndex(function (o) { return o.id === id; });
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], { paid: paid });
    store.set(KEY, list);
    return list[idx];
  }

  return {
    STATUS: STATUS, STATUS_LABELS: STATUS_LABELS, STATUS_ORDER: STATUS_ORDER,
    all: all, getById: getById, create: create,
    updateStatus: updateStatus, updatePaid: updatePaid
  };
})(window.MehrabStore);


window.MehrabAbandonedCarts = (function (store) {
  "use strict";

  const KEY = "abandoned_carts";
  const LIVE_ID = "live";

  /* A couple of plausible historical examples so the admin table
     has content on first load, same convention as the demo orders
     above and the demo data in orders.js used by track-order.html. */
  const SEED = [
    {
      id: "cart-demo-1", isLive: false, customerPhone: "09123334455",
      items: [{ productId: "shab-e-mehrab", name: "شب مهراب", ml: 50, qty: 1, unitPrice: 2933000 }],
      total: 2933000, updatedAt: "2026-07-09T11:20:00.000Z"
    },
    {
      id: "cart-demo-2", isLive: false, customerPhone: "مهمان",
      items: [
        { productId: "nasim-e-yasaman", name: "نسیم یاسمن", ml: 30, qty: 1, unitPrice: 2050000 },
        { productId: "baran-e-bahar", name: "باران بهار", ml: 30, qty: 1, unitPrice: 1650000 }
      ],
      total: 3700000, updatedAt: "2026-07-12T16:45:00.000Z"
    }
  ];
  store.seed(KEY, SEED);

  function all() {
    return store.get(KEY, []).slice().sort(function (a, b) { return b.updatedAt.localeCompare(a.updatedAt); });
  }

  /* Called whenever the live cart changes (see main.js). Keeps a
     single "live" entry in sync with whatever is actually in this
     browser's cart right now — replaced on every change, not
     accumulated, since it's one ongoing session, not a history. */
  function syncLive(lines, total, customerPhone) {
    const list = store.get(KEY, []).filter(function (c) { return c.id !== LIVE_ID; });
    if (lines.length) {
      list.push({
        id: LIVE_ID,
        isLive: true,
        customerPhone: customerPhone || "مهمان",
        items: lines.map(function (l) {
          return { productId: l.id, name: l.product.name, ml: l.ml, qty: l.qty, unitPrice: l.unitPrice };
        }),
        total: total,
        updatedAt: new Date().toISOString()
      });
    }
    store.set(KEY, list);
  }

  /* Called once an order is actually placed from this cart — it's
     no longer "abandoned", it converted, so the live entry clears. */
  function clearLive() {
    const list = store.get(KEY, []).filter(function (c) { return c.id !== LIVE_ID; });
    store.set(KEY, list);
  }

  return { all: all, syncLive: syncLive, clearLive: clearLive };
})(window.MehrabStore);
