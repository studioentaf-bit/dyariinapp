# 🌿 Dyari Store (`dyari.in` / `dyariapp.my.id`)

Platform digital store & tools creator AI modern dengan integrasi transaksi instan QRIS, manajemen stok riil, lisensi dinamis, dan Story Generator AI.

---

## 📌 Dokumentasi Utama & Aturan Pengembangan
Silakan baca dokumen master:
👉 **[PROJECT_MASTER_LOG.md](./PROJECT_MASTER_LOG.md)**

Dokumen tersebut memuat:
1. **Aturan Mutlak Pengembangan:** Strict scope restriction (hanya mengubah apa yang diminta user tanpa merombak fitur existing).
2. **Arsitektur Sistem & Spesifikasi:** Frontend (React + Vite), Backend (Express + PostgreSQL), PM2, dan Nginx.
3. **Protected Modules:** Instant Checkout, Antrian Order, Stok Riil, Lisensi Dinamis, dan Story Generator.
4. **Log Update (Changelog):** Riwayat komprehensif seluruh update dari awal hingga versi terbaru.
5. **Panduan Operasional Git & VPS Deployment:** Perintah 1 baris update script di VPS Ubuntu.

---

## 🚀 Perintah Cepat Deploy Update di VPS
```bash
cd /var/www/dyariapp.my.id && git fetch origin main && git checkout origin/main -- deploy/update.sh && bash deploy/update.sh
```
