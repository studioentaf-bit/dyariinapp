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
import tutorialRoutes from './routes/tutorials.js';
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

// App version and direct download endpoints for Desktop Story.in AI Manager
const MIN_OFFICIAL_VERSION = '0.0.17';

function isVersionGreater(v1, v2) {
  const p1 = (v1 || '').replace(/^v/i, '').split('.').map(Number);
  const p2 = (v2 || '').replace(/^v/i, '').split('.').map(Number);
  for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
    const n1 = p1[i] || 0;
    const n2 = p2[i] || 0;
    if (n1 > n2) return true;
    if (n1 < n2) return false;
  }
  return false;
}

app.get(['/api/app-version', '/api/app/version'], async (req, res) => {
  try {
    const result = await query("SELECT value FROM settings WHERE key = 'store_config'");
    const store = (result.rows.length > 0 && result.rows[0].value) || {};
    const appCfg = store.appInfo || store.appVersionInfo || {};
    let version = appCfg.version || store.appVersion || MIN_OFFICIAL_VERSION;
    if (isVersionGreater(MIN_OFFICIAL_VERSION, version)) {
      version = MIN_OFFICIAL_VERSION;
    }
    const tag = version.startsWith('v') ? version : `v${version}`;
    const downloadUrl = appCfg.downloadUrl || `https://github.com/studioentaf-bit/dyariinapp/releases/download/${tag}/Story.in-AI-Manager.exe`;
    const releaseUrl = appCfg.releaseUrl || `https://github.com/studioentaf-bit/dyariinapp/releases/tag/${tag}`;

    res.json({
      version,
      name: appCfg.name || 'Story.in AI Manager',
      downloadUrl,
      releaseUrl,
      directDownload: '/api/app/download',
      releaseDate: appCfg.releaseDate || '2026-10-25',
      size: appCfg.size || '165 MB',
      changelog: appCfg.changelog || `Versi ${version}: Konsep visual total baru (Logo Origami 3D, Topbar pill search & notifikasi, Hero awan langit 3D dengan floating icons, 4 Stat Cards, baris tengah Tutorial 3D & Aktivitas real-time, dan Paket Lisensi 4 kolom + Gift 3D).`
    });
  } catch (err) {
    res.json({
      version: MIN_OFFICIAL_VERSION,
      name: 'Story.in AI Manager',
      downloadUrl: `https://github.com/studioentaf-bit/dyariinapp/releases/download/v${MIN_OFFICIAL_VERSION}/Story.in-AI-Manager.exe`,
      releaseUrl: `https://github.com/studioentaf-bit/dyariinapp/releases/tag/v${MIN_OFFICIAL_VERSION}`,
      directDownload: '/api/app/download',
      releaseDate: '2026-10-25',
      size: '165 MB',
      changelog: `Versi ${MIN_OFFICIAL_VERSION}: Konsep visual total baru (Logo Origami 3D, Topbar pill search & notifikasi, Hero awan langit 3D dengan floating icons, 4 Stat Cards, baris tengah Tutorial 3D & Aktivitas real-time, dan Paket Lisensi 4 kolom + Gift 3D).`
    });
  }
});

// Direct Download endpoint without popups/external redirect
app.get('/api/app/download', async (req, res) => {
  try {
    const result = await query("SELECT value FROM settings WHERE key = 'store_config'");
    const store = (result.rows.length > 0 && result.rows[0].value) || {};
    const appCfg = store.appInfo || store.appVersionInfo || {};
    let version = appCfg.version || store.appVersion || MIN_OFFICIAL_VERSION;
    if (isVersionGreater(MIN_OFFICIAL_VERSION, version)) {
      version = MIN_OFFICIAL_VERSION;
    }
    const tag = version.startsWith('v') ? version : `v${version}`;
    const targetUrl = appCfg.downloadUrl || `https://github.com/studioentaf-bit/dyariinapp/releases/download/${tag}/Story.in-AI-Manager.exe`;
    res.redirect(302, targetUrl);
  } catch (_) {
    res.redirect(302, `https://github.com/studioentaf-bit/dyariinapp/releases/download/v${MIN_OFFICIAL_VERSION}/Story.in-AI-Manager.exe`);
  }
});

// License plans endpoint for Desktop App shop & checkout
app.get('/api/license-plans', async (req, res) => {
  try {
    const result = await query("SELECT value FROM settings WHERE key = 'store_config'");
    const store = (result.rows.length > 0 && result.rows[0].value) || {};
    const rawPlans = store.licensePackages || store.license_plans || store.licensePlans;
    const plans = (Array.isArray(rawPlans) && rawPlans.length > 0) ? rawPlans : [
      {
        id: 'app_lifetime',
        name: 'Desktop Pro All Fitur (Lifetime)',
        category: 'app',
        price: 149000,
        original_price: 299000,
        description: 'Aplikasi Desktop Windows • Akses penuh semua platform AI, Story Generator, Video Splitter, Merger.',
        features: ['Story Generator Built-in Studio', 'Voice Over Text-to-Speech', 'Video Tools (Split & Merge)', 'Unlimited Akun Platform AI', 'Auto Updater & Lifetime Support'],
        badge: 'TERPOPULER',
        enabled: true
      },
      {
        id: 'app_monthly',
        name: 'Desktop Pro Bulanan (30 Hari)',
        category: 'app',
        price: 49000,
        original_price: 99000,
        description: 'Aplikasi Desktop Windows • Akses seluruh fitur Pro selama 30 hari.',
        features: ['Story Generator Built-in Studio', 'Voice Over Text-to-Speech', 'Akses Semua Fitur Pro', 'Masa Aktif 30 Hari'],
        enabled: true
      },
      {
        id: 'web_starter',
        name: 'Web Starter License (30 Hari)',
        category: 'web',
        price: 39000,
        original_price: 79000,
        description: 'Akses Web Story Generator di Browser selama 30 hari.',
        features: ['Akses Web Story Generator', 'Storyboard Sinematik (5 Kategori)', 'AI Prompt Studio (6 Mode)', 'Voice Over TTS Gemini'],
        enabled: true
      },
      {
        id: 'web_lifetime',
        name: 'Web Lifetime Ultimate',
        category: 'web',
        price: 199000,
        original_price: 499000,
        description: 'Akses Seumur Hidup Web Story Generator di Browser.',
        features: ['Akses Seumur Hidup Web Story Generator', 'Bebas Gunakan Semua Mode Tanpa Batas', 'Update Formula Prompt Masa Depan', 'Dukungan VIP Teknis'],
        badge: 'BEST VALUE',
        enabled: true
      }
    ];
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ plans: [] });
  }
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/tutorials', tutorialRoutes);
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
