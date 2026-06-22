/* =========================================
CREATORDIGITALPRO
SCRIPT.JS FINAL V1.0
========================================= */

// ============================================================================================
// section 1
// ============================================================================================
/* =========================================
INPUT ELEMENTS
========================================= */

const titleInput = document.getElementById("titleInput");

const subtitleInput = document.getElementById("subtitleInput");

const brandInput = document.getElementById("brandInput");

const brandTag = document.getElementById("brandTag");

const titleColor = document.getElementById("titleColor");

const subtitleColor = document.getElementById("subtitleColor");

const titleSize = document.getElementById("titleSize");

const subtitleSize = document.getElementById("subtitleSize");

const strokeColor = document.getElementById("strokeColor");

const strokeSize = document.getElementById("strokeSize");

const shadowSize = document.getElementById("shadowSize");

const themePreset = document.getElementById("themePreset");

const bgInput = document.getElementById("bgInput");

const characterInput = document.getElementById("characterInput");

const logoUpload = document.getElementById("logoUpload");

const gallery1 = document.getElementById("gallery1");

const gallery2 = document.getElementById("gallery2");

const gallery3 = document.getElementById("gallery3");

const gallery4 = document.getElementById("gallery4");

const saveBtn = document.getElementById("saveBtn");

const loadBtn = document.getElementById("loadBtn");

const downloadBtn = document.getElementById("downloadBtn");

const downloadJpgBtn = document.getElementById("downloadJpgBtn");

/* =========================================
PREVIEW ELEMENTS
========================================= */

const thumbnail = document.getElementById("thumbnail");

const previewTitle = document.getElementById("previewTitle");

const previewSubtitle = document.getElementById("previewSubtitle");

const previewBg = document.getElementById("previewBg");

const previewCharacter = document.getElementById("previewCharacter");

const logoPreview = document.getElementById("logoPreview");

const previewGallery1 = document.getElementById("previewGallery1");

const previewGallery2 = document.getElementById("previewGallery2");

const previewGallery3 = document.getElementById("previewGallery3");

const previewGallery4 = document.getElementById("previewGallery4");

// ============================================================================================
// section 2
// ============================================================================================
/* =========================================
LIVE TEXT UPDATE
========================================= */

titleInput.addEventListener("input", () => {
  previewTitle.innerHTML = titleInput.value.replace(/\n/g, "<br>");
});

subtitleInput.addEventListener("input", () => {
  previewSubtitle.innerHTML = subtitleInput.value.replace(/\n/g, "<br>");
});

brandInput.addEventListener("input", () => {
  brandTag.textContent = brandInput.value;
});

// ============================================================================================
// section 3
// ============================================================================================
/* =========================================
COLOR CONTROLS
========================================= */

titleColor.addEventListener("input", () => {
  previewTitle.style.color = titleColor.value;
});

subtitleColor.addEventListener("input", () => {
  previewSubtitle.style.color = subtitleColor.value;
});

// ============================================================================================
// section 4
// ============================================================================================
/* =========================================
FONT SIZE
========================================= */

titleSize.addEventListener("input", () => {
  previewTitle.style.fontSize = titleSize.value + "px";
});

subtitleSize.addEventListener("input", () => {
  previewSubtitle.style.fontSize = subtitleSize.value + "px";
});

// ============================================================================================
// section 5
// ============================================================================================
/* =========================================
STROKE CONTROL
========================================= */

strokeColor.addEventListener("input", updateStroke);

strokeSize.addEventListener("input", updateStroke);

function updateStroke() {
  previewTitle.style.webkitTextStroke =
    strokeSize.value + "px " + strokeColor.value;
}

/* =========================================
SHADOW CONTROL
========================================= */

shadowSize.addEventListener("input", updateShadow);

function updateShadow() {
  previewTitle.style.textShadow = `0 0 ${shadowSize.value}px rgba(0,0,0,.8),

0 5px ${shadowSize.value}px rgba(0,0,0,.5)`;
}

// ============================================================================================
// section 6
// ============================================================================================
/* =========================================
IMAGE HELPER
========================================= */

function attachImage(input, target) {
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (!file) return;

    target.src = URL.createObjectURL(file);
  });
}
// ============================================================================================
// section 7
// ============================================================================================
/* =========================================
IMAGE UPLOADS
========================================= */

attachImage(bgInput, previewBg);

attachImage(characterInput, previewCharacter);

attachImage(logoUpload, logoPreview);

attachImage(gallery1, previewGallery1);

attachImage(gallery2, previewGallery2);

attachImage(gallery3, previewGallery3);

attachImage(gallery4, previewGallery4);
// ============================================================================================
// section 8
// ============================================================================================
/* =========================================
DEFAULT IMAGES
========================================= */

previewBg.removeAttribute("src");
previewCharacter.removeAttribute("src");
previewGallery1.removeAttribute("src");
previewGallery2.removeAttribute("src");
previewGallery3.removeAttribute("src");
previewGallery4.removeAttribute("src");

// ============================================================================================
// section 9
// ============================================================================================
/* =========================================
THEME PRESET
========================================= */

if (themePreset) {
  themePreset.addEventListener("change", applyTheme);
}

