/* CreatorDigitalPro Ebook Builder Modern Cyan - JPG Export Fixed */
const ebookTitle=document.getElementById("ebookTitle");
const authorName=document.getElementById("authorName");
const themeColor=document.getElementById("themeColor");
const layoutSelect=document.getElementById("layoutSelect");
const pageTitle=document.getElementById("pageTitle");
const pageContent=document.getElementById("pageContent");
const pageCta=document.getElementById("pageCta");
const pageImageInput=document.getElementById("pageImageInput");
const addPageBtn=document.getElementById("addPageBtn");
const exportJpgBtn=document.getElementById("exportJpgBtn");
const printBtn=document.getElementById("printBtn");
const clearBtn=document.getElementById("clearBtn");
const ebookDocument=document.getElementById("ebookDocument");
const documentTitle=document.getElementById("documentTitle");
const pageList=document.getElementById("pageList");

let pages=[];
let uploadedImage="";

const layoutLabels={
  cover:"Cover Premium",
  chapter:"Chapter Opener",
  classic:"Content Classic",
  imageTop:"Image Top",
  imageBottom:"Image Bottom",
  imageSide:"Image Side",
  quote:"Quote Highlight",
  cta:"CTA Offer Page"
};

function getChapterNumber(index){
  let count=0;
  for(let i=0;i<=index;i++){
    if(pages[i] && pages[i].layout==="chapter") count++;
  }
  return Math.max(count,1);
}

function getPageNumber(page,index){
  // Cover tetap halaman pembuka. Chapter Opener menjadi nomor bab utama: 01, 02, 03.
  // Layout lain adalah anak halaman, jadi mengikuti nomor Chapter Opener terakhir.
  if(page.layout==="cover") return 0;
  return getChapterNumber(index);
}

function chapterLabel(page,index){
  const n=getPageNumber(page,index);
  return n ? String(n).padStart(2,"0") : "";
}

