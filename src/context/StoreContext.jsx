import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts, initialOrders, testimonials as initialTestimonials } from '../data/products';
import { categories as initialCategories } from '../data/categories';

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

  const [currentView, setCurrentView] = useState(() => {
    try {
      const hash = (window.location.hash || '').replace('#', '').trim();
      const [viewPart] = hash.split('?');
      const validViews = ['home', 'shop', 'product-detail', 'checkout', 'order-success', 'dashboard', 'admin', 'invoice'];
      if (viewPart && validViews.includes(viewPart)) {
        return viewPart;
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
      const validViews = ['home', 'shop', 'product-detail', 'checkout', 'order-success', 'dashboard', 'admin', 'invoice'];
      if (viewPart && validViews.includes(viewPart)) {
        setCurrentView(viewPart);
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
      return [
        {
          id: 'cyberton-bundle-edukasi-anak',
          name: 'Mega Bundle Video Edukasi Anak',
          category: 'Aset Premium',
          price: 35000,
          image: 'https://lh3.googleusercontent.com/d/1PTgyE8XXopOnC9UV1HkGpI4cWRnmreIL',
          quantity: 1
        },
        {
          id: 'cyberton-ribuan-bank-konten',
          name: 'Ribuan Bank Konten Viral Medsos',
          category: 'Template Produktifitas',
          price: 39000,
          image: 'https://lh3.googleusercontent.com/d/1r4V8DwPP5wx4oTSv7BHwdjBOHvsB94qY',
          quantity: 1
        }
      ];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // User State
  const [user, setUser] = useState({
    name: 'Alya Salsabila',
    email: 'alya@dyari.user',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    stats: {
      products: 4,
      orders: 4,
      downloads: 12
    },
    notifications: {
      email: true,
      productUpdates: true
    }
  });

  // User Dashboard State
  const [dashboardTab, setDashboardTab] = useState('ringkasan');
  const [activeProductAccess, setActiveProductAccess] = useState('cyberton-bundle-edukasi-anak');

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
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [lastOrder, setLastOrder] = useState(null);

  // Purchased products list (100% Produk Cyberton)
  const [purchasedProductIds, setPurchasedProductIds] = useState([
    'cyberton-bundle-edukasi-anak',
    'cyberton-ai-script-vo',
    'cyberton-700-library',
    'cyberton-ribuan-bank-konten'
  ]);

  // Customers Management
  const [customers, setCustomers] = useState([
    { id: 'CUST-01', name: 'Alya Salsabila', email: 'alya@gmail.com', phone: '081234567890', totalSpent: 165000, orderCount: 3, joinedDate: '12 Jan 2026', status: 'Aktif' },
    { id: 'CUST-02', name: 'Budi Santoso', email: 'budi.santoso@yahoo.com', phone: '082198765432', totalSpent: 128000, orderCount: 2, joinedDate: '05 Feb 2026', status: 'Aktif' },
    { id: 'CUST-03', name: 'Siti Nurhaliza', email: 'siti.nur@gmail.com', phone: '085712349876', totalSpent: 89000, orderCount: 1, joinedDate: '20 Feb 2026', status: 'Aktif' },
    { id: 'CUST-04', name: 'Andi Pratama', email: 'andi.p@outlook.com', phone: '081399887766', totalSpent: 215000, orderCount: 4, joinedDate: '01 Mar 2026', status: 'Aktif' },
    { id: 'CUST-05', name: 'Rina Marlina', email: 'rina.design@gmail.com', phone: '087811223344', totalSpent: 70000, orderCount: 2, joinedDate: '15 Mar 2026', status: 'Aktif' }
  ]);

  // Coupons Management
  const [coupons, setCoupons] = useState([
    { id: 'CP-1', code: 'DYARIHEMAT', discount: 15, type: 'percent', minSpend: 30000, usageCount: 48, status: 'Aktif' },
    { id: 'CP-2', code: 'BUNDEL50', discount: 50, type: 'percent', minSpend: 50000, usageCount: 124, status: 'Aktif' },
    { id: 'CP-3', code: 'PROMO10K', discount: 10000, type: 'fixed', minSpend: 35000, usageCount: 89, status: 'Aktif' }
  ]);

  // Licenses Management State (Terintegrasi dengan Member & Produk Aktif)
  const [licenses, setLicenses] = useState([
    {
      id: 'LIC-01',
      code: 'DYARI-AI-9921-PRO',
      productId: 'cyberton-ai-script-vo',
      productName: 'AI Script & VO Generator',
      customerEmail: 'alya@gmail.com',
      customerName: 'Alya Salsabila',
      type: 'COMMERCIAL',
      status: 'Aktif',
      startDate: '2026-08-28T11:30:00.000Z',
      createdAt: '28 Agu 2026, 11:30',
      expiryDate: '2027-08-28T11:30:00.000Z',
      expiresAt: '28 Agu 2027, 11:30',
      isLifetime: false,
      durationLabel: '1 Tahun (365 Hari)'
    },
    {
      id: 'LIC-02',
      code: 'DYARI-LIB-7712-VIP',
      productId: 'cyberton-700-library',
      productName: '700+ Produk Digital Library Complete',
      customerEmail: 'budi.santoso@yahoo.com',
      customerName: 'Budi Santoso',
      type: 'COMMERCIAL',
      status: 'Aktif',
      startDate: '2026-08-28T09:15:00.000Z',
      createdAt: '28 Agu 2026, 09:15',
      expiryDate: null,
      expiresAt: 'Selamanya (Lifetime)',
      isLifetime: true,
      durationLabel: 'Selamanya (Lifetime)'
    }
  ]);

  // Reviews & Testimonials
  const [reviews, setReviews] = useState(initialTestimonials);

  // Store General Settings (Enhanced with Branding, Contact, and Payment groups)
  const [storeSettings, setStoreSettings] = useState({
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
  });

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
    setCurrentView(view);
    try {
      if (window.location.hash !== `#${view}`) {
        window.location.hash = view;
      }
    } catch (_) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completeOrder = ({ customerName, email, paymentMethod }) => {
    const buyerName = customerName || user.name;
    const buyerEmail = email || user.email;
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
      phone: '081234567890',
      status: 'Lunas'
    };

    setOrders([newOrder, ...orders]);
    setLastOrder(newOrder);
    setActiveInvoiceId(newOrderId.replace('#', ''));

    // Add purchased products
    const newPurchasedIds = cart.map(item => item.id);
    setPurchasedProductIds(prev => Array.from(new Set([...prev, ...newPurchasedIds])));

    // Update user stats
    setUser(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        products: prev.stats.products + cart.length,
        orders: prev.stats.orders + 1,
        downloads: prev.stats.downloads + cart.length * 2
      }
    }));

    clearCart();
    navigateTo('order-success');
  };

  const createPendingOrder = ({ customerName, email, paymentMethod, phone }) => {
    const buyerName = customerName || user.name;
    const buyerEmail = email || user.email;
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
      phone: phone || '081234567890',
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
  const addProduct = (newProduct) => {
    const id = newProduct.id || `prod-${Date.now()}`;
    const product = {
      ...newProduct,
      id,
      rating: newProduct.rating || 5.0,
      reviewsCount: newProduct.reviewsCount || 0
    };
    setProducts(prev => [product, ...prev]);
    showToast('Produk Baru Berhasil Dibuat', product.name);
    return product;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    showToast('Produk Diperbarui', 'Perubahan produk berhasil disimpan.');
  };

  const deleteProduct = (id) => {
    const p = products.find(prod => prod.id === id);
    setProducts(prev => prev.filter(prod => prod.id !== id));
    showToast('Produk Dihapus', `${p?.name || 'Produk'} telah dihapus.`);
  };

  // Order Management
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        let updated = { ...o, status: newStatus };
        if (newStatus === 'Lunas' || newStatus === 'Terbayar') {
          updated = fulfillOrderCredentials(updated);
        }
        return updated;
      }
      return o;
    }));
    showToast('Status Pesanan Diperbarui', `${orderId} diubah menjadi "${newStatus}"`);
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast('Pesanan Dihapus', `Pesanan ${orderId} telah dihapus.`);
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
    setStoreSettings(prev => ({ 
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
      qrisImageUrl: newSettings.payment?.qrisImageUrl || newSettings.qrisImageUrl || prev.qrisImageUrl
    }));
    showToast('Pengaturan Disimpan', 'Konfigurasi toko berhasil diperbarui.');
  };

  // Product Stock Management
  const updateProductStock = (id, stockData) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const stockType = stockData.stockType || p.stockType || 'unlimited';
        const stockLinks = stockData.stockLinks !== undefined ? stockData.stockLinks : (p.stockLinks || []);
        let count = stockData.stockCount !== undefined ? Number(stockData.stockCount) : (p.stockCount ?? 100);
        if (stockType === 'link_based') {
          count = p.accountStock ? p.accountStock.filter(s => !s.isSold).length : stockLinks.length;
        }
        const isAvailable = stockData.isAvailable !== undefined 
          ? stockData.isAvailable 
          : (stockType === 'link_based' ? count > 0 : true);

        return {
          ...p,
          stockType,
          stockLinks,
          stockCount: count,
          isAvailable
        };
      }
      return p;
    }));
    showToast('Stok Produk Diperbarui', 'Perubahan kuota & stok produk disimpan.');
  };

  // Mass Stock Importer for Apps Premium (1 line = 1 stock account/link)
  // Dilengkapi validasi pencegahan duplikasi antara sold dan unsold
  const importMassStock = (productId, rawText, mode = 'append') => {
    const rawLines = (rawText || '')
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (rawLines.length === 0) {
      showToast('Input Kosong', 'Tidak ada baris stok yang valid untuk diimport.');
      return { success: false, added: 0, rejected: 0 };
    }

    const norm = (s) => (s || '').trim().toLowerCase();

    let addedCount = 0;
    let rejectedCount = 0;

    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;

      const existingStock = p.accountStock || [];
      // Set berisi semua stok yang sudah ada, baik isSold: true maupun isSold: false
      const existingSet = new Set(mode === 'replace' ? [] : existingStock.map(s => norm(s.text)));
      const seenInBatch = new Set();
      const validLines = [];

      for (const line of rawLines) {
        const n = norm(line);
        // Cegah duplikasi dengan stok yang sudah ada (sold & unsold) dan duplikasi dalam 1 input
        if (existingSet.has(n) || seenInBatch.has(n)) {
          rejectedCount++;
        } else {
          seenInBatch.add(n);
          validLines.push(line);
        }
      }

      addedCount = validLines.length;

      const todayStr = new Date().toLocaleDateString('id-ID');
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

      return {
        ...p,
        accountStock: updatedList,
        stockCount: availableCount,
        stockType: 'link_based',
        isAvailable: availableCount > 0
      };
    }));

    if (addedCount === 0 && rejectedCount > 0) {
      showToast('Gagal: Duplikasi Terdeteksi', `Semua ${rejectedCount} baris ditolak karena sudah pernah ada di stok (sold/unsold).`);
      return { success: false, added: 0, rejected: rejectedCount };
    } else if (rejectedCount > 0) {
      showToast('Import Selesai (Ada Duplikat)', `${addedCount} baris berhasil ditambahkan. ${rejectedCount} baris duplikat (sold/unsold) ditolak.`);
      return { success: true, added: addedCount, rejected: rejectedCount };
    } else {
      showToast('Import Berhasil', `${addedCount} baris akun/link unik berhasil dimasukkan.`);
      return { success: true, added: addedCount, rejected: 0 };
    }
  };

  // Delete a single stock item
  const deleteStockItem = (productId, stockItemId) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const updatedList = (p.accountStock || []).filter(s => s.id !== stockItemId);
      const availableCount = updatedList.filter(s => !s.isSold).length;
      return {
        ...p,
        accountStock: updatedList,
        stockCount: availableCount,
        isAvailable: availableCount > 0
      };
    }));
    showToast('Item Stok Dihapus', '1 baris stok berhasil dihapus.');
  };

  // Toggle sold status of a stock item
  const toggleStockSold = (productId, stockItemId) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const updatedList = (p.accountStock || []).map(s => {
        if (s.id === stockItemId) {
          const nextSold = !s.isSold;
          return {
            ...s,
            isSold: nextSold,
            soldTo: nextSold ? 'MANUAL-ADMIN' : null,
            soldAt: nextSold ? new Date().toLocaleDateString('id-ID') : null
          };
        }
        return s;
      });
      const availableCount = updatedList.filter(s => !s.isSold).length;
      return {
        ...p,
        accountStock: updatedList,
        stockCount: availableCount,
        isAvailable: availableCount > 0
      };
    }));
    showToast('Status Baris Diubah', 'Ketersediaan baris stok berhasil diperbarui.');
  };

  // License Management Actions
  const addLicense = (licenseData) => {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const prefix = (licenseData.productName || 'PROD').substring(0, 5).toUpperCase().replace(/[^A-Z]/g, '');
    const expiryCalc = calculateLicenseExpiry(licenseData.expiresAt || 'Selamanya (Lifetime)');
    const newLicense = {
      id: `LIC-${Date.now().toString().slice(-4)}`,
      code: licenseData.code || `DYARI-${prefix}-${randomHex}`,
      status: 'Aktif',
      ...licenseData,
      startDate: expiryCalc.startDate,
      createdAt: expiryCalc.createdAt,
      expiryDate: expiryCalc.expiryDate,
      expiresAt: expiryCalc.expiresAt,
      isLifetime: expiryCalc.isLifetime,
      durationLabel: expiryCalc.durationLabel
    };
    setLicenses(prev => [newLicense, ...prev]);
    showToast('Kunci Lisensi Diterbitkan', newLicense.code);
    return newLicense;
  };

  const updateLicenseStatus = (id, newStatus) => {
    setLicenses(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    showToast('Status Lisensi', `Status lisensi diubah menjadi ${newStatus}`);
  };

  const deleteLicense = (id) => {
    setLicenses(prev => prev.filter(l => l.id !== id));
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
      // Admin functions
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
      // Licenses management & utilities
      licenses,
      addLicense,
      updateLicenseStatus,
      deleteLicense,
      calculateLicenseExpiry,
      getLicenseEffectiveStatus
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
