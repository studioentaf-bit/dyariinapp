import express from 'express';
import { query } from '../db.js';
import { authenticateToken } from './auth.js';
import { categoriesData, productsData } from '../defaultCatalog.js';

const router = express.Router();

// High-Performance In-Memory Cache with TTL (2 minutes)
const productsCache = new Map();
const CACHE_TTL_MS = 2 * 60 * 1000;

export const clearProductsCache = () => {
  productsCache.clear();
};

// Auto-seed missing official catalog products to guarantee 100% catalog availability
const ensureDefaultCatalog = async () => {
  try {
    for (const cat of categoriesData) {
      await query(
        `INSERT INTO categories (id, name, slug, icon, description)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [cat.id, cat.name, cat.slug, cat.icon || '', cat.description || '']
      );
    }

    for (const p of productsData) {
      const prodType = p.product_type || (
        p.type === 'LISENSI' || p.category_id === 'tools-ai' || p.license_required
          ? 'LICENSE_TOOL'
          : (p.type === 'AKSES PREMIUM' || p.category_id === 'aplikasi' ? 'APPS_PREMIUM' : 'DIGITAL_PREMIUM')
      );

      await query(
        `INSERT INTO products (
          title, slug, price, original_price, badge, category_id, category_name,
          type, product_type, rating, sales_count, image, access_link, features,
          license_required, description, is_active, show_on_web, show_on_app
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, TRUE, TRUE, TRUE)
        ON CONFLICT (slug) DO NOTHING`,
        [
          p.title, p.slug, p.price, p.original_price || p.price, p.badge || '',
          p.category_id, p.category_name, p.type || 'AKSES MEMBER', prodType,
          p.rating || 5.0, p.sales_count || 0, p.image || '', p.access_link || '',
          typeof p.features === 'string' ? p.features : JSON.stringify(p.features || []),
          !!p.license_required, p.description || ''
        ]
      );
    }
  } catch (err) {
    console.warn('Notice: ensureDefaultCatalog:', err.message);
  }
};

// Auto-migrate columns for product_type, account_stock, stock_count, app_price, and platform visibility
const ensureStockColumns = async () => {
  try {
    await query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS product_type VARCHAR(100) DEFAULT 'APPS_PREMIUM',
      ADD COLUMN IF NOT EXISTS account_stock JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS stock_count INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS app_price NUMERIC DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS show_on_web BOOLEAN DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS show_on_app BOOLEAN DEFAULT TRUE;
    `);

    // Backfill NULL product_type
    await query(`
      UPDATE products 
      SET product_type = CASE 
        WHEN type = 'LISENSI' OR category_id = 'tools-ai' OR license_required = TRUE THEN 'LICENSE_TOOL'
        WHEN type = 'AKSES PREMIUM' OR category_id = 'aplikasi' OR title ILIKE '%gemini%' OR title ILIKE '%capcut%' OR title ILIKE '%canva%' OR title ILIKE '%netflix%' THEN 'APPS_PREMIUM'
        ELSE 'DIGITAL_PREMIUM'
      END
      WHERE product_type IS NULL OR product_type = '';
    `);

    await ensureDefaultCatalog();
  } catch (err) {
    console.warn('Notice: ensureStockColumns migration:', err.message);
  }
};
ensureStockColumns();

// GET /api/products (Public list with in-memory caching)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const cacheKey = `list_${category || 'all'}_${search || 'all'}`;
    const cached = productsCache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return res.json({ products: cached.data, cached: true });
    }

    let sql = 'SELECT * FROM products WHERE is_active = TRUE';
    const params = [];

    if (category && category !== 'semua') {
      params.push(category);
      sql += ` AND category_id = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    sql += ' ORDER BY id DESC';
    const result = await query(sql, params);

    // Save to cache for subsequent visitors
    productsCache.set(cacheKey, {
      data: result.rows,
      timestamp: Date.now()
    });

    res.json({ products: result.rows });
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ message: 'Gagal mengambil data produk.' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const isNum = !isNaN(parseInt(id, 10));
    const sql = isNum 
      ? 'SELECT * FROM products WHERE id = $1' 
      : 'SELECT * FROM products WHERE slug = $1';
    
    const result = await query(sql, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }
    res.json({ product: result.rows[0] });
  } catch (error) {
    console.error('Fetch single product error:', error);
    res.status(500).json({ message: 'Gagal mengambil detail produk.' });
  }
});

// POST /api/products (Admin create)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Hanya admin yang memiliki izin menambah produk.' });
    }

    const {
      title, slug, price, original_price, badge, category_id, category_name,
      type, product_type, image, access_link, features, license_required, description,
      account_stock, stock_count,
      app_price, show_on_web, show_on_app
    } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({ message: 'Judul produk dan harga wajib diisi.' });
    }

    let autoSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!autoSlug) autoSlug = `prod-${Date.now()}`;

    // Pastikan slug unik
    const checkSlug = await query('SELECT id FROM products WHERE slug = $1', [autoSlug]);
    if (checkSlug.rows.length > 0) {
      autoSlug = `${autoSlug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    // Verifikasi validitas category_id untuk mencegah error foreign key
    let validCatId = category_id || null;
    if (validCatId) {
      const catCheck = await query('SELECT id FROM categories WHERE id = $1', [validCatId]);
      if (catCheck.rows.length === 0) {
        try {
          await query(
            `INSERT INTO categories (id, name, slug, description)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (id) DO NOTHING`,
            [validCatId, category_name || validCatId, validCatId, 'Kategori ' + (category_name || validCatId)]
          );
        } catch (_) {
          validCatId = null;
        }
      }
    }

    const result = await query(
      `INSERT INTO products (
        title, slug, price, original_price, badge, category_id, category_name,
        type, product_type, image, access_link, features, license_required, description,
        account_stock, stock_count,
        app_price, show_on_web, show_on_app
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *`,
      [
        title, autoSlug, price, original_price || price, badge || '',
        validCatId, category_name || 'Aset Premium',
        type || 'AKSES MEMBER', product_type || 'APPS_PREMIUM', image || '', access_link || '',
        JSON.stringify(features || []), !!license_required, description || '',
        account_stock ? JSON.stringify(account_stock) : '[]',
        stock_count !== undefined && stock_count !== null ? Number(stock_count) : 0,
        app_price !== undefined && app_price !== null && app_price !== '' ? Number(app_price) : null,
        show_on_web !== undefined ? Boolean(show_on_web) : true,
        show_on_app !== undefined ? Boolean(show_on_app) : true
      ]
    );

    clearProductsCache();
    res.status(201).json({ message: 'Produk berhasil ditambahkan!', product: result.rows[0] });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Gagal menambahkan produk baru: ' + (error.message || error) });
  }
});

