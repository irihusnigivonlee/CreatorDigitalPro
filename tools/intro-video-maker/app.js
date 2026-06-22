const canvas = document.getElementById('introCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1920; canvas.height = 1080;

const $ = (id) => document.getElementById(id);
const titleInput = $('titleInput');
const subtitleInput = $('subtitleInput');
const bgInput = $('bgInput');
const logoInput = $('logoInput');
const musicInput = $('musicInput');
const templateSelect = $('templateSelect');
const templateTitle = $('templateTitle');
const logoSizeInput = $('logoSize');
const titleSizeInput = $('titleSize');
const subtitleSizeInput = $('subtitleSize');
const titleColorInput = $('titleColor');
const subtitleColorInput = $('subtitleColor');
const accentColorInput = $('accentColor');
const playBtn = $('playBtn');
const pauseBtn = $('pauseBtn');
const resetBtn = $('resetBtn');
const saveProjectBtn = $('saveProjectBtn');
const loadProjectBtn = $('loadProjectBtn');
const exportPngBtn = $('exportPngBtn');
const exportWebmBtn = $('exportWebmBtn');
const timelineSlider = $('timelineSlider');
const timelineLabel = $('timelineLabel');

const templateNames = {
  'creator-classic':'Creator Classic',
  'gaming-neon':'Gaming Neon',
  'business-elite':'Business Elite',
  'breaking-news':'Breaking News',
  'islamic-premium':'Islamic Premium'
};

const backgroundImage = new Image();
const logoImage = new Image();
backgroundImage.crossOrigin = 'anonymous';
logoImage.crossOrigin = 'anonymous';
backgroundImage.src = './assets/default-bg.jpg';
logoImage.src = './assets/default-logo.png';

let audioPlayer = null;
let audioContext = null;
let audioDestination = null;
let titleText = titleInput.value.trim();
let subtitleText = subtitleInput.value.trim();
let currentTemplate = templateSelect.value;
let titleColor = titleColorInput.value;
let subtitleColor = subtitleColorInput.value;
let accentColor = accentColorInput.value;
let logoSize = Number(logoSizeInput.value);
let titleSize = Number(titleSizeInput.value);
let subtitleSize = Number(subtitleSizeInput.value);
let currentTime = 0;
let duration = 10;
let playing = false;
let animationId = null;

function hexToRgb(hex){
  const v = hex.replace('#','');
  const n = parseInt(v.length === 3 ? v.split('').map(x=>x+x).join('') : v, 16);
  return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};
}
function rgba(hex, a){const c=hexToRgb(hex); return `rgba(${c.r},${c.g},${c.b},${a})`;}
function easeOutCubic(t){return 1 - Math.pow(1 - Math.max(0,Math.min(1,t)), 3);}
function easeInOut(t){t=Math.max(0,Math.min(1,t));return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;}
function setShadow(color, blur=40){ctx.shadowColor=color;ctx.shadowBlur=blur;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;}
function fitText(text, maxWidth, fontSize, weight=900){
  let size = fontSize;
  do { ctx.font = `${weight} ${size}px Montserrat`; if(ctx.measureText(text).width <= maxWidth) break; size -= 4; } while(size > 32);
  return size;
}
function drawWrappedText(text,x,y,maxWidth,lineHeight,fontSize,weight,color,align='center'){
  const words = String(text).split(/\s+/); let line=''; let lines=[];
  ctx.font = `${weight} ${fontSize}px Montserrat`;
  words.forEach(w=>{const test=line?line+' '+w:w; if(ctx.measureText(test).width>maxWidth && line){lines.push(line); line=w;} else line=test;});
  if(line) lines.push(line);
  ctx.textAlign=align; ctx.fillStyle=color;
  lines.slice(0,2).forEach((ln,i)=>ctx.fillText(ln,x,y+(i*lineHeight)));
}

