/* CreatorDigitalPro Dashboard */
(function(){
  const user = JSON.parse(localStorage.getItem("cdp-user") || "null");
  const welcome = document.getElementById("welcomeTitle");
  const plan = document.getElementById("memberPlan");
  const logout = document.getElementById("logoutBtn");

  if(welcome){
    welcome.textContent = user ? `Welcome, ${user.name}` : "Welcome Creator";
  }

  if(plan){
    plan.textContent = user?.plan || localStorage.getItem("cdp-selected-plan") || "Free User";
  }

  if(logout){
    logout.addEventListener("click", () => {
      localStorage.removeItem("cdp-user");
      window.location.href = "../index.html";
    });
  }
})();
