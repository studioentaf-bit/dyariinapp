# 📖 DOKUMENTASI LENGKAP & MASTER LOG SISTEM DYARI STORE (`dyari.in`)

Dokumen ini adalah **catatan resmi arsitektur, panduan aturan pengembangan, dan riwayat update (changelog)** aplikasi Dyari Store (`dyariapp.my.id`).

> [!IMPORTANT]
> ### 🚨 ATURAN MUTLAK PENGEMBANGAN (STRICT SCOPE & CODE INTEGRITY RULES)
> Untuk setiap asisten AI, developer, maupun kontributor yang melakukan perubahan pada codebase ini:
> 1. **STRICT SCOPE (HANYA UBAH YANG DIMINTA):**
>    - **DILARANG KERAS** mengubah, menghapus, menyederhanakan, merombak, atau memodifikasi fitur, komponen, layout, atau logika di luar apa yang **secara eksplisit diminta oleh USER**.
> 2. **JAGA INTEGRITAS FITUR YANG SUDAH BERJALAN (SACRED MODULES):**
>    - Fitur-fitur seperti **Instant Direct Checkout**, **Antrian Order Real-time**, **Manajemen Stok Riil**, **Kelola Lisensi Dinamis**, **Story Generator AI**, dan **Sinkronisasi PostgreSQL** telah teruji dan berjalan stabil. Jangan pernah mengganti perilakunya kecuali ada instruksi tertulis dari USER.
> 3. **KONSISTENSI TEMA & BRANDING:**
>    - Tema visual Dyari mengacu pada nuansa alami: Forest Green (`#1C352D`), Soft Cream (`#FAFBF9`), Sage Border (`#E5EAE4`), dan aksen Emerald (`#10B981`) & Amber (`#F59E0B`). Jangan mengganti skema warna ke tema lain.
> 4. **DILARANG MENGURANGI DOCSTRING & LOGIKA EXISTING:**
>    - Pertahankan seluruh komentar, validasi fallback `localStorage`, dan struktur data yang sudah terpasang.

---

## 🏛️ 1. ARSITEKTUR & SPESIFIKASI SISTEM

### A. Environment & Infrastruktur
- **Domain Produksi:** `https://dyariapp.my.id`
- **DNS & SSL:** Cloudflare (SSL Mode: Full / Flexible, Proxy Enabled)
- **Web Server:** Nginx (Reverse Proxy & Static File Serving di Ubuntu 24.04 LTS)
- **Path Instalasi di VPS:** `/var/www/dyariapp.my.id`
- **Process Manager:** PM2 (Proses unik: `dyari-api`)
- **Backend Port:** `5000` (diproxy Nginx melalui blok `location /api/`)
- **Database:** PostgreSQL (`dyaridb`, user `dyariuser`)

### B. Stack Teknologi
- **Frontend:**
  - React 18 (ESM) + Vite 6
  - Tailwind CSS 3.4 (Custom palette Dyari)
  - Lucide React (Iconography)
  - Canvas Confetti (Celebration effects)
- **Backend:**
  - Node.js ESM + Express 4.21
  - `pg` (PostgreSQL client pool)
  - `jsonwebtoken` (JWT Auth) + Master Secret Key (`x-admin-secret` / `x-admin-key`)
  - `cors` & `dotenv`

---

## 🧩 2. FITUR-FITUR INTI YANG WAJIB DIJAGA (PROTECTED FEATURES)

### 1. Instant Direct Checkout (`src/components/InstantCheckoutModal.jsx`)
- **Alur Kerja:**
  - Pembeli mengklik tombol **"Beli Sekarang"** langsung dari card produk/lisensi tanpa perlu masuk ke keranjang atau halaman detail.
  - Membuka popup form ringkas (Nama, Email, No. WhatsApp, Jumlah Qty).
  - Menghasilkan ID pesanan unik berformat `#INV-YYYYMMDD-XXXX`.
  - Menampilkan instruksi pembayaran QRIS dinamis + tombol konfirmasi WhatsApp admin.
  - **Auto-polling Real-time:** Polling setiap 3 detik ke endpoint status backend `/api/orders/status/:id` dan local store.
  - **Auto-Reveal:** Saat pesanan berstatus `LUNAS` / disetujui admin, modal otomatis beralih ke tampilan sukses dan menampilkan kredensial akun / kode lisensi aktif.

### 2. Panel Admin: Antrian Order (`src/views/AdminDashboardView.jsx` -> Tab `antrian-order`)
- Menampilkan tabel pesanan yang menunggu pembayaran (`status !== 'Lunas'`).
- **Auto-polling setiap 4 detik** memanggil `syncOrdersFromBackend()` agar pesanan dari pembeli langsung muncul tanpa refresh browser.
- **Tombol "Refresh Antrian":** Memiliki animasi spinner dan memuat data aktual dari backend `/api/orders`.
- **Tombol 1-Klik "Approve":** Mengubah status pesanan menjadi `Lunas` di state lokal dan mengirim `PUT /api/orders/:id/status` ke PostgreSQL.

