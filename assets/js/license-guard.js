(function(){
  const settings = window.CDP_SETTINGS || {};
  if(!settings.requireLicense) return;
  const isActivationPage = location.pathname.endsWith("license.html") || location.pathname.endsWith("/license.html");
  if(isActivationPage) return;
  const active = localStorage.getItem("cdp-license-status") === "active";
  if(!active){
    const root = settings.rootPath || "./";
    location.href = root.replace(/\/$/, "") + "/license.html";
  }
})();
