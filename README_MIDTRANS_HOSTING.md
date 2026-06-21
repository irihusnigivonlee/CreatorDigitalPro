# CreatorDigitalPro - Sistem Final + Midtrans

## Alur pembayaran
Landing/Pricing → Checkout Midtrans Snap → pembayaran sukses → webhook `api/notification.php` → order aktif → dashboard / download ZIP.

## Wajib diganti sebelum live
1. Buka `api/config.php` lalu isi `CDP_MIDTRANS_SERVER_KEY`.
2. Buka `config/settings.js` dan `pages/checkout.html`, isi `ISI_CLIENT_KEY_MIDTRANS_ANDA`.
3. Untuk sandbox gunakan script `https://app.sandbox.midtrans.com/snap/snap.js`. Untuk production ubah ke `https://app.midtrans.com/snap/snap.js` dan `CDP_MIDTRANS_IS_PRODUCTION` menjadi `true`.
4. Di Dashboard Midtrans, set Payment Notification URL ke: `https://domainanda.com/api/notification.php`.
5. File yang didownload pembeli ada di `private/downloads/CreatorDigitalPro_Product.zip`. Ganti file ini dengan ZIP produk final kalau ingin menjual paket berbeda.

## Catatan penting
- Server Key jangan pernah ditaruh di HTML/JS.
- Sistem monthly di paket ini aktif 30 hari per pembayaran. Untuk recurring otomatis penuh perlu integrasi recurring/subscription lanjutan.
- Folder `storage/orders.json` cocok untuk awal/testing. Untuk penjualan besar, pindahkan ke MySQL/Supabase.
