/* =========================================
   CreatorDigitalPro Global Settings
   Edit this file when price/path changes.
========================================= */

window.CDP_SETTINGS = {
  appName: "CreatorDigitalPro",
  currency: "IDR",
  monthlyPrice: 9000,
  zipPrice: 39000,
  rootPath: "./",
  dashboardUrl: "./dashboard/index.html",
  pricingUrl: "./pages/pricing.html",
  loginUrl: "./pages/login.html",
  registerUrl: "./pages/register.html",
  templateHubUrl: "./tools/thumbnail-maker/index.html",
  supportEmail: "support@creatordigitalpro.com",
  apiBase: "./api",
  licenseServerUrl: "./api", // ganti ke https://domainanda.com/api untuk ZIP yang dijual
  requireLicense: false, // ubah true pada paket ZIP distribusi jika ingin wajib aktivasi
  midtransClientKey: "ISI_CLIENT_KEY_MIDTRANS_ANDA", // isi Client Key dari Dashboard Midtrans
  midtransMode: "sandbox", // ganti production setelah siap live
  plans: {
    free: "Free User",
    monthly: "Premium Monthly",
    zip: "Creator ZIP Elite"
  }
};
