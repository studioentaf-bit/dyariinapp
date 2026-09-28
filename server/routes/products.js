import express from 'express';
import { query } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// High-Performance In-Memory Cache with TTL (2 minutes)
const productsCache = new Map();
const CACHE_TTL_MS = 2 * 60 * 1000;

export const clearProductsCache = () => {
  productsCache.clear();
};

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

    sql += ' ORDER BY id ASC';
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
      type, image, access_link, features, license_required, description
    } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({ message: 'Judul produk dan harga wajib diisi.' });
    }

    const autoSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const result = await query(
      `INSERT INTO products (
        title, slug, price, original_price, badge, category_id, category_name,
        type, image, access_link, features, license_required, description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        title, autoSlug, price, original_price || price, badge || '',
        category_id || 'aset-premium', category_name || 'Aset Premium',
        type || 'AKSES MEMBER', image || '', access_link || '',
        JSON.stringify(features || []), !!license_required, description || ''
      ]
    );

    clearProductsCache();
    res.status(201).json({ message: 'Produk berhasil ditambahkan!', product: result.rows[0] });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Gagal menambahkan produk baru.' });
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
      type, image, access_link, features, license_required, description, is_active
    } = req.body;

    const isNum = !isNaN(parseInt(id, 10)) && /^\d+$/.test(id.toString());
    const whereClause = isNum ? 'WHERE id = $14' : 'WHERE slug = $14';

    const result = await query(
      `UPDATE products SET
        title = COALESCE($1, title),
        price = COALESCE($2, price),
        original_price = COALESCE($3, original_price),
        badge = COALESCE($4, badge),
        category_id = COALESCE($5, category_id),
        category_name = COALESCE($6, category_name),
        type = COALESCE($7, type),
        image = COALESCE($8, image),
        access_link = COALESCE($9, access_link),
        features = COALESCE($10, features),
        license_required = COALESCE($11, license_required),
        description = COALESCE($12, description),
        is_active = COALESCE($13, is_active),
        updated_at = CURRENT_TIMESTAMP
       ${whereClause}
       RETURNING *`,
      [
        title, price, original_price, badge, category_id, category_name,
        type, image, access_link, features ? JSON.stringify(features) : null,
        license_required, description, is_active, id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    clearProductsCache();
    res.json({ message: 'Produk berhasil diperbarui!', product: result.rows[0] });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Gagal memperbarui produk.' });
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
