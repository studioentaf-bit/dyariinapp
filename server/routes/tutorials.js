import express from 'express';
import { query } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Helper to convert any YouTube URL into an embed URL
export const toYouTubeEmbedUrl = (url = '') => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('youtube.com/embed/')) return trimmed;

  // Regex to extract 11-char YouTube ID
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regExp);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return trimmed;
};

const DEFAULT_TUTORIALS = [
  {
    id: 'step-1',
    stepNumber: 'Step 1',
    title: 'Aktivasi Lisensi & Pengenalan Menu',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Panduan aktivasi lisensi aplikasi desktop Story.in AI Manager dan pengenalan seluruh fitur utama.'
  },
  {
    id: 'step-2',
    stepNumber: 'Step 2',
    title: 'Multi-Akun Sosial Media & Platform AI',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Cara mengelola banyak akun TikTok, YouTube, IG, Facebook, dan platform AI secara terisolasi dan aman.'
  },
  {
    id: 'step-3',
    stepNumber: 'Step 3',
    title: 'Story Generator & Prompt Builder',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Membuat alur cerita, karakter konsisten, dan video prompt otomatis menggunakan engine AI terintegrasi.'
  }
];

// GET /api/tutorials
router.get('/', async (req, res) => {
  try {
    const result = await query("SELECT value FROM settings WHERE key = 'desktop_tutorials'");
    let videos = [];

    if (result.rows.length > 0 && result.rows[0].value) {
      videos = result.rows[0].value;
      if (typeof videos === 'string') {
        try { videos = JSON.parse(videos); } catch (_) { videos = []; }
      }
    } else {
      // Fallback check in store_config
      const sc = await query("SELECT value FROM settings WHERE key = 'store_config'");
      if (sc.rows.length > 0 && sc.rows[0].value?.desktopTutorialVideos) {
        videos = sc.rows[0].value.desktopTutorialVideos;
      }
    }

    if (!Array.isArray(videos) || videos.length === 0) {
      videos = DEFAULT_TUTORIALS;
    }

    // Ensure embedUrl is properly populated
    videos = videos.map((v, idx) => ({
      ...v,
      id: v.id || `step-${idx + 1}`,
      stepNumber: v.stepNumber || `Step ${idx + 1}`,
      embedUrl: v.embedUrl || toYouTubeEmbedUrl(v.videoUrl)
    }));

    res.json({ success: true, videos });
  } catch (error) {
    console.error('Fetch tutorials error:', error);
    res.json({ success: true, videos: DEFAULT_TUTORIALS });
  }
});

// PUT /api/tutorials (Admin update tutorial steps)
router.put('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }

    const { videos } = req.body;
    if (!Array.isArray(videos)) {
      return res.status(400).json({ success: false, message: 'Daftar video tutorial harus berupa array.' });
    }

    const cleanVideos = videos.map((v, idx) => {
      const vUrl = (v.videoUrl || '').trim();
      const emUrl = (v.embedUrl || '').trim() || toYouTubeEmbedUrl(vUrl);
      return {
        id: v.id || `step-${Date.now()}-${idx + 1}`,
        stepNumber: v.stepNumber || `Step ${idx + 1}`,
        title: v.title || `Tutorial Step ${idx + 1}`,
        videoUrl: vUrl,
        embedUrl: emUrl,
        description: v.description || ''
      };
    });

    await query(
      `INSERT INTO settings (key, value, updated_at)
       VALUES ('desktop_tutorials', $1, CURRENT_TIMESTAMP)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
      [JSON.stringify(cleanVideos)]
    );

    res.json({
      success: true,
      message: 'Video tutorial desktop berhasil disimpan!',
      videos: cleanVideos
    });
  } catch (error) {
    console.error('Update tutorials error:', error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan tutorial: ' + (error.message || error) });
  }
});

export default router;
