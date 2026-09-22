# 🚀 PANDUAN DEPLOY MULTI-APLIKASI DI VPS UBUNTU 24.04
**Domain:** `dyariapp.my.id`  
**Folder Khusus:** `/var/www/dyariapp.my.id`  
**Stack:** React (Vite) + Node.js (Express) + PostgreSQL (`dyaridb`) + Nginx (Server Block Mandiri)  

> [!IMPORTANT]
> **Aman untuk VPS Multi-Aplikasi**:
> Panduan ini dirancang khusus agar **TIDAK MENGGANGGU atau menimpa aplikasi yang sudah berjalan** di VPS Anda:
> - Folder dibuat terpisah di `/var/www/dyariapp.my.id`.
> - Database & user PostgreSQL memiliki nama khusus (`dyaridb` & `dyariuser`).
> - Nginx menggunakan file konfigurasi tersendiri (`dyariapp.my.id`) tanpa menghapus konfigurasi aplikasi lama.
> - Proses PM2 menggunakan nama unik `dyari-api`.

---

## 📌 LANGKAH 1: Login ke VPS & Cek Port yang Sedang Digunakan
Buka Terminal/PowerShell di komputer Anda:
```bash
ssh root@IP_VPS_ANDA
```

Cek port mana saja yang sedang dipakai oleh aplikasi Anda yang satunya:
```bash
sudo ss -tulpn | grep LISTEN
```
*(Lihat apakah port `5000` sudah dipakai atau belum. Jika port 5000 sudah dipakai aplikasi lain, kita tinggal gunakan port lain misalnya `5001` atau `5050`)*.

---

## 📌 LANGKAH 2: Pastikan Komponen Terpasang (Tanpa Merusak yang Lama)
Jika di VPS Anda sudah ada Node.js, Git, Nginx, atau PostgreSQL, sistem hanya akan memperbarui atau melewatinya secara aman:

```bash
sudo apt update
sudo apt install -y curl git build-essential ufw nginx postgresql postgresql-contrib
sudo npm install -g pm2
```

---

## 📌 LANGKAH 3: Buat Database Terpisah (`dyaridb`)
Database ini berdiri sendiri dan tidak akan menyentuh database aplikasi lain:

```bash
sudo -u postgres psql
```
Di dalam konsol PostgreSQL, ketik:
```sql
CREATE USER dyariuser WITH PASSWORD 'DyariSecretPass2026!';
CREATE DATABASE dyaridb OWNER dyariuser;
GRANT ALL PRIVILEGES ON DATABASE dyaridb TO dyariuser;
\q
```

---

## 📌 LANGKAH 4: Siapkan Folder Khusus & Clone Repository
Kita gunakan folder spesifik `/var/www/dyariapp.my.id`:

```bash
# Buat folder khusus untuk Dyari
sudo mkdir -p /var/www/dyariapp.my.id
sudo chown -R $USER:$USER /var/www/dyariapp.my.id

# Clone repo GitHub Anda ke folder tersebut
git clone https://github.com/studioentaf-bit/dyariinapp.git /var/www/dyariapp.my.id

# Masuk ke folder aplikasi Dyari
cd /var/www/dyariapp.my.id
```

---

## 📌 LANGKAH 5: Build Frontend React
Di dalam `/var/www/dyariapp.my.id`:

```bash
npm install
npm run build
```
*(File tampilan web akan ter-compile rapi ke folder `/var/www/dyariapp.my.id/dist`)*.

---

## 📌 LANGKAH 6: Setup Backend & Seeding Produk Digital
Masuk ke subfolder `server`:

```bash
cd /var/www/dyariapp.my.id/server
npm install

# Buat file konfigurasi .env
# (Catatan: Jika port 5000 sudah dipakai aplikasi lain, ganti PORT=5000 menjadi PORT=5050)
cat << 'EOF' > .env
PORT=5000
NODE_ENV=production
PGHOST=localhost
PGPORT=5432
PGDATABASE=dyaridb
PGUSER=dyariuser
PGPASSWORD=DyariSecretPass2026!
JWT_SECRET=dyari-secret-production-key-2026
ADMIN_EMAIL=admin@dyari.id
ADMIN_PASSWORD=admin123
EOF

# Jalankan inisialisasi tabel dan masukkan 12 produk digital
npm run seed
```

---

## 📌 LANGKAH 7: Jalankan Backend dengan PM2
Kembali ke root folder Dyari:

```bash
cd /var/www/dyariapp.my.id

# Jalankan service Dyari dengan nama khusus 'dyari-api'
pm2 start deploy/ecosystem.config.cjs

# Simpan daftar proses PM2 agar aplikasi lama dan Dyari sama-sama auto-start saat VPS reboot
pm2 save
```
Ketik `pm2 list` untuk melihat daftar aplikasi Anda. Anda akan melihat aplikasi lama Anda dan `dyari-api` berjalan berdampingan dengan damai!

---

## 📌 LANGKAH 8: Pasang Konfigurasi Nginx (Virtual Host Mandiri)
Kita hanya membuat file konfigurasi baru khusus `dyariapp.my.id` **tanpa menghapus file konfigurasi aplikasi lain**:

```bash
# 1. Salin konfigurasi nginx ke sites-available
sudo cp /var/www/dyariapp.my.id/deploy/nginx.conf /etc/nginx/sites-available/dyariapp.my.id

# (Catatan: Jika tadi Anda mengganti PORT ke 5050, buka file dan ubah port proxy_pass):
# sudo nano /etc/nginx/sites-available/dyariapp.my.id
# ganti: proxy_pass http://127.0.0.1:5000; -> menjadi port yang Anda tentukan

# 2. Aktifkan konfigurasi untuk dyariapp.my.id
sudo ln -sf /etc/nginx/sites-available/dyariapp.my.id /etc/nginx/sites-enabled/

# 3. Uji apakah sintaks Nginx valid
sudo nginx -t

# 4. Jika muncul 'syntax is ok', reload Nginx tanpa memutus koneksi aplikasi lain
sudo systemctl reload nginx
```

> **Bagaimana Nginx Bekerja?**  
> Nginx membaca nama domain yang diminta pengunjung:
> - Pengunjung membuka `domain-lama.com` -> Nginx mengarahkan ke aplikasi lama Anda.
> - Pengunjung membuka `dyariapp.my.id` -> Nginx mengarahkan ke `/var/www/dyariapp.my.id`.
> Keduanya berjalan 100% independen tanpa saling mengganggu.

---

## 📌 LANGKAH 9: Pastikan DNS di Cloudflare
1. Buka [Cloudflare](https://dash.cloudflare.com) untuk domain **dyariapp.my.id**.
2. Menu **DNS**:
   - **Type A**: `@` -> `IP_VPS_ANDA` (Status: **Proxied / Awan Oranye** ✅)
   - **Type CNAME**: `www` -> `dyariapp.my.id` (Status: **Proxied / Awan Oranye** ✅)
3. Menu **SSL/TLS**:
   - Set ke **Full** (atau **Flexible**).

---

## 📌 LANGKAH 10: Akses & Kelola Website
Buka browser Anda:
👉 **`https://dyariapp.my.id`**

- **Login Admin**: `admin@dyari.id` / `admin123`
- **Cek Status Database API**: `https://dyariapp.my.id/api/health`

Selesai! Kedua aplikasi kini hidup berdampingan secara aman di VPS Anda.
