import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialProducts, initialOrders, testimonials as initialTestimonials } from '../data/products';
import { categories as initialCategories } from '../data/categories';
import api from '../services/api';

// --- UTILITY: KALKULASI TANGGAL & STATUS MASA BERLAKU LISENSI ---
export const calculateLicenseExpiry = (durationStr = 'Selamanya (Lifetime)', startDateInput = new Date()) => {
  const start = startDateInput instanceof Date ? startDateInput : new Date(startDateInput);
  const validStart = isNaN(start.getTime()) ? new Date() : start;
  
  const startDate = validStart.toISOString();
  const createdAt = validStart.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const dur = (durationStr || '').trim();
  const durLower = dur.toLowerCase();

  // Kasus Lifetime / Selamanya
  if (durLower.includes('selamanya') || durLower.includes('lifetime') || durLower.includes('permanen')) {
    return {
      startDate,
      createdAt,
      expiryDate: null,
      expiresAt: 'Selamanya (Lifetime)',
      isLifetime: true,
      durationLabel: 'Selamanya (Lifetime)'
    };
  }

  // Kasus Hari: misal "7 Hari", "14 Hari", "30 Hari", "45 Hari"
  const dayMatch = dur.match(/(\d+)\s*hari/i);
  if (dayMatch) {
    const days = parseInt(dayMatch[1], 10);
    const exp = new Date(validStart.getTime() + days * 24 * 60 * 60 * 1000);
    return {
      startDate,
      createdAt,
      expiryDate: exp.toISOString(),
      expiresAt: exp.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      isLifetime: false,
      durationLabel: `${days} Hari`
    };
  }

  // Kasus Bulan: misal "1 Bulan", "3 Bulan", "6 Bulan"
  const monthMatch = dur.match(/(\d+)\s*bulan/i);
  if (monthMatch) {
    const months = parseInt(monthMatch[1], 10);
    const exp = new Date(validStart);
    exp.setMonth(exp.getMonth() + months);
    return {
      startDate,
      createdAt,
      expiryDate: exp.toISOString(),
      expiresAt: exp.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      isLifetime: false,
      durationLabel: `${months} Bulan`
    };
  }

  // Kasus Tahun: misal "1 Tahun", "2 Tahun"
  const yearMatch = dur.match(/(\d+)\s*tahun/i);
  if (yearMatch) {
    const years = parseInt(yearMatch[1], 10);
    const exp = new Date(validStart);
    exp.setFullYear(exp.getFullYear() + years);
    return {
      startDate,
      createdAt,
      expiryDate: exp.toISOString(),
      expiresAt: exp.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      isLifetime: false,
      durationLabel: `${years} Tahun`
    };
  }

  // Cek apakah format input berupa tanggal valid langsung
  const parsedDate = new Date(dur);
  if (!isNaN(parsedDate.getTime()) && parsedDate.getTime() > validStart.getTime()) {
    return {
      startDate,
      createdAt,
      expiryDate: parsedDate.toISOString(),
      expiresAt: parsedDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      isLifetime: false,
      durationLabel: dur
    };
  }

  // Fallback 30 hari
  const fallbackExp = new Date(validStart.getTime() + 30 * 24 * 60 * 60 * 1000);
  return {
    startDate,
    createdAt,
    expiryDate: fallbackExp.toISOString(),
    expiresAt: dur ? `${dur} (${fallbackExp.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })})` : fallbackExp.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    isLifetime: false,
    durationLabel: dur || '30 Hari'
  };
};

export const getLicenseEffectiveStatus = (license) => {
  if (!license) {
    return {
      isLocked: true,
      status: 'Tidak Ditemukan',
      reason: 'Lisensi belum terdaftar untuk akun ini.',
      badgeClass: 'bg-gray-100 text-gray-700',
      remainingText: '0 Hari'
    };
  }

  if (license.status === 'Dibekukan') {
    return {
      isLocked: true,
      status: 'Dibekukan',
      reason: 'Kunci lisensi ini telah dinonaktifkan/dibekukan oleh administrator.',
      badgeClass: 'bg-rose-100 text-rose-800 border border-rose-300',
      remainingText: 'Dibekukan'
    };
  }

  if (license.isLifetime || license.expiresAt === 'Selamanya' || license.expiresAt === 'Selamanya (Lifetime)') {
    return {
      isLocked: false,
      status: 'Aktif',
      isLifetime: true,
      reason: 'Lisensi seumur hidup aktif selamanya.',
      badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
      remainingText: 'Selamanya (Lifetime)'
    };
  }

  if (license.status === 'Kadaluarsa') {
    return {
      isLocked: true,
      status: 'Kadaluarsa',
      reason: `Masa aktif lisensi telah berakhir pada ${license.expiresAt || 'tanggal kadaluarsa'}.`,
      badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300',
      remainingText: 'Masa Aktif Habis',
      expiredAt: license.expiresAt
    };
  }

  if (license.expiryDate) {
    const now = new Date().getTime();
    const exp = new Date(license.expiryDate).getTime();
    const diffMs = exp - now;

    if (diffMs <= 0) {
      return {
        isLocked: true,
        status: 'Kadaluarsa',
        reason: `Masa aktif lisensi telah berakhir pada ${license.expiresAt}.`,
        badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300',
        remainingText: 'Masa Aktif Habis',
        expiredAt: license.expiresAt
      };
    }

    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return {
      isLocked: false,
      status: 'Aktif',
      remainingDays: diffDays,
      remainingText: `${diffDays} Hari Lagi`,
      badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
      expiresAt: license.expiresAt
    };
  }

  // Jika tidak ada expiryDate tetapi ada status Aktif
  return {
    isLocked: false,
    status: license.status || 'Aktif',
    remainingText: license.expiresAt || 'Aktif',
    badgeClass: 'bg-emerald-100 text-emerald-800'
  };
};

// --- DEFAULT PAKET & TIER LISENSI (2 KATEGORI: APLIKASI DESKTOP & WEB STORY GENERATOR) ---
export const defaultLicensePackages = [
  // KATEGORI 1: LISENSI APLIKASI DESKTOP
  {
    id: 'app_lifetime',
    name: 'Desktop Pro All Fitur (Lifetime)',
    category: 'app',
    subtitle: 'Aplikasi Desktop Windows • Akses Selamanya Sekali Bayar',
    price: 149000,
    originalPrice: 299000,
    duration: 'Selamanya (Lifetime)',
    period: 'Sekali Bayar Selamanya',
    badge: 'Paling Populer ⭐',
    features: [
      'Akses Penuh Aplikasi Desktop Story.in AI Manager',
      'Multi-Akun Container AI Terisolasi Tanpa Batas',
      'Story Generator Built-in Studio (Storyboard & Prompt)',
      'Neural Voice Over TTS Gemini (Bahasa ID & EN)',
      'Video Splitter & Video Merger Cepat Built-in',
      'Auto-Updater Terpadu & Aktivasi HWID Resmi'
    ],
    isPopular: true
  },
  {
    id: 'app_monthly',
    name: 'Desktop Pro Bulanan',
    category: 'app',
    subtitle: 'Aplikasi Desktop Windows • Masa Aktif 30 Hari',
    price: 49000,
    originalPrice: 99000,
    duration: '30 Hari (1 Bulan)',
    period: '1 Bulan Akses',
    badge: '',
    features: [
      'Akses Aplikasi Desktop Story.in AI Manager (30 Hari)',
      'Multi-Akun Container AI Terisolasi',
      'Story Generator Built-in Studio',
      'Neural Voice Over TTS Gemini',
      'Video Splitter & Video Merger'
    ],
    isPopular: false
  },

  // KATEGORI 2: LISENSI STORY GENERATOR WEBSITE
  {
    id: 'web_starter',
    name: 'Web Starter License',
    category: 'web',
    subtitle: 'Akses Web Story Generator di Browser • 30 Hari',
    price: 39000,
    originalPrice: 79000,
    duration: '30 Hari (1 Bulan)',
    period: '1 Bulan Akses',
    badge: '',
    features: [
      'Akses Web Story Generator di dyariapp.my.id',
      'Storyboard Sinematik (5 Kategori)',
      'AI Image Prompt Studio (6 Mode)',
      'Neural Voice Over Teks ke Suara Gemini',
      'Simpan Riwayat Prompt Lokal di Browser'
    ],
    isPopular: false
  },
  {
    id: 'web_lifetime',
    name: 'Web Lifetime Ultimate',
    category: 'web',
    subtitle: 'Akses Web Story Generator Selamanya di Browser',
    price: 199000,
    originalPrice: 499000,
    duration: 'Selamanya (Lifetime)',
    period: 'Sekali Bayar Selamanya',
    badge: 'Best Value 💎',
    features: [
      'Akses Seumur Hidup Web Story Generator',
      'Bebas Gunakan Semua Mode Tanpa Batas',
      'Pembaruan Formula Prompt & Fitur Web Masa Depan',
      'Hak Komersial Penuh untuk Konten Klien',
      'Dukungan VIP Teknis WhatsApp'
    ],
    isPopular: false
  }
];

