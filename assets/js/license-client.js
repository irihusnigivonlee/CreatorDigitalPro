(function(){
  const settings = window.CDP_SETTINGS || {};
  const server = (settings.licenseServerUrl || settings.apiBase || "api").replace(/\/$/, "");
  const form = document.getElementById("licenseForm");
  const keyInput = document.getElementById("licenseKey");
  const emailInput = document.getElementById("licenseEmail");
  const statusBox = document.getElementById("licenseStatus");
  const btn = document.getElementById("licenseBtn");

  function setStatus(msg, type="info"){
    if(!statusBox) return;
    statusBox.textContent = msg;
    statusBox.className = "checkout-status " + type;
  }

  function currentDomain(){
    return location.hostname || "localhost";
  }

  if(keyInput && localStorage.getItem("cdp-license-key")){
    keyInput.value = localStorage.getItem("cdp-license-key");
  }

  if(form){
    form.addEventListener("submit", async function(e){
      e.preventDefault();
      const license_key = keyInput.value.trim().toUpperCase();
      const email = emailInput.value.trim();
      if(!license_key){ setStatus("License key wajib diisi.", "error"); return; }
      btn.disabled = true;
      btn.textContent = "Memeriksa...";
      setStatus("Menghubungkan ke server license...", "info");
      try{
        const res = await fetch(server + "/license-activate.php", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({license_key, email, domain: currentDomain()})
        });
        const data = await res.json();
        if(!data.ok) throw new Error(data.message || "License ditolak");
        localStorage.setItem("cdp-license-key", license_key);
        localStorage.setItem("cdp-license-status", "active");
        localStorage.setItem("cdp-license-domain", data.domain || currentDomain());
        setStatus(data.message || "License aktif.", "success");
      }catch(err){
        localStorage.removeItem("cdp-license-status");
        setStatus(err.message, "error");
      }finally{
        btn.disabled = false;
        btn.textContent = "Aktifkan Sekarang";
      }
    });
  }
})();