### 3. Manajemen Stok Riil & Dark UI Form (`src/views/AdminDashboardView.jsx`)
- Mengatur stok produk akun digital secara presisi.
- Validasi stok riil terhubung ke seluruh katalog: jika stok akun habis (`stockCount <= 0`), keterangan otomatis berubah menjadi **"Stok Habis"** dan tombol checkout dinonaktifkan.
- Dukungan import massal stok akun (format baris: `email|password` atau `email|password|pin`).

### 4. Kelola Lisensi & Paket Lisensi Dinamis (`src/context/StoreContext.jsx`)
- Admin bebas menambah, mengedit, dan menghapus paket tier lisensi (tidak terbatas hanya pada 3 paket default).
- Generator lisensi otomatis menghasilkan kode berformat `DYARI-XXXX-XXXX-XXXX`.

### 5. Story Generator AI Studio (`src/views/StoryGeneratorView.jsx`)
- Fitur pembuatan konten sinematik berbasis prompt AI.
- Header terintegrasi satu baris, proteksi lisensi aktif, penyimpanan prompt lokal di browser, dan layout 100% viewport.

---

## 📜 3. CHRONOLOGICAL UPDATE LOG (CHANGELOG)

### [Commit 7678a6f] - 2026-10-14
- **Fix (Download Rilis & Navbar):**
  - **Fix GitHub Release 404**: Visibilitas repositori `studioentaf-bit/dyariinapp` diubah menjadi **Public** sehingga link rilis publik GitHub `v0.0.1` langsung menyajikan file download tanpa error 404.
  - **Penyelarasan Menu Navbar**: Tombol menu `Download App` di header navbar diubah menjadi teks murni tanpa icon dan tanpa background pill highlight hijau, 100% konsisten dengan menu lainnya (`Beranda`, `Shop`, `Lisensi`, `Story Generator`, `Tentang`).
  - **Native Direct Download**: Tombol download di [`DownloadAppView.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/views/DownloadAppView.jsx) menggunakan native direct anchor dengan atribut `download` yang seketika mengunduh `Story.in-AI-Manager.exe` tanpa membuka jendela atau tab baru.

### [Commit 8b86de6] - 2026-10-13
- **Feat (Desktop App & Web Integration):**
  - **Integrasi Lisensi Ketat**: Aplikasi Desktop `Story.in-AI-Manager.exe` mewajibkan lisensi resmi dari website atau panel admin Dyari. Fitur Story Generator (Storyboard, Image Gen, Voiceover Gemini, Video Tools), container browser multi-akun, dan video splitter/merger otomatis terkunci bila lisensi belum aktif atau kadaluarsa.
  - **Menu Download Langsung di Website**: Penambahan halaman dan menu navigasi `Download App` di Navbar, Footer, dan Beranda. Tombol unduh langsung mendownload berkas `.exe` dari rilis resmi GitHub tanpa popup atau membuka browser lain (`/api/app/download`).
  - **Hosting Rilis di GitHub**: Merilis versi perdana `v0.0.1` pada repositori `studioentaf-bit/dyariinapp` berisi berkas binary standalone `Story.in-AI-Manager.exe` (163 MB self-contained, tinggal buka langsung jalan tanpa dependensi .NET terpisah).
  - **Auto-Updater Terpadu**: Menyematkan modul auto-updater di aplikasi desktop yang mendeteksi rilis baru via endpoint `/api/app/version` dan GitHub Releases, mengunduh di latar belakang dengan progress bar, dan me-restart aplikasi ke versi baru.
  - **Integrasi Banner & Produk Shop Dinamis**: Sinkronisasi valid antara Banner Utama (`/api/settings`) dan Produk Digital Shop (`/api/products` & `/api/license-plans`) yang diatur langsung dari Panel Admin.

### [Commit 8ccf16b & 46d6199] - 2026-10-10
- **Feat (Deploy):** Pembuatan dan optimasi script auto-update VPS [`deploy/update.sh`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/deploy/update.sh).
- Menambahkan auto git reset aman, build Vite, install dependensi backend, restart PM2 `dyari-api`, dan reload Nginx.
- Menambahkan header `x-admin-key` pada CORS backend [`server/index.js`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/server/index.js).

### [Commit 9f8cf3a] - 2026-10-10
- **Fix (Orders & Integration):** Perbaikan transaksi Instant Checkout agar langsung masuk ke tabel Antrian Order Panel Admin.
- Mengatasi PostgreSQL error tipe data `INTEGER` pada `order_items.product_id` saat produk berformat string slug.
- Menambahkan fungsi `syncOrdersFromBackend()` dan cross-tab event listeners di [`StoreContext.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/context/StoreContext.jsx).
- Menghubungkan tombol "Refresh Antrian" dan tombol "Approve" 1-klik di [`AdminDashboardView.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/views/AdminDashboardView.jsx).

### [Commit 10ff503] - 2026-10-10
- **Feat (Checkout):** Pembuatan komponen [`InstantCheckoutModal.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/components/InstantCheckoutModal.jsx).
- Menghapus kewajiban membuka detail produk dan keranjang belanja untuk checkout instan.
- Menambahkan integrasi QRIS dan auto-reveal kredensial saat status lunas.