// --- UTILITY: MAPPING LISENSI DARI POSTGRESQL API ---
export const mapBackendLicense = (lic) => {
  const isLife = Boolean(lic.is_lifetime || (lic.duration_label && lic.duration_label.toLowerCase().includes('lifetime')));
  const expFormatted = isLife 
    ? 'Selamanya (Lifetime)' 
    : (lic.expiry_date 
        ? new Date(lic.expiry_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) 
        : lic.duration_label || '30 Hari');

  const prodText = `${lic.product_title || ''} ${lic.product_id || ''}`.toLowerCase();
  const isApp = prodText.includes('desktop') || prodText.includes('aplikasi') || prodText.includes('app_') || prodText.includes('app-') || prodText.includes('pilot');
  const category = isApp ? 'app' : 'web';

  return {
    id: (lic.id || `LIC-${Date.now()}`).toString(),
    dbId: lic.id,
    code: lic.license_key,
    productId: lic.product_id ? `prod-${lic.product_id}` : (isApp ? 'app_monthly' : 'story-generator'),
    productName: lic.product_title || (isApp ? 'Story.in AI Manager Desktop' : 'Story Generator Pro AI'),
    customerName: lic.user_name || 'Member dyari.in',
    customerEmail: (lic.user_email || '').trim().toLowerCase(),
    type: lic.license_type || 'PERSONAL',
    category,
    platform: isApp ? 'Aplikasi Desktop' : 'Web Story Generator',
    status: lic.status === 'AKTIF' ? 'Aktif' : (lic.status === 'DITANGGUHKAN' ? 'Dibekukan' : (lic.status === 'KADALUARSA' ? 'Kadaluarsa' : (lic.status || 'Aktif'))),
    createdAt: lic.start_date 
      ? new Date(lic.start_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) 
      : (lic.created_at ? new Date(lic.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Hari Ini'),
    startDate: lic.start_date || lic.created_at || new Date().toISOString(),
    expiryDate: lic.expiry_date || null,
    expiresAt: expFormatted,
    isLifetime: isLife,
    durationLabel: lic.duration_label || (isLife ? 'Selamanya' : '30 Hari')
  };
};

// --- UTILITY: KALKULASI STOK PRODUK REAL-TIME & PERSISTENSI ---
export const getProductAvailableStock = (product) => {
  if (!product) return 0;
  if (Array.isArray(product.accountStock)) {
    return product.accountStock.filter(s => !s.isSold).length;
  }
  if (product.stockCount !== undefined && product.stockCount !== null) {
    return Math.max(0, Number(product.stockCount) || 0);
  }
  return 0; // Default mutlak 0 (HABIS) jika belum ada stok yang dimasukkan
};

export const isProductOutOfStock = (product) => {
  return getProductAvailableStock(product) <= 0;
};

export const getStoredProductStocks = () => {
  try {
    const raw = localStorage.getItem('dyari_product_stocks_v2');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (_) {}
  return {};
};

export const saveStoredProductStocks = (stocksMap) => {
  try {
    localStorage.setItem('dyari_product_stocks_v2', JSON.stringify(stocksMap));
  } catch (_) {}
};

// Helper sinkronisasi stok ke PostgreSQL backend API
const syncStockToBackend = (productId, stockList) => {
  if (!productId) return;
  const safeStock = Array.isArray(stockList) ? stockList : [];
  const readyCount = safeStock.filter(s => !s.isSold).length;
  fetch(`/api/products/${productId}/stock`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ account_stock: safeStock, stock_count: readyCount })
  }).catch(() => {
    // Tetap aman jika server offline
  });
};

