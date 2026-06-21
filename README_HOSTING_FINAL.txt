CREATORDIGITALPRO - PANDUAN HOSTING + MIDTRANS

1. Upload semua isi folder ini ke hosting yang mendukung PHP 7.4+ / 8.x.
2. Pastikan folder storage/ bisa ditulis oleh server.
3. Letakkan file produk ZIP asli di:
   private/downloads/CreatorDigitalPro_Product.zip
4. Isi key Midtrans:
   - config/settings.js  => midtransClientKey
   - api/config.php      => CDP_MIDTRANS_SERVER_KEY dan CDP_MIDTRANS_CLIENT_KEY
5. Saat testing gunakan Sandbox:
   CDP_MIDTRANS_IS_PRODUCTION = false
6. Saat live gunakan Production:
   CDP_MIDTRANS_IS_PRODUCTION = true
7. Di dashboard Midtrans, isi Payment Notification URL:
   https://DOMAIN-KAMU.com/api/notification.php
8. Checkout:
   pages/checkout.html?plan=monthly
   pages/checkout.html?plan=zip
9. Alur otomatis:
   Landing -> Checkout -> Midtrans Snap -> Webhook -> orders.json paid -> Success -> Download ZIP.

CATATAN PENTING:
- Jangan simpan Server Key di JavaScript.
- Jangan taruh file ZIP produk di folder publik biasa.
- Untuk localhost/Go Live tanpa PHP server, Midtrans otomatis tidak akan jalan. Gunakan hosting PHP atau local PHP server:
  php -S localhost:8500
