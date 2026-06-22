/* CreatorDigitalPro Demo Guard + Watermark
   GitHub Pages demo protection only. For real protection use PHP/backend license.
*/
(function () {
  "use strict";

  const CDP_BASE = "/CreatorDigitalPro";
  const LOGIN_KEY = "cdp_demo_user";
  const WATERMARK_TEXT = "CreatorDigitalPro DEMO";
  const GUARD_VERSION = "2.0";

  function isLoggedIn() {
    try { return !!localStorage.getItem(LOGIN_KEY); } catch(e) { return false; }
  }

  function saveLogin(name, email) {
    try {
      localStorage.setItem(LOGIN_KEY, JSON.stringify({
        name: name || "Demo User",
        email: email || "demo@creatordigitalpro.local",
        loginAt: new Date().toISOString()
      }));
    } catch(e) {}
  }

  function normalizeText(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function looksLikeExportAction(el) {
    if (!el) return false;
    const text = normalizeText(el.innerText || el.textContent || "");
    const attrs = [
      el.id, el.className, el.getAttribute && el.getAttribute("href"),
      el.getAttribute && el.getAttribute("download"),
      el.getAttribute && el.getAttribute("aria-label"),
      el.getAttribute && el.getAttribute("title"),
      el.getAttribute && el.getAttribute("data-action")
    ].map(normalizeText).join(" ");

    const haystack = `${text} ${attrs}`;
    return (
      haystack.includes("download") ||
      haystack.includes("unduh") ||
      haystack.includes("export") ||
      haystack.includes("ekspor") ||
      haystack.includes("save png") ||
      haystack.includes("save jpg") ||
      haystack.includes("png") ||
      haystack.includes("jpg") ||
      haystack.includes("jpeg") ||
      haystack.includes("zip") ||
      haystack.includes("mp4") ||
      haystack.includes("pdf")
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
      <div class="cdp-demo-box" role="dialog" aria-modal="true" aria-labelledby="cdpDemoTitle">
        <button class="cdp-demo-close" type="button" data-cdp-close="1" aria-label="Tutup">×</button>
        <div class="cdp-demo-badge">Demo Access</div>
        <h2 id="cdpDemoTitle">Login / Daftar Demo Dulu</h2>
        <p>Untuk menjaga produk demo CreatorDigitalPro, fitur download/export dibatasi. Setelah login demo, export tetap memakai watermark.</p>
        <label>Nama
          <input id="cdpDemoName" type="text" placeholder="Nama kamu">
        </label>
        <label>Email
          <input id="cdpDemoEmail" type="email" placeholder="email@contoh.com">
        </label>
        <button id="cdpDemoLoginBtn" class="cdp-demo-primary" type="button">Masuk Demo</button>
        <small>Versi GitHub Pages memakai login demo localStorage. Proteksi penuh memakai hosting PHP + license.</small>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", function (e) {
      if (e.target && e.target.getAttribute("data-cdp-close") === "1") {
        modal.classList.remove("is-open");
      }
    });

    modal.querySelector("#cdpDemoLoginBtn").addEventListener("click", function () {
      const name = modal.querySelector("#cdpDemoName").value;
      const email = modal.querySelector("#cdpDemoEmail").value;
      saveLogin(name, email);
      modal.classList.remove("is-open");
      showToast("Login demo berhasil. Export aktif dengan watermark.");
      applyWatermarks();
    });

    return modal;
  }

  function openModal() {
    ensureModal().classList.add("is-open");
  }

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
      "#thumbnail", ".thumbnail", ".thumbnail-preview",
      "#canvas", "canvas", ".canvas", ".preview", ".preview-area",
      ".video-preview", "#videoPreview", ".intro-stage", ".ebook-page", ".page-preview",
      ".export-area", "[data-export-area]"
    ];
    document.querySelectorAll(selectors.join(",")).forEach(function (el) {
      if (el.tagName && el.tagName.toLowerCase() === "canvas") {
        // Canvas watermark is handled by wrapped toDataURL below.
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.width >= 180 && rect.height >= 100) applyWatermarkTo(el);
    });
  }

  function watermarkCanvas(canvas) {
    // IMPORTANT: do not skip using dataset. Many tools redraw/reuse the same canvas before export.
    // If we skip after the first watermark, the exported image/video can become clean again.
    if (!canvas || !canvas.getContext) return canvas;
    try {
      const ctx = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) return canvas;

      ctx.save();
      ctx.globalAlpha = 0.24;
      ctx.translate(w / 2, h / 2);
      ctx.rotate(-Math.PI / 7);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `bold ${Math.max(32, Math.floor(w / 16))}px Arial, sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "rgba(0,0,0,.55)";
      ctx.lineWidth = Math.max(2, Math.floor(w / 420));
      for (let y = -h; y <= h; y += Math.max(140, h / 3.2)) {
        ctx.strokeText(WATERMARK_TEXT, 0, y);
        ctx.fillText(WATERMARK_TEXT, 0, y);
      }
      ctx.restore();
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
    if (isLoggedIn()) applyWatermarks();

    const badge = document.createElement("div");
    badge.className = "cdp-demo-floating-badge";
    badge.textContent = "DEMO MODE";
    badge.title = "GitHub Pages demo. Export dilindungi login demo dan watermark.";
    document.body.appendChild(badge);
  });

  window.CDPDemoGuard = {
    version: GUARD_VERSION,
    login: saveLogin,
    logout: function () { try { localStorage.removeItem(LOGIN_KEY); } catch(e) {} location.reload(); },
    isLoggedIn: isLoggedIn,
    applyWatermarks: applyWatermarks,
    watermarkCanvas: watermarkCanvas
  };
})();
