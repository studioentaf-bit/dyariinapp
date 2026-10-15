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

## 🚨 4. SOP WAJIB DEPLOY & VERIFIKASI (MANDATORY DEPLOYMENT SOP)

> [!IMPORTANT]
> **ATURAN MUTLAK SISTEM (NON-NEGOTIABLE):** Setiap kali pengerjaan atau perbaikan selesai, AI Assistant **WAJIB** menjalankan dan menyertakan prosedur deploy ke VPS. Pekerjaan TIDAK boleh dianggap tuntas hanya dengan `git commit` dan `git push`. Alur 5-Langkah SOP Deploy berikut wajib ditaati setiap saat:
> 
> 1. **Compile & Build Test Lokal:** Jalankan `npm run build` di direktori proyek lokal untuk menjamin 0 error.
> 2. **Git Commit & Push ke Main:** Lakukan commit deskriptif dan push ke `origin main`.
> 3. **Instruksi & Eksekusi Deploy VPS (Wajib Disertakan):** Jalankan atau selalu sertakan perintah 1-baris deploy VPS di setiap akhir pesan agar sistem live langsung diperbarui:
>    ```bash
>    cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
>    ```
> 4. **Live Endpoint Health Check:** Lakukan verifikasi bahwa website dan endpoint produksi (`https://dyariapp.my.id`) merespons dengan benar.
> 5. **Pencatatan Master Log:** Catat rincian perubahan pada berkas `PROJECT_MASTER_LOG.md` di bawah seksi versi terbaru dengan status deploy yang jelas.

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

### H. Penguatan Deteksi Pembaruan Desktop & Jaminan Tampilan Versi 0.0.3 di Website
1. **Penegakan Versi Minimum di Backend (`server/index.js`)**:
   - Dibuat fungsi pembanding versi `isVersionGreater(MIN_OFFICIAL_VERSION, version)` dengan `MIN_OFFICIAL_VERSION = '0.0.3'`.
   - Endpoint `/api/app-version`, `/api/app/version`, dan `/api/app/download` dijamin tidak akan pernah menyajikan versi `0.0.2` meskipun database memiliki konfigurasi lama.
2. **Pembersihan Cache Frontend (`DownloadAppView.jsx`, `HomeView.jsx`, `StoreContext.jsx`)**:
   - Menambahkan guard proteksi agar tampilan halaman download dan beranda web langsung merender `0.0.3` (Resmi) tanpa terpengaruh cache lama browser (`0.0.2`).
3. **Dual-Channel Auto-Update Desktop WPF**:
   - Fungsi `CheckForUpdatesAsync` di `MainWindow.xaml.cs` diperkuat dengan pengecekan ganda:
     1. Mengecek endpoint web resmi `/api/app-version`.
     2. Mengecek langsung GitHub Releases API (`api.github.com/repos/studioentaf-bit/dyariinapp/releases/latest`) sehingga pembaruan terdeteksi secara instan tanpa jeda cache.
4. **Pop-Up Rekomendasi Update Otomatis saat First Launch**:
   - Pada saat pengguna pertama kali membuka aplikasi desktop yang belum diperbarui, sistem otomatis mendeteksi rilis baru dalam 1.2 detik dan menampilkan pop-up modal `UpdateDialog`.
   - Pengguna dapat langsung mengklik **"Update Otomatis Sekarang"** (auto-download & in-place update) atau **"Unduh di Browser"**.

### I. Pembaruan v0.0.4: Banner Dashboard Admin, Pembersihan Akun Platform, dan Sanitasi API Key
1. **Banner Dashboard Aplikasi Desktop dari Branding Panel Admin**:
   - Memperbaiki sinkronisasi penyimpanan di `StoreContext.jsx` agar memanggil endpoint backend `api.settings.update(updated)` ke database PostgreSQL.
   - Menyertakan field `desktopBannerUrl` dan `bannerImageUrl` pada state sinkronisasi.
   - Mengubah layout `DynamicHeroBannerImage` di `MainWindow.xaml` agar merender gambar dengan `Height="175"` dan `Stretch="UniformToFill"`, mengisi penuh card hero sambutan saat banner telah diunggah oleh admin.