### [Commit 7549ca8 & d66b733] - 2026-10-10
- **Fix & Feat (Stok):** Sinkronisasi validasi ketersediaan stok riil antara manajemen stok admin dan katalog user.
- Menghapus kartu bundling stok sesuai instruksi user.
- Menampilkan label "Stok Habis" secara akurat jika tidak ada stok akun tersedia.

### [Commit 3b3a8d4 & 719fa4f] - 2026-10-10
- **Style & Feat (Manajemen Stok):** Penyesuaian tema visual form manajemen stok mengikuti palet warna dyari.in (forest, sage, cream).
- Redesain modal import stok massal dengan antarmuka yang lebih intuitif.

### [Commit 8e8b1a4 & fb1847f] - 2026-10-09
- **Feat (Member & Lisensi):** Perbaikan menu Member untuk pendaftar lisensi Story Generator.
- Penambahan fleksibilitas paket lisensi (tambah, edit, hapus tier paket oleh admin tanpa batasan).
- Penataan menu header utama: Beranda, Shop, Lisensi, Story Generator, Tentang.

### [Commit 506affe, 878886d, d832334, ef038eb] - 2026-10-09
- **Feat & Fix (Story Generator AI):** Integrasi penuh modul Story In. AI studio.
- Header 1 baris responsif tanpa overlap, proteksi lisensi valid, penyimpanan riwayat lokal browser, dan pemanfaatan 100% viewport.

### [Commit 0a23beb s/d 16b779b] - 2026-09-22 / 2026-09-23
- **Inisialisasi & Setup Arsitektur:** Integrasi katalog 24 produk digital Cyberton, migrasi database PostgreSQL, implementasi cache in-memory, dan konfigurasi VPS Ubuntu 24.04 (Nginx + PM2).

---

## 🚀 4. PANDUAN OPERASIONAL GIT & DEPLOY VPS

### A. Alur Kerja Git (Commit & Push)
Selalu gunakan konvensi commit yang rapi dan informatif:
```bash
git add .
git commit -m "jenis(modul): deskripsi perubahan spesifik"
git push origin main
```
*Pastikan sebelum commit, proyek berhasil di-compile tanpa error:*
```bash
npm run build
```

### B. Perintah 1-Baris Deploy Update di VPS
Buka terminal SSH VPS Anda dan jalankan perintah tunggal ini:
```bash
cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
```

### C. Alur Kerja Script `deploy/update.sh`
1. Melakukan `git stash` dan `git reset --hard origin/main` untuk memastikan kode di VPS selalu bersih dan sinkron dengan GitHub tanpa risiko merge conflict.
2. Menjalankan `npm install` & `npm run build` untuk meng-compile frontend Vite ke `/var/www/dyariapp.my.id/dist`.
3. Menginstal dependensi backend di `/var/www/dyariapp.my.id/server`.
4. Me-restart proses PM2 `dyari-api` (atau memulai baru dari `deploy/ecosystem.config.cjs` jika belum running).
5. Memverifikasi sintaks Nginx (`nginx -t`) dan melakukan graceful reload (`systemctl reload nginx`).
6. Menampilkan status akhir PM2 dan tautan web produksi.

---

## 🔒 5. RINGKASAN KONFIGURASI PENTING (CHEATSHEET)

| Komponen | Parameter | Nilai / Lokasi |
| :--- | :--- | :--- |
| **Path Aplikasi VPS** | Direktori Root | `/var/www/dyariapp.my.id` |
| **Frontend Dist** | Web Root Nginx | `/var/www/dyariapp.my.id/dist` |
| **Backend Service** | Nama PM2 | `dyari-api` |
| **Backend Port** | Port HTTP | `5000` |
| **Database Server** | PostgreSQL | `dyaridb` (User: `dyariuser`) |
| **Admin Master Secret** | Header Auth | `Dyari#Master9981!Secure` (`x-admin-secret` / `x-admin-key`) |
| **Nginx Site Config** | File Virtual Host | `/etc/nginx/sites-available/dyariapp.my.id` |
---

