/* =========================================
CREATORDIGITALPRO
INTRO STUDIO
APP.JS FINAL V2.0
========================================= */

/* =========================================
SECTION 1
ELEMENTS
========================================= */

const canvas = document.getElementById("introCanvas");

const ctx = canvas.getContext("2d");

/* CANVAS SIZE */

canvas.width = 1920;
canvas.height = 1080;

/* TEXT */

const titleInput = document.getElementById("titleInput");

const subtitleInput = document.getElementById("subtitleInput");

/* FILES */

const bgInput = document.getElementById("bgInput");

const logoInput = document.getElementById("logoInput");

const musicInput = document.getElementById("musicInput");

/* TEMPLATE */

const templateSelect = document.getElementById("templateSelect");

/* SIZE */

const logoSizeInput = document.getElementById("logoSize");

const titleSizeInput = document.getElementById("titleSize");

const subtitleSizeInput = document.getElementById("subtitleSize");

/* COLOR */

const titleColorInput = document.getElementById("titleColor");

const subtitleColorInput = document.getElementById("subtitleColor");

/* BUTTON */

const playBtn = document.getElementById("playBtn");

const pauseBtn = document.getElementById("pauseBtn");

const resetBtn = document.getElementById("resetBtn");

const saveProjectBtn = document.getElementById("saveProjectBtn");

const loadProjectBtn = document.getElementById("loadProjectBtn");

const exportPngBtn = document.getElementById("exportPngBtn");

const exportWebmBtn = document.getElementById("exportWebmBtn");

/* TIMELINE */

const timelineSlider = document.getElementById("timelineSlider");

const timelineLabel = document.getElementById("timelineLabel");

/* =========================================
SECTION 2
ASSETS + VARIABLES
========================================= */

const backgroundImage = new Image();

const logoImage = new Image();

backgroundImage.crossOrigin = "anonymous";

logoImage.crossOrigin = "anonymous";

/* DEFAULT LOCAL FILE */

backgroundImage.src = "./assets/default-bg.jpg";

logoImage.src = "./assets/default-logo.png";

/* AUDIO */

let audioFile = null;
let audioPlayer = null;
let audioContext = null;
let audioDestination = null;

/* TEXT */

let titleText = "WELCOME TO MY CHANNEL";

let subtitleText = "CreatorDigitalPro Studio";

/* STYLE */

let titleColor = "#ffffff";

let subtitleColor = "#00d4ff";

let titleSize = 120;

let subtitleSize = 42;

let logoSize = 220;

/* TEMPLATE */

let currentTemplate = "modern";

/* ANIMATION */

let currentTime = 0;

let duration = 10;

let playing = false;
/* =========================================
WEBM RECORDER
========================================= */

let mediaRecorder = null;

let recordedChunks = [];

let recording = false;

let animationId = null;

/* =========================================
SECTION 3
UPLOAD SYSTEM
========================================= */

/* BACKGROUND */

if (bgInput) {
  bgInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (!file) return;

    backgroundImage.src = URL.createObjectURL(file);
  });
}

/* LOGO */

if (logoInput) {
  logoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (!file) return;

    logoImage.src = URL.createObjectURL(file);
  });
}

/* MUSIC */

if (musicInput) {
  musicInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (!file) return;

    audioFile = file;

    audioPlayer = new Audio(URL.createObjectURL(file));

    audioPlayer.preload = "auto";

    console.log("Music loaded:", file.name);
  });
}
/* =========================================
SECTION 4
LIVE CONTROLS
========================================= */

/* TITLE */

titleInput.addEventListener("input", () => {
  titleText = titleInput.value;
});

/* SUBTITLE */

subtitleInput.addEventListener("input", () => {
  subtitleText = subtitleInput.value;
});

/* TITLE COLOR */

titleColorInput.addEventListener("input", () => {
  titleColor = titleColorInput.value;
});

/* SUBTITLE COLOR */

subtitleColorInput.addEventListener("input", () => {
  subtitleColor = subtitleColorInput.value;
});

/* TITLE SIZE */

titleSizeInput.addEventListener("input", () => {
  titleSize = Number(titleSizeInput.value);
});

/* SUBTITLE SIZE */

subtitleSizeInput.addEventListener("input", () => {
  subtitleSize = Number(subtitleSizeInput.value);
});

/* LOGO SIZE */

logoSizeInput.addEventListener("input", () => {
  logoSize = Number(logoSizeInput.value);
});

/* TEMPLATE */

templateSelect.addEventListener("change", () => {
  currentTemplate = templateSelect.value;
});

/* =========================================
RENDER ENGINE V3
========================================= */

