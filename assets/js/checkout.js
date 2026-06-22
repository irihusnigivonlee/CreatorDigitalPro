/* CreatorDigitalPro Midtrans Checkout - Hosting Ready */
(function(){
  const params = new URLSearchParams(location.search);
  const requestedPlan = params.get("plan") || "starter";
  const planKey = ["starter", "pro", "premium"].includes(requestedPlan) ? requestedPlan : "starter";
  const settings = window.CDP_SETTINGS || {};
  const plans = {
    starter: {
      name: "Starter Promo 9K",
      price: settings.starterPrice || 9000,
      desc: "Paket murah promo untuk pelanggan baru yang ingin memakai semua fitur utama CreatorDigitalPro selama 30 hari.",
      benefits: ["Full Thumbnail Maker", "Full Template eBook", "Full Template Intro Video", "Export HD dasar", "Update fitur ringan"]
    },
    pro: {
      name: "Creator Pro 49K",
      price: settings.proPrice || 49000,
      desc: "Paket populer untuk kreator aktif dengan fitur AI, Shorts Builder, dan export tanpa watermark.",
      benefits: ["Semua fitur Starter Promo", "Export tanpa watermark", "AI Title Generator", "AI Description & Tag Generator", "Shorts Builder"]
    },
    premium: {
      name: "Premium 99K",
      price: settings.premiumPrice || 99000,
      desc: "Paket premium untuk kreator serius dengan AI Analyzer, Cloud Save, Unlimited Project, dan prioritas support.",
      benefits: ["Semua fitur Creator Pro", "AI Thumbnail Analyzer", "Cloud Save Project", "Unlimited Project", "Priority Support"]
    }
  };

  const selected = plans[planKey];
  const title = document.getElementById("checkoutTitle");
  const desc = document.getElementById("checkoutDesc");
  const price = document.getElementById("checkoutPrice");
  const benefits = document.getElementById("benefitList");
  const form = document.getElementById("checkoutForm");
  const payBtn = document.getElementById("payBtn");
  const statusBox = document.getElementById("checkoutStatus");

  function rupiah(num){
    return new Intl.NumberFormat("id-ID", {style:"currency", currency:"IDR", maximumFractionDigits:0}).format(num);
  }

  function setStatus(msg, type="info"){
    if(!statusBox) return;
    statusBox.textContent = msg;
    statusBox.className = "checkout-status " + type;
  }

  async function loadSnap(){
    if(window.snap) return true;
    const key = settings.midtransClientKey;
    if(!key || key.indexOf("ISI_") === 0){
      setStatus("Client Key Midtrans belum diisi di config/settings.js.", "error");
      return false;
    }
    return new Promise((resolve) => {
      const script = document.createElement("script");
      const mode = settings.midtransMode === "production" ? "app" : "app.sandbox";
      script.src = `https://${mode}.midtrans.com/snap/snap.js`;
      script.setAttribute("data-client-key", key);
      script.onload = () => resolve(true);
      script.onerror = () => { setStatus("Gagal memuat Snap Midtrans. Periksa koneksi internet dan Client Key.", "error"); resolve(false); };
      document.head.appendChild(script);
    });
  }

  if(title) title.textContent = selected.name;
  if(desc) desc.textContent = selected.desc;
  if(price) price.textContent = rupiah(selected.price);
  if(benefits) benefits.innerHTML = selected.benefits.map(v=>`<li>${v}</li>`).join("");
  localStorage.setItem("cdp-selected-plan", selected.name);
  loadSnap();

  if(!form) return;
  form.addEventListener("submit", async function(e){
    e.preventDefault();
    payBtn.disabled = true;
    payBtn.textContent = "Membuat pembayaran...";
    setStatus("Menghubungkan ke server pembayaran...", "info");

    const buyer = {
      name: document.getElementById("buyerName").value.trim(),
      email: document.getElementById("buyerEmail").value.trim(),
      phone: document.getElementById("buyerPhone").value.trim()
    };

    try{
      const res = await fetch("../api/create-payment.php", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({plan: planKey, buyer})
      });
      const data = await res.json();
      if(!data.ok) throw new Error(data.message || "Gagal membuat transaksi");
      localStorage.setItem("cdp-order-id", data.order_id);
      localStorage.setItem("cdp-user", JSON.stringify({name: buyer.name, email: buyer.email, plan: selected.name, order_id: data.order_id}));

      const snapReady = await loadSnap();
      if(window.snap && data.token && snapReady){
        window.snap.pay(data.token, {
          onSuccess: function(){ location.href = "success.html?order_id=" + encodeURIComponent(data.order_id); },
          onPending: function(){ location.href = "success.html?order_id=" + encodeURIComponent(data.order_id); },
          onError: function(){ setStatus("Pembayaran gagal. Silakan coba lagi.", "error"); },
          onClose: function(){ payBtn.disabled = false; payBtn.textContent = "Bayar Sekarang"; setStatus("Checkout ditutup. Klik bayar untuk mencoba lagi.", "info"); }
        });
      }else if(data.redirect_url){
        location.href = data.redirect_url;
      }else{
        throw new Error("Snap belum siap. Periksa Client Key Midtrans.");
      }
    }catch(err){
      setStatus(err.message, "error");
      alert(err.message);
      payBtn.disabled = false;
      payBtn.textContent = "Bayar Sekarang";
    }
  });
})();
