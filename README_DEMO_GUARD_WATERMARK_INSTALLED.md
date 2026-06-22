# CreatorDigitalPro Demo Guard + Watermark Patch

Patch ini sudah dipasang pada project online_CDP_Sekarang.

## Isi patch
- assets/js/demo-guard.js
- assets/css/demo-guard.css
- script guard otomatis dipasang ke semua file HTML

## Cara pakai
1. Backup folder CreatorDigitalPro yang sekarang.
2. Extract ZIP ini.
3. Timpa isi folder CreatorDigitalPro lama dengan isi ZIP ini.
4. Push ulang ke GitHub:

```powershell
& "C:\Program Files\Git\bin\git.exe" add .
& "C:\Program Files\Git\bin\git.exe" commit -m "Add demo guard and watermark"
& "C:\Program Files\Git\bin\git.exe" push
```

## Catatan
Proteksi ini untuk demo GitHub Pages:
- Klik Download/Export akan meminta login demo.
- Setelah login demo, export tetap diberi watermark.
- Proteksi ini bukan pengganti license/backend production.
