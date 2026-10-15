#!/usr/bin/env bash
# ========================================================
# AUTO UPDATE & RE-DEPLOY SCRIPT FOR DYARI STORE ON VPS
# Domain: dyariapp.my.id
# ========================================================

set -e

APP_DIR="/var/www/dyariapp.my.id"

echo "=========================================================="
echo "🚀 MEMULAI UPDATE & DEPLOY DYARI STORE DI VPS"
echo "=========================================================="

# 1. Pastikan folder aplikasi ada
if [ ! -d "$APP_DIR" ]; then
  echo "❌ Direktori $APP_DIR tidak ditemukan!"
  echo "Pastikan Anda sudah meng-clone repository ke $APP_DIR"
  exit 1
fi

cd "$APP_DIR"

# 2. Ambil update terbaru dari GitHub
echo "📥 [1/5] Mengambil commit terbaru dari branch main..."
git stash || true
git fetch origin main
git reset --hard origin/main

# 3. Build Frontend Vite
echo "📦 [2/5] Memeriksa dependensi & build Frontend React (Vite)..."
if [ ! -d "node_modules" ] || [ package.json -nt node_modules ]; then
  npm install --no-audit --no-fund --prefer-offline || npm install --no-audit --no-fund
fi
npm run build

# 4. Update Backend Express & PostgreSQL
echo "⚙️ [3/5] Memeriksa dependensi Backend (Node.js & PG)..."
cd "$APP_DIR/server"
if [ ! -d "node_modules" ] || [ package.json -nt node_modules ]; then
  npm install --no-audit --no-fund --prefer-offline || npm install --no-audit --no-fund
else
  echo "✅ Dependensi backend sudah terpasang & mutakhir."
fi

# 5. Restart proses PM2
echo "🔄 [4/5] Me-restart proses backend PM2 (dyari-api)..."
cd "$APP_DIR"
if pm2 list | grep -q "dyari-api"; then
  pm2 restart dyari-api
else
  pm2 start deploy/ecosystem.config.cjs
fi
pm2 save

# 6. Reload Nginx (jika tersedia)
echo "🌐 [5/5] Memeriksa & reload Nginx..."
if command -v nginx >/dev/null 2>&1; then
  sudo nginx -t && sudo systemctl reload nginx || echo "⚠️ Nginx reload dilewati."
fi

echo ""
echo "=========================================================="
echo "🎉 DEPLOY UPDATE BERHASIL 100%!"
echo "----------------------------------------------------------"
echo "Status PM2 Service:"
pm2 status dyari-api
echo "----------------------------------------------------------"
echo "Silakan cek langsung di browser Anda:"
echo "👉 https://dyariapp.my.id"
echo "👉 Panel Admin: https://dyariapp.my.id/#admin"
echo "=========================================================="
