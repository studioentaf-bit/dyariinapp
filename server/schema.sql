-- ========================================================
-- DYARI DIGITAL STORE - POSTGRESQL DATABASE SCHEMA
-- Database: dyaridb
-- ========================================================

-- 1. USERS & MEMBERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'member', -- 'admin', 'member'
    avatar TEXT,
    status VARCHAR(50) DEFAULT 'AKTIF', -- 'AKTIF', 'SUSPENDED'
    total_spent NUMERIC(15, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    icon VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    original_price NUMERIC(15, 2) DEFAULT 0,
    badge VARCHAR(100),
    category_id VARCHAR(100) REFERENCES categories(id) ON DELETE SET NULL,
    category_name VARCHAR(255),
    type VARCHAR(100) DEFAULT 'AKSES MEMBER', -- 'AKSES MEMBER', 'KONSULTASI / JASA', etc.
    rating NUMERIC(3, 1) DEFAULT 5.0,
    sales_count INT DEFAULT 0,
    stock_status VARCHAR(50) DEFAULT 'TERSEDIA',
    image TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    access_link TEXT,
    license_required BOOLEAN DEFAULT FALSE,
    license_duration_options JSONB DEFAULT '["Selamanya (Lifetime)", "1 Tahun", "6 Bulan", "1 Bulan"]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. LICENSES TABLE
CREATE TABLE IF NOT EXISTS licenses (
    id SERIAL PRIMARY KEY,
    license_key VARCHAR(100) UNIQUE NOT NULL,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    product_title VARCHAR(255),
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'AKTIF', -- 'AKTIF', 'KADALUARSA', 'DITANGGUHKAN'
    license_type VARCHAR(100) DEFAULT 'Personal License',
    duration_label VARCHAR(100) DEFAULT 'Selamanya (Lifetime)',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP WITH TIME ZONE, -- NULL jika Lifetime
    is_lifetime BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ORDERS TABLE (TRANSAKSI)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(100) DEFAULT 'QRIS',
    status VARCHAR(50) DEFAULT 'LUNAS', -- 'MENUNGGU_PEMBAYARAN', 'LUNAS', 'BATAL'
    proof_image TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    product_title VARCHAR(255),
    product_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    quantity INT DEFAULT 1,
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0,
    license_key VARCHAR(100)
);

-- 7. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    avatar TEXT,
    content TEXT NOT NULL,
    rating INT DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR HIGH PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_user ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
