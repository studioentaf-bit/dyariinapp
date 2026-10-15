import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { categoriesData, productsData } from './defaultCatalog.js';

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

    // 4. Seed Official 24 Products (Safe insert without deleting custom products)
    for (const p of productsData) {
      const prodCheck = await query('SELECT id FROM products WHERE slug = $1', [p.slug]);
      if (prodCheck.rows.length === 0) {
        await query(
          `INSERT INTO products (
            title, slug, price, original_price, badge, category_id, category_name, 
            type, product_type, rating, sales_count, image, access_link, features, license_required, description
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
          [
            p.title, p.slug, p.price, p.original_price, p.badge, p.category_id, p.category_name,
            p.type, 'DIGITAL_PREMIUM', p.rating, p.sales_count, p.image, p.access_link, p.features, p.license_required, p.description
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
    console.log(`✅ ${productsData.length} Produk Digital resmi berhasil diverifikasi di PostgreSQL.`);

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