// --- UTILITY: MAPPING PRODUK DARI POSTGRESQL API ---
export const mapBackendProduct = (row) => {
  let parsedStock = [];
  if (Array.isArray(row.account_stock)) {
    parsedStock = row.account_stock;
  } else if (typeof row.account_stock === 'string') {
    try {
      parsedStock = JSON.parse(row.account_stock);
    } catch (_) {
      parsedStock = [];
    }
  }

  const readyCount = parsedStock.length > 0 
    ? parsedStock.filter(s => !s.isSold).length 
    : (row.stock_count !== undefined && row.stock_count !== null ? Math.max(0, Number(row.stock_count) || 0) : 0);

  return {
    id: row.slug || `prod-${row.id}`,
    dbId: row.id,
    name: row.title,
    tagline: row.description || '',
    category: row.category_id || 'aset-premium',
    categoryName: row.category_name || 'Mega Bundle & Canva',
    subcategory: row.category_name || 'Aset Digital',
    type: row.type || 'DIGITAL_PREMIUM',
    badge: row.badge || '',
    badgeColor: row.badge === 'NEW' ? 'bg-[#61A87D] text-white' : (row.badge ? 'bg-amber-600 text-white' : ''),
    mockupType: 'app',
    price: Number(row.price),
    originalPrice: Number(row.original_price || row.price),
    appPrice: row.app_price !== null && row.app_price !== undefined && row.app_price !== '' ? Number(row.app_price) : null,
    app_price: row.app_price !== null && row.app_price !== undefined && row.app_price !== '' ? Number(row.app_price) : null,
    showOnWeb: row.show_on_web !== false,
    show_on_web: row.show_on_web !== false,
    showOnApp: row.show_on_app !== false,
    show_on_app: row.show_on_app !== false,
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.sales_count || 0),
    productType: 'DIGITAL_PREMIUM',
    afterPurchaseMessage: 'Petunjuk Akses: Buka tautan di atas untuk langsung mengakses materi digital secara lengkap.',
    image: row.image || '',
    accessUrl: row.access_link || '',
    gallery: [row.image || ''],
    description: row.description || '',
    features: Array.isArray(row.features) ? row.features : (typeof row.features === 'string' ? JSON.parse(row.features || '[]') : []),
    perks: [
      'Akses Langsung Instan Tanpa Menunggu',
      'Lisensi Personal & Belajar Lengkap',
      'Update Konten Berkala'
    ],
    accountStock: parsedStock,
    stockCount: readyCount,
    stockType: 'link_based',
    isAvailable: readyCount > 0
  };
};

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Navigation & View with URL hash sync
  // Navigation & View with URL hash & query sync
  const [activeInvoiceId, setActiveInvoiceId] = useState(() => {
    try {
      const hash = (window.location.hash || '').replace('#', '').trim();
      const [viewPart, queryPart] = hash.split('?');
      if (viewPart === 'invoice' && queryPart) {
        const params = new URLSearchParams(queryPart);
        return params.get('id') || null;
      }
    } catch (_) {}
    return null;
  });

  const getStoredAdminSlug = () => {
    try {
      return localStorage.getItem('dyari_admin_secret_slug') || 'dyari-vault-admin';
    } catch (_) {
      return 'dyari-vault-admin';
    }
  };

  const [adminSecretSlug, setAdminSecretSlug] = useState(getStoredAdminSlug);

  const updateAdminSecretSlug = (newSlug) => {
    const clean = String(newSlug || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').trim();
    if (!clean || clean.length < 6 || clean === 'admin' || clean === 'home') {
      showToast('Slug Tidak Valid', 'Gunakan minimal 6 karakter alfanumerik (huruf, angka, strip).');
      return false;
    }
    try {
      localStorage.setItem('dyari_admin_secret_slug', clean);
      setAdminSecretSlug(clean);
      showToast('URL Admin Diperbarui', `URL akses admin kini menggunakan slug: /#${clean}`);
      return true;
    } catch (_) {
      return false;
    }
  };

  const [currentView, setCurrentView] = useState(() => {
    try {
      const hash = (window.location.hash || '').replace('#', '').trim();
      const [viewPart, queryPart] = hash.split('?');
      const activeAdminSlug = localStorage.getItem('dyari_admin_secret_slug') || 'dyari-vault-admin';

      // Check if hash matches secret admin slug
      if (viewPart === activeAdminSlug) {
        return 'admin';
      }

      // Check direct /#admin access attempt: strictly block unauthorized discovery
      if (viewPart === 'admin') {
        const isAuth = localStorage.getItem('dyari_admin_session') === 'authenticated';
        const params = queryPart ? new URLSearchParams(queryPart) : null;
        const key = params ? (params.get('key') || params.get('secret')) : null;
        if (isAuth || key === 'Dyari#Master9981!Secure') {
          return 'admin';
        }
        // Obfuscate / protect: bounce unauthenticated direct /#admin to home
        window.history.replaceState(null, '', '#home');
        return 'home';
      }

      const validViews = ['home', 'shop', 'licenses', 'download', 'about', 'product-detail', 'checkout', 'order-success', 'dashboard', 'invoice', 'story-generator'];
      if (viewPart && validViews.includes(viewPart)) {
        return viewPart;
      }
      const saved = localStorage.getItem('dyari_current_view');
      if (saved && (validViews.includes(saved) || saved === 'admin')) {
        return saved;
      }
    } catch (_) {}
    return 'home';
  });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleHash = () => {
      const rawHash = (window.location.hash || '').replace('#', '').trim();
      const [viewPart, queryPart] = rawHash.split('?');
      const activeAdminSlug = localStorage.getItem('dyari_admin_secret_slug') || 'dyari-vault-admin';

      if (viewPart === activeAdminSlug) {
        setCurrentView('admin');
        try { localStorage.setItem('dyari_current_view', 'admin'); } catch (_) {}
        return;
      }

      if (viewPart === 'admin') {
        const isAuth = localStorage.getItem('dyari_admin_session') === 'authenticated';
        const params = queryPart ? new URLSearchParams(queryPart) : null;
        const key = params ? (params.get('key') || params.get('secret')) : null;
        if (isAuth || key === 'Dyari#Master9981!Secure') {
          window.history.replaceState(null, '', `#${activeAdminSlug}${queryPart ? '?' + queryPart : ''}`);
          setCurrentView('admin');
          try { localStorage.setItem('dyari_current_view', 'admin'); } catch (_) {}
          return;
        }
        // Block direct unauthenticated access to /#admin
        window.history.replaceState(null, '', '#home');
        setCurrentView('home');
        try { localStorage.setItem('dyari_current_view', 'home'); } catch (_) {}
        return;
      }

      const validViews = ['home', 'shop', 'licenses', 'download', 'about', 'product-detail', 'checkout', 'order-success', 'dashboard', 'invoice', 'story-generator'];
      if (viewPart && validViews.includes(viewPart)) {
        setCurrentView(viewPart);
        try {
          localStorage.setItem('dyari_current_view', viewPart);
        } catch (_) {}
      }
      if (viewPart === 'invoice' && queryPart) {
        const params = new URLSearchParams(queryPart);
        const invId = params.get('id');
        if (invId) {
          setActiveInvoiceId(invId);
        }
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('dyari_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(item => initialProducts.some(p => p.id === item.id));
          if (valid.length > 0) return valid;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // User State: Tamu (Guest) secara default, bukan data dummy Alya
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dyari_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && !parsed.email.toLowerCase().includes('alya')) {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user && user.email && !user.email.toLowerCase().includes('alya')) {
        localStorage.setItem('dyari_current_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('dyari_current_user');
        localStorage.removeItem('dyari_member_user');
      }
    } catch (_) {}
  }, [user]);

  // Bersihkan cache dummy data lama jika tersisa di browser
  useEffect(() => {
    try {
      const keysToClean = ['dyari_cart', 'dyari_current_user', 'dyari_member_user', 'dyari_orders', 'dyari_purchased_products', 'dyari_licenses', 'dyari_customers'];
      keysToClean.forEach(key => {
        const val = localStorage.getItem(key);
        if (val && (val.includes('alya') || val.includes('Alya') || val.includes('Dimas') || val.includes('Nadya'))) {
          localStorage.removeItem(key);
        }
      });
      const savedCart = localStorage.getItem('dyari_cart');
      if (savedCart && (savedCart.includes('cyberton-bundle-edukasi-anak') && savedCart.includes('cyberton-ribuan-bank-konten'))) {
        try {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed) && parsed.length === 2) {
            localStorage.removeItem('dyari_cart');
            setCart([]);
          }
        } catch (_) {}
      }
    } catch (_) {}
  }, []);

  // User Dashboard State
  const [dashboardTab, setDashboardTab] = useState('ringkasan');
  const [activeProductAccess, setActiveProductAccess] = useState('');

  // Categories Management State (sync to localStorage)
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('dyari_categories_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(c => c.id === 'aset-premium')) {
          return parsed;
        }
      }
      return initialCategories;
    } catch {
      return initialCategories;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dyari_categories_v3', JSON.stringify(categories));
      localStorage.setItem('dyari_categories_v2', JSON.stringify(categories));
      localStorage.setItem('dyari_categories', JSON.stringify(categories));
    } catch (_) {}
  }, [categories]);

  // Products & Orders List
  const [products, setProducts] = useState(() => {
    const savedStocks = getStoredProductStocks();
    let baseProducts = initialProducts;
    try {
      const cached = localStorage.getItem('dyari_products_cache_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) baseProducts = parsed;
      }
    } catch (_) {}

    return baseProducts.map(p => {
      const stockItems = savedStocks[p.id] || (Array.isArray(p.accountStock) ? p.accountStock : []);
      const readyCount = stockItems.filter(s => !s.isSold).length;
      return {
        ...p,
        accountStock: stockItems,
        stockCount: readyCount,
        stockType: 'link_based',
        isAvailable: readyCount > 0
      };
    });
  });

  // Sinkronisasi data produk langsung dari PostgreSQL Database
  useEffect(() => {
    let isMounted = true;
    const fetchBackendProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.products) && data.products.length > 0 && isMounted) {
            const savedStocks = getStoredProductStocks();
            const mapped = data.products.map(row => {
              const p = mapBackendProduct(row);
              const localStock = savedStocks[p.id];
              // Prioritaskan stok lokal yang tersimpan jika ada, atau gunakan stok dari database
              const finalStock = (localStock && localStock.length > 0) ? localStock : (p.accountStock || []);
              const readyCount = finalStock.filter(s => !s.isSold).length;
              if (finalStock.length > 0) {
                savedStocks[p.id] = finalStock;
              }
              return {
                ...p,
                accountStock: finalStock,
                stockCount: readyCount,
                stockType: 'link_based',
                isAvailable: readyCount > 0
              };
            });
            saveStoredProductStocks(savedStocks);
            setProducts(mapped);
            localStorage.setItem('dyari_products_cache_v1', JSON.stringify(mapped));
          }
        }
      } catch (err) {
        console.warn('API /api/products tidak terjangkau, menggunakan data cadangan lokal.', err);
      }
    };
    fetchBackendProducts();
    return () => { isMounted = false; };
  }, []);

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('dyari_orders_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return initialOrders;
  });

  // Sync orders with PostgreSQL Backend
  const syncOrdersFromBackend = useCallback(async () => {
    try {
      const token = localStorage.getItem('dyari_auth_token');
      const headers = {
        'Content-Type': 'application/json',
        'x-admin-secret': 'Dyari#Master9981!Secure',
        'x-admin-key': 'Dyari#Master9981!Secure'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/orders', { headers });
      if (!res.ok) return;
      const data = await res.json();
      if (!data || !Array.isArray(data.orders)) return;

      setOrders(prevOrders => {
        const backendOrders = data.orders.map(bo => {
          const formattedId = bo.invoice_number 
            ? (bo.invoice_number.startsWith('#') ? bo.invoice_number : `#${bo.invoice_number}`)
            : `#INV-${bo.id}`;

          let normStatus = 'Menunggu Konfirmasi';
          if (bo.status === 'LUNAS' || bo.status === 'Lunas' || bo.status === 'TERBAYAR') {
            normStatus = 'Lunas';
          } else if (bo.status === 'BATAL' || bo.status === 'Batal') {
            normStatus = 'Batal';
          } else if (bo.status === 'MENUNGGU_PEMBAYARAN' || bo.status === 'PENDING') {
            normStatus = 'Menunggu Konfirmasi';
          } else if (bo.status) {
            normStatus = bo.status;
          }

          const orderDate = bo.created_at
            ? new Date(bo.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
            : new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

          const mappedItems = (bo.items || []).map(it => ({
            id: it.product_id || it.id,
            name: it.product_title || 'Produk Digital',
            title: it.product_title || 'Produk Digital',
            price: Number(it.product_price || 0),
            quantity: Number(it.quantity || 1),
            subtotal: Number(it.subtotal || 0),
            generatedLicense: it.license_key || null
          }));

          return {
            id: formattedId,
            dbId: bo.id,
            date: orderDate,
            items: mappedItems,
            total: Number(bo.total_amount || 0),
            paymentMethod: bo.payment_method || 'QRIS',
            customer: bo.customer_name || 'Pembeli',
            customerName: bo.customer_name || 'Pembeli',
            email: bo.customer_email || '',
            phone: bo.customer_phone || '',
            status: normStatus,
            notes: bo.notes || '',
            createdAt: bo.created_at || new Date().toISOString()
          };
        });

        // Merge backend orders with existing orders (avoid duplicates)
        const combined = [...backendOrders];
        const backendIds = new Set(backendOrders.map(o => (o.id || '').toLowerCase().replace('#', '').trim()));

        (prevOrders || []).forEach(localOrd => {
          const cleanLocalId = (localOrd.id || '').toLowerCase().replace('#', '').trim();
          if (!backendIds.has(cleanLocalId)) {
            combined.push(localOrd);
          }
        });

        try {
          localStorage.setItem('dyari_orders_v2', JSON.stringify(combined));
        } catch (_) {}

        return combined;
      });
    } catch (err) {
      console.warn('Sync orders from backend error:', err);
    }
  }, []);

  // Multi-tab sync & Initial sync
  useEffect(() => {
    syncOrdersFromBackend();

    const handleStorageChange = (e) => {
      if (e.key === 'dyari_orders_v2' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setOrders(parsed);
          }
        } catch (_) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const handleOrderCreatedEvent = () => {
      syncOrdersFromBackend();
    };
    window.addEventListener('dyari_order_created', handleOrderCreatedEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dyari_order_created', handleOrderCreatedEvent);
    };
  }, [syncOrdersFromBackend]);

  useEffect(() => {
    try {
      localStorage.setItem('dyari_orders_v2', JSON.stringify(orders));
    } catch (_) {}
  }, [orders]);

  const [lastOrder, setLastOrder] = useState(null);

  // Instant Checkout Modal State
  const [instantCheckout, setInstantCheckout] = useState({
    isOpen: false,
    item: null,
    type: 'product', // 'product' | 'license'
    qty: 1,
    step: 'form', // 'form' | 'qris' | 'success'
    order: null
  });

  const openInstantCheckout = (item, type = 'product') => {
    if (!item) return;
    if (type === 'product' && isProductOutOfStock(item)) {
      showToast('Stok Habis', `Mohon maaf, stok untuk "${item.name}" sedang habis.`);
      return;
    }
    setInstantCheckout({
      isOpen: true,
      item,
      type,
      qty: 1,
      step: 'form',
      order: null
    });
  };

  const closeInstantCheckout = () => {
    setInstantCheckout(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const submitInstantOrder = async ({ name, email, phone, qty = 1 }) => {
    if (!instantCheckout.item) return null;
    const item = instantCheckout.item;
    const type = instantCheckout.type;
    const unitPrice = Number(item.price || 0);
    const orderQty = type === 'license' ? 1 : Math.max(1, Number(qty) || 1);
    const total = unitPrice * orderQty;

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `#INV-${dateStr}-${randSuffix}`;
    const orderDate = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

    let orderItem;
    if (type === 'license') {
      orderItem = {
        id: item.id || `lic-${Date.now()}`,
        name: `Lisensi: ${item.name}`,
        title: item.name,
        price: unitPrice,
        quantity: 1,
        subtotal: total,
        productType: 'LICENSE_TOOL',
        licenseDuration: item.duration || item.period || 'Selamanya (Lifetime)',
        afterPurchaseMessage: 'Kunci lisensi aktif untuk Story Generator AI.'
      };
    } else {
      orderItem = {
        id: item.id,
        name: item.name,
        title: item.name,
        price: unitPrice,
        quantity: orderQty,
        subtotal: total,
        image: item.image,
        productType: item.productType || 'DIGITAL_PREMIUM',
        accessUrl: item.accessUrl || '',
        afterPurchaseMessage: item.afterPurchaseMessage || ''
      };
    }

    const newOrder = {
      id: newOrderId,
      date: orderDate,
      items: [orderItem],
      total,
      paymentMethod: 'QRIS',
      customer: name,
      customerName: name,
      email: email.trim().toLowerCase(),
      phone: phone || '',
      status: 'Menunggu Konfirmasi',
      createdAt: new Date().toISOString()
    };

    // Update local state orders & lastOrder immediately
    setOrders(prev => {
      const updated = [newOrder, ...prev.filter(o => o.id !== newOrderId)];
      try {
        localStorage.setItem('dyari_orders_v2', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    setLastOrder(newOrder);

    // Kirim ke backend PostgreSQL dengan await agar tersimpan di DB
    try {
      const token = localStorage.getItem('dyari_auth_token');
      const headers = { 
        'Content-Type': 'application/json',
        'x-admin-secret': 'Dyari#Master9981!Secure',
        'x-admin-key': 'Dyari#Master9981!Secure'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          invoice_number: newOrderId.replace('#', '').trim(),
          customer_name: name,
          customer_email: email.trim().toLowerCase(),
          customer_phone: phone || '',
          payment_method: 'QRIS',
          items: [{
            id: orderItem.id,
            name: orderItem.name,
            title: orderItem.name,
            price: unitPrice,
            quantity: orderQty
          }],
          notes: type === 'license' ? `Pembelian Lisensi ${item.name}` : `Pembelian Langsung Produk ${item.name}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.order) {
          newOrder.dbId = data.order.id;
        }
      }
    } catch (err) {
      console.warn('Backend order insert warning:', err);
    }

    // Trigger update untuk listener / tab admin yang sedang terbuka
    try {
      window.dispatchEvent(new Event('dyari_order_created'));
    } catch (_) {}

    // Update instantCheckout modal state to 'qris'
    setInstantCheckout(prev => ({
      ...prev,
      order: newOrder,
      step: 'qris'
    }));

    return newOrder;
  };

  // Purchased products list (Kosong secara default untuk pengguna baru)
  const [purchasedProductIds, setPurchasedProductIds] = useState([]);

  // Customers Management (Kosong secara default, diisi riwayat transaksi nyata)
  const [customers, setCustomers] = useState([]);

  // Coupons Management
  const [coupons, setCoupons] = useState([
    { id: 'CP-1', code: 'DYARIHEMAT', discount: 15, type: 'percent', minSpend: 30000, usageCount: 0, status: 'Aktif' },
    { id: 'CP-2', code: 'BUNDEL50', discount: 50, type: 'percent', minSpend: 50000, usageCount: 0, status: 'Aktif' },
    { id: 'CP-3', code: 'PROMO10K', discount: 10000, type: 'fixed', minSpend: 35000, usageCount: 0, status: 'Aktif' }
  ]);

  // Licenses Management State (Synchronized with localStorage & PostgreSQL API)
  const [licenses, setLicenses] = useState(() => {
    try {
      const saved = localStorage.getItem('dyari_licenses_cache_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Reviews & Testimonials
  const [reviews, setReviews] = useState(initialTestimonials);

  // Store General Settings (Enhanced with Branding, Contact, Payment, and Dynamic License Packages)
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('dyari_store_settings_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...parsed,
            licensePackages: (Array.isArray(parsed.licensePackages) && parsed.licensePackages.length > 0)
              ? parsed.licensePackages
              : defaultLicensePackages
          };
        }
      }
    } catch (_) {}
    return {
      // Flat properties for backward compatibility
      storeName: 'dyari.in',
      tagline: 'Produk digital untuk membuat keseharian lebih rapi, produktif, kreatif, dan terasa lebih mudah.',
      whatsapp: '6282330626054',
      email: 'halo@dyari.in',
      announcement: 'Promo Spesial: Diskon hingga 50% untuk Semua Bundel & Template Digital!',
      showAnnouncement: true,
      heroTitle: 'Bikin keseharianmu jadi sedikit lebih mudah.',
      heroSubtitle: 'Template, tools, prompt & berbagai resource digital yang dirancang untuk membantu kamu mengatur, berkarya, dan berkembang.',
      paymentQris: true,
      paymentEwallet: true,
      paymentTransfer: true,
      licensePackages: defaultLicensePackages,
      bankAccounts: [
        { bank: 'BCA', accNo: '8210984123', accName: 'Tony Anggoro' },
        { bank: 'Mandiri', accNo: '1370019284192', accName: 'Tony Anggoro' }
      ],
      // Structured sub-groups for dedicated admin settings tabs
      branding: {
        storeName: 'dyari.in',
        tagline: 'Produk digital untuk membuat keseharian lebih rapi, produktif, kreatif, dan terasa lebih mudah.',
        logoBadge: 'dy',
        heroTitle: 'Bikin keseharianmu jadi sedikit lebih mudah.',
        heroSubtitle: 'Template, tools, prompt & berbagai resource digital yang dirancang untuk membantu kamu mengatur, berkarya, dan berkembang.',
        announcement: 'Promo Spesial: Diskon hingga 50% untuk Semua Bundel & Template Digital!',
        showAnnouncement: true,
        primaryColor: '#B8D8C0',
        accentColor: '#EE7C6B'
      },
      contact: {
        whatsapp: '6282330626054',
        email: 'halo@dyari.in',
        instagram: '@dyari.in',
        tiktok: '@dyari.in',
        telegram: 't.me/dyari_community',
        operationalHours: 'Senin - Minggu (08.00 - 22.00 WIB)'
      },
      payment: {
        qrisActive: true,
        qrisName: 'DYARI DIGITAL INDONESIA',
        qrisNmid: 'ID1020304050607',
        qrisImageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
        gatewayActive: true,
        gatewayProvider: 'Midtrans & Tripay Direct API',
        gatewayMerchantId: 'G-DYARI-99182',
        gatewayApiKey: 'SB-Mid-server-881920391283',
        virtualAccounts: [
          { bank: 'BCA', accNo: '8210984123', accName: 'Tony Anggoro (dyari.in)', active: true },
          { bank: 'Mandiri', accNo: '1370019284192', accName: 'Tony Anggoro (dyari.in)', active: true },
          { bank: 'BNI', accNo: '0281928172', accName: 'Tony Anggoro (dyari.in)', active: true },
          { bank: 'BRI', accNo: '00192837482910', accName: 'Tony Anggoro (dyari.in)', active: true }
        ],
        ewallets: [
          { name: 'GoPay', phone: '082330626054', nameAccount: 'Tony Anggoro', active: true },
          { name: 'OVO', phone: '082330626054', nameAccount: 'Tony Anggoro', active: true },
          { name: 'DANA', phone: '082330626054', nameAccount: 'Tony Anggoro', active: true },
          { name: 'ShopeePay', phone: '082330626054', nameAccount: 'Tony Anggoro', active: true }
        ]
      }
    };
  });

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dyari_store_settings_v3', JSON.stringify(storeSettings));
    } catch (_) {}
  }, [storeSettings]);

  // Desktop App Version & Release Info
  const [appVersionInfo, setAppVersionInfo] = useState(() => {
    try {
      const cached = localStorage.getItem('dyari_app_version_info');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.version === '0.0.6') return parsed;
      }
    } catch (_) {}
    return {
      version: '0.0.6',
      name: 'Story.in AI Manager',
      downloadUrl: 'https://github.com/studioentaf-bit/dyariinapp/releases/download/v0.0.6/Story.in-AI-Manager.exe',
      directDownload: '/api/app/download',
      releaseUrl: 'https://github.com/studioentaf-bit/dyariinapp/releases/tag/v0.0.6',
      releaseDate: '2026-10-15',
      size: '163 MB',
      changelog: 'Versi 0.0.6: Perbaikan akurasi harga produk & lisensi toko desktop, auto-reload banner & fallback greeting, toggle sidebar permanen, top bar responsif anti-terpotong, preview 5:1 & alat crop banner di admin, card lisensi ringkas, dan deskripsi produk penuh.'
    };
  });

  // Synchronize licenses and settings with PostgreSQL backend API
  useEffect(() => {
    let isMounted = true;
    const fetchBackendData = async () => {
      // 1. Fetch Licenses
      try {
        const licRes = await api.licenses.getAll();
        if (licRes && Array.isArray(licRes.licenses) && isMounted) {
          const mapped = licRes.licenses.map(mapBackendLicense);
          setLicenses(mapped);
          try {
            localStorage.setItem('dyari_licenses_cache_v2', JSON.stringify(mapped));
          } catch (_) {}
        }
      } catch (err) {
        console.warn('API /api/licenses tidak terjangkau, menggunakan cache lokal.', err);
      }

      // 2. Fetch Settings
      try {
        const setRes = await api.settings.get();
        if (setRes && setRes.settings && typeof setRes.settings === 'object' && isMounted) {
          setStoreSettings(prev => ({
            ...prev,
            ...setRes.settings,
            licensePackages: (Array.isArray(setRes.settings.licensePackages) && setRes.settings.licensePackages.length > 0)
              ? setRes.settings.licensePackages
              : (prev.licensePackages || defaultLicensePackages)
          }));
        }
      } catch (err) {
        console.warn('API /api/settings tidak terjangkau.', err);
      }

      // 3. Fetch Desktop App Version Info
      try {
        const verRes = await fetch('/api/app/version');
        if (verRes.ok) {
          const verData = await verRes.json();
          if (verData && verData.version && isMounted) {
            const minOfficial = '0.0.6';
            if (verData.version === '0.0.1' || verData.version === '0.0.2' || verData.version === '0.0.3' || verData.version === '0.0.4' || verData.version === '0.0.5') {
              verData.version = minOfficial;
              verData.downloadUrl = `https://github.com/studioentaf-bit/dyariinapp/releases/download/v${minOfficial}/Story.in-AI-Manager.exe`;
              verData.releaseUrl = `https://github.com/studioentaf-bit/dyariinapp/releases/tag/v${minOfficial}`;
            }
            setAppVersionInfo(verData);
            try {
              localStorage.setItem('dyari_app_version_info', JSON.stringify(verData));
            } catch (_) {}
          }
        }
      } catch (_) {}
    };

    fetchBackendData();
    return () => { isMounted = false; };
  }, []);

  // Toast Notification
  const [toast, setToast] = useState({ show: false, message: '', title: '' });

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('dyari_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (title, message = '') => {
    setToast({ show: true, title, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  const addToCart = (product) => {
    // Cek ketersediaan stok produk secara real-time
    const currentProd = products.find(p => p.id === product.id) || product;
    const availableStock = getProductAvailableStock(currentProd);

    if (availableStock <= 0) {
      showToast('Stok Habis', `Mohon maaf, stok untuk "${product.name}" sedang habis.`);
      return;
    }

    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart;
      }
      return [...prevCart, {
        id: product.id,
        name: product.name,
        category: product.categoryName,
        price: product.price,
        image: product.image,
        quantity: 1
      }];
    });
    showToast(product.name, 'berhasil ditambahkan ke keranjang.');
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const navigateTo = (view, productId = null) => {
    if (productId) setSelectedProductId(productId);
    if (view === 'admin') {
      const activeAdminSlug = localStorage.getItem('dyari_admin_secret_slug') || 'dyari-vault-admin';
      setCurrentView('admin');
      try {
        localStorage.setItem('dyari_current_view', 'admin');
        window.location.hash = activeAdminSlug;
      } catch (_) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentView(view);
    try {
      localStorage.setItem('dyari_current_view', view);
      if (window.location.hash !== `#${view}`) {
        window.location.hash = view;
      }
    } catch (_) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completeOrder = ({ customerName, email, paymentMethod, phone }) => {
    const buyerName = customerName || user?.name || 'Pelanggan Dyari';
    const buyerEmail = email || user?.email || '';
    const newOrderId = `#DY-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderDate = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

    // Process fulfillment for each item in cart based on productType
    const newLicensesToCreate = [];
    const updatedProductsMap = new Map();

    const fulfilledItems = cart.map(cartItem => {
      const prod = products.find(p => p.id === cartItem.id) || cartItem;
      const pType = prod.productType || (
        prod.type === 'LISENSI' 
          ? 'LICENSE_TOOL' 
          : (prod.category === 'aplikasi' ? 'APPS_PREMIUM' : 'DIGITAL_PREMIUM')
      );

      const itemCopy = { 
        ...cartItem, 
        productType: pType,
        afterPurchaseMessage: prod.afterPurchaseMessage || ''
      };

      if (pType === 'APPS_PREMIUM') {
        // Find current product in state or map
        const currentProd = updatedProductsMap.get(prod.id) || { ...prod };
        const stockList = [...(currentProd.accountStock || [])];
        const availableIdx = stockList.findIndex(s => !s.isSold);
        
        if (availableIdx !== -1) {
          const soldStock = {
            ...stockList[availableIdx],
            isSold: true,
            soldTo: newOrderId,
            soldToEmail: buyerEmail,
            soldAt: orderDate
          };
          stockList[availableIdx] = soldStock;
          itemCopy.assignedAccount = soldStock.text;
        } else {
          // Fallback if no stock left
          itemCopy.assignedAccount = currentProd.accessUrl || 'https://dyari.in/claim-account?id=' + newOrderId;
        }
        
        const remainingCount = stockList.filter(s => !s.isSold).length;
        currentProd.accountStock = stockList;
        currentProd.stockCount = remainingCount;
        currentProd.isAvailable = remainingCount > 0;
        updatedProductsMap.set(prod.id, currentProd);
      } else if (pType === 'LICENSE_TOOL') {
        // Generate unique license
        const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
        const prefix = (prod.licensePrefix || prod.name.substring(0, 5)).toUpperCase().replace(/[^A-Z]/g, '');
        const licCode = `DYARI-${prefix}-${Math.floor(1000 + Math.random() * 9000)}-${randomHex}`;
        const expiryCalc = calculateLicenseExpiry(prod.licenseDuration || 'Selamanya (Lifetime)');
        
        const newLic = {
          id: `LIC-${Date.now().toString().slice(-4)}-${Math.floor(10 + Math.random() * 90)}`,
          code: licCode,
          productId: prod.id,
          productName: prod.name,
          customerEmail: buyerEmail,
          customerName: buyerName,
          type: prod.licenseType || 'PERSONAL',
          status: 'Aktif',
          startDate: expiryCalc.startDate,
          createdAt: expiryCalc.createdAt,
          expiryDate: expiryCalc.expiryDate,
          expiresAt: expiryCalc.expiresAt,
          isLifetime: expiryCalc.isLifetime,
          durationLabel: expiryCalc.durationLabel
        };
        newLicensesToCreate.push(newLic);
        itemCopy.generatedLicense = licCode;
      } else {
        // DIGITAL_PREMIUM: master link remains, stock does not decrease
        itemCopy.masterAccessUrl = prod.accessUrl || '';
      }

      return itemCopy;
    });

    // Apply product updates to products state
    if (updatedProductsMap.size > 0) {
      setProducts(prev => prev.map(p => updatedProductsMap.has(p.id) ? updatedProductsMap.get(p.id) : p));
    }

    // Add any generated licenses
    if (newLicensesToCreate.length > 0) {
      setLicenses(prev => [...newLicensesToCreate, ...prev]);
    }

    const newOrder = {
      id: newOrderId,
      date: orderDate,
      items: fulfilledItems,
      total: cartTotal,
      paymentMethod,
      customer: buyerName,
      customerName: buyerName,
      email: buyerEmail,
      phone: phone || user?.phone || '',
      status: 'Lunas'
    };

    setOrders([newOrder, ...orders]);
    setLastOrder(newOrder);
    setActiveInvoiceId(newOrderId.replace('#', ''));

    // Add purchased products
    const newPurchasedIds = cart.map(item => item.id);
    setPurchasedProductIds(prev => Array.from(new Set([...prev, ...newPurchasedIds])));

    // Update user stats or create member session
    if (buyerEmail) {
      setUser(prev => ({
        name: buyerName,
        email: buyerEmail,
        phone: phone || prev?.phone || '',
        avatar: prev?.avatar || '',
        stats: {
          products: (prev?.stats?.products || 0) + cart.length,
          orders: (prev?.stats?.orders || 0) + 1,
          downloads: (prev?.stats?.downloads || 0) + cart.length * 2
        },
        notifications: {
          email: true,
          productUpdates: true
        }
      }));
    }

    clearCart();
    navigateTo('order-success');
  };

  const createPendingOrder = ({ customerName, email, paymentMethod, phone }) => {
    const buyerName = customerName || user?.name || 'Pelanggan Dyari';
    const buyerEmail = email || user?.email || '';
    const newOrderId = `#DY-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderDate = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

    const pendingItems = cart.map(cartItem => {
      const prod = products.find(p => p.id === cartItem.id) || cartItem;
      const pType = prod.productType || (
        prod.type === 'LISENSI' 
          ? 'LICENSE_TOOL' 
          : (prod.category === 'aplikasi' ? 'APPS_PREMIUM' : 'DIGITAL_PREMIUM')
      );
      return {
        ...cartItem,
        productType: pType,
        afterPurchaseMessage: prod.afterPurchaseMessage || ''
      };
    });

    const newOrder = {
      id: newOrderId,
      date: orderDate,
      items: pendingItems,
      total: cartTotal,
      paymentMethod,
      customer: buyerName,
      customerName: buyerName,
      email: buyerEmail,
      phone: phone || user?.phone || '',
      status: 'Menunggu Pembayaran'
    };

    setOrders([newOrder, ...orders]);
    setLastOrder(newOrder);
    clearCart();
    openInvoice(newOrderId);
    showToast('Pesanan Dibuat', `Menunggu pembayaran untuk pesanan ${newOrderId}`);
    return newOrder;
  };

  const openInvoice = (orderId) => {
    const cleanId = (orderId || '').replace('#', '');
    setActiveInvoiceId(cleanId);
    setCurrentView('invoice');
    try {
      window.location.hash = `invoice?id=${cleanId}`;
    } catch (_) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getInvoiceUrl = (orderId) => {
    const cleanId = (orderId || '').replace('#', '');
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}#invoice?id=${cleanId}`;
  };

  const sendInvoiceWhatsApp = (order) => {
    if (!order) return;
    const cleanId = (order.id || '').replace('#', '');
    const invoiceUrl = getInvoiceUrl(cleanId);
    const phone = (order.phone || '081234567890').replace(/[^0-9]/g, '');
    const waPhone = phone.startsWith('0') ? '62' + phone.substring(1) : (phone.startsWith('62') ? phone : '62' + phone);
    const isLunas = order.status === 'Lunas' || order.status === 'Terbayar';
    const statusText = isLunas ? '✓ LUNAS (Terverifikasi)' : '⏳ MENUNGGU PEMBAYARAN';
    const text = encodeURIComponent(
      `Halo Kak *${order.customer || order.customerName || 'Pelanggan'}*,\n\n` +
      `Terima kasih telah berbelanja di *dyari.in*! Berikut adalah tautan bukti invoice resmi pesanan Anda:\n\n` +
      `📄 *No. Invoice:* ${order.id}\n` +
      `📦 *Produk:* ${order.items?.map(it => it.name).join(', ')}\n` +
      `💰 *Total:* Rp ${(order.total || 0).toLocaleString('id-ID')}\n` +
      `📌 *Status:* ${statusText}\n\n` +
      `🔗 *Buka Bukti Invoice & Akses Produk:* \n${invoiceUrl}\n\n` +
      (isLunas 
        ? `Silakan simpan tautan di atas untuk mengakses akun, lisensi, atau materi digital Anda kapan saja.` 
        : `Silakan segera selesaikan pembayaran Anda sesuai instruksi di tautan invoice di atas agar pesanan dapat segera diproses.`
      ) +
      `\n\nJika ada pertanyaan, silakan balas chat ini ya Kak.\nSalam hangat,\n*Customer Care dyari.in*`
    );
    window.open(`https://wa.me/${waPhone}?text=${text}`, '_blank');
  };

  const fulfillOrderCredentials = (targetOrder) => {
    if (!targetOrder || !targetOrder.items) return targetOrder;

    const orderDate = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    const buyerEmail = targetOrder.email || user.email;
    const buyerName = targetOrder.customer || targetOrder.customerName || user.name;
    const newLicensesToCreate = [];
    let updatedProducts = false;
    let tempProducts = [...products];

    const fulfilledItems = targetOrder.items.map(it => {
      const prod = tempProducts.find(p => p.id === it.id || p.name === it.name) || it;
      const pType = it.productType || prod.productType || (
        prod.type === 'LISENSI' 
          ? 'LICENSE_TOOL' 
          : (prod.category === 'aplikasi' ? 'APPS_PREMIUM' : 'DIGITAL_PREMIUM')
      );

      const itemCopy = { 
        ...it, 
        productType: pType,
        afterPurchaseMessage: it.afterPurchaseMessage || prod.afterPurchaseMessage || ''
      };

      // If already has credential, skip
      if (itemCopy.assignedAccount || itemCopy.generatedLicense || itemCopy.masterAccessUrl) {
        return itemCopy;
      }

      if (pType === 'APPS_PREMIUM') {
        const prodIdx = tempProducts.findIndex(p => p.id === prod.id);
        if (prodIdx !== -1) {
          const currentProd = { ...tempProducts[prodIdx] };
          const stockList = [...(currentProd.accountStock || [])];
          const availableIdx = stockList.findIndex(s => !s.isSold);
          if (availableIdx !== -1) {
            const soldStock = {
              ...stockList[availableIdx],
              isSold: true,
              soldTo: targetOrder.id,
              soldToEmail: buyerEmail,
              soldAt: orderDate
            };
            stockList[availableIdx] = soldStock;
            itemCopy.assignedAccount = soldStock.text;
            const remainingCount = stockList.filter(s => !s.isSold).length;
            currentProd.accountStock = stockList;
            currentProd.stockCount = remainingCount;
            currentProd.isAvailable = remainingCount > 0;
            tempProducts[prodIdx] = currentProd;
            updatedProducts = true;
          } else {
            itemCopy.assignedAccount = currentProd.accessUrl || 'https://dyari.in/claim?id=' + targetOrder.id;
          }
        }
      } else if (pType === 'LICENSE_TOOL') {
        const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
        const prefix = (prod.licensePrefix || 'TOOL').toUpperCase().replace(/[^A-Z]/g, '');
        const licCode = `DYARI-${prefix}-${Math.floor(1000 + Math.random() * 9000)}-${randomHex}`;
        const expiryCalc = calculateLicenseExpiry(prod.licenseDuration || 'Selamanya (Lifetime)');
        itemCopy.generatedLicense = licCode;
        newLicensesToCreate.push({
          id: `LIC-${Date.now().toString().slice(-4)}-${Math.floor(10 + Math.random() * 90)}`,
          code: licCode,
          productId: prod.id,
          productName: prod.name,
          customerEmail: buyerEmail,
          customerName: buyerName,
          type: prod.licenseType || 'PERSONAL',
          status: 'Aktif',
          startDate: expiryCalc.startDate,
          createdAt: expiryCalc.createdAt,
          expiryDate: expiryCalc.expiryDate,
          expiresAt: expiryCalc.expiresAt,
          isLifetime: expiryCalc.isLifetime,
          durationLabel: expiryCalc.durationLabel
        });
      } else {
        itemCopy.masterAccessUrl = prod.accessUrl || '';
      }

      return itemCopy;
    });

    if (updatedProducts) {
      setProducts(tempProducts);
    }
    if (newLicensesToCreate.length > 0) {
      setLicenses(prev => [...newLicensesToCreate, ...prev]);
    }

    return {
      ...targetOrder,
      items: fulfilledItems
    };
  };

  // --- ADMIN MANAGEMENT ACTIONS ---

  // Category CRUD
  const addCategory = (newCat) => {
    const id = (newCat.id || newCat.name.toLowerCase().replace(/[^a-z0-9]/g, '-')).trim();
    const newCategory = {
      ...newCat,
      id,
      bgColor: newCat.bgColor || '#EAEFEA',
      iconColor: newCat.iconColor || '#2B5742'
    };
    setCategories(prev => [...prev, newCategory]);
    showToast('Kategori Baru Ditambahkan', newCategory.name);
    return newCategory;
  };

  const updateCategory = (id, updatedFields) => {
    setCategories(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, ...updatedFields };
      }
      return c;
    }));

    // Automatically sync product categoryName if category name is renamed
    if (updatedFields.name) {
      setProducts(prev => prev.map(p => {
        if (p.category === id) {
          return { ...p, categoryName: updatedFields.name };
        }
        return p;
      }));
    }
    showToast('Kategori Diperbarui', 'Perubahan kategori berhasil disimpan.');
  };

  const deleteCategory = (id) => {
    const c = categories.find(cat => cat.id === id);
    setCategories(prev => prev.filter(cat => cat.id !== id));
    showToast('Kategori Dihapus', `${c?.name || 'Kategori'} telah dihapus.`);
  };

  // Product CRUD
  const addProduct = async (newProduct) => {
    const slug = newProduct.id || newProduct.slug || `dyari-${(newProduct.name || 'produk').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString().slice(-4)}`;
    const product = {
      ...newProduct,
      id: slug,
      rating: newProduct.rating || 5.0,
      reviewsCount: newProduct.reviewsCount || 0
    };

    // 1. Simpan langsung ke state & cache browser agar instant responsif
    setProducts(prev => {
      const updated = [product, ...prev];
      try {
        localStorage.setItem('dyari_products_cache_v1', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    // 2. Simpan permanen ke PostgreSQL backend API
    try {
      const token = localStorage.getItem('dyari_auth_token');
      const headers = { 
        'Content-Type': 'application/json',
        'x-admin-secret': 'Dyari#Master9981!Secure'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/products', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: product.name,
          slug: product.id,
          price: product.price,
          original_price: product.originalPrice || product.price,
          badge: product.badge || '',
          category_id: product.category || 'aset-premium',
          category_name: product.categoryName || 'Mega Bundle & Canva',
          type: product.type || 'DIGITAL_PREMIUM',
          image: product.image || '',
          access_link: product.accessUrl || '',
          features: product.features || [],
          license_required: product.productType === 'LICENSE_TOOL',
          description: product.description || product.tagline || '',
          app_price: product.appPrice !== undefined && product.appPrice !== '' && product.appPrice !== null ? Number(product.appPrice) : null,
          show_on_web: product.showOnWeb !== false,
          show_on_app: product.showOnApp !== false
        })
      });

      if (res.ok) {
        const saved = await res.json();
        if (saved.product) {
          setProducts(prev => {
            const mapped = prev.map(p => p.id === product.id ? { ...p, dbId: saved.product.id } : p);
            try {
              localStorage.setItem('dyari_products_cache_v1', JSON.stringify(mapped));
            } catch (_) {}
            return mapped;
          });
        }
        showToast('Tersimpan di Database', `${product.name} telah disimpan permanen ke database.`);
      } else {
        const errJson = await res.json().catch(() => ({}));
        showToast('Peringatan Database', `Gagal simpan ke server: ${errJson.message || res.statusText}`);
      }
    } catch (e) {
      console.warn('Gagal sinkron produk ke database PostgreSQL:', e);
      showToast('Mode Offline', 'Produk disimpan di cache browser, tetapi koneksi ke server gagal.');
    }

    return product;
  };

  const updateProduct = async (id, updatedFields) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updatedFields } : p);
      try {
        localStorage.setItem('dyari_products_cache_v1', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    try {
      const token = localStorage.getItem('dyari_auth_token');
      const headers = { 
        'Content-Type': 'application/json',
        'x-admin-secret': 'Dyari#Master9981!Secure'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          title: updatedFields.name,
          price: updatedFields.price,
          original_price: updatedFields.originalPrice,
          badge: updatedFields.badge,
          category_id: updatedFields.category,
          category_name: updatedFields.categoryName,
          type: updatedFields.type,
          image: updatedFields.image,
          access_link: updatedFields.accessUrl,
          features: updatedFields.features,
          description: updatedFields.description || updatedFields.tagline,
          app_price: updatedFields.appPrice !== undefined ? (updatedFields.appPrice === '' || updatedFields.appPrice === null ? '' : Number(updatedFields.appPrice)) : undefined,
          show_on_web: updatedFields.showOnWeb !== undefined ? Boolean(updatedFields.showOnWeb) : undefined,
          show_on_app: updatedFields.showOnApp !== undefined ? Boolean(updatedFields.showOnApp) : undefined
        })
      });
    } catch (e) {
      console.warn('Gagal sinkron update ke PostgreSQL:', e);
    }

    showToast('Produk Diperbarui', 'Perubahan produk berhasil disimpan.');
  };

  const deleteProduct = async (id) => {
    const p = products.find(prod => prod.id === id);
    setProducts(prev => {
      const updated = prev.filter(prod => prod.id !== id);
      try {
        localStorage.setItem('dyari_products_cache_v1', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    try {
      const token = localStorage.getItem('dyari_auth_token');
      const headers = {
        'x-admin-secret': 'Dyari#Master9981!Secure'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers
      });
    } catch (e) {
      console.warn('Gagal sinkron delete ke PostgreSQL:', e);
    }

    showToast('Produk Dihapus', `${p?.name || 'Produk'} telah dihapus.`);
  };

  // Order Management
  const updateOrderStatus = async (orderId, newStatus) => {
    let targetUpdatedOrder = null;

    setOrders(prev => {
      const updatedList = prev.map(o => {
        if (o.id === orderId) {
          let updated = { ...o, status: newStatus };
          if (newStatus === 'Lunas' || newStatus === 'Terbayar') {
            updated = fulfillOrderCredentials(updated);
          }
          targetUpdatedOrder = updated;
          return updated;
        }
        return o;
      });

      try {
        localStorage.setItem('dyari_orders_v2', JSON.stringify(updatedList));
      } catch (_) {}

      return updatedList;
    });

    // Kirim pembaruan status ke backend PostgreSQL
    try {
      const cleanId = String(orderId).replace('#', '').trim();
      const token = localStorage.getItem('dyari_auth_token');
      const headers = {
        'Content-Type': 'application/json',
        'x-admin-secret': 'Dyari#Master9981!Secure',
        'x-admin-key': 'Dyari#Master9981!Secure'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const backendStatus = (newStatus === 'Lunas' || newStatus === 'Terbayar') 
        ? 'LUNAS' 
        : (newStatus === 'Batal' ? 'BATAL' : 'MENUNGGU_PEMBAYARAN');

      fetch(`/api/orders/${cleanId}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: backendStatus })
      }).catch(() => {});
    } catch (_) {}

    try {
      window.dispatchEvent(new Event('dyari_order_created'));
    } catch (_) {}

    showToast('Status Pesanan Diperbarui', `${orderId} diubah menjadi "${newStatus}"`);
    return targetUpdatedOrder;
  };

  const deleteOrder = async (orderId) => {
    try {
      const cleanId = String(orderId || '').replace('#', '').trim();
      const token = localStorage.getItem('token') || localStorage.getItem('dyari_auth_token');
      const headers = {
        'Content-Type': 'application/json',
        'x-admin-secret': 'Dyari#Master9981!Secure',
        'x-admin-key': 'Dyari#Master9981!Secure'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`/api/orders/${cleanId}`, {
        method: 'DELETE',
        headers
      }).catch(err => console.warn('Backend order delete error:', err));
    } catch (err) {
      console.warn('Delete order API error:', err);
    }

    setOrders(prev => {
      const updated = prev.filter(o => o.id !== orderId && o.dbId !== orderId);
      try {
        localStorage.setItem('dyari_orders_v2', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    try {
      window.dispatchEvent(new Event('dyari_order_created'));
    } catch (_) {}

    showToast('Pesanan Dihapus', `Pesanan ${orderId} telah dihapus permanen.`);
  };

  // Coupon Management
  const addCoupon = (couponData) => {
    const newCoupon = {
      id: `CP-${Date.now()}`,
      usageCount: 0,
      status: 'Aktif',
      ...couponData
    };
    setCoupons(prev => [newCoupon, ...prev]);
    showToast('Kupon Berhasil Dibuat', `Kode ${newCoupon.code}`);
  };

  const deleteCoupon = (id) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    showToast('Kupon Dihapus', 'Kupon promosi telah dinonaktifkan.');
  };

  // Customer Management
  const addCustomer = (customerData) => {
    const newCust = {
      id: `CUST-${Date.now()}`,
      totalSpent: 0,
      orderCount: 0,
      joinedDate: 'Hari ini',
      status: 'Aktif',
      ...customerData
    };
    setCustomers(prev => [newCust, ...prev]);
    showToast('Pelanggan Ditambahkan', newCust.name);
  };

  const updateCustomerStatus = (id, newStatus) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    showToast('Status Pelanggan', `Status berhasil diubah menjadi ${newStatus}`);
  };

  const deleteCustomer = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    showToast('Pelanggan Dihapus', 'Data pelanggan telah dihapus.');
  };

  // Reviews Management
  const addReview = (reviewData) => {
    const newRev = {
      id: Date.now(),
      stars: 5,
      ...reviewData
    };
    setReviews(prev => [newRev, ...prev]);
    showToast('Ulasan Ditambahkan', `Dari ${newRev.author}`);
  };

  const deleteReview = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    showToast('Ulasan Dihapus', 'Ulasan telah dihapus dari etalase.');
  };

  // Store Settings Actions
  const updateStoreSettings = (newSettings) => {
    setStoreSettings(prev => {
      const updated = { 
        ...prev, 
        ...newSettings,
        // If updating branding or contact or payment directly, sync flat fields
        storeName: newSettings.branding?.storeName || newSettings.storeName || prev.storeName,
        tagline: newSettings.branding?.tagline || newSettings.tagline || prev.tagline,
        logoUrl: newSettings.branding?.logoUrl || newSettings.logoUrl || prev.logoUrl,
        heroTitle: newSettings.branding?.heroTitle || newSettings.heroTitle || prev.heroTitle,
        heroSubtitle: newSettings.branding?.heroSubtitle || newSettings.heroSubtitle || prev.heroSubtitle,
        announcement: newSettings.branding?.announcement || newSettings.announcement || prev.announcement,
        showAnnouncement: newSettings.branding?.showAnnouncement !== undefined ? newSettings.branding.showAnnouncement : (newSettings.showAnnouncement !== undefined ? newSettings.showAnnouncement : prev.showAnnouncement),
        whatsapp: newSettings.contact?.whatsapp || newSettings.whatsapp || prev.whatsapp,
        email: newSettings.contact?.email || newSettings.email || prev.email,
        qrisImageUrl: newSettings.payment?.qrisImageUrl || newSettings.payment?.qrisUrl || newSettings.qrisImageUrl || prev.qrisImageUrl,
        bannerImageUrl: newSettings.branding?.bannerImageUrl || newSettings.bannerImageUrl || prev.bannerImageUrl,
        desktopBannerUrl: newSettings.branding?.desktopBannerUrl || newSettings.desktopBannerUrl || prev.desktopBannerUrl
      };

      try {
        localStorage.setItem('dyari_store_settings_v3', JSON.stringify(updated));
        api.settings.update(updated).catch(err => {
          console.error('Failed to sync store settings to server:', err);
        });
      } catch (_) {}

      return updated;
    });
    showToast('Pengaturan Disimpan', 'Konfigurasi toko berhasil diperbarui.');
  };

  // Product Stock Management
  const updateProductStock = (id, stockData) => {
    setProducts(prev => {
      const next = prev.map(p => {
        if (p.id === id) {
          const stockType = stockData.stockType || p.stockType || 'link_based';
          const stockLinks = stockData.stockLinks !== undefined ? stockData.stockLinks : (p.stockLinks || []);
          let count = stockData.stockCount !== undefined ? Number(stockData.stockCount) : (p.accountStock ? p.accountStock.filter(s => !s.isSold).length : 0);
          if (stockType === 'link_based') {
            count = p.accountStock ? p.accountStock.filter(s => !s.isSold).length : stockLinks.length;
          }
          const isAvailable = count > 0;

          return {
            ...p,
            stockType,
            stockLinks,
            stockCount: count,
            isAvailable
          };
        }
        return p;
      });
      try {
        localStorage.setItem('dyari_products_cache_v1', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    showToast('Stok Produk Diperbarui', 'Perubahan kuota & stok produk disimpan.');
  };

  // Mass Stock Importer for Apps & Digital Stock (Supports messy paste, auto URL extraction, 1 code per line)
  // Dilengkapi validasi pencegahan duplikasi antara sold dan unsold
  const importMassStock = (productId, rawText, mode = 'append') => {
    if (!rawText || !rawText.trim()) {
      showToast('Input Kosong', 'Tidak ada baris stok yang valid untuk diimport.');
      return { success: false, added: 0, rejected: 0 };
    }

    // 1. Cek apakah ada URL (http:// atau https://)
    const urlMatches = rawText.match(/https?:\/\/[^\s]+/g);
    let rawLines = [];
    if (urlMatches && urlMatches.length > 0) {
      // Ambil semua URL unik yang terdeteksi
      rawLines = Array.from(new Set(urlMatches.map(u => u.trim()))).filter(Boolean);
    } else {
      // Jika tidak ada URL, pecah per baris (1 kode/kredensial per baris)
      rawLines = rawText
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);
    }

    if (rawLines.length === 0) {
      showToast('Input Kosong', 'Tidak ada baris atau URL stok yang valid untuk diimport.');
      return { success: false, added: 0, rejected: 0 };
    }

    const norm = (s) => (s || '').trim().toLowerCase();

    let addedCount = 0;
    let rejectedCount = 0;

    setProducts(prev => {
      const savedStocks = getStoredProductStocks();
      const next = prev.map(p => {
        if (p.id !== productId) return p;

        const existingStock = p.accountStock || [];
        // Set berisi semua stok yang sudah ada, baik isSold: true maupun isSold: false
        const existingSet = new Set(mode === 'replace' ? [] : existingStock.map(s => norm(s.text)));
        const seenInBatch = new Set();
        const validLines = [];

        for (const line of rawLines) {
          const n = norm(line);
          // Cegah duplikasi dengan stok yang sudah ada (sold & unsold) dan duplikasi dalam 1 batch input
          if (existingSet.has(n) || seenInBatch.has(n)) {
            rejectedCount++;
          } else {
            seenInBatch.add(n);
            validLines.push(line);
          }
        }

        addedCount = validLines.length;

        const todayStr = new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric'
        });
        const newItems = validLines.map((line, idx) => ({
          id: `stk-${Date.now()}-${idx}-${Math.floor(100 + Math.random() * 900)}`,
          text: line,
          isSold: false,
          soldTo: null,
          soldToEmail: null,
          soldAt: null,
          addedAt: todayStr
        }));

        const updatedList = mode === 'replace' ? newItems : [...existingStock, ...newItems];
        const availableCount = updatedList.filter(s => !s.isSold).length;

        savedStocks[productId] = updatedList;
        syncStockToBackend(productId, updatedList);

        return {
          ...p,
          accountStock: updatedList,
          stockCount: availableCount,
          stockType: 'link_based',
          isAvailable: availableCount > 0
        };
      });

      saveStoredProductStocks(savedStocks);
      try {
        localStorage.setItem('dyari_products_cache_v1', JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    if (addedCount === 0 && rejectedCount > 0) {
      showToast('Gagal: Duplikasi Terdeteksi', `Semua ${rejectedCount} baris ditolak karena sudah pernah ada di stok (sold/unsold).`);
      return { success: false, added: 0, rejected: rejectedCount };
    } else if (rejectedCount > 0) {
      showToast('Import Selesai', `${addedCount} stok berhasil ditambahkan. ${rejectedCount} duplikat ditolak.`);
      return { success: true, added: addedCount, rejected: rejectedCount };
    } else {
      showToast('Import Berhasil', `${addedCount} link/kredensial unik berhasil dimasukkan ke stok.`);
      return { success: true, added: addedCount, rejected: 0 };
    }
  };

  // Delete a single stock item
  const deleteStockItem = (productId, stockItemId) => {
    setProducts(prev => {
      const savedStocks = getStoredProductStocks();
      const next = prev.map(p => {
        if (p.id !== productId) return p;
        const updatedList = (p.accountStock || []).filter(s => s.id !== stockItemId);
        const availableCount = updatedList.filter(s => !s.isSold).length;
        savedStocks[productId] = updatedList;
        syncStockToBackend(productId, updatedList);
        return {
          ...p,
          accountStock: updatedList,
          stockCount: availableCount,
          stockType: 'link_based',
          isAvailable: availableCount > 0
        };
      });
      saveStoredProductStocks(savedStocks);
      try {
        localStorage.setItem('dyari_products_cache_v1', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    showToast('Item Stok Dihapus', '1 baris stok berhasil dihapus.');
  };

  // Toggle sold status of a stock item
  const toggleStockSold = (productId, stockItemId) => {
    setProducts(prev => {
      const savedStocks = getStoredProductStocks();
      const next = prev.map(p => {
        if (p.id !== productId) return p;
        const updatedList = (p.accountStock || []).map(s => {
          if (s.id === stockItemId) {
            const nextSold = !s.isSold;
            return {
              ...s,
              isSold: nextSold,
              soldTo: nextSold ? '#$SHP-MANUAL' : null,
              soldAt: nextSold ? new Date().toLocaleDateString('id-ID') : null
            };
          }
          return s;
        });
        const availableCount = updatedList.filter(s => !s.isSold).length;
        savedStocks[productId] = updatedList;
        syncStockToBackend(productId, updatedList);
        return {
          ...p,
          accountStock: updatedList,
          stockCount: availableCount,
          stockType: 'link_based',
          isAvailable: availableCount > 0
        };
      });
      saveStoredProductStocks(savedStocks);
      try {
        localStorage.setItem('dyari_products_cache_v1', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    showToast('Status Baris Diubah', 'Ketersediaan baris stok berhasil diperbarui.');
  };

  // Clear all sold stock (or specific product sold stock)
  const clearSoldStock = (targetProductId = null) => {
    let clearedTotal = 0;
    setProducts(prev => {
      const savedStocks = getStoredProductStocks();
      const next = prev.map(p => {
        if (targetProductId && p.id !== targetProductId) return p;
        const stock = p.accountStock || [];
        const soldItems = stock.filter(s => s.isSold);
        clearedTotal += soldItems.length;
        const remaining = stock.filter(s => !s.isSold);
        savedStocks[p.id] = remaining;
        syncStockToBackend(p.id, remaining);
        return {
          ...p,
          accountStock: remaining,
          stockCount: remaining.length,
          stockType: 'link_based',
          isAvailable: remaining.length > 0
        };
      });
      saveStoredProductStocks(savedStocks);
      try {
        localStorage.setItem('dyari_products_cache_v1', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    showToast('Stok Terjual Dibersihkan', `${clearedTotal} baris stok berstatus TERJUAL telah dibersihkan.`);
  };

  // Bulk delete selected stock items by array of IDs
  const bulkDeleteStockItems = (productId, stockItemIds = []) => {
    if (!stockItemIds || stockItemIds.length === 0) return;
    const toDeleteSet = new Set(stockItemIds);
    setProducts(prev => {
      const savedStocks = getStoredProductStocks();
      const next = prev.map(p => {
        if (productId && p.id !== productId) return p;
        const updated = (p.accountStock || []).filter(s => !toDeleteSet.has(s.id));
        const availableCount = updated.filter(s => !s.isSold).length;
        savedStocks[p.id] = updated;
        syncStockToBackend(p.id, updated);
        return {
          ...p,
          accountStock: updated,
          stockCount: availableCount,
          stockType: 'link_based',
          isAvailable: availableCount > 0
        };
      });
      saveStoredProductStocks(savedStocks);
      try {
        localStorage.setItem('dyari_products_cache_v1', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    showToast('Hapus Terpilih', `${stockItemIds.length} item stok berhasil dihapus.`);
  };

  // --- DYNAMIC LICENSE PACKAGE TIERS MANAGEMENT (CRUD Bebas Tambah, Edit, Hapus) ---
  const addLicensePackage = (newPkg) => {
    const id = newPkg.id || `pkg-${Date.now()}`;
    const pkg = {
      ...newPkg,
      id,
      price: Number(newPkg.price || 0),
      originalPrice: Number(newPkg.originalPrice || newPkg.price || 0),
      features: Array.isArray(newPkg.features) 
        ? newPkg.features 
        : (typeof newPkg.features === 'string' ? newPkg.features.split('\n').map(s => s.trim()).filter(Boolean) : [])
    };

    setStoreSettings(prev => {
      const currentList = prev.licensePackages || defaultLicensePackages;
      const updated = {
        ...prev,
        licensePackages: [...currentList, pkg]
      };
      try {
        localStorage.setItem('dyari_store_settings_v3', JSON.stringify(updated));
        api.settings.update(updated).catch(() => {});
      } catch (_) {}
      return updated;
    });

    showToast('Paket Lisensi Ditambahkan', pkg.name);
    return pkg;
  };

  const updateLicensePackage = (id, updatedFields) => {
    setStoreSettings(prev => {
      const currentList = prev.licensePackages || defaultLicensePackages;
      const updatedList = currentList.map(p => {
        if (p.id === id) {
          return {
            ...p,
            ...updatedFields,
            price: updatedFields.price !== undefined ? Number(updatedFields.price) : p.price,
            originalPrice: updatedFields.originalPrice !== undefined ? Number(updatedFields.originalPrice) : p.originalPrice,
            features: updatedFields.features !== undefined
              ? (Array.isArray(updatedFields.features) 
                  ? updatedFields.features 
                  : (typeof updatedFields.features === 'string' ? updatedFields.features.split('\n').map(s => s.trim()).filter(Boolean) : p.features))
              : p.features
          };
        }
        return p;
      });

      const updated = {
        ...prev,
        licensePackages: updatedList
      };

      try {
        localStorage.setItem('dyari_store_settings_v3', JSON.stringify(updated));
        api.settings.update(updated).catch(() => {});
      } catch (_) {}
      return updated;
    });

    showToast('Paket Lisensi Diperbarui', 'Perubahan paket berhasil disimpan.');
  };

  const deleteLicensePackage = (id) => {
    setStoreSettings(prev => {
      const currentList = prev.licensePackages || defaultLicensePackages;
      const target = currentList.find(p => p.id === id);
      const updatedList = currentList.filter(p => p.id !== id);

      const updated = {
        ...prev,
        licensePackages: updatedList
      };

      try {
        localStorage.setItem('dyari_store_settings_v3', JSON.stringify(updated));
        api.settings.update(updated).catch(() => {});
      } catch (_) {}
      return updated;
    });

    showToast('Paket Lisensi Dihapus', 'Paket telah dicabut dari penawaran.');
  };

  // --- LICENSE MANAGEMENT ACTIONS (Terkoneksi Backend PostgreSQL & Client Sync) ---
  const addLicense = async (licenseData) => {
    const randomHex = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const prefix = (licenseData.productName || 'STORY').substring(0, 5).toUpperCase().replace(/[^A-Z]/g, '');
    const code = (licenseData.code || `DYARI-${prefix}-${randomHex()}-${randomHex()}`).trim().toUpperCase();
    const expiryCalc = calculateLicenseExpiry(licenseData.expiresAt || licenseData.duration || 'Selamanya (Lifetime)');
    
    const localId = `LIC-${Date.now().toString().slice(-4)}`;
    const newLicense = {
      id: localId,
      code,
      status: 'Aktif',
      customerName: licenseData.customerName || 'Member Baru',
      customerEmail: (licenseData.customerEmail || '').trim().toLowerCase(),
      productName: licenseData.productName || 'Story Generator Pro AI',
      productId: licenseData.productId || 'story-generator',
      type: licenseData.type || 'PERSONAL',
      startDate: expiryCalc.startDate,
      createdAt: expiryCalc.createdAt,
      expiryDate: expiryCalc.expiryDate,
      expiresAt: expiryCalc.expiresAt,
      isLifetime: expiryCalc.isLifetime,
      durationLabel: expiryCalc.durationLabel
    };

    setLicenses(prev => {
      const updated = [newLicense, ...prev];
      try {
        localStorage.setItem('dyari_licenses_cache_v2', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    // Kirim sinkronisasi ke PostgreSQL backend API
    try {
      const res = await api.licenses.generate({
        license_key: code,
        product_title: newLicense.productName,
        user_name: newLicense.customerName,
        user_email: newLicense.customerEmail,
        license_type: newLicense.type,
        duration: newLicense.durationLabel,
        is_lifetime: newLicense.isLifetime
      });
      if (res && res.license) {
        setLicenses(prev => {
          const mapped = prev.map(l => l.id === localId ? { ...l, dbId: res.license.id, id: res.license.id.toString() } : l);
          try {
            localStorage.setItem('dyari_licenses_cache_v2', JSON.stringify(mapped));
          } catch (_) {}
          return mapped;
        });
      }
    } catch (err) {
      console.warn('Gagal menyimpan lisensi ke server PostgreSQL:', err);
    }

    showToast('Kunci Lisensi Diterbitkan', `${newLicense.customerName} (${newLicense.code})`);
    return newLicense;
  };

  const updateLicenseStatus = async (id, newStatus) => {
    setLicenses(prev => {
      const updated = prev.map(l => l.id === id ? { ...l, status: newStatus } : l);
      try {
        localStorage.setItem('dyari_licenses_cache_v2', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    try {
      const target = licenses.find(l => l.id === id);
      const dbId = target?.dbId || id;
      const backendStatus = newStatus === 'Aktif' ? 'AKTIF' : (newStatus === 'Dibekukan' ? 'DITANGGUHKAN' : 'KADALUARSA');
      await api.licenses.updateStatus(dbId, backendStatus);
    } catch (e) {
      console.warn('Gagal update status lisensi ke API:', e);
    }
    showToast('Status Lisensi', `Status lisensi diubah menjadi ${newStatus}`);
  };

  const deleteLicense = async (id) => {
    const target = licenses.find(l => l.id === id);
    setLicenses(prev => {
      const updated = prev.filter(l => l.id !== id);
      try {
        localStorage.setItem('dyari_licenses_cache_v2', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    try {
      const dbId = target?.dbId || id;
      await api.licenses.delete(dbId);
    } catch (e) {
      console.warn('Gagal menghapus lisensi dari API:', e);
    }
    showToast('Lisensi Dihapus', 'Kunci lisensi telah dicabut dari sistem.');
  };

  return (
    <StoreContext.Provider value={{
      currentView,
      setCurrentView,
      selectedProductId,
      setSelectedProductId,
      activeCategory,
      setActiveCategory,
      searchQuery,
      setSearchQuery,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      cartTotal,
      isCartOpen,
      setIsCartOpen,
      isAuthOpen,
      setIsAuthOpen,
      authMode,
      setAuthMode,
      user,
      setUser,
      dashboardTab,
      setDashboardTab,
      activeProductAccess,
      setActiveProductAccess,
      categories,
      setCategories,
      addCategory,
      updateCategory,
      deleteCategory,
      products,
      setProducts,
      orders,
      setOrders,
      lastOrder,
      purchasedProductIds,
      setPurchasedProductIds,
      customers,
      setCustomers,
      coupons,
      reviews,
      storeSettings,
      settings: storeSettings,
      toast,
      showToast,
      navigateTo,
      completeOrder,
      createPendingOrder,
      openInvoice,
      getInvoiceUrl,
      sendInvoiceWhatsApp,
      activeInvoiceId,
      setActiveInvoiceId,
      // Admin functions & security
      adminSecretSlug,
      updateAdminSecretSlug,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      deleteOrder,
      addCoupon,
      deleteCoupon,
      addCustomer,
      updateCustomerStatus,
      deleteCustomer,
      addReview,
      deleteReview,
      updateStoreSettings,
      updateProductStock,
      importMassStock,
      deleteStockItem,
      toggleStockSold,
      clearSoldStock,
      bulkDeleteStockItems,
      // Dynamic License Package Management (Unlimited Tiers)
      licensePackages: storeSettings.licensePackages || defaultLicensePackages,
      addLicensePackage,
      updateLicensePackage,
      deleteLicensePackage,
      // Licenses management & utilities
      licenses,
      addLicense,
      updateLicenseStatus,
      deleteLicense,
      calculateLicenseExpiry,
      getLicenseEffectiveStatus,
      // Stock calculations
      getProductAvailableStock,
      isProductOutOfStock,
      // Instant Direct Checkout (Modal Popup Tanpa Pindah Halaman)
      instantCheckout,
      setInstantCheckout,
      openInstantCheckout,
      closeInstantCheckout,
      submitInstantOrder,
      syncOrdersFromBackend,
      // Desktop App Version & Release Info
      appVersionInfo,
      setAppVersionInfo
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