// PUT /api/products/:id (Admin update)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Hanya admin yang dapat memperbarui produk.' });
    }

    const { id } = req.params;
    const {
      title, price, original_price, badge, category_id, category_name,
      type, product_type, image, access_link, features, license_required, description, is_active,
      account_stock, stock_count,
      app_price, show_on_web, show_on_app
    } = req.body;

    let validCatId = category_id;
    if (validCatId) {
      const catCheck = await query('SELECT id FROM categories WHERE id = $1', [validCatId]);
      if (catCheck.rows.length === 0) {
        try {
          await query(
            `INSERT INTO categories (id, name, slug, description)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (id) DO NOTHING`,
            [validCatId, category_name || validCatId, validCatId, 'Kategori ' + (category_name || validCatId)]
          );
        } catch (_) {
          validCatId = null;
        }
      }
    }

    const isNum = !isNaN(parseInt(id, 10)) && /^\d+$/.test(id.toString());
    const whereClause = isNum ? 'WHERE id = $20' : 'WHERE slug = $20';

    const result = await query(
      `UPDATE products SET
        title = COALESCE($1, title),
        price = COALESCE($2, price),
        original_price = COALESCE($3, original_price),
        badge = COALESCE($4, badge),
        category_id = COALESCE($5, category_id),
        category_name = COALESCE($6, category_name),
        type = COALESCE($7, type),
        product_type = COALESCE($8, product_type),
        image = COALESCE($9, image),
        access_link = COALESCE($10, access_link),
        features = COALESCE($11, features),
        license_required = COALESCE($12, license_required),
        description = COALESCE($13, description),
        is_active = COALESCE($14, is_active),
        account_stock = CASE WHEN $15::jsonb IS NOT NULL THEN $15::jsonb ELSE account_stock END,
        stock_count = COALESCE($16, stock_count),
        app_price = CASE WHEN $17::text = 'CLEAR' THEN NULL WHEN $17::numeric IS NOT NULL THEN $17::numeric ELSE app_price END,
        show_on_web = COALESCE($18, show_on_web),
        show_on_app = COALESCE($19, show_on_app),
        updated_at = CURRENT_TIMESTAMP
       ${whereClause}
       RETURNING *`,
      [
        title, price, original_price, badge, validCatId, category_name,
        type, product_type, image, access_link, features ? JSON.stringify(features) : null,
        license_required, description, is_active,
        account_stock !== undefined ? JSON.stringify(account_stock) : null,
        stock_count !== undefined ? Number(stock_count) : null,
        app_price !== undefined ? (app_price === null || app_price === '' ? 'CLEAR' : Number(app_price)) : null,
        show_on_web !== undefined ? Boolean(show_on_web) : null,
        show_on_app !== undefined ? Boolean(show_on_app) : null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    clearProductsCache();
    res.json({ message: 'Produk berhasil diperbarui!', product: result.rows[0] });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Gagal memperbarui produk: ' + (error.message || error) });
  }
});

// PUT /api/products/:id/stock (Update stock lines & count)
router.put('/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { account_stock, stock_count } = req.body;
    const isNum = !isNaN(parseInt(id, 10)) && /^\d+$/.test(id.toString());
    const whereClause = isNum ? 'WHERE id = $3' : 'WHERE slug = $3';

    const safeStock = Array.isArray(account_stock) ? account_stock : [];
    const count = stock_count !== undefined ? Number(stock_count) : safeStock.filter(s => !s.isSold).length;

    const result = await query(
      `UPDATE products 
       SET account_stock = $1::jsonb, 
           stock_count = $2, 
           stock_status = CASE WHEN $2 > 0 THEN 'TERSEDIA' ELSE 'HABIS' END,
           updated_at = CURRENT_TIMESTAMP
       ${whereClause}
       RETURNING *`,
      [JSON.stringify(safeStock), count, id]
    );

    clearProductsCache();
    res.json({ success: true, product: result.rows[0] });
  } catch (error) {
    console.error('Update product stock error:', error);
    res.status(500).json({ message: 'Gagal memperbarui stok di server: ' + (error.message || error) });
  }
});

// DELETE /api/products/:id (Admin delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Hanya admin yang dapat menghapus produk.' });
    }

    const { id } = req.params;
    const isNum = !isNaN(parseInt(id, 10)) && /^\d+$/.test(id.toString());
    const sql = isNum ? 'DELETE FROM products WHERE id = $1' : 'DELETE FROM products WHERE slug = $1';
    await query(sql, [id]);
    clearProductsCache();
    res.json({ message: 'Produk berhasil dihapus.' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Gagal menghapus produk.' });
  }
});

export default router;
