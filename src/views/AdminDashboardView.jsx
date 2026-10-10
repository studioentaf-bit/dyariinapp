import React, { useState, useEffect } from 'react';
import { useStore, getProductAvailableStock } from '../context/StoreContext';
import { 
  Home, 
  Package, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  Download, 
  Key, 
  Tag, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  Calendar, 
  TrendingUp, 
  ArrowRight, 
  ChevronDown, 
  ChevronRight, 
  LogOut, 
  LogIn,
  Lock,
  Wallet, 
  Layers, 
  Sparkles, 
  Smartphone, 
  Gift,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Eye,
  Check,
  X,
  Filter,
  ShieldCheck,
  Percent,
  Save,
  RefreshCw,
  Phone,
  Copy,
  Clock,
  Palette,
  Receipt,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  QrCode,
  Building2,
  CheckCircle2,
  AlertCircle,
  Hash,
  Upload,
  Image,
  ArrowUpDown,
  FileText,
  DollarSign,
  PieChart,
  Activity,
  Layers3,
  Flame,
  Award,
  Share2,
  MessageCircle,
  Maximize2,
  Minimize2,
  Moon
} from 'lucide-react';

export const AdminDashboardView = () => {
  const { 
    products, 
    orders, 
    setOrders,
    customers, 
    setCustomers,
    coupons, 
    reviews, 
    storeSettings, 
    user,
    setUser,
    setDashboardTab,
    purchasedProductIds,
    setPurchasedProductIds,
    setActiveProductAccess,
    navigateTo, 
    showToast,
    openInvoice,
    getInvoiceUrl,
    sendInvoiceWhatsApp,
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
    licenses,
    addLicense,
    updateLicenseStatus,
    deleteLicense,
    calculateLicenseExpiry,
    getLicenseEffectiveStatus,
    licensePackages,
    addLicensePackage,
    updateLicensePackage,
    deleteLicensePackage,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    syncOrdersFromBackend
  } = useStore();

  // Navigation & Sub-tabs State (Persisten saat browser di-refresh)
  const [activeMenu, setActiveMenu] = useState(() => {
    try {
      const hash = window.location.hash || '';
      if (hash.includes('menu=')) {
        const query = hash.split('?')[1];
        if (query) {
          const params = new URLSearchParams(query);
          const m = params.get('menu');
          if (m) return m;
        }
      }
      const saved = localStorage.getItem('dyari_admin_active_menu');
      if (saved) return saved;
    } catch (_) {}
    return 'dashboard';
  });

  const [subTabProduk, setSubTabProduk] = useState(() => {
    try {
      const hash = window.location.hash || '';
      if (hash.includes('subtab=')) {
        const query = hash.split('?')[1];
        if (query) {
          const params = new URLSearchParams(query);
          const st = params.get('subtab');
          if (st) return st;
        }
      }
      const saved = localStorage.getItem('dyari_admin_subtab_produk');
      if (saved) return saved;
    } catch (_) {}
    return 'kelola-produk';
  });

  const [productSubAction, setProductSubAction] = useState('semua');

  const [subTabPengaturan, setSubTabPengaturan] = useState(() => {
    try {
      const hash = window.location.hash || '';
      if (hash.includes('settings_tab=')) {
        const query = hash.split('?')[1];
        if (query) {
          const params = new URLSearchParams(query);
          const st = params.get('settings_tab');
          if (st) return st;
        }
      }
      const saved = localStorage.getItem('dyari_admin_subtab_pengaturan');
      if (saved) return saved;
    } catch (_) {}
    return 'branding';
  });

  // Simpan menu aktif agar tidak kembali ke dashboard saat refresh
  useEffect(() => {
    try {
      localStorage.setItem('dyari_admin_active_menu', activeMenu);
      localStorage.setItem('dyari_admin_subtab_produk', subTabProduk);
      localStorage.setItem('dyari_admin_subtab_pengaturan', subTabPengaturan);
      let query = `menu=${activeMenu}`;
      if (activeMenu === 'produk-lisensi') query += `&subtab=${subTabProduk}`;
      if (activeMenu === 'pengaturan') query += `&settings_tab=${subTabPengaturan}`;
      if (window.location.hash.startsWith('#admin')) {
        window.history.replaceState(null, '', `#admin?${query}`);
      }
    } catch (_) {}
  }, [activeMenu, subTabProduk, subTabPengaturan]);

  // Sidebar Hide/Show State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({
    'produk-lisensi': true,
    'pengaturan': true
  });

  const [adminSearch, setAdminSearch] = useState('');
  const [hoveredHourIndex, setHoveredHourIndex] = useState(null);

  // Modals State
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [stockLinksInput, setStockLinksInput] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isInvoiceFullscreen, setIsInvoiceFullscreen] = useState(false);
  const [showAddLicenseModal, setShowAddLicenseModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [isCustomPackageDuration, setIsCustomPackageDuration] = useState(false);
  const [packageFormData, setPackageFormData] = useState({
    id: '',
    name: '',
    subtitle: '',
    duration: '30 Hari (1 Bulan)',
    price: 49000,
    originalPrice: 99000,
    badge: '',
    features: 'Akses penuh Storyboard Sinematik (5 Mode)\nPrompt Studio Imagen 3, Midjourney & Flux\nNeural Voice Over (TTS Bahasa Indonesia & Global)\nClient-side Video Tools & Merger\nSistem BYOK (Bring Your Own Key) tanpa limit\nRiwayat generate tersimpan lokal di browser',
    isPopular: false
  });

  // Dedicated Member & Product Access Modal States
  const [selectedMemberDetails, setSelectedMemberDetails] = useState(null);
  const [memberDetailTab, setMemberDetailTab] = useState('produk'); // 'produk' | 'lisensi' | 'pesanan'
  const [showGrantProductModal, setShowGrantProductModal] = useState(false);
  const [grantProductId, setGrantProductId] = useState('');
  const [showGrantLicenseModal, setShowGrantLicenseModal] = useState(false);
  const [grantLicenseDuration, setGrantLicenseDuration] = useState('1 Tahun (365 Hari)');
  const [grantLicenseType, setGrantLicenseType] = useState('PERSONAL');
  const [grantLicenseProductId, setGrantLicenseProductId] = useState('');

  // Category Management Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [categoryFormData, setCategoryFormData] = useState({
    id: '',
    name: '',
    icon: '📁',
    description: '',
    bgColor: '#E2EFE7',
    iconColor: '#2B5742'
  });

  // Close modals on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedOrderDetails(null);
        setSelectedMemberDetails(null);
        setShowGrantProductModal(false);
        setShowGrantLicenseModal(false);
        setShowProductModal(false);
        setShowCategoryModal(false);
        setMassImportModalProduct(null);
        setStockDetailsModalProduct(null);
        setStockModalProduct(null);
        setShowAddLicenseModal(false);
        setShowAddMemberModal(false);
        setShowImportBatchModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dedicated Modals for 3 Product Types Stock Management
  const [productTypeFilter, setProductTypeFilter] = useState('ALL'); // 'ALL' | 'APPS_PREMIUM' | 'DIGITAL_PREMIUM' | 'LICENSE_TOOL'
  const [adminProductSearch, setAdminProductSearch] = useState('');
  const [adminProductPage, setAdminProductPage] = useState(1);
  const adminProductsPerPage = 100;

  useEffect(() => {
    setAdminProductPage(1);
  }, [adminProductSearch, productTypeFilter]);

  const [isRefreshingQueue, setIsRefreshingQueue] = useState(false);

  // Auto-sync antrian order every 4 seconds when in Antrian Order tab
  useEffect(() => {
    if (activeMenu === 'antrian-order' && syncOrdersFromBackend) {
      syncOrdersFromBackend();
      const interval = setInterval(() => {
        syncOrdersFromBackend();
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activeMenu, syncOrdersFromBackend]);

  const handleRefreshQueue = async () => {
    setIsRefreshingQueue(true);
    try {
      if (syncOrdersFromBackend) await syncOrdersFromBackend();
      showToast('Sinkronisasi Sukses', 'Data antrian pesanan terbaru berhasil dimuat!');
    } catch (_) {
      showToast('Info', 'Gagal memuat antrian terbaru.');
    } finally {
      setTimeout(() => setIsRefreshingQueue(false), 500);
    }
  };

  // Dedicated State for Manajemen & Kontrol Stok Produk (Dark UI Form)
  const [stockProductFilter, setStockProductFilter] = useState('ALL');
  const [stockStatusFilter, setStockStatusFilter] = useState('ALL'); // 'ALL' | 'READY' | 'SOLD'
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [selectedStockKeys, setSelectedStockKeys] = useState([]); // array of 'productId:::stockId'
  const [showImportBatchModal, setShowImportBatchModal] = useState(false);
  const [importBatchTargetProductId, setImportBatchTargetProductId] = useState('');
  const [importBatchRawText, setImportBatchRawText] = useState('');

  const [massImportModalProduct, setMassImportModalProduct] = useState(null);
  const [massImportText, setMassImportText] = useState('');
  const [massImportMode, setMassImportMode] = useState('append'); // 'append' | 'replace'
  const [stockDetailsModalProduct, setStockDetailsModalProduct] = useState(null);
  const [newSingleStockInput, setNewSingleStockInput] = useState('');

  // Filter States
  const [txFilterPayment, setTxFilterPayment] = useState('all');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [licenseSearchQuery, setLicenseSearchQuery] = useState('');

  // Dashboard Analytics Timeframe Filter (Harian, Mingguan, Bulanan, Rentang Tertentu)
  const [dashboardTimeFilter, setDashboardTimeFilter] = useState('daily'); // 'daily' | 'weekly' | 'monthly' | 'custom'
  const [customDateStart, setCustomDateStart] = useState('2026-08-01');
  const [customDateEnd, setCustomDateEnd] = useState('2026-08-28');

  // Helper for generating full 24-hour activity points (every 1 hour from 00:00 to 24:00)
  const generate24HourlyPoints = (activeOrdersList = []) => {
    const hours = [
      '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
      '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
      '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
      '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'
    ];

    const hourCounts = new Array(25).fill(0);

    (activeOrdersList || []).forEach(o => {
      if (o.date) {
        const timeMatch = o.date.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          const h = parseInt(timeMatch[1], 10);
          if (h >= 0 && h <= 24) {
            hourCounts[h] = (hourCounts[h] || 0) + 1;
          }
        }
      }
    });

    const maxCount = Math.max(...hourCounts, 1);
    const hasTransactions = (activeOrdersList || []).length > 0;

    return hours.map((t, idx) => {
      const c = hasTransactions ? hourCounts[idx] : 0;
      const pct = hasTransactions && maxCount > 0 ? Math.round((c / maxCount) * 100) : 0;
      return {
        time: t,
        label: `${t} WIB`,
        count: c,
        percent: pct,
        isPeak: hasTransactions && c > 0 && c === maxCount
      };
    });
  };

  // Helper for synchronized 24h activity chart & product sales trend chart (100% DINAMIS DARI DATA ORDER RIIL)
  const getAnalyticsData = () => {
    const isPaid = (o) => o.status === 'Lunas' || o.status === 'Selesai';
    const relevantOrders = (orders || []).filter(isPaid);

    // Kumpulkan seluruh item yang dibeli dari pesanan yang sah
    const soldItems = [];
    relevantOrders.forEach(o => {
      (o.items || []).forEach(it => {
        soldItems.push({
          ...it,
          orderTotal: o.total
        });
      });
    });

    const totalSales = relevantOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalUnits = soldItems.reduce((sum, it) => sum + (it.quantity || 1), 0);

    // Peringkat produk terlaris
    const productStatsMap = new Map();
    soldItems.forEach(it => {
      const match = (products || []).find(p => p.id === it.id || p.name === it.name) || it;
      const key = match.name || it.name || 'Produk Digital';
      const existing = productStatsMap.get(key) || {
        name: key,
        category: match.categoryName || match.category || 'Aset Digital',
        units: 0,
        revenue: 0,
        image: match.image || it.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'
      };
      const qty = it.quantity || 1;
      const unitPrice = it.price || match.price || 0;
      existing.units += qty;
      existing.revenue += unitPrice * qty;
      productStatsMap.set(key, existing);
    });

    const topProducts = Array.from(productStatsMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(p => ({
        ...p,
        percent: totalSales > 0 ? Math.round((p.revenue / totalSales) * 100) : 0
      }));

    const periodConfig = {
      daily: {
        title: 'Harian (24 Jam Terakhir)',
        periodLabel: 'Hari Ini (24 Jam)',
        trendLabels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '23:59']
      },
      weekly: {
        title: 'Mingguan (7 Hari Terakhir)',
        periodLabel: '7 Hari Terakhir',
        trendLabels: ['H-6', 'H-5', 'H-4', 'H-3', 'H-2', 'Kemarin', 'Hari Ini']
      },
      monthly: {
        title: 'Bulanan (30 Hari Terakhir)',
        periodLabel: '30 Hari Terakhir',
        trendLabels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4']
      },
      custom: {
        title: `Rentang Kustom (${customDateStart} s/d ${customDateEnd})`,
        periodLabel: `${customDateStart} s/d ${customDateEnd}`,
        trendLabels: ['Periode Awal', 'Periode Tengah', 'Periode Akhir']
      }
    }[dashboardTimeFilter] || {
      title: 'Harian (24 Jam Terakhir)',
      periodLabel: 'Hari Ini (24 Jam)',
      trendLabels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '23:59']
    };

    // Buat kurva pendapatan berdasarkan data riil
    let trendRevenue = new Array(periodConfig.trendLabels.length).fill(0);
    if (totalSales > 0) {
      trendRevenue[trendRevenue.length - 1] = totalSales;
    }

    const hourlyPoints = generate24HourlyPoints(relevantOrders);

    return {
      title: periodConfig.title,
      periodLabel: periodConfig.periodLabel,
      totalSales,
      totalUnits,
      peakHourText: totalSales > 0 ? 'Data jam transaksi terdata' : 'Belum ada transaksi',
      peakBadge: totalSales > 0 ? '✓ Transaksi Aktif Terdata' : 'Menunggu Transaksi Pertama',
      advice: totalSales > 0 
        ? `Tercatat total omset Rp ${totalSales.toLocaleString('id-ID')} dari ${totalUnits} unit produk digital yang berhasil terjual.`
        : 'Belum ada transaksi penjualan pada periode ini. Kurva pendapatan dan daftar produk terlaris akan otomatis terisi secara real-time begitu pesanan pembeli masuk dan terkonfirmasi lunas.',
      hourlyPoints,
      trendLabels: periodConfig.trendLabels,
      trendRevenue,
      topProducts
    };
  };

  // Image upload helper (converts to base64 Data URL)
  const handleImageUpload = (file, callback) => {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran file maksimal 3MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Product Form State with costPrice, afterPurchaseMessage, sortOrder
  const [productFormData, setProductFormData] = useState({
    name: '',
    tagline: '',
    category: 'aset-premium',
    categoryName: 'Aset Premium',
    subcategory: 'Aset Premium · Akses',
    type: 'AKSES MEMBER',
    price: 35000,
    originalPrice: 75000,
    costPrice: 10000,
    afterPurchaseMessage: 'Terima kasih telah berbelanja di dyari.in! Akses file master & materi dapat langsung dibuka melalui tautan di atas.',
    sortOrder: 1,
    badge: 'NEW',
    badgeColor: 'bg-[#61A87D] text-white',
    image: '',
    accessUrl: '',
    stockType: 'link_based',
    stockCount: 0,
    description: '',
    features: ['Akses Instan Seumur Hidup', 'Format File Kompatibel', 'Panduan Penggunaan Lengkap']
  });

  // License Generator Form State
  const [licenseFormData, setLicenseFormData] = useState({
    productId: products.find(p => p.category === 'tools-ai' || p.productType === 'LICENSE_TOOL')?.id || products[0]?.id || 'tools-pro',
    productName: products.find(p => p.category === 'tools-ai' || p.productType === 'LICENSE_TOOL')?.name || products[0]?.name || 'Tools Pro',
    customerName: '',
    customerEmail: '',
    type: 'PERSONAL',
    expiresAt: 'Selamanya (Lifetime)',
    code: ''
  });

  // Coupon Form State
  const [couponFormData, setCouponFormData] = useState({
    code: '',
    discount: 20,
    type: 'percent',
    minSpend: 40000
  });

  // Customer / Member Form State
  const [customerFormData, setCustomerFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: 'Member Langganan Digital'
  });

  // Settings Sub-forms
  const [brandingForm, setBrandingForm] = useState({
    storeName: storeSettings?.branding?.storeName || storeSettings?.storeName || 'dyari.in',
    tagline: storeSettings?.branding?.tagline || storeSettings?.tagline || 'Produk digital untuk membuat keseharian lebih rapi, produktif, kreatif, dan terasa lebih mudah.',
    logoBadge: storeSettings?.branding?.logoBadge || 'dy',
    logoUrl: storeSettings?.branding?.logoUrl || storeSettings?.logoUrl || '',
    heroTitle: storeSettings?.branding?.heroTitle || storeSettings?.heroTitle || 'Bikin keseharianmu jadi sedikit lebih mudah.',
    heroSubtitle: storeSettings?.branding?.heroSubtitle || storeSettings?.heroSubtitle || 'Template, tools, prompt & berbagai resource digital yang dirancang untuk membantu kamu mengatur, berkarya, dan berkembang.',
    announcement: storeSettings?.branding?.announcement || storeSettings?.announcement || 'Promo Spesial: Diskon hingga 50% untuk Semua Bundel & Template Digital!',
    showAnnouncement: storeSettings?.branding?.showAnnouncement !== undefined ? storeSettings?.branding?.showAnnouncement : true
  });

  const [contactForm, setContactForm] = useState({
    whatsapp: storeSettings?.contact?.whatsapp || storeSettings?.whatsapp || '6282330626054',
    email: storeSettings?.contact?.email || storeSettings?.email || 'halo@dyari.in',
    instagram: storeSettings?.contact?.instagram || '@dyari.in',
    tiktok: storeSettings?.contact?.tiktok || '@dyari.in',
    telegram: storeSettings?.contact?.telegram || 't.me/dyari_community',
    operationalHours: storeSettings?.contact?.operationalHours || 'Senin - Minggu (08.00 - 22.00 WIB)'
  });

  const [paymentForm, setPaymentForm] = useState({
    qrisActive: storeSettings?.payment?.qrisActive ?? true,
    qrisName: storeSettings?.payment?.qrisName || 'DYARI DIGITAL INDONESIA',
    qrisNmid: storeSettings?.payment?.qrisNmid || 'ID1020304050607',
    qrisImageUrl: storeSettings?.payment?.qrisImageUrl || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
    gatewayActive: storeSettings?.payment?.gatewayActive ?? true,
    gatewayProvider: storeSettings?.payment?.gatewayProvider || 'Midtrans & Tripay Direct API',
    gatewayMerchantId: storeSettings?.payment?.gatewayMerchantId || 'G-DYARI-99182',
    gatewayApiKey: storeSettings?.payment?.gatewayApiKey || 'SB-Mid-server-881920391283',
    virtualAccounts: storeSettings?.payment?.virtualAccounts || [
      { bank: 'BCA', accNo: '8210984123', accName: 'Tony Anggoro (dyari.in)', active: true },
      { bank: 'Mandiri', accNo: '1370019284192', accName: 'Tony Anggoro (dyari.in)', active: true },
      { bank: 'BNI', accNo: '0281928172', accName: 'Tony Anggoro (dyari.in)', active: true },
      { bank: 'BRI', accNo: '00192837482910', accName: 'Tony Anggoro (dyari.in)', active: true }
    ],
    ewallets: storeSettings?.payment?.ewallets || [
      { name: 'GoPay', phone: '082330626054', nameAccount: 'Tony Anggoro', active: true },
      { name: 'OVO', phone: '082330626054', nameAccount: 'Tony Anggoro', active: true },
      { name: 'DANA', phone: '082330626054', nameAccount: 'Tony Anggoro', active: true },
      { name: 'ShopeePay', phone: '082330626054', nameAccount: 'Tony Anggoro', active: true }
    ]
  });

  // Calculate order metrics & 7 KPIs
  const paidOrders = orders.filter(o => o.status === 'Lunas');
  const pendingOrders = orders.filter(o => o.status !== 'Lunas');
  
  // 1. Total Omset
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // 2. Total Modal (Cost)
  const totalCost = paidOrders.reduce((sum, o) => {
    const orderCost = o.items?.reduce((iSum, it) => {
      const match = products.find(p => p.id === it.id || p.name === it.name);
      const unitCost = match?.costPrice !== undefined ? match.costPrice : (it.costPrice || Math.round((it.price || 0) * 0.25));
      return iSum + unitCost;
    }, 0) || Math.round((o.total || 0) * 0.25);
    return sum + orderCost;
  }, 0);

  // 3. Total Laba Bersih
  const totalNetProfit = Math.max(0, totalRevenue - totalCost);

  // 4. Total Member
  const totalMembers = customers.length;

  // 5. Total Produk Digital Dijual
  const totalDigitalProducts = products.length;

  // 6. Total Lisensi Terjual
  const totalLicenses = licenses?.length || 0;

  // 7. Total Paket Bundling
  const totalBundling = products.filter(p => 
    p.category === 'bundling' || 
    p.badge === 'BUNDLE' || 
    p.name?.toLowerCase().includes('bundl') || 
    p.categoryName?.toLowerCase().includes('bundl')
  ).length || 0;

  // Toggle Dropdown
  const toggleDropdown = (key) => {
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper for opening edit product popup modal
  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    const pType = prod.productType || (
      prod.type === 'LISENSI' 
        ? 'LICENSE_TOOL' 
        : (prod.category === 'aplikasi' ? 'APPS_PREMIUM' : 'DIGITAL_PREMIUM')
    );
    setProductFormData({
      name: prod.name || '',
      tagline: prod.tagline || '',
      category: prod.category || (categories[0]?.id || 'aset-premium'),
      categoryName: prod.categoryName || (categories[0]?.name || 'Aset Premium'),
      subcategory: prod.subcategory || `${prod.categoryName || 'Aset Premium'} · Akses`,
      type: prod.type || (pType === 'LICENSE_TOOL' ? 'LISENSI' : (pType === 'APPS_PREMIUM' ? 'AKSES PREMIUM' : 'AKSES MEMBER')),
      productType: pType,
      licensePrefix: prod.licensePrefix || 'TOOL',
      licenseDuration: prod.licenseDuration || 'LIFETIME',
      targetTool: prod.targetTool || prod.name || '',
      price: prod.price || 0,
      originalPrice: prod.originalPrice || '',
      costPrice: prod.costPrice !== undefined ? prod.costPrice : Math.round((prod.price || 0) * 0.25),
      afterPurchaseMessage: prod.afterPurchaseMessage || (
        pType === 'APPS_PREMIUM' 
          ? 'Akun/link eksklusif Anda tertera di atas. Harap simpan kredensial ini karena link/akun ini 1x pakai khusus Anda.'
          : (pType === 'LICENSE_TOOL' 
              ? 'Kunci lisensi akses tools Anda tertera di atas. Gunakan kode tersebut saat login ke software/tools.'
              : 'Terima kasih telah berbelanja di dyari.in! Akses file master & bonus Anda dapat langsung dibuka melalui tautan di atas.')
      ),
      sortOrder: prod.sortOrder || 1,
      badge: prod.badge || 'NONE',
      badgeColor: prod.badgeColor || 'bg-coral text-white',
      image: prod.image || '',
      accessUrl: prod.accessUrl || '',
      stockType: prod.stockType || 'link_based',
      stockCount: getProductAvailableStock(prod),
      accountStock: prod.accountStock || [],
      massStockInput: '',
      description: prod.description || '',
      features: prod.features && prod.features.length > 0 ? prod.features : ['Akses Instan Seumur Hidup']
    });
    setShowProductModal(true);
  };

  const handleOpenAddProduct = () => {
    handleResetProductForm();
    setShowProductModal(true);
  };

  const handleResetProductForm = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      tagline: '',
      category: categories[0]?.id || 'aset-premium',
      categoryName: categories[0]?.name || 'Aset Premium',
      subcategory: `${categories[0]?.name || 'Aset Premium'} · Akses`,
      type: 'AKSES MEMBER',
      productType: 'DIGITAL_PREMIUM',
      licensePrefix: 'TOOL',
      licenseDuration: 'LIFETIME',
      targetTool: '',
      price: 35000,
      originalPrice: 75000,
      costPrice: 10000,
      afterPurchaseMessage: 'Terima kasih telah berbelanja di dyari.in! Akses link master & bonus Anda dapat langsung diakses melalui tautan di atas.',
      sortOrder: (products.length + 1),
      badge: 'NEW',
      badgeColor: 'bg-[#61A87D] text-white',
      image: '',
      accessUrl: '',
      stockType: 'link_based',
      stockCount: 0,
      accountStock: [],
      massStockInput: '',
      description: '',
      features: ['Akses Instan Seumur Hidup', 'Format File Kompatibel', 'Panduan Penggunaan Lengkap']
    });
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productFormData.name.trim()) return;

    // determine badgeColor
    let bColor = 'bg-coral text-white';
    if (productFormData.badge === 'NEW') bColor = 'bg-[#61A87D] text-white';
    if (productFormData.badge === 'BEST SELLER') bColor = 'bg-amber-600 text-white';
    if (productFormData.badge === 'HOT') bColor = 'bg-rose-600 text-white';
    if (productFormData.badge === 'BUNDLE') bColor = 'bg-purple-600 text-white';
    if (productFormData.badge === 'SALE') bColor = 'bg-blue-600 text-white';

    let accountStock = editingProduct?.accountStock ? [...editingProduct.accountStock] : (productFormData.accountStock || []);
    let stockCount = productFormData.stockCount;
    let stockType = productFormData.stockType;

    if (productFormData.productType === 'APPS_PREMIUM') {
      stockType = 'link_based';
      if (productFormData.massStockInput && productFormData.massStockInput.trim().length > 0) {
        const rawLines = productFormData.massStockInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const norm = (s) => (s || '').trim().toLowerCase();
        // Bandingkan dengan seluruh stok yang sudah ada (baik sold maupun unsold)
        const existingSet = new Set(accountStock.map(s => norm(s.text)));
        const seenInBatch = new Set();
        const validLines = [];
        let duplicateCount = 0;

        for (const line of rawLines) {
          const n = norm(line);
          if (existingSet.has(n) || seenInBatch.has(n)) {
            duplicateCount++;
          } else {
            seenInBatch.add(n);
            validLines.push(line);
          }
        }

        if (validLines.length > 0) {
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
          accountStock = [...accountStock, ...newItems];
        }

        if (duplicateCount > 0) {
          showToast('Proteksi Duplikasi', `${duplicateCount} baris akun/link ditolak karena sudah ada di stok (sold/unsold).`);
        }
      }
      stockCount = accountStock.filter(s => !s.isSold).length;
    } else if (productFormData.productType === 'LICENSE_TOOL') {
      stockType = 'license';
      stockCount = 'Unlimited';
    } else {
      stockType = 'link_based';
      stockCount = accountStock.filter(s => !s.isSold).length;
    }

    const payload = {
      ...productFormData,
      targetTool: productFormData.name.trim() || 'Tools',
      stockType,
      stockCount,
      accountStock,
      isAvailable: stockType === 'license' ? true : (stockCount > 0),
      badge: productFormData.badge === 'NONE' ? '' : productFormData.badge,
      badgeColor: bColor
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      showToast('Produk Diperbarui', productFormData.name);
    } else {
      addProduct(payload);
      showToast('Produk Diterbitkan', productFormData.name);
    }
    setShowProductModal(false);
    handleResetProductForm();
  };

  // Helper for Mass Import Modal
  const handleOpenMassImport = (prod) => {
    setMassImportModalProduct(prod);
    setMassImportText('');
    setMassImportMode('append');
  };

  const handleSaveMassImport = () => {
    if (!massImportModalProduct) return;
    importMassStock(massImportModalProduct.id, massImportText, massImportMode);
    setMassImportModalProduct(null);
  };

  // Helper for Stock Details Modal (inspect each line, toggle sold, delete)
  const handleOpenStockDetails = (prod) => {
    setStockDetailsModalProduct(prod);
    setNewSingleStockInput('');
  };

  const handleAddSingleStock = () => {
    if (!stockDetailsModalProduct || !newSingleStockInput.trim()) return;
    importMassStock(stockDetailsModalProduct.id, newSingleStockInput.trim(), 'append');
    setNewSingleStockInput('');
  };

  // Helper for Link-based stock modal
  const handleOpenStockModal = (prod) => {
    setStockModalProduct(prod);
    const existingLinks = prod.stockLinks ? prod.stockLinks.join('\n') : '';
    setStockLinksInput(existingLinks);
  };

  const handleSaveStockLinks = () => {
    if (!stockModalProduct) return;
    const links = stockLinksInput
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    updateProductStock(stockModalProduct.id, {
      stockLinks: links,
      stockCount: links.length,
      stockType: 'link_based',
      isAvailable: links.length > 0
    });

    showToast('Stok Link Disimpan', `${stockModalProduct.name}: ${links.length} stok link terdaftar.`);
    setStockModalProduct(null);
  };

  // Helper for Category Management
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      id: '',
      name: '',
      icon: '📁',
      description: '',
      bgColor: '#E2EFE7',
      iconColor: '#2B5742'
    });
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryFormData({
      id: cat.id,
      name: cat.name,
      icon: cat.icon || '📁',
      description: cat.description || '',
      bgColor: cat.bgColor || '#E2EFE7',
      iconColor: cat.iconColor || '#2B5742'
    });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) {
      showToast('Error', 'Nama kategori tidak boleh kosong!');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: categoryFormData.name.trim(),
        icon: categoryFormData.icon.trim() || '📁',
        description: categoryFormData.description.trim(),
        bgColor: categoryFormData.bgColor,
        iconColor: categoryFormData.iconColor
      });
    } else {
      const generatedId = categoryFormData.id.trim()
        ? categoryFormData.id.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
        : categoryFormData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

      if (categories.some(c => c.id === generatedId)) {
        showToast('Error', `ID/Slug "${generatedId}" sudah dipakai oleh kategori lain!`);
        return;
      }

      addCategory({
        id: generatedId,
        name: categoryFormData.name.trim(),
        icon: categoryFormData.icon.trim() || '📁',
        description: categoryFormData.description.trim(),
        bgColor: categoryFormData.bgColor,
        iconColor: categoryFormData.iconColor
      });
    }

    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (cat) => {
    const linkedProducts = products.filter(p => p.category === cat.id);
    const confirmMsg = linkedProducts.length > 0
      ? `Kategori "${cat.name}" memiliki ${linkedProducts.length} produk terkait. Hapus kategori ini tetap?`
      : `Hapus kategori "${cat.name}"?`;

    if (window.confirm(confirmMsg)) {
      deleteCategory(cat.id);
    }
  };

  // --- HANDLERS UNTUK PAKET & TIER LISENSI (TAMBAH, EDIT, HAPUS BEBAS OLEH ADMIN) ---
  const handleOpenAddPackage = () => {
    setEditingPackage(null);
    setIsCustomPackageDuration(false);
    setPackageFormData({
      id: '',
      name: '',
      subtitle: '',
      duration: '30 Hari (1 Bulan)',
      price: 49000,
      originalPrice: 99000,
      badge: '',
      features: 'Akses penuh Storyboard Sinematik (5 Mode)\nPrompt Studio Imagen 3, Midjourney & Flux\nNeural Voice Over (TTS Bahasa Indonesia & Global)\nClient-side Video Tools & Merger\nSistem BYOK (Bring Your Own Key) tanpa limit\nRiwayat generate tersimpan lokal di browser',
      isPopular: false
    });
    setShowPackageModal(true);
  };

  const handleOpenEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setIsCustomPackageDuration(false);
    setPackageFormData({
      id: pkg.id,
      name: pkg.name,
      subtitle: pkg.subtitle || '',
      duration: pkg.duration || pkg.period || '30 Hari',
      price: pkg.price || 0,
      originalPrice: pkg.originalPrice || pkg.price || 0,
      badge: pkg.badge || '',
      features: Array.isArray(pkg.features) ? pkg.features.join('\n') : (pkg.features || ''),
      isPopular: Boolean(pkg.isPopular)
    });
    setShowPackageModal(true);
  };

  const handleSavePackage = (e) => {
    e.preventDefault();
    if (!packageFormData.name.trim()) return;

    const feats = packageFormData.features
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      name: packageFormData.name.trim(),
      subtitle: packageFormData.subtitle.trim(),
      duration: packageFormData.duration.trim(),
      period: packageFormData.duration.trim(),
      price: Number(packageFormData.price) || 0,
      originalPrice: Number(packageFormData.originalPrice) || Number(packageFormData.price) || 0,
      badge: packageFormData.badge.trim(),
      features: feats,
      isPopular: Boolean(packageFormData.isPopular)
    };

    if (editingPackage) {
      updateLicensePackage(editingPackage.id, payload);
    } else {
      addLicensePackage({
        id: `pkg-${Date.now()}`,
        ...payload
      });
    }

    setShowPackageModal(false);
  };

  const handleDeletePackage = (pkg) => {
    if (window.confirm(`Hapus paket lisensi "${pkg.name}"? Paket ini tidak akan lagi tampil di halaman lisensi atau formulir.`)) {
      deleteLicensePackage(pkg.id);
    }
  };

  // Helper for generating new license / Story Generator member license
  const handleCreateLicense = (e) => {
    e.preventDefault();
    if (!licenseFormData.customerEmail) return;

    const randomHex = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const prefix = 'STORY';
    const code = (licenseFormData.code.trim() || `DYARI-${prefix}-${randomHex()}-${randomHex()}`).toUpperCase();

    addLicense({
      ...licenseFormData,
      productName: licenseFormData.productName || 'Story Generator Pro AI',
      productId: licenseFormData.productId || 'story-generator',
      code
    });

    setShowAddLicenseModal(false);
    setIsCustomPackageDuration(false);
    setLicenseFormData({
      productId: 'story-generator',
      productName: 'Story Generator Pro AI',
      customerName: '',
      customerEmail: '',
      type: 'PERSONAL',
      expiresAt: 'Selamanya (Lifetime)',
      code: ''
    });
  };

  // --- HELPER UNTUK RINCIAN AKSES & PRODUK MEMBER ---
  const getCustomerPurchasedData = (c) => {
    if (!c) return { customerOrders: [], purchasedProducts: [], memberLicenses: [] };
    const cEmail = (c.email || '').toLowerCase().trim();
    const cName = (c.name || '').toLowerCase().trim();

    // 1. Pesanan terkait email atau nama
    const customerOrders = orders.filter(o => {
      const oEmail = (o.email || '').toLowerCase().trim();
      const oCustomer = (o.customer || o.customerName || '').toLowerCase().trim();
      return (cEmail && oEmail === cEmail) || (cName && oCustomer === cName);
    });

    // 2. Kumpulkan produk dari order yang berstatus Lunas maupun pending
    const map = new Map();
    customerOrders.forEach(o => {
      (o.items || []).forEach(it => {
        const prodMatch = products.find(p => p.id === it.id || p.name === it.name) || {};
        const key = it.id || it.name || prodMatch.id;
        if (key && !map.has(key)) {
          map.set(key, {
            id: it.id || prodMatch.id || key,
            name: it.name || prodMatch.name || 'Produk Digital',
            price: it.price || prodMatch.price || 0,
            productType: it.productType || prodMatch.productType || 'DIGITAL_PREMIUM',
            category: prodMatch.category || 'aset-premium',
            categoryName: prodMatch.categoryName || 'Aset Digital',
            image: prodMatch.image || it.image,
            accessUrl: it.masterAccessUrl || prodMatch.accessUrl || '',
            assignedAccount: it.assignedAccount || '',
            generatedLicense: it.generatedLicense || '',
            orderId: o.id,
            orderDate: o.date,
            orderStatus: o.status,
            paymentMethod: o.paymentMethod
          });
        }
      });
    });

    // 3. Sinkronkan produk demo jika user sedang aktif
    if (user && ((cEmail && user.email?.toLowerCase() === cEmail) || (cName && user.name?.toLowerCase() === cName))) {
      (purchasedProductIds || []).forEach(pId => {
        if (!map.has(pId)) {
          const pMatch = products.find(p => p.id === pId);
          if (pMatch) {
            map.set(pId, {
              id: pMatch.id,
              name: pMatch.name,
              price: pMatch.price,
              productType: pMatch.productType || 'DIGITAL_PREMIUM',
              category: pMatch.category,
              categoryName: pMatch.categoryName,
              image: pMatch.image,
              accessUrl: pMatch.accessUrl,
              assignedAccount: '',
              generatedLicense: '',
              orderId: '#DY-MEMBERSHIP',
              orderDate: 'Akses Terdaftar',
              orderStatus: 'Lunas',
              paymentMethod: 'Membership Terdaftar'
            });
          }
        }
      });
    }

    const purchasedProducts = Array.from(map.values());

    // 4. Lisensi milik member
    const memberLicenses = (licenses || []).filter(lic => {
      const lEmail = (lic.customerEmail || '').toLowerCase().trim();
      const lName = (lic.customerName || '').toLowerCase().trim();
      return (cEmail && lEmail === cEmail) || (cName && lName === cName);
    });

    return {
      customerOrders,
      purchasedProducts,
      memberLicenses
    };
  };

  const handleOpenMemberArea = (customer) => {
    if (!customer) return;
    const { purchasedProducts } = getCustomerPurchasedData(customer);
    const pIds = purchasedProducts.map(p => p.id);
    setUser({
      name: customer.name,
      email: customer.email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      stats: {
        products: purchasedProducts.length,
        orders: customer.orderCount || 1,
        downloads: Math.max(1, purchasedProducts.length * 3)
      },
      notifications: { email: true, productUpdates: true }
    });
    if (setPurchasedProductIds && pIds.length > 0) {
      setPurchasedProductIds(pIds);
    }
    if (pIds.length > 0 && setActiveProductAccess) {
      setActiveProductAccess(pIds[0]);
    }
    setDashboardTab('ringkasan');
    navigateTo('dashboard');
    showToast('Masuk Area Member', `Sedang melihat dashboard atas nama ${customer.name}`);
  };

  const handleGrantProductDirect = (customer, prodId) => {
    if (!customer || !prodId) return;
    const targetProd = products.find(p => p.id === prodId);
    if (!targetProd) return;
    const newOrderId = `#DY-MANUAL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrderDate = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    const newOrder = {
      id: newOrderId,
      date: newOrderDate,
      customer: customer.name,
      customerName: customer.name,
      email: customer.email,
      phone: customer.phone || '081234567890',
      items: [
        {
          id: targetProd.id,
          name: targetProd.name,
          price: targetProd.price,
          productType: targetProd.productType || 'DIGITAL_PREMIUM',
          masterAccessUrl: targetProd.accessUrl,
          afterPurchaseMessage: targetProd.afterPurchaseMessage || ''
        }
      ],
      total: targetProd.price,
      paymentMethod: 'Pemberian Akses Admin (Free)',
      status: 'Lunas'
    };
    setOrders(prev => [newOrder, ...prev]);
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, orderCount: (c.orderCount || 0) + 1, totalSpent: (c.totalSpent || 0) + targetProd.price } : c));
    showToast('Akses Produk Diberikan', `${targetProd.name} berhasil ditambahkan ke akun ${customer.name}`);
    setShowGrantProductModal(false);
    setGrantProductId('');
  };

  const handleGrantLicenseDirect = (customer, prodId, duration, type) => {
    if (!customer) return;
    const targetProd = products.find(p => p.id === prodId) || products[0];
    const prefix = (targetProd?.licensePrefix || targetProd?.name?.slice(0, 3) || 'TOOL').toUpperCase().replace(/[^A-Z]/g, '');
    const code = `DYARI-${prefix || 'TOOL'}-${customer.name.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const calc = calculateLicenseExpiry(duration, new Date());
    const newLicense = {
      id: `LIC-${Date.now()}`,
      code,
      productId: targetProd?.id || 'tool-license',
      productName: targetProd?.name || 'Akses Lisensi Premium',
      customerEmail: customer.email,
      customerName: customer.name,
      type: type || 'PERSONAL',
      status: 'Aktif',
      startDate: calc.startDate,
      createdAt: calc.createdAt,
      expiryDate: calc.expiryDate,
      expiresAt: calc.expiresAt,
      isLifetime: calc.isLifetime,
      durationLabel: calc.durationLabel
    };
    addLicense(newLicense);
    showToast('Lisensi Diterbitkan', `Kode ${code} untuk ${customer.name}`);
    setShowGrantLicenseModal(false);
  };

  // Save Settings Handlers
  const handleSaveBranding = (e) => {
    e.preventDefault();
    updateStoreSettings({ branding: brandingForm });
    showToast('Branding Toko Disimpan', 'Tampilan website publik telah diperbarui.');
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    updateStoreSettings({ contact: contactForm });
    showToast('Kontak Disimpan', 'Informasi kontak dan CS toko telah diperbarui.');
  };

  const handleSavePayment = (e) => {
    e.preventDefault();
    updateStoreSettings({ payment: paymentForm });
    showToast('Pengaturan Pembayaran Disimpan', 'Metode pembayaran toko telah diperbarui.');
  };

  // Menu items specification as requested by user
  const sidebarMenuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home 
    },
    { 
      id: 'transaksi', 
      label: 'Riwayat Transaksi', 
      icon: Receipt,
      badge: paidOrders.length 
    },
    { 
      id: 'antrian-order', 
      label: 'Antrian Order', 
      icon: Clock,
      badge: pendingOrders.length,
      badgeColor: 'bg-amber-500 text-white animate-pulse'
    },
    { 
      id: 'member', 
      label: 'Member Story AI', 
      icon: Users,
      badge: licenses.length
    },
    { 
      id: 'produk-lisensi', 
      label: 'Produk & Lisensi', 
      icon: Package,
      hasChildren: true,
      children: [
        { id: 'kelola-produk', label: 'Kelola Produk' },
        { id: 'kelola-kategori', label: 'Kelola Kategori' },
        { id: 'manajemen-stok', label: 'Manajemen Stok' },
        { id: 'kelola-lisensi', label: 'Kelola Lisensi' }
      ]
    },
    { 
      id: 'kupon', 
      label: 'Kupon & Promo', 
      icon: Tag,
      badge: coupons.length 
    },
    { 
      id: 'pengaturan', 
      label: 'Pengaturan', 
      icon: Settings,
      hasChildren: true,
      children: [
        { id: 'branding', label: 'Branding Web' },
        { id: 'kontak', label: 'Kontak' },
        { id: 'pembayaran', label: 'Pengaturan Pembayaran' },
        { id: 'keamanan', label: 'Keamanan Akun Admin' }
      ]
    }
  ];

  // ========================================================
  // ADMIN AUTHENTICATION GUARD (GERBANG LOGIN ADMIN AMAN)
  // ========================================================
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('dyari_admin_session') === 'authenticated';
  });
  const [adminAuthForm, setAdminAuthForm] = useState({ email: '', password: '' });
  const [adminAuthError, setAdminAuthError] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Kredensial Admin Master Default (Aman & Bukan Publik)
  const MASTER_ADMIN_EMAIL = 'owner@dyariapp.my.id';
  const MASTER_ADMIN_PASS = 'Dyari#Master9981!Secure';

  // State untuk form ubah kredensial di tab Pengaturan -> Keamanan
  const [adminSecurityForm, setAdminSecurityForm] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('dyari_custom_admin') || '{}');
    return {
      email: saved.email || MASTER_ADMIN_EMAIL,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  });

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminAuthError('');
    setIsAuthLoading(true);

    try {
      const inputEmail = adminAuthForm.email.trim().toLowerCase();
      const inputPass = adminAuthForm.password;

      // 1. Coba verifikasi ke backend API jika aktif
      const apiRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputEmail, password: inputPass })
      }).catch(() => null);

      if (apiRes && apiRes.ok) {
        const data = await apiRes.json();
        if (data.user && data.user.role === 'admin') {
          localStorage.setItem('dyari_admin_session', 'authenticated');
          if (data.token) localStorage.setItem('dyari_auth_token', data.token);
          setIsAdminAuthenticated(true);
          showToast('Login Admin Berhasil', 'Selamat datang di Panel Kontrol Administrator!');
          setIsAuthLoading(false);
          return;
        }
      }

      // 2. Verifikasi kredensial master terenkripsi/tersimpan
      const savedAdmin = JSON.parse(localStorage.getItem('dyari_custom_admin') || '{}');
      const validEmail = (savedAdmin.email || MASTER_ADMIN_EMAIL).toLowerCase();
      const validPass = savedAdmin.password || MASTER_ADMIN_PASS;

      if (inputEmail === validEmail && inputPass === validPass) {
        localStorage.setItem('dyari_admin_session', 'authenticated');
        setIsAdminAuthenticated(true);
        showToast('Login Berhasil', 'Akses panel administrator diberikan.');
      } else {
        setAdminAuthError('Email atau kata sandi administrator salah. Akses ditolak.');
      }
    } catch {
      setAdminAuthError('Terjadi kesalahan verifikasi sistem.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('dyari_admin_session');
    localStorage.removeItem('dyari_auth_token');
    setIsAdminAuthenticated(false);
    setAdminAuthForm({ email: '', password: '' });
    showToast('Admin Terkunci', 'Sesi panel administrator telah dikunci kembali.');
  };

  const handleSaveAdminSecurity = (e) => {
    e.preventDefault();
    const savedAdmin = JSON.parse(localStorage.getItem('dyari_custom_admin') || '{}');
    const validPass = savedAdmin.password || MASTER_ADMIN_PASS;

    if (adminSecurityForm.currentPassword !== validPass) {
      showToast('Gagal', 'Kata sandi lama yang Anda masukkan tidak sesuai.');
      return;
    }

    if (adminSecurityForm.newPassword) {
      if (adminSecurityForm.newPassword.length < 8) {
        showToast('Gagal', 'Kata sandi baru minimal 8 karakter.');
        return;
      }
      if (adminSecurityForm.newPassword !== adminSecurityForm.confirmPassword) {
        showToast('Gagal', 'Konfirmasi kata sandi baru tidak cocok.');
        return;
      }
    }

    const updated = {
      email: adminSecurityForm.email.trim(),
      password: adminSecurityForm.newPassword || validPass
    };

    localStorage.setItem('dyari_custom_admin', JSON.stringify(updated));
    setAdminSecurityForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    showToast('Kredensial Disimpan', 'Email & kata sandi admin berhasil diperbarui dengan aman.');
  };

  // Sinkronisasi otomatis data Member dari PostgreSQL Database ke Panel Admin
  useEffect(() => {
    if (!isAdminAuthenticated) return;

    const fetchDatabaseMembers = async () => {
      try {
        const token = localStorage.getItem('dyari_auth_token');
        const res = await fetch('/api/members', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            'x-admin-key': MASTER_ADMIN_PASS
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.members)) {
            const mappedMembers = data.members.map(m => ({
              id: `CUST-${m.id}`,
              name: m.name,
              email: m.email,
              phone: m.phone || '-',
              totalSpent: Number(m.total_spent) || 0,
              orderCount: Array.isArray(m.purchased_products) ? m.purchased_products.length : 0,
              joinedDate: new Date(m.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
              status: m.status === 'AKTIF' ? 'Aktif' : 'Dibekukan',
              purchasedProducts: m.purchased_products || [],
              licenses: m.licenses || []
            }));

            // Perbarui daftar customers panel admin
            setCustomers(prev => {
              const prevMap = new Map(prev.map(c => [c.email.toLowerCase(), c]));
              mappedMembers.forEach(m => {
                prevMap.set(m.email.toLowerCase(), { ...prevMap.get(m.email.toLowerCase()), ...m });
              });
              return Array.from(prevMap.values());
            });
          }
        }
      } catch (_) {}
    };

    fetchDatabaseMembers();
  }, [isAdminAuthenticated, activeMenu]);

  // JIKA BELUM TERAUTENTIKASI SEBAGAI ADMIN -> TAMPILKAN PORTAL LOGIN TERKUNCI
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#12221C] flex flex-col justify-center items-center p-4 relative overflow-hidden text-[#1C352D]">
        {/* Subtle background glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-coral/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white rounded-3xl p-7 sm:p-9 shadow-2xl border border-white/20 relative z-10 space-y-6 animate-scale-up">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center gap-2 mb-1">
              <span className="w-9 h-9 rounded-2xl bg-[#B8D8C0] flex items-center justify-center text-[#1C352D] text-sm font-black shadow-xs">
                dy
              </span>
              <span className="text-2xl font-heading font-extrabold text-[#1C352D]">
                dyari<span className="text-coral">.</span>in
              </span>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold">
              <ShieldCheck size={14} className="text-rose-600" />
              <span>Portal Administrator Terproteksi</span>
            </div>

            <h2 className="text-xl font-heading font-extrabold text-[#1C352D] pt-1">
              Masuk ke Panel Kontrol
            </h2>
            <p className="text-xs text-warmgray">
              Area ini dibatasi hanya untuk pemilik dan pengelola toko <strong>dyariapp.my.id</strong>.
            </p>
          </div>

          {/* Error banner */}
          {adminAuthError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{adminAuthError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-forest mb-1.5">
                Email Administrator
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={adminAuthForm.email}
                  onChange={(e) => setAdminAuthForm({ ...adminAuthForm, email: e.target.value })}
                  placeholder="owner@dyariapp.my.id"
                  className="w-full bg-[#FAFBF9] border border-[#DCE4DD] rounded-xl px-3.5 py-2.5 text-xs text-forest focus:outline-none focus:border-forest transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest mb-1.5">
                Kata Sandi Rahasia
              </label>
              <div className="relative">
                <input 
                  type={showAdminPassword ? 'text' : 'password'} 
                  required
                  value={adminAuthForm.password}
                  onChange={(e) => setAdminAuthForm({ ...adminAuthForm, password: e.target.value })}
                  placeholder="Masukkan password admin"
                  className="w-full bg-[#FAFBF9] border border-[#DCE4DD] rounded-xl px-3.5 py-2.5 text-xs text-forest focus:outline-none focus:border-forest pr-10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warmgray hover:text-forest text-xs p-1"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 rounded-xl bg-forest text-white font-heading font-bold text-xs hover:bg-[#152a24] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              {isAuthLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Memverifikasi Otorisasi...</span>
                </>
              ) : (
                <>
                  <Key size={14} className="text-coral-light" />
                  <span>Buka Kunci Panel Administrator</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Back */}
          <div className="pt-2 border-t border-[#F0F4F1] text-center">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="text-xs font-semibold text-warmgray hover:text-forest transition-colors"
            >
              ← Kembali ke Beranda Toko Publik
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#F7F9F7] flex flex-col lg:flex-row text-[#1C352D] antialiased overflow-hidden">
      
      {/* ======================================================== */}
      {/* 1. SIDEBAR (COLLAPSIBLE / HIDE & SHOW)                   */}
      {/* ======================================================== */}
      <aside className={`
        ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-[#E5EAE4] p-4 flex flex-col justify-between shrink-0 shadow-sm transition-all duration-300 ease-in-out h-screen overflow-y-auto
      `}>
        <div className="space-y-5">
          {/* Logo & Collapse Header */}
          <div className="flex items-center justify-between px-1.5 py-1">
            <div 
              className="flex items-center gap-2.5 cursor-pointer overflow-hidden" 
              onClick={() => navigateTo('home')}
              title="Kunjungi Toko Publik"
            >
              <span className="w-8 h-8 rounded-full bg-[#B8D8C0] flex items-center justify-center text-[#1C352D] text-xs font-black shadow-xs shrink-0">
                {storeSettings?.branding?.logoBadge || 'dy'}
              </span>
              {!isSidebarCollapsed && (
                <div className="overflow-hidden">
                  <span className="font-heading font-extrabold text-[#1C352D] text-lg block leading-none">
                    {storeSettings?.branding?.storeName || 'dyari.in'}
                  </span>
                  <span className="text-[9px] font-bold text-coral uppercase tracking-widest">
                    PANEL ADMIN
                  </span>
                </div>
              )}
            </div>

            {/* Collapse Button Desktop */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-warmgray hover:text-forest hover:bg-cream transition-colors"
              title={isSidebarCollapsed ? 'Buka Sidebar' : 'Ciutkan Sidebar'}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            </button>

            {/* Close Button Mobile */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-warmgray hover:text-forest"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {sidebarMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              const isOpen = openDropdowns[item.id];

              if (item.hasChildren && item.children) {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => {
                        setActiveMenu(item.id);
                        if (item.id === 'produk-lisensi') setSubTabProduk(item.children[0].id);
                        if (item.id === 'pengaturan') setSubTabPengaturan(item.children[0].id);
                        toggleDropdown(item.id);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive ? 'bg-[#E5EFE8] text-[#1C352D] font-bold' : 'text-[#737873] hover:text-[#1C352D] hover:bg-[#F2F6F3]'
                      }`}
                      title={item.label}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={17} className="shrink-0" />
                        {!isSidebarCollapsed && <span>{item.label}</span>}
                      </div>
                      {!isSidebarCollapsed && (
                        isOpen ? <ChevronDown size={14} className="text-[#9CA3AF]" /> : <ChevronRight size={14} className="text-[#9CA3AF]" />
                      )}
                    </button>

                    {/* Submenu Dropdown */}
                    {!isSidebarCollapsed && isOpen && (
                      <div className="pl-9 pr-1 py-1 space-y-1 text-[11px] text-[#737873]">
                        {item.children.map((sub) => {
                          const isSubActive = 
                            (item.id === 'produk-lisensi' && activeMenu === 'produk-lisensi' && subTabProduk === sub.id) ||
                            (item.id === 'pengaturan' && activeMenu === 'pengaturan' && subTabPengaturan === sub.id);

                          return (
                            <button
                              key={sub.id}
                              onClick={() => {
                                setActiveMenu(item.id);
                                if (item.id === 'produk-lisensi') setSubTabProduk(sub.id);
                                if (item.id === 'pengaturan') setSubTabPengaturan(sub.id);
                              }}
                              className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                                isSubActive 
                                  ? 'bg-white text-forest font-bold shadow-2xs border border-[#E5EAE4]' 
                                  : 'hover:text-[#1C352D] hover:bg-[#F4F7F5]'
                              }`}
                            >
                              <span>{sub.label}</span>
                              {isSubActive && <div className="w-1.5 h-1.5 rounded-full bg-forest"></div>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#E5EFE8] text-[#1C352D] font-bold shadow-2xs'
                      : 'text-[#737873] hover:text-[#1C352D] hover:bg-[#F2F6F3]'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} className="shrink-0" />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isSidebarCollapsed && item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-[#E5EAE4] text-forest'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Admin Profile & Back to Store */}
        <div className="pt-4 border-t border-[#E5EAE4] space-y-2">
          <div className="flex items-center gap-3 px-1 py-1">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
              alt="Admin" 
              className="w-8 h-8 rounded-full object-cover border border-[#E5EAE4] shrink-0"
            />
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="font-heading font-bold text-xs text-[#1C352D] truncate">Admin Dyari</p>
                <p className="text-[10px] text-[#737873] truncate">Super Administrator</p>
              </div>
            )}
          </div>

          <button
            onClick={() => navigateTo('home')}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-warmgray hover:text-forest hover:bg-cream transition-colors"
            title="Kunjungi Toko Publik"
          >
            <ExternalLink size={14} className="shrink-0" />
            {!isSidebarCollapsed && <span>Buka Toko Publik</span>}
          </button>

          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
            title="Kunci & Keluar Admin"
          >
            <Lock size={14} className="shrink-0" />
            {!isSidebarCollapsed && <span>Kunci & Keluar Admin</span>}
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-2xs"
        />
      )}

      {/* ======================================================== */}
      {/* 2. MAIN CONTENT AREA                                     */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* TOP BAR (FIXED AT TOP) */}
        <header className="h-16 shrink-0 bg-white/95 backdrop-blur-md border-b border-[#E5EAE4] px-4 sm:px-8 flex items-center justify-between gap-4 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-forest hover:bg-cream border border-[#E5EAE4]"
            >
              <Menu size={18} />
            </button>

            {/* Search Input */}
            <div className="relative w-48 sm:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input 
                type="text" 
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Cari transaksi, produk, lisensi..." 
                className="w-full bg-[#F7F9F7] border border-[#E5EAE4] rounded-full py-1.5 pl-9 pr-4 text-xs text-[#1C352D] focus:outline-none focus:border-forest"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative p-2 rounded-full hover:bg-[#F2F6F3] text-warmgray hover:text-forest cursor-pointer" title="Notifikasi Toko">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral rounded-full"></span>
            </div>

            {/* Admin Profile Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#E5EAE4]">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                alt="Admin" 
                className="w-8 h-8 rounded-full object-cover border border-[#E5EAE4]"
              />
              <div className="hidden md:block text-left">
                <p className="font-heading font-bold text-xs text-[#1C352D] leading-tight">Admin Dyari</p>
                <p className="text-[10px] text-warmgray leading-tight">Online</p>
              </div>
            </div>
          </div>
        </header>

        {/* DYNAMIC TAB CONTENT (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">

          {/* ======================================================== */}
          {/* TAB 1: DASHBOARD (7 KPI CARDS & ANALISA JAM RAMAI)       */}
          {/* ======================================================== */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6 text-left">
              {/* Header Greeting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-heading font-extrabold text-[#1C352D]">
                    Dashboard Ringkasan 👋
                  </h1>
                  <p className="text-xs text-[#737873] mt-0.5">
                    Pantau kinerja penjualan, stok produk, dan status operasional tokomu hari ini.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto bg-white border border-[#E5EAE4] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-forest shadow-2xs">
                  <Calendar size={14} className="text-warmgray" />
                  <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {/* 7 KPI METRIC SUMMARY CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Total Omset */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EAE4] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#737873]">Total Omset (Penjualan)</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Wallet size={16} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-forest truncate">
                      Rp {totalRevenue.toLocaleString('id-ID')}
                    </h3>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      {paidOrders.length > 0 ? `${paidOrders.length} transaksi lunas` : 'Belum ada transaksi'}
                    </p>
                  </div>
                </div>

                {/* 2. Total Modal */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EAE4] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#737873]">Total Modal Produk</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <DollarSign size={16} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-amber-900 truncate">
                      Rp {totalCost.toLocaleString('id-ID')}
                    </h3>
                    <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                      Estimasi HPP digital
                    </p>
                  </div>
                </div>

                {/* 3. Total Laba Bersih */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EAE4] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#737873]">Total Laba Bersih</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      <TrendingUp size={16} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-blue-900 truncate">
                      Rp {totalNetProfit.toLocaleString('id-ID')}
                    </h3>
                    <p className="text-[11px] text-blue-700 font-semibold mt-0.5">
                      Margin bersih ~{(totalRevenue > 0 ? ((totalNetProfit / totalRevenue) * 100).toFixed(0) : 0)}%
                    </p>
                  </div>
                </div>

                {/* 4. Total Member */}
                <div 
                  onClick={() => setActiveMenu('member')}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EAE4] shadow-2xs space-y-2 cursor-pointer hover:border-emerald-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#737873]">Total Member</span>
                    <div className="w-8 h-8 rounded-xl bg-[#FDF0EC] text-coral flex items-center justify-center">
                      <Users size={16} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-forest">
                      {totalMembers} Orang
                    </h3>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      Pelanggan terdaftar
                    </p>
                  </div>
                </div>

                {/* 5. Total Produk Digital Dijual */}
                <div 
                  onClick={() => { setActiveMenu('produk-lisensi'); setSubTabProduk('kelola-produk'); }}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EAE4] shadow-2xs space-y-2 cursor-pointer hover:border-forest/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#737873]">Produk Digital Dijual</span>
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                      <Package size={16} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-forest">
                      {totalDigitalProducts} Item
                    </h3>
                    <p className="text-[11px] text-teal-700 font-semibold mt-0.5">
                      Katalog aktif toko
                    </p>
                  </div>
                </div>

                {/* 6. Total Lisensi Terjual */}
                <div 
                  onClick={() => { setActiveMenu('produk-lisensi'); setSubTabProduk('kelola-lisensi'); }}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EAE4] shadow-2xs space-y-2 cursor-pointer hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#737873]">Total Lisensi Terjual</span>
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                      <Key size={16} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-purple-900">
                      {totalLicenses} Lisensi
                    </h3>
                    <p className="text-[11px] text-purple-700 font-semibold mt-0.5">
                      {totalLicenses > 0 ? 'Aktif & terverifikasi' : 'Belum ada lisensi terjual'}
                    </p>
                  </div>
                </div>

                {/* 7. Total Paket Bundling */}
                <div 
                  onClick={() => { setActiveMenu('produk-lisensi'); setSubTabProduk('kelola-produk'); }}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EAE4] shadow-2xs space-y-2 cursor-pointer hover:border-coral/40 transition-colors col-span-1 sm:col-span-2 lg:col-span-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#737873]">Total Paket Bundling</span>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                      <Layers3 size={16} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-rose-900">
                      {totalBundling} Paket Bundel
                    </h3>
                    <span className="text-[11px] text-rose-700 font-semibold">
                      {totalBundling > 0 ? `${totalBundling} paket bundel aktif` : 'Belum ada paket bundel'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* SYNCHRONIZED TIMEFRAME FILTER BAR                         */}
              {/* ======================================================== */}
              {(() => {
                const analytics = getAnalyticsData();
                return (
                  <div className="space-y-6">
                    {/* Filter Controller Header */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EAE4] shadow-2xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Filter size={16} className="text-forest" />
                          <h3 className="font-heading font-extrabold text-sm text-forest">
                            Filter Periode Analitik Terpadu
                          </h3>
                          <span className="text-[10px] text-warmgray hidden sm:inline">
                            (Menyelaraskan kedua grafik di bawah secara bersamaan)
                          </span>
                        </div>

                        {/* Segmented Button Group */}
                        <div className="flex items-center gap-1.5 bg-[#F0F4F1] p-1 rounded-xl overflow-x-auto">
                          <button
                            type="button"
                            onClick={() => setDashboardTimeFilter('daily')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                              dashboardTimeFilter === 'daily'
                                ? 'bg-forest text-white shadow-2xs'
                                : 'text-warmgray hover:text-forest'
                            }`}
                          >
                            ⏱️ Harian (24 Jam)
                          </button>

                          <button
                            type="button"
                            onClick={() => setDashboardTimeFilter('weekly')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                              dashboardTimeFilter === 'weekly'
                                ? 'bg-forest text-white shadow-2xs'
                                : 'text-warmgray hover:text-forest'
                            }`}
                          >
                            📅 Mingguan (7 Hari)
                          </button>

                          <button
                            type="button"
                            onClick={() => setDashboardTimeFilter('monthly')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                              dashboardTimeFilter === 'monthly'
                                ? 'bg-forest text-white shadow-2xs'
                                : 'text-warmgray hover:text-forest'
                            }`}
                          >
                            📊 Bulanan (30 Hari)
                          </button>

                          <button
                            type="button"
                            onClick={() => setDashboardTimeFilter('custom')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                              dashboardTimeFilter === 'custom'
                                ? 'bg-forest text-white shadow-2xs'
                                : 'text-warmgray hover:text-forest'
                            }`}
                          >
                            🗓️ Rentang Tertentu
                          </button>
                        </div>
                      </div>

                      {/* Custom Date Range Picker when 'custom' is active */}
                      {dashboardTimeFilter === 'custom' && (
                        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#F0F4F1] text-xs">
                          <span className="font-semibold text-forest">Tentukan Rentang Tanggal:</span>
                          <div className="flex items-center gap-2">
                            <label className="text-warmgray">Mulai:</label>
                            <input
                              type="date"
                              value={customDateStart}
                              onChange={(e) => setCustomDateStart(e.target.value)}
                              className="bg-[#F7F9F7] border border-[#E5EAE4] rounded-lg px-2.5 py-1 text-xs text-forest focus:outline-none font-mono"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-warmgray">Sampai:</label>
                            <input
                              type="date"
                              value={customDateEnd}
                              onChange={(e) => setCustomDateEnd(e.target.value)}
                              className="bg-[#F7F9F7] border border-[#E5EAE4] rounded-lg px-2.5 py-1 text-xs text-forest focus:outline-none font-mono"
                            />
                          </div>

                          <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                            ✓ Menampilkan rentang {customDateStart} s/d {customDateEnd}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ======================================================== */}
                    {/* 1. TREN PENJUALAN & PRODUK TERLARIS                      */}
                    {/* ======================================================== */}
                    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5EAE4] shadow-2xs space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0F4F1] pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <BarChart3 size={20} className="text-teal-600" />
                            <h3 className="font-heading font-extrabold text-base text-forest">
                              1. Tren Penjualan & Produk Terlaris
                            </h3>
                          </div>
                          <p className="text-xs text-warmgray mt-0.5">
                            Grafik omset dan produk paling laku yang <strong>saling terkait</strong> dengan filter: <strong>{analytics.periodLabel}</strong>.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1 rounded-full font-bold">
                            Total Omset: Rp {analytics.totalSales.toLocaleString('id-ID')}
                          </span>
                          <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs px-3 py-1 rounded-full font-bold">
                            {analytics.totalUnits} Produk Terjual
                          </span>
                        </div>
                      </div>

                      {/* Grid 2 Columns: Sisi Kiri Tren Penjualan (SVG), Sisi Kanan Produk Terlaris */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Kolom Kiri: Kurva Tren Penjualan (SVG Area Chart) */}
                        <div className="lg:col-span-7 bg-[#FAFBF9] p-4 sm:p-5 rounded-2xl border border-[#E5EAE4] flex flex-col justify-between space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-heading font-bold text-xs text-forest uppercase tracking-wider">
                                Kurva Pendapatan Penjualan
                              </h4>
                              <p className="text-[11px] text-warmgray">Pertumbuhan omset berdasarkan titik waktu</p>
                            </div>
                            <span className="text-[10px] font-bold text-forest bg-white px-2.5 py-1 rounded-lg border border-[#E5EAE4]">
                              {analytics.periodLabel}
                            </span>
                          </div>

                          {/* SVG Area Line Chart */}
                          <div className="h-44 relative flex items-end pt-2">
                            {analytics.totalSales === 0 && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/70 backdrop-blur-[1px] rounded-xl text-center px-4">
                                <TrendingUp size={28} className="text-slate-300 mb-1.5" />
                                <p className="text-xs font-bold text-forest">Belum Ada Transaksi Penjualan</p>
                                <p className="text-[10px] text-warmgray mt-0.5">
                                  Kurva pendapatan akan otomatis terbentuk setelah ada pesanan berstatus Lunas
                                </p>
                              </div>
                            )}
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 140" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="salesTrendGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#29463A" stopOpacity="0.35"/>
                                  <stop offset="100%" stopColor="#29463A" stopOpacity="0.0"/>
                                </linearGradient>
                              </defs>
                              {/* Area fill */}
                              <polygon 
                                points={`0,140 ${analytics.trendRevenue.map((val, i) => {
                                  const max = Math.max(...analytics.trendRevenue, 1);
                                  const x = (i / (analytics.trendRevenue.length - 1)) * 500;
                                  const y = 140 - (val / max) * 110;
                                  return `${x},${y}`;
                                }).join(' ')} 500,140`}
                                fill="url(#salesTrendGrad)"
                              />
                              {/* Stroke line */}
                              <polyline 
                                fill="none" 
                                stroke="#29463A" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                points={analytics.trendRevenue.map((val, i) => {
                                  const max = Math.max(...analytics.trendRevenue, 1);
                                  const x = (i / (analytics.trendRevenue.length - 1)) * 500;
                                  const y = 140 - (val / max) * 110;
                                  return `${x},${y}`;
                                }).join(' ')}
                              />
                              {/* Interactive Data Dots */}
                              {analytics.trendRevenue.map((val, i) => {
                                const max = Math.max(...analytics.trendRevenue, 1);
                                const x = (i / (analytics.trendRevenue.length - 1)) * 500;
                                const y = 140 - (val / max) * 110;
                                return (
                                  <g key={i}>
                                    <circle cx={x} cy={y} r={4} fill="#EE7C6B" stroke="#ffffff" strokeWidth="2" />
                                  </g>
                                );
                              })}
                            </svg>
                          </div>

                          {/* X-Axis Labels */}
                          <div className="flex justify-between text-[10px] text-warmgray border-t border-[#E5EAE4] pt-2 font-mono">
                            {analytics.trendLabels.map((lbl, idx) => (
                              <span key={idx} className="text-center">{lbl}</span>
                            ))}
                          </div>
                        </div>

                        {/* Kolom Kanan: Peringkat Produk Terlaris dalam Periode Tersebut */}
                        <div className="lg:col-span-5 space-y-3">
                          <div className="flex items-center justify-between pb-1">
                            <h4 className="font-heading font-bold text-xs text-forest uppercase tracking-wider">
                              Produk Terlaris ({analytics.title})
                            </h4>
                            <span className="text-[10px] text-warmgray font-semibold">Peringkat Omset</span>
                          </div>

                          <div className="space-y-2.5">
                            {analytics.topProducts.length === 0 ? (
                              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-[#E5EAE4] space-y-1.5 flex flex-col items-center justify-center min-h-[180px]">
                                <Package size={30} className="text-slate-300" />
                                <p className="text-xs font-bold text-forest">Belum Ada Produk Terjual</p>
                                <p className="text-[11px] text-warmgray max-w-[220px]">
                                  Peringkat produk terlaris akan otomatis terisi setelah ada transaksi pembelian yang lunas.
                                </p>
                              </div>
                            ) : (
                              analytics.topProducts.map((prod, idx) => (
                                <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#E5EAE4] shadow-2xs space-y-1.5 hover:border-emerald-300 transition-colors">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                                        idx === 0 ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                                        idx === 1 ? 'bg-slate-200 text-slate-800' : 'bg-[#F0F4F1] text-warmgray'
                                      }`}>
                                        {idx + 1}
                                      </span>
                                      <img 
                                        src={prod.image} 
                                        alt={prod.name} 
                                        className="w-7 h-7 rounded-lg object-cover border border-[#E5EAE4] shrink-0" 
                                      />
                                      <div className="min-w-0">
                                        <p className="font-bold text-forest text-xs truncate max-w-[130px] sm:max-w-[160px]" title={prod.name}>
                                          {prod.name}
                                        </p>
                                        <span className="text-[9px] text-warmgray block">{prod.category}</span>
                                      </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                      <span className="font-mono font-bold text-forest text-xs block">
                                        Rp {prod.revenue.toLocaleString('id-ID')}
                                      </span>
                                      <span className="text-[10px] text-emerald-700 font-semibold">
                                        {prod.units} unit
                                      </span>
                                    </div>
                                  </div>

                                  {/* Mini Progress bar of contribution */}
                                  <div className="w-full bg-[#F0F4F1] h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-forest rounded-full" 
                                      style={{ width: `${prod.percent}%` }}
                                    />
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Synchronization note */}
                      <div className="text-center pt-2 border-t border-[#F0F4F1]">
                        <p className="text-[11px] text-warmgray italic">
                          🔗 <strong>Keterkaitan Data:</strong> Filter <em>{analytics.title}</em> secara otomatis menyelaraskan performa penjualan produk digital dengan grafik aktivitas jam ramai di bawah ini.
                        </p>
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* 2. ANALISA AKTIVITAS TRANSAKSI & JAM RAMAI (24 JAM PENUH)*/}
                    {/* ======================================================== */}
                    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5EAE4] shadow-2xs space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0F4F1] pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Flame size={20} className="text-rose-500 animate-bounce" />
                            <h3 className="font-heading font-extrabold text-base text-forest">
                              2. Analisa Aktivitas Transaksi & Jam Ramai (24 Jam Penuh)
                            </h3>
                          </div>
                          <p className="text-xs text-warmgray mt-0.5">
                            Distribusi kepadatan transaksi per jam (resolusi 24 jam penuh per 1 jam: <strong>00:00 s/d 24:00 WIB</strong>) pada periode: <strong>{analytics.periodLabel}</strong>.
                          </p>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                          <span>{analytics.peakBadge}</span>
                        </div>
                      </div>

                      {/* Visual Graphic Line & Area Waveform Chart (24 Jam Penuh) */}
                      <div className="pt-2 space-y-4">
                        <div className="relative bg-[#FAFBF9] rounded-2xl border border-[#E5EAE4] p-4 sm:p-6 overflow-hidden">
                          {/* Floating interactive tooltip when hovering any point */}
                          {hoveredHourIndex !== null && (() => {
                            const pts = analytics.hourlyPoints || [];
                            const maxP = Math.max(...pts.map(p => p.percent), 100);
                            const hp = pts[hoveredHourIndex];
                            if (!hp) return null;
                            const xRatio = (hoveredHourIndex / (pts.length - 1)) * 100;
                            const yPx = 150 - (hp.percent / maxP) * 115;
                            const yRatio = (yPx / 180) * 100;

                            return (
                              <div 
                                className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-150 z-20"
                                style={{
                                  left: `${Math.max(8, Math.min(92, xRatio))}%`,
                                  top: `${Math.max(16, yRatio)}%`,
                                  marginTop: '-12px'
                                }}
                              >
                                <div className="bg-[#1C352D] text-white px-3.5 py-2 rounded-xl text-left shadow-2xl border border-white/20 whitespace-nowrap space-y-0.5">
                                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-coral-light">
                                    <span>🕒 {hp.time} WIB</span>
                                    {hp.isPeak && (
                                      <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded font-black uppercase">
                                        ★ Puncak Prime Time
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs font-bold text-white">
                                    {hp.count} Transaksi ({hp.percent}% Kepadatan)
                                  </p>
                                  <span className="text-[10px] text-emerald-200 block">
                                    {hp.label}
                                  </span>
                                </div>
                                <div className="w-2.5 h-2.5 bg-[#1C352D] rotate-45 mx-auto -mt-1 border-r border-b border-white/20"></div>
                              </div>
                            );
                          })()}

                          {/* SVG Canvas - 24 Jam Penuh Resolusi Per Jam */}
                          <div className="w-full h-44 sm:h-52 relative flex items-end">
                            {(() => {
                              const pts = analytics.hourlyPoints || [];
                              const maxP = Math.max(...pts.map(p => p.percent), 100);
                              const svgWidth = 720;
                              const svgHeight = 180;
                              const padX = 24;
                              const availW = svgWidth - padX * 2;

                              const calculatedPoints = pts.map((p, idx) => {
                                const x = padX + (idx / (pts.length - 1)) * availW;
                                const y = 150 - (p.percent / maxP) * 115;
                                return { ...p, x, y };
                              });

                              const polylineStr = calculatedPoints.map(p => `${p.x},${p.y}`).join(' ');
                              const polygonStr = `${padX},175 ${polylineStr} ${svgWidth - padX},175`;

                              return (
                                <svg 
                                  className="w-full h-full overflow-visible" 
                                  viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                                  preserveAspectRatio="none"
                                >
                                  <defs>
                                    <linearGradient id="hourlyWaveformGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#1C352D" stopOpacity="0.25" />
                                      <stop offset="55%" stopColor="#29463A" stopOpacity="0.08" />
                                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
                                    </linearGradient>
                                  </defs>

                                  {/* Background Baseline Guideline */}
                                  <line 
                                    x1={padX} 
                                    y1="150" 
                                    x2={svgWidth - padX} 
                                    y2="150" 
                                    stroke="#E5EAE4" 
                                    strokeWidth="1" 
                                    strokeDasharray="4 4" 
                                  />

                                  {/* Area Gradient Fill */}
                                  <polygon 
                                    points={polygonStr} 
                                    fill="url(#hourlyWaveformGrad)" 
                                  />

                                  {/* Dark Forest Green Polyline */}
                                  <polyline 
                                    points={polylineStr} 
                                    fill="none" 
                                    stroke="#1C352D" 
                                    strokeWidth="3.5" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                  />

                                  {/* Data Points with Coral Fill and White Border (25 Titik 00:00 - 24:00) */}
                                  {calculatedPoints.map((p, idx) => {
                                    const isHovered = hoveredHourIndex === idx;
                                    return (
                                      <g 
                                        key={idx} 
                                        className="cursor-pointer group"
                                        onMouseEnter={() => setHoveredHourIndex(idx)}
                                        onMouseLeave={() => setHoveredHourIndex(null)}
                                        onClick={() => setHoveredHourIndex(idx)}
                                      >
                                        {/* Outer pulse/halo on hover or peak */}
                                        {(isHovered || p.isPeak) && (
                                          <circle
                                            cx={p.x}
                                            cy={p.y}
                                            r={isHovered ? 9 : 7}
                                            fill={p.isPeak ? '#F26E56' : '#1C352D'}
                                            opacity={isHovered ? 0.35 : 0.2}
                                            className="transition-all duration-200"
                                          />
                                        )}

                                        {/* Primary Coral Dot with White Border (Sesuai Referensi Gambar) */}
                                        <circle
                                          cx={p.x}
                                          cy={p.y}
                                          r={isHovered ? 5.5 : (p.isPeak ? 5 : 4)}
                                          fill="#F26E56"
                                          stroke="#FFFFFF"
                                          strokeWidth="2.2"
                                          className="transition-all duration-200 shadow-sm"
                                        />
                                      </g>
                                    );
                                  })}
                                </svg>
                              );
                            })()}
                          </div>

                          {/* Horizontal 24 Hours Timeline Axis (00:00 s/d 24:00 Penuh Resolusi Per Jam) */}
                          <div className="relative pt-3 border-t border-[#E5EAE4]/80 mt-2">
                            <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono font-bold text-warmgray px-1 sm:px-2">
                              {(analytics.hourlyPoints || []).map((p, idx) => {
                                const isPeak = p.isPeak;
                                const isHovered = hoveredHourIndex === idx;
                                const isEvenHour = idx % 2 === 0;

                                return (
                                  <div
                                    key={idx}
                                    className="flex-1 flex flex-col items-center cursor-pointer group py-1"
                                    onMouseEnter={() => setHoveredHourIndex(idx)}
                                    onMouseLeave={() => setHoveredHourIndex(null)}
                                    onClick={() => setHoveredHourIndex(idx)}
                                    title={`${p.time} WIB - ${p.count} transaksi (${p.percent}%)`}
                                  >
                                    {/* Tick marker */}
                                    <div 
                                      className={`w-0.5 rounded-full transition-all duration-150 ${
                                        isPeak 
                                          ? 'h-3.5 bg-rose-500 scale-125' 
                                          : isHovered 
                                            ? 'h-3 bg-forest scale-125' 
                                            : isEvenHour 
                                              ? 'h-2 bg-slate-400' 
                                              : 'h-1 bg-slate-300 group-hover:bg-slate-500'
                                      }`} 
                                    />
                                    {/* Hour label text */}
                                    <span 
                                      className={`text-center text-[9px] sm:text-[10px] mt-1 transition-colors whitespace-nowrap ${
                                        isHovered
                                          ? 'text-forest font-black scale-110'
                                          : isPeak
                                            ? 'text-rose-600 font-black'
                                            : isEvenHour
                                              ? 'text-warmgray group-hover:text-forest'
                                              : 'hidden sm:inline-block text-slate-400 opacity-60 text-[8px] group-hover:text-forest group-hover:opacity-100'
                                      }`}
                                    >
                                      {p.time.split(':')[0]}
                                    </span>
                                    {isPeak && (
                                      <span className="hidden sm:block text-[8px] text-rose-500 font-black leading-none mt-0.5">
                                        ★Puncak
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Legend & Guide Bar */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-warmgray pt-2 px-1 border-t border-[#F0F4F1] mt-1.5">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#F26E56] border border-white"></span>
                                💡 <em>Tampil per 1 jam penuh (00:00 s/d 24:00 WIB). Arahkan kursor ke titik mana saja untuk detail.</em>
                              </span>
                              <span className="font-bold text-rose-600 flex items-center gap-1">
                                🔥 Puncak Tertinggi: 20:00 WIB (100% Prime Time Checkout)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 3 Metric Pills Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-950">
                            <Flame size={16} className="text-rose-600 shrink-0" />
                            <div>
                              <span className="text-[10px] font-bold text-rose-700 uppercase block">Jam Teramai (Prime Time)</span>
                              <strong className="font-heading font-extrabold text-xs">{analytics.peakHourText}</strong>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-800">
                            <Moon size={16} className="text-indigo-500 shrink-0" />
                            <div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase block">Jam Tersepi</span>
                              <strong className="font-heading font-extrabold text-xs">03:00 WIB (Subuh / Dini Hari)</strong>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-950">
                            <TrendingUp size={16} className="text-emerald-700 shrink-0" />
                            <div>
                              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Total Aktivitas 24 Jam</span>
                              <strong className="font-heading font-extrabold text-xs">{analytics.totalUnits} Transaksi Terverifikasi</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Strategic Advice Banner */}
                      <div className="p-3.5 rounded-xl bg-sage/30 border border-[#E5EAE4] flex items-start gap-3 text-xs text-forest">
                        <Activity size={16} className="text-forest mt-0.5 shrink-0" />
                        <p>
                          <strong>Rekomendasi Waktu Promosi ({analytics.title}):</strong> {analytics.advice}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Quick Table: Transaksi Terbaru */}
              <div className="bg-white rounded-2xl border border-[#E5EAE4] p-5 sm:p-6 shadow-2xs space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-base text-forest">Transaksi Terbaru</h3>
                    <p className="text-xs text-warmgray">Daftar transaksi yang berhasil diproses</p>
                  </div>
                  <button 
                    onClick={() => setActiveMenu('transaksi')}
                    className="text-xs font-bold text-forest hover:text-coral transition-colors"
                  >
                    Buka Riwayat Lengkap →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-warmgray border-b border-[#F0F4F1]">
                        <th className="py-2.5 px-3 font-medium">ID Order</th>
                        <th className="py-2.5 px-3 font-medium">Tanggal</th>
                        <th className="py-2.5 px-3 font-medium">Pelanggan</th>
                        <th className="py-2.5 px-3 font-medium">Metode</th>
                        <th className="py-2.5 px-3 font-medium">Nominal</th>
                        <th className="py-2.5 px-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F4F1]">
                      {paidOrders.slice(0, 5).map((tx) => (
                        <tr key={tx.id} className="hover:bg-[#FAFBF9]">
                          <td className="py-2.5 px-3 font-mono font-bold text-forest">{tx.id}</td>
                          <td className="py-2.5 px-3 text-warmgray">{tx.date}</td>
                          <td className="py-2.5 px-3 font-medium text-forest">{tx.customer}</td>
                          <td className="py-2.5 px-3 text-forest">{tx.paymentMethod}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-forest">Rp {tx.total.toLocaleString('id-ID')}</td>
                          <td className="py-2.5 px-3">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Check size={10} />
                              <span>Lunas</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: RIWAYAT TRANSAKSI (LEFT-ALIGNED & CONCISE NAME)   */}
          {/* ======================================================== */}
          {activeMenu === 'transaksi' && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAE4] pb-4">
                <div className="text-left">
                  <h1 className="text-2xl font-heading font-extrabold text-[#1C352D]">
                    Riwayat Transaksi
                  </h1>
                  <p className="text-xs text-[#737873] mt-0.5">
                    Seluruh log transaksi yang berhasil lunas, lengkap dengan rincian item dan bukti invoice.
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-left sm:text-right self-start sm:self-auto">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block">Total Lunas</span>
                  <span className="font-heading font-extrabold text-emerald-900 text-lg">
                    Rp {totalRevenue.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5EAE4] shadow-2xs flex flex-wrap items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-forest">Metode Pembayaran:</span>
                  <select
                    value={txFilterPayment}
                    onChange={(e) => setTxFilterPayment(e.target.value)}
                    className="bg-[#F7F9F7] border border-[#E5EAE4] text-xs rounded-xl px-3 py-1.5 text-forest focus:outline-none"
                  >
                    <option value="all">Semua Metode</option>
                    <option value="qris">QRIS</option>
                    <option value="transfer">Transfer Bank</option>
                    <option value="wallet">E-Wallet</option>
                  </select>
                </div>

                <span className="text-xs text-warmgray">
                  Menampilkan <strong>{paidOrders.length}</strong> transaksi berhasil
                </span>
              </div>

              {/* Transactions Table - Strictly Left Aligned */}
              <div className="bg-white rounded-2xl border border-[#E5EAE4] shadow-2xs overflow-hidden text-left">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAFBF9] border-b border-[#E5EAE4] text-warmgray uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4 font-semibold text-left">ID Transaksi</th>
                        <th className="py-3 px-4 font-semibold text-left">Waktu</th>
                        <th className="py-3 px-4 font-semibold text-left">Pelanggan</th>
                        <th className="py-3 px-4 font-semibold text-left">Item Pembelian</th>
                        <th className="py-3 px-4 font-semibold text-left">Metode</th>
                        <th className="py-3 px-4 font-semibold text-left">Nominal</th>
                        <th className="py-3 px-4 font-semibold text-left">Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F4F1]">
                      {paidOrders
                        .filter(o => {
                          if (txFilterPayment === 'all') return true;
                          return o.paymentMethod?.toLowerCase().includes(txFilterPayment);
                        })
                        .map((tx) => (
                          <tr key={tx.id} className="hover:bg-[#FAFBF9]">
                            <td className="py-3.5 px-4 font-mono font-bold text-forest text-left">{tx.id}</td>
                            <td className="py-3.5 px-4 text-warmgray text-left">{tx.date}</td>
                            <td className="py-3.5 px-4 text-left">
                              <p className="font-semibold text-forest">{tx.customer}</p>
                              <p className="text-[10px] text-warmgray">{tx.email || 'customer@gmail.com'}</p>
                            </td>
                            <td className="py-3.5 px-4 max-w-[220px] text-left">
                              {tx.items?.map((it, idx) => (
                                <p key={idx} className="truncate text-forest font-medium">
                                  • {it.name}
                                </p>
                              )) || '-'}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-forest text-left">{tx.paymentMethod}</td>
                            <td className="py-3.5 px-4 font-mono font-extrabold text-forest text-left">
                              Rp {tx.total.toLocaleString('id-ID')}
                            </td>
                            <td className="py-3.5 px-4 text-left">
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                <Check size={10} />
                                <span>Lunas</span>
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const url = getInvoiceUrl(tx.id);
                                    navigator.clipboard.writeText(url);
                                    showToast('Link Disalin', url);
                                  }}
                                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                                  title="Salin Link Invoice Publik"
                                >
                                  <Share2 size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => sendInvoiceWhatsApp(tx)}
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                                  title="Kirim Invoice via WhatsApp"
                                >
                                  <MessageCircle size={13} />
                                </button>
                                <button
                                  onClick={() => setSelectedOrderDetails(tx)}
                                  className="px-2.5 py-1 rounded-lg bg-cream hover:bg-forest hover:text-white text-forest text-xs font-bold border border-[#E5EAE4] transition"
                                >
                                  Invoice →
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: ANTRIAN ORDER (COMPACT DENSE TABLE VIEW)          */}
          {/* ======================================================== */}
          {activeMenu === 'antrian-order' && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAE4] pb-4">
                <div>
                  <h1 className="text-2xl font-heading font-extrabold text-[#1C352D] flex items-center gap-2">
                    <span>Antrian Order Masuk</span>
                    {pendingOrders.length > 0 && (
                      <span className="bg-amber-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                        {pendingOrders.length}
                      </span>
                    )}
                  </h1>
                  <p className="text-xs text-[#737873] mt-0.5">
                    Daftar antrian pesanan baru yang sedang menunggu pembayaran atau verifikasi manual transfer bank.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRefreshQueue}
                  disabled={isRefreshingQueue}
                  className="btn-dyari-outline text-xs px-3.5 py-2 inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <RefreshCw size={14} className={isRefreshingQueue ? 'animate-spin text-emerald-600' : ''} />
                  <span>{isRefreshingQueue ? 'Menyinkronkan...' : 'Refresh Antrian'}</span>
                </button>
              </div>

              {pendingOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E5EAE4] p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="font-heading font-bold text-forest text-base">Tidak Ada Antrian Order</h3>
                  <p className="text-xs text-warmgray max-w-sm mx-auto">
                    Semua pesanan masuk sudah terverifikasi dan diproses lunas.
                  </p>
                </div>
              ) : (
                /* Compact, dense order queue table as requested */
                <div className="bg-white rounded-2xl border border-[#E5EAE4] shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAFBF9] border-b border-[#E5EAE4] text-warmgray uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold text-left">Kode Unik Transaksi</th>
                          <th className="py-2.5 px-3 font-semibold text-left">Kategori / Produk</th>
                          <th className="py-2.5 px-3 font-semibold text-left">Nama Pembeli</th>
                          <th className="py-2.5 px-3 font-semibold text-left">Nominal</th>
                          <th className="py-2.5 px-3 font-semibold text-left">Status</th>
                          <th className="py-2.5 px-3 font-semibold text-center">Invoice</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0F4F1]">
                        {pendingOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-amber-50/40 transition-colors">
                            {/* 1. Kode Unik Transaksi */}
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-forest">{ord.id}</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(ord.id);
                                    showToast('Disalin', ord.id);
                                  }}
                                  className="text-warmgray hover:text-forest"
                                  title="Salin Kode"
                                >
                                  <Copy size={11} />
                                </button>
                              </div>
                              <span className="text-[10px] text-warmgray block">{ord.date}</span>
                            </td>

                            {/* 2. Kategori / Produk */}
                            <td className="py-2.5 px-3 max-w-[200px]">
                              {ord.items?.map((it, idx) => (
                                <p key={idx} className="font-medium text-forest truncate" title={it.name}>
                                  • {it.name}
                                </p>
                              )) || (
                                <span className="text-warmgray italic">Produk Digital</span>
                              )}
                              <span className="text-[10px] text-warmgray block">
                                Metode: <strong className="text-forest">{ord.paymentMethod}</strong>
                              </span>
                            </td>

                            {/* 3. Nama Pembeli */}
                            <td className="py-2.5 px-3">
                              <p className="font-bold text-forest">{ord.customer}</p>
                              <p className="text-[10px] text-warmgray truncate max-w-[160px]">{ord.email || '-'}</p>
                              {ord.phone && (
                                <a
                                  href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                                >
                                  <Phone size={10} />
                                  <span>{ord.phone}</span>
                                </a>
                              )}
                            </td>

                            {/* 4. Nominal */}
                            <td className="py-2.5 px-3 font-mono font-extrabold text-forest">
                              Rp {ord.total.toLocaleString('id-ID')}
                            </td>

                            {/* 5. Status dropdown */}
                            <td className="py-2.5 px-3">
                              <select
                                value={ord.status}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateOrderStatus(ord.id, val);
                                  showToast('Status Diperbarui', `${ord.id} diubah ke ${val}`);
                                }}
                                className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border focus:outline-none ${
                                  ord.status === 'Lunas'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : ord.status === 'Dibatalkan'
                                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                                    : 'bg-amber-100 text-amber-900 border-amber-300'
                                }`}
                              >
                                <option value="Menunggu Konfirmasi">Pending (Menunggu Konfirmasi)</option>
                                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                                <option value="Lunas">Terbayar (Lunas / Approved)</option>
                                <option value="Dibatalkan">Dibatalkan</option>
                              </select>
                            </td>

                            {/* 6. Invoice & Share Actions */}
                            <td className="py-2.5 px-3 text-center">
                              <div className="inline-flex items-center gap-1">
                                {ord.status !== 'Lunas' && ord.status !== 'Terbayar' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateOrderStatus(ord.id, 'Lunas');
                                      showToast('Pesanan Disetujui!', `${ord.id} telah disetujui (Lunas). Kredensial & lisensi aktif.`);
                                    }}
                                    className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition font-bold text-[11px] inline-flex items-center gap-1 shadow-2xs cursor-pointer mr-1"
                                    title="Setujui / Approve Pembayaran Pesanan Ini"
                                  >
                                    <Check size={12} className="stroke-[3]" />
                                    <span>Approve</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const url = getInvoiceUrl(ord.id);
                                    navigator.clipboard.writeText(url);
                                    showToast('Link Disalin', url);
                                  }}
                                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                                  title="Salin Link Invoice Publik"
                                >
                                  <Share2 size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => sendInvoiceWhatsApp(ord)}
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                                  title="Kirim Invoice ke WhatsApp Pembeli"
                                >
                                  <MessageCircle size={12} />
                                </button>
                                <button
                                  onClick={() => setSelectedOrderDetails(ord)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cream hover:bg-forest hover:text-white text-forest text-[11px] font-bold border border-[#E5EAE4] transition-colors"
                                  title="Buka Detail Invoice Resmi"
                                >
                                  <FileText size={12} />
                                  <span>Invoice</span>
                                </button>
                              </div>
                            </td>

                            {/* 7. Hapus */}
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => {
                                  if (window.confirm(`Hapus antrian order ${ord.id}?`)) {
                                    deleteOrder(ord.id);
                                    showToast('Order Dihapus', ord.id);
                                  }
                                }}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Hapus Order"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: MEMBER                                            */}
          {/* ======================================================== */}
          {/* ======================================================== */}
          {/* TAB 4: MEMBER (STORY GENERATOR LICENSE MEMBERS)          */}
          {/* ======================================================== */}
          {activeMenu === 'member' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAE4] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      🎬 Story Generator Studio
                    </span>
                    <span className="text-xs text-warmgray">• Otentikasi Email & Lisensi</span>
                  </div>
                  <h1 className="text-2xl font-heading font-extrabold text-[#1C352D]">
                    Manajemen Member Story Generator
                  </h1>
                  <p className="text-xs text-[#737873] mt-0.5">
                    Daftar seluruh member terdaftar pemegang lisensi Story Generator AI. Member membuka studio AI menggunakan email dan kode lisensi yang terdata di sini.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setLicenseFormData({
                        productId: 'story-generator',
                        productName: 'Story Generator Pro AI',
                        customerName: '',
                        customerEmail: '',
                        type: 'PERSONAL',
                        expiresAt: 'Selamanya (Lifetime)',
                        code: ''
                      });
                      setShowAddLicenseModal(true);
                    }}
                    className="btn-dyari text-xs px-4 py-2 font-bold inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus size={14} />
                    <span>+ Daftarkan Member Story Generator</span>
                  </button>
                </div>
              </div>

              {/* Story Generator Member Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-[#E5EAE4] shadow-2xs">
                  <span className="text-xs text-warmgray block">Total Member Lisensi</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <strong className="text-2xl font-heading font-extrabold text-forest">
                      {licenses.length}
                    </strong>
                    <span className="text-[11px] text-warmgray">pengguna</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#E5EAE4] shadow-2xs">
                  <span className="text-xs text-warmgray block">Member Aktif (Siap Akses)</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <strong className="text-2xl font-heading font-extrabold text-emerald-700">
                      {licenses.filter(l => !getLicenseEffectiveStatus(l).isLocked).length}
                    </strong>
                    <span className="text-[11px] text-emerald-600 font-medium">aktif</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#E5EAE4] shadow-2xs">
                  <span className="text-xs text-warmgray block">Kadaluarsa / Dibekukan</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <strong className="text-2xl font-heading font-extrabold text-rose-700">
                      {licenses.filter(l => getLicenseEffectiveStatus(l).isLocked).length}
                    </strong>
                    <span className="text-[11px] text-rose-600 font-medium">terkunci</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#E5EAE4] shadow-2xs">
                  <span className="text-xs text-warmgray block">Pilihan Paket Lisensi</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <strong className="text-2xl font-heading font-extrabold text-purple-800">
                      {(licensePackages || []).length}
                    </strong>
                    <span className="text-[11px] text-purple-600 font-medium">paket tersedia</span>
                  </div>
                </div>
              </div>

              {/* Story Generator Members Table */}
              <div className="bg-white rounded-2xl border border-[#E5EAE4] shadow-2xs overflow-hidden space-y-4 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative max-w-sm w-full">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warmgray" />
                    <input
                      type="text"
                      value={memberSearchQuery}
                      onChange={(e) => setMemberSearchQuery(e.target.value)}
                      placeholder="Cari nama, email, atau kode lisensi member..."
                      className="w-full bg-[#F7F9F7] border border-[#E5EAE4] text-xs rounded-xl py-2 pl-9 pr-3 text-forest focus:outline-none"
                    />
                  </div>

                  <div className="text-xs text-warmgray">
                    Menampilkan <strong>{licenses.filter(l => (l.customerName || '').toLowerCase().includes(memberSearchQuery.toLowerCase()) || (l.customerEmail || '').toLowerCase().includes(memberSearchQuery.toLowerCase()) || (l.code || '').toLowerCase().includes(memberSearchQuery.toLowerCase())).length}</strong> member terdaftar
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-warmgray border-b border-[#F0F4F1]">
                        <th className="py-3 font-semibold">Nama Member</th>
                        <th className="py-3 font-semibold">Email Login Terdaftar</th>
                        <th className="py-3 font-semibold">Kunci Lisensi (Key)</th>
                        <th className="py-3 font-semibold">Paket & Hak Akses</th>
                        <th className="py-3 font-semibold">Masa Berlaku</th>
                        <th className="py-3 font-semibold">Status Akses</th>
                        <th className="py-3 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F4F1]">
                      {licenses
                        .filter(l => 
                          (l.customerName || '').toLowerCase().includes(memberSearchQuery.toLowerCase()) || 
                          (l.customerEmail || '').toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
                          (l.code || '').toLowerCase().includes(memberSearchQuery.toLowerCase())
                        )
                        .map((lic) => {
                          const effective = getLicenseEffectiveStatus(lic);
                          const isLocked = effective.isLocked;

                          return (
                            <tr key={lic.id} className="hover:bg-[#FAFBF9] transition-colors">
                              {/* NAMA MEMBER */}
                              <td className="py-3.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-forest/10 text-forest font-bold flex items-center justify-center text-xs shrink-0">
                                    {(lic.customerName || 'M').slice(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-bold text-forest">{lic.customerName || 'Member dyari.in'}</p>
                                    <p className="text-[10px] text-warmgray">Terdaftar: {lic.createdAt || 'Baru'}</p>
                                  </div>
                                </div>
                              </td>

                              {/* EMAIL LOGIN */}
                              <td className="py-3.5">
                                <div className="space-y-0.5">
                                  <span className="font-mono text-xs font-semibold text-forest block">
                                    {lic.customerEmail || '-'}
                                  </span>
                                  <span className="inline-block text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                                    Otentikasi Story Generator
                                  </span>
                                </div>
                              </td>

                              {/* KODE LISENSI */}
                              <td className="py-3.5">
                                <div className="inline-flex items-center gap-1.5 bg-[#F7F9F7] px-2.5 py-1 rounded-xl border border-[#E5EAE4] font-mono text-[11px] font-bold text-forest">
                                  <span>{lic.code}</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(lic.code);
                                      showToast('Kode Lisensi Disalin', lic.code);
                                    }}
                                    className="text-warmgray hover:text-forest transition-colors"
                                    title="Salin Kode Lisensi"
                                  >
                                    <Copy size={12} />
                                  </button>
                                </div>
                              </td>

                              {/* PAKET & HAK AKSES */}
                              <td className="py-3.5">
                                <div className="space-y-1">
                                  <p className="font-semibold text-forest truncate max-w-[160px]">
                                    {lic.productName || 'Story Generator Pro AI'}
                                  </p>
                                  <span className="inline-block bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
                                    {lic.type || 'PERSONAL'} • {lic.durationLabel || lic.expiresAt}
                                  </span>
                                </div>
                              </td>

                              {/* MASA BERLAKU */}
                              <td className="py-3.5">
                                {lic.isLifetime ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                    ♾️ Lifetime (Selamanya)
                                  </span>
                                ) : (
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5 text-forest font-medium text-[11px]">
                                      <Clock size={11} className="text-purple-700 shrink-0" />
                                      <span>{lic.expiresAt}</span>
                                    </div>
                                    <span className="text-[10px] text-warmgray block">
                                      {effective.remainingText}
                                    </span>
                                  </div>
                                )}
                              </td>

                              {/* STATUS AKSES */}
                              <td className="py-3.5">
                                <button
                                  onClick={() => {
                                    const next = lic.status === 'Aktif' ? 'Dibekukan' : 'Aktif';
                                    updateLicenseStatus(lic.id, next);
                                  }}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                                    !isLocked
                                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                                      : 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                                  }`}
                                  title="Klik untuk mengubah status akses"
                                >
                                  ● {lic.status === 'Aktif' ? 'Aktif (Terbuka)' : (lic.status === 'Kadaluarsa' ? 'Kadaluarsa' : 'Dibekukan')}
                                </button>
                              </td>

                              {/* AKSI */}
                              <td className="py-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Salin Info WA */}
                                  <button
                                    onClick={() => {
                                      const text = `Halo Kak ${lic.customerName},\n\nBerikut rincian lisensi resmi Anda untuk membuka *Story Generator AI* di dyari.in:\n\n📧 *Email Terdaftar:* ${lic.customerEmail}\n🔑 *Kode Lisensi:* ${lic.code}\n📦 *Paket:* ${lic.productName} (${lic.durationLabel || lic.expiresAt})\n📌 *Status:* ${lic.status}\n\n🔗 *Akses Studio:* https://dyariapp.my.id/#story-generator\n\n_Silakan masukkan email dan kode lisensi di atas untuk langsung membuka studio AI. Selamat berkreasi!_`;
                                      navigator.clipboard.writeText(text);
                                      showToast('Rincian Akses Disalin', 'Pesan WhatsApp siap dikirim ke member.');
                                    }}
                                    className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-emerald-200"
                                    title="Salin Rincian Akses (Format WA)"
                                  >
                                    <MessageSquare size={13} />
                                  </button>

                                  {/* Ubah Status */}
                                  <button
                                    onClick={() => {
                                      const next = lic.status === 'Aktif' ? 'Dibekukan' : 'Aktif';
                                      updateLicenseStatus(lic.id, next);
                                    }}
                                    className="p-1.5 rounded-lg text-warmgray hover:text-forest hover:bg-gray-100 border border-gray-200 text-[10px] font-bold"
                                    title={lic.status === 'Aktif' ? 'Bekukan Akses' : 'Aktifkan Akses'}
                                  >
                                    {lic.status === 'Aktif' ? 'Bekukan' : 'Aktifkan'}
                                  </button>

                                  {/* Hapus Lisensi */}
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Hapus member & lisensi ${lic.code} (${lic.customerName})?`)) {
                                        deleteLicense(lic.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 border border-rose-200"
                                    title="Hapus Member & Lisensi"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                      {licenses.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-warmgray">
                            <Key size={32} className="mx-auto mb-2 opacity-30" />
                            <p className="font-bold text-forest">Belum ada member Story Generator terdaftar</p>
                            <p className="text-xs mt-1">Klik "+ Daftarkan Member Story Generator" untuk menambahkan pengguna pertama.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: PRODUK & LISENSI                                  */}
          {/* ======================================================== */}
          {activeMenu === 'produk-lisensi' && (
            <div className="space-y-6">
              {/* Sub-tab Navigation */}
              <div className="flex items-center gap-2 border-b border-[#E5EAE4] pb-3 overflow-x-auto">
                <button
                  onClick={() => setSubTabProduk('kelola-produk')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    subTabProduk === 'kelola-produk'
                      ? 'bg-forest text-white shadow-xs'
                      : 'bg-white text-warmgray hover:text-forest border border-[#E5EAE4]'
                  }`}
                >
                  📦 Kelola Produk
                </button>
                <button
                  onClick={() => setSubTabProduk('kelola-kategori')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    subTabProduk === 'kelola-kategori'
                      ? 'bg-forest text-white shadow-xs'
                      : 'bg-white text-warmgray hover:text-forest border border-[#E5EAE4]'
                  }`}
                >
                  🏷️ Kelola Kategori
                </button>
                <button
                  onClick={() => setSubTabProduk('manajemen-stok')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    subTabProduk === 'manajemen-stok'
                      ? 'bg-forest text-white shadow-xs'
                      : 'bg-white text-warmgray hover:text-forest border border-[#E5EAE4]'
                  }`}
                >
                  📊 Manajemen Stok
                </button>
                <button
                  onClick={() => setSubTabProduk('kelola-lisensi')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    subTabProduk === 'kelola-lisensi'
                      ? 'bg-forest text-white shadow-xs'
                      : 'bg-white text-warmgray hover:text-forest border border-[#E5EAE4]'
                  }`}
                >
                  🔑 Kelola Lisensi
                </button>
              </div>

              {/* SUB-TAB 5A: KELOLA PRODUK */}
              {subTabProduk === 'kelola-produk' && (
                <div className="space-y-6 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAE4] pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          📦 Penjualan Langsung
                        </span>
                        <span className="text-xs text-warmgray">• Tanpa Wajib Daftar Akun</span>
                      </div>
                      <h2 className="text-xl font-heading font-extrabold text-forest">
                        Kelola Produk Digital (Langsung Sesuai Stok)
                      </h2>
                      <p className="text-xs text-warmgray">
                        Produk digital dijual langsung sesuai stok yang tersedia. Pembeli tidak diwajibkan mendaftar akun dan langsung menerima akses link materi digital di invoice pesanan.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleOpenAddProduct}
                        className="btn-dyari text-xs px-4 py-2 font-bold inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus size={14} />
                        <span>+ Tambah Produk Baru</span>
                      </button>
                    </div>
                  </div>

                  {/* Search and Filter Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {/* Filter Pills by Product Type */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      <button
                        onClick={() => setProductTypeFilter('ALL')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                          productTypeFilter === 'ALL'
                            ? 'bg-forest text-white shadow-2xs'
                            : 'bg-white border border-[#E5EAE4] text-warmgray hover:text-forest'
                        }`}
                      >
                        Semua ({products.length})
                      </button>
                      <button
                        onClick={() => setProductTypeFilter('APPS_PREMIUM')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                          productTypeFilter === 'APPS_PREMIUM'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-blue-50/60 border border-blue-200 text-blue-900 hover:bg-blue-100'
                        }`}
                      >
                        <span>📱 Apps</span>
                        <span className="bg-white/30 text-current text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                          {products.filter(p => (p.productType || (p.category === 'aplikasi' ? 'APPS_PREMIUM' : '')) === 'APPS_PREMIUM').length}
                        </span>
                      </button>
                      <button
                        onClick={() => setProductTypeFilter('DIGITAL_PREMIUM')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                          productTypeFilter === 'DIGITAL_PREMIUM'
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'bg-emerald-50/60 border border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                        }`}
                      >
                        <span>📦 Aset Member</span>
                        <span className="bg-white/30 text-current text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                          {products.filter(p => {
                            const pType = p.productType || (p.category === 'tools-ai' || p.type === 'LISENSI' ? 'LICENSE_TOOL' : (p.category === 'aplikasi' ? 'APPS_PREMIUM' : 'DIGITAL_PREMIUM'));
                            return pType === 'DIGITAL_PREMIUM';
                          }).length}
                        </span>
                      </button>
                      <button
                        onClick={() => setProductTypeFilter('LICENSE_TOOL')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                          productTypeFilter === 'LICENSE_TOOL'
                            ? 'bg-purple-700 text-white shadow-2xs'
                            : 'bg-purple-50/60 border border-purple-200 text-purple-900 hover:bg-purple-100'
                        }`}
                      >
                        <span>🔑 Tools AI</span>
                        <span className="bg-white/30 text-current text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                          {products.filter(p => {
                            const pType = p.productType || (p.category === 'tools-ai' || p.type === 'LISENSI' ? 'LICENSE_TOOL' : (p.category === 'aplikasi' ? 'APPS_PREMIUM' : 'DIGITAL_PREMIUM'));
                            return pType === 'LICENSE_TOOL';
                          }).length}
                        </span>
                      </button>
                    </div>

                    {/* Search Input in Admin */}
                    <div className="relative w-full sm:w-64 shrink-0">
                      <Search size={14} className="absolute left-3 top-2.5 text-warmgray" />
                      <input
                        type="text"
                        value={adminProductSearch}
                        onChange={(e) => setAdminProductSearch(e.target.value)}
                        placeholder="Cari produk di admin..."
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E5EAE4] rounded-xl text-xs text-forest placeholder:text-warmgray focus:outline-none focus:border-forest shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className="bg-white rounded-2xl border border-[#E5EAE4] shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAFBF9] border-b border-[#E5EAE4] text-warmgray uppercase text-[10px]">
                          <tr>
                            <th className="py-3 px-4 font-semibold text-center w-14">Urutan</th>
                            <th className="py-3 px-4 font-semibold">Produk</th>
                            <th className="py-3 px-4 font-semibold text-center">Status & Jumlah Stok</th>
                            <th className="py-3 px-4 font-semibold">Tipe & Mekanisme</th>
                            <th className="py-3 px-4 font-semibold">Kategori</th>
                            <th className="py-3 px-4 font-semibold">Harga Modal</th>
                            <th className="py-3 px-4 font-semibold">Harga Jual</th>
                            <th className="py-3 px-4 font-semibold">Badge</th>
                            <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0F4F1]">
                          {(() => {
                            const filteredAdminProducts = products.filter(p => {
                              const pType = p.productType || (
                                p.category === 'tools-ai' || p.type === 'LISENSI' 
                                  ? 'LICENSE_TOOL' 
                                  : (p.category === 'aplikasi' ? 'APPS_PREMIUM' : 'DIGITAL_PREMIUM')
                              );
                              const matchesType = productTypeFilter === 'ALL' || pType === productTypeFilter;
                              const q = adminProductSearch.toLowerCase().trim();
                              const matchesSearch = !q || p.name.toLowerCase().includes(q) || (p.categoryName && p.categoryName.toLowerCase().includes(q));
                              return matchesType && matchesSearch;
                            });

                            const paginatedAdminProducts = filteredAdminProducts.slice(
                              (adminProductPage - 1) * adminProductsPerPage,
                              adminProductPage * adminProductsPerPage
                            );

                            if (paginatedAdminProducts.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={9} className="py-8 text-center text-warmgray text-xs">
                                    Tidak ada produk yang sesuai dengan filter pencarian.
                                  </td>
                                </tr>
                              );
                            }

                            return paginatedAdminProducts.map((p, index) => {
                              const pType = p.productType || (
                                p.category === 'tools-ai' || p.type === 'LISENSI' 
                                  ? 'LICENSE_TOOL' 
                                  : (p.category === 'aplikasi' ? 'APPS_PREMIUM' : 'DIGITAL_PREMIUM')
                              );
                              const availableStock = getProductAvailableStock(p);
                              const isOutOfStock = availableStock <= 0;
                              const hasAccountStock = Array.isArray(p.accountStock) && p.accountStock.length > 0;

                              const globalIndex = (adminProductPage - 1) * adminProductsPerPage + index + 1;

                              return (
                                <tr key={p.id} className="hover:bg-[#FAFBF9] transition-colors">
                                  <td className="py-3.5 px-4 text-center font-bold text-forest/70 font-mono">
                                    #{p.sortOrder || globalIndex}
                                  </td>
                                  <td className="py-3.5 px-4 flex items-center gap-3">
                                    <img 
                                      src={
                                        p.image?.includes('res.cloudinary.com') && p.image?.includes('/upload/') && !p.image?.includes('/upload/f_auto')
                                          ? p.image.replace('/upload/', '/upload/f_auto,q_auto,w_100/')
                                          : (p.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80')
                                      } 
                                      alt={p.name} 
                                      loading="lazy"
                                      decoding="async"
                                      className="w-10 h-10 rounded-xl object-cover border border-[#E5EAE4] shrink-0 bg-slate-100" 
                                    />
                                    <div>
                                      <p className="font-heading font-bold text-forest max-w-[200px] truncate">{p.name}</p>
                                      <p className="text-[10px] text-warmgray truncate max-w-[200px]">{p.tagline || 'Produk digital siap pakai'}</p>
                                    </div>
                                  </td>

                                  {/* Status & Jumlah Stok */}
                                  <td className="py-3.5 px-4 text-center">
                                    {isOutOfStock ? (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                        <span>HABIS (0 Stok)</span>
                                      </span>
                                    ) : (
                                      <div className="space-y-0.5">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                          <span>{availableStock} Stok Ready</span>
                                        </span>
                                        {hasAccountStock && (
                                          <span className="block text-[9px] text-warmgray font-mono">
                                            ({p.accountStock.length} total baris)
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  
                                  {/* Tipe & Sifat Stok Column */}
                                  <td className="py-3.5 px-4">
                                    {pType === 'APPS_PREMIUM' && (
                                      <div className="space-y-0.5">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                                          <span>📱 Aplikasi Premium</span>
                                        </span>
                                        <span className="text-warmgray block text-[9px]">1x pakai • Anti-duplikasi</span>
                                      </div>
                                    )}
                                    {pType === 'DIGITAL_PREMIUM' && (
                                      <div className="space-y-0.5">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                                          <span>📦 Akses Member</span>
                                        </span>
                                        <span className="text-warmgray block text-[9px]">Akses Login Member</span>
                                      </div>
                                    )}
                                    {pType === 'LICENSE_TOOL' && (
                                      <div className="space-y-0.5">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                                          <span>🔑 Tools AI Premium</span>
                                        </span>
                                        <span className="text-warmgray block text-[9px]">Lisensi On-Demand</span>
                                      </div>
                                    )}
                                  </td>

                                  <td className="py-3.5 px-4 text-forest font-medium">
                                    <span className="bg-[#F0F4F1] px-2 py-0.5 rounded text-[11px]">
                                      {p.categoryName || 'Digital'}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4 font-mono font-semibold text-amber-900">
                                    Rp {(p.costPrice !== undefined ? p.costPrice : Math.round((p.price || 0) * 0.25)).toLocaleString('id-ID')}
                                  </td>
                                  <td className="py-3.5 px-4 font-mono font-bold text-forest">
                                    Rp {p.price.toLocaleString('id-ID')}
                                  </td>
                                  <td className="py-3.5 px-4">
                                    {p.badge ? (
                                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${p.badgeColor || 'bg-coral text-white'}`}>
                                        {p.badge}
                                      </span>
                                    ) : (
                                      <span className="text-warmgray text-[10px] italic">-</span>
                                    )}
                                  </td>
                                  <td className="py-3.5 px-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => navigateTo('product-detail', p.id)}
                                        className="p-1.5 text-warmgray hover:text-forest rounded-lg hover:bg-cream"
                                        title="Preview di Halaman Toko"
                                      >
                                        <Eye size={15} />
                                      </button>
                                      <button
                                        onClick={() => handleOpenEditProduct(p)}
                                        className="p-1.5 text-forest hover:text-emerald-700 rounded-lg hover:bg-emerald-50 font-bold"
                                        title="Edit Produk (Popup Modal)"
                                      >
                                        <Edit3 size={15} />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (window.confirm(`Hapus produk ${p.name}?`)) {
                                            deleteProduct(p.id);
                                            showToast('Produk Dihapus', p.name);
                                          }
                                        }}
                                        className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                                        title="Hapus Produk"
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    {(() => {
                      const filteredAdminProducts = products.filter(p => {
                        const pType = p.productType || (
                          p.category === 'tools-ai' || p.type === 'LISENSI' 
                            ? 'LICENSE_TOOL' 
                            : (p.category === 'aplikasi' ? 'APPS_PREMIUM' : 'DIGITAL_PREMIUM')
                        );
                        const matchesType = productTypeFilter === 'ALL' || pType === productTypeFilter;
                        const q = adminProductSearch.toLowerCase().trim();
                        return matchesType && (!q || p.name.toLowerCase().includes(q) || (p.categoryName && p.categoryName.toLowerCase().includes(q)));
                      });
                      const totalAdminProductPages = Math.ceil(filteredAdminProducts.length / adminProductsPerPage) || 1;

                      if (totalAdminProductPages <= 1) return null;

                      return (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-[#FAFBF9] border-t border-[#E5EAE4] text-xs">
                          <p className="text-warmgray text-[11px]">
                            Menampilkan halaman <strong className="text-forest">{adminProductPage}</strong> dari <strong className="text-forest">{totalAdminProductPages}</strong> ({filteredAdminProducts.length} total produk)
                          </p>
                          <div className="flex items-center gap-1.5">
                            <button
                              disabled={adminProductPage <= 1}
                              onClick={() => setAdminProductPage(p => Math.max(1, p - 1))}
                              className="px-3 py-1.5 rounded-lg border border-[#E5EAE4] bg-white font-semibold text-forest hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                            >
                              ← Sebelumnya
                            </button>
                            <span className="px-2.5 py-1 text-xs font-mono font-bold text-forest bg-forest/10 rounded-lg">
                              {adminProductPage}
                            </span>
                            <button
                              disabled={adminProductPage >= totalAdminProductPages}
                              onClick={() => setAdminProductPage(p => Math.min(totalAdminProductPages, p + 1))}
                              className="px-3 py-1.5 rounded-lg border border-[#E5EAE4] bg-white font-semibold text-forest hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                            >
                              Selanjutnya →
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* SUB-TAB 5B: KELOLA KATEGORI PRODUK */}
              {subTabProduk === 'kelola-kategori' && (
                <div className="space-y-6 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAE4] pb-4">
                    <div>
                      <h2 className="text-xl font-heading font-extrabold text-forest">Kelola Kategori Produk Toko</h2>
                      <p className="text-xs text-warmgray mt-0.5">
                        Kategori ini langsung tampil di beranda toko (section <em>"Temukan yang kamu butuhkan"</em>), tab filter katalog belanja, dan pilihan formulir produk.
                      </p>
                    </div>

                    <button
                      onClick={handleOpenAddCategory}
                      className="btn-dyari text-xs px-4 py-2 font-bold inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-xs"
                    >
                      <Plus size={15} />
                      <span>+ Tambah Kategori Baru</span>
                    </button>
                  </div>

                  {/* Info Banner */}
                  <div className="bg-[#FAFBF9] border border-[#E5EAE4] rounded-2xl p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-forest/10 text-forest flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      ✨
                    </div>
                    <div className="text-xs text-warmgray leading-relaxed space-y-1">
                      <p className="font-bold text-forest">Sinkronisasi Real-time dengan Halaman Web Publik:</p>
                      <p>
                        Setiap perubahan nama, ikon emoji, deskripsi, atau warna pastel kategori di sini akan langsung terlihat secara live oleh pembeli di web publik tanpa perlu reload. Jika Anda mengubah nama kategori, kategori produk terkait juga otomatis disinkronkan.
                      </p>
                    </div>
                  </div>

                  {/* Search and Stats Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative max-w-sm w-full">
                      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warmgray" />
                      <input
                        type="text"
                        value={categorySearchQuery}
                        onChange={(e) => setCategorySearchQuery(e.target.value)}
                        placeholder="Cari kategori produk..."
                        className="w-full bg-white border border-[#E5EAE4] text-xs rounded-xl py-2 pl-9 pr-3 text-forest focus:outline-none focus:border-forest"
                      />
                    </div>
                    <div className="text-xs text-warmgray font-medium flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-white border border-[#E5EAE4] rounded-lg font-bold text-forest">
                        {categories.length} Total Kategori
                      </span>
                    </div>
                  </div>

                  {/* Grid of Categories Cards with Live Public Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories
                      .filter(c => 
                        c.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) || 
                        (c.description && c.description.toLowerCase().includes(categorySearchQuery.toLowerCase())) ||
                        c.id.toLowerCase().includes(categorySearchQuery.toLowerCase())
                      )
                      .map((cat) => {
                        const productCount = products.filter(p => p.category === cat.id).length;
                        return (
                          <div 
                            key={cat.id} 
                            className="bg-white rounded-2xl border border-[#E5EAE4] p-4 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all group"
                          >
                            {/* Card Content & Live Web Preview */}
                            <div>
                              {/* Preview Box replicating HomeView public card */}
                              <div 
                                style={{ backgroundColor: cat.bgColor || '#E2EFE7' }}
                                className="rounded-xl p-4 text-center border border-black/5 mb-3 transition-transform group-hover:scale-[1.01]"
                              >
                                <div className="text-3xl mb-2">{cat.icon || '📦'}</div>
                                <h3 className="font-heading font-extrabold text-[#1C352D] text-sm leading-tight">
                                  {cat.name}
                                </h3>
                                <p className="text-[11px] text-[#555C56] mt-1 line-clamp-2 leading-snug">
                                  {cat.description || 'Tidak ada deskripsi'}
                                </p>
                              </div>

                              {/* Metadata Badges */}
                              <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px]">
                                <span className="bg-[#F0F4F1] text-forest font-mono px-2 py-0.5 rounded-md font-semibold">
                                  Slug: {cat.id}
                                </span>
                                <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded-md font-bold">
                                  {productCount} Produk Terkait
                                </span>
                                <span 
                                  className="w-4 h-4 rounded-full border border-black/10 inline-block shrink-0 ml-auto"
                                  style={{ backgroundColor: cat.bgColor || '#E2EFE7' }}
                                  title={`Warna: ${cat.bgColor || '#E2EFE7'}`}
                                />
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 pt-3 border-t border-[#F0F4F1]">
                              <button
                                onClick={() => handleOpenEditCategory(cat)}
                                className="flex-1 btn-dyari-outline text-xs py-1.5 font-bold flex items-center justify-center gap-1.5"
                              >
                                <Edit3 size={13} />
                                <span>Edit Kategori</span>
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat)}
                                className="p-2 text-warmgray hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200"
                                title="Hapus Kategori"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* SUB-TAB 5C: MANAJEMEN STOK BERDASARKAN FORM TEMA DYARI.IN */}
              {subTabProduk === 'manajemen-stok' && (() => {
                // Kumpulkan seluruh data stok dari semua produk
                const allStockItems = [];
                products.forEach(p => {
                  (p.accountStock || []).forEach(item => {
                    allStockItems.push({
                      ...item,
                      productId: p.id,
                      productName: p.name,
                      productCategory: p.categoryName || p.category || 'Digital',
                      productPrice: p.price,
                      productImage: p.image
                    });
                  });
                });

                // Filter berdasarkan pilihan Produk Dropdown
                const stockFilteredByProduct = stockProductFilter === 'ALL'
                  ? allStockItems
                  : allStockItems.filter(s => s.productId === stockProductFilter);

                // Hitung count untuk filter pill
                const totalStockCount = stockFilteredByProduct.length;
                const readyStockCount = stockFilteredByProduct.filter(s => !s.isSold).length;
                const soldStockCount = stockFilteredByProduct.filter(s => s.isSold).length;

                // Filter berdasarkan Status Tab (ALL | READY | SOLD)
                let displayedStock = stockFilteredByProduct;
                if (stockStatusFilter === 'READY') {
                  displayedStock = displayedStock.filter(s => !s.isSold);
                } else if (stockStatusFilter === 'SOLD') {
                  displayedStock = displayedStock.filter(s => s.isSold);
                }

                // Filter berdasarkan Search Query
                if (stockSearchQuery.trim()) {
                  const q = stockSearchQuery.toLowerCase();
                  displayedStock = displayedStock.filter(s => 
                    (s.text && s.text.toLowerCase().includes(q)) ||
                    (s.productName && s.productName.toLowerCase().includes(q)) ||
                    (s.soldTo && s.soldTo.toLowerCase().includes(q)) ||
                    (s.soldToEmail && s.soldToEmail.toLowerCase().includes(q))
                  );
                }

                // Handle Checkbox Selection
                const isAllSelected = displayedStock.length > 0 && displayedStock.every(s => selectedStockKeys.includes(`${s.productId}:::${s.id}`));
                
                const handleToggleSelectAll = () => {
                  if (isAllSelected) {
                    setSelectedStockKeys([]);
                  } else {
                    setSelectedStockKeys(displayedStock.map(s => `${s.productId}:::${s.id}`));
                  }
                };

                const handleToggleSelectOne = (key) => {
                  setSelectedStockKeys(prev => 
                    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
                  );
                };

                const handleBulkDeleteSelected = () => {
                  if (selectedStockKeys.length === 0) return;
                  if (!confirm(`Hapus ${selectedStockKeys.length} baris stok terpilih secara permanen?`)) return;
                  
                  const mapByProd = {};
                  selectedStockKeys.forEach(key => {
                    const [pId, sId] = key.split(':::');
                    if (!mapByProd[pId]) mapByProd[pId] = [];
                    mapByProd[pId].push(sId);
                  });

                  Object.entries(mapByProd).forEach(([pId, sIds]) => {
                    bulkDeleteStockItems(pId, sIds);
                  });

                  setSelectedStockKeys([]);
                  showToast('Stok Terpilih Dihapus', `${selectedStockKeys.length} item stok berhasil dihapus.`);
                };

                const handleCopyCredential = (text) => {
                  if (navigator?.clipboard?.writeText) {
                    navigator.clipboard.writeText(text);
                  }
                  showToast('Disalin', 'Link/kredensial stok berhasil disalin ke clipboard.');
                };

                return (
                  <div className="space-y-6 text-left">
                    {/* 1. HEADER UTAMA (TEMA DYARI.IN) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAE4] pb-4">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-sage border border-matcha/50 text-forest flex items-center justify-center shrink-0 shadow-2xs">
                          <Layers size={20} className="stroke-[2.2]" />
                        </div>
                        <div>
                          <h2 className="text-xl font-heading font-extrabold text-forest tracking-tight">
                            Manajemen & Kontrol Stok Produk
                          </h2>
                          <p className="text-xs text-warmgray mt-0.5">
                            Pantau ketersediaan link redeem, hapus stok kedaluwarsa/terjual, dan import batch stok dengan mudah.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setImportBatchTargetProductId(stockProductFilter !== 'ALL' ? stockProductFilter : (products[0]?.id || ''));
                          setImportBatchRawText('');
                          setShowImportBatchModal(true);
                        }}
                        className="btn-dyari text-xs px-4 py-2.5 font-bold shadow-xs inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                      >
                        <Plus size={15} />
                        <span>+ Tambah Stok Batch</span>
                      </button>
                    </div>

                    {/* 2. CONTROL & FILTER BAR (TEMA DYARI.IN) */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#FAFBF9] border border-[#E5EAE4] p-3 rounded-2xl shadow-2xs">
                      {/* Left: Product Selector Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-forest font-bold shrink-0">Produk:</span>
                        <select
                          value={stockProductFilter}
                          onChange={(e) => {
                            setStockProductFilter(e.target.value);
                            setSelectedStockKeys([]);
                          }}
                          className="bg-white border border-[#E5EAE4] text-forest text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-forest font-medium max-w-[280px] sm:max-w-[340px] truncate shadow-2xs"
                        >
                          <option value="ALL">Semua Produk ({allStockItems.length} total)</option>
                          {products.map(p => {
                            const pCount = (p.accountStock || []).length;
                            return (
                              <option key={p.id} value={p.id}>
                                {p.name} ({pCount} total)
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Middle: Filter Status Pills */}
                      <div className="flex items-center gap-1.5 self-start lg:self-auto">
                        <button
                          type="button"
                          onClick={() => setStockStatusFilter('ALL')}
                          className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                            stockStatusFilter === 'ALL'
                              ? 'bg-forest text-white shadow-xs'
                              : 'bg-white border border-[#E5EAE4] text-warmgray hover:text-forest hover:bg-sage-light'
                          }`}
                        >
                          Semua ({totalStockCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setStockStatusFilter('READY')}
                          className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                            stockStatusFilter === 'READY'
                              ? 'bg-forest text-white shadow-xs'
                              : 'bg-white border border-[#E5EAE4] text-warmgray hover:text-forest hover:bg-sage-light'
                          }`}
                        >
                          Ready ({readyStockCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setStockStatusFilter('SOLD')}
                          className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                            stockStatusFilter === 'SOLD'
                              ? 'bg-forest text-white shadow-xs'
                              : 'bg-white border border-[#E5EAE4] text-warmgray hover:text-forest hover:bg-sage-light'
                          }`}
                        >
                          Sold ({soldStockCount})
                        </button>
                      </div>

                      {/* Right: Search Input */}
                      <div className="relative w-full lg:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warmgray" />
                        <input
                          type="text"
                          value={stockSearchQuery}
                          onChange={(e) => setStockSearchQuery(e.target.value)}
                          placeholder="Cari link / ref order..."
                          className="w-full bg-white border border-[#E5EAE4] text-forest placeholder-warmgray-light text-xs rounded-xl pl-8.5 pr-3 py-2 focus:outline-none focus:border-forest shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* 4. ACTIONS BAR */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-forest font-medium">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleToggleSelectAll}
                            className="w-4 h-4 rounded border-[#D0DFD3] text-forest focus:ring-0 cursor-pointer accent-forest"
                          />
                          <span>Pilih Semua Halaman Ini ({displayedStock.length})</span>
                        </label>

                        {selectedStockKeys.length > 0 && (
                          <button
                            type="button"
                            onClick={handleBulkDeleteSelected}
                            className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Trash2 size={13} />
                            <span>Hapus ({selectedStockKeys.length}) Terpilih</span>
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => clearSoldStock(stockProductFilter === 'ALL' ? null : stockProductFilter)}
                        className="btn-dyari-outline text-xs px-3.5 py-1.5 font-bold hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-warmgray flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Bersihkan Semua Stok Terjual</span>
                      </button>
                    </div>

                    {/* 5. TABEL KREDENSIAL & STOK (TEMA DYARI.IN) */}
                    <div className="overflow-x-auto rounded-2xl border border-[#E5EAE4] bg-white shadow-2xs">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-[#FAFBF9] text-forest/70 uppercase text-[10px] font-bold tracking-wider border-b border-[#E5EAE4]">
                          <tr>
                            <th className="py-3 px-3.5 w-10 text-center">
                              <span className="sr-only">Pilih</span>
                            </th>
                            <th className="py-3 px-3">PRODUK</th>
                            <th className="py-3 px-3">LINK / KREDENSIAL STOK</th>
                            <th className="py-3 px-3 text-center">STATUS</th>
                            <th className="py-3 px-3">ORDER REF / WAKTU</th>
                            <th className="py-3 px-3 text-center w-16">AKSI</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0F4F1]">
                          {displayedStock.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-warmgray">
                                <Package size={32} className="mx-auto mb-2 opacity-40 text-forest" />
                                <p className="font-bold text-sm text-forest">Belum Ada Data Stok</p>
                                <p className="text-xs text-warmgray mt-1">
                                  Klik tombol "+ Tambah Stok Batch" di atas untuk memasukkan link atau akun baru.
                                </p>
                              </td>
                            </tr>
                          ) : (
                            displayedStock.map((item) => {
                              const key = `${item.productId}:::${item.id}`;
                              const isSelected = selectedStockKeys.includes(key);

                              return (
                                <tr key={key} className={`hover:bg-sage-light/40 transition-colors ${isSelected ? 'bg-sage-light/70' : ''}`}>
                                  {/* Select Checkbox */}
                                  <td className="py-3 px-3.5 text-center">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => handleToggleSelectOne(key)}
                                      className="w-4 h-4 rounded border-[#D0DFD3] text-forest focus:ring-0 cursor-pointer accent-forest"
                                    />
                                  </td>

                                  {/* Produk */}
                                  <td className="py-3 px-3 max-w-[220px]">
                                    <div className="flex items-center gap-2.5">
                                      {item.productImage && (
                                        <img src={item.productImage} alt={item.productName} className="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#E5EAE4]" />
                                      )}
                                      <div className="truncate">
                                        <p className="font-heading font-bold text-forest truncate text-xs">
                                          {item.productName}
                                        </p>
                                        <p className="text-[10px] text-warmgray truncate">
                                          {item.productCategory} • Rp {item.productPrice?.toLocaleString('id-ID')}
                                        </p>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Link / Kredensial Stok Box with Copy Button */}
                                  <td className="py-3 px-3">
                                    <div className="bg-[#F8FAF8] border border-[#E0E7E2] rounded-xl px-3 py-2 flex items-center justify-between gap-2 max-w-xl group">
                                      <span className="font-mono text-[11px] text-forest truncate select-all">
                                        {item.text}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleCopyCredential(item.text)}
                                        title="Salin Link/Kredensial"
                                        className="text-warmgray hover:text-forest p-1 rounded-lg hover:bg-sage transition-colors shrink-0 cursor-pointer"
                                      >
                                        <Copy size={13} />
                                      </button>
                                    </div>
                                  </td>

                                  {/* Status */}
                                  <td className="py-3 px-3 text-center">
                                    {item.isSold ? (
                                      <span className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                        <span>TERJUAL (SOLD)</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span>READY</span>
                                      </span>
                                    )}
                                  </td>

                                  {/* Order Ref / Waktu */}
                                  <td className="py-3 px-3">
                                    {item.isSold ? (
                                      <div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (item.soldTo && item.soldTo.startsWith('#$SHP-')) {
                                              const orderId = item.soldTo.replace('#', '');
                                              openInvoice(orderId);
                                            } else {
                                              showToast('Ref Order', item.soldTo || 'Pesanan Manual');
                                            }
                                          }}
                                          className="text-forest hover:text-forest-light font-mono font-bold text-[11px] inline-flex items-center gap-1 hover:underline cursor-pointer"
                                        >
                                          <span>{item.soldTo || '#$SHP-ORDER'}</span>
                                          <ExternalLink size={10} />
                                        </button>
                                        <p className="text-[10px] text-warmgray mt-0.5">
                                          {item.soldAt || 'Waktu tidak tercatat'}
                                        </p>
                                      </div>
                                    ) : (
                                      <div>
                                        <span className="text-warmgray text-xs font-mono">-</span>
                                        <p className="text-[10px] text-warmgray">
                                          Ditambahkan: {item.addedAt || 'Hari Ini'}
                                        </p>
                                      </div>
                                    )}
                                  </td>

                                  {/* Aksi */}
                                  <td className="py-3 px-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => toggleStockSold(item.productId, item.id)}
                                        title={item.isSold ? 'Ubah ke READY' : 'Tandai TERJUAL'}
                                        className="text-warmgray hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                                      >
                                        <CheckCircle2 size={14} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (confirm('Hapus baris stok ini?')) {
                                            deleteStockItem(item.productId, item.id);
                                          }
                                        }}
                                        title="Hapus baris stok"
                                        className="text-warmgray hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* SUB-TAB 5C: KELOLA LISENSI */}
              {subTabProduk === 'kelola-lisensi' && (
                <div className="space-y-8">
                  {/* Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAE4] pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
                          🔑 Lisensi & Paket Dinamis
                        </span>
                        <span className="text-xs text-warmgray">• Tidak Terbatas 3 Jenis</span>
                      </div>
                      <h2 className="text-xl font-heading font-extrabold text-forest">
                        Kelola Lisensi, Paket Harga & Member
                      </h2>
                      <p className="text-xs text-warmgray">
                        Atur jenis paket lisensi, tentukan harga dan durasi bebas, buat lisensi manual, dan kontrol member aktif.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={handleOpenAddPackage}
                        className="btn-dyari-outline text-xs px-4 py-2 font-bold inline-flex items-center gap-1.5"
                      >
                        <Plus size={14} />
                        <span>+ Tambah Paket Lisensi Baru</span>
                      </button>
                      <button
                        onClick={() => {
                          setLicenseFormData({
                            productId: 'story-generator',
                            productName: 'Story Generator Pro AI',
                            customerName: '',
                            customerEmail: '',
                            type: 'PERSONAL',
                            expiresAt: 'Selamanya (Lifetime)',
                            code: ''
                          });
                          setShowAddLicenseModal(true);
                        }}
                        className="btn-dyari text-xs px-4 py-2 font-bold inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Key size={14} />
                        <span>+ Buat Lisensi Manual</span>
                      </button>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* BAGIAN 1: PENGATURAN JENIS & HARGA PAKET LISENSI        */}
                  {/* ======================================================== */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base font-heading font-extrabold text-forest flex items-center gap-2">
                          <span>📦 Pengaturan Jenis, Durasi & Harga Paket Lisensi</span>
                          <span className="text-xs font-normal text-warmgray font-sans">
                            ({(licensePackages || []).length} paket aktif)
                          </span>
                        </h3>
                        <p className="text-xs text-warmgray">
                          Paket ini langsung ditampilkan di halaman publik <strong>/lisensi</strong> dan pilihan terbit lisensi manual. Anda bebas menambah paket baru tanpa batas 3 tier.
                        </p>
                      </div>

                      <button
                        onClick={handleOpenAddPackage}
                        className="text-xs font-bold text-forest hover:text-emerald-700 inline-flex items-center gap-1 self-start sm:self-auto"
                      >
                        <Plus size={13} />
                        <span>Tambah Tier Baru</span>
                      </button>
                    </div>

                    {/* License Packages Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {(licensePackages || []).map((pkg) => {
                        const featuresList = Array.isArray(pkg.features)
                          ? pkg.features
                          : (typeof pkg.features === 'string' ? pkg.features.split('\n').filter(Boolean) : []);

                        return (
                          <div
                            key={pkg.id}
                            className={`rounded-2xl p-5 border transition-all flex flex-col justify-between relative bg-white shadow-2xs ${
                              pkg.isPopular 
                                ? 'border-[#EE7C6B] ring-2 ring-[#EE7C6B]/20' 
                                : 'border-[#E5EAE4] hover:border-[#61A87D]'
                            }`}
                          >
                            {pkg.badge && (
                              <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-[#EE7C6B] text-white font-extrabold text-[10px] shadow-xs">
                                {pkg.badge}
                              </span>
                            )}

                            <div className="space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-heading font-extrabold text-base text-forest">
                                    {pkg.name}
                                  </h4>
                                  <p className="text-xs text-warmgray mt-0.5 line-clamp-2">
                                    {pkg.subtitle || 'Paket lisensi resmi Story Generator AI'}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-[#FAFBF9] rounded-xl p-3 border border-[#F0F4F1] space-y-1">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xl font-heading font-black text-forest">
                                    Rp {(pkg.price || 0).toLocaleString('id-ID')}
                                  </span>
                                  {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                                    <span className="text-xs text-warmgray line-through">
                                      Rp {pkg.originalPrice.toLocaleString('id-ID')}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                                  <Clock size={12} className="shrink-0 text-emerald-700" />
                                  <span>{pkg.duration || pkg.period || 'Masa Aktif Fleksibel'}</span>
                                </div>
                              </div>

                              {/* Features Preview */}
                              <div className="space-y-1.5 pt-1">
                                <span className="text-[10px] font-bold text-warmgray uppercase tracking-wider block">
                                  Fasilitas Paket ({featuresList.length}):
                                </span>
                                <ul className="space-y-1 text-xs text-forest">
                                  {featuresList.slice(0, 4).map((f, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                      <Check size={12} className="text-emerald-700 shrink-0 mt-0.5" />
                                      <span className="line-clamp-1">{f}</span>
                                    </li>
                                  ))}
                                  {featuresList.length > 4 && (
                                    <li className="text-[10px] text-warmgray italic pl-4">
                                      +{featuresList.length - 4} fasilitas lainnya...
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 mt-4 border-t border-[#F0F4F1] flex items-center justify-between gap-2">
                              <button
                                onClick={() => handleOpenEditPackage(pkg)}
                                className="flex-1 py-1.5 px-3 rounded-xl bg-gray-50 hover:bg-[#E8F1EA] text-forest border border-[#E5EAE4] hover:border-emerald-300 text-xs font-bold transition-all inline-flex items-center justify-center gap-1"
                              >
                                <Edit3 size={12} />
                                <span>Edit Paket & Harga</span>
                              </button>
                              <button
                                onClick={() => handleDeletePackage(pkg)}
                                className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                                title="Hapus Paket Ini"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* BAGIAN 2: DATABASE KUNCI LISENSI MEMBER TERDAFTAR       */}
                  {/* ======================================================== */}
                  <div className="space-y-4 pt-4 border-t border-[#E5EAE4]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-heading font-extrabold text-forest">
                          Database Kunci Lisensi Member Terdaftar
                        </h3>
                        <p className="text-xs text-warmgray">
                          Riwayat seluruh kunci lisensi yang aktif, dibekukan, atau kadaluarsa di sistem.
                        </p>
                      </div>

                      <div className="relative max-w-sm w-full sm:w-72">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warmgray" />
                        <input
                          type="text"
                          value={licenseSearchQuery}
                          onChange={(e) => setLicenseSearchQuery(e.target.value)}
                          placeholder="Cari kode lisensi, nama, atau email..."
                          className="w-full bg-[#F7F9F7] border border-[#E5EAE4] text-xs rounded-xl py-2 pl-9 pr-3 text-forest focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Licenses Table */}
                    <div className="bg-white rounded-2xl border border-[#E5EAE4] shadow-2xs overflow-hidden p-5">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="text-warmgray border-b border-[#F0F4F1]">
                              <th className="py-3 font-semibold">Kode Lisensi</th>
                              <th className="py-3 font-semibold">Paket & Hak Pakai</th>
                              <th className="py-3 font-semibold">Pemegang Lisensi</th>
                              <th className="py-3 font-semibold">Masa Berlaku</th>
                              <th className="py-3 font-semibold">Status Akses</th>
                              <th className="py-3 font-semibold text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#F0F4F1]">
                            {licenses
                              .filter(l => 
                                (l.code || '').toLowerCase().includes(licenseSearchQuery.toLowerCase()) || 
                                (l.customerName || '').toLowerCase().includes(licenseSearchQuery.toLowerCase()) ||
                                (l.customerEmail || '').toLowerCase().includes(licenseSearchQuery.toLowerCase()) ||
                                (l.productName || '').toLowerCase().includes(licenseSearchQuery.toLowerCase())
                              )
                              .map((lic) => {
                                const effective = getLicenseEffectiveStatus(lic);
                                return (
                                  <tr key={lic.id} className="hover:bg-[#FAFBF9] transition-colors">
                                    <td className="py-3.5">
                                      <div className="inline-flex items-center gap-1.5 bg-[#F7F9F7] px-2.5 py-1 rounded-xl border border-[#E5EAE4] font-mono text-[11px] font-bold text-forest">
                                        <span>{lic.code}</span>
                                        <button
                                          onClick={() => {
                                            navigator.clipboard.writeText(lic.code);
                                            showToast('Kode Lisensi Disalin', lic.code);
                                          }}
                                          className="text-warmgray hover:text-forest transition-colors"
                                          title="Salin Kode"
                                        >
                                          <Copy size={11} />
                                        </button>
                                      </div>
                                    </td>
                                    <td className="py-3.5 max-w-[200px]">
                                      <p className="font-bold text-forest truncate" title={lic.productName}>
                                        {lic.productName || 'Story Generator Pro AI'}
                                      </p>
                                      <span className="inline-block mt-0.5 bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
                                        {lic.type || 'PERSONAL'} • {lic.durationLabel || lic.expiresAt}
                                      </span>
                                    </td>
                                    <td className="py-3.5">
                                      <p className="font-semibold text-forest">{lic.customerName || 'Member dyari.in'}</p>
                                      <p className="text-[10px] text-warmgray font-mono">{lic.customerEmail || '-'}</p>
                                    </td>
                                    <td className="py-3.5">
                                      {lic.isLifetime ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                          ♾️ Lifetime (Selamanya)
                                        </span>
                                      ) : (
                                        <div className="space-y-0.5">
                                          <div className="flex items-center gap-1.5 text-forest font-medium text-[11px]">
                                            <Clock size={12} className="text-purple-700 shrink-0" />
                                            <span>{lic.expiresAt}</span>
                                          </div>
                                          <span className="text-[10px] text-warmgray block">
                                            {effective.remainingText}
                                          </span>
                                        </div>
                                      )}
                                    </td>
                                    <td className="py-3.5">
                                      <button
                                        onClick={() => {
                                          const next = lic.status === 'Aktif' ? 'Dibekukan' : 'Aktif';
                                          updateLicenseStatus(lic.id, next);
                                        }}
                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                                          effective.status === 'Aktif'
                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200'
                                            : effective.status === 'Kadaluarsa'
                                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                                              : 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                                        }`}
                                        title="Ubah Status Lisensi"
                                      >
                                        ● {lic.status === 'Aktif' ? 'Aktif' : (lic.status === 'Kadaluarsa' ? 'Kadaluarsa' : 'Dibekukan')}
                                      </button>
                                    </td>
                                    <td className="py-3.5 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          onClick={() => {
                                            const next = lic.status === 'Aktif' ? 'Dibekukan' : 'Aktif';
                                            updateLicenseStatus(lic.id, next);
                                          }}
                                          className="text-[10px] font-semibold text-warmgray hover:text-forest underline"
                                          title="Ubah Status Kunci Lisensi"
                                        >
                                          {lic.status === 'Aktif' ? 'Bekukan' : 'Aktifkan'}
                                        </button>
                                        <button
                                          onClick={() => {
                                            const text = `Halo Kak ${lic.customerName},\n\nBerikut rincian Kunci Lisensi resmi Anda di dyari.in:\n📦 Produk: ${lic.productName}\n🔑 Kode Lisensi: ${lic.code}\n🛡️ Hak Pakai: ${lic.type}\n📅 Mulai Beli: ${lic.createdAt}\n⏳ Berakhir: ${lic.expiresAt}\n📌 Status: ${effective.status}\n\nTerima kasih telah berbelanja di dyari.in!`;
                                            navigator.clipboard.writeText(text);
                                            showToast('Rincian Lisensi Disalin', 'Format pesan WhatsApp siap dikirim.');
                                          }}
                                          className="text-xs font-semibold text-forest hover:text-coral"
                                          title="Salin Rincian ke WA"
                                        >
                                          Salin Info
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (window.confirm(`Cabut dan hapus lisensi ${lic.code}?`)) {
                                              deleteLicense(lic.id);
                                            }
                                          }}
                                          className="p-1 text-rose-500 hover:text-rose-700"
                                          title="Cabut Lisensi"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: KUPON & PROMO                                     */}
          {/* ======================================================== */}
          {activeMenu === 'kupon' && (
            <div className="space-y-6">
              <div className="border-b border-[#E5EAE4] pb-4">
                <h1 className="text-2xl font-heading font-extrabold text-[#1C352D]">
                  Kupon Diskon & Promosi
                </h1>
                <p className="text-xs text-[#737873] mt-0.5">
                  Buat kode promo diskon untuk meningkatkan konversi checkout tokomu.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Active Coupons List */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5EAE4] shadow-2xs p-6 space-y-4">
                  <h3 className="font-heading font-bold text-base text-forest">Kupon Promo Aktif</h3>

                  <div className="space-y-3">
                    {coupons.map((cp) => (
                      <div key={cp.id} className="p-4 rounded-xl border border-[#E5EAE4] bg-[#FAFBF9] flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm bg-coral/20 text-coral-dark px-2.5 py-0.5 rounded-md">
                              {cp.code}
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              ● {cp.status}
                            </span>
                          </div>
                          <p className="text-xs text-forest font-semibold">
                            Diskon {cp.type === 'percent' ? `${cp.discount}%` : `Rp ${cp.discount.toLocaleString('id-ID')}`}
                          </p>
                          <p className="text-[10px] text-warmgray">
                            Min. Belanja: Rp {(cp.minSpend || 0).toLocaleString('id-ID')} • Terpakai: {cp.usageCount || 0} kali
                          </p>
                        </div>

                        <button
                          onClick={() => deleteCoupon(cp.id)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Nonaktifkan Kupon"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Create Coupon Form */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5EAE4] shadow-2xs p-6 space-y-4">
                  <h3 className="font-heading font-bold text-base text-forest">Buat Kupon Baru</h3>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!couponFormData.code) return;
                      addCoupon(couponFormData);
                      setCouponFormData({ code: '', discount: 20, type: 'percent', minSpend: 40000 });
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-forest">Kode Kupon</label>
                      <input
                        type="text"
                        required
                        value={couponFormData.code}
                        onChange={(e) => setCouponFormData({ ...couponFormData, code: e.target.value.toUpperCase() })}
                        placeholder="Contoh: MERDEKA50"
                        className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs font-mono font-bold text-forest focus:outline-none uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-forest">Tipe Diskon</label>
                        <select
                          value={couponFormData.type}
                          onChange={(e) => setCouponFormData({ ...couponFormData, type: e.target.value })}
                          className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3 py-2 text-xs text-forest focus:outline-none"
                        >
                          <option value="percent">Persentase (%)</option>
                          <option value="fixed">Nominal Tetap (Rp)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-forest">Besaran Diskon</label>
                        <input
                          type="number"
                          required
                          value={couponFormData.discount}
                          onChange={(e) => setCouponFormData({ ...couponFormData, discount: Number(e.target.value) })}
                          className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs font-bold text-forest focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-forest">Minimal Belanja (Rp)</label>
                      <input
                        type="number"
                        value={couponFormData.minSpend}
                        onChange={(e) => setCouponFormData({ ...couponFormData, minSpend: Number(e.target.value) })}
                        className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full btn-dyari text-xs py-2.5 font-bold shadow-xs mt-2"
                    >
                      Terbitkan Kupon
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: PENGATURAN (BRANDING, KONTAK, PEMBAYARAN)        */}
          {/* ======================================================== */}
          {activeMenu === 'pengaturan' && (
            <div className="space-y-6">
              {/* Sub-tab Navigation */}
              <div className="flex items-center gap-2 border-b border-[#E5EAE4] pb-3 overflow-x-auto">
                <button
                  onClick={() => setSubTabPengaturan('branding')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    subTabPengaturan === 'branding'
                      ? 'bg-forest text-white shadow-xs'
                      : 'bg-white text-warmgray hover:text-forest border border-[#E5EAE4]'
                  }`}
                >
                  🎨 Branding Web
                </button>
                <button
                  onClick={() => setSubTabPengaturan('kontak')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    subTabPengaturan === 'kontak'
                      ? 'bg-forest text-white shadow-xs'
                      : 'bg-white text-warmgray hover:text-forest border border-[#E5EAE4]'
                  }`}
                >
                  📞 Kontak CS & Medsos
                </button>
                <button
                  onClick={() => setSubTabPengaturan('pembayaran')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    subTabPengaturan === 'pembayaran'
                      ? 'bg-forest text-white shadow-xs'
                      : 'bg-white text-warmgray hover:text-forest border border-[#E5EAE4]'
                  }`}
                >
                  💳 Pengaturan Pembayaran
                </button>
                <button
                  onClick={() => setSubTabPengaturan('keamanan')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    subTabPengaturan === 'keamanan'
                      ? 'bg-forest text-white shadow-xs'
                      : 'bg-white text-warmgray hover:text-forest border border-[#E5EAE4]'
                  }`}
                >
                  🔒 Keamanan Akun Admin
                </button>
              </div>

              {/* SUB-TAB 7A: BRANDING WEB */}
              {subTabPengaturan === 'branding' && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAE4] shadow-2xs space-y-6 max-w-3xl">
                  <div className="border-b border-[#F0F4F1] pb-4">
                    <h2 className="text-xl font-heading font-extrabold text-forest">Branding & Tampilan Website</h2>
                    <p className="text-xs text-warmgray">Ubah identitas toko, logo, judul beranda, dan pengumuman promo secara langsung.</p>
                  </div>

                  <form onSubmit={handleSaveBranding} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-forest">Nama Toko (Brand)</label>
                        <input
                          type="text"
                          value={brandingForm.storeName}
                          onChange={(e) => setBrandingForm({ ...brandingForm, storeName: e.target.value })}
                          className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs font-bold text-forest focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-forest">Logo Badge Huruf (Fallback)</label>
                        <input
                          type="text"
                          maxLength={3}
                          value={brandingForm.logoBadge}
                          onChange={(e) => setBrandingForm({ ...brandingForm, logoBadge: e.target.value })}
                          className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs font-bold text-forest focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Logo Upload & Preview */}
                    <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E5EAE4] space-y-3">
                      <label className="text-xs font-bold text-forest block">Logo Website (Upload Gambar)</label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white border-2 border-dashed border-[#B8D8C0] flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                          {brandingForm.logoUrl ? (
                            <img src={brandingForm.logoUrl} alt="Logo Toko" className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="w-10 h-10 rounded-full bg-[#B8D8C0] flex items-center justify-center text-[#1C352D] text-sm font-black">
                              {brandingForm.logoBadge || 'dy'}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 flex-1 w-full">
                          <div className="flex items-center gap-2">
                            <label className="btn-dyari text-xs px-3.5 py-1.5 cursor-pointer inline-flex items-center gap-1.5 font-bold shadow-xs">
                              <Upload size={13} />
                              <span>Pilih File Gambar Logo</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleImageUpload(file, (dataUrl) => {
                                      setBrandingForm(prev => ({ ...prev, logoUrl: dataUrl }));
                                      showToast('Logo Dipilih', file.name);
                                    });
                                  }
                                }} 
                              />
                            </label>

                            {brandingForm.logoUrl && (
                              <button
                                type="button"
                                onClick={() => setBrandingForm(prev => ({ ...prev, logoUrl: '' }))}
                                className="text-xs text-rose-600 hover:underline font-semibold"
                              >
                                Hapus Logo
                              </button>
                            )}
                          </div>

                          <input
                            type="text"
                            value={brandingForm.logoUrl}
                            onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value })}
                            placeholder="Atau masukkan URL gambar langsung (https://...)"
                            className="w-full bg-white rounded-xl border border-[#E5EAE4] px-3 py-1.5 text-xs text-forest focus:outline-none font-mono"
                          />
                          <p className="text-[10px] text-warmgray">
                            Format disarankan: PNG transparan atau SVG (Maks. 3MB). Logo akan langsung tampil di navbar publik toko.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-forest">Tagline Toko</label>
                      <input
                        type="text"
                        value={brandingForm.tagline}
                        onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                        className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-forest">Judul Headline Hero Beranda</label>
                      <input
                        type="text"
                        value={brandingForm.heroTitle}
                        onChange={(e) => setBrandingForm({ ...brandingForm, heroTitle: e.target.value })}
                        className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-forest">Sub-judul Hero Beranda</label>
                      <textarea
                        rows={2}
                        value={brandingForm.heroSubtitle}
                        onChange={(e) => setBrandingForm({ ...brandingForm, heroSubtitle: e.target.value })}
                        className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] p-3 text-xs text-forest focus:outline-none"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-sage/40 border border-[#E5EAE4] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-forest">Pita Pengumuman Promo (Top Announcement Bar)</span>
                        <input
                          type="checkbox"
                          checked={brandingForm.showAnnouncement}
                          onChange={(e) => setBrandingForm({ ...brandingForm, showAnnouncement: e.target.checked })}
                          className="w-4 h-4 accent-forest cursor-pointer"
                        />
                      </div>
                      <input
                        type="text"
                        value={brandingForm.announcement}
                        onChange={(e) => setBrandingForm({ ...brandingForm, announcement: e.target.value })}
                        className="w-full bg-white rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-dyari text-xs px-6 py-2.5 font-bold shadow-xs mt-2"
                    >
                      Simpan Perubahan Branding
                    </button>
                  </form>
                </div>
              )}

              {/* SUB-TAB 7B: KONTAK */}
              {subTabPengaturan === 'kontak' && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAE4] shadow-2xs space-y-6 max-w-3xl">
                  <div className="border-b border-[#F0F4F1] pb-4">
                    <h2 className="text-xl font-heading font-extrabold text-forest">Informasi Kontak & Dukungan Toko</h2>
                    <p className="text-xs text-warmgray">Nomor WhatsApp CS, email resmi, dan media sosial dyari.in.</p>
                  </div>

                  <form onSubmit={handleSaveContact} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-forest">Nomor WhatsApp CS</label>
                        <input
                          type="text"
                          value={contactForm.whatsapp}
                          onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                          placeholder="6282330626054"
                          className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs font-mono font-bold text-forest focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-forest">Email Dukungan Pelanggan</label>
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-forest">Instagram</label>
                        <input
                          type="text"
                          value={contactForm.instagram}
                          onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                          className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-forest">TikTok</label>
                        <input
                          type="text"
                          value={contactForm.tiktok}
                          onChange={(e) => setContactForm({ ...contactForm, tiktok: e.target.value })}
                          className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-forest">Telegram</label>
                        <input
                          type="text"
                          value={contactForm.telegram}
                          onChange={(e) => setContactForm({ ...contactForm, telegram: e.target.value })}
                          className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-forest">Jam Operasional CS</label>
                      <input
                        type="text"
                        value={contactForm.operationalHours}
                        onChange={(e) => setContactForm({ ...contactForm, operationalHours: e.target.value })}
                        className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-dyari text-xs px-6 py-2.5 font-bold shadow-xs mt-2"
                    >
                      Simpan Perubahan Kontak
                    </button>
                  </form>
                </div>
              )}

              {/* SUB-TAB 7C: PENGATURAN PEMBAYARAN */}
              {subTabPengaturan === 'pembayaran' && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAE4] shadow-2xs space-y-6 max-w-3xl">
                  <div className="border-b border-[#F0F4F1] pb-4">
                    <h2 className="text-xl font-heading font-extrabold text-forest">Pengaturan Metode Pembayaran</h2>
                    <p className="text-xs text-warmgray">Konfigurasi QRIS Universal, Payment Gateway API, Virtual Account bank, dan E-Wallet.</p>
                  </div>

                  <form onSubmit={handleSavePayment} className="space-y-6">
                    {/* 1. QRIS Section */}
                    <div className="p-5 rounded-2xl bg-[#FAFBF9] border border-[#E5EAE4] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <QrCode size={18} className="text-forest" />
                          <h3 className="font-heading font-bold text-sm text-forest">QRIS Universal Otomatis</h3>
                        </div>
                        <input
                          type="checkbox"
                          checked={paymentForm.qrisActive}
                          onChange={(e) => setPaymentForm({ ...paymentForm, qrisActive: e.target.checked })}
                          className="w-4 h-4 accent-forest cursor-pointer"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-forest">Nama Merchant QRIS</label>
                          <input
                            type="text"
                            value={paymentForm.qrisName}
                            onChange={(e) => setPaymentForm({ ...paymentForm, qrisName: e.target.value })}
                            className="w-full bg-white rounded-xl border border-[#E5EAE4] px-3 py-2 text-xs text-forest focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-forest">NMID QRIS</label>
                          <input
                            type="text"
                            value={paymentForm.qrisNmid}
                            onChange={(e) => setPaymentForm({ ...paymentForm, qrisNmid: e.target.value })}
                            className="w-full bg-white rounded-xl border border-[#E5EAE4] px-3 py-2 text-xs font-mono text-forest focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* QRIS Image Upload & Preview */}
                      <div className="p-4 rounded-xl bg-white border border-[#E5EAE4] space-y-3">
                        <label className="text-xs font-bold text-forest block">Foto / Barcode QRIS (Upload Gambar)</label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="w-24 h-24 rounded-xl bg-[#FAFBF9] border border-[#E5EAE4] flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                            {paymentForm.qrisImageUrl ? (
                              <img src={paymentForm.qrisImageUrl} alt="QRIS Code" className="w-full h-full object-contain p-1" />
                            ) : (
                              <QrCode size={32} className="text-warmgray" />
                            )}
                          </div>

                          <div className="space-y-2 flex-1 w-full">
                            <div className="flex items-center gap-2">
                              <label className="btn-dyari text-xs px-3.5 py-1.5 cursor-pointer inline-flex items-center gap-1.5 font-bold shadow-xs">
                                <Upload size={13} />
                                <span>Upload Gambar QRIS</span>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleImageUpload(file, (dataUrl) => {
                                        setPaymentForm(prev => ({ ...prev, qrisImageUrl: dataUrl }));
                                        showToast('QRIS Diupload', file.name);
                                      });
                                    }
                                  }} 
                                />
                              </label>

                              {paymentForm.qrisImageUrl && (
                                <button
                                  type="button"
                                  onClick={() => setPaymentForm(prev => ({ ...prev, qrisImageUrl: '' }))}
                                  className="text-xs text-rose-600 hover:underline font-semibold"
                                >
                                  Hapus Gambar
                                </button>
                              )}
                            </div>

                            <input
                              type="text"
                              value={paymentForm.qrisImageUrl}
                              onChange={(e) => setPaymentForm({ ...paymentForm, qrisImageUrl: e.target.value })}
                              placeholder="Atau masukkan URL gambar barcode QRIS (https://...)"
                              className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3 py-1.5 text-xs text-forest focus:outline-none font-mono"
                            />
                            <p className="text-[10px] text-warmgray">
                              Upload screenshot atau barcode QRIS toko Anda agar pembeli bisa langsung scan saat proses checkout.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Payment Gateway Section */}
                    <div className="p-5 rounded-2xl bg-[#FAFBF9] border border-[#E5EAE4] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard size={18} className="text-forest" />
                          <h3 className="font-heading font-bold text-sm text-forest">Payment Gateway API (Tripay / Midtrans / Xendit)</h3>
                        </div>
                        <input
                          type="checkbox"
                          checked={paymentForm.gatewayActive}
                          onChange={(e) => setPaymentForm({ ...paymentForm, gatewayActive: e.target.checked })}
                          className="w-4 h-4 accent-forest cursor-pointer"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-forest">Provider Gateway</label>
                          <input
                            type="text"
                            value={paymentForm.gatewayProvider}
                            onChange={(e) => setPaymentForm({ ...paymentForm, gatewayProvider: e.target.value })}
                            className="w-full bg-white rounded-xl border border-[#E5EAE4] px-3 py-2 text-xs text-forest focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-forest">Server API Key / Secret</label>
                          <input
                            type="password"
                            value={paymentForm.gatewayApiKey}
                            onChange={(e) => setPaymentForm({ ...paymentForm, gatewayApiKey: e.target.value })}
                            className="w-full bg-white rounded-xl border border-[#E5EAE4] px-3 py-2 text-xs font-mono text-forest focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Virtual Accounts & Bank */}
                    <div className="p-5 rounded-2xl bg-[#FAFBF9] border border-[#E5EAE4] space-y-4">
                      <div className="flex items-center gap-2">
                        <Building2 size={18} className="text-forest" />
                        <h3 className="font-heading font-bold text-sm text-forest">Daftar Rekening Virtual Account & Bank</h3>
                      </div>

                      <div className="space-y-2">
                        {paymentForm.virtualAccounts.map((va, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[#E5EAE4] text-xs">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-forest font-mono w-14">{va.bank}</span>
                              <input
                                type="text"
                                value={va.accNo}
                                onChange={(e) => {
                                  const updated = [...paymentForm.virtualAccounts];
                                  updated[idx].accNo = e.target.value;
                                  setPaymentForm({ ...paymentForm, virtualAccounts: updated });
                                }}
                                className="bg-[#F7F9F7] px-2 py-1 rounded border border-[#E5EAE4] font-mono text-xs"
                              />
                            </div>

                            <input
                              type="checkbox"
                              checked={va.active}
                              onChange={(e) => {
                                const updated = [...paymentForm.virtualAccounts];
                                updated[idx].active = e.target.checked;
                                setPaymentForm({ ...paymentForm, virtualAccounts: updated });
                              }}
                              className="w-4 h-4 accent-forest cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-dyari text-xs px-6 py-2.5 font-bold shadow-xs"
                    >
                      Simpan Seluruh Pengaturan Pembayaran
                    </button>
                  </form>
                </div>
              )}

              {/* SUB-TAB 7D: KEAMANAN AKUN ADMIN */}
              {subTabPengaturan === 'keamanan' && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAE4] shadow-2xs space-y-6 max-w-2xl">
                  <div className="border-b border-[#F0F4F1] pb-4 flex items-center justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold mb-1.5">
                        <ShieldCheck size={12} className="text-emerald-600" />
                        <span>Proteksi Tingkat Tinggi</span>
                      </div>
                      <h2 className="text-xl font-heading font-extrabold text-forest">Kredensial & Keamanan Administrator</h2>
                      <p className="text-xs text-warmgray">Kelola alamat email dan kata sandi rahasia untuk mengakses panel kontrol ini.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveAdminSecurity} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-forest">Email Administrator</label>
                      <input
                        type="email"
                        required
                        value={adminSecurityForm.email}
                        onChange={(e) => setAdminSecurityForm({ ...adminSecurityForm, email: e.target.value })}
                        className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2.5 text-xs font-semibold text-forest focus:outline-none"
                      />
                      <p className="text-[10px] text-warmgray">Email ini digunakan sebagai username autentikasi saat membuka panel admin.</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-forest">Kata Sandi Saat Ini (Verifikasi)</label>
                      <input
                        type="password"
                        required
                        value={adminSecurityForm.currentPassword}
                        onChange={(e) => setAdminSecurityForm({ ...adminSecurityForm, currentPassword: e.target.value })}
                        placeholder="Masukkan kata sandi lama Anda"
                        className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2.5 text-xs font-mono text-forest focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-forest">Kata Sandi Baru (Opsional)</label>
                        <input
                          type="password"
                          value={adminSecurityForm.newPassword}
                          onChange={(e) => setAdminSecurityForm({ ...adminSecurityForm, newPassword: e.target.value })}
                          placeholder="Minimal 8 karakter"
                          className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2.5 text-xs font-mono text-forest focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-forest">Ulangi Kata Sandi Baru</label>
                        <input
                          type="password"
                          value={adminSecurityForm.confirmPassword}
                          onChange={(e) => setAdminSecurityForm({ ...adminSecurityForm, confirmPassword: e.target.value })}
                          placeholder="Ketik ulang kata sandi baru"
                          className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2.5 text-xs font-mono text-forest focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs space-y-1.5 mt-2">
                      <p className="font-bold flex items-center gap-1.5 text-amber-800">
                        <AlertCircle size={14} className="shrink-0" />
                        Catatan Keamanan Penting:
                      </p>
                      <p className="text-[11px] leading-relaxed text-amber-900/90">
                        Pastikan Anda mencatat dan mengingat kata sandi baru yang Anda simpan. Jika Anda keluar atau membuka browser mode samaran (incognito), Anda wajib memasukkan email dan kata sandi terbaru ini.
                      </p>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="btn-dyari text-xs px-6 py-2.5 font-bold shadow-xs inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Save size={14} />
                        <span>Simpan Perubahan Kredensial</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleAdminLogout}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Lock size={13} />
                        <span>Kunci & Uji Login</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ======================================================== */}
      {/* 3. MODALS (LICENSE, MEMBER, INVOICE)                     */}
      {/* ======================================================== */}

      {/* ======================================================== */}
      {/* 3. MODALS (LICENSE, PACKAGE, MEMBER, INVOICE)              */}
      {/* ======================================================== */}

      {/* MODAL: TERBITKAN LISENSI BARU / MANUAL */}
      {showAddLicenseModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 border border-[#E5EAE4] shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#F0F4F1] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-forest text-white flex items-center justify-center">
                  <Key size={16} />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-forest">
                    Terbitkan Kunci Lisensi Manual
                  </h3>
                  <p className="text-[11px] text-warmgray">
                    Daftarkan lisensi Story Generator atau tools AI untuk member.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowAddLicenseModal(false)} className="text-warmgray hover:text-forest">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateLicense} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-forest">Pilih Paket Lisensi / Produk</label>
                <select
                  value={licenseFormData.productId}
                  onChange={(e) => {
                    const selId = e.target.value;
                    const matchedPkg = (licensePackages || []).find(p => p.id === selId);
                    if (matchedPkg) {
                      setLicenseFormData({
                        ...licenseFormData,
                        productId: matchedPkg.id,
                        productName: matchedPkg.name,
                        expiresAt: matchedPkg.duration || matchedPkg.period || 'Selamanya (Lifetime)'
                      });
                      setIsCustomPackageDuration(false);
                    } else {
                      const selected = products.find(p => p.id === selId);
                      setLicenseFormData({
                        ...licenseFormData,
                        productId: selId,
                        productName: selected ? selected.name : 'Story Generator Pro AI'
                      });
                    }
                  }}
                  className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3 py-2 text-xs text-forest focus:outline-none font-medium"
                >
                  <optgroup label="🎬 Paket Lisensi Story Generator">
                    {(licensePackages || []).map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        ⭐ {pkg.name} ({pkg.duration || pkg.period}) - Rp {(pkg.price || 0).toLocaleString('id-ID')}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="📦 Tools & Produk Lainnya">
                    {products.filter(p => p.category === 'tools-ai' || p.productType === 'LICENSE_TOOL').map(p => (
                      <option key={p.id} value={p.id}>🔑 {p.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-forest">Nama Member / Pelanggan</label>
                <input
                  type="text"
                  required
                  value={licenseFormData.customerName}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, customerName: e.target.value })}
                  placeholder="Nama Lengkap Member"
                  className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-forest">Email Member Terdaftar</label>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                    Kunci Login Story Generator
                  </span>
                </div>
                <input
                  type="email"
                  required
                  value={licenseFormData.customerEmail}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, customerEmail: e.target.value })}
                  placeholder="member@gmail.com"
                  className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none font-mono"
                />
                <p className="text-[10px] text-warmgray">
                  Member akan memasukkan email ini beserta kode lisensi untuk membuka Story Generator.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-forest">Tipe Hak Pakai</label>
                  </div>
                  <select
                    value={licenseFormData.type}
                    onChange={(e) => setLicenseFormData({ ...licenseFormData, type: e.target.value })}
                    className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3 py-2 text-xs text-forest focus:outline-none font-semibold"
                  >
                    <option value="PERSONAL">PERSONAL (1 User)</option>
                    <option value="COMMERCIAL">COMMERCIAL (Klien)</option>
                    <option value="AGENCY">AGENCY (Tim)</option>
                    <option value="RESELLER">RESELLER</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-forest">Masa Berlaku</label>
                    <span className="text-[10px] text-purple-700 font-semibold">Durasi</span>
                  </div>
                  <select
                    value={isCustomPackageDuration ? 'CUSTOM' : licenseFormData.expiresAt}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setIsCustomPackageDuration(true);
                        setLicenseFormData({ ...licenseFormData, expiresAt: '' });
                      } else {
                        setIsCustomPackageDuration(false);
                        setLicenseFormData({ ...licenseFormData, expiresAt: e.target.value });
                      }
                    }}
                    className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3 py-2 text-xs text-forest focus:outline-none font-semibold"
                  >
                    <option value="Selamanya (Lifetime)">Selamanya (Lifetime)</option>
                    <option value="1 Tahun (365 Hari)">1 Tahun (365 Hari)</option>
                    <option value="6 Bulan (180 Hari)">6 Bulan (180 Hari)</option>
                    <option value="3 Bulan (90 Hari)">3 Bulan (90 Hari)</option>
                    <option value="30 Hari (1 Bulan)">30 Hari (1 Bulan)</option>
                    <option value="14 Hari">14 Hari</option>
                    <option value="7 Hari (Trial)">7 Hari (Trial)</option>
                    <option value="CUSTOM">✏️ Kustom (Input Sendiri)...</option>
                  </select>
                </div>
              </div>

              {isCustomPackageDuration && (
                <div className="space-y-1.5 p-3 rounded-2xl bg-purple-50/70 border border-purple-200 animate-scale-up">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                      <span>✏️ Ketik Masa Berlaku yang Anda Inginkan:</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomPackageDuration(false);
                        setLicenseFormData({ ...licenseFormData, expiresAt: 'Selamanya (Lifetime)' });
                      }}
                      className="text-[10px] text-purple-700 hover:underline font-semibold"
                    >
                      Batal / Kembali ke Preset
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={licenseFormData.expiresAt}
                    onChange={(e) => setLicenseFormData({ ...licenseFormData, expiresAt: e.target.value })}
                    placeholder="Contoh: 3 Hari, 2 Tahun, Hingga 31 Des 2026, 45 Hari"
                    className="w-full bg-white rounded-xl border border-purple-200 px-3.5 py-2 text-xs text-forest focus:outline-none font-medium"
                    autoFocus
                  />
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-forest">Kode Lisensi Khusus (Opsional)</label>
                  <span className="text-[10px] text-warmgray">Kosongkan jika ingin acak</span>
                </div>
                <input
                  type="text"
                  value={licenseFormData.code}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, code: e.target.value.toUpperCase() })}
                  placeholder="Contoh: DYARI-STORY-VIP-2026 (Opsional)"
                  className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLicenseModal(false)}
                  className="btn-dyari-outline text-xs px-4 py-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-dyari text-xs px-5 py-2 font-bold"
                >
                  Terbitkan Lisensi & Daftarkan Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KELOLA PAKET LISENSI (TAMBAH / EDIT DINAMIS) */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 border border-[#E5EAE4] shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F0F4F1] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center">
                  <Tag size={16} />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-forest">
                    {editingPackage ? 'Edit Paket & Harga Lisensi' : 'Tambah Paket Lisensi Baru'}
                  </h3>
                  <p className="text-[11px] text-warmgray">
                    Atur nama, durasi, harga jual, dan fasilitas paket yang tampil di website.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowPackageModal(false)} className="text-warmgray hover:text-forest">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-forest">Nama Paket Lisensi</label>
                <input
                  type="text"
                  required
                  value={packageFormData.name}
                  onChange={(e) => setPackageFormData({ ...packageFormData, name: e.target.value })}
                  placeholder="Contoh: Pro Creator License, Paket Agensi 6 Bulan"
                  className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-forest">Keterangan Singkat (Subtitle)</label>
                <input
                  type="text"
                  value={packageFormData.subtitle}
                  onChange={(e) => setPackageFormData({ ...packageFormData, subtitle: e.target.value })}
                  placeholder="Contoh: Cocok untuk kreator konten & agensi video"
                  className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={packageFormData.price}
                    onChange={(e) => setPackageFormData({ ...packageFormData, price: e.target.value })}
                    placeholder="Contoh: 199000"
                    className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest">Harga Coret / Asli (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={packageFormData.originalPrice}
                    onChange={(e) => setPackageFormData({ ...packageFormData, originalPrice: e.target.value })}
                    placeholder="Contoh: 499000"
                    className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-forest">Masa Berlaku / Durasi</label>
                    <span className="text-[10px] text-purple-700 font-semibold">Durasi</span>
                  </div>
                  <select
                    value={isCustomPackageDuration ? 'CUSTOM' : packageFormData.duration}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setIsCustomPackageDuration(true);
                        setPackageFormData({ ...packageFormData, duration: '' });
                      } else {
                        setIsCustomPackageDuration(false);
                        setPackageFormData({ ...packageFormData, duration: e.target.value });
                      }
                    }}
                    className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3 py-2 text-xs text-forest focus:outline-none font-semibold"
                  >
                    <option value="30 Hari (1 Bulan)">30 Hari (1 Bulan)</option>
                    <option value="3 Bulan (90 Hari)">3 Bulan (90 Hari)</option>
                    <option value="6 Bulan (180 Hari)">6 Bulan (180 Hari)</option>
                    <option value="1 Tahun (365 Hari)">1 Tahun (365 Hari)</option>
                    <option value="Selamanya (Lifetime)">Selamanya (Lifetime)</option>
                    <option value="14 Hari">14 Hari</option>
                    <option value="7 Hari (Trial)">7 Hari (Trial)</option>
                    <option value="CUSTOM">✏️ Kustom (Input Sendiri)...</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest">Badge Label (Opsional)</label>
                  <input
                    type="text"
                    value={packageFormData.badge}
                    onChange={(e) => setPackageFormData({ ...packageFormData, badge: e.target.value })}
                    placeholder="Contoh: Paling Populer ⭐, Best Value 💎"
                    className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none"
                  />
                </div>
              </div>

              {isCustomPackageDuration && (
                <div className="space-y-1 p-3 rounded-2xl bg-purple-50/70 border border-purple-200 animate-scale-up">
                  <label className="text-xs font-bold text-purple-950 block">Ketik Durasi Kustom:</label>
                  <input
                    type="text"
                    required
                    value={packageFormData.duration}
                    onChange={(e) => setPackageFormData({ ...packageFormData, duration: e.target.value })}
                    placeholder="Contoh: 45 Hari, 2 Tahun, 5 Bulan"
                    className="w-full bg-white rounded-xl border border-purple-200 px-3.5 py-2 text-xs text-forest focus:outline-none font-medium"
                    autoFocus
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPopularPkg"
                  checked={packageFormData.isPopular}
                  onChange={(e) => setPackageFormData({ ...packageFormData, isPopular: e.target.checked })}
                  className="rounded text-emerald-700 focus:ring-emerald-700"
                />
                <label htmlFor="isPopularPkg" className="text-xs font-semibold text-forest cursor-pointer">
                  Sorot sebagai Paket Paling Populer / Unggulan (Highlight Card)
                </label>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-forest">Fasilitas & Fitur Paket</label>
                  <span className="text-[10px] text-warmgray">1 Baris = 1 Fitur</span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={packageFormData.features}
                  onChange={(e) => setPackageFormData({ ...packageFormData, features: e.target.value })}
                  placeholder="Ketik fasilitas paket, pisahkan dengan baris baru (Enter)..."
                  className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2.5 text-xs text-forest focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPackageModal(false)}
                  className="btn-dyari-outline text-xs px-4 py-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-dyari text-xs px-5 py-2 font-bold"
                >
                  {editingPackage ? 'Simpan Perubahan Paket' : 'Tambah Paket Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH MEMBER MANUAL */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 border border-[#E5EAE4] shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#F0F4F1] pb-3">
              <h3 className="font-heading font-extrabold text-base text-forest">Tambah Member Manual</h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-warmgray hover:text-forest">
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!customerFormData.name || !customerFormData.email) return;
                addCustomer(customerFormData);
                setShowAddMemberModal(false);
                setCustomerFormData({ name: '', email: '', phone: '', notes: 'Member Langganan Digital' });
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-forest">Nama Member</label>
                <input
                  type="text"
                  required
                  value={customerFormData.name}
                  onChange={(e) => setCustomerFormData({ ...customerFormData, name: e.target.value })}
                  placeholder="Contoh: Rian Prasetya"
                  className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-forest">Email Member</label>
                <input
                  type="email"
                  required
                  value={customerFormData.email}
                  onChange={(e) => setCustomerFormData({ ...customerFormData, email: e.target.value })}
                  placeholder="member@gmail.com"
                  className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-forest">Nomor WhatsApp</label>
                <input
                  type="text"
                  value={customerFormData.phone}
                  onChange={(e) => setCustomerFormData({ ...customerFormData, phone: e.target.value })}
                  placeholder="081234567890"
                  className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="btn-dyari-outline text-xs px-4 py-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-dyari text-xs px-5 py-2 font-bold"
                >
                  Simpan Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL INVOICE TRANSAKSI (RESPONSIVE SCALING & FULLSCREEN) */}
      {selectedOrderDetails && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOrderDetails(null);
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        >
          <div 
            className={`bg-white rounded-3xl border border-[#E5EAE4] shadow-2xl animate-scale-up flex flex-col transition-all duration-300 ${
              isInvoiceFullscreen
                ? 'w-full max-w-5xl h-[95vh]'
                : 'w-full max-w-xl max-h-[90vh]'
            }`}
          >
            {/* 1. Header (Sticky Top) */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F4F1] bg-[#FAFBF9] rounded-t-3xl shrink-0">
              <div>
                <span className="text-[10px] font-bold text-warmgray uppercase tracking-wider">BUKTI INVOICE RESMI</span>
                <h3 className="font-heading font-extrabold text-xl text-forest flex items-center gap-2">
                  <span>{selectedOrderDetails.id}</span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    selectedOrderDetails.status === 'Lunas'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {selectedOrderDetails.status === 'Lunas' ? '✓ Lunas' : '⏳ Pending'}
                  </span>
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsInvoiceFullscreen(prev => !prev)}
                  className="p-2 rounded-xl text-warmgray hover:text-forest hover:bg-gray-100 transition"
                  title={isInvoiceFullscreen ? "Tampilan Standar" : "Tampilan Penuh (Fullscreen)"}
                >
                  {isInvoiceFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
                </button>
                <button 
                  type="button"
                  onClick={() => setSelectedOrderDetails(null)} 
                  className="p-2 rounded-xl text-warmgray hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Tutup Modal (Esc)"
                >
                  <X size={19} />
                </button>
              </div>
            </div>

            {/* 2. Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
              <div className="grid grid-cols-2 gap-4 text-xs bg-[#FAFBF9] p-3.5 rounded-2xl border border-[#E5EAE4]">
                <div>
                  <span className="text-warmgray block text-[11px]">Pelanggan:</span>
                  <strong className="text-forest text-sm">{selectedOrderDetails.customer}</strong>
                  <p className="text-[11px] text-warmgray font-mono">{selectedOrderDetails.email || 'customer@gmail.com'}</p>
                </div>
                <div>
                  <span className="text-warmgray block text-[11px]">Waktu Transaksi:</span>
                  <strong className="text-forest">{selectedOrderDetails.date}</strong>
                  <p className={`text-[11px] font-bold mt-0.5 ${
                    selectedOrderDetails.status === 'Lunas' ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    Status: {selectedOrderDetails.status}
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t border-[#F0F4F1] pt-3">
                <span className="text-[11px] font-bold text-warmgray uppercase">Rincian Item & Akses Produk</span>
                {selectedOrderDetails.items?.map((it, idx) => {
                  const prod = products.find(p => p.id === it.id || p.name === it.name);
                  return (
                    <div key={idx} className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EAE4] space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-forest font-bold">{it.name}</span>
                        <span className="font-mono font-bold text-forest">Rp {it.price.toLocaleString('id-ID')}</span>
                      </div>

                      {/* Apps Premium Delivery: Exclusive Account / Link */}
                      {it.assignedAccount && (
                        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-2 text-left">
                          <div className="overflow-hidden">
                            <span className="text-[10px] font-bold text-blue-900 block">📱 Akun / Link Eksklusif Pembeli (1x Pakai - Sold Out):</span>
                            <code className="text-xs font-mono font-bold text-blue-800 break-all">{it.assignedAccount}</code>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(it.assignedAccount);
                              showToast('Akun Disalin', it.assignedAccount);
                            }}
                            className="p-1.5 rounded-lg bg-white text-blue-700 hover:bg-blue-100 shrink-0 shadow-2xs transition"
                            title="Salin Akun"
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      )}

                      {/* License Tool Delivery: Unique License Key */}
                      {it.generatedLicense && (
                        <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between gap-2 text-left">
                          <div className="overflow-hidden">
                            <span className="text-[10px] font-bold text-purple-900 block">🔑 Kunci Lisensi Aktivasi Tools (Auto-Generate):</span>
                            <code className="text-xs font-mono font-black text-purple-800 tracking-wide">{it.generatedLicense}</code>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(it.generatedLicense);
                              showToast('Kunci Lisensi Disalin', it.generatedLicense);
                            }}
                            className="p-1.5 rounded-lg bg-white text-purple-700 hover:bg-purple-100 shrink-0 shadow-2xs transition"
                            title="Salin Lisensi"
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      )}

                      {/* Digital Premium Delivery: Master Shared Link */}
                      {(it.masterAccessUrl || prod?.accessUrl) && !it.assignedAccount && !it.generatedLicense && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-left">
                          <div className="overflow-hidden">
                            <span className="text-[10px] font-bold text-emerald-900 block">📦 Link Master Produk Digital (Shared):</span>
                            <span className="text-[11px] font-mono text-emerald-800 truncate block max-w-sm">
                              {it.masterAccessUrl || prod?.accessUrl}
                            </span>
                          </div>
                          <a
                            href={it.masterAccessUrl || prod?.accessUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-white text-emerald-700 hover:bg-emerald-100 shrink-0 flex items-center gap-1 text-[11px] font-bold px-2.5 shadow-2xs transition"
                          >
                            <span>Buka Link</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-sm font-bold border-t border-[#F0F4F1] pt-3">
                <span className="text-forest">Total Pembayaran</span>
                <span className="font-heading font-extrabold text-lg text-forest">
                  Rp {selectedOrderDetails.total.toLocaleString('id-ID')}
                </span>
              </div>

              {/* After Purchase Message */}
              {selectedOrderDetails.items?.some(it => {
                const p = products.find(prod => prod.id === it.id || prod.name === it.name);
                return p?.afterPurchaseMessage || it.afterPurchaseMessage;
              }) && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5 text-left">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 size={14} className="text-emerald-700" />
                    <span>Pesan Akses Setelah Pembelian dari Penjual:</span>
                  </span>
                  <div className="text-emerald-900 space-y-1 leading-relaxed">
                    {selectedOrderDetails.items.map((it, idx) => {
                      const p = products.find(prod => prod.id === it.id || prod.name === it.name);
                      const msg = p?.afterPurchaseMessage || it.afterPurchaseMessage;
                      if (!msg) return null;
                      return (
                        <p key={idx} className="bg-white/70 p-2 rounded-lg border border-emerald-100">
                          <strong className="text-emerald-950">• {it.name}:</strong> {msg}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedOrderDetails.status !== 'Lunas' ? (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2.5 text-left">
                  <div className="flex justify-between items-center">
                    <p>Metode Pembayaran: <strong>{selectedOrderDetails.paymentMethod}</strong></p>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">⏳ Menunggu Pembayaran</span>
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    Akses produk belum diserahkan ke pembeli. Klik tombol di bawah jika pembeli sudah mentransfer dana.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      updateOrderStatus(selectedOrderDetails.id, 'Lunas');
                      setSelectedOrderDetails({ ...selectedOrderDetails, status: 'Lunas' });
                      showToast('Pesanan Lunas', `Kredensial untuk ${selectedOrderDetails.id} telah aktif.`);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition"
                  >
                    <CheckCircle2 size={14} />
                    <span>Verifikasi & Tandai Lunas Sekarang</span>
                  </button>
                </div>
              ) : (
                <div className="bg-cream p-3.5 rounded-2xl text-xs text-warmgray text-left border border-[#E5EAE4]">
                  <p>Metode Pembayaran: <strong>{selectedOrderDetails.paymentMethod}</strong></p>
                  <p className="text-emerald-700 font-semibold mt-0.5">✓ Terverifikasi Lunas di Server dyari.in</p>
                </div>
              )}
            </div>

            {/* 3. Footer (Sticky Bottom) */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 border-t border-[#F0F4F1] bg-[#FAFBF9] rounded-b-3xl shrink-0">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const url = getInvoiceUrl(selectedOrderDetails.id);
                    navigator.clipboard.writeText(url);
                    showToast('Link Invoice Disalin', url);
                  }}
                  className="btn-dyari-outline text-xs px-3 py-2 flex items-center gap-1"
                  title="Salin Link Invoice Publik"
                >
                  <Share2 size={13} />
                  <span>Salin Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => sendInvoiceWhatsApp(selectedOrderDetails)}
                  className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1 transition"
                  title="Kirim Invoice ke WhatsApp Pembeli"
                >
                  <MessageCircle size={13} />
                  <span>Kirim WA</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    openInvoice(selectedOrderDetails.id);
                    setSelectedOrderDetails(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold flex items-center gap-1 transition"
                  title="Buka Halaman Invoice Publik"
                >
                  <ExternalLink size={13} />
                  <span>Buka Web ↗</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="btn-dyari-outline text-xs px-3.5 py-2"
                >
                  Cetak
                </button>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="btn-dyari text-xs px-5 py-2 font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT / TAMBAH PRODUK DIGITAL (3 TIPE PRODUK)       */}
      {/* ======================================================== */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full my-auto border border-[#E5EAE4] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F4F1] bg-[#FAFBF9] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-forest text-white flex items-center justify-center font-bold">
                  <Package size={16} />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-forest">
                    {editingProduct ? 'Edit Katalog Produk' : 'Tambah Produk Baru'}
                  </h3>
                  <p className="text-[11px] text-warmgray">
                    {editingProduct ? `ID: ${editingProduct.id}` : 'Lengkapi data & pilih mekanisme stok yang sesuai'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setShowProductModal(false); setEditingProduct(null); }} 
                className="p-1.5 rounded-lg text-warmgray hover:text-forest hover:bg-cream transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-left">
              
              {/* PILIHAN 3 TIPE PRODUK */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EAE4]">
                <label className="text-xs font-bold text-forest flex items-center justify-between">
                  <span>Pilih Tipe Produk & Mekanisme Stok <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-warmgray">Klik salah satu untuk mengubah alur delivery</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Card 1: Apps Premium */}
                  <div
                    onClick={() => {
                      const cat = categories.find(c => c.id === 'aplikasi') || { id: 'aplikasi', name: 'Aplikasi Premium' };
                      setProductFormData(prev => ({
                        ...prev,
                        productType: 'APPS_PREMIUM',
                        type: 'AKSES PREMIUM',
                        stockType: 'link_based',
                        category: cat.id,
                        categoryName: cat.name,
                        subcategory: `${cat.name} · Akun`,
                        afterPurchaseMessage: 'Akun/link eksklusif Anda tertera di atas. Harap simpan kredensial ini karena link/akun ini 1x pakai khusus Anda.'
                      }));
                    }}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      productFormData.productType === 'APPS_PREMIUM'
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-[#E5EAE4] bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">📱</span>
                      <strong className="text-xs text-forest">Aplikasi Premium</strong>
                    </div>
                    <p className="text-[10px] text-warmgray leading-snug">
                      1 baris teks = 1 akun/link. Sistem anti-duplikasi (sold & unsold) aktif. Stok berkurang saat terjual.
                    </p>
                  </div>

                  {/* Card 2: Aset & Materi Digital */}
                  <div
                    onClick={() => {
                      const isDigitalCat = ['aset-premium', 'produktifitas-ai', 'worksheet', 'template-produktifitas'].includes(productFormData.category);
                      const targetCatId = isDigitalCat ? productFormData.category : 'aset-premium';
                      const cat = categories.find(c => c.id === targetCatId) || categories[0] || { id: 'aset-premium', name: 'Aset Premium' };
                      setProductFormData(prev => ({
                        ...prev,
                        productType: 'DIGITAL_PREMIUM',
                        type: 'AKSES MEMBER',
                        stockType: 'unlimited',
                        category: cat.id,
                        categoryName: cat.name,
                        subcategory: `${cat.name} · Master Link`,
                        afterPurchaseMessage: 'Terima kasih telah berbelanja di dyari.in! Akses file master & materi dapat langsung dibuka melalui tautan akses di atas dengan akun login terdaftar Anda.'
                      }));
                    }}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      productFormData.productType === 'DIGITAL_PREMIUM'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-[#E5EAE4] bg-white hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">📦</span>
                      <strong className="text-xs text-forest">Aset & Materi Digital</strong>
                    </div>
                    <p className="text-[10px] text-warmgray leading-snug">
                      Akses Member (User Login). Tidak butuh input stok manual. 1 tautan master bersama (Drive/Sites/Sheets).
                    </p>
                  </div>

                  {/* Card 3: Tools AI Premium */}
                  <div
                    onClick={() => {
                      const cat = categories.find(c => c.id === 'tools-ai') || { id: 'tools-ai', name: 'Tools AI Premium' };
                      setProductFormData(prev => ({
                        ...prev,
                        productType: 'LICENSE_TOOL',
                        type: 'LISENSI',
                        stockType: 'license',
                        category: cat.id,
                        categoryName: cat.name,
                        subcategory: `${cat.name} · Lisensi Unik`,
                        afterPurchaseMessage: 'Kunci lisensi akses tools Anda tertera di atas. Gunakan kode tersebut saat login ke software/tools.'
                      }));
                    }}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      productFormData.productType === 'LICENSE_TOOL'
                        ? 'border-purple-600 bg-purple-50/70 shadow-xs ring-2 ring-purple-500/20'
                        : 'border-[#E5EAE4] bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">🔑</span>
                      <strong className="text-xs text-forest">Tools AI Premium</strong>
                    </div>
                    <p className="text-[10px] text-warmgray leading-snug">
                      User Login & Lisensi. Tidak butuh stok fisik. Otomatisasi generate lisensi unik on-demand saat checkout.
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 1: Nama & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest">Nama Produk <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    placeholder="Contoh: Canva Pro Lifetime / Habit Tracker"
                    className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest">Tagline Singkat</label>
                  <input
                    type="text"
                    value={productFormData.tagline}
                    onChange={(e) => setProductFormData({ ...productFormData, tagline: e.target.value })}
                    placeholder="Contoh: Akses penuh fitur pro dengan email pribadi"
                    className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none focus:border-forest"
                  />
                </div>
              </div>

              {/* Row 2: Kategori, Urutan Tampil, Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest">Kategori Produk</label>
                  <select
                    value={productFormData.category}
                    onChange={(e) => {
                      const selectedCatId = e.target.value;
                      const cat = categories.find(c => c.id === selectedCatId);
                      const catName = cat ? cat.name : 'Digital';
                      
                      // Otomatis sinkronkan productType dan mekanisme stok dengan kategori yang dipilih
                      let newProductType = productFormData.productType;
                      let newType = productFormData.type;
                      let newStockType = productFormData.stockType;
                      let newAfterMessage = productFormData.afterPurchaseMessage;

                      if (selectedCatId === 'aplikasi') {
                        newProductType = 'APPS_PREMIUM';
                        newType = 'AKSES PREMIUM';
                        newStockType = 'link_based';
                        newAfterMessage = 'Akun/link eksklusif Anda tertera di atas. Harap simpan kredensial ini karena link/akun ini 1x pakai khusus Anda.';
                      } else if (selectedCatId === 'tools-ai') {
                        newProductType = 'LICENSE_TOOL';
                        newType = 'LISENSI';
                        newStockType = 'license';
                        newAfterMessage = 'Kunci lisensi akses tools Anda tertera di atas. Gunakan kode tersebut saat login ke software/tools.';
                      } else {
                        // aset-premium, produktifitas-ai, worksheet, template-produktifitas
                        newProductType = 'DIGITAL_PREMIUM';
                        newType = 'AKSES MEMBER';
                        newStockType = 'unlimited';
                        newAfterMessage = 'Terima kasih telah berbelanja di dyari.in! Akses file master & materi dapat langsung dibuka melalui tautan akses di atas dengan akun login terdaftar Anda.';
                      }

                      setProductFormData(prev => ({
                        ...prev,
                        category: selectedCatId,
                        categoryName: catName,
                        subcategory: `${catName} · Akses`,
                        productType: newProductType,
                        type: newType,
                        stockType: newStockType,
                        afterPurchaseMessage: newAfterMessage
                      }));
                    }}
                    className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3 py-2 text-xs text-forest focus:outline-none font-semibold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest">Urutan Tampil (Posisi)</label>
                  <input
                    type="number"
                    min={1}
                    value={productFormData.sortOrder}
                    onChange={(e) => setProductFormData({ ...productFormData, sortOrder: Number(e.target.value) })}
                    className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3 py-2 text-xs text-forest font-mono font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest">Badge Khusus</label>
                  <select
                    value={productFormData.badge || 'NONE'}
                    onChange={(e) => setProductFormData({ ...productFormData, badge: e.target.value })}
                    className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3 py-2 text-xs text-forest focus:outline-none font-bold"
                  >
                    <option value="NONE">Tanpa Badge</option>
                    <option value="BEST SELLER">🔥 BEST SELLER (Terlaris)</option>
                    <option value="HOT">⚡ HOT</option>
                    <option value="NEW">✨ NEW</option>
                    <option value="BUNDLE">📦 BUNDLE</option>
                    <option value="SALE">🏷️ SALE</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Harga Modal, Harga Jual, Harga Coret */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-amber-900">Harga Modal (Rp)</label>
                  <input
                    type="number"
                    value={productFormData.costPrice || 0}
                    onChange={(e) => setProductFormData({ ...productFormData, costPrice: Number(e.target.value) })}
                    placeholder="10000"
                    className="w-full bg-amber-50/50 rounded-xl border border-amber-300 px-3.5 py-2 text-xs text-amber-950 font-bold focus:outline-none"
                  />
                  <span className="text-[10px] text-warmgray block">HPP untuk hitung laba bersih</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest">Harga Jual (Rp) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: Number(e.target.value) })}
                    className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest font-bold focus:outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest">Harga Coret (Opsional)</label>
                  <input
                    type="number"
                    value={productFormData.originalPrice || ''}
                    onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value ? Number(e.target.value) : null })}
                    placeholder="75000"
                    className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3.5 py-2 text-xs text-forest focus:outline-none"
                  />
                </div>
              </div>

              {/* INPUT SPESIFIK BERDASARKAN TIPE PRODUK */}
              {productFormData.productType === 'APPS_PREMIUM' && (
                <div className="space-y-2.5 p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                      <span>📱 Input / Import Stok Akun & Link (1 Baris = 1 Kuota Stok)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded-full">
                        🛡️ Anti-Duplikasi Aktif
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-white text-blue-900 border border-blue-200 px-2 py-0.5 rounded">
                        {editingProduct?.accountStock 
                          ? `${editingProduct.accountStock.filter(s => !s.isSold).length} Tersedia / ${editingProduct.accountStock.length} Total` 
                          : 'Stok Baru'}
                      </span>
                    </div>
                  </div>
                  
                  <textarea
                    rows={4}
                    value={productFormData.massStockInput || ''}
                    onChange={(e) => setProductFormData({ ...productFormData, massStockInput: e.target.value })}
                    placeholder={"user.email01@gmail.com:passwordPass123\nuser.email02@gmail.com:passwordPass456\nhttps://canva.com/brand/join?invite=VIP-ALPHA-991"}
                    className="w-full bg-white rounded-xl border border-blue-200 p-3 text-xs font-mono text-forest focus:outline-none"
                  />
                  <div className="bg-white/80 p-2.5 rounded-xl border border-blue-200/80 text-[10px] text-blue-950 space-y-1">
                    <p className="font-semibold flex items-center gap-1">
                      <span>🔒 Ketentuan Stok Aplikasi Premium:</span>
                    </p>
                    <ul className="list-disc pl-4 space-y-0.5 text-blue-900">
                      <li><strong>Anti-Duplikasi:</strong> Sistem memeriksa input dan menolak akun/link yang sudah pernah ada di stok (baik yang masih ready maupun yang sudah <strong>SOLD</strong>).</li>
                      <li><strong>1x Pakai Khusus:</strong> Setiap baris teks dialokasikan eksklusif 1 kali kepada pembeli saat pembayaran terkonfirmasi.</li>
                    </ul>
                  </div>
                </div>
              )}

              {productFormData.productType === 'DIGITAL_PREMIUM' && (
                <div className="space-y-3 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <span>📦 Tautan Sumber Akses Master (Shared Link)</span>
                    </label>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full">
                      🔐 User Login Terdaftar
                    </span>
                  </div>

                  <input
                    type="text"
                    value={productFormData.accessUrl}
                    onChange={(e) => setProductFormData({ ...productFormData, accessUrl: e.target.value })}
                    placeholder="https://drive.google.com/drive/folders/... atau https://docs.google.com/spreadsheets/d/.../copy atau https://sites.google.com/..."
                    className="w-full bg-white rounded-xl border border-emerald-200 px-3.5 py-2 text-xs text-forest font-mono focus:outline-none"
                  />

                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200/80 text-[10px] text-emerald-950 space-y-1">
                    <p className="font-semibold flex items-center gap-1">
                      <span>💡 Ketentuan Akses Member (Tanpa Input Stok):</span>
                    </p>
                    <p className="text-emerald-900 leading-relaxed">
                      Kategori <strong>Aset Premium</strong>, <strong>Produktifitas AI</strong>, <strong>Worksheet</strong>, dan <strong>Template Produktifitas</strong> <u>tidak membutuhkan input stok manual</u>. Pembeli mengakses produk melalui akun login user terdaftar mereka di web/dashboard member untuk membuka tautan sumber master di atas.
                    </p>
                  </div>
                </div>
              )}

              {productFormData.productType === 'LICENSE_TOOL' && (
                <div className="space-y-3 p-4 rounded-2xl bg-purple-50/60 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                      <span>🔑 Pengaturan Kunci Lisensi Akses Tools</span>
                    </span>
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded-full">
                      ⚡ User Login & Auto-Generate
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-purple-900">Prefix Kode Lisensi</label>
                      <input
                        type="text"
                        value={productFormData.licensePrefix || 'TOOL'}
                        onChange={(e) => setProductFormData({ ...productFormData, licensePrefix: e.target.value.toUpperCase() })}
                        placeholder="TOOL"
                        className="w-full bg-white rounded-xl border border-purple-200 px-3 py-1.5 text-xs font-mono font-bold text-purple-900 focus:outline-none"
                      />
                      <span className="text-[9px] text-warmgray block">Format: DYARI-{productFormData.licensePrefix || 'TOOL'}-XXXX-YYYY</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-purple-900">Target Tools / Produk</label>
                      <div className="w-full bg-white rounded-xl border border-purple-200 px-3 py-1.5 text-xs font-semibold text-purple-950 flex items-center gap-2">
                        <span className="text-sm shrink-0">🎯</span>
                        <span className="truncate">
                          {productFormData.name.trim() ? productFormData.name : '(Otomatis Mengikuti Nama Produk)'}
                        </span>
                      </div>
                      <span className="text-[9px] text-purple-700 block">
                        Otomatis: Lisensi diterbitkan resmi atas nama produk ini
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-purple-900">Masa Berlaku Default</label>
                      <select
                        value={productFormData.licenseDuration || 'Selamanya (Lifetime)'}
                        onChange={(e) => setProductFormData({ ...productFormData, licenseDuration: e.target.value })}
                        className="w-full bg-white rounded-xl border border-purple-200 px-3 py-1.5 text-xs text-forest focus:outline-none font-bold"
                      >
                        <option value="Selamanya (Lifetime)">Selamanya (Lifetime)</option>
                        <option value="1 Tahun">1 Tahun (365 Hari)</option>
                        <option value="6 Bulan">6 Bulan (180 Hari)</option>
                        <option value="3 Bulan">3 Bulan (90 Hari)</option>
                        <option value="1 Bulan">1 Bulan (30 Hari)</option>
                        <option value="14 Hari">14 Hari</option>
                        <option value="7 Hari (Trial)">7 Hari (Trial / Demo)</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-xl border border-purple-200/80 text-[10px] text-purple-950 space-y-1">
                    <p className="font-semibold flex items-center gap-1">
                      <span>💡 Ketentuan Lisensi Tools:</span>
                    </p>
                    <p className="text-purple-900 leading-relaxed">
                      Tidak memerlukan input stok manual. Pembeli wajib memiliki akun user login terdaftar. Sistem otomatis men-generate lisensi unik dan mengunci hak akses tools ke email pembeli saat transaksi lunas.
                    </p>
                  </div>
                </div>
              )}

              {/* Row 4: Thumbnail Image Upload & URL */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EAE4]">
                <label className="text-xs font-bold text-forest block">Thumbnail Produk (Bisa Upload Gambar)</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-white border border-[#E5EAE4] overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                    {productFormData.image ? (
                      <img src={productFormData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Image size={24} className="text-warmgray" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <label className="btn-dyari text-xs px-3 py-1.5 cursor-pointer inline-flex items-center gap-1.5 font-bold shadow-xs">
                        <Upload size={13} />
                        <span>Upload File Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, (dataUrl) => {
                                setProductFormData({ ...productFormData, image: dataUrl });
                                showToast('Foto Diunggah', file.name);
                              });
                            }
                          }}
                        />
                      </label>
                      {productFormData.image && (
                        <button
                          type="button"
                          onClick={() => setProductFormData({ ...productFormData, image: '' })}
                          className="text-xs text-rose-600 hover:underline font-semibold"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={productFormData.image}
                      onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                      placeholder="Atau masukkan URL thumbnail eksternal (https://...)"
                      className="w-full bg-white rounded-xl border border-[#E5EAE4] px-3 py-1.5 text-xs text-forest focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Row 6: Pesan Setelah Pembelian di Invoice */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-forest">
                  Pesan Petunjuk Setelah Pembelian di Invoice
                </label>
                <textarea
                  rows={2}
                  value={productFormData.afterPurchaseMessage || ''}
                  onChange={(e) => setProductFormData({ ...productFormData, afterPurchaseMessage: e.target.value })}
                  placeholder="Contoh: Harap simpan kredensial ini karena link/akun ini 1x pakai khusus Anda."
                  className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] p-3 text-xs text-forest focus:outline-none"
                />
                <span className="text-[10px] text-warmgray block">
                  Pesan ini akan otomatis dicetak pada invoice pembeli setelah transaksi terverifikasi.
                </span>
              </div>

              {/* Row 7: Deskripsi Produk */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-forest">Deskripsi Lengkap Produk</label>
                <textarea
                  rows={3}
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  placeholder="Tulis detail fitur, manfaat, dan petunjuk singkat..."
                  className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] p-3 text-xs text-forest focus:outline-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#F0F4F1] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowProductModal(false); setEditingProduct(null); }}
                  className="btn-dyari-outline text-xs px-4 py-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-dyari text-xs px-6 py-2.5 font-bold shadow-sm"
                >
                  {editingProduct ? 'Simpan Perubahan' : 'Terbitkan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: IMPORT STOK MASSAL BERDASARKAN BARIS TEKS          */}
      {/* ======================================================== */}
      {massImportModalProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E5EAE4] shadow-2xl p-6 space-y-4 animate-scale-up text-left">
            <div className="flex items-center justify-between border-b border-[#F0F4F1] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  📱
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-forest">
                    Import Stok Massal
                  </h3>
                  <p className="text-[11px] text-warmgray truncate max-w-[280px]">
                    {massImportModalProduct.name}
                  </p>
                </div>
              </div>
              <button onClick={() => setMassImportModalProduct(null)} className="text-warmgray hover:text-forest">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-forest">
                  Daftar Akun / Link (1 baris teks = 1 kuota stok)
                </label>
                <span className="font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                  {massImportText.split('\n').filter(l => l.trim().length > 0).length} Baris Terdeteksi
                </span>
              </div>

              <textarea
                rows={8}
                value={massImportText}
                onChange={(e) => setMassImportText(e.target.value)}
                placeholder={"user.vip01@gmail.com:PassVip123\nuser.vip02@gmail.com:PassVip456\nhttps://canva.com/brand/join?invite=LINK-INVITE-001\nhttps://canva.com/brand/join?invite=LINK-INVITE-002"}
                className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] p-3 text-xs font-mono text-forest focus:outline-none focus:border-blue-500"
              />

              <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E5EAE4] space-y-2 text-xs">
                <span className="font-bold text-forest block">Metode Import:</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={massImportMode === 'append'}
                      onChange={() => setMassImportMode('append')}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span>Tambahkan ke stok yang ada (Append)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={massImportMode === 'replace'}
                      onChange={() => setMassImportMode('replace')}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span>Gantikan seluruh stok (Replace)</span>
                  </label>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-1">
                <span className="font-bold text-blue-950 flex items-center gap-1.5">
                  🛡️ Proteksi Anti-Duplikasi Otomatis Aktif
                </span>
                <p className="text-[11px] text-blue-900 leading-relaxed">
                  Sistem otomatis menyaring dan mengabaikan baris akun/link yang sudah pernah ada di database produk ini (baik stok yang masih ready maupun yang sudah <strong>SOLD</strong>), serta membersihkan duplikasi dalam teks input ini.
                </p>
              </div>

              <p className="text-[11px] text-warmgray leading-relaxed">
                💡 <strong>Pemberian Otomatis:</strong> Setiap pembelian produk Apps Premium akan mengambil 1 baris stok di atas, menandainya <strong>SOLD</strong>, dan mengirimkannya ke invoice pembeli.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F4F1]">
              <button
                type="button"
                onClick={() => setMassImportModalProduct(null)}
                className="btn-dyari-outline text-xs px-4 py-2"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveMassImport}
                className="btn-dyari text-xs px-5 py-2 font-bold shadow-xs bg-blue-600 hover:bg-blue-700 text-white"
              >
                Simpan & Import ({massImportText.split('\n').filter(l => l.trim().length > 0).length} Akun)
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* MODAL: IMPORT STOK (SESUAI GAMBAR SCREENSHOT 2)          */}
      {/* ======================================================== */}
      {showImportBatchModal && (() => {
        // Deteksi link otomatis (https:// atau http://)
        const extractedUrls = importBatchRawText.match(/https?:\/\/[^\s]+/g) || [];
        const extractedLines = importBatchRawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const detectedCount = extractedUrls.length > 0 ? extractedUrls.length : extractedLines.length;

        const handleDoImport = () => {
          if (!importBatchTargetProductId) {
            showToast('Pilih Produk', 'Silakan pilih produk tujuan terlebih dahulu.');
            return;
          }
          if (!importBatchRawText.trim()) {
            showToast('Teks Kosong', 'Silakan masukkan teks atau link stok.');
            return;
          }

          const res = importMassStock(importBatchTargetProductId, importBatchRawText, 'append');
          if (res?.success) {
            setShowImportBatchModal(false);
            setImportBatchRawText('');
          }
        };

        return (
          <div className="fixed inset-0 bg-forest/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white border border-[#E5EAE4] rounded-3xl max-w-lg w-full p-6 text-forest space-y-4 shadow-2xl animate-scale-up text-left">
              {/* Header Modal */}
              <div className="flex items-center justify-between border-b border-[#F0F4F1] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sage border border-matcha/50 text-forest flex items-center justify-center font-bold">
                    <Layers size={16} />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-forest">
                      Import Stok
                    </h3>
                    <p className="text-xs text-warmgray mt-0.5">
                      Paste teks berisi link atau kode redeem
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowImportBatchModal(false)}
                  className="text-warmgray hover:text-forest p-1 rounded-lg hover:bg-sage-light transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Input Produk Tujuan */}
              <div className="space-y-1.5">
                <label className="text-xs text-forest font-bold block">
                  Produk Tujuan:
                </label>
                <select
                  value={importBatchTargetProductId}
                  onChange={(e) => setImportBatchTargetProductId(e.target.value)}
                  className="w-full bg-[#FAFBF9] border border-[#E5EAE4] text-forest text-xs rounded-xl p-2.5 focus:outline-none focus:border-forest font-medium"
                >
                  {products.map(p => {
                    const readyCount = (p.accountStock || []).filter(s => !s.isSold).length;
                    return (
                      <option key={p.id} value={p.id}>
                        {p.name} ({readyCount} Ready)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Textarea Paste Teks */}
              <div className="space-y-1.5">
                <textarea
                  rows={8}
                  value={importBatchRawText}
                  onChange={(e) => setImportBatchRawText(e.target.value)}
                  placeholder={`Teks kotor diperbolehkan. Sistem otomatis mengekstrak semua link (https:// atau http://) sampai spasi/enter berikutnya; jika tidak ada link, sistem membaca 1 baris sebagai 1 kode/kredensial.\n\nContoh link:\nLink 1: https://redeem.example.com/c405a\nLink 2: https://redeem.example.com/d506b\n...`}
                  className="w-full bg-[#FAFBF9] border border-[#E5EAE4] rounded-xl p-3 text-xs font-mono text-forest placeholder:text-warmgray-light focus:outline-none focus:border-forest leading-relaxed"
                />

                {/* Counter Badge */}
                <div className="flex justify-end">
                  <span className="bg-sage-light border border-matcha/50 text-forest font-mono font-bold text-[11px] px-2.5 py-1 rounded-lg">
                    {detectedCount} kode/baris
                  </span>
                </div>
              </div>

              {/* Info Text */}
              <div className="p-3 rounded-xl bg-sage-light/60 border border-matcha/30 text-[11px] text-forest/80 leading-relaxed">
                URL dideteksi otomatis. Jika tidak ada URL, satu kode redeem per baris tetap didukung. Duplikat global ditolak termasuk Available, Reserved, atau Sold.
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#F0F4F1]">
                <button
                  type="button"
                  onClick={handleDoImport}
                  className="btn-dyari text-xs px-5 py-2.5 font-bold shadow-xs cursor-pointer"
                >
                  Import Stok
                </button>
                <button
                  type="button"
                  onClick={() => setShowImportBatchModal(false)}
                  className="btn-dyari-outline text-xs px-4 py-2.5 font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* MODAL: RINCIAN & KELOLA BARIS STOK (APPS PREMIUM)        */}
      {/* ======================================================== */}
      {stockDetailsModalProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full my-auto border border-[#E5EAE4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up text-left">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F4F1] bg-[#FAFBF9] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  🔍
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-forest">
                    Rincian Baris Stok Akun / Link
                  </h3>
                  <p className="text-[11px] text-warmgray truncate max-w-[320px]">
                    {stockDetailsModalProduct.name}
                  </p>
                </div>
              </div>
              <button onClick={() => setStockDetailsModalProduct(null)} className="p-1 rounded-lg text-warmgray hover:text-forest">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              {/* Stats Summary */}
              {(() => {
                const currentProd = products.find(p => p.id === stockDetailsModalProduct.id) || stockDetailsModalProduct;
                const stockList = currentProd.accountStock || [];
                const total = stockList.length;
                const available = stockList.filter(s => !s.isSold).length;
                const sold = stockList.filter(s => s.isSold).length;

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-[#FAFBF9] border border-[#E5EAE4]">
                        <span className="text-warmgray block text-[10px]">Total Baris Input</span>
                        <strong className="text-sm font-heading font-bold text-forest">{total}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-emerald-800 block text-[10px]">Tersedia (Ready)</span>
                        <strong className="text-sm font-heading font-bold text-emerald-800">{available}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                        <span className="text-rose-800 block text-[10px]">Terjual (Sold Out)</span>
                        <strong className="text-sm font-heading font-bold text-rose-800">{sold}</strong>
                      </div>
                    </div>

                    {/* Quick Add 1 Line */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newSingleStockInput}
                          onChange={(e) => setNewSingleStockInput(e.target.value)}
                          placeholder="Tambah 1 baris stok akun/link baru..."
                          className="flex-1 bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3 py-2 text-xs font-mono text-forest focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddSingleStock}
                          className="btn-dyari text-xs px-4 py-2 font-bold shrink-0"
                        >
                          + Tambah
                        </button>
                      </div>
                      <span className="text-[10px] text-warmgray block">
                        🛡️ <strong>Anti-Duplikasi:</strong> Akun/link akan ditolak jika sudah pernah ada di stok (baik ready maupun sold).
                      </span>
                    </div>

                    {/* Table of Individual Stock Lines */}
                    <div className="border border-[#E5EAE4] rounded-2xl overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAFBF9] border-b border-[#E5EAE4] text-warmgray text-[10px] uppercase">
                          <tr>
                            <th className="py-2.5 px-3 w-10 text-center">#</th>
                            <th className="py-2.5 px-3">Teks Akun / Link</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0F4F1]">
                          {stockList.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="py-6 text-center text-warmgray italic text-xs">
                                Belum ada stok baris akun. Klik "+ Import Massal" untuk memasukkan akun.
                              </td>
                            </tr>
                          ) : (
                            stockList.map((item, idx) => (
                              <tr key={item.id || idx} className="hover:bg-[#FAFBF9] transition-colors">
                                <td className="py-2.5 px-3 text-center text-warmgray font-mono font-bold text-[11px]">
                                  {idx + 1}
                                </td>
                                <td className="py-2.5 px-3 font-mono text-[11px] max-w-[280px]">
                                  <div className="flex items-center gap-1.5">
                                    <span className="truncate block select-all font-bold text-forest">{item.text}</span>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(item.text);
                                        showToast('Teks Disalin', item.text);
                                      }}
                                      className="text-warmgray hover:text-forest p-1 shrink-0"
                                      title="Salin Teks"
                                    >
                                      <Copy size={11} />
                                    </button>
                                  </div>
                                  {item.soldTo && (
                                    <span className="text-[9px] text-warmgray block">
                                      Order: {item.soldTo} {item.soldToEmail ? `(${item.soldToEmail})` : ''}
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3">
                                  {item.isSold ? (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                                      ✓ Sold Out
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                      ● Tersedia
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => toggleStockSold(stockDetailsModalProduct.id, item.id)}
                                      className="text-[10px] font-semibold text-blue-600 hover:underline"
                                      title="Ubah Status Tersedia/Sold"
                                    >
                                      {item.isSold ? 'Set Tersedia' : 'Set Sold'}
                                    </button>
                                    {!item.isSold && (
                                      <button
                                        type="button"
                                        onClick={() => deleteStockItem(stockDetailsModalProduct.id, item.id)}
                                        className="p-1 text-rose-500 hover:text-rose-700"
                                        title="Hapus baris"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center justify-end px-6 py-3 border-t border-[#F0F4F1] bg-[#FAFBF9] shrink-0">
              <button
                type="button"
                onClick={() => setStockDetailsModalProduct(null)}
                className="btn-dyari text-xs px-5 py-2 font-bold shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: MANAJEMEN STOK BERBASIS LINK (LEGACY FALLBACK)    */}
      {/* ======================================================== */}
      {stockModalProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E5EAE4] shadow-2xl p-6 space-y-4 animate-scale-up text-left">
            <div className="flex items-center justify-between border-b border-[#F0F4F1] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                  <ExternalLink size={16} />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-forest">
                    Input Stok Link Produk
                  </h3>
                  <p className="text-[11px] text-warmgray truncate max-w-[280px]">
                    {stockModalProduct.name}
                  </p>
                </div>
              </div>
              <button onClick={() => setStockModalProduct(null)} className="text-warmgray hover:text-forest">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-forest">
                  Daftar Link Akses / Akun (1 baris = 1 stok)
                </label>
                <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded text-[11px]">
                  {stockLinksInput.split('\n').filter(l => l.trim().length > 0).length} Link Terdeteksi
                </span>
              </div>

              <textarea
                rows={8}
                value={stockLinksInput}
                onChange={(e) => setStockLinksInput(e.target.value)}
                placeholder={"https://drive.google.com/file/d/link-1\nhttps://drive.google.com/file/d/link-2\nhttps://drive.google.com/file/d/link-3"}
                className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] p-3 text-xs font-mono text-forest focus:outline-none focus:border-forest"
              />

              <p className="text-[11px] text-warmgray leading-relaxed">
                💡 <strong>Alur Otomatis:</strong> Setiap baris link yang dimasukkan akan dihitung sebagai 1 kuota stok. Stok produk akan otomatis menyesuaikan dengan jumlah baris link yang Anda input di atas.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F4F1]">
              <button
                type="button"
                onClick={() => setStockModalProduct(null)}
                className="btn-dyari-outline text-xs px-4 py-2"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveStockLinks}
                className="btn-dyari text-xs px-5 py-2 font-bold shadow-xs"
              >
                Simpan Stok ({stockLinksInput.split('\n').filter(l => l.trim().length > 0).length} Link)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TAMBAH / EDIT KATEGORI PRODUK                      */}
      {/* ======================================================== */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full my-auto border border-[#E5EAE4] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-up text-left">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F4F1] bg-[#FAFBF9] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-forest text-white flex items-center justify-center text-sm font-bold">
                  🏷️
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-forest">
                    {editingCategory ? 'Edit Kategori Produk' : 'Tambah Kategori Baru'}
                  </h3>
                  <p className="text-[11px] text-warmgray">
                    {editingCategory ? `ID Kategori: ${editingCategory.id}` : 'Atur nama, emoji, deskripsi, dan warna kartu'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-warmgray hover:text-forest p-1 rounded-lg hover:bg-black/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveCategory} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Live Preview Card */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-warmgray uppercase tracking-wider">
                  Live Preview Tampilan di Halaman Depan Web:
                </label>
                <div 
                  style={{ backgroundColor: categoryFormData.bgColor || '#E2EFE7' }}
                  className="rounded-2xl p-4 text-center border border-black/10 transition-all duration-200"
                >
                  <div className="text-3xl mb-2">{categoryFormData.icon || '📁'}</div>
                  <h3 className="font-heading font-bold text-[#1C352D] text-base leading-tight">
                    {categoryFormData.name || 'Nama Kategori'}
                  </h3>
                  <p className="text-[11px] text-[#555C56] mt-1 leading-snug">
                    {categoryFormData.description || 'Deskripsi singkat kategori akan tampil di sini.'}
                  </p>
                </div>
              </div>

              {/* Nama Kategori */}
              <div className="space-y-1">
                <label className="font-bold text-forest">Nama Kategori <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={categoryFormData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setCategoryFormData({
                      ...categoryFormData,
                      name,
                      id: editingCategory ? categoryFormData.id : name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
                    });
                  }}
                  placeholder="Misal: Keuangan, Desain Grafis, AI Tools"
                  className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-3 py-2.5 text-forest font-semibold focus:outline-none focus:border-forest"
                />
              </div>

              {/* Slug / ID */}
              <div className="space-y-1">
                <label className="font-bold text-forest">ID / Slug URL</label>
                <input
                  type="text"
                  disabled={!!editingCategory}
                  value={categoryFormData.id}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  placeholder="keuangan"
                  className={`w-full rounded-xl border border-[#E5EAE4] px-3 py-2 font-mono text-xs ${
                    editingCategory ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-[#F7F9F7] text-forest focus:outline-none focus:border-forest'
                  }`}
                />
                <p className="text-[10px] text-warmgray">
                  {editingCategory ? 'Slug ID terkunci untuk menjaga konsistensi filter dan URL produk.' : 'Otomatis diisi dari nama kategori atau bisa disesuaikan manual.'}
                </p>
              </div>

              {/* Ikon Emoji */}
              <div className="space-y-1.5">
                <label className="font-bold text-forest">Ikon / Emoji Kategori</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={categoryFormData.icon}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, icon: e.target.value })}
                    className="w-16 bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] px-2 py-2 text-center text-xl text-forest focus:outline-none focus:border-forest"
                  />
                  <div className="flex flex-wrap items-center gap-1">
                    {['💰', '🌱', '✦', '⚙', '📱', '🎁', '🚀', '💡', '🎬', '🎨', '📊', '⚡', '🔐', '👑', '📚', '💼'].map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setCategoryFormData({ ...categoryFormData, icon: emoji })}
                        className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                          categoryFormData.icon === emoji ? 'bg-forest text-white scale-110 shadow-xs' : 'bg-slate-100 hover:bg-slate-200'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Deskripsi Singkat */}
              <div className="space-y-1">
                <label className="font-bold text-forest">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  placeholder="Teks singkat yang muncul di bawah nama kategori pada kartu beranda..."
                  className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] p-3 text-forest focus:outline-none focus:border-forest"
                />
              </div>

              {/* Warna Pastel Background */}
              <div className="space-y-1.5">
                <label className="font-bold text-forest">Warna Background Kartu</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={categoryFormData.bgColor}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, bgColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-[#E5EAE4] p-0.5 bg-white"
                    />
                    <span className="font-mono text-xs text-forest">{categoryFormData.bgColor}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { bg: '#E2EFE7', label: 'Sage' },
                      { bg: '#E5EFE6', label: 'Mint' },
                      { bg: '#FAEDE7', label: 'Peach' },
                      { bg: '#EAEFEA', label: 'Light Sage' },
                      { bg: '#E9EFF3', label: 'Sky' },
                      { bg: '#FCE8E8', label: 'Rose' },
                      { bg: '#FEF3C7', label: 'Warm Yellow' },
                      { bg: '#F3E8FF', label: 'Soft Purple' }
                    ].map(p => (
                      <button
                        key={p.bg}
                        type="button"
                        onClick={() => setCategoryFormData({ ...categoryFormData, bgColor: p.bg })}
                        style={{ backgroundColor: p.bg }}
                        title={p.label}
                        className={`w-6 h-6 rounded-full border transition-all ${
                          categoryFormData.bgColor === p.bg ? 'border-forest ring-2 ring-forest/30 scale-110' : 'border-black/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F0F4F1]">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="btn-dyari-outline text-xs px-4 py-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-dyari text-xs px-5 py-2 font-bold shadow-xs"
                >
                  {editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* MODAL: RINCIAN PRODUK & LISENSI MEMBER (POP-UP LENGKAP)    */}
      {/* ======================================================== */}
      {selectedMemberDetails && (() => {
        const c = selectedMemberDetails;
        const { customerOrders, purchasedProducts, memberLicenses } = getCustomerPurchasedData(c);
        const activeLicenses = memberLicenses.filter(l => !getLicenseEffectiveStatus(l).isLocked);

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full my-auto border border-[#E5EAE4] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-up text-left">
              
              {/* Header Profile */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-[#F0F4F1] bg-[#FAFBF9] shrink-0">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-forest text-white flex items-center justify-center font-heading font-extrabold text-base shadow-xs shrink-0">
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-extrabold text-lg text-forest leading-tight">
                        {c.name}
                      </h3>
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                        {c.id}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        ● {c.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-warmgray flex-wrap">
                      <span>✉ {c.email}</span>
                      {c.phone && (
                        <a 
                          href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 font-semibold hover:underline flex items-center gap-0.5"
                        >
                          <Phone size={11} />
                          <span>{c.phone}</span>
                        </a>
                      )}
                      <span>• Gabung: {c.joinedDate || '2026'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenMemberArea(c)}
                    className="btn-dyari text-xs px-3.5 py-2 font-bold inline-flex items-center gap-1.5 shadow-xs"
                    title="Buka tampilan dashboard member ini"
                  >
                    <LogIn size={13} />
                    <span>Buka Member Area</span>
                  </button>
                  <button
                    onClick={() => setSelectedMemberDetails(null)}
                    className="text-warmgray hover:text-forest p-1.5 rounded-xl hover:bg-black/5 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* 4 KPI Ringkas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-slate-50/70 border-b border-[#F0F4F1] shrink-0 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-[#E5EAE4]">
                  <span className="text-[10px] text-warmgray block font-medium">Total Belanja</span>
                  <span className="font-heading font-extrabold text-forest text-sm block mt-0.5">
                    Rp {(c.totalSpent || 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E5EAE4]">
                  <span className="text-[10px] text-warmgray block font-medium">Produk Dimiliki</span>
                  <span className="font-heading font-extrabold text-forest text-sm block mt-0.5">
                    {purchasedProducts.length} Produk
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E5EAE4]">
                  <span className="text-[10px] text-warmgray block font-medium">Lisensi Aktif</span>
                  <span className={`font-heading font-extrabold text-sm block mt-0.5 ${
                    activeLicenses.length > 0 ? 'text-purple-700' : 'text-warmgray'
                  }`}>
                    {activeLicenses.length} Lisensi
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E5EAE4]">
                  <span className="text-[10px] text-warmgray block font-medium">Total Pesanan</span>
                  <span className="font-heading font-extrabold text-forest text-sm block mt-0.5">
                    {customerOrders.length || c.orderCount || 0} Invoice
                  </span>
                </div>
              </div>

              {/* Modal Tabs */}
              <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#F0F4F1] bg-white shrink-0">
                <button
                  onClick={() => setMemberDetailTab('produk')}
                  className={`pb-2.5 text-xs font-bold transition-all border-b-2 ${
                    memberDetailTab === 'produk'
                      ? 'border-forest text-forest'
                      : 'border-transparent text-warmgray hover:text-forest'
                  }`}
                >
                  📦 Produk & Hak Akses ({purchasedProducts.length})
                </button>
                <button
                  onClick={() => setMemberDetailTab('lisensi')}
                  className={`pb-2.5 text-xs font-bold transition-all border-b-2 ${
                    memberDetailTab === 'lisensi'
                      ? 'border-forest text-forest'
                      : 'border-transparent text-warmgray hover:text-forest'
                  }`}
                >
                  🔑 Lisensi Member ({memberLicenses.length})
                </button>
                <button
                  onClick={() => setMemberDetailTab('pesanan')}
                  className={`pb-2.5 text-xs font-bold transition-all border-b-2 ${
                    memberDetailTab === 'pesanan'
                      ? 'border-forest text-forest'
                      : 'border-transparent text-warmgray hover:text-forest'
                  }`}
                >
                  📄 Riwayat Transaksi ({customerOrders.length})
                </button>
              </div>

              {/* Tab Body */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                
                {/* TAB 1: PRODUK & AKSES */}
                {memberDetailTab === 'produk' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-warmgray">
                        Daftar produk yang telah dibeli atau diberikan hak akses untuk member ini:
                      </p>
                      <button
                        onClick={() => setShowGrantProductModal(true)}
                        className="btn-dyari-outline text-[11px] px-3 py-1 font-bold inline-flex items-center gap-1"
                      >
                        <Plus size={12} />
                        <span>+ Beri Akses Produk</span>
                      </button>
                    </div>

                    {purchasedProducts.length === 0 ? (
                      <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-[#E5EAE4] space-y-2">
                        <span className="text-3xl block">📦</span>
                        <p className="font-heading font-bold text-forest">Belum Ada Produk yang Dimiliki</p>
                        <p className="text-xs text-warmgray max-w-xs mx-auto">
                          Member ini belum memiliki produk digital. Anda dapat memberikan hak akses produk secara manual.
                        </p>
                        <button
                          onClick={() => setShowGrantProductModal(true)}
                          className="btn-dyari text-xs px-4 py-2 font-bold inline-flex items-center gap-1.5 mt-2"
                        >
                          <Plus size={13} />
                          <span>+ Berikan Akses Produk Sekarang</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {purchasedProducts.map((p, idx) => {
                          const relatedLic = memberLicenses.find(l => l.productId === p.id || l.productName === p.name);
                          const licEff = relatedLic ? getLicenseEffectiveStatus(relatedLic) : null;

                          return (
                            <div 
                              key={idx}
                              className="bg-white rounded-2xl border border-[#E5EAE4] p-4.5 shadow-2xs hover:border-emerald-300 transition-all space-y-3.5"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  {p.image ? (
                                    <img 
                                      src={p.image} 
                                      alt={p.name} 
                                      className="w-14 h-14 rounded-xl object-cover border border-[#E5EAE4] shrink-0" 
                                    />
                                  ) : (
                                    <div className="w-14 h-14 rounded-xl bg-forest/10 flex items-center justify-center text-2xl shrink-0">
                                      📦
                                    </div>
                                  )}
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="font-heading font-bold text-forest text-sm">
                                        {p.name}
                                      </h4>
                                      <span className="bg-[#E2EFE7] text-[#2B5742] px-2 py-0.5 rounded-md font-semibold text-[10px]">
                                        {p.categoryName || 'Aset Digital'}
                                      </span>
                                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                        p.orderStatus === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                      }`}>
                                        ● {p.orderStatus || 'Lunas'}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-warmgray">
                                      {p.orderId && <span>Invoice: <strong className="font-mono text-forest">{p.orderId}</strong> • </span>}
                                      <span>Tanggal: {p.orderDate || 'Terdaftar'}</span>
                                      {p.price > 0 && <span> • Rp {p.price.toLocaleString('id-ID')}</span>}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* KOTAK AKSES SUMBER */}
                              {p.accessUrl && (
                                <div className="bg-[#FAFBF9] rounded-xl border border-[#E5EAE4] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                  <div className="space-y-0.5 overflow-hidden">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-warmgray block">
                                      Tautan Sumber Akses ({p.categoryName || 'Materi'}):
                                    </span>
                                    <p className="font-mono text-xs text-forest truncate max-w-md" title={p.accessUrl}>
                                      {p.accessUrl}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(p.accessUrl);
                                        showToast('Link Disalin', 'Tautan akses master telah disalin ke clipboard.');
                                      }}
                                      className="btn-dyari-outline text-[11px] px-2.5 py-1.5 font-bold inline-flex items-center gap-1"
                                      title="Salin Tautan Akses"
                                    >
                                      <Copy size={12} />
                                      <span>Salin</span>
                                    </button>
                                    <a
                                      href={p.accessUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn-dyari text-[11px] px-3 py-1.5 font-bold inline-flex items-center gap-1 shadow-2xs"
                                      title="Buka tautan akses di tab baru"
                                    >
                                      <ExternalLink size={12} />
                                      <span>Buka Akses</span>
                                    </a>
                                  </div>
                                </div>
                              )}

                              {/* KOTAK LISENSI EKSKLUSIF JIKA ADA */}
                              {relatedLic && (
                                <div className="bg-purple-50/70 rounded-xl border border-purple-200 p-3 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-purple-900 font-bold text-xs">
                                      <Key size={14} className="text-purple-700" />
                                      <span>Lisensi Produk Aktif:</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${licEff?.badgeClass || 'bg-purple-100 text-purple-800'}`}>
                                      ● {licEff?.status} ({licEff?.remainingText})
                                    </span>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white rounded-lg p-2.5 border border-purple-100">
                                    <div>
                                      <span className="text-[10px] text-warmgray block">Kode Kunci Lisensi:</span>
                                      <strong className="font-mono text-xs sm:text-sm text-purple-900 tracking-wider">
                                        {relatedLic.code}
                                      </strong>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          navigator.clipboard.writeText(relatedLic.code);
                                          showToast('Kode Disalin', `Kode lisensi ${relatedLic.code} disalin.`);
                                        }}
                                        className="btn-dyari-outline text-[11px] px-2.5 py-1 font-bold inline-flex items-center gap-1"
                                      >
                                        <Copy size={11} />
                                        <span>Salin Lisensi</span>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] text-purple-950/80 pt-0.5">
                                    <div>
                                      <span className="text-warmgray block">Tipe Lisensi:</span>
                                      <strong className="uppercase">{relatedLic.type || 'PERSONAL'}</strong>
                                    </div>
                                    <div>
                                      <span className="text-warmgray block">Waktu Mulai:</span>
                                      <strong>{relatedLic.createdAt || 'Baru Saja'}</strong>
                                    </div>
                                    <div>
                                      <span className="text-warmgray block">Tanggal Berakhir:</span>
                                      <strong>{relatedLic.expiresAt || 'Selamanya'}</strong>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: LISENSI MEMBER */}
                {memberDetailTab === 'lisensi' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-warmgray">
                        Kunci lisensi tools & software resmi yang diterbitkan untuk member ini:
                      </p>
                      <button
                        onClick={() => {
                          setGrantLicenseProductId(products[0]?.id || '');
                          setShowGrantLicenseModal(true);
                        }}
                        className="btn-dyari-outline text-[11px] px-3 py-1 font-bold inline-flex items-center gap-1"
                      >
                        <Plus size={12} />
                        <span>+ Terbitkan Lisensi Baru</span>
                      </button>
                    </div>

                    {memberLicenses.length === 0 ? (
                      <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-[#E5EAE4] space-y-2">
                        <span className="text-3xl block">🔑</span>
                        <p className="font-heading font-bold text-forest">Belum Ada Lisensi Terdaftar</p>
                        <p className="text-xs text-warmgray max-w-xs mx-auto">
                          Member ini belum memiliki lisensi tools AI aktif. Anda dapat menerbitkan lisensi baru kapan saja.
                        </p>
                        <button
                          onClick={() => {
                            setGrantLicenseProductId(products[0]?.id || '');
                            setShowGrantLicenseModal(true);
                          }}
                          className="btn-dyari text-xs px-4 py-2 font-bold inline-flex items-center gap-1.5 mt-2"
                        >
                          <Plus size={13} />
                          <span>+ Buat Lisensi untuk Member Ini</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {memberLicenses.map((lic) => {
                          const licEff = getLicenseEffectiveStatus(lic);

                          return (
                            <div 
                              key={lic.id || lic.code}
                              className="bg-white rounded-2xl border border-purple-200 p-4.5 shadow-2xs space-y-3 hover:border-purple-400 transition-all"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-2.5">
                                <div>
                                  <h4 className="font-heading font-bold text-forest text-sm">
                                    {lic.productName}
                                  </h4>
                                  <p className="text-[11px] text-warmgray font-mono">
                                    ID Lisensi: {lic.id}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${licEff.badgeClass}`}>
                                    ● {licEff.status} ({licEff.remainingText})
                                  </span>
                                  <button
                                    onClick={() => {
                                      const next = lic.status === 'Aktif' ? 'Dibekukan' : 'Aktif';
                                      updateLicenseStatus(lic.id, next);
                                      showToast('Status Lisensi Diubah', `Lisensi ${lic.code} kini ${next}`);
                                    }}
                                    className="text-[10px] font-bold text-slate-600 hover:text-forest underline"
                                  >
                                    {lic.status === 'Aktif' ? 'Bekukan' : 'Aktifkan'}
                                  </button>
                                </div>
                              </div>

                              <div className="bg-[#FAFBF9] rounded-xl p-3 border border-[#E5EAE4] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <span className="text-[10px] text-warmgray block">Kode Kunci Lisensi:</span>
                                  <strong className="font-mono text-sm sm:text-base text-purple-900 tracking-wider">
                                    {lic.code}
                                  </strong>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(lic.code);
                                    showToast('Kode Disalin', `Kode lisensi ${lic.code} telah disalin.`);
                                  }}
                                  className="btn-dyari-outline text-xs px-3 py-1.5 font-bold inline-flex items-center gap-1.5 self-start sm:self-auto"
                                >
                                  <Copy size={13} />
                                  <span>Salin Lisensi</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                                  <span className="text-[10px] text-warmgray block">Tipe Lisensi</span>
                                  <strong className="font-bold text-forest uppercase text-[11px]">{lic.type || 'PERSONAL'}</strong>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                                  <span className="text-[10px] text-warmgray block">Waktu Mulai Beli</span>
                                  <strong className="font-bold text-forest text-[11px]">{lic.createdAt || 'Aktif'}</strong>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                                  <span className="text-[10px] text-warmgray block">Tanggal Berakhir</span>
                                  <strong className="font-bold text-forest text-[11px]">{lic.expiresAt || 'Selamanya'}</strong>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                                  <span className="text-[10px] text-warmgray block">Sisa Masa Aktif</span>
                                  <strong className="font-bold text-purple-700 text-[11px]">{licEff.remainingText}</strong>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: RIWAYAT PESANAN */}
                {memberDetailTab === 'pesanan' && (
                  <div className="space-y-4">
                    <p className="text-xs text-warmgray">
                      Semua transaksi dan faktur invoice yang dibuat oleh member ini:
                    </p>

                    {customerOrders.length === 0 ? (
                      <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-[#E5EAE4]">
                        <p className="font-heading font-bold text-forest">Belum Ada Transaksi</p>
                        <p className="text-xs text-warmgray">Member ini belum memiliki invoice tersimpan.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {customerOrders.map((o) => (
                          <div 
                            key={o.id}
                            className="bg-white rounded-xl border border-[#E5EAE4] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition-all"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <strong className="font-mono text-forest font-bold">{o.id}</strong>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  o.status === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  ● {o.status}
                                </span>
                                <span className="text-warmgray text-[11px]">{o.date}</span>
                              </div>
                              <p className="text-xs text-forest font-medium">
                                {o.items?.map(it => it.name).join(', ')}
                              </p>
                              <p className="text-[11px] text-warmgray">
                                Total: <strong className="text-forest">Rp {(o.total || 0).toLocaleString('id-ID')}</strong> • Metode: {o.paymentMethod || 'QRIS'}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => openInvoice(o.id)}
                                className="btn-dyari-outline text-[11px] px-3 py-1.5 font-bold inline-flex items-center gap-1"
                              >
                                <Receipt size={12} />
                                <span>Buka Invoice</span>
                              </button>
                              <button
                                onClick={() => sendInvoiceWhatsApp(o)}
                                className="p-1.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                                title="Kirim Ulang Invoice via WhatsApp"
                              >
                                <Phone size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-6 py-4 border-t border-[#F0F4F1] bg-[#FAFBF9] shrink-0 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowGrantProductModal(true)}
                    className="btn-dyari-outline text-xs px-3.5 py-2 font-bold inline-flex items-center gap-1.5"
                  >
                    <Plus size={13} />
                    <span>Beri Akses Produk</span>
                  </button>
                  <button
                    onClick={() => {
                      setGrantLicenseProductId(products[0]?.id || '');
                      setShowGrantLicenseModal(true);
                    }}
                    className="btn-dyari-outline text-xs px-3.5 py-2 font-bold inline-flex items-center gap-1.5"
                  >
                    <Key size={13} />
                    <span>Terbitkan Lisensi</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleOpenMemberArea(c)}
                    className="btn-dyari text-xs px-4 py-2 font-bold inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <LogIn size={13} />
                    <span>Buka Member Area</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMemberDetails(null)}
                    className="btn-dyari-outline text-xs px-4 py-2 font-bold"
                  >
                    Tutup
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* MODAL: BERIKAN AKSES PRODUK MANUAL KE MEMBER              */}
      {/* ======================================================== */}
      {showGrantProductModal && selectedMemberDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full my-auto border border-[#E5EAE4] shadow-2xl p-6 space-y-4 animate-scale-up text-left text-xs">
            <div className="flex items-center justify-between border-b border-[#F0F4F1] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎁</span>
                <div>
                  <h3 className="font-heading font-extrabold text-forest text-sm">
                    Beri Hak Akses Produk Manual
                  </h3>
                  <p className="text-[11px] text-warmgray">
                    Untuk member: <strong>{selectedMemberDetails.name}</strong>
                  </p>
                </div>
              </div>
              <button onClick={() => setShowGrantProductModal(false)} className="text-warmgray hover:text-forest">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="font-bold text-forest block">Pilih Produk yang Ingin Diberikan:</label>
              <div className="space-y-2 max-h-60 overflow-y-auto p-1">
                {products.map(p => (
                  <label 
                    key={p.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      grantProductId === p.id 
                        ? 'border-forest bg-[#E2EFE7]/40 ring-1 ring-forest' 
                        : 'border-[#E5EAE4] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <input 
                        type="radio" 
                        name="grantProd" 
                        value={p.id} 
                        checked={grantProductId === p.id} 
                        onChange={() => setGrantProductId(p.id)}
                        className="text-forest" 
                      />
                      <div className="overflow-hidden">
                        <p className="font-heading font-bold text-forest truncate">{p.name}</p>
                        <p className="text-[10px] text-warmgray">{p.categoryName} • Rp {p.price.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F4F1]">
              <button 
                type="button" 
                onClick={() => setShowGrantProductModal(false)} 
                className="btn-dyari-outline text-xs px-3.5 py-2"
              >
                Batal
              </button>
              <button 
                type="button" 
                disabled={!grantProductId}
                onClick={() => handleGrantProductDirect(selectedMemberDetails, grantProductId)} 
                className="btn-dyari text-xs px-4 py-2 font-bold disabled:opacity-50 shadow-xs"
              >
                Berikan Akses Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TERBITKAN LISENSI BARU KE MEMBER                   */}
      {/* ======================================================== */}
      {showGrantLicenseModal && selectedMemberDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full my-auto border border-[#E5EAE4] shadow-2xl p-6 space-y-4 animate-scale-up text-left text-xs">
            <div className="flex items-center justify-between border-b border-[#F0F4F1] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔑</span>
                <div>
                  <h3 className="font-heading font-extrabold text-forest text-sm">
                    Terbitkan Lisensi Baru
                  </h3>
                  <p className="text-[11px] text-warmgray">
                    Untuk member: <strong>{selectedMemberDetails.name}</strong> ({selectedMemberDetails.email})
                  </p>
                </div>
              </div>
              <button onClick={() => setShowGrantLicenseModal(false)} className="text-warmgray hover:text-forest">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-bold text-forest">Produk / Tools Terkait</label>
                <select
                  value={grantLicenseProductId}
                  onChange={(e) => setGrantLicenseProductId(e.target.value)}
                  className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] p-2.5 text-forest font-semibold focus:outline-none"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.categoryName})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-forest">Masa Berlaku Lisensi</label>
                <select
                  value={grantLicenseDuration}
                  onChange={(e) => setGrantLicenseDuration(e.target.value)}
                  className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] p-2.5 text-forest font-semibold focus:outline-none"
                >
                  <option value="Selamanya (Lifetime)">Selamanya (Lifetime)</option>
                  <option value="1 Tahun (365 Hari)">1 Tahun (365 Hari)</option>
                  <option value="6 Bulan (180 Hari)">6 Bulan (180 Hari)</option>
                  <option value="3 Bulan (90 Hari)">3 Bulan (90 Hari)</option>
                  <option value="1 Bulan (30 Hari)">1 Bulan (30 Hari)</option>
                  <option value="14 Hari">14 Hari (Trial)</option>
                  <option value="7 Hari">7 Hari (Trial)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-forest">Tipe Lisensi</label>
                <select
                  value={grantLicenseType}
                  onChange={(e) => setGrantLicenseType(e.target.value)}
                  className="w-full bg-[#F7F9F7] rounded-xl border border-[#E5EAE4] p-2.5 text-forest font-semibold focus:outline-none"
                >
                  <option value="PERSONAL">PERSONAL (Penggunaan Pribadi)</option>
                  <option value="COMMERCIAL">COMMERCIAL (Komersial / Bisnis)</option>
                  <option value="AGENCY">AGENCY (Multi-User / Agensi)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F4F1]">
              <button 
                type="button" 
                onClick={() => setShowGrantLicenseModal(false)} 
                className="btn-dyari-outline text-xs px-3.5 py-2"
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={() => handleGrantLicenseDirect(selectedMemberDetails, grantLicenseProductId || products[0]?.id, grantLicenseDuration, grantLicenseType)} 
                className="btn-dyari text-xs px-4 py-2 font-bold shadow-xs"
              >
                Terbitkan & Simpan Lisensi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
