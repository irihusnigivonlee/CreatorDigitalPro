# CreatorDigitalPro Export Watermark Strong Patch

Patch ini memperbaiki watermark agar tidak hanya muncul di preview, tetapi juga ikut masuk ke hasil download/export.

Perbaikan:
- Canvas export PNG/JPG diberi watermark langsung saat `toDataURL()` / `toBlob()` dipanggil.
- Intro Video canvas diberi watermark saat frame digambar, sehingga export WEBM ikut watermark.
- Ebook Builder dan template ebook dipaksa memberi watermark ke canvas hasil `html2canvas()` sebelum download.

Catatan: ini proteksi demo GitHub Pages. Proteksi final tetap gunakan hosting backend + login + license.
