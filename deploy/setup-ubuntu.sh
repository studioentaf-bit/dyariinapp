#!/usr/bin/env bash
# ========================================================
# AUTO INSTALLER SCRIPT FOR UBUNTU 24.04 (DYARI STORE)
# Domain: dyariapp.my.id
# ========================================================

set -e

echo "=========================================================="
echo "🚀 MEMULAI SETUP VPS UBUNTU 24.04 UNTUK DYARIAPP.MY.ID"
echo "=========================================================="

# 1. Update & Upgrade Sistem
echo "📦 [1/6] Memperbarui paket sistem Ubuntu..."
sudo apt update && sudo apt upgrade -y

# 2. Install dependencies dasar (curl, git, ufw, nginx)
echo "📦 [2/6] Menginstal Git, Curl, Build Tools & Nginx..."
sudo apt install -y curl git build-essential ufw nginx

# 3. Install Node.js 22 LTS & PM2
echo "📦 [3/6] Menginstal Node.js 22 LTS & PM2..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 4. Install & Konfigurasi PostgreSQL
echo "📦 [4/6] Menginstal PostgreSQL Database Server..."
sudo apt install -y postgresql postgresql-contrib

# Mulai service PostgreSQL
sudo systemctl enable postgresql
sudo systemctl start postgresql

echo "🛠️ Menyiapkan Database dyaridb dan User dyariuser..."
# Silakan ganti password ini sesuai kebutuhan
DB_USER="dyariuser"
DB_PASS="DyariSecretPass2026!"
DB_NAME="dyaridb"

sudo -u postgres psql -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = '$DB_USER') THEN CREATE USER $DB_USER WITH PASSWORD '$DB_PASS'; END IF; END \$\$;"
sudo -u postgres psql -c "SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# 5. Konfigurasi Firewall (UFW)
echo "🛡️ [5/6] Mengaktifkan Firewall (SSH, HTTP, HTTPS)..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# 6. Menyiapkan Direktori Web /var/www/dyariapp.my.id
echo "📁 [6/6] Menyiapkan direktori website di /var/www/dyariapp.my.id..."
sudo mkdir -p /var/www/dyariapp.my.id
sudo chown -R $USER:$USER /var/www/dyariapp.my.id

echo ""
echo "=========================================================="
echo "🎉 SETUP DASAR VPS UBUNTU SELESAI!"
echo "Database: $DB_NAME"
echo "DB User:  $DB_USER"
echo "DB Pass:  $DB_PASS"
echo "=========================================================="
echo "Langkah selanjutnya: Clone repo GitHub Anda ke /var/www/dyariapp"
echo "Lihat panduan lengkap di file DEPLOY_GUIDE.md!"
