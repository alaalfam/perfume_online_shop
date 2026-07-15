/* ============================================================
   عطر مهراب — Mehrab Perfume — Admin Panel
   admin-pages.js — nav visibility/order, static page content
   (about/contact), and custom page CRUD.
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

  /* ---------- Nav visibility / order ---------- */
  function renderNavTable() {
    const tbody = document.getElementById("navTableBody");
    const items = settings.getNav();
    tbody.innerHTML = items.map(function (item, i) {
      return (
        "<tr>" +
          "<td data-label='عنوان'>" + item.label + "</td>" +
          "<td data-label='لینک' style='color:var(--ink-soft)'>" + (item.href || "دراپ‌داون") + "</td>" +
          '<td data-label="ترتیب"><div class="admin-table-actions">' +
            '<button type="button" class="admin-icon-btn" data-move-up="' + item.key + '"' + (i === 0 ? " disabled" : "") + ' aria-label="بالا">↑</button>' +
            '<button type="button" class="admin-icon-btn" data-move-down="' + item.key + '"' + (i === items.length - 1 ? " disabled" : "") + ' aria-label="پایین">↓</button>' +
          "</div></td>" +
          "<td data-label='نمایش در تب بار'><label class='admin-checkbox-row'><input type='checkbox' data-toggle-visible='" + item.key + "'" + (item.visible !== false ? " checked" : "") + " /></label></td>" +
        "</tr>"
      );
    }).join("");
  }

  function initNavTable() {
    renderNavTable();
    const tbody = document.getElementById("navTableBody");

    tbody.addEventListener("change", function (event) {
      const toggle = event.target.closest("[data-toggle-visible]");
      if (!toggle) return;
      settings.updateNavItem(toggle.dataset.toggleVisible, { visible: toggle.checked });
      admin.showToast("وضعیت نمایش به‌روزرسانی شد.");
    });

    tbody.addEventListener("click", function (event) {
      const up = event.target.closest("[data-move-up]");
      const down = event.target.closest("[data-move-down]");
      if (!up && !down) return;

      const items = settings.getNav().map(function (n) { return n.key; });
      const key = up ? up.dataset.moveUp : down.dataset.moveDown;
      const idx = items.indexOf(key);
      const swapWith = up ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= items.length) return;

      const tmp = items[idx];
      items[idx] = items[swapWith];
      items[swapWith] = tmp;
      settings.reorderNav(items);
      renderNavTable();
    });
  }

  /* ---------- Page content ---------- */
  function initPageContent() {
    const about = settings.getPageContent("about");
    document.getElementById("aboutHeadingInput").value = about.heading;
    document.getElementById("aboutParagraphsInput").value = (about.paragraphs || []).join("\n");

    document.getElementById("aboutContentForm").addEventListener("submit", function (event) {
      event.preventDefault();
      const paragraphs = document.getElementById("aboutParagraphsInput").value
        .split("\n").map(function (p) { return p.trim(); }).filter(Boolean);
      settings.updatePageContent("about", {
        heading: document.getElementById("aboutHeadingInput").value.trim(),
        paragraphs: paragraphs
      });
      admin.showToast("محتوای صفحه درباره ما ذخیره شد.");
    });

    const contact = settings.getPageContent("contact");
    document.getElementById("contactPhoneInput").value = contact.phone;
    document.getElementById("contactEmailInput").value = contact.email;
    document.getElementById("contactAddressInput").value = contact.address;
    document.getElementById("contactHoursInput").value = contact.hours;

    document.getElementById("contactContentForm").addEventListener("submit", function (event) {
      event.preventDefault();
      settings.updatePageContent("contact", {
        phone: document.getElementById("contactPhoneInput").value.trim(),
        email: document.getElementById("contactEmailInput").value.trim(),
        address: document.getElementById("contactAddressInput").value.trim(),
        hours: document.getElementById("contactHoursInput").value.trim()
      });
      admin.showToast("اطلاعات تماس ذخیره شد.");
    });
  }

  /* ---------- Custom pages ---------- */
  const pageModal = {
    overlay: document.getElementById("pageModalOverlay"),
    title: document.getElementById("pageModalTitle"),
    form: document.getElementById("customPageForm")
  };

  function renderCustomPages() {
    const tbody = document.getElementById("customPagesTableBody");
    const list = settings.getCustomPages();
    if (!list.length) {
      tbody.innerHTML = '<tr class="admin-empty-row"><td colspan="4">صفحه سفارشی‌ای ثبت نشده است.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(function (p) {
      return (
        "<tr>" +
          "<td data-label='عنوان'>" + p.title + "</td>" +
          "<td data-label='آدرس' style='direction:ltr;text-align:right;color:var(--ink-soft)'>page.html?slug=" + p.slug + "</td>" +
          "<td data-label='در تب بار'>" + (p.showInNav ? '<span class="admin-badge is-on">بله</span>' : '<span class="admin-badge is-off">خیر</span>') + "</td>" +
          '<td><div class="admin-table-actions">' +
            '<button type="button" class="admin-icon-btn" data-edit-page="' + p.slug + '" aria-label="ویرایش">✎</button>' +
            '<button type="button" class="admin-icon-btn is-danger" data-delete-page="' + p.slug + '" aria-label="حذف">🗑</button>' +
          "</div></td>" +
        "</tr>"
      );
    }).join("");
  }

  /* ---------- File upload → textarea helper ---------- */
  /* Reads an uploaded .html/.css/.js file as text and drops it into
     the matching textarea, which stays the actual field the form
     saves — so admins can upload a file, then still tweak it by
     hand before saving, or skip the file entirely and just type/paste. */
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

  function openPageModal(page) {
    pageModal.form.reset();
    if (page) {
      pageModal.title.textContent = "ویرایش صفحه";
      document.getElementById("pageOrigSlug").value = page.slug;
      document.getElementById("pageTitleInput").value = page.title;
      document.getElementById("pageSeoTitleInput").value = page.seoTitle || "";
      document.getElementById("pageSeoDescInput").value = page.seoDescription || "";
      document.getElementById("pageBodyInput").value = (page.paragraphs || []).join("\n");
      document.getElementById("pageHtmlInput").value = page.customHtml || "";
      document.getElementById("pageCssInput").value = page.customCss || "";
      document.getElementById("pageJsInput").value = page.customJs || "";
      document.getElementById("pageShowInNav").checked = !!page.showInNav;
    } else {
      pageModal.title.textContent = "افزودن صفحه";
      document.getElementById("pageOrigSlug").value = "";
    }
    pageModal.overlay.classList.add("is-open");
  }
  function closePageModal() { pageModal.overlay.classList.remove("is-open"); }

  function initCustomPages() {
    renderCustomPages();
    wireFileToTextarea("pageHtmlFile", "pageHtmlInput");
    wireFileToTextarea("pageCssFile", "pageCssInput");
    wireFileToTextarea("pageJsFile", "pageJsInput");

    document.getElementById("addPageBtn").addEventListener("click", function () { openPageModal(null); });
    document.getElementById("pageModalClose").addEventListener("click", closePageModal);
    document.getElementById("pageCancelBtn").addEventListener("click", closePageModal);
    pageModal.overlay.addEventListener("click", function (event) { if (event.target === pageModal.overlay) closePageModal(); });

    pageModal.form.addEventListener("submit", function (event) {
      event.preventDefault();
      const paragraphs = document.getElementById("pageBodyInput").value
        .split("\n").map(function (p) { return p.trim(); }).filter(Boolean);
      const customHtml = document.getElementById("pageHtmlInput").value;

      if (!paragraphs.length && !customHtml.trim()) {
        admin.showToast("متن ساده یا کد HTML سفارشی را وارد کنید.");
        return;
      }

      const origSlug = document.getElementById("pageOrigSlug").value;
      const payload = {
        title: document.getElementById("pageTitleInput").value.trim(),
        seoTitle: document.getElementById("pageSeoTitleInput").value.trim(),
        seoDescription: document.getElementById("pageSeoDescInput").value.trim(),
        paragraphs: paragraphs,
        customHtml: customHtml,
        customCss: document.getElementById("pageCssInput").value,
        customJs: document.getElementById("pageJsInput").value,
        showInNav: document.getElementById("pageShowInNav").checked
      };

      if (origSlug) {
        settings.updateCustomPage(origSlug, payload);
        admin.showToast("صفحه به‌روزرسانی شد.");
      } else {
        settings.addCustomPage(payload);
        admin.showToast("صفحه جدید اضافه شد.");
      }

      closePageModal();
      renderCustomPages();
      renderNavTable();
    });

    document.getElementById("customPagesTableBody").addEventListener("click", function (event) {
      const editBtn = event.target.closest("[data-edit-page]");
      const deleteBtn = event.target.closest("[data-delete-page]");
      if (editBtn) {
        const page = settings.getCustomPage(editBtn.dataset.editPage);
        if (page) openPageModal(page);
      }
      if (deleteBtn) {
        const page = settings.getCustomPage(deleteBtn.dataset.deletePage);
        if (page && admin.confirmDelete('صفحه «' + page.title + '» حذف شود؟')) {
          settings.removeCustomPage(deleteBtn.dataset.deletePage);
          admin.showToast("صفحه حذف شد.");
          renderCustomPages();
          renderNavTable();
        }
      }
    });
  }

  initTabs();
  initNavTable();
  initPageContent();
  initCustomPages();
})();
