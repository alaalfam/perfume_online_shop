/* ============================================================
   عطر مهراب — Mehrab Perfume — Admin Panel
   admin-articles.js — CRUD for the journal articles.
   ============================================================ */
(function () {
  "use strict";

  const articles = window.MehrabArticles;
  const admin = window.MehrabAdmin;

  const dom = {
    tbody: document.getElementById("articlesTableBody"),
    search: document.getElementById("searchArticles"),
    addBtn: document.getElementById("addArticleBtn"),
    modalOverlay: document.getElementById("articleModalOverlay"),
    modalTitle: document.getElementById("articleModalTitle"),
    modalClose: document.getElementById("articleModalClose"),
    cancelBtn: document.getElementById("articleCancelBtn"),
    form: document.getElementById("articleForm")
  };

  let searchTerm = "";

  function render() {
    const term = searchTerm.trim().toLowerCase();
    const list = articles.all().filter(function (a) { return !term || a.title.toLowerCase().indexOf(term) !== -1; });

    if (!list.length) {
      dom.tbody.innerHTML = '<tr class="admin-empty-row"><td colspan="5">مقاله‌ای یافت نشد.</td></tr>';
      return;
    }

    dom.tbody.innerHTML = list.map(function (a) {
      return (
        "<tr>" +
          "<td data-label='عنوان'>" + a.title + "</td>" +
          "<td data-label='دسته‌بندی'>" + a.category + "</td>" +
          "<td data-label='تاریخ'>" + a.date + "</td>" +
          "<td data-label='زمان مطالعه'>" + a.readMinutes.toLocaleString("fa-IR") + " دقیقه</td>" +
          '<td><div class="admin-table-actions">' +
            '<button type="button" class="admin-icon-btn" data-edit="' + a.slug + '" aria-label="ویرایش">✎</button>' +
            '<button type="button" class="admin-icon-btn is-danger" data-delete="' + a.slug + '" aria-label="حذف">🗑</button>' +
          "</div></td>" +
        "</tr>"
      );
    }).join("");
  }

  /* ---------- File upload → textarea helper ---------- */
  function wireFileToTextarea(fileInputId, textareaId) {
    const fileInput = document.getElementById(fileInputId);
    const textarea = document.getElementById(textareaId);
    if (!fileInput || !textarea) return;
    fileInput.addEventListener("change", function () {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function () { textarea.value = reader.result; };
      reader.onerror = function () { admin.showToast("خواندن فایل با خطا مواجه شد."); };
      reader.readAsText(file);
    });
  }

  function openModal(article) {
    dom.form.reset();
    if (article) {
      dom.modalTitle.textContent = "ویرایش مقاله";
      document.getElementById("articleOrigSlug").value = article.slug;
      document.getElementById("articleTitleInput").value = article.title;
      document.getElementById("articleCategoryInput").value = article.category;
      document.getElementById("articleReadMinutes").value = article.readMinutes;
      document.getElementById("articleTint").value = article.tint;
      document.getElementById("articleExcerpt").value = article.excerpt;
      document.getElementById("articleSeoTitleInput").value = article.seoTitle || "";
      document.getElementById("articleSeoDescInput").value = article.seoDescription || "";
      document.getElementById("articleBody").value = (article.body || []).join("\n");
      document.getElementById("articleHtmlInput").value = article.customHtml || "";
      document.getElementById("articleCssInput").value = article.customCss || "";
      document.getElementById("articleJsInput").value = article.customJs || "";
    } else {
      dom.modalTitle.textContent = "افزودن مقاله";
      document.getElementById("articleOrigSlug").value = "";
    }
    dom.modalOverlay.classList.add("is-open");
  }

  function closeModal() { dom.modalOverlay.classList.remove("is-open"); }

  function handleSubmit(event) {
    event.preventDefault();

    const bodyText = document.getElementById("articleBody").value.trim();
    const bodyParagraphs = bodyText.split("\n").map(function (p) { return p.trim(); }).filter(Boolean);
    const customHtml = document.getElementById("articleHtmlInput").value;

    if (!bodyParagraphs.length && !customHtml.trim()) {
      admin.showToast("متن ساده یا کد HTML سفارشی مقاله را وارد کنید.");
      return;
    }

    const payload = {
      title: document.getElementById("articleTitleInput").value.trim(),
      category: document.getElementById("articleCategoryInput").value.trim(),
      readMinutes: parseInt(document.getElementById("articleReadMinutes").value, 10) || 1,
      tint: document.getElementById("articleTint").value,
      excerpt: document.getElementById("articleExcerpt").value.trim(),
      seoTitle: document.getElementById("articleSeoTitleInput").value.trim(),
      seoDescription: document.getElementById("articleSeoDescInput").value.trim(),
      body: bodyParagraphs,
      customHtml: customHtml,
      customCss: document.getElementById("articleCssInput").value,
      customJs: document.getElementById("articleJsInput").value
    };

    const origSlug = document.getElementById("articleOrigSlug").value;

    if (origSlug) {
      articles.update(origSlug, payload);
      admin.showToast("مقاله به‌روزرسانی شد.");
    } else {
      articles.create(payload);
      admin.showToast("مقاله جدید اضافه شد.");
    }

    closeModal();
    render();
  }

  function init() {
    render();
    wireFileToTextarea("articleHtmlFile", "articleHtmlInput");
    wireFileToTextarea("articleCssFile", "articleCssInput");
    wireFileToTextarea("articleJsFile", "articleJsInput");

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
        const article = articles.getBySlug(editBtn.dataset.edit);
        if (article) openModal(article);
      }
      if (deleteBtn) {
        const article = articles.getBySlug(deleteBtn.dataset.delete);
        if (article && admin.confirmDelete('مقاله «' + article.title + '» حذف شود؟')) {
          articles.remove(deleteBtn.dataset.delete);
          admin.showToast("مقاله حذف شد.");
          render();
        }
      }
    });
  }

  init();
})();
