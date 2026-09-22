import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Home, 
  Package, 
  ShoppingBag, 
  Settings, 
  HelpCircle, 
  ArrowRight, 
  Check, 
  ExternalLink, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  X,
  Copy,
  LogOut 
} from 'lucide-react';

export const UserDashboardView = () => {
  const { 
    user, 
    setUser, 
    dashboardTab, 
    setDashboardTab, 
    products, 
    categories,
    purchasedProductIds, 
    orders, 
    licenses,
    getLicenseEffectiveStatus,
    activeProductAccess, 
    setActiveProductAccess, 
    navigateTo, 
    showToast,
    setIsAuthOpen
  } = useStore();

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filterMyProducts, setFilterMyProducts] = useState('all');

  // Filter purchased products
  const myProducts = products.filter(p => purchasedProductIds.includes(p.id));

  const filteredMyProducts = myProducts.filter(p => {
    if (filterMyProducts === 'all') return true;
    return p.category === filterMyProducts;
  });

  const myProductCategoryTabs = [
    { id: 'all', label: 'Semua' },
    ...(categories || []).map(c => ({ id: c.id, label: c.name }))
  ];

  // Currently viewed digital product for access
  const activeProduct = products.find(p => p.id === activeProductAccess) || myProducts[0] || products[0];

  const handleOpenProduct = (productId) => {
    setActiveProductAccess(productId);
    setDashboardTab('akses-produk');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dyari_current_user');
    localStorage.removeItem('dyari_member_user');
    localStorage.removeItem('dyari_auth_token');
    showToast('Berhasil Keluar', 'Anda telah keluar dari akun member.');
    navigateTo('home');
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-forest/5 border border-forest/15 flex items-center justify-center mx-auto text-forest shadow-xs">
          <ShieldCheck size={36} className="text-forest" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-heading font-extrabold text-forest">
            Area Akses Member
          </h2>
          <p className="text-xs sm:text-sm text-warmgray max-w-md mx-auto">
            Silakan masuk atau daftarkan akun Anda untuk mengakses produk digital yang telah Anda miliki, lisensi aktif, serta riwayat faktur pesanan.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <button
            onClick={() => setIsAuthOpen(true)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-forest text-white text-xs font-heading font-bold shadow-md hover:bg-[#152a24] transition-all cursor-pointer"
          >
            Masuk ke Akun Saya
          </button>
          <button
            onClick={() => navigateTo('home')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white border border-[#DCE4DD] text-forest text-xs font-heading font-bold hover:bg-[#F2F6F3] transition-all cursor-pointer"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'ringkasan', label: 'Ringkasan', icon: Home },
    { id: 'produk-saya', label: 'Produk Saya', icon: Package },
    { id: 'pesanan', label: 'Pesanan', icon: ShoppingBag },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 16 — SIDEBAR (DESKTOP) */}
        <aside className="lg:col-span-3 bg-white rounded-dyari border border-dyariborder p-5 shadow-card space-y-6">
          {/* Logo in Sidebar */}
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="w-7 h-7 rounded-full bg-matcha flex items-center justify-center text-forest text-xs font-black">
              dy
            </span>
            <span className="font-heading font-extrabold text-forest text-lg">dyari<span className="text-coral">.</span>in</span>
          </div>

          {/* Main Nav Links */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = dashboardTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setDashboardTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-dyari-sm text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-matcha/80 text-forest font-bold shadow-xs'
                      : 'text-warmgray hover:text-forest hover:bg-sage/40'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-forest stroke-[2.5]' : ''} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <hr className="border-dyariborder" />

          {/* Bottom Settings & Support */}
          <div className="space-y-1">
            <button
              onClick={() => setDashboardTab('pengaturan')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-dyari-sm text-sm font-medium transition-all ${
                dashboardTab === 'pengaturan'
                  ? 'bg-matcha/80 text-forest font-bold'
                  : 'text-warmgray hover:text-forest hover:bg-sage/40'
              }`}
            >
              <Settings size={18} />
              <span>Pengaturan</span>
            </button>
            <button
              onClick={() => showToast('Bantuan dyari.in', 'Tim dukungan kami siap membantu via WhatsApp & Email!')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-dyari-sm text-sm font-medium text-warmgray hover:text-forest hover:bg-sage/40 transition-all"
            >
              <HelpCircle size={18} />
              <span>Bantuan</span>
            </button>
          </div>

          {/* User Profile Card in Sidebar */}
          <div className="pt-3 border-t border-dyariborder space-y-3 px-1">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-9 h-9 rounded-full object-cover border border-dyariborder shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-forest text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'M'}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="font-heading font-bold text-forest text-xs truncate">{user.name}</p>
                <p className="text-[11px] text-warmgray truncate">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut size={13} />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </aside>

        {/* MAIN DASHBOARD CONTENT AREA */}
        <main className="lg:col-span-9 space-y-8">
          
          {/* 17 — RINGKASAN DASHBOARD */}
          {dashboardTab === 'ringkasan' && (
            <div className="space-y-8">
              {/* Welcome Header */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-forest">
                  Selamat siang, {user.name} 👋
                </h1>
                <p className="text-warmgray text-sm mt-1">
                  Berikut yang sedang terjadi di akunmu.
                </p>
              </div>

              {/* 2 Metric Cards: PRODUK, PESANAN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div 
                  onClick={() => setDashboardTab('produk-saya')}
                  className="bg-white p-5 sm:p-6 rounded-dyari border border-dyariborder shadow-card text-center cursor-pointer hover:border-matcha transition-colors"
                >
                  <span className="text-xs font-bold text-warmgray uppercase tracking-wider block">PRODUK</span>
                  <span className="text-3xl sm:text-4xl font-heading font-black text-forest mt-1 block">
                    {myProducts.length}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium hidden sm:block mt-1">Siap Diakses</span>
                </div>

                <div 
                  onClick={() => setDashboardTab('pesanan')}
                  className="bg-white p-5 sm:p-6 rounded-dyari border border-dyariborder shadow-card text-center cursor-pointer hover:border-matcha transition-colors"
                >
                  <span className="text-xs font-bold text-warmgray uppercase tracking-wider block">PESANAN</span>
                  <span className="text-3xl sm:text-4xl font-heading font-black text-forest mt-1 block">
                    {orders.length}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium hidden sm:block mt-1">Semua Lunas</span>
                </div>
              </div>

              {/* Produk Terbaru Section (Spec #17) */}
              <div className="bg-white p-6 sm:p-8 rounded-dyari border border-dyariborder shadow-card space-y-6">
                <div className="flex items-center justify-between border-b border-dyariborder/70 pb-3">
                  <h3 className="font-heading font-bold text-lg text-forest">Produk Kamu</h3>
                  <button 
                    onClick={() => setDashboardTab('produk-saya')}
                    className="text-xs font-semibold text-forest hover:text-coral transition-colors"
                  >
                    Lihat Semua ({myProducts.length}) →
                  </button>
                </div>

                <div className="space-y-4">
                  {myProducts.length === 0 ? (
                    <div className="text-center py-6 text-warmgray text-xs bg-cream/20 rounded-dyari-sm border border-dashed border-dyariborder">
                      Belum ada produk yang dibeli.
                    </div>
                  ) : (
                    myProducts.slice(0, 3).map((item) => (
                      <div key={item.id} className="p-4 sm:p-5 rounded-dyari-sm border border-dyariborder bg-cream/30 hover:bg-cream/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-dyariborder/50" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center text-xl shrink-0 text-forest">
                              📦
                            </div>
                          )}
                          <div>
                            <h4 className="font-heading font-bold text-forest text-base leading-snug">{item.name}</h4>
                            <p className="text-xs text-warmgray mt-0.5">{item.categoryName || item.category || 'Aset Digital'}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleOpenProduct(item.id)}
                          className="btn-dyari-outline text-xs px-5 py-2.5 self-start sm:self-auto shrink-0"
                        >
                          <span>Buka Produk</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 18 — PRODUK SAYA */}
          {dashboardTab === 'produk-saya' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dyariborder pb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-forest">Produk Saya</h1>
                  <p className="text-xs sm:text-sm text-warmgray mt-0.5">
                    Daftar seluruh lisensi dan produk digital yang kamu miliki.
                  </p>
                </div>

                {/* Filter Tabs from store categories */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                  {myProductCategoryTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilterMyProducts(tab.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 whitespace-nowrap ${
                        filterMyProducts === tab.id
                          ? 'bg-forest text-white shadow-xs'
                          : 'bg-white border border-dyariborder text-warmgray hover:text-forest'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Produk Saya */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMyProducts.map((prod) => {
                  const isLicenseTool = prod.productType === 'LICENSE_TOOL' || prod.category === 'tools-ai' || prod.type === 'LISENSI';
                  const userLic = isLicenseTool ? licenses?.find(l => (l.productId === prod.id || l.productName === prod.name) && (l.customerEmail === user.email || l.customerName === user.name)) : null;
                  const licStatus = isLicenseTool ? getLicenseEffectiveStatus(userLic) : null;

                  return (
                    <div 
                      key={prod.id}
                      className="bg-white rounded-dyari border border-dyariborder overflow-hidden shadow-card flex flex-col justify-between transition-all hover:shadow-soft-hover"
                    >
                      <div className="aspect-[16/10] w-full bg-sage/30 relative">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-matcha text-forest text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-xs">
                          {prod.type}
                        </span>

                        {/* License Status Badge Overlay */}
                        {isLicenseTool && licStatus && (
                          <div className="absolute top-3 right-3">
                            {licStatus.isLocked ? (
                              <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-xs flex items-center gap-1">
                                <span>🔒 Terkunci</span>
                              </span>
                            ) : (
                              <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-xs flex items-center gap-1">
                                <span>🟢 Aktif</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[11px] text-warmgray font-medium">{prod.categoryName}</span>
                            {isLicenseTool && userLic && (
                              <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded">
                                {userLic.type}
                              </span>
                            )}
                          </div>
                          <h4 className="font-heading font-bold text-forest text-base line-clamp-1">{prod.name}</h4>
                          <p className="text-xs text-warmgray line-clamp-2 mt-1">{prod.tagline}</p>

                          {/* License Duration Notice */}
                          {isLicenseTool && userLic && (
                            <div className="mt-2.5 pt-2 border-t border-dyariborder/60 flex items-center justify-between text-[11px]">
                              <span className="text-warmgray">Berakhir:</span>
                              <span className={`font-semibold ${licStatus?.isLocked ? 'text-rose-600' : 'text-forest'}`}>
                                {userLic.isLifetime ? '♾️ Lifetime' : userLic.expiresAt}
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleOpenProduct(prod.id)}
                          className={`w-full mt-2 font-heading font-bold py-2.5 rounded-dyari-sm text-xs transition-colors flex items-center justify-center gap-1.5 ${
                            licStatus?.isLocked 
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200' 
                              : 'bg-sage hover:bg-matcha text-forest'
                          }`}
                        >
                          <span>{licStatus?.isLocked ? 'Lihat Detail & Perpanjang' : 'Buka Produk'}</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 19 — AKSES PRODUK DIGITAL */}
          {dashboardTab === 'akses-produk' && (() => {
            const pType = activeProduct.productType || (
              activeProduct.type === 'LISENSI'
                ? 'LICENSE_TOOL'
                : (activeProduct.category === 'aplikasi' ? 'APPS_PREMIUM' : 'DIGITAL_PREMIUM')
            );

            const isLicenseProduct = pType === 'LICENSE_TOOL' || activeProduct.category === 'tools-ai';
            const matchLicense = isLicenseProduct 
              ? licenses?.find(l => (l.productId === activeProduct.id || l.productName === activeProduct.name) && (l.customerEmail === user.email || l.customerName === user.name))
              : null;
            
            const userLic = matchLicense || (isLicenseProduct ? {
              code: `DYARI-${(activeProduct.licensePrefix || 'TOOL').toUpperCase()}-${user.name.substring(0, 3).toUpperCase()}-8891`,
              type: activeProduct.licenseType || 'PERSONAL',
              status: 'Aktif',
              createdAt: '10 Jan 2026, 09:00',
              expiresAt: activeProduct.licenseDuration || 'Selamanya (Lifetime)',
              isLifetime: (activeProduct.licenseDuration || '').toLowerCase().includes('selamanya')
            } : null);

            const licenseEffective = isLicenseProduct ? getLicenseEffectiveStatus(userLic) : null;
            const isLicenseLocked = isLicenseProduct && licenseEffective?.isLocked;

            return (
              <div className="bg-white rounded-dyari border border-dyariborder p-6 sm:p-8 shadow-card space-y-8">
                
                {/* Product Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dyariborder/70 pb-6">
                  <div>
                    <button 
                      onClick={() => setDashboardTab('produk-saya')}
                      className="text-xs text-warmgray hover:text-forest flex items-center gap-1 mb-2"
                    >
                      ← Kembali ke Produk Saya
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-forest">
                      {activeProduct.name}
                    </h1>
                    <p className="text-sm text-warmgray mt-1">{activeProduct.tagline}</p>
                  </div>

                  <div className="space-y-1 text-left sm:text-right">
                    {isLicenseProduct ? (
                      isLicenseLocked ? (
                        <>
                          <div className="inline-flex items-center gap-1.5 text-xs text-rose-700 font-bold bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                            <span>🔒 Akses Terkunci ({licenseEffective?.status})</span>
                          </div>
                          <p className="text-xs text-rose-600 font-semibold">Berakhir: {userLic?.expiresAt}</p>
                        </>
                      ) : (
                        <>
                          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                            <Check size={14} />
                            <span>✓ Lisensi Aktif ({licenseEffective?.remainingText})</span>
                          </div>
                          <p className="text-xs text-warmgray">Berakhir: {userLic?.isLifetime ? '♾️ Selamanya' : userLic?.expiresAt}</p>
                        </>
                      )
                    ) : (
                      <>
                        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full">
                          <Check size={14} />
                          <span>Sudah Dibeli</span>
                        </div>
                        <p className="text-xs text-warmgray">✓ Akses Selamanya</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Product Access Delivery based on 3 Product Types */}
                {(() => {
                  if (pType === 'APPS_PREMIUM') {
                    const matchOrder = orders.find(o => o.items?.some(it => it.id === activeProduct.id || it.name === activeProduct.name));
                    const matchItem = matchOrder?.items?.find(it => it.id === activeProduct.id || it.name === activeProduct.name);
                    const assignedAccount = matchItem?.assignedAccount || activeProduct.accountStock?.find(s => s.soldToEmail === user.email || s.soldTo === matchOrder?.id)?.text || activeProduct.accessUrl || 'https://canva.com/brand/join?invite=VIP-ALPHA-991';

                    return (
                      <div className="p-5 rounded-2xl border-2 border-blue-200 bg-blue-50/70 space-y-3 text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">📱</span>
                            <div>
                              <h4 className="font-heading font-extrabold text-sm text-blue-950">
                                Akun & Link Akses Eksklusif Anda
                              </h4>
                              <p className="text-xs text-blue-900">
                                Data akses akun privat ini 1x pakai khusus untuk Anda:
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-blue-200 text-blue-900 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                            STATUS: AKTIF
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                          <code className="text-xs font-mono font-bold text-blue-950 break-all select-all">
                            {assignedAccount}
                          </code>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(assignedAccount);
                                showToast('Akses Akun Disalin', 'Teks link/akun berhasil disalin.');
                              }}
                              className="btn-dyari-outline text-xs px-3.5 py-2 inline-flex items-center gap-1.5 font-bold"
                            >
                              <Copy size={13} />
                              <span>Salin</span>
                            </button>
                            {assignedAccount.startsWith('http') && (
                              <a
                                href={assignedAccount}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-dyari text-xs px-4 py-2 inline-flex items-center gap-1.5 font-bold"
                              >
                                <span>Buka Link</span>
                                <ExternalLink size={13} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (isLicenseProduct) {
                    // JIKA LISENSI KADALUARSA / DIBEKUKAN -> TERKUNCI RAPAT
                    if (isLicenseLocked) {
                      return (
                        <div className="p-5 sm:p-6 rounded-2xl border-2 border-rose-300 bg-rose-50/80 space-y-4 text-left shadow-2xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-200 pb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
                                🔒
                              </div>
                              <div>
                                <h4 className="font-heading font-extrabold text-base text-rose-950">
                                  Akses Terkunci: Masa Berlaku Lisensi Telah Habis
                                </h4>
                                <p className="text-xs text-rose-900">
                                  Masa aktif lisensi telah berakhir pada <strong>{userLic?.expiresAt}</strong>. Seluruh akses tools ditutup otomatis.
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-black bg-rose-200 text-rose-900 border border-rose-300 px-3 py-1 rounded-full self-start sm:self-auto uppercase">
                              🔒 STATUS: {licenseEffective?.status}
                            </span>
                          </div>

                          {/* Detail Waktu Mulai & Berakhir */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-white/95 border border-rose-200 shadow-2xs">
                              <span className="text-[10px] font-bold text-warmgray uppercase block">Waktu Mulai Membeli</span>
                              <strong className="text-forest font-heading text-sm mt-0.5 block">{userLic?.createdAt || 'Mulai Beli'}</strong>
                            </div>
                            <div className="p-3 rounded-xl bg-white/95 border border-rose-200 shadow-2xs">
                              <span className="text-[10px] font-bold text-rose-800 uppercase block">Tanggal Berakhir (Kadaluarsa)</span>
                              <strong className="text-rose-700 font-heading text-sm mt-0.5 block">{userLic?.expiresAt}</strong>
                            </div>
                            <div className="p-3 rounded-xl bg-white/95 border border-rose-200 shadow-2xs">
                              <span className="text-[10px] font-bold text-warmgray uppercase block">Tipe Hak Pakai</span>
                              <strong className="text-purple-900 font-heading text-sm mt-0.5 block">{userLic?.type || 'PERSONAL'}</strong>
                            </div>
                          </div>

                          {/* Kunci Lisensi Disensor / Dinonaktifkan */}
                          <div className="p-3.5 rounded-xl bg-white border border-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-warmgray uppercase tracking-wider block font-bold">Kunci Aktivasi Lisensi:</span>
                              <div className="flex items-center gap-2">
                                <code className="text-sm font-mono font-bold text-gray-400 select-none tracking-widest line-through">
                                  {userLic?.code ? `${userLic.code.substring(0, 10)}••••••••` : 'DYARI-TOOL-••••••••'}
                                </code>
                                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                                  Dinonaktifkan
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => showToast('Lisensi Kadaluarsa', 'Kunci lisensi ini tidak dapat disalin karena masa berlaku telah habis. Harap perpanjang lisensi.')}
                              className="text-xs px-3.5 py-1.5 rounded-lg bg-gray-100 text-gray-400 font-bold cursor-not-allowed border border-gray-200"
                            >
                              Salin Kunci (Terkunci)
                            </button>
                          </div>

                          {/* Pesan & Tombol Perpanjang Lisensi */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                            <p className="text-xs text-rose-900 leading-relaxed">
                              💡 <strong>Perpanjang Lisensi:</strong> Ingin mengaktifkan kembali software dan membuka seluruh fitur tools ini? Silakan hubungi admin kami.
                            </p>
                            <button
                              onClick={() => {
                                const phone = '6282330626054';
                                const text = encodeURIComponent(`Halo dyari.in, saya ingin memperpanjang masa berlaku lisensi untuk produk: ${activeProduct.name} (Kode: ${userLic?.code}). Mohon bantuannya. Terima kasih.`);
                                window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                              }}
                              className="btn-dyari text-xs px-5 py-2.5 font-bold inline-flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white shrink-0 shadow-sm"
                            >
                              <span>Perpanjang Lisensi Sekarang →</span>
                            </button>
                          </div>
                        </div>
                      );
                    }

                    // JIKA LISENSI AKTIF & BELUM KADALUARSA -> TERBUKA
                    return (
                      <div className="p-5 sm:p-6 rounded-2xl border-2 border-purple-200 bg-purple-50/70 space-y-4 text-left shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200/80 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
                              🔑
                            </div>
                            <div>
                              <h4 className="font-heading font-extrabold text-base text-purple-950">
                                Kunci Lisensi Resmi Anda (Aktif)
                              </h4>
                              <p className="text-xs text-purple-900">
                                Kunci lisensi resmi aktivasi tools ({userLic?.type}) terdaftar atas akun Anda.
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-purple-200 text-purple-900 px-3 py-1 rounded-full self-start sm:self-auto border border-purple-300">
                            ● AKTIF & TERBUKA
                          </span>
                        </div>

                        {/* Rincian Tanggal Mulai Beli, Tanggal Berakhir, dan Sisa Masa Aktif */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-white border border-purple-200 shadow-2xs">
                            <span className="text-[10px] font-bold text-warmgray uppercase block">Waktu Mulai Membeli</span>
                            <strong className="text-forest font-heading text-sm mt-0.5 block">{userLic?.createdAt || 'Mulai Beli'}</strong>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-purple-200 shadow-2xs">
                            <span className="text-[10px] font-bold text-purple-800 uppercase block">Tanggal Berakhir</span>
                            <strong className="text-purple-900 font-heading text-sm mt-0.5 block">
                              {userLic?.isLifetime ? '♾️ Selamanya (Lifetime)' : userLic?.expiresAt}
                            </strong>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-purple-200 shadow-2xs">
                            <span className="text-[10px] font-bold text-warmgray uppercase block">Sisa Masa Aktif</span>
                            <strong className="text-emerald-700 font-heading text-sm mt-0.5 block">
                              {licenseEffective?.remainingText || userLic?.expiresAt}
                            </strong>
                          </div>
                        </div>

                        {/* Kunci Lisensi Siap Salin */}
                        <div className="p-3.5 rounded-xl bg-white border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-warmgray uppercase tracking-wider block font-bold">Kode Kunci Lisensi:</span>
                            <code className="text-base font-mono font-black text-purple-900 tracking-wider select-all">
                              {userLic?.code}
                            </code>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(userLic?.code);
                                showToast('Kunci Lisensi Disalin', userLic?.code);
                              }}
                              className="btn-dyari text-xs px-4 py-2 inline-flex items-center gap-1.5 font-bold shadow-xs"
                            >
                              <Copy size={13} />
                              <span>Salin Kunci</span>
                            </button>
                            {activeProduct.accessUrl && (
                              <a
                                href={activeProduct.accessUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-dyari-outline text-xs px-3.5 py-2 inline-flex items-center gap-1.5 font-bold"
                              >
                                <span>Buka Tools</span>
                                <ExternalLink size={13} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // DIGITAL_PREMIUM
                  if (activeProduct.accessUrl) {
                    return (
                      <div className="p-4 rounded-dyari-sm border-2 border-forest/20 bg-sage/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-forest text-white flex items-center justify-center shrink-0">
                            <ExternalLink size={20} />
                          </div>
                          <div>
                            <p className="font-heading font-bold text-forest text-sm">
                              Buka Folder / Akses Online Resmi (Shared Link)
                            </p>
                            <span className="text-xs text-warmgray">Akses langsung ke Google Drive / Gemini AI / Google Sheets</span>
                          </div>
                        </div>
                        <a
                          href={activeProduct.accessUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-dyari text-xs px-4 py-2.5 shrink-0 inline-flex items-center gap-1.5"
                        >
                          <span>Buka Link Akses</span>
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    );
                  }

                  return null;
                })()}

                {/* Cara Menggunakan Section */}
                <div className="space-y-4 pt-4 border-t border-dyariborder/70">
                  <h3 className="font-heading font-bold text-base sm:text-lg text-forest">
                    Cara Menggunakan
                  </h3>

                  <ol className="space-y-3 text-sm text-forest/90">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-sage text-forest flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        {isLicenseProduct 
                          ? <strong>Salin Kunci Lisensi:</strong> 
                          : <strong>Buka Tautan Akses:</strong>} {isLicenseProduct 
                            ? 'Salin kode lisensi di atas untuk aktivasi software atau tools terkait.' 
                            : 'Klik tombol "Buka Link Akses" di atas untuk mengakses materi online resmi kamu.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-sage text-forest flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        {isLicenseProduct
                          ? <strong>Buka Tools & Aktivasi:</strong>
                          : <strong>Gunakan Materi:</strong>} {isLicenseProduct
                            ? 'Jalankan software atau buka link web tools, masukkan email dan kode lisensi resmi kamu.'
                            : 'Akses Google Drive, Google Sheets, Google Sites, atau Gemini AI share secara langsung melalui browser akunmu.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-sage text-forest flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        {isLicenseProduct
                          ? <strong>Pantau Masa Aktif:</strong>
                          : <strong>Akses Permanen:</strong>} {isLicenseProduct
                            ? 'Pastikan memperpanjang lisensi sebelum tanggal berakhir agar akses tidak terputus.'
                            : 'Materi dapat kamu akses dan pelajari kapan pun seumur hidup dengan akun terdaftar.'}
                      </span>
                    </li>
                  </ol>
                </div>

                {/* Support Contact */}
                <div className="pt-4 border-t border-dyariborder/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-warmgray">
                  <span>Butuh bantuan atau perpanjangan lisensi?</span>
                  <button 
                    onClick={() => {
                      const phone = '6282330626054';
                      const text = encodeURIComponent(`Halo dyari.in, saya butuh bantuan terkait produk: ${activeProduct.name}`);
                      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                    }}
                    className="btn-dyari-outline text-xs"
                  >
                    Hubungi Dukungan
                  </button>
                </div>

              </div>
            );
          })()}


          {/* 21 — RIWAYAT PESANAN */}
          {dashboardTab === 'pesanan' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-forest">Pesanan</h1>
                <p className="text-xs sm:text-sm text-warmgray mt-0.5">
                  Riwayat transaksi dan bukti pembelian produk digital kamu.
                </p>
              </div>

              <div className="bg-white rounded-dyari border border-dyariborder shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-cream/70 border-b border-dyariborder text-xs text-warmgray uppercase font-semibold">
                      <tr>
                        <th className="px-6 py-4">Pesanan</th>
                        <th className="px-6 py-4">Tanggal</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dyariborder/60">
                      {orders.map((ord) => (
                        <tr 
                          key={ord.id}
                          className="hover:bg-cream/40 transition-colors cursor-pointer"
                          onClick={() => setSelectedInvoice(ord)}
                        >
                          <td className="px-6 py-4 font-heading font-bold text-forest">
                            {ord.id}
                          </td>
                          <td className="px-6 py-4 text-warmgray text-xs sm:text-sm">
                            {ord.date}
                          </td>
                          <td className="px-6 py-4 font-semibold text-forest">
                            Rp {ord.total.toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                              {ord.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedInvoice(ord);
                              }}
                              className="text-xs font-semibold text-coral-dark hover:underline"
                            >
                              Detail Invoice →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* 22 — PENGATURAN */}
          {dashboardTab === 'pengaturan' && (
            <div className="bg-white rounded-dyari border border-dyariborder p-6 sm:p-8 shadow-card space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-forest">Pengaturan</h1>
                <p className="text-xs sm:text-sm text-warmgray mt-0.5">
                  Kelola profil akun, keamanan kata sandi, dan preferensi notifikasi.
                </p>
              </div>

              {/* Profil */}
              <div className="space-y-4 border-t border-dyariborder/70 pt-6">
                <h3 className="font-heading font-bold text-base text-forest">Profil</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-semibold text-forest mb-1">Nama</label>
                    <input 
                      type="text" 
                      defaultValue={user.name} 
                      className="w-full bg-cream rounded-dyari-sm border border-dyariborder px-3.5 py-2 text-sm text-forest"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-forest mb-1">Email</label>
                    <input 
                      type="email" 
                      defaultValue={user.email} 
                      className="w-full bg-cream rounded-dyari-sm border border-dyariborder px-3.5 py-2 text-sm text-forest"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => showToast('Perubahan Disimpan', 'Profilmu berhasil diperbarui.')}
                  className="btn-dyari-primary text-xs"
                >
                  Simpan Perubahan
                </button>
              </div>

              {/* Keamanan */}
              <div className="space-y-4 border-t border-dyariborder/70 pt-6">
                <h3 className="font-heading font-bold text-base text-forest">Keamanan</h3>
                <div className="max-w-md space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 rounded-dyari-sm border border-dyariborder bg-cream/40">
                    <div>
                      <p className="font-semibold text-forest">Kata Sandi</p>
                      <p className="text-xs text-warmgray">Terakhir diubah 3 bulan lalu</p>
                    </div>
                    <button 
                      onClick={() => showToast('Keamanan', 'Link reset kata sandi telah dikirim ke email.')}
                      className="btn-dyari-outline text-xs px-3 py-1.5"
                    >
                      Ubah Kata Sandi
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-dyari-sm border border-dyariborder bg-cream/40">
                    <div>
                      <p className="font-semibold text-forest">Autentikasi Dua Faktor (2FA)</p>
                      <p className="text-xs text-emerald-700 font-medium">Aktif via Email</p>
                    </div>
                    <button className="text-xs font-semibold text-warmgray hover:text-forest">Kelola</button>
                  </div>
                </div>
              </div>

              {/* Preferensi */}
              <div className="space-y-4 border-t border-dyariborder/70 pt-6">
                <h3 className="font-heading font-bold text-base text-forest">Preferensi</h3>
                <div className="max-w-md space-y-2 text-sm">
                  <div className="flex items-center justify-between p-3 rounded-dyari-sm border border-dyariborder bg-cream/40">
                    <span className="text-forest font-medium">Notifikasi Email</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">AKTIF</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-dyari-sm border border-dyariborder bg-cream/40">
                    <span className="text-forest font-medium">Update Produk</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">AKTIF</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedInvoice(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-forest/40 backdrop-blur-sm overflow-y-auto"
        >
          <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-3xl p-6 sm:p-8 shadow-2xl border border-dyariborder flex flex-col relative animate-scale-up">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-warmgray hover:text-forest transition"
              title="Tutup (Esc)"
            >
              <X size={18} />
            </button>

            <div className="border-b border-dyariborder pb-4 shrink-0">
              <span className="text-xs uppercase font-bold text-warmgray">INVOICE PEMBELIAN</span>
              <h3 className="text-2xl font-heading font-extrabold text-forest">{selectedInvoice.id}</h3>
              <p className="text-xs text-warmgray mt-1">Tanggal: {selectedInvoice.date}</p>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-warmgray uppercase">Rincian Item</p>
                {selectedInvoice.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm p-3 rounded-xl bg-[#FAFBF9] border border-[#E5EAE4]">
                    <span className="font-semibold text-forest">{item.name}</span>
                    <span className="font-bold text-forest">Rp {item.price.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-dyariborder flex justify-between items-center text-base font-bold">
                <span>Total Pembayaran</span>
                <span className="font-heading font-black text-xl text-forest">
                  Rp {selectedInvoice.total.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="bg-cream p-4 rounded-2xl text-xs text-warmgray space-y-1">
                <p>Metode Pembayaran: <strong>{selectedInvoice.paymentMethod}</strong></p>
                <p>Status: <span className="text-emerald-700 font-bold">✓ Lunas & Terverifikasi</span></p>
              </div>
            </div>

            <div className="pt-3 border-t border-dyariborder shrink-0">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-full btn-dyari text-xs py-3 font-bold"
              >
                Tutup Invoice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
