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
      { id: 'semua', name: 'Semua Kategori', slug: 'semua', icon: 'Sparkles', description: 'Semua produk pilihan terbaik' },
      { id: 'template-produktifitas', name: 'Template Produktifitas', slug: 'template-produktifitas', icon: 'FileSpreadsheet', description: 'Template praktis siap pakai' },
      { id: 'produktifitas-ai', name: 'Produktifitas AI', slug: 'produktifitas-ai', icon: 'Brain', description: 'Koleksi prompt dan sistem AI' },
      { id: 'aset-premium', name: 'Aset Premium', slug: 'aset-premium', icon: 'Box', description: 'Koleksi aset grafis, video & visual' }
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

    // 4. Seed 12 Produk Resmi
    const productsData = [
      {
        title: 'Mega Bundle Video Edukasi Anak',
        slug: 'cyberton-bundle-edukasi-anak',
        price: 35000,
        original_price: 75000,
        badge: 'BEST SELLER',
        category_id: 'aset-premium',
        category_name: 'Aset Premium',
        type: 'AKSES MEMBER',
        rating: 4.9,
        sales_count: 142,
        image: 'https://lh3.googleusercontent.com/d/1PTgyE8XXopOnC9UV1HkGpI4cWRnmreIL',
        access_link: 'https://drive.google.com/drive/folders/1Rf2aXQuhSy20wbutc08tjyiRgfzJPpzL?usp=sharing',
        features: JSON.stringify(['Ratusan Template Video Animasi', 'Format Canva Siap Edit 1-Klik', 'Kualitas Full HD 1080p', 'Bebas Watermark & Hak Guna Komersial']),
        license_required: false,
        description: 'Kumpulan video animasi dan template edukasi anak format Canva dan MP4 kualitas tinggi.'
      },
      {
        title: 'AI Script & VO Generator',
        slug: 'cyberton-ai-script-vo',
        price: 29000,
        original_price: 60000,
        badge: 'HOT AI',
        category_id: 'produktifitas-ai',
        category_name: 'Produktifitas AI',
        type: 'PROMPT',
        rating: 4.9,
        sales_count: 189,
        image: 'https://lh3.googleusercontent.com/d/1lVbO_hRrl9uE_7n4vIvdC-aH_s0JmP_O',
        access_link: 'https://gemini.google.com/share/example-script-vo',
        features: JSON.stringify(['System Prompt Gemini AI & ChatGPT', 'Struktur Copywriting Emosional', 'Multi-Niche Video']),
        license_required: false,
        description: 'Sistem prompt otomatis naskah video storytelling dan voice over emosional.'
      },
      {
        title: 'AI Ide Konten & Copywriting Iklan',
        slug: 'cyberton-ai-ide-konten',
        price: 29000,
        original_price: 55000,
        badge: 'POPULER',
        category_id: 'produktifitas-ai',
        category_name: 'Produktifitas AI',
        type: 'PROMPT',
        rating: 4.8,
        sales_count: 110,
        image: 'https://lh3.googleusercontent.com/d/1lVbO_hRrl9uE_7n4vIvdC-aH_s0JmP_O',
        access_link: 'https://gemini.google.com/share/example-ide-konten',
        features: JSON.stringify(['Generator 30 Hari Ide Konten', 'Hook Copywriting Viral', 'Script Iklan Konversi Tinggi']),
        license_required: false,
        description: 'Ribuan formula prompt AI untuk merancang ide konten tanpa kehabisan ide.'
      },
      {
        title: 'AI Create Soal Ujian & Kuis Otomatis',
        slug: 'cyberton-ai-soal-ujian',
        price: 35000,
        original_price: 70000,
        badge: 'GURU & EDUKASI',
        category_id: 'produktifitas-ai',
        category_name: 'Produktifitas AI',
        type: 'PROMPT',
        rating: 4.9,
        sales_count: 95,
        image: 'https://lh3.googleusercontent.com/d/1w62p3yQ-tV4w91jC5441-0s-wGgXk4zN',
        access_link: 'https://gemini.google.com/share/example-soal-ujian',
        features: JSON.stringify(['Pembuat Soal Pilihan Ganda & Essay', 'Kunci Jawaban & Pembahasan Lengkap', 'Standar Kurikulum Merdeka']),
        license_required: false,
        description: 'Alat bantu pendidik menyusun bank soal ujian dalam hitungan detik.'
      },
      {
        title: '700+ Produk Digital Library Complete',
        slug: 'cyberton-700-produk-digital',
        price: 29000,
        original_price: 99000,
        badge: 'MEGA BUNDLE',
        category_id: 'aset-premium',
        category_name: 'Aset Premium',
        type: 'AKSES MEMBER',
        rating: 5.0,
        sales_count: 245,
        image: 'https://lh3.googleusercontent.com/d/1i1n4kH9B0GqKj2rY3f3gQ-zXkL9vW1aB',
        access_link: 'https://drive.google.com/drive/folders/1700PlusProdukDigitalFolderId?usp=sharing',
        features: JSON.stringify(['700+ File Produk Digital Terkurasi', 'PLR & MRR Re-sell Rights', 'Akses Cloud Selamanya']),
        license_required: false,
        description: 'Perpustakaan digital raksasa berisi ratusan produk digital siap jual kembali.'
      },
      {
        title: '3000+ Template Desain Instagram & Canva',
        slug: 'cyberton-3000-template-canva',
        price: 29000,
        original_price: 65000,
        badge: 'DESAIN',
        category_id: 'aset-premium',
        category_name: 'Aset Premium',
        type: 'AKSES MEMBER',
        rating: 4.8,
        sales_count: 178,
        image: 'https://lh3.googleusercontent.com/d/1A2b3C4d5E6f7G8h9I0j-kLmNoPqRsTuV',
        access_link: 'https://drive.google.com/drive/folders/13000TemplateCanvaFolderId?usp=sharing',
        features: JSON.stringify(['3000+ Format Feed, Story, Carousel', 'Editable Canva 100%', 'Aneka Niche Bisnis']),
        license_required: false,
        description: 'Paket terlengkap template Canva untuk branding bisnis dan sosial media.'
      },
      {
        title: 'Ribuan Bank Konten Viral Medsos',
        slug: 'cyberton-bank-konten-viral',
        price: 29000,
        original_price: 59000,
        badge: 'VIRAL',
        category_id: 'template-produktifitas',
        category_name: 'Template Produktifitas',
        type: 'AKSES MEMBER',
        rating: 4.9,
        sales_count: 164,
        image: 'https://lh3.googleusercontent.com/d/1Z9y8x7w6v5u4t3s2r1q-pOnMlKjIhGfE',
        access_link: 'https://drive.google.com/drive/folders/1BankKontenViralFolderId?usp=sharing',
        features: JSON.stringify(['Video Mentahan Estetik HD', 'Template Naskah Konten Viral', 'Kumpulan Audio Trending']),
        license_required: false,
        description: 'Bank konten video tanpa wajah dan footage siap pakai untuk konten viral harian.'
      },
      {
        title: 'Aplikasi Kasir & Pembukuan Excel / Sheets',
        slug: 'cyberton-kasir-pembukuan-sheets',
        price: 39000,
        original_price: 85000,
        badge: 'UMKM',
        category_id: 'template-produktifitas',
        category_name: 'Template Produktifitas',
        type: 'AKSES MEMBER',
        rating: 4.9,
        sales_count: 88,
        image: 'https://lh3.googleusercontent.com/d/1M2n3O4p5Q6r7S8t9U0v-wXyZaBcDeFgH',
        access_link: 'https://docs.google.com/spreadsheets/d/1AplikasiKasirTemplateSheetsMaster/edit?usp=sharing',
        features: JSON.stringify(['Laporan Laba Rugi Otomatis', 'Manajemen Stok & Kasir', 'Kompatibel Google Sheets & Excel']),
        license_required: true,
        description: 'Sistem pembukuan toko dan kasir otomatis tanpa biaya bulanan aplikasi.'
      },
      {
        title: 'Template Notion All-in-One Life Planner',
        slug: 'cyberton-notion-life-planner',
        price: 35000,
        original_price: 75000,
        badge: 'PRODUKTIF',
        category_id: 'template-produktifitas',
        category_name: 'Template Produktifitas',
        type: 'AKSES MEMBER',
        rating: 4.8,
        sales_count: 73,
        image: 'https://lh3.googleusercontent.com/d/1I2j3K4l5M6n7O8p9Q0r-sTuVwXyZaBcD',
        access_link: 'https://notion.so/dyari-workspace/Life-Planner-Master-Template',
        features: JSON.stringify(['Daily Planner & Habit Tracker', 'Financial Tracker Bulanan', 'Project & Task Management']),
        license_required: false,
        description: 'Template Notion terstruktur untuk mengatur keuangan, kebiasaan, dan tujuan hidup.'
      },
      {
        title: 'Source Code Website Portofolio & Toko Online',
        slug: 'cyberton-source-code-web',
        price: 49000,
        original_price: 120000,
        badge: 'DEVELOPER',
        category_id: 'aset-premium',
        category_name: 'Aset Premium',
        type: 'AKSES MEMBER',
        rating: 4.9,
        sales_count: 52,
        image: 'https://lh3.googleusercontent.com/d/1E2f3G4h5I6j7K8l9M0n-oPqRsTuVwXyZ',
        access_link: 'https://github.com/dyari-templates/web-portfolio-starter',
        features: JSON.stringify(['Full Source Code React + Tailwind', 'Clean Architecture & Responsive', 'Siap Deploy ke Vercel / VPS']),
        license_required: true,
        description: 'Source code template website modern dan cepat siap pakai untuk portofolio dan toko.'
      },
      {
        title: 'Audio Kursus: Mindset Digital Creator Sukses',
        slug: 'cyberton-audio-kursus-creator',
        price: 29000,
        original_price: 55000,
        badge: 'AUDIO',
        category_id: 'template-produktifitas',
        category_name: 'Template Produktifitas',
        type: 'AKSES MEMBER',
        rating: 4.7,
        sales_count: 67,
        image: 'https://lh3.googleusercontent.com/d/1U2v3W4x5Y6z7A8b9C0d-eFgHiJkLmNoP',
        access_link: 'https://drive.google.com/drive/folders/1AudioKursusCreatorMindset?usp=sharing',
        features: JSON.stringify(['12 Episode Podcast Premium', 'Bisa Didengar Offline MP3', 'Workbook Strategi Aksi']),
        license_required: false,
        description: 'Seri audio pembelajaran mentalitas, konsistensi dan monetisasi produk digital.'
      },
      {
        title: 'Konsultasi 1-on-1 Strategi Produk Digital (30 Menit)',
        slug: 'cyberton-konsultasi-strategi',
        price: 99000,
        original_price: 199000,
        badge: 'VIP PRIVATE',
        category_id: 'template-produktifitas',
        category_name: 'Template Produktifitas',
        type: 'KONSULTASI / JASA',
        rating: 5.0,
        sales_count: 31,
        image: 'https://lh3.googleusercontent.com/d/1K2l3M4n5O6p7Q8r9S0t-uVwXyZaBcDeF',
        access_link: 'https://wa.me/6281234567890?text=Halo%20Dyari,%20saya%20sudah%20order%20Konsultasi%201-on-1',
        features: JSON.stringify(['Sesi Privat Google Meet 30 Menit', 'Bedah Ide Produk & Funnel Penjualan', 'Action Plan Pasca Sesi']),
        license_required: false,
        description: 'Sesi konsultasi intensif bersama tim Dyari untuk memvalidasi ide dan meluncurkan produk digital.'
      }
    ];

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
      }
    }
    console.log('✅ Ke-12 Produk Digital resmi berhasil dimasukkan ke PostgreSQL.');

    // 5. Seed Initial Settings
    const initialSettings = {
      storeName: 'Dyari Digital Store',
      tagline: 'Katalog Produk Digital & Template Produktifitas Terpercaya',
      whatsapp: '6281234567890',
      qrisUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
      bankTransfer: {
        bankName: 'BCA',
        accountNumber: '1234567890',
        accountName: 'DYARI DIGITAL'
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
