# CreatorDigitalPro - Ready Hosting Connected

Paket ini sudah dirapikan agar siap hosting statis.

## Struktur utama
- `index.html` = Landing page utama
- `style.css` = UI utama super ultra elegant
- `app.js` = hamburger mobile + interaksi kecil
- `pages/pricing.html` = halaman harga Rp9K dan Rp39K ZIP
- `pages/login.html` / `register.html` = auth demo static localStorage
- `dashboard/index.html` = dashboard user
- `tools/thumbnail-maker/index.html` = gateway menuju template hub
- `tools/thumbnail-maker/thumbnail-rooms/` = semua template thumbnail
- `tools/intro-video-maker/` = tool intro video

## Cara hosting
Upload seluruh isi folder ini ke root hosting:
- Netlify
- Vercel static
- Shared hosting public_html
- GitHub Pages

Buka:
`https://domainkamu.com/index.html`

## Path sudah dibuat relatif
Tidak memakai path `/pages/...` yang rawan rusak di subfolder.
Semua link memakai `../` dan `./` sesuai lokasi file.

## Catatan login
Login/register saat ini adalah demo static menggunakan `localStorage`.
Nanti bisa diganti Supabase melalui:
- `config/supabase.js`
- `assets/js/auth.js`
