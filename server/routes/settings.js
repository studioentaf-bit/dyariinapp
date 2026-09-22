import express from 'express';
import { query } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const result = await query("SELECT value FROM settings WHERE key = 'store_config'");
    if (result.rows.length === 0) {
      return res.json({ settings: {} });
    }
    res.json({ settings: result.rows[0].value });
  } catch (error) {
    console.error('Fetch settings error:', error);
    res.status(500).json({ message: 'Gagal mengambil pengaturan toko.' });
  }
});

// PUT /api/settings (Admin update)
router.put('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses ditolak.' });
    }

    const { settings } = req.body;
    await query(
      `INSERT INTO settings (key, value, updated_at)
       VALUES ('store_config', $1, CURRENT_TIMESTAMP)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
      [JSON.stringify(settings)]
    );

    res.json({ message: 'Pengaturan toko berhasil diperbarui!' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Gagal menyimpan pengaturan.' });
  }
});

export default router;
