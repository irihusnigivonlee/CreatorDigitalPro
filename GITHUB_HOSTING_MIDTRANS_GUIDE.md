# Panduan GitHub, Hosting, Midtrans, dan License

## 1. Jalankan Lokal
```bat
php -S localhost:8000
```
Buka:
```txt
http://localhost:8000
```

## 2. Push ke GitHub
Pastikan `.gitignore` sudah ada, lalu:
```bat
git init
git add .
git commit -m "CreatorDigitalPro final base"
git branch -M main
git remote add origin https://github.com/USERNAME/CreatorDigitalPro.git
git push -u origin main
```

## 3. Upload ke Hosting PHP
Upload semua file ke `public_html`, kecuali file/folder yang diabaikan GitHub tetap boleh dibuat manual di hosting:
- `storage/`
- `private/downloads/CreatorDigitalPro_Product.zip`
- `.env` jika hosting mendukung environment file.

Pastikan permission `storage/` writable.

## 4. Midtrans Sandbox
Isi:
- `MIDTRANS_SERVER_KEY`
- `MIDTRANS_CLIENT_KEY`
- `MIDTRANS_IS_PRODUCTION=false`

Frontend:
```js
midtransClientKey: "SB-Mid-client-xxxx",
midtransMode: "sandbox"
```

Notification URL Midtrans:
```txt
https://domainanda.com/api/notification.php
```

## 5. Midtrans Production
Setelah semua test berhasil:
```txt
MIDTRANS_IS_PRODUCTION=true
```
Frontend:
```js
midtransClientKey: "Mid-client-xxxx",
midtransMode: "production"
```

## 6. Alur Pembeli ZIP
1. Pembeli klik paket ZIP Rp39K.
2. Checkout Midtrans membuat order pending.
3. Midtrans mengirim webhook settlement ke `notification.php`.
4. Sistem membuat license key otomatis.
5. Halaman success menampilkan tombol download ZIP.
6. Pembeli mengunduh ZIP.
7. Pembeli aktivasi license di domain/localhost.
