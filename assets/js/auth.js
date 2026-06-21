/* =========================================
   CreatorDigitalPro Static Auth
   LocalStorage version for demo/hosting-ready static site.
========================================= */

(function(){
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  function getInput(form, typeOrIndex, indexFallback){
    if(typeof typeOrIndex === "string"){
      return form.querySelector(`input[type="${typeOrIndex}"]`);
    }
    return form.querySelectorAll("input")[indexFallback || 0];
  }

  if(registerForm){
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const inputs = registerForm.querySelectorAll("input");
      const name = inputs[0]?.value || "Creator";
      const email = inputs[1]?.value || "";

      const user = {
        name,
        email,
        plan: localStorage.getItem("cdp-selected-plan") || "Free User",
        createdAt: new Date().toISOString()
      };

      localStorage.setItem("cdp-user", JSON.stringify(user));

      alert("Akun berhasil dibuat.");
      window.location.href = "../dashboard/index.html";
    });
  }

  if(loginForm){
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = getInput(loginForm, "email")?.value || "";

      const user = {
        name: email.split("@")[0] || "Creator",
        email,
        plan: localStorage.getItem("cdp-selected-plan") || "Free User",
        loginAt: new Date().toISOString()
      };

      localStorage.setItem("cdp-user", JSON.stringify(user));

      alert("Login berhasil.");
      window.location.href = "../dashboard/index.html";
    });
  }
})();
