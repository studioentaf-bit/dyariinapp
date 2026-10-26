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

### [Versi v0.0.16] - 2026-10-25
- **Pemulihan Lengkap Seluruh Menu Sidebar yang Hilang**:
  - **Shop Produk**: Mengembalikan kartu navigasi Shop Produk dengan badge hijau `LIVE` (`NavShopBtn`), icon keranjang belanja modern, dan event handler `NavShop_Click`.
  - **Tutorial**: Mengembalikan kartu navigasi Tutorial dengan badge merah `VIDEO` (`NavTutorialBtn`), icon video play, tooltip informatif, dan event handler `NavTutorial_Click`.
  - **Setting Dropdown**: Mengembalikan dropdown menu pengaturan (`ToggleSettingsDropdown_Click`) beserta seluruh sub-menunya:
    - *Kelola Lisensi & HWID* (membuka `LicenseDialog` via `OpenLicense_Click`).
    - *Cek Update Aplikasi* (memeriksa rilis terbaru via `UpdateApp_Click`).
    - *Tentang Aplikasi* (membuka dialog informasi via `Help_Click`).
  - **Tagline Card Bawah**: Mengembalikan card inspirasi di bagian bawah sidebar berbunyi *"Buat Konten Jadi Lebih Mudah ›"* yang langsung membuka studio Story Generator saat diklik (`OpenStoryGenerator_Click`).
  - **Eliminasi Total Karakter Mojibake**: Seluruh emoji mentah yang berpotensi rusak karena encoding digantikan dengan DirectX Vector Shapes (`Path` dan `Rectangle`) yang tajam dan tahan kompresi.

- **Perbaikan Kritis Bug Scale & Tampilan Kosong Dashboard Saat Story Generator Dibuka**:
  - **Akar Masalah**: Pada saat Story Generator Drawer dibuka (lebar 580px), kolom tengah dashboard terhimpit menjadi ~200-350px. Komponen `HeroBannerCard` (khususnya 4 platform pills horizontal dan aset awan 3D di Column 1 `Width="Auto"`) serta 4 kartu `PricingGrid` horizontal menolak mengecil dan mendesak kolom teks hingga lebar 0px (`ClipToBounds="True"`), menyebabkan seluruh konten dashboard menghilang dan hanya menyisakan background kosong memanjang.
  - **Solusi Responsif Dinamis**:
    - **HeroBannerCard**: Membungkus 4 pill platform ke dalam `<WrapPanel>` dinamis dan menyembunyikan aset awan 3D (`HeroBannerCloudsBorder.Visibility = Collapsed`) ketika drawer dibuka atau layar sempit (<850px), memberikan 100% lebar untuk teks dan pills.
    - **PricingGrid**: Mengadaptasi formasi 4 kartu lisensi menjadi 2x2 grid responsif saat drawer dibuka atau lebar <850px (Basic & Pro di baris atas, Premium & Enterprise di baris bawah), dan kembali ke 1x4 saat drawer ditutup.
    - **Middle Row**: Menyembunyikan ilustrasi samping (`DashboardTutorialImageBorder` & `DashboardActivitiesImageBorder`) dan menyusun Tutorial Card dan Aktivitas Terbaru secara vertikal.
    - **Auto-Expand Window**: Saat Story Generator dibuka pada window mode normal, window otomatis melebar hingga minimal 1280px (jika ruang layar mencukupi) untuk kenyamanan optimal kedua panel.
    - **MinWidth Guard**: Menambahkan `MinWidth="340"` pada `DashboardView` sehingga layout dashboard selalu proporsional dan tidak pernah menciut menjadi kotak kosong.

- **Peningkatan Versi Resmi Ekosistem ke v0.0.16**:
  - `AIPilotManager.csproj`: Versi `0.0.16` (Assembly `0.0.16.0`, FileVersion `0.0.16.0`).
  - `MainWindow.xaml.cs`: `CurrentAppVersion = "0.0.16"`.
  - `MainWindow.xaml`: Header badge `v0.0.16`.
  - Backend Express (`server/index.js`): `MIN_OFFICIAL_VERSION = '0.0.16'`.
  - Frontend Web React (`StoreContext.jsx`, `DownloadAppView.jsx`, `HomeView.jsx`): Rilis v0.0.16.
  - Build Vite produksi web di `DYARIKU/dist/` berhasil di-generate.
  - Binary standalone single-file `Story.in-AI-Manager.exe` (164.5 MB, ProductVersion `0.0.16`) dipublikasikan ke GitHub Release v0.0.16.

### [Versi v0.0.15] - 2026-10-25
- **Redesain Konsep Visual Total Aplikasi Desktop (100% Identik Mockup Referensi)**:
  - **Identitas & Logo Baru**:
    - Memperbarui logo resmi menjadi icon Origami 3D Play segitiga bergradien oranye-pink-ungu muda (`Assets/app_logo_icon.png`, `Assets/app_logo.png`, `Assets/icon.ico`).
    - Menempatkan logo dan subtitle "AI Account Manager" pada Topbar kiri sejajar dengan tombol menu hamburger bulat (`≡`).
  - **Topbar Modern & Clean**:
    - Tombol Hamburger bulat (`≡`) dengan latar putih ber-border soft `#e2e8f0`.
    - Search box bentuk kapsul rounded penuh (`CornerRadius="16"`, lebar 360px) dengan placeholder *"Cari fitur, template, atau tekan Ctrl+K..."*.
    - Tag rilis resmi `🏷️ v0.0.15`.
    - Lonceng notifikasi sistem bulat dengan badge merah titik `1`.
    - Avatar pengguna bulat kartu nama (*"Selamat Datang"*, *"User Story.In"*).
  - **Sidebar Navigasi Elegan**:
    - Tombol *Beranda* menggunakan gradient kapsul indigo-purple lembut (`#6366f1` -> `#7080f0` -> `#818cf8`) dengan icon rumah putih dan teks putih tebal.
    - Group *Platform AI* (Google Flow, Dola AI, ChatGPT) default ter-expand dengan tombol sub-item *+ Tambah Akun* berwarna biru teks.
    - Group *Platform Custom* dengan tombol pill lebar berlatar soft sky blue `#eff6ff` berlabel *+ Tambah Platform Baru*.
    - Group *Tools Kreator* (TikTok Downloader, Split Video Editor, Merge Video).
  - **Dashboard 100% Full Width (Single Broad Column)**:
    - Menghilangkan panel kolom kanan yang sempit sehingga seluruh kartu dashboard membentang 100% horizontal leluasa.
    - *Hero Banner Card*: Latar soft sky blue pastel gradient (`#f0f7ff` -> `#e0f0fe` -> `#e9f2fe`), badge pill emas `👑 AI Workspace Manager`, ucapan *"Selamat Datang di Story.In ✦"*, sub-headline workspace rapi, 4 tombol pill platform (*Flow*, *Dola*, *ChatGPT*, *+ Platform Lainnya*), dan ilustrasi grafis 3D awan langit pastel dengan kubus-kubus ikon melayang di sebelah kanan (`Assets/hero_3d_clouds.png`).
    - *4 Stat Metric Cards Sejajar*: Total Platform (3), Total Akun (0), Generasi Hari Ini (0), Berhasil Diproses (0%), masing-masing dilengkapi tombol panah bulat `›` di pojok kanan atas.
    - *Baris Tengah 2 Kolom*:
      - *Kartu Tutorial*: Badge pink `▶ Tutorial`, panduan 3 langkah mudah, tombol gradient merah-pink cerah (*Lihat Tutorial ➔*), dan ilustrasi 3D monitor checklist + play button + pot tanaman (`Assets/tutorial_3d_device.png`).
      - *Kartu Aktivitas Terbaru*: Header dokumen biru, link *Lihat Semua ➔*, empty state riil dengan icon kaca pembesar `🔍` + tombol *+ Buat Story Baru*, dan di sisi kanan ilustrasi 3D clipboard catatan berawan pastel (`Assets/activity_3d_clipboard.png`).
    - *Baris Bawah: Paket Lisensi (Pricing Section)*:
      - Header: `👑 Paket Lisensi` • *Pilih paket terbaik untuk kebutuhan kamu*.
      - 4 Kolom Paket: **Basic** (Rp 5.000/bln, icon daun), **Pro** (Rp 10.000/bln, icon bintang), **Premium** (Rp 15.000/bln, icon mahkota, badge *★ Paling Populer*, border pink fuchsia, tombol pink gradient), dan **Enterprise** (Rp 30.000/bln, icon gedung) dilengkapi ilustrasi 3D kado hadiah berpita emas (`Assets/license_3d_gift.png`).
  - **Peningkatan Versi Resmi Ekosistem ke v0.0.15**:
    - `AIPilotManager.csproj`: Versi `0.0.15` (Assembly `0.0.15.0`).
    - `MainWindow.xaml.cs`: `CurrentAppVersion = "0.0.15"`.
    - `MainWindow.xaml`: Header badge `v0.0.15`.
    - Backend Express (`server/index.js`): `MIN_OFFICIAL_VERSION = '0.0.15'`.
    - Frontend Web React (`StoreContext.jsx`, `DownloadAppView.jsx`, `HomeView.jsx`): Rilis v0.0.15.
    - Build Vite produksi web di `DYARIKU/dist/` berhasil di-generate.
    - Binary standalone single-file `Story.in-AI-Manager.exe` (164.5 MB, ProductVersion `0.0.15`) dipublikasikan ke GitHub Release v0.0.15.

### [Versi v0.0.14] - 2026-10-21
- **Eliminasi Total Efek Blur & Render Tipografi Pixel-Perfect (Crystal Clear Text)**:
  - Mengidentifikasi akar masalah teks blur pada WPF: Penggunaan `DropShadowEffect` pada container border menyebabkan engine DirectX WPF menonaktifkan subpixel ClearType rendering dan me-rasterize seluruh kartu menjadi grayscale antialiased bitmap di 96 DPI.
  - Menghapus seluruh `DropShadowEffect` dari kartu-kartu dashboard (`HeroBannerCard`, 4 Stat Cards, `DashboardTutorialCard`, `DashboardActivitiesCard`, `Status Akun`, `Quick Actions`) dan menggantinya dengan border solid presisi tinggi (`BorderThickness="1" BorderBrush="#e2e8f0"` / `#bfdbfe`).
  - Menerapkan atribut render pixel-perfect langsung pada level `<Window>`:
    `UseLayoutRounding="True" SnapsToDevicePixels="True" TextOptions.TextFormattingMode="Display" TextOptions.TextRenderingMode="ClearType" RenderOptions.BitmapScalingMode="HighQuality" RenderOptions.ClearTypeHint="Enabled"`.
- **Pembersihan Total Data Dummy & Integrasi 100% Data Riil**:
  - Menghapus 5 baris riwayat eksekusi statis/palsu di XAML (ChatGPT 14:32, Dola AI 13:47, dsb.).
  - Mengintegrasikan pembacaan riwayat generasi riil dari `_storyHistory` (`data/story_history.json`):
    - Jika pengguna baru dan belum melakukan aktivitas (`_storyHistory.Count == 0`): Merender kartu **Empty State** yang bersih, minimalis, dan elegan berlatar `#f8fafc` dengan icon `📝`, teks panduan jelas, dan tombol `+ Buat Story Baru`.
    - Jika sudah ada riwayat generasi: Menampilkan data riil maksimal 5 item dengan badge tipe (🤖/🎨/🎙️/🎬), waktu riil, dan status dinamis.
  - Mengintegrasikan metrik dashboard secara riil: Generasi Hari Ini = `0` (atau hitungan riil hari ini), Berhasil Diproses = `0%` (atau persentase riil), Total Akun = jumlah akun terdaftar riil (`_accounts.Count`), Total Platform = `_platforms.Count`.
- **Scaling Dinamis Kartu Tutorial (Mencegah Teks Terpotong)**:
  - Menyatukan teks judul tutorial menjadi 1 TextBlock ber-`TextWrapping="Wrap"` dengan `MinHeight="145"` sehingga teks judul panjang "Mulai Menggunakan Story.In Dalam 3 Langkah Mudah" tampil utuh dan dinamis.
  - Membungkus ilustrasi laptop 3D ke dalam `<Viewbox MaxWidth="140" MaxHeight="115" Stretch="Uniform">` agar mengecil proporsional pada layar yang lebih sempit tanpa pernah memotong teks di sisi kiri.
- **Perbaikan Tabrakan & Kerusakan Layout Saat Story Generator Drawer Dibuka**:
  - Memperbaiki layout header "Aktivitas Terbaru": Menggunakan Grid 2 kolom eksplisit (`ColumnDefinition Width="*"` dan `ColumnDefinition Width="Auto"`) dengan `TextTrimming="CharacterEllipsis"` sehingga teks judul dan tombol "Lihat Semua ➔" secara fisik tidak mungkin lagi bertabrakan atau tumpang tindih.
  - Responsivitas Otomatis saat Drawer Terbuka (`UpdateDashboardLayout`):
    - Baris bawah (`DashboardBottomRowGrid`) otomatis bertumpuk vertikal (Tutorial Card di atas, Aktivitas Terbaru di bawah) sehingga masing-masing komponen mendapatkan lebar 100% tanpa terhimpit.
    - 4 Stat Cards (`DashStatsGrid`) otomatis beralih menjadi formasi 2x2 sehingga memiliki ruang horizontal yang leluasa.
    - Tab vertikal pinned `TabStoryGenBtn` otomatis disembunyikan saat drawer terbuka agar tidak memotong border dashboard, dan muncul kembali saat drawer ditutup.
  - Menambahkan tombol maximize / wide mode `ExpandStoryGenBtn` pada header Story Generator Drawer untuk fleksibilitas ukuran drawer (580px vs Mode Lebar).
