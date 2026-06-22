(async function(){
  const info = document.getElementById("successInfo");
  const btn = document.getElementById("downloadZipBtn");
  const orderId = new URLSearchParams(location.search).get("order_id") || localStorage.getItem("cdp-order-id") || "";
  if(btn) btn.style.display = "none";
  if(!orderId){ if(info) info.textContent = "Order ID tidak ditemukan."; return; }
  try{
    const res = await fetch("../api/check-order.php?order_id=" + encodeURIComponent(orderId));
    const data = await res.json();
    if(data.ok && data.paid){
      if(info) info.innerHTML = `Order <strong>${orderId}</strong> sudah aktif. License: <strong>${data.license_key || "aktif"}</strong>`;
      if(btn){ btn.style.display = "none"; }
      localStorage.setItem("cdp-user", JSON.stringify({name:data.name||"Creator", email:data.email||"", plan:data.plan_name||data.plan, order_id:orderId, license_key:data.license_key}));
    }else{
      if(info) info.textContent = "Pembayaran masih pending. Tunggu notifikasi Midtrans atau cek kembali beberapa saat lagi.";
    }
  }catch(e){ if(info) info.textContent = "Gagal memeriksa order."; }
})();
