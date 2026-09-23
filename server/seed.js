import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure environment variables are loaded
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(process.cwd(), 'server', '.env') });
dotenv.config();

import pool, { query } from './db.js';

async function runSeed() {
  console.log('🚀 Memulai proses seeding database PostgreSQL (dyaridb)...');

  try {
    // 1. Jalankan schema.sql untuk membuat tabel jika belum ada
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await query(schemaSql);
    console.log('✅ Skema tabel PostgreSQL berhasil dibuat / diverifikasi.');

    // 2. Seed Default Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'owner@dyariapp.my.id';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Dyari#Master9981!Secure';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const userCheck = await query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (userCheck.rows.length === 0) {
      await query(
        `INSERT INTO users (name, email, phone, password, role, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ['Super Admin Dyari', adminEmail, '081234567890', hashedPassword, 'admin', 'AKTIF']
      );
      console.log(`✅ Default admin dibuat: ${adminEmail} (password: ${adminPassword})`);
    } else {
      console.log(`ℹ️ Admin ${adminEmail} sudah ada.`);
    }

    // 3. Seed Categories
    const categoriesData = [
      {
        "id": "game-anak",
        "name": "Game Edukasi",
        "slug": "game-anak",
        "icon": "Gamepad2",
        "description": "Game kuis & interaktif anak"
      },
      {
        "id": "produk-islami",
        "name": "Produk Islami",
        "slug": "produk-islami",
        "icon": "BookOpen",
        "description": "Edukasi & ibadah digital"
      },
      {
        "id": "produktifitas-ai",
        "name": "Produktifitas AI",
        "slug": "produktifitas-ai",
        "icon": "Brain",
        "description": "Formula prompt AI cerdas"
      },
      {
        "id": "administrasi-sekolah",
        "name": "Administrasi Guru",
        "slug": "administrasi-sekolah",
        "icon": "GraduationCap",
        "description": "Perangkat kelas & modul guru"
      },
      {
        "id": "worksheet",
        "name": "Worksheet & Printable",
        "slug": "worksheet",
        "icon": "Palette",
        "description": "Lembar kerja & mewarnai"
      },
      {
        "id": "aset-premium",
        "name": "Mega Bundle & Canva",
        "slug": "aset-premium",
        "icon": "Box",
        "description": "Video animasi & template Canva"
      }
    ];

    for (const cat of categoriesData) {
      await query(
        `INSERT INTO categories (id, name, slug, icon, description)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET 
           name = EXCLUDED.name, 
           slug = EXCLUDED.slug, 
           icon = EXCLUDED.icon, 
           description = EXCLUDED.description`,
        [cat.id, cat.name, cat.slug, cat.icon, cat.description]
      );
    }
    console.log('✅ Kategori berhasil dimasukkan.');

    // 4. Seed Official 24 Products (Clean & sync canonical list)
    const productsData = [
  {
    "title": "TOOLS PEMBUAT PROMPT STORYBOOK DAN WORKSHEETS ANAK",
    "slug": "dyari-tools-pembuat-prompt-storybook",
    "price": 29000,
    "original_price": 75000,
    "badge": "AI POWERED",
    "category_id": "produktifitas-ai",
    "category_name": "Produktifitas AI",
    "type": "GEMINI AI",
    "rating": 4.9,
    "sales_count": 142,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788563529/tgsv8a9inf53hyvgadxt.png",
    "access_link": "https://gemini.google.com/share/245b3e03316c?skid=85d0311e-8bf6-4ed3-9c6b-685596f2efaf",
    "features": "[\"Akses penuh ke seluruh materi TOOLS PEMBUAT PROMPT STORYBOOK DAN WORKSHEETS ANAK\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Tinggal klik untuk membuat storybook dan worksheets anak, di lengkapi dengan banyak pilihan style gambar yang keren."
  },
  {
    "title": "KUMPULAN QUIZ ANAK SD",
    "slug": "dyari-kumpulan-quiz-anak-sd",
    "price": 25000,
    "original_price": 50000,
    "badge": "POPULER",
    "category_id": "game-anak",
    "category_name": "Game Edukasi",
    "type": "GAME WEB",
    "rating": 4.8,
    "sales_count": 188,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788504106/jopptajjv2aux3bztmti.png",
    "access_link": "https://www.digitalprodukno1seindonesia.my.id/quiz",
    "features": "[\"Akses penuh ke seluruh materi KUMPULAN QUIZ ANAK SD\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Game tingkat SD main gadget sambil belajar, kelas 1 - 6 lengkap."
  },
  {
    "title": "MATH GALAXY",
    "slug": "dyari-math-galaxy",
    "price": 25000,
    "original_price": 50000,
    "badge": "GAME SERU",
    "category_id": "game-anak",
    "category_name": "Game Edukasi",
    "type": "GAME WEB",
    "rating": 4.8,
    "sales_count": 95,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1789793739/wu0ajazqvh1ganfp7cnj.webp",
    "access_link": "https://sites.google.com/view/math-galaxy/home",
    "features": "[\"Akses penuh ke seluruh materi MATH GALAXY\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Uji ketangkasan dan refleks dengan matematika seru bertema antariksa."
  },
  {
    "title": "40 STORYBOOK ANAK",
    "slug": "dyari-40-storybook-anak",
    "price": 35000,
    "original_price": 99000,
    "badge": "MEGA BUNDLE",
    "category_id": "aset-premium",
    "category_name": "Mega Bundle & Canva",
    "type": "MEGA BUNDLE",
    "rating": 4.9,
    "sales_count": 210,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1786850821/myi5ogvp7ocnkjrio8ik.png",
    "access_link": "https://sites.google.com/view/generasi554/e-book/cerita-hewan",
    "features": "[\"Akses penuh ke seluruh materi 40 STORYBOOK ANAK\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "40 cerita anak sudah jadi boleh di jual kembali dengan lisensi PLR lengkap."
  },
  {
    "title": "SHIP MATH BATLE GAME",
    "slug": "dyari-ship-math-batle-game",
    "price": 25000,
    "original_price": 50000,
    "badge": "BEST SELLER",
    "category_id": "game-anak",
    "category_name": "Game Edukasi",
    "type": "GAME WEB",
    "rating": 4.8,
    "sales_count": 114,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1789794024/emvy2mdof6swpfeac8cx.webp",
    "access_link": "https://sites.google.com/view/naval-battle/home",
    "features": "[\"Akses penuh ke seluruh materi SHIP MATH BATLE GAME\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Game perang kapal laut dengan ketangkasan matematika seru dan adiktif."
  },
  {
    "title": "100 AMALAN PEMBUKA REJEKI",
    "slug": "dyari-100-amalan-pembuka-rejeki",
    "price": 20000,
    "original_price": 49000,
    "badge": "BERKAH",
    "category_id": "produk-islami",
    "category_name": "Produk Islami",
    "type": "EBOOK ISLAMI",
    "rating": 4.9,
    "sales_count": 176,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788871923/unfszh2y1yv4rrlvumxt.jpg",
    "access_link": "https://sites.google.com/view/produkdigitaltemaislami/amalan-pembuka-rezeki",
    "features": "[\"Akses penuh ke seluruh materi 100 AMALAN PEMBUKA REJEKI\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Kumpulan do'a, amalan dan bimbingan dasar untuk anak dan keluarga penarik rezeki berkah."
  },
  {
    "title": "KALKULATOR DIET",
    "slug": "dyari-kalkulator-diet",
    "price": 20000,
    "original_price": 45000,
    "badge": "PRODUKTIF",
    "category_id": "produktifitas-ai",
    "category_name": "Produktifitas AI",
    "type": "WEB APP",
    "rating": 4.7,
    "sales_count": 88,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1786862370/fidtaiz0wbe3ytfzijlk.png",
    "access_link": "https://sites.google.com/view/mizyan-kalkulator-diet/home",
    "features": "[\"Akses penuh ke seluruh materi KALKULATOR DIET\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Tools untuk membantu mengatur pola makan sehat dan kalkulasi kalori harian."
  },
  {
    "title": "LATIHAN MENGHAFAL SURAH PENDEK",
    "slug": "dyari-latihan-menghafal-surah-pendek",
    "price": 25000,
    "original_price": 50000,
    "badge": "REKOMENDASI",
    "category_id": "produk-islami",
    "category_name": "Produk Islami",
    "type": "WEB INTERAKTIF",
    "rating": 4.9,
    "sales_count": 230,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1786863712/x4rr91gzki0qwz3gre5r.png",
    "access_link": "https://sites.google.com/view/mizyan-hafalan-surah/home",
    "features": "[\"Akses penuh ke seluruh materi LATIHAN MENGHAFAL SURAH PENDEK\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Muroja'ah mandiri dengan metode interaktif yang memudahkan anak menghafal Juz Amma."
  },
  {
    "title": "CARA MEMBUAT WEB",
    "slug": "dyari-cara-membuat-web",
    "price": 35000,
    "original_price": 99000,
    "badge": "TUTORIAL LENGKAP",
    "category_id": "aset-premium",
    "category_name": "Mega Bundle & Canva",
    "type": "VIDEO KURSUS",
    "rating": 4.8,
    "sales_count": 154,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1786863107/gsxlsrtwc74e5xyx7buy.png",
    "access_link": "https://sites.google.com/view/opick-digital-081331661370/landing-page",
    "features": "[\"Akses penuh ke seluruh materi CARA MEMBUAT WEB\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Bimbingan step by step cara membuat landing page dari nol tanpa koding."
  },
  {
    "title": "TEBAK AYAT SURAH PENDEK",
    "slug": "dyari-tebak-ayat-surah-pendek",
    "price": 25000,
    "original_price": 50000,
    "badge": "FAVORIT",
    "category_id": "produk-islami",
    "category_name": "Produk Islami",
    "type": "GAME WEB",
    "rating": 4.9,
    "sales_count": 167,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788872730/d6asdapqppqzlirauzla.jpg",
    "access_link": "https://sites.google.com/view/mizyan-tebak-ayat/home",
    "features": "[\"Akses penuh ke seluruh materi TEBAK AYAT SURAH PENDEK\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Menebak ayat dan menyusun potongan ayat surah pendek secara interaktif."
  },
  {
    "title": "ABSENSI IBADAH",
    "slug": "dyari-absensi-ibadah",
    "price": 20000,
    "original_price": 45000,
    "badge": "PRAKTIS",
    "category_id": "produk-islami",
    "category_name": "Produk Islami",
    "type": "TEMPLATE CANVA",
    "rating": 4.8,
    "sales_count": 139,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788873190/mm7kzdnldkfdycrwubgi.jpg",
    "access_link": "https://digital-produk-termurah-no-1.my.canva.site/ibadah-harian",
    "features": "[\"Akses penuh ke seluruh materi ABSENSI IBADAH\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Mencatat dan memantau ibadah harian anak secara terstruktur dan disiplin."
  },
  {
    "title": "700+ Products Siap Jual",
    "slug": "dyari-700-products-siap-jual",
    "price": 49000,
    "original_price": 199000,
    "badge": "MEGA BUNDLE",
    "category_id": "aset-premium",
    "category_name": "Mega Bundle & Canva",
    "type": "MEGA BUNDLE",
    "rating": 4.9,
    "sales_count": 320,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788597493/os0pbigslecmvvo1bogf.png",
    "access_link": "https://drive.google.com/drive/folders/1Q4W-gR73g_6Sp0S-ys7IS4PFKNthZ6bC",
    "features": "[\"Akses penuh ke seluruh materi 700+ Products Siap Jual\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "700+ produk digital siap jual kembali lengkap dengan lisensi PLR/MRR bebas jual ulang."
  },
  {
    "title": "PULUHAN RIBU KONTEN SIAP UPLOAD",
    "slug": "dyari-puluhan-ribu-konten-siap-upload",
    "price": 39000,
    "original_price": 120000,
    "badge": "VIRAL ASSETS",
    "category_id": "aset-premium",
    "category_name": "Mega Bundle & Canva",
    "type": "DATABASE KONTEN",
    "rating": 4.9,
    "sales_count": 245,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1789794836/aueheigkpgujcx3c6qqs.webp",
    "access_link": "https://docs.google.com/spreadsheets/d/12lHxAjbdNQWyw6888AyGFYXUlQbzii_dK6FSMrhBfVI/edit?pli=1&gid=0#gid=0",
    "features": "[\"Akses penuh ke seluruh materi PULUHAN RIBU KONTEN SIAP UPLOAD\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Database konten video, reels, dan template medsos siap pakai tanpa pusing riset ide."
  },
  {
    "title": "GAME EDUKASI",
    "slug": "dyari-game-edukasi",
    "price": 29000,
    "original_price": 65000,
    "badge": "TOP CHOICE",
    "category_id": "game-anak",
    "category_name": "Game Edukasi",
    "type": "GAME WEB",
    "rating": 4.8,
    "sales_count": 162,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1789793410/mtjy0szyt4k7qacd0ztw.webp",
    "access_link": "https://www.digitalprodukno1seindonesia.my.id/game-edukasi",
    "features": "[\"Akses penuh ke seluruh materi GAME EDUKASI\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Koleksi game edukasi interaktif untuk anak usia dini dan SD secara menyenangkan."
  },
  {
    "title": "KUMPULAN FLASH CARD PREMIUM",
    "slug": "dyari-kumpulan-flash-card-premium",
    "price": 35000,
    "original_price": 89000,
    "badge": "MEGA BUNDLE",
    "category_id": "worksheet",
    "category_name": "Worksheet & Printable",
    "type": "FLASH CARD BUNDLE",
    "rating": 4.9,
    "sales_count": 198,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788495905/fafnahk4b5aaaujyrcbp.png",
    "access_link": "https://www.digitalprodukno1seindonesia.my.id/flash-card",
    "features": "[\"Akses penuh ke seluruh materi KUMPULAN FLASH CARD PREMIUM\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Ribuan kartu belajar bergambar flash card printable untuk edukasi anak usia dini."
  },
  {
    "title": "KISAH NABI DAN ROSUL",
    "slug": "dyari-kisah-nabi-dan-rosul",
    "price": 25000,
    "original_price": 55000,
    "badge": "EDUKASI ISLAMI",
    "category_id": "produk-islami",
    "category_name": "Produk Islami",
    "type": "EBOOK ISLAMI",
    "rating": 4.9,
    "sales_count": 184,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1786864019/erk9cx721ahhdli0airr.png",
    "access_link": "https://sites.google.com/view/generasi554/e-book/nabi-nabi",
    "features": "[\"Akses penuh ke seluruh materi KISAH NABI DAN ROSUL\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Kisah 25 Nabi dan Rosul bergambar dan interaktif untuk pendidikan karakter anak."
  },
  {
    "title": "PERPUSTAKAAN DIGITAL",
    "slug": "dyari-perpustakaan-digital",
    "price": 35000,
    "original_price": 99000,
    "badge": "LENGKAP",
    "category_id": "produk-islami",
    "category_name": "Produk Islami",
    "type": "EBOOK BUNDLE",
    "rating": 4.9,
    "sales_count": 205,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1786865056/dkqbhxtkiijv7uazkjub.png",
    "access_link": "https://sites.google.com/view/paket-700-e-book-islami",
    "features": "[\"Akses penuh ke seluruh materi PERPUSTAKAAN DIGITAL\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Ratusan e-book dan modul islami terlengkap untuk referensi belajar keluarga muslim."
  },
  {
    "title": "TOOLS PEMBUAT MATERI AJAR, EDUSMART AI",
    "slug": "dyari-tools-pembuat-materi-ajar-edusmart-ai",
    "price": 29000,
    "original_price": 75000,
    "badge": "AI PENDIDIKAN",
    "category_id": "administrasi-sekolah",
    "category_name": "Administrasi Guru",
    "type": "GEMINI AI",
    "rating": 4.8,
    "sales_count": 153,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788185491/exvmj3mpxaz3bktlk1sg.jpg",
    "access_link": "https://gemini.google.com/share/c8de7e4afbb8",
    "features": "[\"Akses penuh ke seluruh materi TOOLS PEMBUAT MATERI AJAR, EDUSMART AI\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Tools AI untuk guru dan orang tua membuat modul ajar dan soal ujian otomatis."
  },
  {
    "title": "39.000++ PRINTABLE ANAK",
    "slug": "dyari-39000-printable-anak",
    "price": 49000,
    "original_price": 189000,
    "badge": "MEGA BUNDLE",
    "category_id": "worksheet",
    "category_name": "Worksheet & Printable",
    "type": "MEGA BUNDLE",
    "rating": 4.9,
    "sales_count": 378,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1789790863/s8bta8r8kwixfj7jwl3d.webp",
    "access_link": "https://drive.google.com/drive/folders/1xsQ7LMcDhzeIsjdnAJ3XbKW8IO72G8ue",
    "features": "[\"Akses penuh ke seluruh materi 39.000++ PRINTABLE ANAK\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Paket worksheet dan printable terlengkap untuk melatih motorik anak."
  },
  {
    "title": "LATIHAN MENULIS AL-QUR'AN",
    "slug": "dyari-latihan-menulis-al-quran",
    "price": 25000,
    "original_price": 50000,
    "badge": "BELAJAR HIJAIYAH",
    "category_id": "produk-islami",
    "category_name": "Produk Islami",
    "type": "WEB INTERAKTIF",
    "rating": 4.8,
    "sales_count": 129,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1786863962/fojij9enfv3hnnelb5qz.png",
    "access_link": "https://sites.google.com/view/mizyan-murojaah/home",
    "features": "[\"Akses penuh ke seluruh materi LATIHAN MENULIS AL-QUR'AN\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Modul latihan menulis huruf hijaiyah dan kaligrafi Al-Qur'an secara terpandu."
  },
  {
    "title": "VIDEO TUTORIAL LYNK.ID",
    "slug": "dyari-video-tutorial-lynkid",
    "price": 29000,
    "original_price": 79000,
    "badge": "PANDUAN PRAKTIS",
    "category_id": "aset-premium",
    "category_name": "Mega Bundle & Canva",
    "type": "VIDEO KURSUS",
    "rating": 4.8,
    "sales_count": 147,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1786863216/mxmsvspdqblcrb6er9cx.png",
    "access_link": "https://sites.google.com/view/adam-akmal-arsyad/tutorial",
    "features": "[\"Akses penuh ke seluruh materi VIDEO TUTORIAL LYNK.ID\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Panduan lengkap membuat toko bio link dan jualan produk digital di Lynk.id."
  },
  {
    "title": "TOOLS SMART QUIZ",
    "slug": "dyari-tools-smart-quiz",
    "price": 29000,
    "original_price": 69000,
    "badge": "AI GENERATOR",
    "category_id": "administrasi-sekolah",
    "category_name": "Administrasi Guru",
    "type": "GEMINI AI",
    "rating": 4.8,
    "sales_count": 118,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788179109/hz4kerdiwudeix1ao3nh.jpg",
    "access_link": "https://gemini.google.com/share/867599217d97",
    "features": "[\"Akses penuh ke seluruh materi TOOLS SMART QUIZ\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Generator kuis otomatis berbasis AI untuk berbagai mata pelajaran."
  },
  {
    "title": "GAME QUIZ ISLAMI",
    "slug": "dyari-game-quiz-islami",
    "price": 25000,
    "original_price": 50000,
    "badge": "ISLAMI CILIK",
    "category_id": "produk-islami",
    "category_name": "Produk Islami",
    "type": "GAME WEB",
    "rating": 4.9,
    "sales_count": 191,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1786853446/y2jki1ehlndx5yxzy6fz.png",
    "access_link": "https://sites.google.com/view/game-islami-cilik/home",
    "features": "[\"Akses penuh ke seluruh materi GAME QUIZ ISLAMI\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Kuis interaktif seputar sejarah dan pengetahuan dasar Islam untuk anak."
  },
  {
    "title": "TOOLS SKRIP DAN VIOCE OVER",
    "slug": "dyari-tools-skrip-dan-voice-over",
    "price": 29000,
    "original_price": 75000,
    "badge": "AI CREATOR",
    "category_id": "produktifitas-ai",
    "category_name": "Produktifitas AI",
    "type": "GEMINI AI",
    "rating": 4.9,
    "sales_count": 224,
    "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788177819/eb3ygqjr6hvwiltntgnv.jpg",
    "access_link": "https://gemini.google.com/share/71487a50d705",
    "features": "[\"Akses penuh ke seluruh materi TOOLS SKRIP DAN VIOCE OVER\",\"Format digital praktis dan sangat mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai di berbagai perangkat\"]",
    "license_required": false,
    "description": "Tools AI pembuat naskah video konten dan sulih suara (Voice Over) otomatis."
  }
];

    const validSlugs = productsData.map(p => p.slug);
    // Hapus produk lama yang bukan bagian dari 24 produk resmi
    await query('DELETE FROM products WHERE slug NOT = ANY($1::text[])', [validSlugs]);

    for (const p of productsData) {
      const prodCheck = await query('SELECT id FROM products WHERE slug = $1', [p.slug]);
      if (prodCheck.rows.length === 0) {
        await query(
          `INSERT INTO products (
            title, slug, price, original_price, badge, category_id, category_name, 
            type, rating, sales_count, image, access_link, features, license_required, description
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
          [
            p.title, p.slug, p.price, p.original_price, p.badge, p.category_id, p.category_name,
            p.type, p.rating, p.sales_count, p.image, p.access_link, p.features, p.license_required, p.description
          ]
        );
      } else {
        await query(
          `UPDATE products SET
            title = $1, price = $2, original_price = $3, badge = $4, category_id = $5,
            category_name = $6, type = $7, image = $8, access_link = $9, description = $10
          WHERE slug = $11`,
          [
            p.title, p.price, p.original_price, p.badge, p.category_id,
            p.category_name, p.type, p.image, p.access_link, p.description, p.slug
          ]
        );
      }
    }
    console.log(`✅ ${productsData.length} Produk Digital resmi berhasil dimasukkan ke PostgreSQL.`);

    // 5. Seed Initial Settings
    const initialSettings = {
      storeName: 'Dyari Digital Store',
      tagline: 'Katalog Produk Digital & Template Produktifitas Terpercaya',
      whatsapp: '6282330626054',
      qrisUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
      bankTransfer: {
        bankName: 'BCA',
        accountNumber: '8210984123',
        accountName: 'Tony Anggoro'
      }
    };

    await query(
      `INSERT INTO settings (key, value)
       VALUES ('store_config', $1)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [JSON.stringify(initialSettings)]
    );
    console.log('✅ Pengaturan toko berhasil disimpan.');

    console.log('🎉 Seeding database dyaridb selesai dengan sempurna!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Gagal menjalankan seeding database:', err);
    process.exit(1);
  }
}

runSeed();