2. **Pembersihan Akun Platform Bawaan (Dimulai dari 0 Akun Bersih)**:
   - Menghapus akun mockup bawaan (`flow_acc_01`, `dola_acc_01`, `chatgpt_acc_01`) dari file data lokal.
   - Menambahkan filter *auto-purge* pada `StorageService.cs` di fungsi `LoadAccounts()`. Setiap akun dengan prefix mockup lama otomatis disaring dan dihapus secara permanen sehingga pengguna yang baru mengunduh aplikasi desktop mendapatkan daftar akun yang benar-benar kosong (0 akun).
3. **Sanitasi Total API Key di Story Generator (Desktop & Web)**:
   - Mengosongkan file `keys.json` lokal di direktori produktivitas desktop.
   - Menghapus seluruh potongan kunci uji coba dan fragment fallback hardcoded pada `GeminiApiService.cs`, `gemini.js`, dan kedua file `index.html` Story Generator.
   - Menambahkan pembersihan otomatis (*auto-purge*) pada `localStorage` browser dan `ProductivityStorageService.cs` untuk memastikan pengguna baru di perangkat baru tidak memiliki API key default yang terisi secara gaib.
4. **Kenaikan Versi Otomatis ke v0.0.4 & Deploy**:
   - Versi desktop dinaikkan ke `0.0.4` pada `AIPilotManager.csproj`, `MainWindow.xaml`, dan `MainWindow.xaml.cs`.
   - Versi backend dan frontend web dinaikkan ke `0.0.4` pada `server/index.js`, `StoreContext.jsx`, `DownloadAppView.jsx`, dan `HomeView.jsx`.
   - Kompilasi ulang binary `Story.in-AI-Manager.exe` menggunakan .NET 8 SDK dan diterbitkan ke [GitHub Release v0.0.4](https://github.com/studioentaf-bit/dyariinapp/releases/tag/v0.0.4).
   - Seluruh perubahan web di-build dengan Vite dan di-push ke branch `main`.

### J. Pembaruan v0.0.5: Penyatuan Kontrol Banner Desktop Admin, Standarisasi Resolusi 1200x240 px, dan Rilis v0.0.5
1. **Penyatuan Kontrol Banner di Panel Admin**:
   - Di menu Pengaturan Branding Web Admin, kedua form banner (web dan desktop) disatukan menjadi satu kontrol khusus: **"💻 Banner Dashboard Aplikasi Desktop"**.
   - Menghapus input duplikat agar admin hanya fokus mengunggah satu banner yang langsung terhubung ke aplikasi desktop.
   - Menyimpan nilai banner ke kedua kunci (`desktopBannerUrl` dan `bannerImageUrl`) secara simultan untuk kompatibilitas penuh.
2. **Standarisasi Ukuran & Resolusi Banner Desktop**:
   - Ditambahkan panduan resolusi presisi di panel admin: **1200 × 240 pixel (Rasio 5:1 Ultrawide Banner)**.
   - Format yang didukung: JPG, PNG, atau WebP.
   - Di `MainWindow.xaml`, tinggi komponen `DynamicHeroBannerImage` disesuaikan ke `Height="190"` dengan `Stretch="UniformToFill"`, menjamin banner dengan rasio 5:1 tampil penuh, proporsional, dan tidak terpotong pada berbagai resolusi monitor desktop.
3. **Kenaikan Versi Otomatis ke v0.0.5 & Rilis GitHub**:
   - Versi desktop dinaikkan ke `0.0.5` pada `AIPilotManager.csproj`, `MainWindow.xaml`, dan `MainWindow.xaml.cs`.
   - Versi backend dan frontend web dinaikkan ke `0.0.5` pada `server/index.js`, `StoreContext.jsx`, `DownloadAppView.jsx`, dan `HomeView.jsx`.
   - Binary standalone `Story.in-AI-Manager.exe` (163 MB) dikompilasi ulang dengan .NET 8 SDK dan diterbitkan ke [GitHub Release v0.0.5](https://github.com/studioentaf-bit/dyariinapp/releases/tag/v0.0.5).
   - Seluruh perubahan frontend web berhasil di-build dan di-push ke branch `main`.

### K. Pembaruan v0.0.6: Akurasi Harga Shop Desktop, Auto-Reload Banner & Fallback Greeting, Toggle & Proteksi Sidebar, Top Bar Responsif, Crop Banner 1200x240 Admin, Card Lisensi Ringkas, dan Deskripsi Produk Penuh
1. **Akurasi Harga Produk & Lisensi Toko Desktop (Fix Bug Rp 2.400.000 & Rp 0)**:
   - Memperbaiki parsing harga di `MainWindow.xaml.cs` dengan fungsi universal `ParsePriceValue(JsonElement prop)` berbasis `CultureInfo.InvariantCulture`.
   - Menghilangkan bug budaya lokal (`id-ID`) di mana titik desimal PostgreSQL (`"24000.00"`) dianggap pemisah ribuan sehingga melipatgandakan harga menjadi Rp 2.400.000. Sekarang tampil akurat Rp 24.000 sesuai website.
   - Memperbaiki fungsi `ExtractLicensePrice(JsonElement el)` agar mengekstrak properti flat (`price`, `amount`, `original_price`, `originalPrice`) di samping format bersarang `prices`, sehingga seluruh kartu paket lisensi tidak lagi menampilkan Rp 0 / bln melainkan harga riil (Rp 49.000, Rp 199.000, dst.) lengkap dengan coret harga promo.
   - Suffix durasi lisensi disesuaikan secara dinamis dari properti `period` / `duration` (misal: "Lifetime", "30 Hari") dan tidak lagi dipaksa "/ bln".
2. **Auto-Reload Banner & Default Fallback Greeting**:
   - Menambahkan `DispatcherTimer` yang melakukan polling branding otomatis setiap 20 detik serta event listener window `Activated` saat pengguna kembali ke jendela aplikasi desktop.
   - Mencegah kedip (*flicker*) dengan mengecek URL banner terakhir (`_lastLoadedBannerUrl`).
   - Jika admin mengosongkan banner atau menghapusnya di panel admin, aplikasi desktop otomatis menyembunyikan gambar banner dan mengembalikan layout kartu greeting awal (*"Selamat Datang di Story.In AI Manager"*).
3. **Menu Sidebar: Tombol Toggle Terbuka/Tutup & Penghapusan Bug Hilang Sendiri**:
   - Menghapus logika auto-collapse pada `Window_SizeChanged` dan menonaktifkan pemanggilan `AutoCollapseSidebarIfNarrow()`.
   - Menambahkan tombol toggle burger (`☰`) yang selalu terlihat di bar atas aplikasi desktop.
   - Sidebar kini murni hanya membuka/menutup saat tombol `☰` diklik atau saat menekan pintasan keyboard `Ctrl+B`.
4. **Top Bar Responsif Anti-Terpotong (Portrait / Layar Sempit)**:
   - Search bar di top title bar diubah dari fixed width `360px` menjadi fleksibel responsif (`MaxWidth="360"`, `MinWidth="130"`).
   - Seluruh badge dan tombol kontrol jendela Windows (`—`, `⬜`, `✕`) dijamin selalu terlihat dan tidak pernah terdorong keluar layar saat jendela diubah ke orientasi portrait atau diperkecil.
5. **Panel Admin Branding: Preview Layar 5:1 & Fitur Potong / Crop Gambar (1200 × 240 px)**:
   - Menambahkan visual box preview rasio 5:1 (Ultrawide) di panel admin menu Pengaturan Branding.
   - Menyediakan slider interaktif untuk **Zoom** (100% - 250%), **Posisi Vertikal Y** (0% - 100%), dan **Posisi Horizontal X** (0% - 100%).
   - Menyediakan tombol **"✂️ Terapkan & Potong Gambar (1200 × 240)"** yang memproses gambar langsung di browser menggunakan HTML5 Canvas menjadi format presisi 1200×240 pixel tanpa perlu software luar.
6. **Ukuran Card Lisensi di Website Diperkecil & Lebih Proporsional**:
   - Pada `LicensesView.jsx`, layout grid diubah menjadi 4 kolom responsif (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).
   - Padding card dan elemen tipografi diperkecil setara dengan card produk shop agar tampilan lebih rapi, padat, dan nyaman dilihat di berbagai perangkat.
7. **Deskripsi Produk Shop di Website Tampil Penuh (Expandable)**:
   - Pada `ProductCard.jsx`, menghapus pemotongan paksa `line-clamp-2` dan menambahkan styling `whitespace-pre-line` serta tombol interaktif `[▼ Selengkapnya... / ▲ Tutup Deskripsi]`.
   - Seluruh detail fitur produk, bullet point, dan keterangan akun dapat dibaca secara utuh oleh calon pembeli.
8. **Kenaikan Versi ke v0.0.6 & Rilis GitHub**:
   - Binary desktop dikompilasi dengan .NET 8 ke versi `0.0.6`.
   - Diterbitkan ke [GitHub Release v0.0.6](https://github.com/studioentaf-bit/dyariinapp/releases/tag/v0.0.6).
   - Seluruh versi di web dan backend disinkronkan ke `0.0.6`.

### L. Pembaruan v0.0.7: Validasi Kurva & Jam Ramai Dashboard Riil, Fitur Hapus Riwayat Transaksi, dan Peningkatan Keamanan Obfuscated URL Admin
1. **Validasi & Integrasi Data Grafik Dashboard (Kurva Omset & Analisa Jam Ramai 24 Jam)**:
   - Memperbaiki `getAnalyticsData()` di `AdminDashboardView.jsx` agar memfilter data pesanan nyata (`orders`) secara presisi berdasarkan filter periode waktu yang aktif: **Harian (24 Jam / Hari Ini)**, **Mingguan (7 Hari Terakhir)**, **Bulanan (30 Hari Terakhir)**, dan **Rentang Tertentu (Custom Date Range)**.
   - Mengganti logika lama yang memusatkan total omset hanya pada slot terakhir menjadi pembagian omset riil berbasis interval waktu (per 3 jam untuk harian, per hari untuk mingguan, per minggu untuk bulanan, dan 5 titik interval seragam untuk rentang kustom).
   - Menyelaraskan grafik kedua (Analisa Aktivitas Transaksi & Jam Ramai 24 Jam Penuh: 00:00 - 24:00 WIB) dengan daftar pesanan terfilter yang sama, menghitung kepadatan transaksi dan total omset per jam secara akurat, serta mendeteksi jam puncak transaksi (*peak prime-time hour*).
   - Mengintegrasikan peringkat produk terlaris, total omset, total unit, dan ringkasan advice dinamis agar sinkron dengan periode analitik yang dipilih.
2. **Tombol Hapus Transaksi di Menu Riwayat Transaksi**:
   - Menambahkan rute backend `DELETE /api/orders/:id` di `server/routes/orders.js` dengan proteksi otorisasi administrator. Rute ini menghapus data relasi pada tabel `order_items` dan `orders` secara bersih di PostgreSQL.
   - Mengembangkan fungsi `deleteOrder(orderId)` di `StoreContext.jsx` agar memanggil API penghapusan backend dan memperbarui state lokal serta cache `localStorage`.
   - Menambahkan tombol aksi hapus (ikon tong sampah `Trash2` berwarna merah) pada tabel Riwayat Transaksi di `AdminDashboardView.jsx` lengkap dengan dialog konfirmasi keamanan pencegahan salah klik.
3. **Peningkatan Keamanan Panel Admin & Obfuscated Secret Route Slug**:
   - Menutup akses publik langsung ke `/#admin`: pengunjung publik atau bot yang mencoba mengetik `/#admin` tanpa sesi admin aktif atau tanpa token kunci akan langsung dialihkan secara otomatis ke Beranda (`#home`).
   - Menerapkan sistem URL rahasia berbasis custom slug (default: `/#dyari-vault-admin` atau slug yang dapat diubah sesuai preferensi admin di tab Keamanan).
   - Menyediakan fitur salin tautan 1-klik di menu Pengaturan Keamanan untuk menyalin URL rahasia panel admin ke clipboard.
   - Menambahkan fitur **Kunci Sesi Otomatis (Inactivity Auto-Lock)** yang memantau interaksi pengguna (mouse, keyboard, scroll) dan secara otomatis mengunci sesi panel admin setelah durasi tidak aktif tertentu (pilihan: 15m, 30m, 1 jam, 2 jam).
   - Menambahkan proteksi **Brute-Force Guard / Rate Limiter** pada form login admin: membekukan percobaan login selama 5 menit jika terjadi 5 kali kegagalan memasukkan kredensial secara berturut-turut lengkap dengan countdown timer.
4. **Status Deploy & Eksekusi VPS**:
   - Kode telah berhasil dibuild (`npm run build`) tanpa error.
   - Perubahan telah dicommit dan dipush ke branch `origin main`.
   - **Perintah Deploy VPS (Eksekusi Wajib):**
     ```bash
     cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
     ```

### M. Pembaruan v0.0.8: Perbaikan Total Fulfillment Checkout Produk Digital, Pengurangan Stok Riil PostgreSQL, & Sinkronisasi Menu Shop Desktop App
1. **Perbaikan Fulfillment Produk Shop Digital vs Lisensi**:
   - **Akar Masalah**: Sebelumnya, saat status pesanan diubah menjadi `LUNAS` oleh admin, `server/routes/orders.js` secara membabi-buta menerbitkan lisensi ke tabel `licenses` untuk semua produk (termasuk produk digital toko seperti Gemini Pro, Canva, G-Drive, dll.). Selain itu, `InstantCheckoutModal.jsx` memiliki percabangan `{isLicense || generatedLicenseCode ? ...}` yang memaksa tampilan berubah menjadi "Lisensi Resmi Story Generator AI" lengkap dengan tombol "Langsung Buka Story Generator".
   - **Solusi**:
     - Memperbaiki `server/routes/orders.js` (`PUT /api/orders/:id/status`): Hanya produk yang terbukti merupakan alat lisensi (`license_required === true`, `category_id === 'tools-ai'`, `type === 'LISENSI'`, atau judul mengandung kata 'lisensi' / 'story generator') yang diterbitkan ke tabel `licenses`.
     - Untuk produk shop digital non-lisensi: backend sama sekali **TIDAK** menerbitkan lisensi palsu, melainkan menetapkan kredensial akun / akses link langsung ke kolom `order_items.assigned_account` dan `order_items.access_link`.
     - Memperbaiki `InstantCheckoutModal.jsx`: Percabangan kini murni mengacu pada jenis produk (`isLicense`). Jika produk yang dibeli adalah produk digital shop, modal checkout secara presisi menampilkan container **"Akses Produk Digital"** (berisi box kredensial akun/email/password lengkap dengan tombol salin, tombol **"Buka Akses / Unduh Materi Produk"**, dan petunjuk penggunaan paska pembelian).
2. **Pengurangan Stok Otomatis Riil di Database PostgreSQL**:
   - **Akar Masalah**: Saat admin menyetujui pesanan menjadi `LUNAS`, kolom `stock_count` dan array `account_stock` pada tabel `products` di PostgreSQL tidak pernah diperbarui, sehingga kuota produk tidak berkurang di database.
   - **Solusi**:
     - Di `server/routes/orders.js` pada saat `LUNAS`:
       - Menelusuri baris akun belum terjual (`!s.isSold`) pada kolom `account_stock` (JSONB) di PostgreSQL.
       - Menandai akun yang diambil sebanyak kuota pembelian dengan `isSold: true`, `soldTo: order.invoice_number`, `soldToEmail: order.customer_email`, dan timestamp penjualan `soldAt`.
       - Menghitung sisa stok riil dan memperbarui kolom `stock_count` serta status stok (`stock_status`: `'TERSEDIA'` / `'HABIS'`).
       - Menambah counter `sales_count` di tabel `products`.
       - Mengosongkan cache memory server (`clearProductsCache()`) agar endpoint `GET /api/products` seketika menyajikan stok terbaru untuk seluruh platform.
     - Di `src/context/StoreContext.jsx`:
       - Memperbarui `fulfillOrderCredentials()` agar memotong stok lokal dan memanggil API `syncStockToBackend()` untuk semua produk digital.
       - Menyinkronkan kolom `assigned_account` dan `access_link` dari backend ke state aplikasi pada fungsi `syncOrdersFromBackend()`.
3. **Penyelarasan Menu Shop & Stok Aplikasi Desktop (`Story.in AI Manager` WPF)**:
   - Memperbarui fungsi `ExtractStock()` di `MainWindow.xaml.cs` aplikasi desktop agar selain membaca `stock_count`, juga memeriksa array `account_stock` untuk menghitung akun yang belum terjual (`!isSold`).
   - Memastikan harga produk shop maupun lisensi di aplikasi desktop konsisten 100% dengan data katalog website (`app_price` / `price`).
   - Mengupdate versi aplikasi desktop di `AIPilotManager.csproj` ke versi `0.0.8`.
4. **Kenaikan Versi ke v0.0.8 & Sinkronisasi Global**:
   - Menyelaraskan seluruh konstanta rilis ke versi `0.0.8` di `server/index.js`, `src/context/StoreContext.jsx`, `src/views/DownloadAppView.jsx`, `src/views/HomeView.jsx`, dan WPF project.
5. **Status Build & Deploy VPS**:
   - Kompilasi Vite telah diuji dan lulus bersih: `npm run build` sukses 100%.
   - Perubahan telah dicommit dan dipush ke branch `origin main`.
   - **Perintah Deploy VPS (Eksekusi Wajib):**
     ```bash
     cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
     ```

---

*Catatan ini harus dibaca dan dipatuhi pada setiap iterasi pengembangan berikutnya.*