## 🖥️ 6. APLIKASI DESKTOP PORTABLE: STORY.IN AI MANAGER (`Story.in-AI-Manager.exe`)

Aplikasi desktop ini merupakan **Creative AI Tools Manager & Multi-Account Browser** berbasis WPF .NET 8 yang sepenuhnya bersifat **portable (zero-install)** dan terintegrasi langsung dengan ekosistem backend Dyari Store (`dyariapp.my.id`).

### A. Identitas, Tema & Branding
- **Nama Aplikasi:** Story.in AI Manager
- **Format:** Single-File Portable Executable (`.exe` mandiri tanpa instalasi)
- **Tema Visual:**
  - **Warna Utama:** Gradien Hijau Matcha Organik (`#7a9e32`, `#5e7e20`, `#4e6b1a`) dipadukan dengan aksen Kapur/Lime (`#a3c45a` / `#cadba4`).
  - **Latar Belakang:** Warm Stone / Cream (`#f5f3ec`) ramah di mata untuk sesi kerja berjam-jam.
  - **Gaya Kartu:** Clean White (`#ffffff`) dengan kontur halus (`#e3decb`) dan elevasi lembut.
  - **Logo Aplikasi:** Custom Matcha Circle dengan emblem sleek 'S' dan aksen dot kapur (ikon file: `Assets/app_logo.png` & `Assets/icon.ico`).

### B. Struktur Menu & Fitur
1. **Dashboard (🌿):**
   - Menampilkan total platform aktif, akun terhubung, dan status lisensi.
   - Shortcut langsung ke **Video Panduan Resmi** (`▶ Video Tutorial`).
   - Tombol 1-klik salin Hardware ID komputer (`AI-XXXX-XXXX`).
2. **Platform AI (🎛️):**
   - Mendukung multi-akun terisolasi untuk Flow, Dola, dan ChatGPT (*Migoo AI telah dihapus*).
   - **Fitur Dropdown Akun:** Setiap platform di sidebar dapat diklik untuk membuka/menutup accordion daftar akun di bawahnya, dilengkapi indikator status running (`●`) dan tombol cepat `➕ Tambah Akun`.
   - Menggunakan logo vektor autentik resolusi tinggi.
3. **Platform Custom (🌐):**
   - Memungkinkan pengguna menambahkan web platform AI kustom secara mandiri dengan profil sesi terpisah.
4. **Tools AI (🛠️):**
   - TikTok Video Downloader (tanpa watermark).
   - Video Splitter Tool (pemotong video panjang menjadi beberapa part).
5. **Shop Produk (📦):**
   - Terintegrasi langsung dengan API Dyari (`https://dyariapp.my.id/api/products`).
   - Checkout pesanan langsung terkirim ke database Dyari melalui `POST /api/orders` sehingga otomatis masuk antrian order admin.
6. **Story Generator (🎬):**
   - Implementasi Story Generator AI berbasis web yang tertanam langsung di aplikasi desktop via Microsoft WebView2.
   - Ditempatkan di chrome atas sebelah kanan (seperti AI Studio pada referensi) dan dapat dibuka kapan saja.
7. **Video Tutorial (🎬):**
   - Pemutar panduan video resmi YouTube terintegrasi.
8. **Setting & Lisensi (⚙️):**
   - **Validasi Lisensi:** Terhubung ke endpoint Dyari `POST /api/licenses/validate` untuk verifikasi key dan email.
   - **Cek Update:** Terhubung ke endpoint `GET /api/app-version`.
   - **Admin Link:** Shortcut cepat ke panel admin Dyari (`/admin`).

### C. Panduan Build & Re-Publish Binary Portable
Jika ada perubahan di source code desktop (`metafori/story-in-manager-wpf`):
```powershell
# 1. Jalankan publish single-file release
& "C:\Users\studi\.dotnet\dotnet.exe" publish "c:\Users\studi\Downloads\metafori\story-in-manager-wpf\AIPilotManager.csproj" -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -o "c:\Users\studi\Downloads\metafori\story-in-manager-wpf\publish"

# 2. Salin binary ke folder siap pakai
Copy-Item "c:\Users\studi\Downloads\metafori\story-in-manager-wpf\publish\Story.in-AI-Manager.exe" "c:\Users\studi\Downloads\metafori\Story-in-AI-Manager\Story.in-AI-Manager.exe" -Force
Copy-Item "c:\Users\studi\Downloads\metafori\story-in-manager-wpf\publish\story-generator" "c:\Users\studi\Downloads\metafori\Story-in-AI-Manager\story-generator" -Recurse -Force
```

---

*Catatan ini harus dibaca dan dipatuhi pada setiap iterasi pengembangan berikutnya.*
