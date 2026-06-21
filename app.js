/* =========================================
   CreatorDigitalPro - Hosting Ready App
========================================= */

(function(){
  const menuToggle = document.getElementById("menuToggle");

  if(menuToggle){
    menuToggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });
  }

  document.querySelectorAll(".nav-menu a, .nav-actions a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
    });
  });

  const header = document.querySelector(".navbar");

  if(header){
    window.addEventListener("scroll", () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    });
  }

  document.querySelectorAll("[data-plan]").forEach((btn) => {
    btn.addEventListener("click", () => {
      localStorage.setItem("cdp-selected-plan", btn.dataset.plan);
    });
  });
})();






const tutorialToggle = document.getElementById("tutorialToggle");
const tutorialPopup = document.getElementById("tutorialPopup");
const tutorialClose = document.getElementById("tutorialClose");

if (tutorialToggle && tutorialPopup) {
  tutorialToggle.addEventListener("click", () => {
    tutorialPopup.classList.toggle("active");
  });
}

if (tutorialClose && tutorialPopup) {
  tutorialClose.addEventListener("click", () => {
    tutorialPopup.classList.remove("active");
  });
}
