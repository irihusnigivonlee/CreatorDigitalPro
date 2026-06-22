/* =========================================
CREATORDIGITALPRO
TUTORIAL EDUCATION
SCRIPT.JS FINAL CLEAN
========================================= */

/* ELEMENTS */

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

/* PREVIEW */

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

/* LIVE TEXT */

titleInput.addEventListener("input", () => {
  previewTitle.innerHTML = titleInput.value.replace(/\n/g, "<br>");
});

subtitleInput.addEventListener("input", () => {
  previewSubtitle.innerHTML = subtitleInput.value.replace(/\n/g, "<br>");
});

brandInput.addEventListener("input", () => {
  brandTag.textContent = brandInput.value || "Nama Channel";
});

/* STYLE CONTROLS */

titleColor.addEventListener("input", () => {
  previewTitle.style.color = titleColor.value;
});

subtitleColor.addEventListener("input", () => {
  previewSubtitle.style.color = subtitleColor.value;
});

titleSize.addEventListener("input", () => {
  previewTitle.style.fontSize = titleSize.value + "px";
});

subtitleSize.addEventListener("input", () => {
  previewSubtitle.style.fontSize = subtitleSize.value + "px";
});

strokeColor.addEventListener("input", updateStroke);
strokeSize.addEventListener("input", updateStroke);
shadowSize.addEventListener("input", updateShadow);

function updateStroke() {
  previewTitle.style.webkitTextStroke =
    strokeSize.value + "px " + strokeColor.value;
}

function updateShadow() {
  previewTitle.style.textShadow =
    `0 0 ${shadowSize.value}px rgba(0,0,0,.55)`;
}

/* IMAGE UPLOAD - FILE READER FOR STABLE EXPORT */

function attachImage(input, target) {
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      target.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
}

attachImage(bgInput, previewBg);
attachImage(characterInput, previewCharacter);
attachImage(logoUpload, logoPreview);
attachImage(gallery1, previewGallery1);
attachImage(gallery2, previewGallery2);
attachImage(gallery3, previewGallery3);
attachImage(gallery4, previewGallery4);

/* DEFAULT EMPTY IMAGES */

[
  previewBg,
  previewCharacter,
  logoPreview,
  previewGallery1,
  previewGallery2,
  previewGallery3,
  previewGallery4
].forEach((img) => {
  img.removeAttribute("src");
});

/* EMPTY IMAGE HANDLER */

function hideEmptyImages() {
  document.querySelectorAll("#thumbnail img").forEach((img) => {
    if (!img.getAttribute("src")) {
      img.dataset.wasEmpty = "true";
      img.style.display = "none";
    }
  });
}

function restoreEmptyImages() {
  document.querySelectorAll("#thumbnail img").forEach((img) => {
    if (img.dataset.wasEmpty === "true") {
      img.style.display = "";
      delete img.dataset.wasEmpty;
    }
  });
}

function waitForImages() {
  const images = Array.from(thumbnail.querySelectorAll("img"));

  return Promise.all(
    images.map((img) => {
      if (!img.getAttribute("src")) return Promise.resolve();
      if (img.complete) return Promise.resolve();

      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );
}

/* SAVE PROJECT */

saveBtn.addEventListener("click", () => {
  const project = {
    title: titleInput.value,
    subtitle: subtitleInput.value,
    brand: brandInput.value,
    titleColor: titleColor.value,
    subtitleColor: subtitleColor.value,
    titleSize: titleSize.value,
    subtitleSize: subtitleSize.value,
    strokeColor: strokeColor.value,
    strokeSize: strokeSize.value,
    shadowSize: shadowSize.value,
  };

  localStorage.setItem("cdp-tutorial-education-project", JSON.stringify(project));

  alert("Project berhasil disimpan");
});

/* LOAD PROJECT */

loadBtn.addEventListener("click", loadProject);

function loadProject() {
  const data = localStorage.getItem("cdp-tutorial-education-project");

  if (!data) {
    alert("Belum ada project tersimpan");
    return;
  }

  const project = JSON.parse(data);

  titleInput.value = project.title || "";
  subtitleInput.value = project.subtitle || "";
  brandInput.value = project.brand || "Nama Channel";

  titleColor.value = project.titleColor || "#102033";
  subtitleColor.value = project.subtitleColor || "#166534";

  titleSize.value = project.titleSize || 66;
  subtitleSize.value = project.subtitleSize || 28;

  strokeColor.value = project.strokeColor || "#ffffff";
  strokeSize.value = project.strokeSize || 0;
  shadowSize.value = project.shadowSize || 0;

  previewTitle.innerHTML = titleInput.value.replace(/\n/g, "<br>");
  previewSubtitle.innerHTML = subtitleInput.value.replace(/\n/g, "<br>");
  brandTag.textContent = brandInput.value || "Nama Channel";

  previewTitle.style.color = titleColor.value;
  previewSubtitle.style.color = subtitleColor.value;

  previewTitle.style.fontSize = titleSize.value + "px";
  previewSubtitle.style.fontSize = subtitleSize.value + "px";

  updateStroke();
  updateShadow();

  alert("Project berhasil dibuka");
}

/* EXPORT PNG */

async function downloadPNG() {
  downloadBtn.textContent = "Generating PNG...";

  thumbnail.classList.add("export-mode");
  hideEmptyImages();

  try {
    await waitForImages();

    const canvas = await html2canvas(thumbnail, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#08121f",
      logging: false,
      scrollX: 0,
      scrollY: 0,
    });

    const link = document.createElement("a");
    link.download = "Tutorial-Education.png";
    if(window.CDPDemoGuard && window.CDPDemoGuard.isLoggedIn && window.CDPDemoGuard.isLoggedIn() && window.CDPDemoGuard.watermarkCanvas){window.CDPDemoGuard.watermarkCanvas(canvas);}
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error(error);
    alert("Export PNG gagal. Cek Console (F12).");
  } finally {
    restoreEmptyImages();
    thumbnail.classList.remove("export-mode");
    downloadBtn.textContent = "Download PNG";
  }
}

/* EXPORT JPG */

async function downloadJPG() {
  downloadJpgBtn.textContent = "Generating JPG...";

  thumbnail.classList.add("export-mode");
  hideEmptyImages();

  try {
    await waitForImages();

    const canvas = await html2canvas(thumbnail, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#08121f",
      logging: false,
      scrollX: 0,
      scrollY: 0,
    });

    const link = document.createElement("a");
    link.download = "Tutorial-Education.jpg";
    if(window.CDPDemoGuard && window.CDPDemoGuard.isLoggedIn && window.CDPDemoGuard.isLoggedIn() && window.CDPDemoGuard.watermarkCanvas){window.CDPDemoGuard.watermarkCanvas(canvas);}
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
  } catch (error) {
    console.error(error);
    alert("Export JPG gagal. Cek Console (F12).");
  } finally {
    restoreEmptyImages();
    thumbnail.classList.remove("export-mode");
    downloadJpgBtn.textContent = "Download JPG";
  }
}

downloadBtn.addEventListener("click", downloadPNG);
downloadJpgBtn.addEventListener("click", downloadJPG);

/* START */

window.addEventListener("load", () => {
  previewTitle.style.color = titleColor.value;
  previewSubtitle.style.color = subtitleColor.value;
  previewTitle.style.fontSize = titleSize.value + "px";
  previewSubtitle.style.fontSize = subtitleSize.value + "px";
  brandTag.textContent = brandInput.value || "Nama Channel";
  updateStroke();
  updateShadow();
});