function drawBackground() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawOverlay() {
  ctx.fillStyle = "rgba(0,0,0,.45)";

  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawLogo(logoAlpha) {
  ctx.save();

  ctx.globalAlpha = logoAlpha;

  const centerX = canvas.width / 2;

  const centerY = 300;

  ctx.beginPath();

  ctx.arc(centerX, centerY, logoSize / 2, 0, Math.PI * 2);

  ctx.clip();

  ctx.drawImage(
    logoImage,
    centerX - logoSize / 2,
    centerY - logoSize / 2,
    logoSize,
    logoSize,
  );

  ctx.restore();
}

function drawTitle(text, color) {
  ctx.font = `900 ${titleSize}px Montserrat`;

  ctx.fillStyle = color;

  ctx.textAlign = "center";

  ctx.fillText(text, canvas.width / 2, 600);
}

/* =========================================
SECTION 5
DRAW ENGINE
========================================= */

function drawIntro() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* =========================================
BACKGROUND
========================================= */

  drawBackground();

  /* =========================================
OVERLAY
========================================= */

  drawOverlay();

  /* =========================================
TEMPLATE COLORS
========================================= */

  let activeTitleColor = titleColor;

  let activeSubtitleColor = subtitleColor;

  switch (currentTemplate) {
    case "gaming":
      activeTitleColor = "#ffea00";

      activeSubtitleColor = "#ff3b30";

      break;

    case "corporate":
      activeTitleColor = "#ffffff";

      activeSubtitleColor = "#00d4ff";

      break;

    case "neon":
      activeTitleColor = "#00ffff";

      activeSubtitleColor = "#ff00ff";

      break;

    case "cinematic":
      activeTitleColor = "#f8fafc";

      activeSubtitleColor = "#fbbf24";

      break;
  }

  /* =========================================
TIME CALCULATION
========================================= */

  const progress = currentTime / duration;

  /* =========================================
LOGO FADE IN
0s - 2s
========================================= */

  let logoAlpha = 1;

  if (currentTime <= 2) {
    logoAlpha = currentTime / 2;
  }

  drawLogo(logoAlpha);

  /* =========================================
TITLE TYPEWRITER
2s - 4s
========================================= */

  let visibleTitle = "";

  if (currentTime >= 2) {
    const titleProgress = Math.min((currentTime - 2) / 2, 1);

    const totalChars = Math.floor(titleText.length * titleProgress);

    visibleTitle = titleText.substring(0, totalChars);
  }

  /* TITLE */

  if (currentTime < 8) {
    drawTitle(visibleTitle, activeTitleColor);
  }

  /* =========================================
SUBTITLE FADE
4s - 6s
========================================= */

  if (currentTime >= 4) {
    let subtitleAlpha = Math.min((currentTime - 4) / 2, 1);

    ctx.save();

    ctx.globalAlpha = subtitleAlpha;

    ctx.font = `600 ${subtitleSize}px Montserrat`;

    ctx.fillStyle = activeSubtitleColor;

    ctx.textAlign = "center";

    ctx.fillText(subtitleText, canvas.width / 2, 700);

    ctx.restore();
  }

  /* =========================================
PROGRESS LINE
6s - 8s
========================================= */

  if (currentTime >= 6) {
    const lineProgress = Math.min((currentTime - 6) / 2, 1);

    ctx.fillStyle = activeTitleColor;

    ctx.fillRect(360, 760, 1200 * lineProgress, 10);
  }

  /* =========================================
ENDING GLOW
8s - 10s
========================================= */

  if (currentTime >= 8) {
    ctx.save();

    ctx.shadowColor = activeTitleColor;

    ctx.shadowBlur = 40;

    ctx.font = `900 ${titleSize}px Montserrat`;

    ctx.fillStyle = activeTitleColor;

    ctx.textAlign = "center";

    ctx.fillText(visibleTitle, canvas.width / 2, 620);

    ctx.restore();
  }

  /* =========================================
BOTTOM PROGRESS BAR
========================================= */

  ctx.fillStyle = "#7c5cff";

  ctx.fillRect(0, 1050, canvas.width * progress, 30);
}

/* =========================================
SECTION 6
ANIMATION ENGINE
========================================= */

function animate() {
  if (!playing) {
    return;
  }

  currentTime += 1 / 60;

  if (currentTime >= duration) {
    currentTime = duration;

    drawIntro();

    playing = false;

    cancelAnimationFrame(animationId);

    if (audioPlayer) {
      audioPlayer.pause();

      audioPlayer.currentTime = 0;
    }

    if (window.webmRecorder) {
      window.webmRecorder.stop();
    }

    return;
  }

  timelineSlider.value = currentTime;

  if (timelineLabel) {
    timelineLabel.textContent = currentTime.toFixed(1) + "s / 10.0s";
  }

  drawIntro();

  animationId = requestAnimationFrame(animate);
}
/* =========================================
SECTION 7
PLAY
========================================= */