function esc(v){
  return String(v||"").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

function imageOrFallback(src,className,text){
  if(src) return `<img class="page-image ${className}" src="${src}" />`;
  return `<div class="image-fallback ${className}">${esc(text||"Upload Gambar")}</div>`;
}

function paragraph(text){
  const lines=String(text||"").split("\n").filter(Boolean);
  return lines.length ? lines.map(line=>`<p>${esc(line)}</p>`).join("") : "<p></p>";
}

function pageHTML(page,index){
  const theme=page.theme||"#06d6d6";
  const image=page.image||"";
  const title=esc(page.title||"Judul Halaman");
  const content=page.content||"";
  const cta=esc(page.cta||"Mulai sekarang");
  const author=esc(page.author||"CreatorDigitalPro");

  if(page.layout==="cover"){
    return `<section class="ebook-page layout-cover" style="--theme:${theme}">
      ${image?`<img class="cover-image" src="${image}" />`:""}
      <div class="cover-gradient"></div><div class="decor-corner"></div>
      <div class="page-content"><div class="cover-badge">EBOOK PREMIUM</div><h1>${title}</h1>${paragraph(content)}<div class="author">${author}</div></div>
    </section>`;
  }

  if(page.layout==="chapter"){
    return `<section class="ebook-page layout-chapter" style="--theme:${theme}">
      <div class="chapter-band"></div><div class="chapter-number">${chapterLabel(page,index)}</div><div class="decor-bottom"></div>
      <div class="page-content"><h2>${title}</h2>${paragraph(content)}</div>
    </section>`;
  }

  if(page.layout==="imageTop"){
    return `<section class="ebook-page layout-imageTop" style="--theme:${theme}">
      ${imageOrFallback(image,"top-image","Gambar Besar Atas")}
      <div class="decor-bottom"></div><div class="page-content"><h2>${title}</h2>${paragraph(content)}<div class="note-box">${cta}</div></div>
    </section>`;
  }

  if(page.layout==="imageBottom"){
    return `<section class="ebook-page layout-imageBottom" style="--theme:${theme}">
      <div class="decor-top"></div><div class="page-content"><h2>${title}</h2>${paragraph(content)}<div class="note-box">${cta}</div></div>
      ${imageOrFallback(image,"bottom-image","Gambar Besar Bawah")}
    </section>`;
  }

  if(page.layout==="imageSide"){
    return `<section class="ebook-page layout-imageSide" style="--theme:${theme}">
      ${imageOrFallback(image,"side-image","Foto Vertikal")}<div class="side-overlay"></div>
      <div class="page-content"><h2>${title}</h2>${paragraph(content)}<div class="mini-cta">${cta}</div></div>
    </section>`;
  }

  if(page.layout==="quote"){
    return `<section class="ebook-page layout-quote" style="--theme:${theme}">
      <div class="decor-corner"></div><div class="page-content"><div class="quote-mark">“</div><h2>${title}</h2>${paragraph(content)}</div>
    </section>`;
  }

  if(page.layout==="cta"){
    return `<section class="ebook-page layout-cta" style="--theme:${theme}">
      <div class="decor-bottom"></div><div class="page-content"><div class="offer-card"><h2>${title}</h2>${paragraph(content)}<div class="big-button">${cta}</div></div></div>
    </section>`;
  }

  return `<section class="ebook-page layout-classic" style="--theme:${theme}">
    <div class="decor-top"></div><div class="decor-bottom"></div>
    <div class="page-content"><h2>${title}</h2>${paragraph(content)}<div class="note-box">${cta}</div></div>
  </section>`;
}

function render(){
  documentTitle.textContent=ebookTitle.value||"Ebook Baru";
  ebookDocument.innerHTML=pages.map((p,i)=>pageHTML(p,i)).join("");

  pageList.innerHTML=pages.map((p,i)=>{
    const label=layoutLabels[p.layout] || p.layout;
    const chapterNo=chapterLabel(p,i);
    const numberText=p.layout==="cover" ? `${i+1}.` : `${i+1}. Bab ${chapterNo}`;
    const smallText=p.layout==="chapter" ? "Halaman utama bab" : (p.layout==="cover" ? label : `Anak halaman Bab ${chapterNo} • ${label}`);
    return `
      <div class="page-list-item" data-index="${i}">
        <button class="delete-page" type="button" data-index="${i}" title="Hapus halaman">✕</button>
        <div class="page-list-text">
          <strong>${numberText} ${esc(p.title)}</strong>
          <small>${esc(smallText)}</small>
        </div>
      </div>
    `;
  }).join("");

  localStorage.setItem("cdp-ebook-builder-pages",JSON.stringify(pages));
}

function deletePage(index){
  const page=pages[index];
  if(!page) return;

  const ok=confirm(`Hapus halaman ${index+1}: ${page.title || "Tanpa Judul"}?`);
  if(!ok) return;

  pages.splice(index,1);
  render();
}

pageList.addEventListener("click",e=>{
  const btn=e.target.closest(".delete-page");
  if(!btn) return;

  const index=Number(btn.dataset.index);
  deletePage(index);
});

function addPage(){
  pages.push({layout:layoutSelect.value,title:pageTitle.value,content:pageContent.value,cta:pageCta.value,image:uploadedImage,theme:themeColor.value,author:authorName.value});
  uploadedImage="";
  pageImageInput.value="";
  render();
}

pageImageInput.addEventListener("change",e=>{
  const file=e.target.files[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{uploadedImage=ev.target.result;};
  reader.readAsDataURL(file);
});

addPageBtn.addEventListener("click",addPage);

layoutSelect.addEventListener("change",()=>{
  if(layoutSelect.value==="chapter"){
    if(pageTitle.value==="Judul Halaman Premium" || pageTitle.value.trim()==="") pageTitle.value="Judul Bab Baru";
    if(pageCta.value==="Mulai praktekkan hari ini" || pageCta.value.trim()==="") pageCta.value="Baca dan pahami maknanya";
  }else if(layoutSelect.value!=="cover"){
    if(pageTitle.value==="Judul Bab Baru" || pageTitle.value.trim()==="") pageTitle.value="Judul Halaman Premium";
  }
});


[ebookTitle,authorName,themeColor].forEach(el=>{
  el.addEventListener("input",()=>{
    pages=pages.map(p=>({...p,theme:themeColor.value,author:authorName.value}));
    render();
  });
});

clearBtn.addEventListener("click",()=>{
  if(confirm("Hapus semua halaman ebook?")){
    localStorage.removeItem("cdp-ebook-builder-pages");
    seedPages();
    render();
  }
});

printBtn.addEventListener("click",()=>window.print());

async function waitImages(){
  const imgs=[...ebookDocument.querySelectorAll("img")];
  await Promise.all(imgs.map(img=>{
    if(img.complete) return Promise.resolve();
    return new Promise(resolve=>{img.onload=resolve;img.onerror=resolve;});
  }));
}

function safeFilename(value){
  return String(value||"CreatorDigitalPro-Ebook")
    .trim()
    .replace(/[^a-zA-Z0-9\-_]+/g,"-")
    .replace(/-+/g,"-")
    .replace(/^-|-$/g,"") || "CreatorDigitalPro-Ebook";
}

function downloadDataUrl(dataUrl, filename){
  const link=document.createElement("a");
  link.href=dataUrl;
  link.download=filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}


exportJpgBtn.addEventListener("click",async()=>{
  if(!window.html2canvas){
    alert("Library JPG belum termuat. Pastikan koneksi internet aktif, lalu refresh halaman.");
    return;
  }
  if(!window.JSZip){
    alert("Library ZIP belum termuat. Pastikan koneksi internet aktif, lalu refresh halaman.");
    return;
  }

  const ebookPages=[...ebookDocument.querySelectorAll(".ebook-page")];
  if(!ebookPages.length){
    alert("Belum ada halaman ebook untuk diexport.");
    return;
  }

  const oldText=exportJpgBtn.textContent;
  exportJpgBtn.disabled=true;
  document.body.classList.add("export-mode");

  try{
    if(document.fonts && document.fonts.ready) await document.fonts.ready;
    await waitImages();

    const baseName=safeFilename(ebookTitle.value || "CreatorDigitalPro-Ebook");
    const zip=new JSZip();
    const folder=zip.folder(baseName) || zip;

    for(const [i,page] of ebookPages.entries()){
      exportJpgBtn.textContent=`Membuat JPG ${i+1}/${ebookPages.length}...`;

      const captureWrap=document.createElement("div");
      captureWrap.className="export-capture-wrap";

      const clonedPage=page.cloneNode(true);
      clonedPage.style.width="794px";
      clonedPage.style.height="1123px";
      clonedPage.style.minHeight="1123px";
      clonedPage.style.transform="none";
      clonedPage.style.boxShadow="none";

      captureWrap.appendChild(clonedPage);
      document.body.appendChild(captureWrap);

      const canvas=await html2canvas(clonedPage,{
        scale:2,
        useCORS:true,
        allowTaint:true,
        backgroundColor:"#ffffff",
        logging:false,
        scrollX:0,
        scrollY:0,
        width:794,
        height:1123,
        windowWidth:794,
        windowHeight:1123
      });

      captureWrap.remove();

      const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/jpeg",0.95));
      folder.file(`${baseName}-halaman-${String(i+1).padStart(2,"0")}.jpg`,blob);
      await new Promise(resolve=>setTimeout(resolve,80));
    }

    exportJpgBtn.textContent="Membuat file ZIP...";
    const zipBlob=await zip.generateAsync({type:"blob"},metadata=>{
      exportJpgBtn.textContent=`Membuat ZIP ${Math.round(metadata.percent)}%...`;
    });

    const link=document.createElement("a");
    link.href=URL.createObjectURL(zipBlob);
    link.download=`${baseName}-semua-halaman-jpg.zip`;
    document.body.appendChild(link);
    link.click();

    setTimeout(()=>{
      URL.revokeObjectURL(link.href);
      link.remove();
    },1000);

    alert("Export selesai. Semua halaman JPG sudah masuk ke dalam 1 file ZIP.");
  }catch(error){
    console.error("EXPORT ZIP JPG ERROR:",error);
    alert("Export ZIP JPG gagal. Cek Console F12.");
  }finally{
    document.body.classList.remove("export-mode");
    exportJpgBtn.disabled=false;
    exportJpgBtn.textContent=oldText;
  }
});


function seedPages(){
  pages=[
    {layout:"cover",title:"Rahasia Konten Digital",content:"Panduan praktis membuat konten, membangun audiens, dan menjual produk digital dengan tampilan profesional.",cta:"Mulai Sekarang",image:"",theme:"#06d6d6",author:"CreatorDigitalPro"},
    {layout:"chapter",title:"Mengapa Ebook Masih Menjual",content:"Ebook adalah produk digital yang mudah dibuat, mudah didistribusikan, dan bisa menjadi aset penjualan jangka panjang.",cta:"Pelajari konsepnya",image:"",theme:"#06d6d6",author:"CreatorDigitalPro"},
    {layout:"imageTop",title:"Bangun Nilai Dari Pengetahuan",content:"Setiap pengalaman, skill, dan strategi bisa diubah menjadi materi ebook yang bermanfaat. Kuncinya adalah menyusun informasi dengan jelas dan menarik.",cta:"Tips: mulai dari masalah pembaca",image:"",theme:"#06d6d6",author:"CreatorDigitalPro"},
    {layout:"imageSide",title:"Buat Tampilan Lebih Premium",content:"Desain visual membantu pembaca merasa produk Anda bernilai. Gunakan gambar, warna, dan struktur halaman yang rapi.",cta:"Desain menaikkan persepsi harga",image:"",theme:"#06d6d6",author:"CreatorDigitalPro"},
    {layout:"quote",title:"Produk digital yang bagus bukan hanya berisi informasi, tetapi memberi rasa percaya kepada pembelinya.",content:"Gunakan halaman quote untuk memperkuat pesan utama ebook Anda.",cta:"",image:"",theme:"#06d6d6",author:"CreatorDigitalPro"},
    {layout:"cta",title:"Siap Menjual Ebook Anda?",content:"Gunakan halaman CTA untuk mengarahkan pembaca membeli produk, bergabung ke komunitas, atau mengunjungi link penjualan Anda.",cta:"Kunjungi Lynk.id Anda",image:"",theme:"#06d6d6",author:"CreatorDigitalPro"}
  ];
}

(function init(){
  const saved=localStorage.getItem("cdp-ebook-builder-pages");
  if(saved){
    try{pages=JSON.parse(saved);}catch(e){seedPages();}
  }else{
    seedPages();
  }
  render();
})();






