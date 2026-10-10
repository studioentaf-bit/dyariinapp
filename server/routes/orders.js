import express from 'express';
import { query } from '../db.js';
import { authenticateToken } from './auth.js';
import { calculateExpiry } from './licenses.js';

const router = express.Router();

// GET /api/orders
router.get('/', authenticateToken, async (req, res) => {
  try {
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

    if (req.user.role !== 'admin') {
      sql += ' WHERE o.user_id = $1';
      params.push(req.user.id);
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
      user_id, customer_name, customer_email, customer_phone,
      payment_method, items, proof_image, notes
    } = req.body;

    if (!customer_name || !customer_email || !items || !items.length) {
      return res.status(400).json({ message: 'Data checkout tidak lengkap.' });
    }

    // Generate Invoice: INV-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-${dateStr}-${randSuffix}`;

    const totalAmount = items.reduce((acc, item) => acc + (Number(item.price || 0) * (item.quantity || 1)), 0);

    // Insert into orders table
    const orderRes = await query(
      `INSERT INTO orders (
        invoice_number, user_id, customer_name, customer_email, customer_phone,
        total_amount, payment_method, status, proof_image, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'MENUNGGU_PEMBAYARAN', $8, $9)
      RETURNING *`,
      [
        invoiceNumber, user_id || null, customer_name, customer_email,
        customer_phone || '', totalAmount, payment_method || 'QRIS',
        proof_image || '', notes || ''
      ]
    );

    const newOrder = orderRes.rows[0];

    // Insert order items
    for (const it of items) {
      await query(
        `INSERT INTO order_items (
          order_id, product_id, product_title, product_price, quantity, subtotal
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          newOrder.id, it.id || null, it.title || it.name,
          it.price, it.quantity || 1, Number(it.price) * (it.quantity || 1)
        ]
      );
    }

    res.status(201).json({
      message: 'Pesanan berhasil dibuat!',
      order: { ...newOrder, items }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Gagal memproses pesanan checkout.' });
  }
});

// GET /api/orders/status/:id (Public order status lookup by invoice or id)
router.get('/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = id.replace('#', '').trim();
    const isNum = !isNaN(parseInt(cleanId, 10)) && /^\d+$/.test(cleanId);
    const sql = isNum
      ? 'SELECT * FROM orders WHERE id = $1 OR invoice_number = $2'
      : 'SELECT * FROM orders WHERE invoice_number = $1';
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

// PUT /api/orders/:id/status (Admin updates status to LUNAS / BATAL)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses ditolak.' });
    }

    const { id } = req.params;
    const { status } = req.body; // 'LUNAS', 'MENUNGGU_PEMBAYARAN', 'BATAL'

    const orderCheck = await query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
    }

    const order = orderCheck.rows[0];
    await query('UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [status, id]);

    // Jika diubah menjadi LUNAS:
    if (status === 'LUNAS') {
      // 1. Update total_spent member
      if (order.user_id) {
        await query(
          'UPDATE users SET total_spent = total_spent + $1 WHERE id = $2',
          [order.total_amount, order.user_id]
        );
      }

      // 2. Cek item pesanan dan terbitkan lisensi jika produk butuh lisensi
      const itemsRes = await query('SELECT * FROM order_items WHERE order_id = $1', [id]);
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

    res.json({ message: `Status pesanan berhasil diubah menjadi ${status}!` });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Gagal mengubah status pesanan.' });
  }
});

export default router;
