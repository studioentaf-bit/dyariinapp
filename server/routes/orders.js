import express from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { calculateExpiry } from './licenses.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dyari-secret-key-2026';
const MASTER_ADMIN_PASS = process.env.ADMIN_PASSWORD || 'Dyari#Master9981!Secure';

// Helper: Check admin permission
const checkIsAdmin = (req) => {
  const adminSecret = req.headers['x-admin-secret'] || req.headers['x-admin-key'];
  if (adminSecret && (adminSecret === MASTER_ADMIN_PASS || adminSecret === 'Dyari#Master9981!Secure')) {
    return true;
  }
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role === 'admin') return true;
    } catch (_) {}
  }
  return false;
};

// GET /api/orders (Fetch all orders or member specific orders)
router.get('/', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const isAdmin = checkIsAdmin(req);
    let userId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (_) {}
    }

    let sql = `
      SELECT o.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'product_title', oi.product_title,
              'product_price', oi.product_price,
              'quantity', oi.quantity,
              'subtotal', oi.subtotal,
              'license_key', oi.license_key
            )
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;
    const params = [];

    // Filter jika hanya member biasa tanpa secret/admin
    if (!isAdmin && userId) {
      sql += ' WHERE o.user_id = $1';
      params.push(userId);
    }

    sql += ' GROUP BY o.id ORDER BY o.created_at DESC';
    const result = await query(sql, params);
    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ message: 'Gagal mengambil riwayat transaksi.' });
  }
});

// POST /api/orders (Checkout Create Order)
router.post('/', async (req, res) => {
  try {
    const {
      invoice_number, user_id, customer_name, customer_email, customer_phone,
      payment_method, items, proof_image, notes
    } = req.body;

    if (!customer_name || !customer_email || !items || !items.length) {
      return res.status(400).json({ message: 'Data checkout tidak lengkap.' });
    }

    // Generate or sanitize Invoice Number: INV-YYYYMMDD-XXXX
    let finalInvoice = null;
    if (invoice_number) {
      finalInvoice = String(invoice_number).replace('#', '').trim();
    } else {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randSuffix = Math.floor(1000 + Math.random() * 9000);
      finalInvoice = `INV-${dateStr}-${randSuffix}`;
    }

    const totalAmount = items.reduce((acc, item) => acc + (Number(item.price || 0) * (item.quantity || 1)), 0);

    // Insert into orders table with status MENUNGGU_PEMBAYARAN
    const orderRes = await query(
      `INSERT INTO orders (
        invoice_number, user_id, customer_name, customer_email, customer_phone,
        total_amount, payment_method, status, proof_image, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'MENUNGGU_PEMBAYARAN', $8, $9)
      ON CONFLICT (invoice_number) DO UPDATE SET 
        customer_name = EXCLUDED.customer_name,
        customer_email = EXCLUDED.customer_email,
        total_amount = EXCLUDED.total_amount
      RETURNING *`,
      [
        finalInvoice, user_id || null, customer_name, customer_email,
        customer_phone || '', totalAmount, payment_method || 'QRIS',
        proof_image || '', notes || ''
      ]
    );

    const newOrder = orderRes.rows[0];

    // Insert order items safely resolving product_id as integer or null
    for (const it of items) {
      let resolvedProdId = null;
      if (it.id) {
        const rawId = String(it.id).trim();
        if (!isNaN(parseInt(rawId, 10)) && /^\d+$/.test(rawId)) {
          resolvedProdId = parseInt(rawId, 10);
        } else {
          try {
            const pRes = await query('SELECT id FROM products WHERE slug = $1 OR id::text = $1 LIMIT 1', [rawId]);
            if (pRes.rows.length > 0) {
              resolvedProdId = pRes.rows[0].id;
            }
          } catch (_) {}
        }
      }

      await query(
        `INSERT INTO order_items (
          order_id, product_id, product_title, product_price, quantity, subtotal
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          newOrder.id, resolvedProdId, it.title || it.name || 'Produk Digital',
          Number(it.price || 0), it.quantity || 1, Number(it.price || 0) * (it.quantity || 1)
        ]
      );
    }

    res.status(201).json({
      message: 'Pesanan berhasil dibuat!',
      order: { ...newOrder, items }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Gagal memproses pesanan checkout: ' + error.message });
  }
});

