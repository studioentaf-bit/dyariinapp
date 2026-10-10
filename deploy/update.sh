#!/usr/bin/env bash
# ========================================================
# QUICK UPDATE SCRIPT FOR DYARI STORE ON VPS
# ========================================================

set -e

echo "🚀 [1/4] Mengambil kode terbaru dari GitHub (git pull)..."
cd /var/www/dyariapp.my.id || exit 1
git pull origin main

echo "📦 [2/4] Build Frontend React (Vite)..."
npm install
npm run build

echo "⚙️ [3/4] Update Backend Dependencies..."
cd /var/www/dyariapp.my.id/server
npm install

echo "🔄 [4/4] Restarting PM2 process (dyari-api)..."
cd /var/www/dyariapp.my.id
pm2 restart dyari-api || pm2 start deploy/ecosystem.config.cjs

echo "=========================================================="
echo "✅ DEPLOY UPDATE BERHASIL!"
echo "Website & Antrian Order terbaru sudah aktif di dyariapp.my.id"
echo "=========================================================="
