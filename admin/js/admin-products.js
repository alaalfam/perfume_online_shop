/* ============================================================
   عطر مهراب — Mehrab Perfume — Admin Panel
   admin-products.js — CRUD for the product catalogue.
   ============================================================ */
(function () {
  "use strict";

  const catalog = window.MehrabCatalog;
  const categories = window.MehrabCategories;
  const admin = window.MehrabAdmin;

  const dom = {
    tbody: document.getElementById("productsTableBody"),
    search: document.getElementById("searchProducts"),
    addBtn: document.getElementById("addProductBtn"),
    modalOverlay: document.getElementById("productModalOverlay"),
    modalTitle: document.getElementById("productModalTitle"),
    modalClose: document.getElementById("productModalClose"),
    cancelBtn: document.getElementById("productCancelBtn"),
    form: document.getElementById("productForm"),
    familySelect: document.getElementById("productFamily"),
    genderSelect: document.getElementById("productGender")
  };

  let searchTerm = "";

  /* ---------- Family/gender dropdowns from the categories store ---------- */
  function populateSelects() {
    dom.familySelect.innerHTML = categories.byType("family").map(function (c) {
      return '<option value="' + c.key + '">' + c.chipLabel + "</option>";
    }).join("");
    dom.genderSelect.innerHTML = categories.byType("gender").map(function (c) {
      return '<option value="' + c.key + '">' + c.chipLabel + "</option>";
    }).join("");
  }

  /* ---------- Table ---------- */
  function render() {
    const term = searchTerm.trim().toLowerCase();
    const list = catalog.all().filter(function (p) { return !term || p.name.toLowerCase().indexOf(term) !== -1; });

    if (!list.length) {
      dom.tbody.innerHTML = '<tr class="admin-empty-row"><td colspan="9">محصولی یافت نشد.</td></tr>';
      return;
    }

    dom.tbody.innerHTML = list.map(function (p) {
      const base = catalog.priceFor(p, p.variants[0].ml);
      return (
        "<tr>" +
          '<td><span class="admin-table-thumb" style="--tint:' + p.tint + '"></span></td>' +
          "<td>" + p.name + "</td>" +
          "<td>" + p.familyLabel + "</td>" +
          "<td>" + p.gender + "</td>" +
          "<td>" + catalog.formatToman(base) + "</td>" +
          "<td>" + p.stock.toLocaleString("fa-IR") + "</td>" +
          "<td>" + (p.discount ? '<span class="admin-badge is-on">' + p.discount + "٪</span>" : '<span class="admin-badge is-off">ندارد</span>') + "</td>" +
          "<td>" + (p.isNew ? '<span class="admin-badge is-on">بله</span>' : '<span class="admin-badge is-off">خیر</span>') + "</td>" +
          '<td><div class="admin-table-actions">' +
            '<button type="button" class="admin-icon-btn" data-edit="' + p.id + '" aria-label="ویرایش">✎</button>' +
            '<button type="button" class="admin-icon-btn is-danger" data-delete="' + p.id + '" aria-label="حذف">🗑</button>' +
          "</div></td>" +
        "</tr>"
      );
    }).join("");
  }

  /* ---------- Modal ---------- */
  function openModal(product) {
    dom.form.reset();
    populateSelects();

    if (product) {
      dom.modalTitle.textContent = "ویرایش محصول";
      document.getElementById("productId").value = product.id;
      document.getElementById("productName").value = product.name;
      dom.familySelect.value = product.family;
      dom.genderSelect.value = product.genderKey;
      document.getElementById("productTint").value = product.tint;
      document.getElementById("productStock").value = product.stock;
      document.getElementById("productDiscount").value = product.discount || 0;
      document.getElementById("productRating").value = product.rating;
      document.getElementById("productIsNew").checked = !!product.isNew;
      product.variants.forEach(function (v) {
        const field = document.getElementById("price" + v.ml);
        if (field) field.value = v.price;
      });
      document.getElementById("noteTop").value = product.notes.top;
      document.getElementById("noteHeart").value = product.notes.heart;
      document.getElementById("noteBase").value = product.notes.base;
      document.getElementById("productDescription").value = product.description;
    } else {
      dom.modalTitle.textContent = "افزودن محصول";
      document.getElementById("productId").value = "";
    }

    dom.modalOverlay.classList.add("is-open");
  }

  function closeModal() {
    dom.modalOverlay.classList.remove("is-open");
  }

  function buildVariants() {
    const variants = [];
    [30, 50, 100].forEach(function (ml) {
      const val = document.getElementById("price" + ml).value;
      if (val !== "") variants.push({ ml: ml, price: parseInt(val, 10) });
    });
    return variants;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const variants = buildVariants();
    if (!variants.length) {
      admin.showToast("حداقل یک حجم با قیمت مشخص کنید.");
      return;
    }

    const family = categories.find("family", dom.familySelect.value);
    const gender = categories.find("gender", dom.genderSelect.value);

    const payload = {
      name: document.getElementById("productName").value.trim(),
      family: dom.familySelect.value,
      familyLabel: family ? family.chipLabel : dom.familySelect.value,
      genderKey: dom.genderSelect.value,
      gender: gender ? gender.chipLabel : dom.genderSelect.value,
      tint: document.getElementById("productTint").value,
      stock: parseInt(document.getElementById("productStock").value, 10),
      discount: parseInt(document.getElementById("productDiscount").value, 10) || 0,
      rating: parseFloat(document.getElementById("productRating").value) || 0,
      isNew: document.getElementById("productIsNew").checked,
      variants: variants,
      notes: {
        top: document.getElementById("noteTop").value.trim(),
        heart: document.getElementById("noteHeart").value.trim(),
        base: document.getElementById("noteBase").value.trim()
      },
      description: document.getElementById("productDescription").value.trim()
    };

    const id = document.getElementById("productId").value;

    if (id) {
      catalog.update(id, payload);
      admin.showToast("محصول به‌روزرسانی شد.");
    } else {
      payload.brandLine = "کالکشن خاص مهراب";
      payload.reviewCount = 0;
      payload.reviews = [];
      catalog.create(payload);
      admin.showToast("محصول جدید اضافه شد.");
    }

    closeModal();
    render();
  }

  function init() {
    populateSelects();
    render();

    dom.addBtn.addEventListener("click", function () { openModal(null); });
    dom.modalClose.addEventListener("click", closeModal);
    dom.cancelBtn.addEventListener("click", closeModal);
    dom.modalOverlay.addEventListener("click", function (event) { if (event.target === dom.modalOverlay) closeModal(); });
    dom.form.addEventListener("submit", handleSubmit);

    dom.search.addEventListener("input", function () {
      searchTerm = dom.search.value;
      render();
    });

    dom.tbody.addEventListener("click", function (event) {
      const editBtn = event.target.closest("[data-edit]");
      const deleteBtn = event.target.closest("[data-delete]");
      if (editBtn) {
        const product = catalog.getById(editBtn.dataset.edit);
        if (product) openModal(product);
      }
      if (deleteBtn) {
        const product = catalog.getById(deleteBtn.dataset.delete);
        if (product && admin.confirmDelete('محصول «' + product.name + '» حذف شود؟')) {
          catalog.remove(deleteBtn.dataset.delete);
          admin.showToast("محصول حذف شد.");
          render();
        }
      }
    });
  }

  init();
})();
