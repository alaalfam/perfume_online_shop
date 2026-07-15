/* ============================================================
   عطر مهراب — Mehrab Perfume — Admin Panel
   admin-settings.js — banner, payment method, shipping methods,
   and trust badges/licenses.
   ============================================================ */
(function () {
  "use strict";

  const settings = window.MehrabSiteSettings;
  const admin = window.MehrabAdmin;

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

  /* ---------- Banner ---------- */
  function initBanner() {
    const b = settings.getBanner();
    document.getElementById("bannerEyebrowInput").value = b.eyebrow;
    document.getElementById("bannerTitle1Input").value = b.title1;
    document.getElementById("bannerTitle2Input").value = b.title2;
    document.getElementById("bannerLedeInput").value = b.lede;
    document.getElementById("bannerCtaLabelInput").value = b.ctaLabel;
    document.getElementById("bannerCtaHrefInput").value = b.ctaHref;
    document.getElementById("bannerSecondaryLabelInput").value = b.secondaryLabel;
    document.getElementById("bannerSecondaryHrefInput").value = b.secondaryHref;
    document.getElementById("bannerTintInput").value = b.tint;

    document.getElementById("bannerForm").addEventListener("submit", function (event) {
      event.preventDefault();
      settings.updateBanner({
        eyebrow: document.getElementById("bannerEyebrowInput").value.trim(),
        title1: document.getElementById("bannerTitle1Input").value.trim(),
        title2: document.getElementById("bannerTitle2Input").value.trim(),
        lede: document.getElementById("bannerLedeInput").value.trim(),
        ctaLabel: document.getElementById("bannerCtaLabelInput").value.trim(),
        ctaHref: document.getElementById("bannerCtaHrefInput").value.trim(),
        secondaryLabel: document.getElementById("bannerSecondaryLabelInput").value.trim(),
        secondaryHref: document.getElementById("bannerSecondaryHrefInput").value.trim(),
        tint: document.getElementById("bannerTintInput").value
      });
      admin.showToast("بنر صفحه اصلی ذخیره شد.");
    });
  }

  /* ---------- Payment ---------- */
  function initPayment() {
    const p = settings.getPayment();
    document.getElementById("paymentMethodSelect").value = p.method;
    document.getElementById("gatewayNameInput").value = p.gatewayName;
    document.getElementById("bankNameInput").value = p.bankName;
    document.getElementById("cardHolderInput").value = p.cardHolder;
    document.getElementById("cardNumberInput").value = p.cardNumber;
    document.getElementById("ibanInput").value = p.iban;

    document.getElementById("paymentForm").addEventListener("submit", function (event) {
      event.preventDefault();
      settings.updatePayment({
        method: document.getElementById("paymentMethodSelect").value,
        gatewayName: document.getElementById("gatewayNameInput").value.trim(),
        bankName: document.getElementById("bankNameInput").value.trim(),
        cardHolder: document.getElementById("cardHolderInput").value.trim(),
        cardNumber: document.getElementById("cardNumberInput").value.trim(),
        iban: document.getElementById("ibanInput").value.trim()
      });
      admin.showToast("تنظیمات پرداخت ذخیره شد.");
    });
  }

  /* ---------- Shipping ---------- */
  const shippingModal = {
    overlay: document.getElementById("shippingModalOverlay"),
    title: document.getElementById("shippingModalTitle"),
    form: document.getElementById("shippingForm")
  };

  function renderShipping() {
    const tbody = document.getElementById("shippingTableBody");
    const list = settings.getShippingMethods();
    if (!list.length) {
      tbody.innerHTML = '<tr class="admin-empty-row"><td colspan="5">روش ارسالی ثبت نشده است.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(function (m) {
      return (
        "<tr>" +
          "<td data-label='نام'>" + m.name + "</td>" +
          "<td data-label='هزینه'>" + (m.price > 0 ? m.price.toLocaleString("fa-IR") + " تومان" : "رایگان") + "</td>" +
          "<td data-label='زمان تحویل'>" + m.etaDays + "</td>" +
          "<td data-label='فعال'>" + (m.active ? '<span class="admin-badge is-on">فعال</span>' : '<span class="admin-badge is-off">غیرفعال</span>') + "</td>" +
          '<td><div class="admin-table-actions">' +
            '<button type="button" class="admin-icon-btn" data-edit-shipping="' + m.id + '" aria-label="ویرایش">✎</button>' +
            '<button type="button" class="admin-icon-btn is-danger" data-delete-shipping="' + m.id + '" aria-label="حذف">🗑</button>' +
          "</div></td>" +
        "</tr>"
      );
    }).join("");
  }

  function openShippingModal(method) {
    shippingModal.form.reset();
    if (method) {
      shippingModal.title.textContent = "ویرایش روش ارسال";
      document.getElementById("shippingOrigId").value = method.id;
      document.getElementById("shippingNameInput").value = method.name;
      document.getElementById("shippingPriceInput").value = method.price;
      document.getElementById("shippingEtaInput").value = method.etaDays;
      document.getElementById("shippingActiveInput").checked = !!method.active;
    } else {
      shippingModal.title.textContent = "افزودن روش ارسال";
      document.getElementById("shippingOrigId").value = "";
      document.getElementById("shippingActiveInput").checked = true;
    }
    shippingModal.overlay.classList.add("is-open");
  }
  function closeShippingModal() { shippingModal.overlay.classList.remove("is-open"); }

  function initShipping() {
    renderShipping();

    document.getElementById("addShippingBtn").addEventListener("click", function () { openShippingModal(null); });
    document.getElementById("shippingModalClose").addEventListener("click", closeShippingModal);
    document.getElementById("shippingCancelBtn").addEventListener("click", closeShippingModal);
    shippingModal.overlay.addEventListener("click", function (event) { if (event.target === shippingModal.overlay) closeShippingModal(); });

    shippingModal.form.addEventListener("submit", function (event) {
      event.preventDefault();
      const origId = document.getElementById("shippingOrigId").value;
      const payload = {
        name: document.getElementById("shippingNameInput").value.trim(),
        price: parseInt(document.getElementById("shippingPriceInput").value, 10) || 0,
        etaDays: document.getElementById("shippingEtaInput").value.trim(),
        active: document.getElementById("shippingActiveInput").checked
      };
      if (origId) {
        settings.updateShippingMethod(origId, payload);
        admin.showToast("روش ارسال به‌روزرسانی شد.");
      } else {
        settings.addShippingMethod(payload);
        admin.showToast("روش ارسال جدید اضافه شد.");
      }
      closeShippingModal();
      renderShipping();
    });

    document.getElementById("shippingTableBody").addEventListener("click", function (event) {
      const editBtn = event.target.closest("[data-edit-shipping]");
      const deleteBtn = event.target.closest("[data-delete-shipping]");
      if (editBtn) {
        const method = settings.getShippingMethods().find(function (m) { return m.id === editBtn.dataset.editShipping; });
        if (method) openShippingModal(method);
      }
      if (deleteBtn) {
        if (admin.confirmDelete("این روش ارسال حذف شود؟")) {
          settings.removeShippingMethod(deleteBtn.dataset.deleteShipping);
          admin.showToast("روش ارسال حذف شد.");
          renderShipping();
        }
      }
    });
  }

  /* ---------- Trust badges ---------- */
  const trustModal = {
    overlay: document.getElementById("trustModalOverlay"),
    title: document.getElementById("trustModalTitle"),
    form: document.getElementById("trustForm")
  };

  function renderTrust() {
    const tbody = document.getElementById("trustTableBody");
    const list = settings.getTrustBadges();
    if (!list.length) {
      tbody.innerHTML = '<tr class="admin-empty-row"><td colspan="4">نمادی ثبت نشده است.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(function (b) {
      return (
        "<tr>" +
          "<td data-label='نام نماد'>" + b.name + "</td>" +
          "<td data-label='یادداشت' style='color:var(--ink-soft)'>" + (b.note || "—") + "</td>" +
          "<td data-label='فعال'>" + (b.active ? '<span class="admin-badge is-on">فعال</span>' : '<span class="admin-badge is-off">غیرفعال</span>') + "</td>" +
          '<td><div class="admin-table-actions">' +
            '<button type="button" class="admin-icon-btn" data-edit-trust="' + b.id + '" aria-label="ویرایش">✎</button>' +
            '<button type="button" class="admin-icon-btn is-danger" data-delete-trust="' + b.id + '" aria-label="حذف">🗑</button>' +
          "</div></td>" +
        "</tr>"
      );
    }).join("");
  }

  function openTrustModal(badge) {
    trustModal.form.reset();
    if (badge) {
      trustModal.title.textContent = "ویرایش نماد";
      document.getElementById("trustOrigId").value = badge.id;
      document.getElementById("trustNameInput").value = badge.name;
      document.getElementById("trustNoteInput").value = badge.note || "";
      document.getElementById("trustActiveInput").checked = !!badge.active;
    } else {
      trustModal.title.textContent = "افزودن نماد";
      document.getElementById("trustOrigId").value = "";
    }
    trustModal.overlay.classList.add("is-open");
  }
  function closeTrustModal() { trustModal.overlay.classList.remove("is-open"); }

  function initTrust() {
    renderTrust();

    document.getElementById("addTrustBtn").addEventListener("click", function () { openTrustModal(null); });
    document.getElementById("trustModalClose").addEventListener("click", closeTrustModal);
    document.getElementById("trustCancelBtn").addEventListener("click", closeTrustModal);
    trustModal.overlay.addEventListener("click", function (event) { if (event.target === trustModal.overlay) closeTrustModal(); });

    trustModal.form.addEventListener("submit", function (event) {
      event.preventDefault();
      const origId = document.getElementById("trustOrigId").value;
      const payload = {
        name: document.getElementById("trustNameInput").value.trim(),
        note: document.getElementById("trustNoteInput").value.trim(),
        active: document.getElementById("trustActiveInput").checked
      };
      if (origId) {
        settings.updateTrustBadge(origId, payload);
        admin.showToast("نماد به‌روزرسانی شد.");
      } else {
        settings.addTrustBadge(payload);
        admin.showToast("نماد جدید اضافه شد.");
      }
      closeTrustModal();
      renderTrust();
    });

    document.getElementById("trustTableBody").addEventListener("click", function (event) {
      const editBtn = event.target.closest("[data-edit-trust]");
      const deleteBtn = event.target.closest("[data-delete-trust]");
      if (editBtn) {
        const badge = settings.getTrustBadges().find(function (b) { return b.id === editBtn.dataset.editTrust; });
        if (badge) openTrustModal(badge);
      }
      if (deleteBtn) {
        if (admin.confirmDelete("این نماد حذف شود؟")) {
          settings.removeTrustBadge(deleteBtn.dataset.deleteTrust);
          admin.showToast("نماد حذف شد.");
          renderTrust();
        }
      }
    });
  }

  initTabs();
  initBanner();
  initPayment();
  initShipping();
  initTrust();
})();
