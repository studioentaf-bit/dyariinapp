import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dyari-secret-key-2026';

// Middleware to authenticate JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token tidak valid atau telah kadaluarsa.' });
    req.user = user;
    next();
  });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan kata sandi wajib diisi.' });
    }

    const check = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (check.rows.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar. Silakan masuk.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO users (name, email, phone, password, role, status)
       VALUES ($1, $2, $3, $4, 'member', 'AKTIF')
       RETURNING id, name, email, phone, role, status, created_at`,
      [name, email, phone || '', hashedPassword]
    );

    const newUser = result.rows[0];
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Pendaftaran member berhasil!',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat pendaftaran.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan kata sandi wajib diisi.' });
    }

    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Email atau kata sandi salah.' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Email atau kata sandi salah.' });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({ message: 'Akun Anda sedang ditangguhkan. Hubungi CS admin.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    delete user.password;

    res.json({
      message: 'Login berhasil!',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat login.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, phone, role, avatar, status, total_spent, created_at FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ message: 'Gagal mengambil data profil.' });
  }
});

export default router;
