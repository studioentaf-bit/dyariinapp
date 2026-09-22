# Panduan Implementasi Katalog Mandiri di Website Lain (VPS Terpisah)

Paket ini dirancang untuk website yang menggunakan struktur serupa dengan Dyari (React + Vite + Node/Express PostgreSQL) di VPS terpisah.

---

## 📁 File yang Dibutuhkan

Di dalam folder `export-katalog/` ini terdapat 4 file utama:

1. **`products.js`**
   - Berisi 187 produk lengkap (gambar Cloudinary, link download, deskripsi, harga, dan fitur).
   - **Tujuan di web satunya**: Letakkan di folder `src/data/products.js`.

2. **`categories.js`**
   - Berisi 6 kategori resmi (*Game Edukasi, Produk Islami, Produktifitas AI, Administrasi Guru, Worksheet & Printable, Mega Bundle & Canva*).
   - **Tujuan di web satunya**: Letakkan di folder `src/data/categories.js`.

3. **`seed.js`**
   - Script seeder database untuk memasukkan ke-187 produk dan kategori ke PostgreSQL secara otomatis.
   - **Tujuan di web satunya**: Letakkan di folder `server/seed.js`.

4. **`products.json`**
   - Format JSON murni universal jika web Anda ingin membaca data secara mentah atau untuk keperluan API/database lain.

---

## 🚀 Cara Pemasangan di Web Baru (Step-by-Step)

### Langkah 1: Salin File ke Project Web Baru Anda

Jika Anda bekerja di laptop/komputer lokal pada repository web baru:
- Salin `products.js` ke `[FOLDER_WEB_BARU]/src/data/products.js`
- Salin `categories.js` ke `[FOLDER_WEB_BARU]/src/data/categories.js`
- Salin `seed.js` ke `[FOLDER_WEB_BARU]/server/seed.js`

Lalu commit dan push ke Git web baru Anda:
```bash
git add src/data/products.js src/data/categories.js server/seed.js
git commit -m "feat: import full 187 digital products catalog"
git push origin main
```

---

### Langkah 2: Deploy & Update di VPS Baru

Buka terminal SSH VPS web baru Anda, lalu jalankan:

```bash
# 1. Masuk ke folder web baru di VPS (sesuaikan path foldernya)
cd /var/www/nama-web-anda

# 2. Tarik update terbaru dari git
git pull origin main

# 3. Build frontend
npm run build

# 4. Masukkan seluruh produk ke PostgreSQL database
node server/seed.js

# 5. Reload proses backend PM2
pm2 reload all
```

---

### 💡 Alternatif: Jika Ingin Transfer Langsung Antar VPS via Terminal

Jika Anda tidak menggunakan Git di VPS baru dan ingin langsung mentransfer filenya dari VPS Dyari ke VPS baru:
```bash
# Jalankan dari terminal VPS Dyari:
scp /var/www/dyariapp.my.id/src/data/products.js user@IP_VPS_BARU:/var/www/nama-web-anda/src/data/
scp /var/www/dyariapp.my.id/src/data/categories.js user@IP_VPS_BARU:/var/www/nama-web-anda/src/data/
scp /var/www/dyariapp.my.id/server/seed.js user@IP_VPS_BARU:/var/www/nama-web-anda/server/
```
