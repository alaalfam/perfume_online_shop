/* ============================================================
   عطر مهراب — Mehrab Perfume — Admin Panel
   admin-coupons.js — CRUD for discount codes.
   ============================================================ */
(function () {
  "use strict";

  const coupons = window.MehrabCoupons;
  const admin = window.MehrabAdmin;

  const dom = {
    tbody: document.getElementById("couponsTableBody"),
    addBtn: document.getElementById("addCouponBtn"),
    modalOverlay: document.getElementById("couponModalOverlay"),
    modalTitle: document.getElementById("couponModalTitle"),
    modalClose: document.getElementById("couponModalClose"),
    cancelBtn: document.getElementById("couponCancelBtn"),
    form: document.getElementById("couponForm")
  };

  function formatValue(c) {
    return c.type === "percent" ? c.value.toLocaleString("fa-IR") + "٪" : c.value.toLocaleString("fa-IR") + " تومان";
  }

  function render() {
    const list = coupons.list();
    if (!list.length) {
      dom.tbody.innerHTML = '<tr class="admin-empty-row"><td colspan="6">کد تخفیفی ثبت نشده است.</td></tr>';
      return;
    }
    dom.tbody.innerHTML = list.map(function (c) {
      return (
        "<tr>" +
          "<td data-label='کد' style='direction:ltr;text-align:right;font-weight:700'>" + c.code + "</td>" +
          "<td data-label='نوع'>" + (c.type === "percent" ? "درصدی" : "مبلغ ثابت") + "</td>" +
          "<td data-label='مقدار'>" + formatValue(c) + "</td>" +
          "<td data-label='برچسب'>" + c.label + "</td>" +
          "<td data-label='وضعیت'>" + (c.active ? '<span class="admin-badge is-on">فعال</span>' : '<span class="admin-badge is-off">غیرفعال</span>') + "</td>" +
          '<td><div class="admin-table-actions">' +
            '<button type="button" class="admin-icon-btn" data-edit="' + c.code + '" aria-label="ویرایش">✎</button>' +
            '<button type="button" class="admin-icon-btn is-danger" data-delete="' + c.code + '" aria-label="حذف">🗑</button>' +
          "</div></td>" +
        "</tr>"
      );
    }).join("");
  }

  function openModal(coupon) {
    dom.form.reset();
    if (coupon) {
      dom.modalTitle.textContent = "ویرایش کد تخفیف";
      document.getElementById("couponOrigCode").value = coupon.code;
      document.getElementById("couponCode").value = coupon.code;
      document.getElementById("couponType").value = coupon.type;
      document.getElementById("couponValue").value = coupon.value;
      document.getElementById("couponLabel").value = coupon.label;
      document.getElementById("couponActive").checked = coupon.active !== false;
    } else {
      dom.modalTitle.textContent = "افزودن کد تخفیف";
      document.getElementById("couponOrigCode").value = "";
      document.getElementById("couponActive").checked = true;
    }
    dom.modalOverlay.classList.add("is-open");
  }

  function closeModal() { dom.modalOverlay.classList.remove("is-open"); }

  function handleSubmit(event) {
    event.preventDefault();
    const origCode = document.getElementById("couponOrigCode").value;
    const code = document.getElementById("couponCode").value.trim().toUpperCase();

    if (!origCode && coupons.list().some(function (c) { return c.code === code; })) {
      admin.showToast("این کد از قبل وجود دارد.");
      return;
    }

    const payload = {
      code: code,
      type: document.getElementById("couponType").value,
      value: parseInt(document.getElementById("couponValue").value, 10),
      label: document.getElementById("couponLabel").value.trim(),
      active: document.getElementById("couponActive").checked
    };

    if (origCode) {
      coupons.update(origCode, payload);
      admin.showToast("کد تخفیف به‌روزرسانی شد.");
    } else {
      coupons.create(payload);
      admin.showToast("کد تخفیف جدید اضافه شد.");
    }

    closeModal();
    render();
  }

  function init() {
    render();

    dom.addBtn.addEventListener("click", function () { openModal(null); });
    dom.modalClose.addEventListener("click", closeModal);
    dom.cancelBtn.addEventListener("click", closeModal);
    dom.modalOverlay.addEventListener("click", function (event) { if (event.target === dom.modalOverlay) closeModal(); });
    dom.form.addEventListener("submit", handleSubmit);

    dom.tbody.addEventListener("click", function (event) {
      const editBtn = event.target.closest("[data-edit]");
      const deleteBtn = event.target.closest("[data-delete]");
      if (editBtn) {
        const coupon = coupons.list().find(function (c) { return c.code === editBtn.dataset.edit; });
        if (coupon) openModal(coupon);
      }
      if (deleteBtn) {
        if (admin.confirmDelete('کد «' + deleteBtn.dataset.delete + '» حذف شود؟')) {
          coupons.remove(deleteBtn.dataset.delete);
          admin.showToast("کد تخفیف حذف شد.");
          render();
        }
      }
    });
  }

  init();
})();