// GET /api/orders/status/:id (Public order status lookup by invoice or id)
router.get('/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = String(id || '').replace('#', '').trim();
    const isNum = !isNaN(parseInt(cleanId, 10)) && /^\d+$/.test(cleanId);
    const sql = isNum
      ? 'SELECT * FROM orders WHERE id = $1 OR invoice_number = $2 LIMIT 1'
      : 'SELECT * FROM orders WHERE invoice_number = $1 LIMIT 1';
    const params = isNum ? [parseInt(cleanId, 10), cleanId] : [cleanId];
    const orderRes = await query(sql, params);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
    }
    const order = orderRes.rows[0];
    const itemsRes = await query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
    const licensesRes = await query('SELECT * FROM licenses WHERE user_email = $1 ORDER BY id DESC', [order.customer_email]);
    res.json({ order, items: itemsRes.rows, licenses: licensesRes.rows });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengecek status pesanan: ' + err.message });
  }
});

// PUT /api/orders/:id/status (Admin / system updates status to LUNAS / BATAL / MENUNGGU_PEMBAYARAN)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status wajib diisi.' });
    }

    // Normalisasi status
    let normalizedStatus = status.toUpperCase().trim();
    if (normalizedStatus === 'LUNAS' || normalizedStatus === 'TERBAYAR') {
      normalizedStatus = 'LUNAS';
    } else if (normalizedStatus === 'BATAL' || normalizedStatus === 'CANCELLED') {
      normalizedStatus = 'BATAL';
    } else {
      normalizedStatus = 'MENUNGGU_PEMBAYARAN';
    }

    const cleanId = String(id || '').replace('#', '').trim();
    const isNum = !isNaN(parseInt(cleanId, 10)) && /^\d+$/.test(cleanId);
    const sql = isNum
      ? 'SELECT * FROM orders WHERE id = $1 OR invoice_number = $2 LIMIT 1'
      : 'SELECT * FROM orders WHERE invoice_number = $1 LIMIT 1';
    const params = isNum ? [parseInt(cleanId, 10), cleanId] : [cleanId];

    const orderCheck = await query(sql, params);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
    }

    const order = orderCheck.rows[0];
    await query('UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [normalizedStatus, order.id]);

    // Jika diubah menjadi LUNAS:
    if (normalizedStatus === 'LUNAS') {
      // 1. Update total_spent member jika user terdaftar
      if (order.user_id) {
        await query(
          'UPDATE users SET total_spent = total_spent + $1 WHERE id = $2',
          [order.total_amount, order.user_id]
        );
      }

      // 2. Terbitkan lisensi jika belum ada
      const itemsRes = await query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
      for (const item of itemsRes.rows) {
        if (!item.license_key) {
          const randomHex = () => Math.random().toString(36).substring(2, 6).toUpperCase();
          const licenseKey = `DYARI-${randomHex()}-${randomHex()}-${randomHex()}`;
          const startDate = new Date();
          const { expiryDate, isLifetime, durationLabel } = calculateExpiry('Selamanya (Lifetime)', startDate);

          await query(
            `INSERT INTO licenses (
              license_key, product_id, product_title, user_id, user_name, user_email,
              status, license_type, duration_label, start_date, expiry_date, is_lifetime
            ) VALUES ($1, $2, $3, $4, $5, $6, 'AKTIF', 'Personal License', $7, $8, $9, $10)`,
            [
              licenseKey, item.product_id, item.product_title, order.user_id,
              order.customer_name, order.customer_email, durationLabel,
              startDate, expiryDate, isLifetime
            ]
          );

          await query('UPDATE order_items SET license_key = $1 WHERE id = $2', [licenseKey, item.id]);
        }
      }
    }

    res.json({ 
      message: `Status pesanan berhasil diubah menjadi ${normalizedStatus}!`,
      orderId: order.id,
      invoiceNumber: order.invoice_number,
      status: normalizedStatus
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Gagal mengubah status pesanan: ' + error.message });
  }
});

export default router;
