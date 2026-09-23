import bcrypt from 'bcryptjs';
import pool, { query } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
            "id": "semua",
            "name": "Semua Kategori",
            "slug": "semua",
            "icon": "Sparkles",
            "description": "Semua produk pilihan terbaik"
      },
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

    // 4. Seed Official 24 Products (Clean & replace excess products)
    const productsData = [
      {
            "title": "CERDAS CERMAT",
            "slug": "dyari-cerdas-cermat",
            "price": 25000,
            "original_price": 50000,
            "badge": "GAME SERU",
            "category_id": "game-anak",
            "category_name": "Game Edukasi Anak",
            "type": "GAME WEB",
            "rating": 4.8,
            "sales_count": 95,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1786852283/zesddnrydguxbfschwrd.png",
            "access_link": "https://sites.google.com/view/game-cerdas-cermat/home",
            "features": "[\"Akses penuh ke seluruh materi CERDAS CERMAT\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Game kuis seru untuk menguji pengetahuan dan ketangkasan berpikir anak."
      },
      {
            "title": "GAME EDUKASI PREMIUM",
            "slug": "dyari-game-edukasi-premium",
            "price": 25000,
            "original_price": 50000,
            "badge": "INTERAKTIF",
            "category_id": "game-anak",
            "category_name": "Game Edukasi Anak",
            "type": "GAME WEB",
            "rating": 4.9,
            "sales_count": 106,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1789793410/mtjy0szyt4k7qacd0ztw.webp",
            "access_link": "https://www.digitalprodukno1seindonesia.my.id/game-edukasi",
            "features": "[\"Akses penuh ke seluruh materi GAME EDUKASI PREMIUM\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Kumpulan game edukasi buat anak mulai dari pintar ceria, teka teki, smart learning, dan lain-lain."
      },
      {
            "title": "AI SCRIPT & VO",
            "slug": "dyari-ai-script-vo",
            "price": 29000,
            "original_price": 65000,
            "badge": "HOT AI",
            "category_id": "produktifitas-ai",
            "category_name": "Produktifitas AI",
            "type": "PROMPT AI",
            "rating": 4.8,
            "sales_count": 117,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788177819/eb3ygqjr6hvwiltntgnv.jpg",
            "access_link": "https://gemini.google.com/share/71487a50d705?hl=id-ID",
            "features": "[\"Akses penuh ke seluruh materi AI SCRIPT & VO\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Pembuat script konten otomatis berbasis AI"
      },
      {
            "title": "VIDEO ANIMASI BAHASA INGGRIS",
            "slug": "dyari-video-animasi-bahasa-inggris",
            "price": 29000,
            "original_price": 59000,
            "badge": "POPULER",
            "category_id": "aset-premium",
            "category_name": "Aset Premium",
            "type": "AKSES MEMBER",
            "rating": 4.9,
            "sales_count": 128,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1789783956/m4uef5oowmkjqxzo4smo.webp",
            "access_link": "https://drive.google.com/file/d/13J6yOoiUiIwp7sK2r-13zI36zKQuV9_9/view",
            "features": "[\"Akses penuh ke seluruh materi VIDEO ANIMASI BAHASA INGGRIS\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "48 Video Cerita Animasi Bahasa Inggris. Bisa banget buat anak belajar bahasa inggris & nambah pengetahuan sekaligus belajar reading & listening."
      },
      {
            "title": "Super Bundling ABCDEF 99.000 halaman",
            "slug": "dyari-super-bundling-abcdef-99000-halaman",
            "price": 29000,
            "original_price": 59000,
            "badge": "POPULER",
            "category_id": "aset-premium",
            "category_name": "Aset Premium",
            "type": "AKSES MEMBER",
            "rating": 4.8,
            "sales_count": 139,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1785851863/yoceigossbjictzjgy4q.webp",
            "access_link": "https://drive.google.com/file/d/1iCiL0ZBne2VJ66Xep4E092eBTmzDguh5/view?usp=drivesdk",
            "features": "[\"Akses penuh ke seluruh materi Super Bundling ABCDEF 99.000 halaman\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "📚 99.000+ PRODUK JUALAN DIGITAL ANAK 📚\n\n💰 BISA RESELLER • SIAP JUALAN • UNTUNG BERKALI-KALI 💰\n\n✨ ISI PRODUK SUPER LENGKAP ✨\n\n📖 Storybook Petualangan Tubuh\n📖 Storybook English\n📖 Storybook Legenda Rakyat\n📖 Storybook Fantasi\n📖 Storybook Agama Islam\n📖 Storybook Kehidupan di Desa\n📖 Storybook Kehidupan di Sekolah\n📖 Buku Cerita Anak\n\n🎮 Game Edukasi Anak\n🤖 Game Coding AI\n🕌 Game Agama Islam\n🎯 35 Game Anak SD\n🎲 15+14 Game Interaktif\n🔤 Game Alphabet & Huruf\n\n📚 350 Halaman Worksheet Anak\n🇬🇧 64 Worksheet English\n📘 56 Modul Kumon\n🧒 Anak Mandiri\n🕌 Anak Muslim\n\n💻 Koleksi Coding Anak:\n✅ 21 Coding Fun Learning\n✅ 26 Coding Level 1\n✅ 32 Coding Level 2\n✅ 55 Activity Coding\n✅ 65 Smart Coding Kids\n\n🎨 23 Animal Coloring\n🇬🇧 75 English For Kids\n🃏 Flashcard Edukasi\n📘 Sampul Buku Anak\n📖 Heyzine Storybook\n📚 Heyzine Dongeng\n🎓 7 Media Pembelajaran\n\n🌟 Cocok Untuk:\n✔ Reseller Digital\n✔ Guru & Tutor\n✔ Orang Tua\n✔ Homeschooling\n✔ Toko Online Edukasi\n\n🔥 SEKALI BELI, BISA DIJUAL KEMBALI!\n🔥 PRODUK DIGITAL SIAP PAKAI\n🔥 COCOK UNTUK BISNIS EDUKASI ANAK\n\n📲 PESAN SEKARANG!"
      },
      {
            "title": "PROMPT LKPD UNTUK SEMUA JENJANG",
            "slug": "dyari-prompt-lkpd-untuk-semua-jenjang",
            "price": 35000,
            "original_price": 75000,
            "badge": "EDUKASI GURU",
            "category_id": "administrasi-sekolah",
            "category_name": "Administrasi Guru",
            "type": "PERANGKAT GURU",
            "rating": 4.9,
            "sales_count": 150,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1789796130/zpuykfecsuqrj3ra3yim.jpg",
            "access_link": "https://drive.google.com/drive/folders/1tl2P7aGwNWBpM5XVhTWQt8g9ufFF_Tqw?usp=sharing",
            "features": "[\"Akses penuh ke seluruh materi PROMPT LKPD UNTUK SEMUA JENJANG\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Cukup Edit Prompt nya lalu ke Gemini"
      },
      {
            "title": "TULIS AL QUR'AN",
            "slug": "dyari-tulis-al-quran",
            "price": 29000,
            "original_price": 55000,
            "badge": "ISLAMI",
            "category_id": "produk-islami",
            "category_name": "Produk Islami",
            "type": "AKSES MEMBER",
            "rating": 4.8,
            "sales_count": 161,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788494843/toxp4i2txrspcwjg1ibf.png",
            "access_link": "https://sites.google.com/view/mizyan-tulis-quran/home",
            "features": "[\"Akses penuh ke seluruh materi TULIS AL QUR'AN\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "BImbingan belajar menulis Al Qur'an"
      },
      {
            "title": "Durusullughoh Arobiyah jilid 4",
            "slug": "dyari-durusullughoh-arobiyah-jilid-4",
            "price": 29000,
            "original_price": 55000,
            "badge": "ISLAMI",
            "category_id": "produk-islami",
            "category_name": "Produk Islami",
            "type": "AKSES MEMBER",
            "rating": 4.9,
            "sales_count": 172,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1785634228/wusklspvzbkwgfhrdryc.jpg",
            "access_link": "https://drive.google.com/file/d/1SzoLo9udgSnxXZnA1WK9B_6pGcT_PvXw/view?usp=drivesdk",
            "features": "[\"Akses penuh ke seluruh materi Durusullughoh Arobiyah jilid 4\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Buku belajar dasar lanjutan bahasa arab: Durusrul-Lughoh-Arobiyah jilid-4, 123 halaman. Versi digital pdf"
      },
      {
            "title": "UNDANGAN STATIC",
            "slug": "dyari-undangan-static",
            "price": 29000,
            "original_price": 59000,
            "badge": "POPULER",
            "category_id": "aset-premium",
            "category_name": "Aset Premium",
            "type": "AKSES MEMBER",
            "rating": 4.8,
            "sales_count": 183,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1789272418/i1b4qyc3fvwfhh6utpw3.png",
            "access_link": "https://drive.google.com/drive/folders/1O7hy1U1sEj1WVpT62ASpnnRyZ_qxxtYh",
            "features": "[\"Akses penuh ke seluruh materi UNDANGAN STATIC\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Menjual Undangan Static / Gambar dalam file JPG/PNG ( 1 Halaman ) dengan berbagai Design Tema yang terdapat di Link atau bisa juga Custom Design Tema."
      },
      {
            "title": "MENGHAFAL SURAH PENDEK",
            "slug": "dyari-menghafal-surah-pendek",
            "price": 29000,
            "original_price": 55000,
            "badge": "ISLAMI",
            "category_id": "produk-islami",
            "category_name": "Produk Islami",
            "type": "AKSES MEMBER",
            "rating": 4.9,
            "sales_count": 194,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1786863712/x4rr91gzki0qwz3gre5r.png",
            "access_link": "https://sites.google.com/view/mizyan-hafalan-surah/home",
            "features": "[\"Akses penuh ke seluruh materi MENGHAFAL SURAH PENDEK\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Latihan menghafal surah pendek yang dilengkapi soal untuk membantu menguatkan hafalan."
      },
      {
            "title": "ARAH KIBLLAT",
            "slug": "dyari-arah-kibllat",
            "price": 29000,
            "original_price": 55000,
            "badge": "ISLAMI",
            "category_id": "produk-islami",
            "category_name": "Produk Islami",
            "type": "AKSES MEMBER",
            "rating": 4.8,
            "sales_count": 205,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788426105/l5xmtukbdcqmnkrzgzkw.png",
            "access_link": "https://qiblafinder.withgoogle.com/intl/ms/desktop",
            "features": "[\"Akses penuh ke seluruh materi ARAH KIBLLAT\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Cari arah Kiblat, di mana-mana anda berada."
      },
      {
            "title": "VIDEO TUTORIAL LYNK.ID",
            "slug": "dyari-video-tutorial-lynkid",
            "price": 39000,
            "original_price": 79000,
            "badge": "TUTORIAL",
            "category_id": "aset-premium",
            "category_name": "Aset Premium",
            "type": "AKSES MEMBER",
            "rating": 4.9,
            "sales_count": 216,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1786863216/mxmsvspdqblcrb6er9cx.png",
            "access_link": "https://sites.google.com/view/adam-akmal-arsyad/tutorial",
            "features": "[\"Akses penuh ke seluruh materi VIDEO TUTORIAL LYNK.ID\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Tutorial lengkap seputar upload produk digital di lynk.id"
      },
      {
            "title": "AI CREATE SOAL UJIAN",
            "slug": "dyari-ai-create-soal-ujian",
            "price": 29000,
            "original_price": 65000,
            "badge": "HOT AI",
            "category_id": "produktifitas-ai",
            "category_name": "Produktifitas AI",
            "type": "PROMPT AI",
            "rating": 4.8,
            "sales_count": 227,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788179109/hz4kerdiwudeix1ao3nh.jpg",
            "access_link": "https://gemini.google.com/share/867599217d97?hl=id-ID",
            "features": "[\"Akses penuh ke seluruh materi AI CREATE SOAL UJIAN\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "AI CREATE SOAL  SD, SMP, SMA"
      },
      {
            "title": "BANK KONTEN SIAP UPLOAD",
            "slug": "dyari-bank-konten-siap-upload",
            "price": 29000,
            "original_price": 59000,
            "badge": "POPULER",
            "category_id": "aset-premium",
            "category_name": "Aset Premium",
            "type": "AKSES MEMBER",
            "rating": 4.9,
            "sales_count": 238,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1789794836/aueheigkpgujcx3c6qqs.webp",
            "access_link": "https://docs.google.com/spreadsheets/d/12lHxAjbdNQWyw6888AyGFYXUlQbzii_dK6FSMrhBfVI/edit?pli=1&gid=0#gid=0",
            "features": "[\"Akses penuh ke seluruh materi BANK KONTEN SIAP UPLOAD\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Puluhan ribu bank konten siap upload. Tinggal pilih niche mana yang sesuai."
      },
      {
            "title": "FLASH CARD",
            "slug": "dyari-flash-card",
            "price": 29000,
            "original_price": 55000,
            "badge": "ISLAMI",
            "category_id": "produk-islami",
            "category_name": "Produk Islami",
            "type": "AKSES MEMBER",
            "rating": 4.8,
            "sales_count": 249,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788495905/fafnahk4b5aaaujyrcbp.png",
            "access_link": "https://www.digitalprodukno1seindonesia.my.id/flash-card",
            "features": "[\"Akses penuh ke seluruh materi FLASH CARD\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Mengengal berbagai macam nama-nama hewan, angka, bentuk, tempat dan lain-lain"
      },
      {
            "title": "40 STORYBOOK ANAK-ANAK",
            "slug": "dyari-40-storybook-anak-anak",
            "price": 35000,
            "original_price": 70000,
            "badge": "BEST SELLER",
            "category_id": "worksheet",
            "category_name": "Worksheet & Printable",
            "type": "PRINTABLE PDF",
            "rating": 4.9,
            "sales_count": 260,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1786850821/myi5ogvp7ocnkjrio8ik.png",
            "access_link": "https://sites.google.com/view/generasi554/e-book/cerita-hewan",
            "features": "[\"Akses penuh ke seluruh materi 40 STORYBOOK ANAK-ANAK\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "40 cerita edukatif dan menarik untuk menemani anak belajar dan berimajinasi."
      },
      {
            "title": "QUIZ SAINS",
            "slug": "dyari-quiz-sains",
            "price": 25000,
            "original_price": 50000,
            "badge": "GAME SERU",
            "category_id": "game-anak",
            "category_name": "Game Edukasi Anak",
            "type": "GAME WEB",
            "rating": 4.8,
            "sales_count": 271,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788506306/byfvojycuhej91n69gn3.png",
            "access_link": "https://sites.google.com/view/game-sains/home",
            "features": "[\"Akses penuh ke seluruh materi QUIZ SAINS\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Yuk Mulai petualangan sains mu"
      },
      {
            "title": "JADWAL PIKET GENERATOR",
            "slug": "dyari-jadwal-piket-generator",
            "price": 35000,
            "original_price": 75000,
            "badge": "EDUKASI GURU",
            "category_id": "administrasi-sekolah",
            "category_name": "Administrasi Guru",
            "type": "PERANGKAT GURU",
            "rating": 4.9,
            "sales_count": 282,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1789730381/fefkvxyi9frg7spsiqs3.jpg",
            "access_link": "https://tepilayar.my.id/apps/jadwal-piket-generator/",
            "features": "[\"Akses penuh ke seluruh materi JADWAL PIKET GENERATOR\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Membuat Jadwal Piket dengan AI"
      },
      {
            "title": "WORKSHEET",
            "slug": "dyari-worksheet",
            "price": 35000,
            "original_price": 70000,
            "badge": "BEST SELLER",
            "category_id": "worksheet",
            "category_name": "Worksheet & Printable",
            "type": "PRINTABLE PDF",
            "rating": 4.8,
            "sales_count": 293,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1786167332/zzw47lzwgun7xikhahur.jpg",
            "access_link": "https://www.digitalprodukno1seindonesia.my.id/worksheet",
            "features": "[\"Akses penuh ke seluruh materi WORKSHEET\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Kumpulan worksheet anak, media belajar premium dan terlengkap"
      },
      {
            "title": "PETUALANGAN QUIZ",
            "slug": "dyari-petualangan-quiz",
            "price": 25000,
            "original_price": 50000,
            "badge": "INTERAKTIF",
            "category_id": "game-anak",
            "category_name": "Game Edukasi Anak",
            "type": "GAME WEB",
            "rating": 4.9,
            "sales_count": 104,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788571530/yg96vgud7419vthngmx5.png",
            "access_link": "https://sites.google.com/view/petualangantekateki/home",
            "features": "[\"Akses penuh ke seluruh materi PETUALANGAN QUIZ\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Jawab Pertanyaan dengan benar untuk mendapatkan kunci pembuka level berikutnya"
      },
      {
            "title": "VIDEO EDUKASI",
            "slug": "dyari-video-edukasi",
            "price": 29000,
            "original_price": 59000,
            "badge": "POPULER",
            "category_id": "aset-premium",
            "category_name": "Aset Premium",
            "type": "AKSES MEMBER",
            "rating": 4.8,
            "sales_count": 115,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788136199/dvgvkv6vgytwilysfjdf.png",
            "access_link": "https://drive.google.com/drive/folders/1Rf2aXQuhSy20wbutc08tjyiRgfzJPpzL",
            "features": "[\"Akses penuh ke seluruh materi VIDEO EDUKASI\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Kumpulan cerita edukasi anak"
      },
      {
            "title": "TASBIH DIGITALL",
            "slug": "dyari-tasbih-digitall",
            "price": 29000,
            "original_price": 55000,
            "badge": "ISLAMI",
            "category_id": "produk-islami",
            "category_name": "Produk Islami",
            "type": "AKSES MEMBER",
            "rating": 4.9,
            "sales_count": 126,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788356444/ib9nqpfozz1gyv7vz4jy.jpg",
            "access_link": "https://sites.google.com/view/tasbih-mizyan/home",
            "features": "[\"Akses penuh ke seluruh materi TASBIH DIGITALL\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Tasbih digital"
      },
      {
            "title": "KALKULATOR DIET",
            "slug": "dyari-kalkulator-diet",
            "price": 29000,
            "original_price": 59000,
            "badge": "POPULER",
            "category_id": "aset-premium",
            "category_name": "Aset Premium",
            "type": "AKSES MEMBER",
            "rating": 4.8,
            "sales_count": 137,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1786862370/fidtaiz0wbe3ytfzijlk.png",
            "access_link": "https://sites.google.com/view/mizyan-kalkulator-diet/home",
            "features": "[\"Akses penuh ke seluruh materi KALKULATOR DIET\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Tools untuk membantu menghitung kalori dan membuatkan program diet untuk anda secara gratis."
      },
      {
            "title": "Worksheet dan Prompt Modern",
            "slug": "dyari-worksheet-dan-prompt-modern",
            "price": 29000,
            "original_price": 65000,
            "badge": "HOT AI",
            "category_id": "produktifitas-ai",
            "category_name": "Produktifitas AI",
            "type": "PROMPT AI",
            "rating": 4.9,
            "sales_count": 148,
            "image": "https://res.cloudinary.com/ihjm5fmn/image/upload/v1788504469/db5ecfbdubaf8vgch4gh.jpg",
            "access_link": "https://drive.google.com/drive/folders/1qNTgX6ueX5ut_bVv_-10m1I_UvEPa-QJ?usp=sharing",
            "features": "[\"Akses penuh ke seluruh materi Worksheet dan Prompt Modern\",\"Format digital praktis dan mudah digunakan\",\"Dukungan akses online & offline seumur hidup\",\"Bebas ribet langsung pakai\"]",
            "license_required": false,
            "description": "Bosan dengan lembar kerja anak yang polos dan membosankan? Saatnya beralih ke Lembar Kerja Anak Modern ! 🎨📚\n\nDikemas dengan visual warna-warni yang cerah, karakter hewan yang menggemaskan, serta tema kendaraan populer kesukaan anak-anak (seperti Truk Expedisi, Kapal, hingga Hewan Laut), koleksi worksheet ini dirancang khusus untuk melatih motorik, fokus, dan kreativitas tanpa membuat anak cepat bosan."
      }
];

    // Hapus produk lama yang tidak ada dalam daftar 24 produk resmi
    const validSlugs = productsData.map(p => p.slug);
    await query(`DELETE FROM products WHERE slug NOT = ANY($1)`, [validSlugs]);

    console.log(`Menyimpan ${productsData.length} produk resmi ke database...`);
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
