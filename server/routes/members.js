import express from 'express';
import { query } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

const verifyAdminAccess = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  const expectedKey = process.env.ADMIN_PASSWORD || 'Dyari#Master9981!Secure';
  if (adminKey && adminKey === expectedKey) {
    req.user = { role: 'admin' };
    return next();
  }
  authenticateToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Akses ditolak. Memerlukan hak administrator.' });
  });
};

// GET /api/members (Admin: List members with purchased products and licenses)
router.get('/', verifyAdminAccess, async (req, res) => {
  try {
    const sql = `
      SELECT 
        u.id, u.name, u.email, u.phone, u.avatar, u.status, u.total_spent, u.created_at,
        COALESCE(
          (
            SELECT json_agg(DISTINCT oi.product_title)
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = u.id AND o.status = 'LUNAS'
          ), '[]'
        ) AS purchased_products,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', l.id,
                'license_key', l.license_key,
                'product_title', l.product_title,
                'status', l.status,
                'duration_label', l.duration_label,
                'start_date', l.start_date,
                'expiry_date', l.expiry_date,
                'is_lifetime', l.is_lifetime
              )
            )
            FROM licenses l
            WHERE l.user_id = u.id
          ), '[]'
        ) AS licenses
      FROM users u
      WHERE u.role = 'member'
      ORDER BY u.created_at DESC
    `;

    const result = await query(sql);
    res.json({ members: result.rows });
  } catch (error) {
    console.error('Fetch members error:', error);
    res.status(500).json({ message: 'Gagal mengambil daftar member dari database.' });
  }
});

// PUT /api/members/:id/status (Admin updates member status)
router.put('/:id/status', verifyAdminAccess, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'AKTIF', 'SUSPENDED'

    const result = await query('UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, status', [status, id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Member tidak ditemukan.' });

    res.json({ message: `Status member berhasil diubah menjadi ${status}.`, member: result.rows[0] });
  } catch (error) {
    console.error('Update member status error:', error);
    res.status(500).json({ message: 'Gagal mengubah status member.' });
  }
});

export default router;
