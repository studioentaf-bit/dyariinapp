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
Copy-Item "c:\Users\studi\Downloads\metafori\story-in-manager-wpf\publish\Story.in-AI-Manager.exe" "c:\Users\studi\Downloads\metafori\Story.in-AI-Manager.exe" -Force
Copy-Item "c:\Users\studi\Downloads\metafori\story-in-manager-wpf\publish\Story.in-AI-Manager.exe" "c:\Users\studi\Downloads\metafori\Story-in-AI-Manager\Story.in-AI-Manager.exe" -Force
```

---

## 📝 7. RIWAYAT UPDATE & LOG PERBAIKAN SISTEM TERKINI (14 OKTOBER 2026)

### A. Perbaikan Crash & Penguatan Aplikasi Desktop WPF (`Story.in-AI-Manager.exe`)
1. **Crash Fix Resolving (`System.InvalidOperationException`)**:
   - Menghapus pemicu animasi hover `RenderTransform` implisit di `story-in-manager-wpf/App.xaml` yang menyebabkan crash fatal saat user belum memasukkan lisensi dan mengklik menu.
2. **First Launch Pop-Up Aktivasi**:
   - Jika pengguna baru mengunduh aplikasi dan membukanya untuk pertama kali dalam keadaan belum teraktivasi, aplikasi secara otomatis memunculkan pop-up dialog aktivasi dengan field **Email** dan **Kode Lisensi** yang kosong (kosongan) siap diisi.
3. **Penguncian Menu & Ikon Gembok (🔒)**:
   - Jika pop-up ditutup tanpa aktivasi, seluruh menu fitur (Platform AI, AI Studio / Story Generator, Tools AI) menampilkan indikator gembok (🔒).
   - Pengguna bebas membuka menu **Setting**, **Video Tutorial**, dan **Shop Produk** tanpa terkunci.
   - Mengklik menu yang terkunci akan kembali mengingatkan user dan memunculkan pop-up aktivasi tanpa crash.
4. **List Akun Platform Bersih (Clean Slate)**:
   - Menghapus seluruh akun dummy / mock bawaan dari `StorageService.cs`. Saat aplikasi pertama kali dipasang, daftar akun benar-benar kosong sehingga pengguna menambahkan akun dari awal.
5. **Header Badges Dinamis**:
   - Menambahkan **Badge Lisensi** di kanan atas header: menampilkan status `FREE (Klik untuk Aktivasi)` warna abu/merah saat belum aktif (dapat diklik langsung untuk membuka modal aktivasi), dan berubah menjadi `PRO_ALL (👑 Aktif)` warna hijau matcha saat lisensi valid.
   - Menambahkan **Badge Versi Aplikasi** (`v0.0.1`) di sebelah badge lisensi.
6. **Rilis Binary Portable**:
   - Meng-compile ulang single-file executable .NET 8 (163 MB) dan mengunggahnya ke GitHub Release `v0.0.1` repo `studioentaf-bit/dyariinapp`.

### B. Perbaikan Navigasi & Pemisahan 2 Kategori Lisensi Website (`DYARIKU`)
1. **Navigasi Persisten Saat Refresh (F5)**:
   - Memperbaiki `StoreContext.jsx` dengan mendaftarkan route `licenses`, `download`, `about` ke dalam daftar `validViews`.
   - Mengaitkan state `currentView` dengan `localStorage.getItem('dyari_current_view')` dan `window.location.hash`.
   - Hasil: saat pengguna me-refresh browser di halaman mana pun (misal: menu Lisensi atau Download), halaman **tetap berada di menu aktif** dan tidak lagi reset kembali ke Beranda.
2. **Pemisahan 2 Kategori Lisensi**:
   - **Kategori 1: 💻 Lisensi Aplikasi Desktop** (Membuka akses software Windows Story.in AI Manager, multi-akun AI, video tools, auto updater).
   - **Kategori 2: 🌐 Lisensi Story Generator Website** (Membuka akses studio web generator AI di browser dyariapp.my.id).
   - Menambahkan tab filter interaktif di `LicensesView.jsx`: `Semua Lisensi`, `💻 Lisensi Aplikasi Desktop`, dan `🌐 Lisensi Story Generator Website`.
   - Menyematkan badge kategori pill pada masing-masing kartu paket lisensi.
   - Memperbarui Panel Admin (`AdminDashboardView.jsx`) sehingga admin dapat memilih kategori lisensi saat menambah atau mengedit tier lisensi.
   - Memperbarui API backend `/api/license-plans` di `server/index.js` untuk menyajikan paket berdasarkan kedua kategori tersebut.

### C. Standarisasi Auto-Incrementing Versi Aplikasi Desktop & Sinkronisasi Live Website (v0.0.1 -> v0.0.2 dst.)
1. **Aturan Mutlak Versi Bertahap (Incremental Versioning Rule)**:
   - Setiap ada update, bugfix, atau compile ulang pada aplikasi desktop, nomor versi wajib dinaikkan ke nomor berikutnya secara sekuensial (`0.0.1` -> `0.0.2` -> `0.0.3`, dst.).
   - Versi resmi saat ini telah dinaikkan ke **`v0.0.2`** mencakup perbaikan anti-crash, pop-up aktivasi otomatis kosongan saat first-launch, indikator gembok pada menu berlisensi, header badge lisensi & versi, pembersihan akun awal, serta integrasi 2 kategori lisensi.
2. **Sinkronisasi Dinamis Desktop, Backend, dan Website**:
   - **Desktop WPF**: File `AIPilotManager.csproj`, `MainWindow.xaml`, dan `MainWindow.xaml.cs` disetel ke `CurrentAppVersion = "0.0.2"` dan menampilkan badge header `v0.0.2`.
   - **Backend API**: Endpoint `/api/app/version` dan `/api/app-version` kini menyajikan metadata dinamis (`version: '0.0.2'`, URL unduhan release GitHub, release notes, ukuran file `~163 MB`). Endpoint `/api/app/download` otomatis mengarahkan unduhan langsung ke asset binary rilis versi terkini.
   - **Website Dyari**: Halaman `DownloadAppView.jsx` dan `HomeView.jsx` terhubung reaktif via `StoreContext.jsx` (`appVersionInfo`), sehingga tombol download, badge hero, rincian rilis, dan tautan GitHub Release otomatis terupdate secara live mengikuti versi aktif.
3. **Penerbitan Rilis GitHub v0.0.2**:
   - Rilis publik `v0.0.2` resmi diterbitkan di GitHub `studioentaf-bit/dyariinapp` dengan file executable `Story.in-AI-Manager.exe` (.NET 8 single-file standalone).

---

## 📝 8. RIWAYAT UPDATE & LOG PERBAIKAN SISTEM TERKINI (VERSI 0.0.3 - 15 OKTOBER 2026)

### A. Penggantian Nama Menu Member & Integrasi Seluruh Pembeli Lisensi
1. **Perubahan Nama Menu**:
   - Menu di sidebar dan view utama diubah dari **"Member Story AI"** menjadi **"Member"**.
   - Menu ini menampung seluruh pengguna yang membeli paket lisensi apapun yang ada di menu lisensi: baik **Lisensi Aplikasi Desktop** maupun **Lisensi Web Story Generator**.
2. **Tab Filter & Indikator Kategori Member**:
   - Menambahkan filter kategori platform: `Semua`, `💻 Lisensi Aplikasi`, dan `🌐 Lisensi Web`.
   - Menambahkan badge kategori lisensi pada masing-masing data tabel member untuk membedakan asal lisensi pengguna secara transparan.
   - Pada modal "Daftarkan Member Baru", paket lisensi dikelompokkan ke dalam 2 grup: `💻 Paket Lisensi Aplikasi Desktop` dan `🌐 Paket Lisensi Web Story Generator`.

### B. Tutorial Video Desktop Dinamis dari Panel Admin
1. **Backend API Endpoint (`/api/tutorials`)**:
   - Dibuat router `server/routes/tutorials.js` yang terhubung ke PostgreSQL `settings.desktop_tutorials`.
   - Mendukung endpoint `GET /api/tutorials` (publik untuk desktop app) dan `PUT /api/tutorials` (dilindungi token admin).
   - Fitur otomatis: Konversi link YouTube biasa (`watch?v=...`, `youtu.be/...`, `shorts/...`) menjadi URL `embed` siap tayang di WebView2 desktop.
2. **Manajemen Step di Panel Admin**:
   - Menambahkan tab khusus **"Tutorial Video Desktop"** di menu Pengaturan Panel Admin.
   - Admin dapat menambah, mengedit label step, judul, link URL YouTube, dan deskripsi step, serta menghapus step secara dinamis.
3. **Penyajian di Aplikasi Desktop WPF**:
   - Desktop app memuat data tutorial video secara asinkron langsung dari API `/api/tutorials`.
   - Step video otomatis dirender di kartu thumbnail video dan panel pemutar video YouTube terintegrasi.

### C. Sinkronisasi Harga Produk & Visibilitas (Web vs Aplikasi Desktop)
1. **Pemisahan Harga & Visibilitas**:
   - Database schema `products` diperluas: `app_price NUMERIC DEFAULT NULL`, `show_on_web BOOLEAN DEFAULT TRUE`, `show_on_app BOOLEAN DEFAULT TRUE`.
   - Modal Tambah & Edit Produk di Panel Admin kini menyediakan input:
     - **Harga Website (Rp)**
     - **Harga Aplikasi Desktop (Rp)**
     - Toggle **Tampilkan di Website**
     - Toggle **Tampilkan di Aplikasi Desktop**
   - Tabel Kelola Produk Admin menampilkan badge platform (`🌐 Web`, `💻 App`) dan rincian harga untuk masing-masing channel.
2. **Aplikasi Desktop WPF**:
   - Fungsi `ExtractPrice` diperbarui untuk memprioritaskan `app_price` / `appPrice` jika tersedia, dan fallback ke `price`.
   - Fungsi `LoadShopProductsAsync` memfilter produk yang disetel `show_on_app = false` sehingga tidak muncul di katalog aplikasi desktop.
   - Tombol checkout di shop aplikasi desktop membaca nomor WhatsApp admin dinamis dari konfigurasi pembayaran.

### D. Banner Dashboard Desktop dari Branding Panel Admin
1. **Kontrol Khusus Banner Desktop**:
   - Di menu Pengaturan Branding Panel Admin, disediakan field dan tombol upload terpisah untuk **"💻 Banner Dashboard Aplikasi Desktop"**.
   - Disimpan ke kunci pengaturan `desktopBannerUrl` dan `branding.desktopBannerUrl`.
2. **Penguatan Loading di Desktop WPF**:
   - `LoadDynamicBrandingAsync` di `MainWindow.xaml.cs` membaca `desktopBannerUrl` prioritas utama.
   - Untuk URL remote (HTTP/HTTPS), file gambar diunduh sebagai byte stream menggunakan `HttpClient.GetByteArrayAsync` terlebih dahulu sebelum di-decode ke `BitmapImage` dengan `MemoryStream`. Pendekatan ini mengatasi masalah kegagalan render gambar remote pada komponen WPF `Image` secara permanen.

### E. Pembersihan API Key Otomatis pada Clean Install
1. **Penghapusan Hardcoded Fallback**:
   - Di `story-in-manager-wpf/Services/ProductivityStorageService.cs`, menghapus default key fallback contoh bawaan (`[MASKED_DEFAULT_KEY]`).
   - Pada clean install / perangkat baru tanpa konfigurasi, kolom API key di Story Generator kini 100% kosong (blank), mewajibkan pengguna memasukkan API key Gemini mereka sendiri sesuai petunjuk.

### F. Integrasi Penuh Pengaturan Pembayaran ke Semua Alur Checkout
1. **Instant Checkout Modal Web**:
   - Ditambahkan tab pemilih metode pembayaran:
     - 📱 **QRIS Instant**: Menampilkan barcode QRIS dari `settings.payment.qrisImageUrl`.
     - 🏦 **Transfer Bank**: Menampilkan seluruh rekening aktif dari `settings.payment.virtualAccounts` lengkap dengan tombol salin nomor rekening dan nama pemilik rekening.
     - 💳 **E-Wallet**: Menampilkan seluruh e-wallet aktif dari `settings.payment.ewallets` lengkap dengan tombol salin nomor.
     - Menampilkan catatan/instruksi admin dari `settings.payment.instructions`.
     - Tombol konfirmasi WhatsApp otomatis menyertakan metode pembayaran yang dipilih.
2. **Public Invoice View**:
   - Menghapus nomor rekening hardcoded (`8210984123`).
   - Secara dinamis menyajikan rekening bank / virtual account dari `settings.payment.virtualAccounts` dan instruksi transfer.
3. **Desktop Shop Checkout Dialog**:
   - Dialog checkout mendukung konfigurasi pembayaran nested (`settings.payment`) untuk QRIS dan instruksi.

### G. Kenaikan Versi Otomatis ke v0.0.3 & Rilis GitHub
1. **Versi Aplikasi Desktop**:
   - `AIPilotManager.csproj` dinaikkan ke `<Version>0.0.3</Version>`.
   - Header badge di `MainWindow.xaml` dan konstanta di `MainWindow.xaml.cs` dinaikkan ke `v0.0.3`.
2. **Katalog & Download Web**:
   - `StoreContext.jsx` diperbarui ke `version: '0.0.3'` mengarah ke release GitHub `v0.0.3`.
3. **Penerbitan Single-File Executable**:
   - Binary standalone `Story.in-AI-Manager.exe` (163 MB) berhasil dikompilasi menggunakan .NET 8 SDK.
   - Rilis publik `v0.0.3` berhasil diterbitkan di repositori GitHub `studioentaf-bit/dyariinapp` dan aset binary telah diunggah.

---

*Catatan ini harus dibaca dan dipatuhi pada setiap iterasi pengembangan berikutnya.*