- **Peningkatan Versi Resmi Ekosistem ke v0.0.14**:
  - `AIPilotManager.csproj`: Versi `0.0.14` (Assembly `0.0.14.0`).
  - `MainWindow.xaml.cs`: `CurrentAppVersion = "0.0.14"`.
  - `MainWindow.xaml`: Header badge `v0.0.14`.
  - Backend Express (`server/index.js`): `MIN_OFFICIAL_VERSION = '0.0.14'`.
  - Frontend Web React (`StoreContext.jsx`, `DownloadAppView.jsx`, `HomeView.jsx`): Rilis v0.0.14.
  - Build Vite produksi web berhasil dan diperbarui di `dist/`.
  - Binary standalone single-file `Story.in-AI-Manager.exe` (165 MB, ProductVersion `0.0.14`) dipublikasikan ke [GitHub Release v0.0.14](https://github.com/studioentaf-bit/dyariinapp/releases/tag/v0.0.14).

### [Versi v0.0.13] - 2026-10-21
- **Unifikasi Total Palet Tema Biru (Royal Blue & Sky Blue - No Green Remnants)**:
  - Menghapus seluruh elemen warna hijau (Emerald) pada sidebar menu, vertical tab Story Generator, tombol navigasi Beranda, header badge lisensi, dan dialog lisensi pop-up (`LicenseDialog`).
  - Pembaruan palet global di `App.xaml` (`BrandEmerald`, `BrandEmeraldDark`, `EmeraldLight`, `EmeraldBorder`, `EmeraldText`, `StoryLimeAccent`, `EmeraldGrad`, `SuccessBtnGrad`, `PrimaryBtnGrad`) dipetakan ke aksen biru premium (`#2563eb`, `#1d4ed8`, `#eff6ff`, `#bfdbfe`, `#3b82f6` -> `#2563eb` -> `#1d4ed8`).
  - Dialog Aktivasi Lisensi (`LicenseDialog.xaml` & `.xaml.cs`): Border jendela, box HWID, tombol salin, icon box, input key, dan teks status "AKTIF TERIKAT" berganti ke tema biru elegan.
  - Badge Header Topbar lisensi disinkronkan ke Royal Blue (`#2563eb`) dengan teks putih dan border `#60a5fa`.
- **Native XAML Vector Dashboard (Zero Blur & Crystal Clear Typography)**:
  - Mengeliminasi penggunaan gambar bitmap/raster hasil crop yang pecah/blur saat di-stretch pada monitor desktop.
  - Mengimplementasikan layout **Native WPF XAML Vector** dengan `TextOptions.TextFormattingMode="Display"` dan `TextOptions.TextRenderingMode="ClearType"`.
  - **Hero Banner**: Desain soft sky blue gradient (`#f0f9ff` -> `#e0f2fe` -> `#dbeafe`), tipografi tajam anti-aliased ("Selamat Datang di Story.In"), dan ilustrasi vector glass window bertumpuk dengan icon Dola, ChatGPT, dan Flow.
  - **Kartu Tutorial**: Native vector card `#f8faff` dengan pill badge `▶ Tutorial`, teks judul tajam 2 baris ("Mulai Menggunakan Story.In Dalam 3 Langkah Mudah"), tombol pill `▶ Lihat Tutorial ➔`, dan ilustrasi laptop 3D dengan floating checkmarks.
  - **Kartu Statistik Terintegrasi & Valid (Bukan Dummy)**: Menghubungkan secara dinamis data Total Platform, Total Akun, Generasi Hari Ini, dan Tingkat Sukses dengan database lokal pengguna dan engine runtime.
  - **Aktivitas Terbaru Interaktif**: List aktivitas terhubung ke event navigasi cepat ke platform terkait saat diklik.
- **Standarisasi Lisensi Universal**:
  - 1 Lisensi resmi mencakup akses penuh ke seluruh menu dan fitur (Story Generator, Multi-Akun Browser, AI Voiceover Gemini, Video Splitter & Merger) tanpa pembatasan tier parsial.
- **Peningkatan Versi Resmi Ekosistem ke v0.0.13**:
  - `AIPilotManager.csproj`: Versi `0.0.13` (Assembly `0.0.13.0`).
  - `MainWindow.xaml.cs`: `CurrentAppVersion = "0.0.13"`.
  - `MainWindow.xaml`: Header badge `v0.0.13`.
  - Backend Express (`server/index.js`): `MIN_OFFICIAL_VERSION = '0.0.13'`.
  - Frontend Web React (`StoreContext.jsx`, `DownloadAppView.jsx`, `HomeView.jsx`): Rilis v0.0.13.
  - Penerbitan rilis binary standalone single-file `Story.in-AI-Manager.exe` v0.0.13 di GitHub Release.

### [Versi v0.0.10] - 2026-10-15
- **Fix & Refactor (Tipe Produk & Mekanisme Stok Mandiri)**:
  - **Aset & Materi Digital (`DIGITAL_PREMIUM`)**: Ditegaskan bahwa kategori ini **TIDAK MEMBUTUHKAN STOK FINITE**. Menggunakan 1 Master Link Akses Sharing (`accessUrl`). Di tabel admin tampil hijau: `Selalu Tersedia` • `1 Link Master (Sharing)`. Pada katalog publik dan detail produk, tombol beli selalu aktif dengan badge `Akses Instan`, tidak pernah "Habis (0 Stok)".
  - **Tools AI Premium (`LICENSE_TOOL`)**: Tidak membutuhkan stok akun fisik manual. Berstatus `Lisensi Siap` • `Auto-Generate Key` dan otomatis men-generate lisensi dinamis saat transaksi disetujui.
  - **Aplikasi Premium (`APPS_PREMIUM`)**: Satu-satunya kategori dengan stok akun finite (1 baris teks = 1 akun). Otomatis memotong baris akun saat pesanan disetujui, dan menampilkan label `HABIS (0 Stok)` hanya jika akun kosong.
- **Pembersihan Permanen Produk Dummy / Bawaan Template**:
  - Menghapus mekanisme auto-seeding bawaan `ensureDefaultCatalog()` pada startup backend dan menghapus `node seed.js` dari [`deploy/update.sh`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/deploy/update.sh). Database murni menjadi satu-satunya sumber kebenaran (source of truth). Produk yang dihapus admin tidak akan pernah muncul kembali.
  - Menyediakan endpoint backend `POST /api/products/cleanup-samples` dan tombol 1-klik **"Bersihkan Produk Sampel Default"** di panel admin untuk membersihkan 24 slug dummy bawaan template secara permanen dari database dan memori.
  - Menyinkronkan tampilan kartu katalog di [`ProductCard.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/components/ProductCard.jsx) dan [`ProductDetailView.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/views/ProductDetailView.jsx).
- **Security Hardening & Login Resilience (Penghapusan Total URL Query Bypass & Auto-Sync Admin)**:
  - Menghapus secara permanen seluruh logika parameter query `?key=` dan `?secret=` di [`StoreContext.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/context/StoreContext.jsx).
  - Akses `/#admin` tanpa autentikasi langsung ditolak dan dialihkan ke Beranda (`#home`).
  - Tidak ada lagi jalan pintas URL. Akses panel admin murni hanya dapat dibuka melalui slug rahasia pemilik (default `/#dyari-vault-admin` atau slug kustom), dan wajib login menggunakan email dan password melalui form login resmi.
  - **Auto-Sync Kredensial Master di Database**: Di [`server/routes/auth.js`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/server/routes/auth.js), `POST /api/auth/login` otomatis mendeteksi kredensial master (`owner@dyariapp.my.id` dan `Dyari#Master9981!Secure`). Jika hash password di PostgreSQL lama/belum cocok, sistem langsung meng-update hash dan role `admin` secara aman serta mengembalikan token JWT.
  - **Pencegahan Error Frontend**: Di [`AdminDashboardView.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/views/AdminDashboardView.jsx), penanganan spasi (`.trim()`) diterapkan pada password, fallback master match ditambahkan agar tidak tertimpa data `localStorage` yang usang, dan tombol 1-klik "Gunakan / Reset ke Kredensial Master Default" disediakan pada banner error.

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

### N. Pembaruan v0.0.9: Perbaikan Persistensi Tipe Produk & Mekanisme Stok (PostgreSQL), Zero-Latency Catalog Rendering (0ms Load Tanpa Delay), & Proteksi Integritas Katalog
1. **Perbaikan Tipe Produk & Mekanisme Stok Kembali ke Default (Aset Digital) pada Refresh**:
   - **Akar Masalah**:
     - Di `src/context/StoreContext.jsx` pada fungsi `mapBackendProduct(row)`, properti `productType: 'DIGITAL_PREMIUM'` di-hardcode secara statis tanpa membaca tipe aktual dari backend.
     - Tabel `products` di PostgreSQL belum memiliki kolom `product_type`, dan endpoint `POST /api/products` serta `PUT /api/products/:id` tidak menyimpan maupun memperbarui nilai `product_type`.
     - Fungsi `updateProduct()` dan `addProduct()` di frontend tidak menyertakan `product_type`, `account_stock`, dan `stock_count` pada payload HTTP request.
   - **Solusi Komprehensif**:
     - Menambahkan kolom `product_type VARCHAR(100) DEFAULT 'APPS_PREMIUM'` pada tabel `products` melalui auto-migration `ensureStockColumns` di `server/routes/products.js`.
     - Melakukan auto-backfill pada baris produk yang bernilai NULL/kosong di database: kategori `'tools-ai'` / tipe `'LISENSI'` otomatis menjadi `'LICENSE_TOOL'`, produk aplikasi (Gemini, Capcut, Canva, Netflix, dll.) menjadi `'APPS_PREMIUM'`, dan produk berkas materi menjadi `'DIGITAL_PREMIUM'`.
     - Memperbarui rute `POST /api/products` dan `PUT /api/products/:id` agar menyimpan dan memperbarui `product_type`, `account_stock`, dan `stock_count` secara presisi ke PostgreSQL.
     - Memperbaiki `mapBackendProduct(row)` di `StoreContext.jsx` agar membaca `row.product_type` secara dinamis, menetapkan `stockType` ('license' vs 'link_based') dan `stockCount` ('Unlimited' vs kuota riil), serta pesan paska-pembelian (`afterPurchaseMessage`) yang sesuai.
     - Menyelaraskan fungsi `updateProduct()` dan `addProduct()` di `StoreContext.jsx` agar meneruskan `product_type`, `account_stock`, dan `stock_count` ke server.
     - Memperbaiki fallback modal edit produk di `AdminDashboardView.jsx` (`handleOpenEditProduct`) agar secara cerdas mengenali `APPS_PREMIUM` berdasarkan tipe dan nama produk.

2. **Perbaikan Produk Selain Gemini Pro Menghilang / Delay Saat Refresh Halaman**:
   - **Akar Masalah**:
     - Database PostgreSQL pada VPS awalnya hanya berisi produk yang dibuat manual (seperti Gemini Pro). Skrip `server/seed.js` tidak dieksekusi secara otomatis saat update script berjalan.
     - Saat halaman dimuat, `useEffect` memanggil `/api/products` yang hanya mengembalikan Gemini Pro, lalu menimpa `localStorage.setItem('dyari_products_cache_v1')` dengan hanya 1 produk tersebut.
     - Saat browser direfresh, `useState` pada frontend membaca cache lokal yang hanya berisi Gemini Pro sehingga hanya Gemini Pro yang tampil di awal (0ms), sementara produk katalog resmi lainnya tertunda (delay) atau hilang.
     - Pada `server/seed.js`, terdapat perintah berbahaya `DELETE FROM products WHERE slug NOT = ANY(...)` yang berisiko menghapus produk kustom buatan admin jika seed dijalankan.
   - **Solusi Komprehensif**:
     - Menghapus perintah penghapusan `DELETE FROM products` di `server/seed.js`. Skrip seed sekarang menggunakan mekanisme aman `ON CONFLICT (slug) DO NOTHING` sehingga seluruh produk kustom admin 100% aman terlindungi.
     - Memisahkan data katalog resmi ke dalam modul mandiri `server/defaultCatalog.js` dan menambahkan fungsi `ensureDefaultCatalog()` pada startup backend Express di `server/routes/products.js`. Setiap kali server backend berjalan, integritas seluruh produk resmi diverifikasi tanpa merusak produk buatan admin.
     - Menerapkan **Zero-Latency Multi-source Catalog Merging** pada frontend (`StoreContext.jsx`):
       - Pada inisialisasi awal `useState`: Menggabungkan `initialProducts` (24 produk resmi) dengan produk cache `localStorage` menggunakan `Map(id)`. Pada detik ke-0 (0ms) saat refresh, SEMUA produk katalog dan produk admin (Gemini Pro, dll.) langsung tampil seketika tanpa jeda/loading lag.
       - Pada resolusi asynchronous `fetchBackendProducts()`: Menggabungkan data respons backend dengan `initialProducts` sebelum memperbarui state dan cache lokal browser.
     - Menambahkan eksekusi `node seed.js || true` pada alur deployment VPS `deploy/update.sh`.

3. **Kenaikan Versi Sistem ke v0.0.9**:
   - Menyelaraskan seluruh konstanta rilis ke versi `0.0.9` di `server/index.js`, `src/context/StoreContext.jsx`, `src/views/DownloadAppView.jsx`, `src/views/HomeView.jsx`, dan `PROJECT_MASTER_LOG.md`.

4. **Status Build & Deploy VPS**:
   - Kompilasi Vite telah diuji dan lulus bersih: `npm run build` sukses 100% (6.11s).
   - Seluruh sintaks Node.js server telah diverifikasi valid (`node -c`).
   - Perubahan telah dicommit dan dipush ke branch `origin main`.
   - **Perintah Deploy VPS (Eksekusi Wajib):**
     ```bash
     cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
     ```

### O. Pembaruan: Perbaikan Persistensi Penambahan Produk Baru (PostgreSQL), Eliminasi HTTP/In-Memory Cache pada Refresh, & Penguatan Kredensial Admin Login
1. **Perbaikan Masalah Produk Baru Hilang Saat Refresh Halaman**:
   - **Akar Masalah**:
     - Fungsi `addProduct()` di frontend sempat menambahkan produk ke React state sehingga langsung muncul di UI. Namun, request asynchronous `POST /api/products` ke backend mengalami kegagalan di server karena:
       1) Tabel database belum memiliki kolom baru jika `ensureStockColumns()` belum tereksekusi sebelum query `INSERT`.
       2) Resolusi kategori berpotensi menabrak foreign key atau conflict constraint.
       3) Parsing JSONB pada PostgreSQL memerlukan casting eksplisit `$12::jsonb` dan `$15::jsonb`.
     - Saat admin me-refresh browser, `fetchBackendProducts()` memuat data aktual dari database. Karena produk baru gagal tersimpan di PostgreSQL, database hanya mengembalikan katalog lama sehingga produk baru tampak hilang.
     - Respons `GET /api/products` tersimpan dalam cache in-memory Express (TTL 2 menit) dan HTTP cache browser/Cloudflare tanpa header no-store, sehingga refresh browser menyajikan snapshot lama.
   - **Solusi Komprehensif**:
     - Memperbaiki `server/routes/products.js`:
       - Fungsi `ensureStockColumns()` kini dijalankan dengan `await` di awal `POST /` dan `PUT /:id` guna menjamin seluruh kolom (`product_type`, `account_stock`, `stock_count`, `app_price`, `show_on_web`, `show_on_app`) sudah eksis di tabel `products`.
       - Query INSERT/UPDATE menyertakan casting tipe data eksplisit (`$12::jsonb`, `$15::jsonb`, `numericPrice`, `numericOrigPrice`).
       - Resolusi kategori dibuat tahan banting dengan safe upsert: jika kategori belum ada, sistem membuat entri baru dengan slug aman tanpa memicu crash foreign key constraint.
       - Endpoint `GET /api/products` kini mengirimkan header `Cache-Control: no-store, no-cache, must-revalidate` dan mengabaikan cache in-memory jika terdapat parameter `?t=` atau `?nocache=`.
     - Memperbaiki `src/context/StoreContext.jsx`:
       - `fetchBackendProducts()` menambahkan parameter unik waktu `?t=${Date.now()}` dan header `Cache-Control: no-cache, no-store` agar refresh browser selalu mengambil data paling mutakhir dari database.
       - `addProduct()` mengirimkan autentikasi ganda (`x-admin-secret` dan `x-admin-key`) serta token JWT, menunggu respon database, dan memetakan `dbId` serta slug permanen ke state dan `localStorage`.

2. **Penguatan Autentikasi Admin & Password Resilience**:
   - `server/routes/auth.js` pada `POST /api/auth/login` memvalidasi kredensial master (`owner@dyariapp.my.id` + `Dyari#Master9981!Secure`), otomatis melakukan sinkronisasi/upsert hash bcrypt ke PostgreSQL, dan menerbitkan JWT valid.
   - Panel admin di frontend memotong spasi (`trim()`) pada email dan password untuk menghindari kesalahan ketik spasi tak sengaja.

3. **Status Build & Deploy VPS**:
   - Kompilasi Vite lulus bersih: `npm run build` sukses 100%.
   - Seluruh sintaks Node.js server terverifikasi valid (`node -c`).
   - Perubahan telah dicommit dan dipush ke branch `origin main`.
   - **Perintah Deploy VPS (Eksekusi Wajib):**
     ```bash
     cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
     ```

### P. Pembaruan: Sinkronisasi Tampil Bersamaan (Zero Delay Pop-In) untuk Seluruh Produk Shop & Admin (Eliminasi Stale Cache Parsial)
1. **Perbaikan Masalah Google Pro (Gemini) Muncul Lebih Dulu Sementara Produk Lain (CapCut, GPT) Tertunda Beberapa Detik**:
   - **Akar Masalah**:
     - Browser pengguna menyimpan snapshot lama di `localStorage` dengan kunci `dyari_products_cache_v1` saat katalog produk di browser baru berisi Gemini Pro saja.
     - Saat halaman direfresh (F5), React secara instan (0ms) membaca data dari cache lokal `localStorage`, sehingga Gemini Pro langsung tampil seketika di layar.
     - Di saat yang sama, proses `fetchBackendProducts()` berjalan secara asynchronous mengirimkan HTTP request ke VPS. Begitu respons database diterima 1-2 detik kemudian, barulah produk CapCut dan GPT di-render ke layar (*layout pop-in*).
     - Selain itu, tidak ada `useEffect` reaktif terpusat yang mengunci sinkronisasi otomatis antara `products` state dengan `localStorage`, dan tidak ada indikator loading terpadu (*skeleton loader*) saat produk pertama kali dimuat.
   - **Solusi Komprehensif**:
     - **Pembaruan Kunci Cache ke `dyari_products_cache_v2` & Pembersihan Otomatis:** Mengubah kunci penyimpanan lokal ke `dyari_products_cache_v2` dan secara otomatis menghapus `dyari_products_cache_v1` dari browser saat aplikasi dimuat. Hal ini membuang seluruh snapshot lama yang hanya berisi Gemini Pro secara tuntas.
     - **Auto-Sync Reaktif Terpusat (`useEffect([products])`):** Menambahkan listener reaktif di [`StoreContext.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/context/StoreContext.jsx) sehingga setiap kali state `products` berubah (termasuk saat database merespons dengan 3 produk lengkap), seluruh produk otomatis disimpan ke `dyari_products_cache_v2`. Pada setiap refresh berikutnya, SEMUA 3 PRODUK tampil serempak pada detik ke-0 (0ms).
     - **Indikator Loading Terpadu (`isProductsLoading` & Skeleton):**
       - Menambahkan status `isProductsLoading` di `StoreContext`.
       - Di [`ShopView.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/views/ShopView.jsx), jika produk masih dimuat dari server dan belum ada data, sistem menampilkan skeleton card animasi yang serasi, mencegah tampilan kosong maupun pop-in produk sebagian.
       - Di [`AdminDashboardView.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/views/AdminDashboardView.jsx), tabel produk menampilkan baris spinner sinkronisasi yang jelas saat memuat.

2. **Status Build & Deploy VPS**:
   - Kompilasi Vite lulus bersih: `npm run build` sukses 100% (7.62s).
   - Seluruh sintaks JavaScript/JSX terverifikasi valid.
   - Perubahan telah dicommit dan dipush ke branch `origin main`.
   - **Perintah Deploy VPS (Eksekusi Wajib):**
     ```bash
     cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
     ```

### Q. Pembaruan: Penerapan Full Lazy Loading (Code Splitting via React.lazy() & Native Image Lazy Load)
1. **Penerapan Route & Component Code-Splitting (`React.lazy` + `Suspense` di `src/App.jsx`)**:
   - Seluruh 12 halaman utama (`HomeView`, `ShopView`, `ProductDetailView`, `CheckoutView`, `OrderSuccessView`, `UserDashboardView`, `AdminDashboardView`, `PublicInvoiceView`, `StoryGeneratorView`, `LicensesView`, `AboutView`, `DownloadAppView`) kini diimpor secara dinamis menggunakan `React.lazy()` dengan fallback `<Suspense>` bertema Dyari (`ViewLoadingFallback`).
   - Ukuran bundle utama frontend berhasil dipangkas lebih dari 60% dari **~790 KB menjadi hanya 311 KB** (gzip 86 KB).
   - Halaman besar seperti `AdminDashboardView` (285 KB) kini diisolasi sepenuhnya dan hanya dimuat jika admin mengakses panel admin, sehingga pengunjung biasa mendapatkan waktu muat awal yang sangat instan.
2. **Penerapan Native Image Lazy Loading (`loading="lazy"` & `decoding="async"`)**:
   - Menambahkan atribut bawaan browser `loading="lazy"` dan `decoding="async"` pada seluruh elemen `<img />` di komponen dan halaman:
     - [`src/components/ProductCard.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/components/ProductCard.jsx)
     - [`src/components/CartDrawer.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/components/CartDrawer.jsx)
     - [`src/components/InstantCheckoutModal.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/components/InstantCheckoutModal.jsx) (preview produk & QRIS barcode)
     - [`src/views/HomeView.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/views/HomeView.jsx) (kartu hero, mega bundle, dan avatar testimoni)
     - [`src/views/ProductDetailView.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/views/ProductDetailView.jsx) (gambar utama & thumbnail gallery)
     - [`src/views/PublicInvoiceView.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/views/PublicInvoiceView.jsx) (barcode QRIS)
     - [`src/views/UserDashboardView.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/views/UserDashboardView.jsx) (avatar profil dan produk member)
3. **Status Build & Deploy VPS**:
   - Kompilasi Vite lulus bersih 100% tanpa chunk size warnings (`npm run build` sukses dalam 4.64s).
   - Perubahan telah dicommit dan dipush ke branch `origin main`.
   - **Perintah Deploy VPS (Eksekusi Wajib):**
     ```bash
     cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
     ```

### R. Pembaruan: Perbaikan Pengurangan Stok Produk Shop saat Checkout & Pembayaran Sukses (Sinkronisasi Backend & Frontend Berbasis Qty)
1. **Akar Masalah Stok Tidak Berkurang saat Checkout / Pembayaran Sukses**:
   - **Salah Klasifikasi Sebagai Alat Lisensi (`isLicenseTool`)**: Di `server/routes/orders.js`, terdapat kondisi `product.category_id === 'tools-ai'` yang menyebabkan produk shop AI (Gemini Pro, ChatGPT, Capcut, dll.) dianggap sebagai alat lisensi. Akibatnya, backend menerbitkan kode lisensi dan sengaja melewatkan (*skip*) proses pemotongan stok akun/stok numerik produk shop.
   - **Resolusi `product_id` Gagal / Bernilai NULL di Database**: Saat pembuatan pesanan, item pesanan hanya membawa slug string atau `it.id`, sehingga query pencarian produk pada tabel `products` tidak menemukan ID numerik produk dan membiarkan `order_items.product_id` bernilai NULL.
   - **Frontend Hanya Memotong 1 Akun Terlepas dari Jumlah Pembelian (`qty`)**: Logika fulfillment sebelumnya hanya menggunakan `findIndex` satu kali sehingga pembeli yang membeli 2 atau lebih unit hanya memotong 1 akun.
   - **Stale Cache `localStorage` Menimpa Data Database**: Pada `fetchBackendProducts()`, pengecekan stok lokal sempat memprioritaskan data `localStorage` lama yang belum terpotong di atas data database PostgreSQL.
   - **Array `accountStock` Kosong Menghapus Nilai Stok Numerik**: Pemeriksaan `Array.isArray(product.accountStock)` yang bernilai `true` untuk array kosong `[]` menyebabkan fungsi `getProductAvailableStock` mengembalikan 0 dan mengabaikan `stockCount`.

2. **Solusi Komprehensif yang Diterapkan**:
   - **Backend PostgreSQL (`server/routes/orders.js`)**:
     - Memperbaiki resolusi `product_id` pada `POST /api/orders` dengan memeriksa `it.product_id || it.dbId || it.id`, mencari ke tabel `products` berdasarkan ID integer, slug, maupun nama produk secara akurat.
     - Pada `PUT /api/orders/:id/status` saat pesanan disetujui (`LUNAS`):
       - Mengisolasi `isLicenseTool` khusus untuk produk yang murni bertipe `LICENSE_TOOL` atau memiliki flag `license_required` khusus Story Generator.
       - Untuk produk shop (`APPS_PREMIUM` dan produk finite stock): backend mengambil hingga sejumlah `orderQty` akun yang belum terjual (`!s.isSold`), menandainya sebagai terjual (`isSold: true`, `soldTo`, `soldToEmail`, `soldAt`), dan menetapkannya ke `order_items.assigned_account`.
       - Jika baris akun kosong, backend langsung memotong stok numerik `stock_count = Math.max(0, currentStock - orderQty)`.
       - Memperbarui status stok (`TERSEDIA` vs `HABIS`), menambah counter `sales_count`, dan memanggil `clearProductsCache()` agar stok langsung ter-refresh seketika di seluruh platform.
   - **Frontend React Context (`src/context/StoreContext.jsx`)**:
     - Memperbaiki `getProductAvailableStock()`: hanya memeriksa baris akun jika array memiliki panjang lebih dari 0 (`accountStock.length > 0`), dan melakukan fallback yang benar ke `stockCount`.
     - Memperbarui `fetchBackendProducts()` sebagai `useCallback` yang menjadikan PostgreSQL sebagai satu-satunya sumber kebenaran (*single source of truth*), mengekspornya ke context provider sebagai `fetchBackendProducts` dan `refreshProducts`.
     - Memperbarui `fulfillOrderCredentials()` dan `completeOrder()` agar memproses pemotongan stok akun dan stok numerik secara presisi sesuai jumlah pembelian `orderQty` / `requiredQty`, serta menyinkronkannya ke backend dengan `syncStockToBackend(productId, stockList, remainingCount)`.
     - Menyinkronkan pesanan checkout biasa (`completeOrder` & `createPendingOrder`) ke backend PostgreSQL via `POST /api/orders`.
     - Pada `updateOrderStatus()`: menunggu respons backend `PUT /api/orders/:id/status` dan langsung memanggil `await fetchBackendProducts()`.
   - **Modal Checkout Instan (`src/components/InstantCheckoutModal.jsx`)**:
     - Saat polling mendeteksi pesanan telah `LUNAS` (atau saat tombol cek manual diklik), sistem secara otomatis memicu `fetchBackendProducts()` sehingga kartu produk di latar belakang seketika menampilkan sisa stok yang telah berkurang.

3. **Status Build & Deploy VPS**:
   - Kompilasi Vite lulus bersih 100%: `npm run build` sukses.
   - Seluruh sintaks Node.js server terverifikasi valid (`node -c`).
   - Perubahan telah dicommit dan dipush ke branch `origin main`.
   - **Perintah Deploy VPS (Eksekusi Wajib):**
     ```bash
     cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
     ```

### S. Pembaruan v0.0.9 Desktop: Kompilasi Binary WPF ke v0.0.9, Rilis Resmi GitHub v0.0.9, & Penyelarasan Ekosistem (Fix 404 Auto-Updater)
1. **Latar Belakang & Akar Masalah**:
   - Backend web `dyariapp.my.id` mengumumkan versi sistem resmi **v0.0.9**.
   - Namun, file executable desktop `Story.in-AI-Manager.exe` yang terdistribusi dan ada di GitHub Releases sebelumnya baru mencapai versi `v0.0.6`.
   - Ketika pengguna membuka aplikasi desktop dan menekan tombol *Update Otomatis*, aplikasi mencoba mengunduh `https://github.com/studioentaf-bit/dyariinapp/releases/download/v0.0.9/Story.in-AI-Manager.exe` yang menghasilkan error **404 (Not Found)** karena file release `v0.0.9` belum pernah diunggah ke GitHub.
2. **Tindakan Penyelesaian Komprehensif**:
   - **Pembaruan Kode Sumber Desktop WPF (`story-in-manager-wpf`)**:
     - `AIPilotManager.csproj`: Menaikkan versi target ke `<Version>0.0.9</Version>`, `<AssemblyVersion>0.0.9.0</AssemblyVersion>`, dan `<FileVersion>0.0.9.0</FileVersion>`.
     - `MainWindow.xaml.cs`: Memperbarui konstanta `public const string CurrentAppVersion = "0.0.9";`.
     - `MainWindow.xaml`: Memperbarui badge header versi menjadi `Text="v0.0.9"`.
   - **Kompilasi Ulang Binary Portable (.NET 8 SDK)**:
     - Melakukan build single-file self-contained x64 menggunakan `C:\Users\studi\.dotnet\dotnet.exe publish` dengan output executable `Story.in-AI-Manager.exe` (163 MB).
     - Menyalin file binary baru ke direktori siap pakai:
       - `c:\Users\studi\Downloads\metafori\Story.in-AI-Manager.exe`
       - `c:\Users\studi\Downloads\metafori\Story-in-AI-Manager\Story.in-AI-Manager.exe`
   - **Penerbitan Resmi GitHub Release v0.0.9**:
     - Menerbitkan release tag publik `v0.0.9` di [GitHub Release v0.0.9](https://github.com/studioentaf-bit/dyariinapp/releases/tag/v0.0.9).
     - Mengunggah file aset binary standalone `Story.in-AI-Manager.exe` langsung ke release tag tersebut.
     - Endpoint unduhan `https://github.com/studioentaf-bit/dyariinapp/releases/download/v0.0.9/Story.in-AI-Manager.exe` kini terverifikasi aktif (HTTP 302 Found) dan siap diunduh otomatis tanpa error 404.

### T. Pembaruan: Transformasi UI Cybernetic Dark Obsidian, Unifikasi Lisensi 100% Semua Fitur, Logo Baru, & Penyederhanaan Dashboard
1. **Unifikasi Sistem Lisensi Tunggal (1 Lisensi = Akses Penuh Semua Menu & Fitur)**:
   - Menghapus konsep tiering berjenjang ("Pro All Fitur", "Pro Platform", "Basic/Free limitasi").
   - Memperbaiki logika evaluasi lisensi di [`story-in-manager-wpf/MainWindow.xaml.cs`](file:///c:/Users/studi/Downloads/metafori/story-in-manager-wpf/MainWindow.xaml.cs) dan [`Views/ProductivityView.xaml.cs`](file:///c:/Users/studi/Downloads/metafori/story-in-manager-wpf/Views/ProductivityView.xaml.cs):
     - `CanUseTool()` langsung memberikan izin penuh (`allowed = true`) tanpa membatasi tool apapun jika lisensi berstatus valid. Menghapus pesan popup pembatasan seperti *"Fitur TikTok Downloader khusus untuk paket Pro All Fitur"*.
     - `CanAddAccount()` dan `CanAddCustomPlatform()` memberikan akses tanpa batas jumlah akun kepada seluruh pemilik lisensi resmi.
     - `IsProAllUser()`, `IsProPlatformUser()`, `IsProductivityUser()`, dan `IsPrimaryPlatform()` diselaraskan untuk mengembalikan status lisensi aktif.
   - Status badge header dan kartu status lisensi kini menampilkan indikator tunggal: `SEMUA FITUR AKTIF` (saat aktif) dan `BELUM AKTIF` (saat belum aktivasi).
   - Dialog lisensi ([`Dialogs/LicenseDialog.xaml`](file:///c:/Users/studi/Downloads/metafori/story-in-manager-wpf/Dialogs/LicenseDialog.xaml) & [`.cs`](file:///c:/Users/studi/Downloads/metafori/story-in-manager-wpf/Dialogs/LicenseDialog.xaml.cs)) didesain ulang menjadi modern dark slate, menampilkan Hardware ID (HWID), input email & kode lisensi, serta penegasan bahwa 1 lisensi resmi membuka 100% seluruh fitur aplikasi.

2. **Penggantian Logo Aplikasi & Executable (`.exe`)**:
   - Memproses asset gambar logo cybernetic teal/emerald dari pengguna menjadi:
     - `Assets/app_logo.png` (High-resolution 1024x1024 PNG) untuk logo di sidebar, header, dialog lisensi, dan kartu beranda.
     - `Assets/icon.ico` (Multi-resolution Windows Icon: 256x256, 128x128, 64x64, 48x48, 32x32, 16x16) sebagai icon resmi window dan file executable Windows.
   - Icon dan logo terpasang langsung pada `AIPilotManager.csproj` sebagai `<ApplicationIcon>Assets\icon.ico</ApplicationIcon>`.

3. **Penyederhanaan Dashboard (Minimalis & Elegan)**:
   - Mengatasi tampilan dashboard yang sebelumnya dinilai terlalu ramai dan membingungkan:
     - Menghapus 16 tombol sub-step mini (`S1`, `S2`, `S3`, `S4`) pada kartu tutorial beranda yang sebelumnya memadati layar.
     - Menggantinya dengan 4 kartu tutorial yang bersih dan elegan dengan tombol aksi jelas `Tonton Tutorial ➔`, tetap mempertahankan seluruh integrasi video walkthrough (`PlayTutorialStep1_Click` hingga `4`).
     - Menyederhanakan Hero Banner dengan gradasi obsidian halus dan lencana Story.in AI Manager yang proporsional.
     - Menyusun Prompt Bar dengan input kontras gelap yang nyaman di mata dan pill filter kategori yang bersih.

4. **Modernisasi UI Seluruh Menu (Dark Obsidian Slate & Emerald)**:
   - Mengganti tampilan latar belakang putih polos di seluruh halaman:
     - Beranda / Dashboard: Seluruh kartu Platform AI, Tools Kreator, Panduan Tutorial, Quick Access, dan Status Akun kini berbalut dark card obsidian `#131f33` dengan border `#1e324f` dan aksen emerald `#10b981`.
     - Platform Accounts View: Grid & List kartu akun multi-platform kini berlatar belakang dark slate dengan border status tab aktif hijau emerald dan efek hover interaktif.
     - Tools Kreator (TikTok Downloader, Split Video, Merge Video): Area kerja gelap terpadu dengan kontras teks tajam `#f8fafc`.
     - Katalog Shop Produk: Kartu produk shop berdesain kartu obsidian modern dengan lencana stok, harga jelas, deskripsi expandable, dan tombol checkout terintegrasi.
     - Modal Dialog Lisensi: UI bertema dark obsidian berbingkai neon emerald.

5. **Kompilasi Binary & Rilis GitHub v0.0.9**:
   - Berhasil mengompilasi binary Release standalone x64 melalui `.NET 8 SDK` tanpa error.
   - Executable `Story.in-AI-Manager.exe` (165 MB) disalin ke:
     - `c:\Users\studi\Downloads\metafori\Story.in-AI-Manager.exe`
     - `c:\Users\studi\Downloads\metafori\Story-in-AI-Manager\Story.in-AI-Manager.exe`
   - Mengunggah file executable terkompilasi ke GitHub Release tag `v0.0.9` di repository `studioentaf-bit/dyariinapp`.

### U. Pembaruan v0.0.10: Elevasi Versi Resmi Menjadi v0.0.10 di Seluruh Ekosistem (WPF Desktop, Web Frontend, Backend API, & GitHub Release)
1. **Latar Belakang & Sinkronisasi Versi**:
   - Versi `v0.0.9` adalah rilis sebelumnya yang berfokus pada sinkronisasi pemotongan stok otomatis dan fulfillment akun digital.
   - Perubahan besar pada rilis terkini (unifikasi 1 lisensi resmi 100% semua fitur, logo cybernetic teal/emerald baru, dashboard diringkas minimalis, dan modernisasi UI dark obsidian/emerald) dinaikkan secara resmi ke **`v0.0.10`** di seluruh ekosistem.
2. **Pembaruan Kode Sumber Desktop WPF (`story-in-manager-wpf`)**:
   - [`AIPilotManager.csproj`](file:///c:/Users/studi/Downloads/metafori/story-in-manager-wpf/AIPilotManager.csproj): `<Version>0.0.10</Version>`, `<AssemblyVersion>0.0.10.0</AssemblyVersion>`, `<FileVersion>0.0.10.0</FileVersion>`.
   - [`MainWindow.xaml.cs`](file:///c:/Users/studi/Downloads/metafori/story-in-manager-wpf/MainWindow.xaml.cs): Konstanta `public const string CurrentAppVersion = "0.0.10";`.
   - [`MainWindow.xaml`](file:///c:/Users/studi/Downloads/metafori/story-in-manager-wpf/MainWindow.xaml): Header badge versi `AppVersionHeaderBadge` bernilai `Text="v0.0.10"`.
3. **Pembaruan Web Frontend & Backend API (`DYARIKU`)**:
   - [`server/index.js`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/server/index.js):
     - `const MIN_OFFICIAL_VERSION = '0.0.10';`
     - Endpoint `/api/app-version` dan `/api/app/version` menyajikan tag `v0.0.10`, download URL resmi, changelog v0.0.10, dan redirect `/api/app/download` ke binary `v0.0.10`.
   - [`src/context/StoreContext.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/context/StoreContext.jsx):
     - Default `appVersionInfo`: `version: '0.0.10'`, `downloadUrl` menuju release `v0.0.10`, `releaseUrl` tag `v0.0.10`, dan changelog pembaruan terkini.
     - Penanganan outdated version array kini mendeteksi versi `0.0.1` hingga `0.0.9` dan mengarahkan otomatis ke `0.0.10`.
   - [`src/views/DownloadAppView.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/views/DownloadAppView.jsx): Default fallback `0.0.10` dan penyelarasan URL rilis.
   - [`src/views/HomeView.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/views/HomeView.jsx): Tombol *"Download App"* di navbar kini menampilkan `v0.0.10`.
4. **Kompilasi Binary Standalone & Penerbitan Rilis GitHub (`v0.0.10`)**:
   - Berhasil mengompilasi binary Release single-file x64 `Story.in-AI-Manager.exe` (.NET 8 SDK).
   - Menyalin binary ke folder kerja lokal:
     - `c:\Users\studi\Downloads\metafori\Story.in-AI-Manager.exe`
     - `c:\Users\studi\Downloads\metafori\Story-in-AI-Manager\Story.in-AI-Manager.exe`
   - Berhasil menerbitkan tag rilis publik baru [GitHub Release v0.0.10](https://github.com/studioentaf-bit/dyariinapp/releases/tag/v0.0.10) dengan lampiran asset executable `Story.in-AI-Manager.exe` (165 MB).
5. **Instruksi Deploy VPS (Wajib Dijalankan pada Server)**:
   ```bash
   cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
   ```

### V. Pembaruan v0.0.11: Logo Robot Maskot Hijau 3D, Tema Terang Soft Variatif, Redesain Total Dashboard Identik Image 2, & Elevasi Versi Resmi v0.0.11
1. **Generasi Logo & Executable Icon Baru**:
   - Sumber logo: Gambar maskot robot hijau 3D futuristik berwajah ramah dan berkacamata neon.
   - Diekspor ke aset aplikasi:
     - High-resolution PNG (1024x1024, 1.06 MB): [`story-in-manager-wpf/Assets/app_logo.png`](file:///c:/Users/studi/Downloads/metafori/story-in-manager-wpf/Assets/app_logo.png) dan [`Story-in-AI-Manager/Assets/app_logo.png`](file:///c:/Users/studi/Downloads/metafori/Story-in-AI-Manager/Assets/app_logo.png).
     - Multi-resolution Windows Icon (182 KB, frame 256x256, 128x128, 64x64, 48x48, 32x32, 16x16): [`story-in-manager-wpf/Assets/icon.ico`](file:///c:/Users/studi/Downloads/metafori/story-in-manager-wpf/Assets/icon.ico) dan [`Story-in-AI-Manager/Assets/icon.ico`](file:///c:/Users/studi/Downloads/metafori/Story-in-AI-Manager/Assets/icon.ico).
   - Seluruh executable `.exe`, window icon, dan top/sidebar avatar kini otomatis menggunakan icon robot hijau 3D tersebut.

2. **Pembaruan Palet Warna Global: Soft Light & Variatif**:
   - [`App.xaml`](file:///c:/Users/studi/Downloads/metafori/story-in-manager-wpf/App.xaml): Mengubah seluruh palet warna dari dominasi dark menjadi terang soft (*soft light*):
     - Background App: `#f8fafc`, Sidebar & Card: `#ffffff`, Border: `#e2e8f0` / `#cbd5e1`.
     - Teks Utama: `#0f172a`, Teks Sekunder: `#475569`, Teks Muted: `#94a3b8`.
     - Aksen variatif cerah: Blue (`#3b82f6`), Indigo (`#6366f1`), Purple (`#a855f7`), Pink (`#ec4899`), Emerald (`#10b981`), serta soft color badge pills (`#eff6ff`, `#f5f3ff`, `#fdf2f8`, `#ecfdf5`).

3. **Redesain Total Dashboard Identik Image 2 (Semua Tombol Shortcut Tool di Dashboard Ditiadakan)**:
   - Sesuai instruksi user, seluruh tombol menu dan kartu shortcut platform yang sebelumnya memenuhi dashboard dihilangkan dari tengah layar (navigasi tool terpusat rapi hanya pada menu sidebar).
   - Konten dashboard dirombak 100% mengikuti referensi visual:
     - **Hero Banner**: Maskot robot 3D di squircle + ucapan *"Selamat datang kembali"* + *"Workspace kreatif Anda siap digunakan"* + kaligrafi halus *"Buat Konten Lebih Mudah & Produktif"*.
     - **Status Akun Panel**: Terletak di kanan atas sejajar Hero Banner (Google Flow, Dola AI, ChatGPT dengan badge hijau `● Online` dan header `✓ Semua Terhubung`).
     - **4 Stat Metric Cards**: Total Platform (`4`, blue), Total Akun (`3`, purple), Generasi Hari Ini (`12`, pink), Berhasil Diproses (`96%`, emerald).
     - **Bagian Tengah 2 Kolom**:
       - *Aktivitas Generasi*: Grafik kurva garis smooth 7 hari (6 Des - 12 Des 2026) dengan gradient area fill dan titik interaktif.
       - *Riwayat Terbaru*: Tabel transaksi & aktivitas eksekusi 6 baris lengkap dengan badge status `✓ Selesai` dan `⏳ Diproses`.
     - **Bagian Bawah: Tutorial & Panduan**: 3 kartu video preview bersih (*"Mulai Menggunakan Story.in"*, *"Mengelola Akun AI"*, *"Membuat Konten Pertama"*).
     - **Integritas C#**: Seluruh named element C# lama dipertahankan di container hidden `Visibility="Collapsed"` sehingga kompilasi bersih (zero CS0103 error).

4. **Elevasi Versi Resmi Menjadi v0.0.11 di Seluruh Ekosistem**:
   - [`AIPilotManager.csproj`](file:///c:/Users/studi/Downloads/metafori/story-in-manager-wpf/AIPilotManager.csproj): `<Version>0.0.11</Version>`, `<AssemblyVersion>0.0.11.0</AssemblyVersion>`, `<FileVersion>0.0.11.0</FileVersion>`.
   - [`MainWindow.xaml.cs`](file:///c:/Users/studi/Downloads/metafori/story-in-manager-wpf/MainWindow.xaml.cs): `public const string CurrentAppVersion = "0.0.11";`.
   - [`MainWindow.xaml`](file:///c:/Users/studi/Downloads/metafori/story-in-manager-wpf/MainWindow.xaml): Header badge versi `AppVersionHeaderBadge` bernilai `Text="v0.0.11"`.
   - [`server/index.js`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/server/index.js): `const MIN_OFFICIAL_VERSION = '0.0.11';` dan endpoint download URL `v0.0.11`.
   - [`src/context/StoreContext.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/context/StoreContext.jsx), [`src/views/DownloadAppView.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/views/DownloadAppView.jsx), [`src/views/HomeView.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/views/HomeView.jsx): Penyelarasan versi resmi `0.0.11` dan fallback.
   - Kompilasi ulang `dotnet publish -c Release -r win-x64 --self-contained true` menghasilkan binary `Story.in-AI-Manager.exe` (165 MB, FileVersion `0.0.11.0`).
   - Menyalin binary baru ke kedua lokasi lokal:
     - `c:\Users\studi\Downloads\metafori\Story.in-AI-Manager.exe`
     - `c:\Users\studi\Downloads\metafori\Story-in-AI-Manager\Story.in-AI-Manager.exe`
   - Berhasil mempublikasikan rilis resmi publik baru [GitHub Release v0.0.11](https://github.com/studioentaf-bit/dyariinapp/releases/tag/v0.0.11) dengan lampiran executable `Story.in-AI-Manager.exe`.

5. **Instruksi Deploy VPS (Wajib Dijalankan pada Server)**:
   ```bash
   cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
   ```

### W. Pembaruan v0.0.12: Logo Baru 3D Orbit Window, Redesain Dashboard Persis Gambar 1, Penghapusan Fitur Banner di Admin & Dashboard, dan Elevasi Versi Resmi v0.0.12
1. **Generasi Logo & Executable Icon Baru (Gambar 2)**:
   - Sumber logo: Gambar 3D App Window futuristik dengan robot orbit, bintang sparkle, dan teks branding "Story.In AI Manager".
   - Diekspor ke:
     - High-res PNG (1024×1024): [`story-in-manager-wpf/Assets/app_logo.png`](file:///c:/Users/studi/Downloads/metafori/story-in-manager-wpf/Assets/app_logo.png) dan [`Story-in-AI-Manager/Assets/app_logo.png`](file:///c:/Users/studi/Downloads/metafori/Story-in-AI-Manager/Assets/app_logo.png).
     - Multi-resolution Windows Icon (`.ico` layer 256, 128, 64, 48, 32, 16): [`story-in-manager-wpf/Assets/icon.ico`](file:///c:/Users/studi/Downloads/metafori/story-in-manager-wpf/Assets/icon.ico) dan [`Story-in-AI-Manager/Assets/icon.ico`](file:///c:/Users/studi/Downloads/metafori/Story-in-AI-Manager/Assets/icon.ico).
   - Seluruh executable `.exe` dan window taskbar/titlebar kini menggunakan icon resmi 3D orbit window ini.

2. **Penghapusan Fitur Banner (Sesuai Permintaan User)**:
   - Menghapus form dan alat crop banner dashboard aplikasi desktop di panel branding admin toko web ([`src/views/AdminDashboardView.jsx`](file:///c:/Users/studi/Downloads/metafori/DYARIKU/src/views/AdminDashboardView.jsx)).
   - Menghilangkan dynamic uploaded hero banner dari dashboard aplikasi desktop, menggantikannya dengan hero visual bawaan yang rapi dan elegan.

3. **Redesain Total UI Dashboard & Sidebar Persis Gambar 1**:
   - **Header Topbar**:
     - Badge lisensi pill hijau cerah `#10b981` berlabel `🛡️ SEMUA FITUR AKTIF` (teks putih tebal).
     - Tag versi resmi `🏷️ v0.0.12`.
     - Search input dengan pill shortcut `Ctrl + K`.
   - **Sidebar**:
     - Brand subtitle: `AI Account Manager`.
     - Menu `Beranda` aktif menggunakan pill gradient biru cerah (`#2563eb` ke `#3b82f6`) dengan teks dan icon putih.
     - Kartu bawah sidebar: Border soft blue dengan icon cube/window dan teks *"Kelola Puluhan Akun AI Dalam Satu Workspace Rapi"*.
   - **Dashboard 2 Kolom**:
     - **Kolom Kiri**:
       - *Hero Card*: Latar cyan/blue soft (`#f0f9ff` ke `#dbeafe`), ucapan *"Selamat Datang di Story.In"*, deskripsi workspace rapi, dan ilustrasi 3D browser windows bertumpuk dengan icon ChatGPT, Dola, dan Flow.
       - *4 Stat Metric Cards*: Total Platform (`3`, blue), Total Akun (`0`, green), Generasi Hari Ini (`12`, purple), Berhasil Diproses (`96%`, orange).
       - *Tutorial Card*: *"Mulai Menggunakan Story.In Dalam 3 Langkah Mudah"* dengan tombol pill biru `▶ Lihat Tutorial ➔` dan ilustrasi laptop 3D checklist steps (Tambah Akun, Login & Isolasi, Mulai Beraktivitas).
       - *Aktivitas Terbaru*: Tabel rapi 5 baris eksekusi lengkap dengan badge status `● Selesai` dan `● Diproses`.
       - *Bottom Status Bar*: `● Sistem Berjalan Normal` di kiri dan `Story.In · AI Account Manager` di kanan.
     - **Kolom Kanan**:
       - *Status Akun Panel*: Google Flow, Dola AI, ChatGPT dengan status `● Online` dan badge `✦ Semua Terhubung`.
       - *Quick Actions Panel*: 4 tombol aksi bergradien soft (Tambah Akun Baru, Buat Story Prompt, Kelola Platform, Buka Semua Akun).
       - *Bottom Promo Productivity Card*: Icon roket dengan slogan *"Produktivitas AI Dimulai dari Sini"*.

4. **Elevasi Versi Resmi ke v0.0.12 di Seluruh Ekosistem**:
   - `AIPilotManager.csproj`: Version & AssemblyVersion `0.0.12`.
   - `MainWindow.xaml` & `MainWindow.xaml.cs`: Konstanta versi `0.0.12`.
   - `DYARIKU/server/index.js`: `MIN_OFFICIAL_VERSION = '0.0.12'`.
   - `DYARIKU/src/context/StoreContext.jsx`, `DownloadAppView.jsx`, `HomeView.jsx`: Versi default & fallback `0.0.12`.
   - Kompilasi single-file executable `Story.in-AI-Manager.exe` (164.9 MB) dan update ke folder kerja lokal.
   - Publikasi [GitHub Release v0.0.12](https://github.com/studioentaf-bit/dyariinapp/releases/tag/v0.0.12) dengan lampiran asset executable.

5. **Instruksi Deploy VPS (Wajib Dijalankan pada Server)**:
   ```bash
   cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
   ```

### Y. Pembaruan v0.0.14: Eliminasi Efek Blur, Integrasi 100% Data Riil, Scaling Dinamis Kartu Tutorial, Anti-Tabrakan Drawer, & Elevasi Versi v0.0.14
1. **Pemberantasan Teks Blur & Optimalisasi Engine DirectX WPF**:
   - Menghapus efek `DropShadowEffect` dari seluruh border container di MainWindow. Efek ini terbukti memaksa WPF me-rasterize teks dengan grayscale blur pada resolusi 96 DPI. Digantikan dengan border solid berpresisi tinggi (`#e2e8f0` dan `#bfdbfe`).
   - Menerapkan atribut render visual kristal pada root window: `UseLayoutRounding="True" SnapsToDevicePixels="True" TextOptions.TextFormattingMode="Display" TextOptions.TextRenderingMode="ClearType" RenderOptions.BitmapScalingMode="HighQuality" RenderOptions.ClearTypeHint="Enabled"`.
2. **Pembersihan Data Dummy & Integrasi 100% Data Riil**:
   - Menghapus 5 baris riwayat dummy (ChatGPT 14:32, dsb.) di XAML.
   - Implementasi `UpdateDashboardRealData()` yang membaca langsung data persisten dari `_storyHistory` (`data/story_history.json`).
   - Merender **Empty State Card** yang bersih & elegan jika pengguna baru belum memiliki riwayat generasi.
   - Metrik Generasi Hari Ini = `0` (atau riil), Berhasil Diproses = `0%` (atau riil), Total Akun = `_accounts.Count`, Total Platform = `_platforms.Count`.
3. **Scaling Dinamis Kartu Tutorial**:
   - Menyatukan teks judul tutorial ke dalam 1 TextBlock ber-`TextWrapping="Wrap"` dengan `MinHeight="145"`.
   - Menggunakan `<Viewbox MaxWidth="140" MaxHeight="115" Stretch="Uniform">` untuk ilustrasi laptop 3D agar proporsional mengecil saat layar sempit tanpa memotong teks di kiri.
4. **Perbaikan Tabrakan Tampilan saat Story Generator Drawer Dibuka**:
   - Header Aktivitas Terbaru menggunakan Grid 2 kolom eksplisit (`Width="*"` dan `Width="Auto"`) dengan `CharacterEllipsis` mencegah tabrakan judul dan tombol "Lihat Semua".
   - Responsivitas dinamis `UpdateDashboardLayout()`: Baris bawah beralih vertikal 100% saat drawer terbuka atau lebar jendela < 960px; 4 Stat Cards beralih ke formasi grid 2x2; tab vertikal pinned disembunyikan otomatis saat drawer terbuka.
   - Menambahkan tombol maximize drawer `ExpandStoryGenBtn` (`⛶ Lebar` / `❐ Normal`).
5. **Elevasi Versi Resmi ke v0.0.14 di Seluruh Ekosistem**:
   - `AIPilotManager.csproj`: `<Version>0.0.14</Version>`, `<AssemblyVersion>0.0.14.0</AssemblyVersion>`, `<FileVersion>0.0.14.0</FileVersion>`.
   - `MainWindow.xaml.cs`: `CurrentAppVersion = "0.0.14"`.
   - `MainWindow.xaml`: `AppVersionHeaderBadge` bernilai `v0.0.14`.
   - `server/index.js`: `MIN_OFFICIAL_VERSION = '0.0.14'`.
   - `src/context/StoreContext.jsx`, `DownloadAppView.jsx`, `HomeView.jsx`: Versi resmi `0.0.14`.
   - Kompilasi single-file standalone `Story.in-AI-Manager.exe` (165.2 MB) dan disinkronisasi ke folder kerja.
   - Build Vite web produksi di `DYARIKU/dist/` berhasil diperbarui.
   - Berhasil mempublikasikan [GitHub Release v0.0.14](https://github.com/studioentaf-bit/dyariinapp/releases/tag/v0.0.14).
6. **Instruksi Deploy VPS (Wajib Dijalankan pada Server)**:
   ```bash
   cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
   ```

### Z. Pembaruan v0.0.15: Perubahan Total Konsep Visual Menjadi Tema Soft Pastel 3D, Topbar Modern, Hero Awan & Ikon Melayang, Serta Baris Paket Lisensi
1. **Pembaruan Logo Origami 3D & Topbar Modern**:
   - Mengekstrak dan menghasilkan aset logo Origami 3D Play segitiga (`Assets/app_logo_icon.png`, `Assets/app_logo.png`, `Assets/icon.ico`).
   - Topbar baru: Tombol hamburger bulat (`≡`), logo origami 3D dan subtitle branding, search bar berbentuk kapsul rounded penuh (*Cari fitur, template, atau tekan Ctrl+K...*), tag versi `🏷️ v0.0.15`, lonceng notifikasi bulat dengan counter `1`, serta profil avatar bulat (*Selamat Datang User Story.In*).
2. **Sidebar Baru Konsisten Soft Pastel**:
   - Tombol *Beranda* bergradien kapsul indigo-purple lembut (`#6366f1` -> `#7080f0` -> `#818cf8`) dengan icon rumah putih.
   - Platform AI (Google Flow, Dola AI, ChatGPT) default terbuka dengan sub link *+ Tambah Akun*.
   - Platform Custom berlatar soft sky blue *+ Tambah Platform Baru*.
   - Tools Kreator (TikTok Downloader, Split Video Editor, Merge Video).
3. **Dashboard 100% Full-Width & Section Baru**:
   - Hero Banner Card: Latar pastel sky blue dengan ilustrasi awan 3D dan ikon-ikon kubus melayang (`Assets/hero_3d_clouds.png`), ucapan selamat datang, deskripsi workspace, dan 4 tombol pill platform.
   - 4 Stat Cards: Total Platform (3), Total Akun (0), Generasi Hari Ini (0), Berhasil Diproses (0%), lengkap dengan tombol panah bulat `›` di pojok kanan atas.
   - Baris Tengah: Kartu Tutorial dengan ilustrasi 3D checklist monitor (`Assets/tutorial_3d_device.png`) dan Kartu Aktivitas Terbaru dengan empty state kaca pembesar `🔍` serta ilustrasi 3D clipboard (`Assets/activity_3d_clipboard.png`).
   - Baris Paket Lisensi (Pricing Section): 4 kolom paket (Basic, Pro, Premium [★ Paling Populer], Enterprise) dan kado hadiah 3D berpita emas (`Assets/license_3d_gift.png`).
4. **Peningkatan Versi Resmi Ekosistem ke v0.0.15**:
   - WPF C# Version & AssemblyVersion `0.0.15` (164.5 MB).
   - Express backend `MIN_OFFICIAL_VERSION = '0.0.15'`.
   - React frontend (`StoreContext`, `DownloadAppView`, `HomeView`) versi `0.0.15`.
   - Build Vite web diperbarui di `dist/`.
   - GitHub Release live di [v0.0.15](https://github.com/studioentaf-bit/dyariinapp/releases/tag/v0.0.15).
5. **Instruksi Deploy VPS (Wajib Dijalankan pada Server)**:
   ```bash
   cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
   ```

### AA. Pembaruan v0.0.17: Transformasi Total UI Menjadi 3D Playful Pastel Bento UI — Soft Claymorphism & Neumorphism, Retensi Menu Lengkap, & Elevasi Versi v0.0.17
1. **Konsep Visual 3D Playful Pastel Bento UI — Soft Claymorphism & Neumorphism**:
   - **Estetika & Palet Warna**:
     - Background aplikasi diperlembut menjadi marshmallow pastel lavender-tinted cloud (`#f5f7fc`).
     - Kartu container mengadopsi gaya *Puffy Bento* dengan sudut melengkung tebal (`CornerRadius="22"` hingga `"24"`), border clay berdimensi (`BorderThickness="1.8"` hingga `"2.5"`), serta aksen warna pastel ceria:
       - Sky Blue Clay (`#f0f7ff`, border `#bfdbfe`)
       - Mint Fresh (`#f0fdf4`, border `#bbf7d0`)
       - Lilac Lavender (`#faf5ff`, border `#ddd6fe`)
       - Tangerine Butter (`#fff7ed`, border `#fed7aa`)
       - Blush Rose (`#fff5f5`, border `#fecdd3`)
   - **Topbar Neumorphic & Clay**:
     - Search bar berdesain pill puffy rounded (`CornerRadius="18"`, border `#cbd5e1`).
     - Badge versi bertransformasi menjadi puffy clay pill lilac (`#eef2ff`, border `#c7d2fe`).
   - **Hero Banner Bento Deck**:
     - Gradasi lembut langit pastel (`#f0f5ff` ke `#e0edfe` ke `#ede9fe`) dengan rounded corner `CornerRadius="24"` dan border clay 2px.
     - Pill chips platform berbentuk rounded pill dengan squircle icon container berdimensi 3D.
   - **4 Stat Metric Tiles**:
     - Menjadi puffy Bento boxes dengan squircle icon container pastel, tombol aksi panah bulat (`CornerRadius="14"`), dan badge subteks berona serasi.
   - **Tutorial & Aktivitas Bento Cards**:
     - Kartu Tutorial berbingkai Blush Rose (`#fecdd3`, latar `#fff5f5`) dan Aktivitas Terbaru berbingkai Sky Blue (`#bae6fd`, latar `#f0f9ff`) dengan tombol aksi pill puffy yang kontras dan tajam.
   - **Pricing Bento Deck (4 Subscription Tiles)**:
     - Basic (`#a7f3d0`), Pro (`#fed7aa`), Premium (`#f43f5e` dengan floating badge ★ Paling Populer), dan Enterprise (`#bfdbfe`).
     - Seluruh tombol 'Pilih Paket' berbentuk puffy rounded (`CornerRadius="16"`) bergradasi clay yang lembut.
   - **Sidebar Bento Navigation**:
     - Seluruh kartu accordion (Platform AI, Platform Custom, Tools Kreator, Setting) berdesain rounded `CornerRadius="16"` dengan squircle icon container dan badge counter bernuansa pastel.

2. **Integritas Fitur & Penanganan Bug Skala Teruji**:
   - Menu Shop Produk (badge LIVE), Tutorial (badge VIDEO), dan Setting (Kelola Lisensi, Cek Update, Tentang Aplikasi) serta Tagline bottom card tetap terpasang utuh dan aktif.
   - Anti-clipping dan adaptive 2x2 grid responsif saat Story Generator drawer dibuka dipertahankan tanpa gangguan layout.
   - Seluruh named element C# WPF terikat sempurna tanpa error kompilasi.

3. **Penyelarasan Versi Resmi v0.0.17 di Seluruh Ekosistem**:
   - WPF Desktop Project (`AIPilotManager.csproj` & `MainWindow.xaml.cs`): Versi dinaikkan ke `0.0.17` (Assembly & FileVersion `0.0.17.0`).
   - Express Backend (`server/index.js`): `MIN_OFFICIAL_VERSION = '0.0.17'`.
   - React Frontend (`StoreContext.jsx`, `DownloadAppView.jsx`, `HomeView.jsx`): Sinkronisasi versi `0.0.17` dan changelog rilis.
   - Build Vite web produksi di `DYARIKU/dist/` berhasil dikompilasi ulang.
   - Executable single-file standalone `Story.in-AI-Manager.exe` (164.5 MB) berhasil dipublikasikan ke [GitHub Release v0.0.17](https://github.com/studioentaf-bit/dyariinapp/releases/tag/v0.0.17).

4. **Instruksi Deploy VPS (Wajib Dijalankan pada Server)**:
   ```bash
   cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
   ```

### AB. Pembaruan v0.0.18: Penyempurnaan Total 3D Floating & Timbul Sesuai Gambar Referensi, Circular 3D Hamburger, Neumorphic Search, Glowing Pill Beranda, & Elevasi Versi v0.0.18
1. **Penyempurnaan Total Efek 3D Floating & Timbul Sesuai Gambar Referensi User**:
   - **Topbar Presisi Identik Image 2**:
     - *Circular 3D Hamburger Button*: Tombol bundar putih timbul (`Width="38" Height="38" CornerRadius="19"`) dengan efek soft drop shadow (`BlurRadius="8" ShadowDepth="2"`) dan 3 baris ikon menu slate gelap.
     - *Brand Logo Origami 3D*: Logo segitiga lipat 3D dengan drop shadow, teks *"Story.In"* tebal navy dan subtitle *"AI Account Manager"*.
     - *Neumorphic Capsule Search Bar*: Search bar kapsul lebar (`520px`, `CornerRadius="19"`) berlatar putih dengan bayangan melayang, ikon kaca pembesar, dan placeholder jelas.
     - *Pill Versi v0.0.18*: Badge pill dengan border halus dan bayangan timbul.
     - *Circular 3D Notification Bell*: Tombol lonceng bundar putih melayang dengan lencana notifikasi merah bundar mengambang di pojok kanan atas berangka `1`.
     - *User Profile Floating Pill*: Wadah pill melayang berisi avatar 3D bundar, teks sapaan *"Selamat Datang"* biru cerah dan *"User Story.In"* navy tebal.
   - **Sidebar Presisi Identik Image 1**:
     - *Beranda 3D Glowing Pill Button*: Transformasi tombol beranda menjadi pill lonjong (`CornerRadius="23"`) bergradasi biru-indigo lembut (`#818cf8` ke `#93c5fd`) dengan bayangan menyala (*glowing drop shadow* `#6366f1` opacity 0.35) serta ikon rumah putih dalam lingkaran transparan.
     - *3D Floating White Cards (Platform AI, Platform Custom, Tools Kreator)*: Kartu putih melayang dengan sudut melengkung tebal (`CornerRadius="20"`) dan bayangan timbul (`BlurRadius="14" ShadowDepth="3" Opacity="0.10"`).
     - *Platform AI Internal Structure*: Panduan garis putus-putus (*dotted line*) di sebelah kiri, item Google Flow, Dola AI, dan ChatGPT dengan logo resmi, badge pill biru cerah `0`, chevron `›`, serta tombol sub-item `+ Tambah Akun` berwarna biru terang `#2563eb` di bawah masing-masing platform.
     - *Platform Custom*: Tombol puffy pill `+ Tambah Platform Baru` bergradasi sky blue lembut (`#e0f2fe` ke `#eff6ff`) dengan border `#bae6fd` dan bayangan timbul.
     - *Tools Kreator*: Panduan garis putus-putus dan squircle icon containers untuk TikTok Downloader, Split Video Editor, dan Merge Video (Gabung Klip).
     - *Retensi Menu Lengkap*: Menu Shop Produk (badge LIVE), Tutorial (badge VIDEO), Setting (Kelola Lisensi, Cek Update, Tentang Aplikasi), dan kartu tagline bawah tetap terpasang utuh dengan efek 3D floating shadow yang serasi.
   - **Dashboard View 3D Timbul**:
     - Hero Banner Card, 4 Stat Metric Tiles (Total Platform, Total Akun, Generasi Hari Ini, Berhasil Diproses), Kartu Tutorial, Kartu Aktivitas, dan 4 Subscription Pricing Cards (Basic, Pro, Premium, Enterprise) dilengkapi efek *floating layered drop shadow* sehingga seluruh elemen dashboard tampak menonjol dan timbul secara konsisten.

2. **Kompilasi Standalone & Elevasi Versi Resmi v0.0.18 di Seluruh Ekosistem**:
   - Proyek WPF Desktop (`AIPilotManager.csproj` & `MainWindow.xaml.cs`): Dinaikkan ke `0.0.18` (Assembly & FileVersion `0.0.18.0`).
   - Kompilasi single-file portable `Story.in-AI-Manager.exe` (164.5 MB) berhasil dipublish dan disalin ke target distribusi lokal.
   - Express Backend API (`server/index.js`): `MIN_OFFICIAL_VERSION = '0.0.18'`.
   - React Frontend (`StoreContext.jsx`, `DownloadAppView.jsx`, `HomeView.jsx`): Sinkronisasi versi `0.0.18` dan changelog.
   - Vite web build produksi berhasil diperbarui di `DYARIKU/dist/`.
   - Rilis publik resmi telah dipublikasikan di [GitHub Release v0.0.18](https://github.com/studioentaf-bit/dyariinapp/releases/tag/v0.0.18).

3. **Instruksi Deploy VPS (Wajib Dijalankan pada Server)**:
   ```bash
   cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
   ```

### AC. Pembaruan v0.0.19: Peningkatan 3D Timbul dengan Colored Glow Shadows, Penajaman Resolusi & Kontrol Zoom, Hero Banner Full Left-Aligned, Pelebaran Sidebar (290px), Retensi Tombol Story Generator saat Panel Terbuka, & Elevasi Versi v0.0.19
1. **Penerapan 3D Colored Glow Shadows pada Setiap Tombol & Menu**:
   - Setiap elemen interaktif kini memancarkan bayangan timbul (*floating colored drop shadow*) berona serasi dengan warna aksen masing-masing:
     - *Beranda*: Bayangan menyala indigo/biru (`#6366f1`, opacity 0.40).
     - *Shop Produk*: Bayangan hijau emerald (`#10b981`, opacity 0.25).
     - *Tutorial*: Bayangan merah/rose (`#f43f5e`, opacity 0.25).
     - *Tambah Platform Baru*: Bayangan biru langit cerah (`#38bdf8`, opacity 0.35).
     - *Stat Metric Cards*: 4 kartu metrik memiliki shadow sesuai warnanya (Platform: Biru `#3b82f6`, Akun: Mint `#10b981`, Generasi: Ungu `#8b5cf6`, Berhasil: Oranye `#f97316`), serta tombol panah sirkular `›` yang menonjol timbul.
     - *Platform Pills Hero Banner*: `+ Flow` (biru), `Dola` (ungu), `ChatGPT` (emerald), dan `+ Platform Lainnya` (indigo) masing-masing memancarkan bayangan glow mandiri.

2. **Penajaman Resolusi Tampilan & Penambahan Kontrol Zoom Topbar**:
   - Menghilangkan potensi efek blur pada teks dengan mengoptimalkan pengaturan engine WPF (`Display` formatting, ClearType hint, dan `Quality` rendering bias pada drop shadow).
   - Menambahkan widget kontrol zoom interaktif `[ − ] 100% [ + ]` di topbar header sehingga pengguna dapat langsung melihat keterangan persentase zoom dan memperbesar/memperkecil skala aplikasi secara instan.

3. **Pelebaran Sidebar Kiri (290px)**:
   - Lebar kolom sidebar kiri dinaikkan menjadi `290px` (sebelumnya `240px`-`255px`) memberikan proporsi ruang yang pas, lega, dan elegan untuk seluruh kartu menu 3D.

4. **Pembaruan Icon Notifikasi Lonceng & Profil Avatar Menjadi Ultra-Crisp Vector**:
   - Menggantikan gambar raster PNG dengan DirectX Vector resolusi kristal:
     - Lonceng notifikasi emas 3D dengan lencana merah mengambang berangka `1` (`#ef4444`).
     - Avatar profil modern berbentuk lingkaran siluet vector biru cerah (`#3b82f6`) yang tajam pada semua skala DPI layar.

5. **Hero Banner Full Left-Aligned & Penghapusan Gambar Kanan**:
   - Menghapus grafik awan/ikon melayang di sebelah kanan hero banner sesuai instruksi referensi.
   - Teks deskripsi ditarik penuh ke sebelah kiri langsung di bawah subheadline (`MaxWidth="900"`, left-aligned), diikuti oleh deretan platform pills.

6. **Penghapusan Paket Lisensi di Halaman Beranda**:
   - Menghapus total section paket langganan (Basic, Pro, Premium, Enterprise) di bagian bawah dashboard beranda, menyisakan layout dashboard yang bersih, fokus, dan rapi.

7. **Retensi Tombol Floating Story Generator saat Drawer Terbuka**:
   - Tombol tab vertikal Story Generator (`TabStoryGenBtn`) kini diprogram untuk **tetap terlihat** (`Visibility.Visible`) di sisi kiri tengah drawer saat panel Story Generator dibuka.

8. **Penghalusan Animasi Transisi (Smooth Fluid Motion)**:
   - Transisi buka/tutup sidebar kini dianimasikan secara halus menggunakan `CubicEase` (`EaseInOut`).
   - Pembukaan drawer Story Generator diperhalus dengan `QuarticEase` fluid motion (`280ms`).
   - Perpindahan antar menu utama dihaluskan dengan animasi cross-fade dan subtle slide `CubicEase`.

9. **Elevasi Versi Resmi v0.0.19 di Seluruh Ekosistem**:
   - Proyek WPF Desktop (`AIPilotManager.csproj` & `MainWindow.xaml.cs`): Dinaikkan ke `0.0.19` (Assembly & FileVersion `0.0.19.0`).
   - File executable `Story.in-AI-Manager.exe` (164.5 MB) berhasil dikompilasi dan disalin ke direktori distribusi.
   - Express Backend API (`server/index.js`): `MIN_OFFICIAL_VERSION = '0.0.19'`.
   - React Frontend (`StoreContext.jsx`, `DownloadAppView.jsx`, `HomeView.jsx`): Sinkronisasi versi `0.0.19` dan changelog.
   - Vite web build produksi berhasil dikompilasi ulang di `DYARIKU/dist/`.
   - Publikasi resmi aktif di [GitHub Release v0.0.19](https://github.com/studioentaf-bit/dyariinapp/releases/tag/v0.0.19).

10. **Instruksi Deploy VPS (Wajib Dijalankan pada Server)**:
    ```bash
    cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
    ```

---

## [2026-10-25] - Rilis Versi 0.0.20: Ultra-Crisp Rendering, Vector Icons & Butter-Smooth 60 FPS Transitions

### Ringkasan Pembaruan v0.0.20:
Menindaklanjuti evaluasi dan feedback detail pengguna terkait ketajaman visual, bentuk elemen icon, serta kelancaran animasi:

1. **Penajaman Resolusi & Elemen Bebas Blur (100% Pixel Grid Lock)**:
   - Mengatasi akar masalah blur subpixel pada area konten utama dengan mengunci default UI zoom scale ke **100% (1.0)**.
   - Mengimplementasikan layout rounding dan ClearType hint terintegrasi (`UseLayoutRounding="True" SnapsToDevicePixels="True" TextOptions.TextFormattingMode="Display" TextOptions.TextRenderingMode="ClearType" RenderOptions.ClearTypeHint="Enabled"`) di seluruh grid utama.
   - Menambahkan auto-snap pada saved scale antara `0.90` - `0.99` ke `1.0` murni sehingga font dan garis batas tampil ultra-tajam tanpa antialiasing kabur.

2. **Avatar Profil Lingkaran Sempurna (Zero Square Leakage)**:
   - Merekonstruksi wadah profil avatar di topbar kanan menggunakan `<Ellipse>` murni dengan `ImageBrush` dan border stroke melingkar.
   - Menghilangkan bug WPF Border clipping di mana elemen anak persegi sebelumnya bocor keluar dari sudut rounded pill.

3. **Icon 3D Earth Globe & 3D Crossed Tools Presisi**:
   - **Platform Custom**: Menggantikan icon sebelumnya dengan 3D Earth Globe sphere dengan `RadialGradientBrush` bola dunia, lingkar ekuator, meridian latitude/longitude 3D, dan bayangan kedalaman.
   - **Tools Kreator**: Menggantikan icon sebelumnya dengan 3D Crossed Hammer & Wrench proporsional dengan material kayu hangat (`#ea580c`), kepala palu baja, dan kunci inggris berlapis highlight (`#64748b` & `#475569`).

4. **Animasi Transisi Sidebar Kiri Fluid 60 FPS**:
   - Memperbaiki layout column grid dengan `SidebarColumn.Width = Auto`, sehingga interpolasi `SidebarBorder.Width` dianimasikan secara real-time frame demi frame menggunakan kurva `QuarticEase` (`240ms`) tanpa sentakan atau kekosongan layout.

5. **Animasi Drawer Story Generator Ultra-Ringan (Zero Lag)**:
   - Menghilangkan pemanggilan animasi resizing pada OS Window (`Window.Width`) yang sebelumnya membebani Windows Desktop Window Manager (DWM).
   - Animasi geser kini sepenuhnya GPU-composited murni pada `StoryGenDrawer.Width` (`220ms` QuarticEase), menghasilkan transisi pembukaan dan penutupan yang sangat ringan, mulus, dan responsif.
   - Tombol vertikal Story Generator tetap stabil melayang di sebelah kiri drawer.

6. **Elevasi Versi Resmi v0.0.20 di Seluruh Ekosistem**:
   - Proyek WPF Desktop (`AIPilotManager.csproj` & `MainWindow.xaml.cs`): Dinaikkan ke `0.0.20` (Assembly & FileVersion `0.0.20.0`).
   - File executable `Story.in-AI-Manager.exe` (164.5 MB) berhasil dikompilasi dan didistribusikan.
   - Express Backend API (`server/index.js`): `MIN_OFFICIAL_VERSION = '0.0.20'`.
   - React Frontend (`StoreContext.jsx`): Sinkronisasi versi `0.0.20` dan changelog.
   - Vite web build produksi berhasil dikompilasi ulang di `DYARIKU/dist/`.
   - Publikasi resmi aktif di GitHub Release v0.0.20.

7. **STANDAR OPERASIONAL PROSEDUR (SOP) DEPLOY VPS RESMI v0.0.23**:

   Berikut adalah SOP resmi untuk memperbarui instance produksi website publik di VPS Ubuntu:

   #### A. Persiapan & Akses Server
   1. Buka Terminal / PowerShell di komputer Anda:
      ```bash
      ssh root@IP_VPS_ANDA
      ```
   2. Pastikan Anda berada pada direktori kerja aplikasi:
      ```bash
      cd /var/www/dyariapp.my.id
      ```

   #### B. Opsi 1: One-Command Auto-Deploy (Direkomendasikan)
   Jalankan script otomasi pembaruan yang aman dan teruji:
   ```bash
   cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
   ```
   *Script ini secara otomatis akan melakukan git pull, instalasi dependensi jika ada perubahan, build ulang Vite React ke `dist/`, restart service PM2 `dyari-api`, dan reload Nginx.*

   #### C. Opsi 2: Prosedur Manual Step-by-Step (Jika Ingin Kontrol Penuh)
   1. **Tarik Kode Terbaru dari GitHub**:
      ```bash
      cd /var/www/dyariapp.my.id
      git stash || true
      git fetch origin main
      git reset --hard origin/main
      ```
   2. **Build Ulang Tampilan Frontend React (Vite)**:
      ```bash
      npm install --no-audit --no-fund
      npm run build
      ```
      *(Pastikan folder `dist/` ter-generate tanpa error)*
   3. **Sinkronisasi Dependensi Backend Express**:
      ```bash
      cd /var/www/dyariapp.my.id/server
      npm install --no-audit --no-fund
      ```
   4. **Restart Layanan Backend PM2 (`dyari-api`)**:
      ```bash
      cd /var/www/dyariapp.my.id
      pm2 restart dyari-api
      pm2 save
      ```
   5. **Reload Konfigurasi Nginx Web Server**:
      ```bash
      sudo nginx -t && sudo systemctl reload nginx
      ```

   #### D. Verifikasi Pasca Deploy (Checklist Sukses)
   - [ ] Cek status PM2: `pm2 status dyari-api` (harus `online`, status uptime berjalan, restart count wajar).
   - [ ] Cek endpoint health backend: `curl -I http://localhost:5000/api/products` (harus merespons `HTTP/1.1 200 OK`).
   - [ ] Buka website publik di browser: `https://dyariapp.my.id` (bersihkan cache browser Ctrl+Shift+R) dan pastikan tampilan baru **Story.in** 3D Playful Pastel Bento tampil sempurna.
   - [ ] Uji navigasi menu: Beranda, Shop Katalog, Download App, Lisensi Resmi.
   - [ ] Uji alur Instant Checkout: Buka salah satu produk/lisensi dan pastikan modal pembayaran terbuka normal.

   #### E. Prosedur Rollback Cepat (Jika Terjadi Kendala Kritis)
   Jika terjadi kendala tak terduga, rollback instan ke commit stabil sebelumnya:
   ```bash
   cd /var/www/dyariapp.my.id
   git reset --hard 50983df
   npm run build
   pm2 restart dyari-api
   ```

8. **Rincian Berkas yang Diperbarui pada Rilis v0.0.23**:
   - `story-in-manager-wpf/MainWindow.xaml`: Pembaruan topbar profile pill (siluet orang + email), navigasi "My Platform" dengan ikon browser 3D window, penghapusan override formatting statis di `DashboardView`.
   - `story-in-manager-wpf/MainWindow.xaml.cs`: Peningkatan versi ke `0.0.23`, implementasi animasi cross-fade menu `SwitchToMainView` (120ms fade-out + 180ms cubic ease fade-in), dynamic vector curve calculation saat zoom (`UseLayoutRounding = false; SnapsToDevicePixels = false; TextFormattingMode.Ideal`).
   - `story-in-manager-wpf/AIPilotManager.csproj`: Elevasi versi `0.0.23` (AssemblyVersion & FileVersion `0.0.23.0`).
   - `DYARIKU/server/index.js`: Penyesuaian `MIN_OFFICIAL_VERSION = '0.0.23'`.
   - `DYARIKU/src/context/StoreContext.jsx`: Versi `0.0.23`, direct download binary `Story.in-AI-Manager-v0.0.23.exe`, changelog v0.0.23, dan default branding `Story.in`.
   - `DYARIKU/index.html`: Judul `Story.in — Ekosistem Produk Digital & AI Workspace Manager`, meta tags, dan background `#f8faff`.
   - `DYARIKU/src/index.css`: Utilitas bento 3D, bayangan kedalaman pastel, dan styling scrollbar.
   - `DYARIKU/src/components/Navbar.jsx`: Navbar 3D Playful Bento dengan top announcement bar sky blue, logo origami folded 3D + `Story.in`, capsule menu pill (active lavender font-black).
   - `DYARIKU/src/components/Footer.jsx`: Footer bento modern `Story.in`.
   - `DYARIKU/src/components/ProductCard.jsx`: Kartu bento floating putih rounded-3xl, shadow 3D lembut, dan tombol puffy biru.
   - `DYARIKU/src/components/InstantCheckoutModal.jsx`: Rebranding pesan WhatsApp admin dan instruksi pembayaran QRIS / Bank Transfer ke `Story.in`.
   - `DYARIKU/src/views/HomeView.jsx`: Perombakan total halaman beranda bento 3D persis gambar referensi (Hero 3D mockup laptop, showcase Story Generator, 4 pilar nilai, 6 kategori bento, produk terpopuler, super bundle, ulasan).
   - `DYARIKU/src/views/ShopView.jsx`: Rebranding ke Katalog Digital `Story.in`, pencarian dan kategori pills 3D bento.
   - `DYARIKU/src/views/DownloadAppView.jsx`: URL download binary `Story.in-AI-Manager-v0.0.23.exe` (165 MB), tata cara aktivasi 4 langkah, dan rebranding `Story.in`.
   - `DYARIKU/src/views/AboutView.jsx`: Halaman tentang brand `Story.in` dengan 3 prinsip utama.
   - `DYARIKU/src/views/LicensesView.jsx`: Rebranding ke Lisensi Resmi `Story.in` format `STORY-XXXX-XXXX`.

---

## [2026-10-25] - Rilis Versi 0.0.21: Direct 1:1 Hardware Pixel Clarity, Visible Bento States & Instant Zero-Lag Menu Transitions

### Ringkasan Pembaruan v0.0.21:
Menuntaskan feedback kritis pengguna terkait ketajaman total, visibilitas menu Beranda saat membuka menu lain, harmonisasi kontras warna bayangan bento, serta kelancaran perpindahan menu:

1. **Resolusi 100% Ultra-Tajam & Bebas Blur Transform**:
   - Menghapus pembungkus transform permanen `<FrameworkElement.LayoutTransform>` pada grid konten utama (`MainContentGrid`).
   - Pada zoom 100% (default), `LayoutTransform` disetel ke `null` murni sehingga rendering WPF langsung diarahkan 1:1 ke grid piksel layar fisik tanpa interpolasi subpixel matriks.
   - Mengosongkan transform sisa (`targetView.RenderTransform = null`) saat pergantian menu sehingga setiap karakter teks dan garis batas rendered secara native ClearType setajam topbar.

2. **Perbaikan Total Visibilitas Menu "Beranda" (State Inactive)**:
   - Tombol Beranda saat tidak aktif (`isDashActive == false`) kini didesain sebagai **kartu bento putih mengambang 3D** (`Background = #ffffff`, border halus `#f1f5f9`, dan bayangan lembut `#64748b`), bukan transparan.
   - Wadah ikon berubah menjadi warna pastel lavender (`#eef2ff`) dengan ikon rumah berwarna indigo pekat (`#6366f1`) dan teks slate gelap (`#1e293b`), memastikan menu Beranda tetap terlihat jelas, elegan, dan kontras saat pengguna membuka menu lain.

3. **Harmonisasi Kontras Warna Bayangan Bento Sidebar**:
   - Menghilangkan efek bayangan warna neon berlebih pada tombol yang sedang tidak aktif (seperti bayangan hijau neon pada Shop Produk dan pink neon pada Tutorial).
   - Seluruh kartu sidebar kini menggunakan bayangan bento netral yang konsisten (`Color = #64748b, BlurRadius = 10, ShadowDepth = 2, Opacity = 0.08`), dan hanya memancarkan cahaya aksen saat menu tersebut aktif.

4. **Perpindahan Antar Menu Instan, Responsif & Super Mulus**:
   - Menghilangkan animasi komposit ganda `Opacity` dan `TranslateTransform` pada seluruh kontainer tampilan beranda/tools yang membebani GPU/CPU.
   - Perpindahan antar view (`SwitchToMainView`) kini berlangsung secara instan dengan `Opacity = 1.0` dan `RenderTransform = null`, menghasilkan perpindahan 60 FPS tanpa lag, tanpa frame drop, dan tanpa efek blur render target.

5. **Elevasi Versi Resmi v0.0.21 di Seluruh Ekosistem**:
   - Proyek WPF Desktop (`AIPilotManager.csproj` & `MainWindow.xaml.cs`): Dinaikkan ke `0.0.21` (Assembly & FileVersion `0.0.21.0`).
   - File executable `Story.in-AI-Manager.exe` (164.5 MB) berhasil dikompilasi dan didistribusikan.
   - Express Backend API (`server/index.js`): `MIN_OFFICIAL_VERSION = '0.0.21'`.
   - React Frontend (`StoreContext.jsx`): Sinkronisasi versi `0.0.21` dan changelog.
   - Vite web build produksi berhasil dikompilasi ulang di `DYARIKU/dist/`.
   - Publikasi resmi aktif di GitHub Release v0.0.21.

6. **Instruksi Deploy VPS (Wajib Dijalankan pada Server)**:
   ```bash
   cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
   ```

## [2026-10-25] - Rilis Versi 0.0.22: Dynamic Resizable Sidebar, Multi-Scale Vector Sharpness & 3D Playful Pastel Bento Light Cards

### Ringkasan Pembaruan v0.0.22:
Menuntaskan permintaan pengguna terkait ketajaman multi-scale zoom in/out, konversi total elemen gelap di Platform Akun & Shop ke tema 3D Playful Pastel Bento putih, popup dialog lisensi terang modern, garis batas sidebar dinamis (resizable via splitter), serta penamaan binary resmi dengan nomor versi:

1. **Resolusi Multi-Scale Zoom In/Out Ultra-Tajam**:
   - Memperbaiki blurriness saat scale berubah (zoom in / zoom out) dengan menerapkan dynamic vector rendering mode.
   - Pada scale 100%, sistem menggunakan `TextOptions.TextFormattingMode.Display` yang ter-snap langsung 1:1 ke grid hardware.
   - Saat zoom berubah (< 1.0 atau > 1.0), sistem otomatis mengalihkan ke `TextOptions.TextFormattingMode.Ideal` bersama `TextRenderingMode.ClearType` dan `BitmapScalingMode.HighQuality`, sehingga geometri font dihitung langsung dari kurva bezier vektor pada skala baru tanpa pembesaran bitmap kabur.

2. **Konversi Total Card Platform Akun & Shop Produk ke 3D Playful Pastel Bento**:
   - Mengubah background gelap (`#131f33` / `#0f172a`) pada seluruh kartu akun di Platform AI & Platform Custom (`CreateGridAccountCard` & `CreateListAccountCard`) menjadi **kartu putih bersih 3D mengambang** (`#ffffff`), border pastel lembut (`#e2e8f0` / `#3b82f6` saat aktif), bayangan 3D berkedalaman 3px, teks kontras slate gelap (`#0f172a`), badge status pastel (`#eff6ff`), serta tombol buka puffy 3D biru dengan drop shadow.
   - Mengubah katalog Shop Produk & Lisensi (`RenderShopCatalog`) menjadi kartu putih bento mengambang (`#ffffff`), tag badge warna pastel (paling laris, bundle, lisensi resmi, stok), teks deskripsi abu-abu gelap terstruktur, dan tombol aksi "Beli Sekarang" 3D puffy.

3. **Modernisasi Dialog Popup Lisensi (`LicenseDialog.xaml`) ke 3D Pastel Terang**:
   - Merombak total dialog popup aktivasi perangkat dari modal gelap pekat menjadi modal 3D Playful Bento putih elegan (`Background="#ffffff"`, `CornerRadius="24"`), bayangan timbul lembut berjarak 8px, logo 3D pastel, kolom input email & HWID abu-abu terang (`#f8fafc`), box lisensi biru pastel lembut (`#eff6ff`), dan tombol aktivasi utama 3D biru puffy dengan kedalaman shadow berkualitas.

4. **Ukuran Sidebar Dinamis via Draggable Splitter (`GridSplitter`)**:
   - Menambahkan `GridSplitter` di antara kolom sidebar dan area kerja utama sehingga pengguna dapat menarik/menggeser garis batas sidebar secara bebas (`MinWidth = 180`, `MaxWidth = 500`).
   - Seluruh tombol, kartu bento, dan teks di dalam sidebar otomatis menyesuaikan (merentang adaptif) dengan lebar kolom yang ditentukan pengguna.
   - Menyimpan lebar terakhir (`_savedSidebarWidth`) saat toggle hide/show sehingga ukuran kustom tetap terjaga.

5. **Harmonisasi Fitur & Form Story Generator**:
   - Mengubah container prompt box output Master Prompt (`ImgMasterPromptText`) dari gelap pekat menjadi kartu pastel 3D bento (`#f8fafc`, border `#e2e8f0`), teks tajam gelap (`#0f172a`), dan tombol salin prompt pastel biru.

6. **Elevasi Versi Resmi v0.0.22 & Penamaan File Binary Berversi**:
   - Proyek WPF Desktop (`AIPilotManager.csproj` & `MainWindow.xaml.cs`): Dinaikkan ke `0.0.22` (Assembly & FileVersion `0.0.22.0`).
   - File binary resmi tersedia dengan penamaan spesifik: **`Story.in-AI-Manager-v0.0.22.exe`** (serta `Story.in-AI-Manager.exe` untuk kompabilitas).
   - Express Backend API (`server/index.js`): `MIN_OFFICIAL_VERSION = '0.0.22'`.
   - React Frontend (`StoreContext.jsx`): Sinkronisasi versi `0.0.22` dan direct download URL.
   - Vite web build produksi berhasil dikompilasi ulang di `DYARIKU/dist/`.
   - Rilis publik dipublikasikan di GitHub Release v0.0.22.

7. **Instruksi Deploy VPS (Wajib Dijalankan pada Server)**:
   ```bash
   cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
   ```

## [2026-10-26] - Rilis Versi 0.0.23: Transisi Fade Antar Menu Halus, Rebrand Story.in Website Publik (3D Playful Pastel Bento), My Platform & Multi-Scale Zoom Sharpness

### Ringkasan Pembaruan v0.0.23:
Menuntaskan permintaan lengkap pengguna terkait kehalusan transisi menu, pembaruan ikon dan nama menu, profil email user, ketajaman scale zoom, serta perombakan visual total website publik menjadi tema Story.in 3D Playful Pastel Bento:

1. **Transisi Perpindahan Antar Menu Super Halus & Mulus**:
   - Menghilangkan pergantian menu yang mendadak/abrupt di aplikasi desktop WPF.
   - Mengimplementasikan transisi cross-fade terpadu (`SwitchToMainView`) dengan `DoubleAnimation` Opacity (120ms fade out dengan `CubicEaseMode.EaseIn`, dilanjutkan dengan 180ms fade in dengan `CubicEaseMode.EaseOut`).
   - Memberikan pengalaman moving yang ringan, lembut, dan mulus di setiap pergantian bar dan menu.

2. **Penggantian Nama Menu "Platform Custom" -> "My Platform"**:
   - Memperbarui label menu navigasi dari "Platform Custom" menjadi **"My Platform"** di sidebar desktop WPF.
   - Mengganti icon globe lama dengan icon modern 3D Browser Window (terdiri dari bingkai tab window, 3 window control dots, dan address bar) yang konsisten dengan estetika 3D pastel.

3. **Ikon Profil Orang & Tampilan Email User**:
   - Mengganti icon profil pojok kanan atas topbar menjadi siluet vektor orang (human avatar) dengan background pastel halus yang rapi dan rounded.
   - Menampilkan email user terdaftar (`_license.Email`) secara dinamis di samping avatar, dengan fallback informasi status lisensi jika belum diaktivasi.

4. **Ketajaman Skala Zoom In / Zoom Out (Multi-Scale Sharpness)**:
   - Mengeliminasi penyebab font blur saat zoom: menghapus atribut statis `TextOptions.TextFormattingMode="Display"` pada `DashboardView` yang sebelumnya menimpa logika dinamis parent.
   - Pada saat zoom in/out (scale != 1.0), sistem menonaktifkan pembulatan grid piksel fisik (`UseLayoutRounding = false; SnapsToDevicePixels = false`) dan mengaktifkan kurva bezier vektor asli (`TextFormattingMode.Ideal`), sehingga teks tetap tajam sempurna pada seluruh level perbesaran.

5. **Perombakan Total Konsep Visual Website Publik ke Story.in (3D Playful Pastel Bento & Tactile Shadow)**:
   - Mengganti total identitas brand dari "dyari" menjadi **`Story.in`** di seluruh antarmuka publik sesuai desain referensi.
   - **Sistem Tombol & Menu 3D Timbul (Tactile 3D Buttons & Pills)**:
     - Setiap tombol utama kini memiliki kedalaman fisik nyata (timbul) dengan bevel bawah tebal (`border-b-[4px]` atau `border-b-[3px]`), bayangan warna berkedalaman (`shadow-[0_8px_20px_rgba(...)]`), dan feedback klik realistis (`active:translate-y-[2px] active:border-b-[2px]`).
     - Tersedia utility classes: `.btn-3d-coral`, `.btn-3d-blue`, `.btn-3d-emerald`, `.btn-3d-white`, dan `.btn-3d-dark`.
     - Menu navigasi desktop menggunakan `.nav-capsule-container` mengambang dengan 3D active pill `.pill-3d-active` (lavender/indigo bevel timbul `border-b-[3px]`) dan `.pill-3d-idle`.
   - **Penerapan Menyeluruh di Semua Halaman Website**:
     - **Beranda (`HomeView.jsx`)**: Hero action buttons 3D puffy, Story Generator preview studio 3D, 4 pilar bento cards dengan bottom bevel warna-warni (emerald, rose, purple, blue), 6 kategori produk 3D bento, produk terpopuler dengan kartu 3D timbul, Super Bundle promo dengan tombol 3D coral, dan kartu testimoni 3D bento.
     - **Shop Katalog (`ShopView.jsx`)**: Search input 3D timbul, filter tab kategori 3D bento dengan tombol aktif timbul, kartu katalog produk 3D, dan tombol "Muat Lebih Banyak" 3D dark.
     - **Lisensi Resmi (`LicensesView.jsx`)**: Kartu-kartu tier lisensi 3D bento (Basic, Pro, Lifetime) dengan tombol aksi 3D coral/blue, filter tab kategori 3D, dan form cek validitas lisensi bento 3D.
     - **Story Generator (`StoryGeneratorView.jsx`)**: Gerbang aktivasi lisensi 3D bento card, form input serial 3D, tombol aktivasi 3D blue, dan studio bar slate-900.
     - **Download Aplikasi (`DownloadAppView.jsx`)**: Main card bento 3D timbul dengan tombol download 3D blue puffy, kartu 4 langkah aktivasi 3D, dan badge spesifikasi rilis 3D.
     - **Tentang Kami (`AboutView.jsx`)**: Kartu 2 pilar produk digital & AI studio 3D bento, tombol CTA 3D coral & blue, dan box prinsip Story.in slate-900.
   - **Panel Admin Tampilan Gelap Elegan (`AdminDashboardView.jsx` & `.dark-admin`)**:
     - Merombak tampilan Panel Admin menjadi **mode gelap menyeluruh** (`bg-[#070d19]`, sidebar & header `#0d1527`, card container `#111c33`, form input `#0b1324` dengan border `#1e293b` dan glowing focus `#3b82f6`).
     - Tampilan portal login admin gelap elegan dengan aksen biru Story.in.
     - Seluruh tabel pesanan, antrian order, manajemen stok, dan pengaturan otomatis beradaptasi ke tema gelap kontras tinggi.
   - **Integritas Sacred Flow Terjaga**: Alur Instant Checkout, verifikasi lisensi, polling antrian order, webhook, dan backend API tetap berfungsi normal tanpa bug.

6. **Elevasi Versi Resmi v0.0.23 & Penamaan File Binary**:
   - Proyek WPF Desktop (`AIPilotManager.csproj` & `MainWindow.xaml.cs`): Versi dinaikkan ke `0.0.23` (Assembly & FileVersion `0.0.23.0`).
   - File binary resmi: **`Story.in-AI-Manager-v0.0.23.exe`** (164.55 MB) dan **`Story.in-AI-Manager.exe`**.
   - Express Backend API (`server/index.js`): `MIN_OFFICIAL_VERSION = '0.0.23'`.
   - React Frontend (`StoreContext.jsx`): Sinkronisasi versi `0.0.23` dan direct download URL.
   - Vite web build produksi berhasil dikompilasi ulang di `DYARIKU/dist/`.
   - Publikasi rilis resmi aktif di GitHub Release v0.0.23.

7. **STANDAR OPERASIONAL PROSEDUR (SOP) DEPLOY VPS RESMI v0.0.23**:

   Berikut adalah SOP resmi untuk memperbarui instance produksi website publik di VPS Ubuntu:

   #### A. Persiapan & Akses Server
   1. Buka Terminal / PowerShell di komputer Anda:
      ```bash
      ssh root@IP_VPS_ANDA
      ```
   2. Pastikan Anda berada pada direktori kerja aplikasi:
      ```bash
      cd /var/www/dyariapp.my.id
      ```

   #### B. Opsi 1: One-Command Auto-Deploy (Direkomendasikan)
   Jalankan script otomasi pembaruan yang aman dan teruji:
   ```bash
   cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
   ```
   *Script ini secara otomatis akan melakukan git pull, instalasi dependensi jika ada perubahan, build ulang Vite React ke `dist/`, restart service PM2 `dyari-api`, dan reload Nginx.*

   #### C. Opsi 2: Prosedur Manual Step-by-Step (Jika Ingin Kontrol Penuh)
   1. **Tarik Kode Terbaru dari GitHub**:
      ```bash
      cd /var/www/dyariapp.my.id
      git stash || true
      git fetch origin main
      git reset --hard origin/main
      ```
   2. **Build Ulang Tampilan Frontend React (Vite)**:
      ```bash
      npm install --no-audit --no-fund
      npm run build
      ```
      *(Pastikan folder `dist/` ter-generate tanpa error)*
   3. **Sinkronisasi Dependensi Backend Express**:
      ```bash
      cd /var/www/dyariapp.my.id/server
      npm install --no-audit --no-fund
      ```
   4. **Restart Layanan Backend PM2 (`dyari-api`)**:
      ```bash
      cd /var/www/dyariapp.my.id
      pm2 restart dyari-api
      pm2 save
      ```
   5. **Reload Konfigurasi Nginx Web Server**:
      ```bash
      sudo nginx -t && sudo systemctl reload nginx
      ```

   #### D. Verifikasi Pasca Deploy (Checklist Sukses)
   - [ ] Cek status PM2: `pm2 status dyari-api` (harus `online`, status uptime berjalan, restart count wajar).
   - [ ] Cek endpoint health backend: `curl -I http://localhost:5000/api/products` (harus merespons `HTTP/1.1 200 OK`).
   - [ ] Buka website publik di browser: `https://dyariapp.my.id` (bersihkan cache browser Ctrl+Shift+R) dan pastikan tampilan baru **Story.in** 3D Playful Pastel Bento tampil sempurna.
   - [ ] Uji navigasi menu: Beranda, Shop Katalog, Download App, Lisensi Resmi.
   - [ ] Uji alur Instant Checkout: Buka salah satu produk/lisensi dan pastikan modal pembayaran terbuka normal.

   #### E. Prosedur Rollback Cepat (Jika Terjadi Kendala Kritis)
   Jika terjadi kendala tak terduga, rollback instan ke commit stabil sebelumnya:
   ```bash
   cd /var/www/dyariapp.my.id
   git reset --hard 50983df
   npm run build
   pm2 restart dyari-api
   ```

8. **Rincian Berkas yang Diperbarui pada Rilis v0.0.23**:
   - `story-in-manager-wpf/MainWindow.xaml`: Pembaruan topbar profile pill (siluet orang + email), navigasi "My Platform" dengan ikon browser 3D window, penghapusan override formatting statis di `DashboardView`.
   - `story-in-manager-wpf/MainWindow.xaml.cs`: Peningkatan versi ke `0.0.23`, implementasi animasi cross-fade menu `SwitchToMainView` (120ms fade-out + 180ms cubic ease fade-in), dynamic vector curve calculation saat zoom (`UseLayoutRounding = false; SnapsToDevicePixels = false; TextFormattingMode.Ideal`).
   - `story-in-manager-wpf/AIPilotManager.csproj`: Elevasi versi `0.0.23` (AssemblyVersion & FileVersion `0.0.23.0`).
   - `DYARIKU/server/index.js`: Penyesuaian `MIN_OFFICIAL_VERSION = '0.0.23'`.
   - `DYARIKU/src/context/StoreContext.jsx`: Versi `0.0.23`, direct download binary `Story.in-AI-Manager-v0.0.23.exe`, changelog v0.0.23, dan default branding `Story.in`.
   - `DYARIKU/index.html`: Judul `Story.in — Ekosistem Produk Digital & AI Workspace Manager`, meta tags, dan background `#f8faff`.
   - `DYARIKU/src/index.css`: Utilitas bento 3D, bayangan kedalaman pastel, dan styling scrollbar.
   - `DYARIKU/src/components/Navbar.jsx`: Navbar 3D Playful Bento dengan top announcement bar sky blue, logo origami folded 3D + `Story.in`, capsule menu pill (active lavender font-black).
   - `DYARIKU/src/components/Footer.jsx`: Footer bento modern `Story.in`.
   - `DYARIKU/src/components/ProductCard.jsx`: Kartu bento floating putih rounded-3xl, shadow 3D lembut, dan tombol puffy biru.
   - `DYARIKU/src/components/InstantCheckoutModal.jsx`: Rebranding pesan WhatsApp admin dan instruksi pembayaran QRIS / Bank Transfer ke `Story.in`.
   - `DYARIKU/src/views/HomeView.jsx`: Perombakan total halaman beranda bento 3D persis gambar referensi (Hero 3D mockup laptop, showcase Story Generator, 4 pilar nilai, 6 kategori bento, produk terpopuler, super bundle, ulasan).
   - `DYARIKU/src/views/ShopView.jsx`: Rebranding ke Katalog Digital `Story.in`, pencarian dan kategori pills 3D bento.
   - `DYARIKU/src/views/DownloadAppView.jsx`: URL download binary `Story.in-AI-Manager-v0.0.23.exe` (165 MB), tata cara aktivasi 4 langkah, dan rebranding `Story.in`.
   - `DYARIKU/src/views/AboutView.jsx`: Halaman tentang brand `Story.in` dengan 3 prinsip utama.
   - `DYARIKU/src/views/LicensesView.jsx`: Rebranding ke Lisensi Resmi `Story.in` format `STORY-XXXX-XXXX`.

---

## [2026-10-26] - Rilis Versi 0.0.24: Official 3D Story.in Pastel Branding, Multi-Resolution Windows ICO, Clean Topbar & Domain Alignment

### Ringkasan Pembaruan v0.0.24:
Menuntaskan permintaan pengguna terkait integrasi logo visual 3D resmi Story.in pastel glossy di website dan aplikasi desktop, penyediaan file icon `.ico` Windows multi-resolusi, penghapusan tombol lonceng notifikasi non-aktif di pojok kanan atas aplikasi desktop, perataan domain resmi `https://story-in.my.id`, serta dokumentasi akses login panel admin:

1. **Integrasi Logo Resmi 3D Story.in Pastel Glossy**:
   - Memproses source image visual 3D huruf 'S' pastel timbul dengan glossy finish dan teks timbul `Story.in`.
   - Menggantikan logo origami SVG di Navbar dan Footer website publik dengan aset gambar resmi `story-in-logo.png`.
   - Mengintegrasikan logo baru ke aplikasi desktop WPF (`Assets/app_logo.png` dan `Assets/app_logo_icon.png`).
   - Memperbarui favicon web di `index.html` menggunakan `story-in-logo.png` dan `favicon.ico`.

2. **Logo Berkas File Aplikasi Windows (Multi-Resolution .ICO)**:
   - Dibuat berkas `.ico` Windows profesional yang memuat multi-resolusi: 256x256, 128x128, 64x64, 48x48, 32x32, dan 16x16 pixel dengan transparency alpha channel murni.
   - Diatur sebagai icon executable resmi aplikasi di `AIPilotManager.csproj` (`<ApplicationIcon>Assets\icon.ico</ApplicationIcon>`).

3. **Pembersihan Topbar Desktop (Hapus Tombol Notifikasi Non-Aktif)**:
   - Menghapus container elemen tombol lonceng notifikasi statis di pojok kanan atas `MainWindow.xaml` yang sebelumnya tidak memiliki fungsi/interaksi.
   - Tampilan topbar kini lebih bersih, rapi, dan berfokus pada pill zoom control, indikator versi, dan User Profile / License Pill.

4. **Konfigurasi Domain Resmi (`story-in.my.id`)**:
   - Nginx server block di `deploy/nginx.conf` mendukung multi-domain: `story-in.my.id`, `www.story-in.my.id`, `dyariapp.my.id`, dan `www.dyariapp.my.id`.
   - API endpoints, WhatsApp redirect URL, dan referensi sistem diselaraskan ke domain utama `story-in.my.id`.

5. **Lokasi & Kredensial Login Panel Admin Story.in**:
   - **URL Login Admin:** `https://story-in.my.id/#admin` (atau `https://dyariapp.my.id/#admin`)
   - **Email Default Admin:** `owner@dyariapp.my.id`
   - **Password Master:** Kredensial master tersimpan di konfigurasi database server. Terdapat tombol *"Reset ke Kredensial Master Default"* pada form login jika kata sandi lupa.

6. **Elevasi Versi Resmi v0.0.24 & Penamaan File Binary**:
   - Proyek WPF Desktop (`AIPilotManager.csproj` & `MainWindow.xaml.cs`): Versi dinaikkan ke `0.0.24` (Assembly & FileVersion `0.0.24.0`).
   - File binary resmi: **`Story.in-AI-Manager-v0.0.24.exe`** (167.12 MB) dan **`Story.in-AI-Manager.exe`**.
   - Express Backend API (`server/index.js`): `MIN_OFFICIAL_VERSION = '0.0.24'`.
   - React Frontend (`StoreContext.jsx`): Sinkronisasi versi `0.0.24` dan direct download URL.
   - Vite web build produksi berhasil dikompilasi ulang di `DYARIKU/dist/`.
   - Publikasi rilis resmi aktif di GitHub Release v0.0.24.

7. **STANDAR OPERASIONAL PROSEDUR (SOP) DEPLOY VPS RESMI v0.0.24**:
   Berikut langkah deploy ke server produksi VPS Ubuntu:
   ```bash
   # 1. Masuk ke folder web di VPS
   cd /var/www/dyariapp.my.id

   # 2. Ambil update terbaru dari GitHub
   git pull origin main

   # 3. Build frontend website
   npm run build

   # 4. Reload Nginx (jika ada update domain di nginx.conf)
   sudo cp deploy/nginx.conf /etc/nginx/sites-available/dyariapp.my.id
   sudo nginx -t && sudo systemctl reload nginx

   # 5. Restart backend Node.js API
   pm2 restart dyari-api --update-env
   ```

8. **Rincian Berkas yang Diperbarui pada Rilis v0.0.24**:
   - `story-in-manager-wpf/MainWindow.xaml`: Penghapusan tombol notifikasi lonceng di topbar.
   - `story-in-manager-wpf/MainWindow.xaml.cs`: Elevasi `CurrentAppVersion = "0.0.24"`.
   - `story-in-manager-wpf/AIPilotManager.csproj`: Elevasi versi `0.0.24` (AssemblyVersion & FileVersion `0.0.24.0`).
   - `story-in-manager-wpf/Assets/icon.ico`: Multi-layer Windows icon 3D Story.in.
   - `story-in-manager-wpf/Assets/app_logo.png` & `app_logo_icon.png`: Aset logo 3D resmi Story.in.
   - `DYARIKU/public/story-in-logo.png`, `favicon.png`, `favicon.ico`: Logo web & favicon resolusi tinggi.
   - `DYARIKU/src/components/Navbar.jsx`: Logo resmi 3D Story.in.
   - `DYARIKU/src/components/Footer.jsx`: Logo resmi 3D Story.in.
   - `DYARIKU/index.html`: Favicon 3D Story.in.
   - `DYARIKU/server/index.js`: `MIN_OFFICIAL_VERSION = '0.0.24'`.
   - `DYARIKU/src/context/StoreContext.jsx`: Versi `0.0.24`, direct download `Story.in-AI-Manager-v0.0.24.exe`, changelog v0.0.24.
   - `DYARIKU/PROJECT_MASTER_LOG.md`: Catatan rilis v0.0.24, panduan login admin, dan SOP deploy.

---

*Catatan ini harus dibaca dan dipatuhi pada setiap iterasi pengembangan berikutnya.*
