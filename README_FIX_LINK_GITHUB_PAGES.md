# CreatorDigitalPro - Fix Link GitHub Pages

Perbaikan dalam ZIP ini:

- Menghapus/menetralisir link lokal `127.0.0.1:8500` pada Thumbnail Hub.
- Tombol `Back Dashboard` diarahkan ke dashboard project, bukan localhost.
- Cocok untuk GitHub Pages dengan URL:
  `https://irihusnigivonlee.github.io/CreatorDigitalPro/`

Setelah timpa file lama, jalankan:

```powershell
& "C:\Program Files\Git\bin\git.exe" add .
& "C:\Program Files\Git\bin\git.exe" commit -m "Fix dashboard links for GitHub Pages"
& "C:\Program Files\Git\bin\git.exe" push
```

Tunggu 1-3 menit, lalu refresh halaman GitHub Pages.