function applyTheme() {
  if (!themePreset) return;

  switch (themePreset.value) {
    case "ai":
      titleColor.value = "#ffffff";

      subtitleColor.value = "#00d4ff";

      strokeColor.value = "#000000";

      strokeSize.value = 2;

      shadowSize.value = 15;

      break;

    case "gaming":
      titleColor.value = "#ffff00";

      subtitleColor.value = "#ff3b30";

      strokeColor.value = "#000000";

      strokeSize.value = 3;

      shadowSize.value = 25;

      break;

    case "business":
      titleColor.value = "#ffffff";

      subtitleColor.value = "#22c55e";

      strokeColor.value = "#000000";

      strokeSize.value = 1;

      shadowSize.value = 10;

      break;

    case "travel":
      titleColor.value = "#ffb703";

      subtitleColor.value = "#ffffff";

      strokeColor.value = "#000000";

      strokeSize.value = 2;

      shadowSize.value = 18;

      break;
  }

  previewTitle.style.color = titleColor.value;

  previewSubtitle.style.color = subtitleColor.value;

  updateStroke();

  updateShadow();
}
// ============================================================================================
// section 10
// ============================================================================================
/* =========================================
SAVE PROJECT
========================================= */

saveBtn.addEventListener("click", () => {
  const project = {
    title: titleInput.value,

    subtitle: subtitleInput.value,

    titleColor: titleColor.value,

    subtitleColor: subtitleColor.value,

    titleSize: titleSize.value,

    subtitleSize: subtitleSize.value,

    strokeColor: strokeColor.value,

    strokeSize: strokeSize.value,

    shadowSize: shadowSize.value,
  };

  localStorage.setItem("cdp-project", JSON.stringify(project));

  alert("Project berhasil disimpan");
});
// ============================================================================================
// section 11
// ============================================================================================
/* =========================================
LOAD PROJECT
========================================= */

loadBtn.addEventListener("click", loadProject);

function loadProject() {
  const data = localStorage.getItem("cdp-project");

  if (!data) {
    alert("Belum ada project tersimpan");

    return;
  }

  const project = JSON.parse(data);

  titleInput.value = project.title || "";

  subtitleInput.value = project.subtitle || "";

  titleColor.value = project.titleColor || "#ffffff";

  subtitleColor.value = project.subtitleColor || "#00d4ff";

  titleSize.value = project.titleSize || 78;

  subtitleSize.value = project.subtitleSize || 26;

  strokeColor.value = project.strokeColor || "#000000";

  strokeSize.value = project.strokeSize || 2;

  shadowSize.value = project.shadowSize || 15;

  /* APPLY */

  previewTitle.innerHTML = titleInput.value.replace(/\n/g, "<br>");

  previewSubtitle.innerHTML = subtitleInput.value.replace(/\n/g, "<br>");

  previewTitle.style.color = titleColor.value;

  previewSubtitle.style.color = subtitleColor.value;

  previewTitle.style.fontSize = titleSize.value + "px";

  previewSubtitle.style.fontSize = subtitleSize.value + "px";

  updateStroke();

  updateShadow();

  alert("Project berhasil dibuka");
}
// ============================================================================================
// section 12
// ============================================================================================
/* =========================================
DOWNLOAD PNG
========================================= */

async function downloadPNG() {
  downloadBtn.textContent = "Generating PNG...";

  try {
    thumbnail.classList.add("export-mode");

    const canvas = await html2canvas(thumbnail, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#000000",
    });

    thumbnail.classList.remove("export-mode");

    const link = document.createElement("a");

    link.download = "CreatorDigitalPro.png";

    if(window.CDPDemoGuard && window.CDPDemoGuard.isLoggedIn && window.CDPDemoGuard.isLoggedIn() && window.CDPDemoGuard.watermarkCanvas){window.CDPDemoGuard.watermarkCanvas(canvas);}
    link.href = canvas.toDataURL("image/png");

    link.click();
  } catch (error) {
    console.error(error);

    alert("Export PNG gagal.\nCek Console (F12).");
  }

  downloadBtn.textContent = "Download PNG";
}

/* =========================================
DOWNLOAD JPG
========================================= */

async function downloadJPG() {
  downloadJpgBtn.textContent = "Generating JPG...";

  try {
    const canvas = await html2canvas(thumbnail, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const link = document.createElement("a");

    link.download = "CreatorDigitalPro.jpg";

    if(window.CDPDemoGuard && window.CDPDemoGuard.isLoggedIn && window.CDPDemoGuard.isLoggedIn() && window.CDPDemoGuard.watermarkCanvas){window.CDPDemoGuard.watermarkCanvas(canvas);}
    link.href = canvas.toDataURL("image/jpeg", 0.95);

    link.click();
  } catch (error) {
    console.error(error);

    alert("Export JPG gagal.\nCek Console (F12).");
  }

  downloadJpgBtn.textContent = "Download JPG";
}

// Pasang ke event listener
downloadBtn.addEventListener("click", downloadPNG);

downloadJpgBtn.addEventListener("click", downloadJPG);

/* =========================================
AUTO LOAD
========================================= */

window.addEventListener("load", () => {
  if (localStorage.getItem("cdp-project")) {
    loadProject();
  }
});
