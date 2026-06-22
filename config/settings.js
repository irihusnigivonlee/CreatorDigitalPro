/* =========================================
   CreatorDigitalPro Global Settings
   Edit this file when price/path changes.
========================================= */

window.CDP_SETTINGS = {
  appName: "CreatorDigitalPro",
  currency: "IDR",
  starterPrice: 9000,
  proPrice: 49000,
  premiumPrice: 99000,
  rootPath: "./",
  dashboardUrl: "./dashboard/index.html",
  pricingUrl: "./pages/pricing.html",
  loginUrl: "./pages/login.html",
  registerUrl: "./pages/register.html",
  templateHubUrl: "./tools/thumbnail-maker/index.html",
  supportEmail: "support@creatordigitalpro.com",
  apiBase: "./api",
  licenseServerUrl: "./api", // ganti ke https://domainanda.com/api untuk production SaaS
  requireLicense: false, // ubah true pada production jika ingin wajib aktivasi
  midtransClientKey: "ISI_CLIENT_KEY_MIDTRANS_ANDA", // isi Client Key dari Dashboard Midtrans
  midtransMode: "sandbox", // ganti production setelah siap live
  plans: {
    free: "Free User",
    demo: "Gratis Demo",
    starter: "Starter Promo 9K",
    pro: "Creator Pro 49K",
    premium: "Premium 99K"
  }
};
