/* ============================================================
   عطر مهراب — Mehrab Perfume — Admin Panel
   admin-categories.js — CRUD for family/gender categories.
   ============================================================ */
(function () {
  "use strict";

  const categories = window.MehrabCategories;
  const admin = window.MehrabAdmin;

  const dom = {
    tbody: document.getElementById("categoriesTableBody"),
    addBtn: document.getElementById("addCategoryBtn"),
    modalOverlay: document.getElementById("categoryModalOverlay"),
    modalTitle: document.getElementById("categoryModalTitle"),
    modalClose: document.getElementById("categoryModalClose"),
    cancelBtn: document.getElementById("categoryCancelBtn"),
    form: document.getElementById("categoryForm")
  };

  const TYPE_LABEL = { family: "خانواده رایحه", gender: "جنسیت" };

  function render() {
    const list = categories.all();
    if (!list.length) {
      dom.tbody.innerHTML = '<tr class="admin-empty-row"><td colspan="6">دسته‌بندی‌ای ثبت نشده است.</td></tr>';
      return;
    }
    dom.tbody.innerHTML = list.map(function (c) {
      return (
        "<tr>" +
          "<td style='font-size:1.2rem'>" + c.icon + "</td>" +
          "<td>" + c.chipLabel + "</td>" +
          "<td>" + (TYPE_LABEL[c.type] || c.type) + "</td>" +
          "<td style='direction:ltr;text-align:right'>" + c.key + "</td>" +
          "<td>" + c.pageTitle + "</td>" +
          '<td><div class="admin-table-actions">' +
            '<button type="button" class="admin-icon-btn" data-edit="' + c.type + '|' + c.key + '" aria-label="ویرایش">✎</button>' +
            '<button type="button" class="admin-icon-btn is-danger" data-delete="' + c.type + '|' + c.key + '" aria-label="حذف">🗑</button>' +
          "</div></td>" +
        "</tr>"
      );
    }).join("");
  }

  function openModal(cat) {
    dom.form.reset();
    if (cat) {
      dom.modalTitle.textContent = "ویرایش دسته‌بندی";
      document.getElementById("categoryOrigType").value = cat.type;
      document.getElementById("categoryOrigKey").value = cat.key;
      document.getElementById("categoryType").value = cat.type;
      document.getElementById("categoryIcon").value = cat.icon;
      document.getElementById("categoryKey").value = cat.key;
      document.getElementById("categoryChipLabel").value = cat.chipLabel;
      document.getElementById("categoryPageTitle").value = cat.pageTitle;
      document.getElementById("categoryPageDesc").value = cat.pageDesc;
    } else {
      dom.modalTitle.textContent = "افزودن دسته‌بندی";
      document.getElementById("categoryOrigType").value = "";
      document.getElementById("categoryOrigKey").value = "";
    }
    dom.modalOverlay.classList.add("is-open");
  }

  function closeModal() { dom.modalOverlay.classList.remove("is-open"); }

  function handleSubmit(event) {
    event.preventDefault();
    const origType = document.getElementById("categoryOrigType").value;
    const origKey = document.getElementById("categoryOrigKey").value;

    const payload = {
      type: document.getElementById("categoryType").value,
      icon: document.getElementById("categoryIcon").value.trim() || "◆",
      key: document.getElementById("categoryKey").value.trim(),
      chipLabel: document.getElementById("categoryChipLabel").value.trim(),
      pageTitle: document.getElementById("categoryPageTitle").value.trim(),
      pageDesc: document.getElementById("categoryPageDesc").value.trim()
    };

    if (origType && origKey) {
      categories.update(origType, origKey, payload);
      admin.showToast("دسته‌بندی به‌روزرسانی شد.");
    } else {
      if (!payload.key) delete payload.key;
      categories.create(payload);
      admin.showToast("دسته‌بندی جدید اضافه شد.");
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
        const parts = editBtn.dataset.edit.split("|");
        const cat = categories.find(parts[0], parts[1]);
        if (cat) openModal(cat);
      }
      if (deleteBtn) {
        const parts = deleteBtn.dataset.delete.split("|");
        const cat = categories.find(parts[0], parts[1]);
        if (cat && admin.confirmDelete('دسته‌بندی «' + cat.chipLabel + '» حذف شود؟ محصولات این دسته دیگر در فیلترها ظاهر نمی‌شوند.')) {
          categories.remove(parts[0], parts[1]);
          admin.showToast("دسته‌بندی حذف شد.");
          render();
        }
      }
    });
  }

  init();
})();
