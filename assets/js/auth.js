/* CreatorDigitalPro Static Demo Auth
   GitHub Pages/localStorage version. Production auth should use backend/database.
*/
(function(){
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const quickDemoLogin = document.getElementById("quickDemoLogin");

  const DEMO_KEY = "cdp_demo_user";
  const USER_KEY = "cdp-user";

  function saveDemoUser(user){
    const finalUser = {
      name: user.name || "Demo User",
      email: user.email || "demo@creatordigitalpro.local",
      plan: user.plan || "Demo Access",
      status: "demo",
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(DEMO_KEY, JSON.stringify(finalUser));
    localStorage.setItem(USER_KEY, JSON.stringify(finalUser));
    return finalUser;
  }

  function redirectAfterAuth(){
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if(next && !next.includes("http")){
      window.location.href = next;
      return;
    }
    window.location.href = "../dashboard/index.html";
  }

  function showMessage(text){
    let toast = document.querySelector(".auth-toast");
    if(!toast){
      toast = document.createElement("div");
      toast.className = "auth-toast";
      toast.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;background:rgba(15,23,42,.94);border:1px solid rgba(255,255,255,.16);color:#fff;padding:14px 18px;border-radius:999px;font-weight:900;box-shadow:0 20px 60px rgba(0,0,0,.35);";
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    setTimeout(() => toast.remove(), 1800);
  }

  if(registerForm){
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputs = registerForm.querySelectorAll("input");
      const name = inputs[0]?.value.trim() || "Creator";
      const email = inputs[1]?.value.trim() || "demo@creatordigitalpro.local";
      saveDemoUser({ name, email, plan: localStorage.getItem("cdp-selected-plan") || "Demo Access" });
      showMessage("Akun demo berhasil dibuat.");
      setTimeout(redirectAfterAuth, 550);
    });
  }

  if(loginForm){
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[type="email"]')?.value.trim() || "demo@creatordigitalpro.local";
      const name = email.split("@")[0] || "Demo User";
      saveDemoUser({ name, email });
      showMessage("Login demo berhasil.");
      setTimeout(redirectAfterAuth, 550);
    });
  }

  if(quickDemoLogin){
    quickDemoLogin.addEventListener("click", () => {
      saveDemoUser({ name:"Demo User", email:"demo@creatordigitalpro.local" });
      showMessage("Masuk cepat berhasil.");
      setTimeout(redirectAfterAuth, 550);
    });
  }
})();
