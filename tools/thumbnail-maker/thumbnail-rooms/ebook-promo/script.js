/* =========================================
CREATORDIGITALPRO
EBOOK PROMO ELITE ULTRA PREMIUM
SCRIPT.JS CLEAN READY
========================================= */

const titleInput = document.getElementById("titleInput");
const subtitleInput = document.getElementById("subtitleInput");
const brandInput = document.getElementById("brandInput");
const priceInput = document.getElementById("priceInput");
const discountInput = document.getElementById("discountInput");
const ctaInput = document.getElementById("ctaInput");

const titleColor = document.getElementById("titleColor");
const subtitleColor = document.getElementById("subtitleColor");
const titleSize = document.getElementById("titleSize");
const subtitleSize = document.getElementById("subtitleSize");

const bgInput = document.getElementById("bgInput");
const ebookInput = document.getElementById("ebookInput");
const logoUpload = document.getElementById("logoUpload");
const testimonialInput = document.getElementById("testimonialInput");

const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const downloadBtn = document.getElementById("downloadBtn");
const downloadJpgBtn = document.getElementById("downloadJpgBtn");

const thumbnail = document.getElementById("thumbnail");

const brandTag = document.getElementById("brandTag");
const previewTitle = document.getElementById("previewTitle");
const previewSubtitle = document.getElementById("previewSubtitle");
const priceTag = document.getElementById("priceTag");
const discountBadge = document.getElementById("discountBadge");
const ctaButton = document.getElementById("ctaButton");

const previewBg = document.getElementById("previewBg");
const ebookPreview = document.getElementById("ebookPreview");
const logoPreview = document.getElementById("logoPreview");
const testimonialPreview = document.getElementById("testimonialPreview");

function attachImage(input, target){
  if(!input || !target) return;

  input.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = (ev) => {
      target.src = ev.target.result;
    };

    reader.readAsDataURL(file);
  });
}

attachImage(bgInput, previewBg);
attachImage(ebookInput, ebookPreview);
attachImage(logoUpload, logoPreview);
attachImage(testimonialInput, testimonialPreview);

[
  previewBg,
  ebookPreview,
  logoPreview,
  testimonialPreview
].forEach((img) => {
  if(img) img.removeAttribute("src");
});

function updateText(){
  previewTitle.innerHTML = titleInput.value.replace(/\n/g, "<br>");
  previewSubtitle.innerHTML = subtitleInput.value.replace(/\n/g, "<br>");
  brandTag.textContent = brandInput.value || "CreatorDigitalPro";
  priceTag.textContent = priceInput.value || "Rp79.000";
  discountBadge.textContent = discountInput.value || "50% OFF";
  ctaButton.textContent = ctaInput.value || "Download Sekarang";
}

[
  titleInput,
  subtitleInput,
  brandInput,
  priceInput,
  discountInput,
  ctaInput
].forEach((el) => {
  el.addEventListener("input", updateText);
});

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

saveBtn.addEventListener("click", () => {
  const project = {
    title:titleInput.value,
    subtitle:subtitleInput.value,
    brand:brandInput.value,
    price:priceInput.value,
    discount:discountInput.value,
    cta:ctaInput.value,
    titleColor:titleColor.value,
    subtitleColor:subtitleColor.value,
    titleSize:titleSize.value,
    subtitleSize:subtitleSize.value
  };

  localStorage.setItem("cdp-ebook-promo-elite", JSON.stringify(project));

  alert("Project berhasil disimpan");
});

loadBtn.addEventListener("click", loadProject);

function loadProject(){
  const data = localStorage.getItem("cdp-ebook-promo-elite");

  if(!data){
    alert("Belum ada project tersimpan");
    return;
  }

  const project = JSON.parse(data);

  titleInput.value = project.title || "FB PRO CREATOR GUIDE";
  subtitleInput.value = project.subtitle || "";
  brandInput.value = project.brand || "CreatorDigitalPro";
  priceInput.value = project.price || "Rp79.000";
  discountInput.value = project.discount || "50% OFF";
  ctaInput.value = project.cta || "Download Sekarang";

  titleColor.value = project.titleColor || "#ffffff";
  subtitleColor.value = project.subtitleColor || "#fef3c7";
  titleSize.value = project.titleSize || 76;
  subtitleSize.value = project.subtitleSize || 27;

  updateText();

  previewTitle.style.color = titleColor.value;
  previewSubtitle.style.color = subtitleColor.value;
  previewTitle.style.fontSize = titleSize.value + "px";
  previewSubtitle.style.fontSize = subtitleSize.value + "px";

  alert("Project berhasil dibuka");
}

function hideEmptyImages(){
  thumbnail.querySelectorAll("img").forEach((img) => {
    if(!img.getAttribute("src")){
      img.dataset.empty = "true";
      img.style.display = "none";
    }
  });
}

function restoreEmptyImages(){
  thumbnail.querySelectorAll("img").forEach((img) => {
    if(img.dataset.empty === "true"){
      img.style.display = "";
      delete img.dataset.empty;
    }
  });
}

async function waitForImages(){
  const imgs = Array.from(thumbnail.querySelectorAll("img"));

  await Promise.all(imgs.map((img) => {
    if(!img.getAttribute("src")) return Promise.resolve();
    if(img.complete) return Promise.resolve();

    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  }));
}

async function downloadPNG(){
  downloadBtn.textContent = "Generating PNG...";

  thumbnail.classList.add("export-mode");
  hideEmptyImages();

  try{
    await document.fonts.ready;
    await waitForImages();

    const canvas = await html2canvas(thumbnail, {
      scale:2,
      useCORS:true,
      allowTaint:true,
      backgroundColor:"#020617",
      logging:false
    });

    const link = document.createElement("a");
    link.download = "Ebook-Promo-Elite.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }catch(error){
    console.error(error);
    alert("Export PNG gagal. Cek Console F12.");
  }finally{
    restoreEmptyImages();
    thumbnail.classList.remove("export-mode");
    downloadBtn.textContent = "Download PNG";
  }
}

async function downloadJPG(){
  downloadJpgBtn.textContent = "Generating JPG...";

  thumbnail.classList.add("export-mode");
  hideEmptyImages();

  try{
    await document.fonts.ready;
    await waitForImages();

    const canvas = await html2canvas(thumbnail, {
      scale:2,
      useCORS:true,
      allowTaint:true,
      backgroundColor:"#020617",
      logging:false
    });

    const link = document.createElement("a");
    link.download = "Ebook-Promo-Elite.jpg";
    link.href = canvas.toDataURL("image/jpeg", .95);
    link.click();
  }catch(error){
    console.error(error);
    alert("Export JPG gagal. Cek Console F12.");
  }finally{
    restoreEmptyImages();
    thumbnail.classList.remove("export-mode");
    downloadJpgBtn.textContent = "Download JPG";
  }
}

downloadBtn.addEventListener("click", downloadPNG);
downloadJpgBtn.addEventListener("click", downloadJPG);

window.addEventListener("load", () => {
  updateText();

  if(localStorage.getItem("cdp-ebook-promo-elite")){
    loadProject();
  }
});
