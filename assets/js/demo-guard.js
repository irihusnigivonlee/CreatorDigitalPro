/* CreatorDigitalPro Demo Guard + Auth Gate + Export Watermark
   GitHub Pages demo protection only. For real protection use PHP/backend license.
*/
(function () {
  "use strict";

  const CDP_BASE = "/CreatorDigitalPro";
  const LOGIN_KEY = "cdp_demo_user";
  const USER_KEY = "cdp-user";
  const WATERMARK_TEXT = "CreatorDigitalPro DEMO";
  const GUARD_VERSION = "3.0-auth-gate";

  function safeJson(value) { try { return JSON.parse(value || "null"); } catch(e) { return null; } }
  function getUser() { try { return safeJson(localStorage.getItem(LOGIN_KEY)) || safeJson(localStorage.getItem(USER_KEY)); } catch(e) { return null; } }
  function isLoggedIn() { return !!getUser(); }
  function getCurrentPath() { return window.location.pathname + window.location.search + window.location.hash; }
  function authUrl(page) { return `${CDP_BASE}/pages/${page}.html?next=${encodeURIComponent(getCurrentPath())}`; }

  function saveLogin(name, email) {
    const user = {
      name: name || "Demo User",
      email: email || "demo@creatordigitalpro.local",
      plan: "Demo Access",
      status: "demo",
      loginAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(LOGIN_KEY, JSON.stringify(user));
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch(e) {}
    return user;
  }

  function logout() {
    try {
      localStorage.removeItem(LOGIN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch(e) {}
    showToast("Logout demo berhasil.");
    setTimeout(() => location.reload(), 400);
  }

  function normalizeText(value) { return (value || "").toString().trim().toLowerCase(); }

  function looksLikeExportAction(el) {
    if (!el) return false;
    if (el.closest && el.closest(".cdp-demo-modal")) return false;
    const text = normalizeText(el.innerText || el.textContent || el.value || "");
    const attrs = [
      el.id, el.className, el.getAttribute && el.getAttribute("href"),
      el.getAttribute && el.getAttribute("download"),
      el.getAttribute && el.getAttribute("aria-label"),
      el.getAttribute && el.getAttribute("title"),
      el.getAttribute && el.getAttribute("data-action"),
      el.getAttribute && el.getAttribute("data-export")
    ].map(normalizeText).join(" ");
    const haystack = `${text} ${attrs}`;
    return (
      haystack.includes("download") || haystack.includes("unduh") ||
      haystack.includes("export") || haystack.includes("ekspor") ||
      haystack.includes("simpan") || haystack.includes("save png") ||
      haystack.includes("save jpg") || haystack.includes("png") ||
      haystack.includes("jpg") || haystack.includes("jpeg") ||
      haystack.includes("zip") || haystack.includes("mp4") ||
      haystack.includes("webm") || haystack.includes("pdf")
    );
  }

  function getActionElement(target) {
    if (!target || !target.closest) return null;
    return target.closest("button, a, input[type='button'], input[type='submit'], [role='button']");
  }

  function ensureModal() {
    let modal = document.getElementById("cdpDemoGuardModal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "cdpDemoGuardModal";
    modal.className = "cdp-demo-modal";
    modal.innerHTML = `
      <div class="cdp-demo-backdrop" data-cdp-close="1"></div>
      <div class="cdp-demo-box cdp-auth-gate" role="dialog" aria-modal="true" aria-labelledby="cdpDemoTitle">
        <button class="cdp-demo-close" type="button" data-cdp-close="1" aria-label="Tutup">×</button>
        <div class="cdp-demo-brand"><span>CDP</span><strong>CreatorDigitalPro</strong></div>
        <div class="cdp-demo-badge">Demo Protected</div>
        <h2 id="cdpDemoTitle">Login / Daftar Demo untuk Export</h2>
        <p>Preview boleh dicoba gratis. Untuk download atau export, masuk dulu ke akun demo. Hasil demo tetap diberi watermark sampai akses premium aktif.</p>
        <div class="cdp-demo-actions">
          <a class="cdp-demo-primary" id="cdpGoLogin" href="${authUrl("login")}">Login Demo</a>
          <a class="cdp-demo-secondary" id="cdpGoRegister" href="${authUrl("register")}">Daftar Gratis</a>
        </div>
        <div class="cdp-demo-divider"><span>atau masuk cepat</span></div>
        <label>Nama
          <input id="cdpDemoName" type="text" placeholder="Nama kamu">
        </label>
        <label>Email
          <input id="cdpDemoEmail" type="email" placeholder="email@contoh.com">
        </label>
        <button id="cdpDemoQuickBtn" class="cdp-demo-quick" type="button">Masuk Cepat Demo</button>
        <small>Catatan: GitHub Pages memakai login demo localStorage. Sistem aman penuh memakai hosting PHP, database, Midtrans, dan license key.</small>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", function (e) {
      if (e.target && e.target.getAttribute("data-cdp-close") === "1") modal.classList.remove("is-open");
    });

    modal.querySelector("#cdpDemoQuickBtn").addEventListener("click", function () {
      const name = modal.querySelector("#cdpDemoName").value;
      const email = modal.querySelector("#cdpDemoEmail").value;
      saveLogin(name, email);
      modal.classList.remove("is-open");
      showToast("Login demo berhasil. Export aktif dengan watermark.");
      applyWatermarks();
      renderAuthUI();
    });

    return modal;
  }

  function openModal() { ensureModal().classList.add("is-open"); }

  function showToast(message) {
    let toast = document.getElementById("cdpDemoToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "cdpDemoToast";
      toast.className = "cdp-demo-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove("is-show"), 2600);
  }

  function applyWatermarkTo(el) {
    if (!el || el.dataset.cdpWatermarked === "1") return;
    const style = window.getComputedStyle(el);
    if (style.position === "static") el.style.position = "relative";
    el.style.overflow = el.style.overflow || "hidden";
    const wm = document.createElement("div");
    wm.className = "cdp-watermark-layer";
    wm.setAttribute("aria-hidden", "true");
    wm.innerHTML = `<span>${WATERMARK_TEXT}</span><span>${WATERMARK_TEXT}</span><span>${WATERMARK_TEXT}</span>`;
    el.appendChild(wm);
    el.dataset.cdpWatermarked = "1";
  }

  function applyWatermarks() {
    const selectors = [
      "#thumbnail", ".thumbnail", ".thumbnail-preview", ".thumb-preview",
      "#canvas", "canvas", ".canvas", ".preview", ".preview-area", ".stage", ".mockup-stage",
      ".video-preview", "#videoPreview", ".intro-stage", ".intro-preview", ".ebook-page", ".page-preview",
      ".export-area", "[data-export-area]"
    ];
    document.querySelectorAll(selectors.join(",")).forEach(function (el) {
      if (el.tagName && el.tagName.toLowerCase() === "canvas") return;
      const rect = el.getBoundingClientRect();
      if (rect.width >= 180 && rect.height >= 100) applyWatermarkTo(el);
    });
  }

  function watermarkCanvas(canvas) {
    if (!canvas || !canvas.getContext || canvas.dataset.cdpCanvasWm === "1") return canvas;
    try {
      const ctx = canvas.getContext("2d");
      const w = canvas.width, h = canvas.height;
      if (!w || !h) return canvas;
      ctx.save();
      ctx.globalAlpha = 0.24;
      ctx.translate(w / 2, h / 2);
      ctx.rotate(-Math.PI / 7);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `bold ${Math.max(28, Math.floor(w / 18))}px Arial, sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "rgba(0,0,0,.48)";
      ctx.lineWidth = Math.max(2, Math.floor(w / 450));
      for (let y = -h; y <= h; y += Math.max(120, h / 4)) {
        ctx.strokeText(WATERMARK_TEXT, 0, y);
        ctx.fillText(WATERMARK_TEXT, 0, y);
      }
      ctx.restore();
      canvas.dataset.cdpCanvasWm = "1";
    } catch (e) {}
    return canvas;
  }

  function wrapCanvasExports() {
    if (HTMLCanvasElement.prototype.__cdpDemoGuardWrapped) return;
    HTMLCanvasElement.prototype.__cdpDemoGuardWrapped = true;
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function () {
      if (isLoggedIn()) watermarkCanvas(this);
      return originalToDataURL.apply(this, arguments);
    };
    if (HTMLCanvasElement.prototype.toBlob) {
      const originalToBlob = HTMLCanvasElement.prototype.toBlob;
      HTMLCanvasElement.prototype.toBlob = function () {
        if (isLoggedIn()) watermarkCanvas(this);
        return originalToBlob.apply(this, arguments);
      };
    }
  }

  function wrapHtml2Canvas() {
    const tryWrap = function () {
      if (!window.html2canvas || window.html2canvas.__cdpWrapped) return;
      const original = window.html2canvas;
      const wrapped = function () {
        return original.apply(this, arguments).then(function (canvas) {
          if (isLoggedIn()) watermarkCanvas(canvas);
          return canvas;
        });
      };
      wrapped.__cdpWrapped = true;
      window.html2canvas = wrapped;
    };
    tryWrap();
    setInterval(tryWrap, 1000);
  }

  function renderAuthUI() {
    const user = getUser();
    document.querySelectorAll(".cdp-auth-link").forEach(el => {
      if (!user) return;
      if (el.textContent.toLowerCase().includes("login")) {
        el.textContent = user.name ? `Hi, ${user.name.split(" ")[0]}` : "Demo User";
        el.setAttribute("href", `${CDP_BASE}/dashboard/index.html`);
      }
      if (el.textContent.toLowerCase().includes("daftar")) {
        el.textContent = "Logout";
        el.setAttribute("href", "#logout-demo");
        el.addEventListener("click", function(e){ e.preventDefault(); logout(); }, { once:false });
      }
    });

    let badge = document.getElementById("cdpDemoFloatingBadge");
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "cdpDemoFloatingBadge";
      badge.className = "cdp-demo-floating-badge";
      document.body.appendChild(badge);
    }
    if (user) {
      badge.innerHTML = `<span>DEMO USER</span><button type="button" id="cdpFloatingLogout">Logout</button>`;
      const btn = badge.querySelector("#cdpFloatingLogout");
      if (btn) btn.onclick = logout;
    } else {
      badge.textContent = "DEMO MODE";
      badge.title = "GitHub Pages demo. Export dilindungi login demo dan watermark.";
    }
  }

  document.addEventListener("click", function (e) {
    const action = getActionElement(e.target);
    if (!looksLikeExportAction(action)) return;
    if (!isLoggedIn()) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      openModal();
      return false;
    }
    applyWatermarks();
    showToast("Export demo memakai watermark.");
  }, true);

  document.addEventListener("DOMContentLoaded", function () {
    wrapCanvasExports();
    wrapHtml2Canvas();
    renderAuthUI();
    if (isLoggedIn()) applyWatermarks();
  });

  window.CDPDemoGuard = { version: GUARD_VERSION, login: saveLogin, logout, isLoggedIn, getUser, applyWatermarks, openLogin: openModal };
})();
