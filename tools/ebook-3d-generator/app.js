import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('ebookCanvas');
const coverInput = document.getElementById('coverInput');
const modelSelect = document.getElementById('modelSelect');
const bgSelect = document.getElementById('bgSelect');
const rotateY = document.getElementById('rotateY');
const zoomRange = document.getElementById('zoomRange');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');

let scene, camera, renderer, bookGroup, coverTexture, autoRotate = true;
let currentModel = 'standing';

const state = {
  rotateY: -22,
  zoom: 92,
  bg: 'aurora'
};

init();
animate();
initUI();

function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0.4, 7.2);

  renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, preserveDrawingBuffer:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const hemi = new THREE.HemisphereLight(0xffffff, 0x243056, 1.2);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(4, 6, 4);
  key.castShadow = true;
  key.shadow.mapSize.width = 2048;
  key.shadow.mapSize.height = 2048;
  scene.add(key);

  const rim = new THREE.PointLight(0x42e8ff, 4, 14);
  rim.position.set(-4, 2, 4);
  scene.add(rim);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(3.2, 80),
    new THREE.MeshStandardMaterial({ color:0x06101f, transparent:true, opacity:.38, roughness:.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.72;
  floor.receiveShadow = true;
  scene.add(floor);

  createDefaultTexture();
  buildModel(currentModel);
  resize();
  applyBackground();
  window.addEventListener('resize', resize);
}

function createDefaultTexture(){
  const c = document.createElement('canvas');
  c.width = 900;
  c.height = 1200;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0,0,c.width,c.height);
  grad.addColorStop(0,'#38bdf8');
  grad.addColorStop(.45,'#7c3aed');
  grad.addColorStop(1,'#ff4fd8');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle = 'rgba(255,255,255,.16)';
  for(let i=0;i<18;i++){
    ctx.beginPath();
    ctx.arc(Math.random()*c.width, Math.random()*c.height, Math.random()*70+20, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 86px Inter, Arial';
  ctx.textAlign = 'center';
  ctx.fillText('EBOOK', c.width/2, 455);
  ctx.fillText('PROMO', c.width/2, 555);
  ctx.font = '700 34px Inter, Arial';
  ctx.fillText('CreatorDigitalPro', c.width/2, 675);
  coverTexture = new THREE.CanvasTexture(c);
  coverTexture.colorSpace = THREE.SRGBColorSpace;
}

function makeMat(color, roughness=.55, metalness=.05){
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function buildModel(type){
  if(bookGroup) scene.remove(bookGroup);
  bookGroup = new THREE.Group();
  currentModel = type;

  if(type === 'standing') buildStandingBook();
  if(type === 'box') buildBoxBook();
  if(type === 'tablet') buildTabletBook();
  if(type === 'flat') buildFlatBook();

  bookGroup.rotation.y = THREE.MathUtils.degToRad(state.rotateY);
  scene.add(bookGroup);
}

function addCover(w=2.15, h=3.05, z=.13, x=0, y=0){
  const cover = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ map:coverTexture, roughness:.42, metalness:.02 })
  );
  cover.position.set(x,y,z);
  cover.castShadow = true;
  bookGroup.add(cover);
  return cover;
}

function buildStandingBook(){
  const pages = new THREE.Mesh(new THREE.BoxGeometry(2.22, 3.1, .32), makeMat(0xf3f4f6, .78));
  pages.castShadow = true;
  pages.receiveShadow = true;
  bookGroup.add(pages);

  const spine = new THREE.Mesh(new THREE.BoxGeometry(.18, 3.14, .38), makeMat(0x1e293b, .5));
  spine.position.x = -1.2;
  spine.castShadow = true;
  bookGroup.add(spine);

  const cover = addCover(2.08, 3, .175, .04, 0);
  cover.position.x = .04;
}

function buildBoxBook(){
  const box = new THREE.Mesh(new THREE.BoxGeometry(2.35, 3.05, .72), makeMat(0x0f172a, .45, .1));
  box.castShadow = true;
  box.receiveShadow = true;
  bookGroup.add(box);
  addCover(2.18, 2.86, .365, 0, 0);

  const side = new THREE.Mesh(new THREE.BoxGeometry(.36, 2.88, .74), makeMat(0x38bdf8, .5, .08));
  side.position.x = -1.34;
  side.castShadow = true;
  bookGroup.add(side);
}

