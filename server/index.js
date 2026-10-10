import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(process.cwd(), 'server', '.env') });
dotenv.config();

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import licenseRoutes from './routes/licenses.js';
import orderRoutes from './routes/orders.js';
import memberRoutes from './routes/members.js';
import settingRoutes from './routes/settings.js';
import aiRoutes from './routes/ai.js';
import { query } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-gemini-key', 'x-admin-secret', 'x-admin-key']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static files (dist & public for standalone server mode)
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await query('SELECT NOW()');
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'CONNECTED',
      dbTime: dbRes.rows[0].now,
      service: 'Dyari Store API'
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'DISCONNECTED',
      error: err.message
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/ai', aiRoutes);

// Fallback for Story Generator direct route
app.get('/story-generator', (req, res) => {
  const file1 = path.join(__dirname, '..', 'public', 'story-generator', 'index.html');
  const file2 = path.join(__dirname, '..', 'dist', 'story-generator', 'index.html');
  res.sendFile(file1, (err) => {
    if (err) res.sendFile(file2, (err2) => {
      if (err2) res.redirect('/#story-generator');
    });
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint API tidak ditemukan.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Terjadi kesalahan internal pada server.', error: err.message });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Dyari Backend Server berjalan di http://0.0.0.0:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
