import express from 'express';
import { query } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Helper to calculate license expiry date
export const calculateExpiry = (duration = 'Selamanya (Lifetime)', startDate = new Date()) => {
  const start = new Date(startDate);
  const durLower = (duration || '').toLowerCase().trim();

  if (durLower.includes('selamanya') || durLower.includes('lifetime') || durLower.includes('permanen')) {
    return { expiryDate: null, isLifetime: true, durationLabel: 'Selamanya (Lifetime)' };
  }

  const dayMatch = durLower.match(/(\d+)\s*hari/);
  if (dayMatch) {
    const days = parseInt(dayMatch[1], 10);
    const exp = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    return { expiryDate: exp, isLifetime: false, durationLabel: `${days} Hari` };
  }

  const monthMatch = durLower.match(/(\d+)\s*bulan/);
  if (monthMatch) {
    const months = parseInt(monthMatch[1], 10);
    const exp = new Date(start);
    exp.setMonth(exp.getMonth() + months);
    return { expiryDate: exp, isLifetime: false, durationLabel: `${months} Bulan` };
  }

  const yearMatch = durLower.match(/(\d+)\s*tahun/);
  if (yearMatch) {
    const years = parseInt(yearMatch[1], 10);
    const exp = new Date(start);
    exp.setFullYear(exp.getFullYear() + years);
    return { expiryDate: exp, isLifetime: false, durationLabel: `${years} Tahun` };
  }

  // Fallback 30 hari
  const exp = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
  return { expiryDate: exp, isLifetime: false, durationLabel: duration || '30 Hari' };
};

// GET /api/licenses
router.get('/', authenticateToken, async (req, res) => {
  try {
    let sql = 'SELECT * FROM licenses';
    const params = [];

    // Jika member, hanya lihat lisensi miliknya
    if (req.user.role !== 'admin') {
      sql += ' WHERE user_id = $1';
      params.push(req.user.id);
    }

    sql += ' ORDER BY created_at DESC';
    const result = await query(sql, params);

    // Otomatis cek expired saat diambil
    const now = new Date();
    const updatedRows = await Promise.all(result.rows.map(async (lic) => {
      if (!lic.is_lifetime && lic.expiry_date && new Date(lic.expiry_date) < now && lic.status === 'AKTIF') {
        await query('UPDATE licenses SET status = $1 WHERE id = $2', ['KADALUARSA', lic.id]);
        return { ...lic, status: 'KADALUARSA' };
      }
      return lic;
    }));

    res.json({ licenses: updatedRows });
  } catch (error) {
    console.error('Fetch licenses error:', error);
    res.status(500).json({ message: 'Gagal mengambil data lisensi.' });
  }
});

// POST /api/licenses/validate (Public / Member check license)
router.post('/validate', async (req, res) => {
  try {
    const { license_key, email } = req.body;
    if (!license_key) {
      return res.status(400).json({ isValid: false, message: 'Kode lisensi wajib diisi.' });
    }

    const cleanKey = license_key.trim().toUpperCase();
    const result = await query('SELECT * FROM licenses WHERE UPPER(license_key) = $1', [cleanKey]);
    if (result.rows.length === 0) {
      return res.status(404).json({ isValid: false, message: 'Kode lisensi tidak ditemukan di sistem.' });
    }

    const lic = result.rows[0];
    const cleanEmail = (email || '').trim().toLowerCase();

    // Verifikasi kepemilikan email
    if (cleanEmail) {
      const licEmail = (lic.user_email || '').trim().toLowerCase();
      if (licEmail && licEmail !== cleanEmail) {
        return res.status(403).json({
          isValid: false,
          message: 'Email tidak sesuai dengan lisensi ini. Harap gunakan email yang terdaftar di panel admin atau saat pembelian.'
        });
      }
      // Jika lisensi belum diisi email (misal baru dibuat admin), kaitkan otomatis
      if (!licEmail) {
        await query('UPDATE licenses SET user_email = $1 WHERE id = $2', [cleanEmail, lic.id]);
        lic.user_email = cleanEmail;
      }
    } else if (lic.user_email && lic.user_email.trim()) {
      return res.status(400).json({
        isValid: false,
        message: 'Email terdaftar wajib diisi untuk memverifikasi lisensi ini.'
      });
    }

    const now = new Date();

    // Cek apakah masa berlaku habis
    if (!lic.is_lifetime && lic.expiry_date && new Date(lic.expiry_date) < now) {
      if (lic.status !== 'KADALUARSA') {
        await query('UPDATE licenses SET status = $1 WHERE id = $2', ['KADALUARSA', lic.id]);
      }
      return res.status(403).json({
        isValid: false,
        status: 'KADALUARSA',
        message: 'Masa berlaku lisensi ini telah berakhir. Akses fitur dikunci.',
        license: { ...lic, status: 'KADALUARSA' }
      });
    }

    if (lic.status === 'DITANGGUHKAN') {
      return res.status(403).json({
        isValid: false,
        status: 'DITANGGUHKAN',
        message: 'Lisensi ini sedang ditangguhkan oleh admin.',
        license: lic
      });
    }

    res.json({
      isValid: true,
      status: 'AKTIF',
      message: 'Lisensi valid dan aktif!',
      license: lic
    });
  } catch (error) {
    console.error('Validate license error:', error);
    res.status(500).json({ isValid: false, message: 'Gagal memvalidasi lisensi.' });
  }
});

// POST /api/licenses/generate (Admin generate new license)
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Hanya admin yang dapat menerbitkan lisensi baru.' });
    }

    const {
      product_id, product_title, user_id, user_name, user_email,
      license_type, duration
    } = req.body;

    const startDate = new Date();
    const { expiryDate, isLifetime, durationLabel } = calculateExpiry(duration || 'Selamanya (Lifetime)', startDate);

    // Format serial key: DYARI-XXXX-XXXX-XXXX
    const randomHex = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const licenseKey = `DYARI-${randomHex()}-${randomHex()}-${randomHex()}`;

    const result = await query(
      `INSERT INTO licenses (
        license_key, product_id, product_title, user_id, user_name, user_email,
        status, license_type, duration_label, start_date, expiry_date, is_lifetime
      ) VALUES ($1, $2, $3, $4, $5, $6, 'AKTIF', $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        licenseKey, product_id || null, product_title || 'Lisensi Produk Digital',
        user_id || null, user_name || '', user_email || '',
        license_type || 'Personal License', durationLabel,
        startDate, expiryDate, isLifetime
      ]
    );

    res.status(201).json({
      message: 'Lisensi berhasil diterbitkan!',
      license: result.rows[0]
    });
  } catch (error) {
    console.error('Generate license error:', error);
    res.status(500).json({ message: 'Gagal menerbitkan lisensi.' });
  }
});

// PUT /api/licenses/:id/status (Admin update status)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses ditolak.' });
    }

    const { id } = req.params;
    const { status } = req.body; // 'AKTIF', 'DITANGGUHKAN', 'KADALUARSA'

    const result = await query(
      `UPDATE licenses SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lisensi tidak ditemukan.' });
    }

    res.json({ message: 'Status lisensi berhasil diperbarui!', license: result.rows[0] });
  } catch (error) {
    console.error('Update license status error:', error);
    res.status(500).json({ message: 'Gagal mengubah status lisensi.' });
  }
});

export default router;