function buildTabletBook(){
  const tablet = new THREE.Mesh(new THREE.BoxGeometry(2.55, 3.35, .16), makeMat(0x030712, .35, .18));
  tablet.castShadow = true;
  tablet.receiveShadow = true;
  bookGroup.add(tablet);

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.24, 3.02), new THREE.MeshStandardMaterial({ map:coverTexture, roughness:.2, metalness:.02 }));
  screen.position.z = .086;
  screen.castShadow = true;
  bookGroup.add(screen);
}

function buildFlatBook(){
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.35, 3.18, .18), makeMat(0xf8fafc, .6));
  base.rotation.x = THREE.MathUtils.degToRad(-8);
  base.castShadow = true;
  bookGroup.add(base);
  const cover = addCover(2.2, 3.02, .105, 0, 0);
  cover.rotation.x = THREE.MathUtils.degToRad(-8);
}

function applyBackground(){
  const bg = state.bg;
  if(bg === 'transparent'){
    scene.background = null;
    return;
  }
  const c = document.createElement('canvas');
  c.width = 1200;
  c.height = 900;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0,0,c.width,c.height);
  if(bg === 'aurora'){
    g.addColorStop(0,'#07111f'); g.addColorStop(.45,'#172554'); g.addColorStop(1,'#4c1d95');
  } else if(bg === 'gold'){
    g.addColorStop(0,'#1c1204'); g.addColorStop(.55,'#78350f'); g.addColorStop(1,'#f59e0b');
  } else {
    g.addColorStop(0,'#020617'); g.addColorStop(1,'#111827');
  }
  ctx.fillStyle = g; ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle = 'rgba(255,255,255,.08)';
  for(let i=0;i<28;i++){
    ctx.beginPath(); ctx.arc(Math.random()*c.width, Math.random()*c.height, Math.random()*80+18, 0, Math.PI*2); ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  scene.background = tex;
}

function resize(){
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(320, rect.width);
  const h = Math.max(320, rect.height);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function animate(){
  requestAnimationFrame(animate);
  if(bookGroup && autoRotate){
    const target = THREE.MathUtils.degToRad(state.rotateY);
    bookGroup.rotation.y += (target - bookGroup.rotation.y) * .06;
    bookGroup.rotation.y += .0025;
    bookGroup.rotation.x = Math.sin(Date.now() * .001) * .035;
  }
  camera.position.z = 8 - (state.zoom / 100) * 2.2;
  renderer.render(scene, camera);
}

function initUI(){
  document.getElementById('navToggle')?.addEventListener('click', () => {
    document.getElementById('navMenu')?.classList.toggle('active');
  });

  coverInput.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if(!file) return;
    const url = URL.createObjectURL(file);
    new THREE.TextureLoader().load(url, tex => {
      tex.colorSpace = THREE.SRGBColorSpace;
      coverTexture = tex;
      buildModel(currentModel);
      URL.revokeObjectURL(url);
    });
  });

  modelSelect.addEventListener('change', e => buildModel(e.target.value));
  bgSelect.addEventListener('change', e => { state.bg = e.target.value; applyBackground(); });
  rotateY.addEventListener('input', e => { state.rotateY = Number(e.target.value); autoRotate = false; if(bookGroup) bookGroup.rotation.y = THREE.MathUtils.degToRad(state.rotateY); });
  zoomRange.addEventListener('input', e => { state.zoom = Number(e.target.value); });

  resetBtn.addEventListener('click', () => {
    state.rotateY = -22; state.zoom = 92; state.bg = 'aurora'; autoRotate = true;
    rotateY.value = state.rotateY; zoomRange.value = state.zoom; bgSelect.value = state.bg; modelSelect.value = 'standing';
    applyBackground(); buildModel('standing');
  });

  downloadBtn.addEventListener('click', () => {
    renderer.render(scene, camera);
    const link = document.createElement('a');
    link.download = 'creator-digital-pro-3d-ebook.png';
    link.href = renderer.domElement.toDataURL('image/png');
    link.click();
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('show'); });
  }, { threshold:.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