if (playBtn) {
  playBtn.addEventListener("click", () => {
    if (playing) {
      return;
    }

    playing = true;

    if (audioPlayer) {
      audioPlayer.currentTime = currentTime;

      audioPlayer.play();
    }

    animate();
  });
}

/* =========================================
SECTION 8
PAUSE
========================================= */

if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    playing = false;

    cancelAnimationFrame(animationId);
  });
}

/* =========================================
SECTION 9
RESET
========================================= */

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    playing = false;

    if (audioPlayer) {
      audioPlayer.pause();
    }

    cancelAnimationFrame(animationId);

    currentTime = 0;

    timelineSlider.value = 0;

    if (timelineLabel) {
      timelineLabel.textContent = "0.0s / 10.0s";
    }

    drawIntro();
  });
}

/* =========================================
SECTION 10
TIMELINE
========================================= */

if (timelineSlider) {
  timelineSlider.addEventListener("input", () => {
    currentTime = Number(timelineSlider.value);

    if (timelineLabel) {
      timelineLabel.textContent = currentTime.toFixed(1) + "s / 10.0s";
    }

    drawIntro();
  });
}

/* =========================================
SECTION 11
SAVE PROJECT
========================================= */

if (saveProjectBtn) {
  saveProjectBtn.addEventListener("click", () => {
    const project = {
      titleText,

      subtitleText,

      titleColor,

      subtitleColor,

      titleSize,

      subtitleSize,

      logoSize,

      currentTemplate,
    };

    localStorage.setItem(
      "cdp-intro-project",

      JSON.stringify(project),
    );

    alert("Project berhasil disimpan");
  });
}

/* =========================================
SECTION 12
LOAD PROJECT
========================================= */

if (loadProjectBtn) {
  loadProjectBtn.addEventListener("click", () => {
    const data = localStorage.getItem("cdp-intro-project");

    if (!data) {
      alert("Belum ada project tersimpan");

      return;
    }

    const project = JSON.parse(data);

    titleText = project.titleText;

    subtitleText = project.subtitleText;

    titleColor = project.titleColor;

    subtitleColor = project.subtitleColor;

    titleSize = project.titleSize;

    subtitleSize = project.subtitleSize;

    logoSize = project.logoSize;

    currentTemplate = project.currentTemplate;

    /* APPLY TO FORM */

    titleInput.value = titleText;

    subtitleInput.value = subtitleText;

    titleColorInput.value = titleColor;

    subtitleColorInput.value = subtitleColor;

    titleSizeInput.value = titleSize;

    subtitleSizeInput.value = subtitleSize;

    logoSizeInput.value = logoSize;

    templateSelect.value = currentTemplate;

    drawIntro();

    alert("Project berhasil dibuka");
  });
}

/* =========================================
SECTION 13
EXPORT PNG
========================================= */

if (exportPngBtn) {
  exportPngBtn.addEventListener("click", () => {
    try {
      const link = document.createElement("a");

      link.download = "CreatorDigitalPro-Intro.png";

      link.href = canvas.toDataURL("image/png");

      link.click();
    } catch (error) {
      console.error(error);

      alert("Gagal export PNG");
    }
  });
}

/* =========================================
SECTION 14
EXPORT WEBM
========================================= */

if (exportWebmBtn) {
  exportWebmBtn.addEventListener("click", () => {
    startWebmRecording();
  });
}

/* =========================================
WEBM RECORDER
========================================= */

function startWebmRecording() {
  const canvasStream = canvas.captureStream(60);

  const stream = new MediaStream(canvasStream.getVideoTracks());

  if (audioPlayer) {
    if (!audioContext) {
      audioContext = new AudioContext();

      audioDestination = audioContext.createMediaStreamDestination();

      const source = audioContext.createMediaElementSource(audioPlayer);

      source.connect(audioDestination);

      source.connect(audioContext.destination);
    }

    audioDestination.stream.getAudioTracks().forEach((track) => {
      stream.addTrack(track);
    });
  }

  const recorder = new MediaRecorder(stream, {
    mimeType: "video/webm",
  });

  window.webmRecorder = recorder;

  const chunks = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, {
      type: "video/webm",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "CreatorDigitalPro-Intro.webm";

    link.click();

    URL.revokeObjectURL(url);
  };

  currentTime = 0;

  playing = true;

  if (audioPlayer) {
    audioPlayer.currentTime = 0;

    audioPlayer.play();
  }

  recorder.start();

  animate();
}

/* =========================================
SECTION 15
IMAGE LOAD
========================================= */

backgroundImage.onload = () => {
  drawIntro();
};

logoImage.onload = () => {
  drawIntro();
};

/* =========================================
SECTION 16
AUTO LOAD
========================================= */

window.addEventListener("load", () => {
  drawIntro();
});

/* =========================================
END APP.JS FINAL V2.0
========================================= */
