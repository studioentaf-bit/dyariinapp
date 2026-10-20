import express from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { calculateExpiry } from './licenses.js';
import { clearProductsCache } from './products.js';

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

// Auto-migrate columns for order_items (assigned_account and access_link)
const ensureOrderItemColumns = async () => {
  try {
    await query(`
      ALTER TABLE order_items 
      ADD COLUMN IF NOT EXISTS assigned_account TEXT,
      ADD COLUMN IF NOT EXISTS access_link TEXT;
    `);
  } catch (err) {
    console.warn('Notice: ensureOrderItemColumns migration:', err.message);
  }
};
ensureOrderItemColumns();

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
              'license_key', oi.license_key,
              'assigned_account', oi.assigned_account,
              'access_link', oi.access_link
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
      let accessLink = '';
      const rawId = it.product_id || it.dbId || it.id;
      if (rawId) {
        const strId = String(rawId).trim();
        if (!isNaN(parseInt(strId, 10)) && /^\d+$/.test(strId)) {
          resolvedProdId = parseInt(strId, 10);
          try {
            const pRes = await query('SELECT access_link FROM products WHERE id = $1 LIMIT 1', [resolvedProdId]);
            if (pRes.rows.length > 0) accessLink = pRes.rows[0].access_link || '';
          } catch (_) {}
        } else {
          try {
            const pRes = await query(
              'SELECT id, access_link FROM products WHERE slug = $1 OR id::text = $1 OR title ILIKE $2 LIMIT 1', 
              [strId, it.title || it.name || '']
            );
            if (pRes.rows.length > 0) {
              resolvedProdId = pRes.rows[0].id;
              accessLink = pRes.rows[0].access_link || '';
            }
          } catch (_) {}
        }
      }
      if (!resolvedProdId && (it.title || it.name)) {
        try {
          const pRes = await query('SELECT id, access_link FROM products WHERE title ILIKE $1 LIMIT 1', [it.title || it.name]);
          if (pRes.rows.length > 0) {
            resolvedProdId = pRes.rows[0].id;
            accessLink = pRes.rows[0].access_link || '';
          }
        } catch (_) {}
      }

      await query(
        `INSERT INTO order_items (
          order_id, product_id, product_title, product_price, quantity, subtotal, access_link
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          newOrder.id, resolvedProdId, it.title || it.name || 'Produk Digital',
          Number(it.price || 0), it.quantity || 1, Number(it.price || 0) * (it.quantity || 1),
          accessLink
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
    
    // Hanya ambil lisensi yang memang diterbitkan untuk item di dalam pesanan INI
    const licensesRes = await query(`
      SELECT l.* FROM licenses l
      INNER JOIN order_items oi ON oi.license_key = l.license_key
      WHERE oi.order_id = $1
    `, [order.id]);

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

      // 2. Fulfill masing-masing item pesanan sesuai jenis produknya:
      const itemsRes = await query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
      
      for (const item of itemsRes.rows) {
        // Cari data produk di database secara menyeluruh
        let product = null;
        if (item.product_id) {
          const pRes = await query('SELECT * FROM products WHERE id = $1 LIMIT 1', [item.product_id]);
          if (pRes.rows.length > 0) product = pRes.rows[0];
        }
        if (!product && item.product_title) {
          const cleanTitle = item.product_title.trim();
          const pRes = await query(
            'SELECT * FROM products WHERE title ILIKE $1 OR title ILIKE $2 OR slug ILIKE $1 LIMIT 1', 
            [cleanTitle, `%${cleanTitle}%`]
          );
          if (pRes.rows.length > 0) product = pRes.rows[0];
        }

        const titleText = (item.product_title || (product ? product.title : '')).toLowerCase();
        
        // Identifikasi: HANYA Tool Lisensi (Story Generator / Software Tool) yang menerbitkan lisensi
        // Produk Shop (Aplikasi Premium seperti Gemini, Capcut, ChatGPT, Netflix, Canva, dsb) BUKAN lisensi tool!
        const isLicenseTool = (product && product.product_type === 'LICENSE_TOOL') ||
          (product && product.type === 'LISENSI' && (titleText.includes('lisensi story') || titleText.includes('story generator'))) ||
          (!product && (titleText.includes('lisensi story') || titleText.includes('story generator')));

        if (isLicenseTool) {
          // --- HANYA UNTUK LISENSI TOOLS: Buat Lisensi di tabel licenses ---
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

          if (product) {
            await query('UPDATE products SET sales_count = COALESCE(sales_count, 0) + $1 WHERE id = $2', [
              item.quantity || 1,
              product.id
            ]);
          }
        } else {
          // --- UNTUK PRODUK SHOP (GEMINI, CAPCUT, GPT, CANVA, NETFLIX, ASET DIGITAL, DLL): KURANGI STOK SESUAI QTY & ASSIGN KREDENSIAL ---
          if (product) {
            let stockList = [];
            if (Array.isArray(product.account_stock)) {
              stockList = [...product.account_stock];
            } else if (typeof product.account_stock === 'string') {
              try { stockList = JSON.parse(product.account_stock); } catch (_) { stockList = []; }
            }

            const orderQty = Math.max(1, Number(item.quantity) || 1);
            let assignedAccount = item.assigned_account || '';

            // Jika ada baris stok akun di account_stock
            if (stockList.length > 0) {
              const availableIndices = [];
              stockList.forEach((s, idx) => {
                if (!s.isSold) availableIndices.push(idx);
              });

              if (availableIndices.length > 0) {
                const allocatedTexts = [];
                const countToTake = Math.min(orderQty, availableIndices.length);
                for (let i = 0; i < countToTake; i++) {
                  const targetIdx = availableIndices[i];
                  stockList[targetIdx] = {
                    ...stockList[targetIdx],
                    isSold: true,
                    soldTo: order.invoice_number,
                    soldToEmail: order.customer_email,
                    soldAt: new Date().toISOString()
                  };
                  allocatedTexts.push(stockList[targetIdx].text);
                }
                if (!assignedAccount) {
                  assignedAccount = allocatedTexts.join('\n');
                }
              }
            }

            // Jika belum ada assignedAccount, gunakan access_link produk jika tersedia
            if (!assignedAccount && product.access_link) {
              assignedAccount = product.access_link;
            }

            // Hitung sisa stok aktual:
            // 1. Jika ada baris akun, hitung akun yang belum terjual
            // 2. Jika tidak ada baris akun, kurangi stok angka (stock_count) sejumlah orderQty
            const currentStockCount = Number(product.stock_count) || 0;
            const remainingCount = stockList.length > 0
              ? stockList.filter(s => !s.isSold).length
              : Math.max(0, currentStockCount - orderQty);

            const isDigitalSharing = product.product_type === 'DIGITAL_PREMIUM';
            const stockStatus = (isDigitalSharing || remainingCount > 0) ? 'TERSEDIA' : 'HABIS';

            // Update stok dan penjualan di tabel products
            await query(
              `UPDATE products 
               SET account_stock = $1::jsonb,
                   stock_count = $2,
                   stock_status = $3,
                   sales_count = COALESCE(sales_count, 0) + $4,
                   updated_at = CURRENT_TIMESTAMP
               WHERE id = $5`,
              [JSON.stringify(stockList), remainingCount, stockStatus, orderQty, product.id]
            );

            // Update kredensial dan link akses pada order_items
            await query(
              `UPDATE order_items 
               SET assigned_account = $1, access_link = $2 
               WHERE id = $3`,
              [assignedAccount || '', product.access_link || '', item.id]
            );
          }
        }
      }

      // Bersihkan cache in-memory produk agar kuota stok langsung terbarui untuk web dan desktop
      clearProductsCache();
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

// DELETE /api/orders/:id (Admin deletes order and its order_items)
router.delete('/:id', async (req, res) => {
  try {
    if (!checkIsAdmin(req)) {
      return res.status(403).json({ message: 'Akses ditolak. Memerlukan hak administrator.' });
    }
    const { id } = req.params;
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
    // Delete items first
    await query('DELETE FROM order_items WHERE order_id = $1', [order.id]);
    // Delete order
    await query('DELETE FROM orders WHERE id = $1', [order.id]);

    res.json({ 
      message: `Pesanan ${order.invoice_number || order.id} berhasil dihapus permanen.`, 
      deletedId: order.id,
      invoiceNumber: order.invoice_number
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Gagal menghapus pesanan: ' + error.message });
  }
});

export default router;