function drawBaseBackground(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(backgroundImage.complete && backgroundImage.naturalWidth){ctx.drawImage(backgroundImage,0,0,canvas.width,canvas.height);} else {ctx.fillStyle='#020617';ctx.fillRect(0,0,canvas.width,canvas.height);}  
}
function overlayGradient(colors){
  const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
  colors.forEach(([stop,color])=>g.addColorStop(stop,color));
  ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,canvas.height);
}
function drawLogo(cx,cy,size,alpha=1,shape='circle'){
  if(!logoImage.complete) return;
  ctx.save(); ctx.globalAlpha=alpha;
  ctx.beginPath();
  if(shape==='rounded'){roundRect(cx-size/2,cy-size/2,size,size,42);ctx.clip();}
  else {ctx.arc(cx,cy,size/2,0,Math.PI*2);ctx.clip();}
  ctx.drawImage(logoImage,cx-size/2,cy-size/2,size,size);
  ctx.restore();
}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function drawGrid(color='rgba(255,255,255,.08)'){
  ctx.save();ctx.strokeStyle=color;ctx.lineWidth=1;
  for(let x=0;x<canvas.width;x+=80){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
  for(let y=0;y<canvas.height;y+=80){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
  ctx.restore();
}
function drawParticles(t,color){
  ctx.save();ctx.fillStyle=color;
  for(let i=0;i<70;i++){const x=(i*173 + t*80)%canvas.width; const y=(i*97 + Math.sin(t+i)*22)%canvas.height; ctx.globalAlpha=.18+(i%5)*.05; ctx.beginPath();ctx.arc(x,y,2+(i%4),0,Math.PI*2);ctx.fill();}
  ctx.restore();
}

function drawCreatorClassic(t,p){
  drawBaseBackground(); overlayGradient([[0,'rgba(2,6,23,.82)'],[.55,rgba(accentColor,.28)],[1,'rgba(0,212,255,.22)']]); drawParticles(t,rgba(accentColor,.65));
  const logoP=easeOutCubic(Math.min(t/2,1)); const titleP=easeOutCubic(Math.max(0,Math.min((t-1.7)/2.2,1))); const subP=easeOutCubic(Math.max(0,Math.min((t-3.8)/1.5,1)));
  ctx.save(); setShadow(accentColor,60); ctx.strokeStyle=rgba(accentColor,.7); ctx.lineWidth=5; ctx.beginPath();ctx.arc(960,300,logoSize*.67+18*Math.sin(t*2),0,Math.PI*2*p);ctx.stroke();ctx.restore();
  drawLogo(960,300,logoSize*logoP,logoP,'circle');
  ctx.save(); ctx.globalAlpha=titleP; setShadow(accentColor,55); const s=fitText(titleText,1450,titleSize); ctx.font=`900 ${s}px Montserrat`; ctx.textAlign='center'; ctx.fillStyle=titleColor; ctx.fillText(titleText,960,620); ctx.restore();
  ctx.save(); ctx.globalAlpha=subP; ctx.font=`700 ${subtitleSize}px Montserrat`; ctx.textAlign='center'; ctx.fillStyle=subtitleColor; ctx.fillText(subtitleText,960,705); ctx.restore();
  ctx.fillStyle=accentColor; ctx.fillRect(460,760,1000*easeInOut(Math.max(0,Math.min((t-5)/2,1))),8);
}
function drawGamingNeon(t,p){
  drawBaseBackground(); overlayGradient([[0,'rgba(5,0,20,.88)'],[.45,'rgba(64,0,120,.45)'],[1,'rgba(0,255,255,.2)']]); drawGrid('rgba(0,255,255,.11)'); drawParticles(t,'rgba(255,0,255,.75)');
  const glitch=Math.sin(t*22)*10; const logoP=easeOutCubic(Math.min(t/1.7,1));
  ctx.save(); ctx.strokeStyle='rgba(0,255,255,.75)'; ctx.lineWidth=6; roundRect(700+glitch,170,520,260,46); ctx.stroke(); ctx.strokeStyle='rgba(255,0,255,.55)'; roundRect(690-glitch,160,540,280,52); ctx.stroke(); ctx.restore();
  drawLogo(960+glitch*.2,300,logoSize*logoP,logoP,'rounded');
  const titleP=easeOutCubic(Math.max(0,Math.min((t-1.5)/2,1))); ctx.save(); ctx.globalAlpha=titleP; ctx.font=`900 ${fitText(titleText,1500,titleSize)}px Montserrat`; ctx.textAlign='center'; setShadow('#00ffff',70); ctx.fillStyle=titleColor; ctx.fillText(titleText,960+glitch,620); ctx.fillStyle='rgba(255,0,255,.35)';ctx.fillText(titleText,952-glitch,620); ctx.restore();
  ctx.save(); ctx.globalAlpha=easeOutCubic(Math.max(0,Math.min((t-3.7)/1.4,1))); ctx.font=`800 ${subtitleSize}px Montserrat`; ctx.textAlign='center'; ctx.fillStyle=subtitleColor; setShadow('#ff00ff',50); ctx.fillText(subtitleText,960,715); ctx.restore();
  ctx.fillStyle='#00ffff'; ctx.fillRect(0,1026,canvas.width*p,18); ctx.fillStyle='#ff00ff'; ctx.fillRect(canvas.width-(canvas.width*p),1050,canvas.width*p,18);
}
function drawBusinessElite(t,p){
  drawBaseBackground(); overlayGradient([[0,'rgba(0,0,0,.88)'],[.58,'rgba(65,38,0,.5)'],[1,'rgba(2,6,23,.9)']]);
  const gold=accentColor || '#fbbf24';
  ctx.save(); ctx.strokeStyle=rgba(gold,.35); ctx.lineWidth=2; for(let i=0;i<10;i++){ctx.strokeRect(220+i*16,120+i*16,1480-i*32,780-i*32);} ctx.restore();
  const logoP=easeOutCubic(Math.min(t/2,1)); ctx.save(); setShadow(gold,70); ctx.fillStyle=rgba(gold,.12); roundRect(790,145,340,340,65); ctx.fill(); ctx.restore(); drawLogo(960,315,logoSize*logoP,logoP,'rounded');
  ctx.save(); ctx.globalAlpha=easeOutCubic(Math.max(0,Math.min((t-2)/2,1))); ctx.font=`900 ${fitText(titleText,1400,titleSize)}px Montserrat`; ctx.textAlign='center'; setShadow(gold,44); ctx.fillStyle=titleColor; ctx.fillText(titleText,960,650); ctx.restore();
  ctx.save(); ctx.globalAlpha=easeOutCubic(Math.max(0,Math.min((t-4)/1.5,1))); ctx.font=`600 ${subtitleSize}px Montserrat`; ctx.textAlign='center'; ctx.fillStyle=subtitleColor; ctx.fillText(subtitleText,960,735); ctx.restore();
  ctx.fillStyle=rgba(gold,.86); ctx.fillRect(560,790,800*easeInOut(Math.max(0,Math.min((t-5)/2,1))),5);
}
function drawBreakingNews(t,p){
  drawBaseBackground(); overlayGradient([[0,'rgba(10,0,0,.84)'],[.55,'rgba(127,29,29,.62)'],[1,'rgba(2,6,23,.66)']]);
  ctx.save(); ctx.fillStyle='rgba(220,38,38,.95)'; ctx.fillRect(0,0,canvas.width,110); ctx.fillRect(0,880,canvas.width,120); ctx.fillStyle='#fff'; ctx.font='900 48px Montserrat'; ctx.textAlign='left'; ctx.fillText('BREAKING NEWS',80,72); ctx.font='800 34px Montserrat'; ctx.fillText('LIVE UPDATE • CREATOR DIGITAL PRO • PREMIUM INTRO',80-(t*160%900),955); ctx.restore();
  drawLogo(960,330,logoSize*easeOutCubic(Math.min(t/1.8,1)),easeOutCubic(Math.min(t/1.8,1)),'circle');
  ctx.save(); ctx.globalAlpha=easeOutCubic(Math.max(0,Math.min((t-1.8)/2,1))); setShadow('#ef4444',55); ctx.font=`900 ${fitText(titleText,1500,titleSize)}px Montserrat`; ctx.textAlign='center'; ctx.fillStyle=titleColor; ctx.fillText(titleText,960,630); ctx.restore();
  ctx.save(); ctx.globalAlpha=easeOutCubic(Math.max(0,Math.min((t-3.8)/1.3,1))); ctx.fillStyle='rgba(239,68,68,.92)'; roundRect(520,675,880,90,14); ctx.fill(); ctx.font=`800 ${Math.min(subtitleSize,48)}px Montserrat`; ctx.fillStyle=subtitleColor; ctx.textAlign='center'; ctx.fillText(subtitleText,960,735); ctx.restore();
}
function drawIslamicPremium(t,p){
  drawBaseBackground(); overlayGradient([[0,'rgba(1,40,29,.9)'],[.5,'rgba(6,78,59,.55)'],[1,'rgba(0,0,0,.72)']]);
  const gold=accentColor || '#d4af37';
  ctx.save(); ctx.strokeStyle=rgba(gold,.45); ctx.lineWidth=4; for(let i=0;i<18;i++){ctx.beginPath();ctx.arc(960,340,150+i*18,Math.PI*.15+t*.08,Math.PI*.85+t*.08);ctx.stroke();} ctx.restore();
  ctx.save(); ctx.fillStyle=rgba(gold,.18); ctx.beginPath(); ctx.arc(830,260,92,0,Math.PI*2); ctx.arc(860,240,92,0,Math.PI*2,true); ctx.fill('evenodd'); ctx.restore();
  drawLogo(960,330,logoSize*easeOutCubic(Math.min(t/2,1)),easeOutCubic(Math.min(t/2,1)),'circle');
  ctx.save(); ctx.globalAlpha=easeOutCubic(Math.max(0,Math.min((t-2)/2,1))); setShadow(gold,55); ctx.font=`900 ${fitText(titleText,1450,titleSize)}px Montserrat`; ctx.textAlign='center'; ctx.fillStyle=titleColor; ctx.fillText(titleText,960,645); ctx.restore();
  ctx.save(); ctx.globalAlpha=easeOutCubic(Math.max(0,Math.min((t-4)/1.5,1))); ctx.font=`700 ${subtitleSize}px Montserrat`; ctx.textAlign='center'; ctx.fillStyle=subtitleColor; ctx.fillText(subtitleText,960,730); ctx.restore();
  ctx.strokeStyle=rgba(gold,.8); ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(600,790); ctx.quadraticCurveTo(960,840,1320,790); ctx.stroke();
}

function drawIntro(){
  const p = currentTime/duration;
  const t = currentTime;
  if(currentTemplate==='gaming-neon') drawGamingNeon(t,p);
  else if(currentTemplate==='business-elite') drawBusinessElite(t,p);
  else if(currentTemplate==='breaking-news') drawBreakingNews(t,p);
  else if(currentTemplate==='islamic-premium') drawIslamicPremium(t,p);
  else drawCreatorClassic(t,p);
  ctx.save(); ctx.fillStyle='rgba(255,255,255,.22)'; ctx.fillRect(0,1064,canvas.width,16); ctx.fillStyle=accentColor; ctx.fillRect(0,1064,canvas.width*p,16); ctx.restore();
  if(window.CDPDemoGuard && window.CDPDemoGuard.isLoggedIn && window.CDPDemoGuard.isLoggedIn() && window.CDPDemoGuard.watermarkCanvas){
    window.CDPDemoGuard.watermarkCanvas(canvas);
  }
}
function updateTimeline(){ timelineSlider.value=currentTime.toFixed(1); timelineLabel.textContent=`${currentTime.toFixed(1)}s / 10.0s`; }
function animate(){ if(!playing) return; currentTime += 1/60; if(currentTime>=duration){currentTime=duration; playing=false; if(audioPlayer){audioPlayer.pause(); audioPlayer.currentTime=0;} if(window.webmRecorder && window.webmRecorder.state==='recording') window.webmRecorder.stop();} updateTimeline(); drawIntro(); if(playing) animationId=requestAnimationFrame(animate); }
function setTemplate(value){ currentTemplate=value; templateSelect.value=value; templateTitle.textContent=templateNames[value] || 'Intro Studio Pro'; document.querySelectorAll('.template-mini').forEach(btn=>btn.classList.toggle('active',btn.dataset.template===value)); drawIntro(); }
function readState(){ titleText=titleInput.value.trim()||'WELCOME TO MY CHANNEL'; subtitleText=subtitleInput.value.trim()||'CreatorDigitalPro Studio'; titleColor=titleColorInput.value; subtitleColor=subtitleColorInput.value; accentColor=accentColorInput.value; logoSize=Number(logoSizeInput.value); titleSize=Number(titleSizeInput.value); subtitleSize=Number(subtitleSizeInput.value); $('logoSizeLabel').textContent=logoSize; $('titleSizeLabel').textContent=titleSize; $('subtitleSizeLabel').textContent=subtitleSize; drawIntro(); }

[titleInput,subtitleInput,titleColorInput,subtitleColorInput,accentColorInput,logoSizeInput,titleSizeInput,subtitleSizeInput].forEach(el=>el.addEventListener('input',readState));
templateSelect.addEventListener('change',()=>setTemplate(templateSelect.value));
document.querySelectorAll('.template-mini').forEach(btn=>btn.addEventListener('click',()=>setTemplate(btn.dataset.template)));
bgInput.addEventListener('change',e=>{const f=e.target.files[0]; if(f) backgroundImage.src=URL.createObjectURL(f);});
logoInput.addEventListener('change',e=>{const f=e.target.files[0]; if(f) logoImage.src=URL.createObjectURL(f);});
musicInput.addEventListener('change',e=>{const f=e.target.files[0]; if(f){audioPlayer = new Audio(URL.createObjectURL(f)); audioPlayer.preload='auto';}});
playBtn.addEventListener('click',()=>{ if(playing) return; playing=true; if(audioPlayer){audioPlayer.currentTime=currentTime; audioPlayer.play().catch(()=>{});} animate();});
pauseBtn.addEventListener('click',()=>{playing=false; cancelAnimationFrame(animationId); if(audioPlayer) audioPlayer.pause();});
resetBtn.addEventListener('click',()=>{playing=false; cancelAnimationFrame(animationId); if(audioPlayer){audioPlayer.pause(); audioPlayer.currentTime=0;} currentTime=0; updateTimeline(); drawIntro();});
timelineSlider.addEventListener('input',()=>{currentTime=Number(timelineSlider.value); updateTimeline(); drawIntro();});
saveProjectBtn.addEventListener('click',()=>{readState(); localStorage.setItem('cdp-intro-v2-project',JSON.stringify({titleText,subtitleText,titleColor,subtitleColor,accentColor,logoSize,titleSize,subtitleSize,currentTemplate})); alert('Project Intro berhasil disimpan.');});
loadProjectBtn.addEventListener('click',()=>{const data=localStorage.getItem('cdp-intro-v2-project'); if(!data) return alert('Belum ada project tersimpan.'); const p=JSON.parse(data); titleInput.value=p.titleText||titleText; subtitleInput.value=p.subtitleText||subtitleText; titleColorInput.value=p.titleColor||titleColor; subtitleColorInput.value=p.subtitleColor||subtitleColor; accentColorInput.value=p.accentColor||accentColor; logoSizeInput.value=p.logoSize||logoSize; titleSizeInput.value=p.titleSize||titleSize; subtitleSizeInput.value=p.subtitleSize||subtitleSize; readState(); setTemplate(p.currentTemplate||'creator-classic'); alert('Project Intro berhasil dibuka.');});
exportPngBtn.addEventListener('click',()=>{drawIntro(); const a=document.createElement('a'); a.download=`CreatorDigitalPro-${currentTemplate}.png`; a.href=canvas.toDataURL('image/png'); a.click();});
exportWebmBtn.addEventListener('click',startWebmRecording);
function startWebmRecording(){
  if(!canvas.captureStream || !window.MediaRecorder){alert('Browser ini belum mendukung export WEBM. Gunakan Chrome/Edge terbaru.'); return;}
  const stream = canvas.captureStream(60);
  if(audioPlayer){
    try{
      if(!audioContext){audioContext = new (window.AudioContext || window.webkitAudioContext)(); audioDestination = audioContext.createMediaStreamDestination(); const source = audioContext.createMediaElementSource(audioPlayer); source.connect(audioDestination); source.connect(audioContext.destination);}
      audioDestination.stream.getAudioTracks().forEach(track=>stream.addTrack(track));
    }catch(e){console.warn('Audio tidak ikut direkam:', e);}
  }
  const chunks=[]; let options={mimeType:'video/webm;codecs=vp9'}; if(!MediaRecorder.isTypeSupported(options.mimeType)) options={mimeType:'video/webm'};
  const recorder = new MediaRecorder(stream, options); window.webmRecorder=recorder;
  recorder.ondataavailable=e=>{if(e.data && e.data.size) chunks.push(e.data);};
  recorder.onstop=()=>{const blob=new Blob(chunks,{type:'video/webm'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`CreatorDigitalPro-${currentTemplate}.webm`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);};
  currentTime=0; updateTimeline(); playing=true; if(audioPlayer){audioPlayer.currentTime=0; audioPlayer.play().catch(()=>{});} recorder.start(); animate();
}
backgroundImage.onload=drawIntro; logoImage.onload=drawIntro; window.addEventListener('load',()=>{readState(); setTemplate('creator-classic'); drawIntro();});
