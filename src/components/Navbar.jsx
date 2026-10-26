import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X } from 'lucide-react';

export const Navbar = () => {
  const { 
    currentView, 
    navigateTo, 
    searchQuery, 
    setSearchQuery,
    setActiveCategory,
    storeSettings
  } = useStore();

  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('shop');
      setShowSearchModal(false);
    }
  };

  // If in Admin view, AdminDashboard handles its own layout
  if (currentView === 'admin') {
    return null;
  }

  const navItems = [
    { key: 'home', label: 'Beranda' },
    { key: 'shop', label: 'Shop' },
    { key: 'licenses', label: 'Lisensi' },
    { key: 'story-generator', label: 'Story Generator' },
    { key: 'download', label: 'Download App' },
    { key: 'about', label: 'Tentang' }
  ];

  return (
    <>
      {/* Top Announcement Bar (Playful Sky/Blue Pastel) */}
      <div 
        onClick={() => { setActiveCategory('all'); navigateTo('shop'); }}
        className="bg-gradient-to-r from-sky-100/80 via-blue-50 to-indigo-100/80 border-b border-blue-200/50 text-slate-700 text-[11px] sm:text-xs py-2 px-4 text-center font-bold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors shadow-2xs"
      >
        <span>🎁 <strong className="text-blue-600">Promo Spesial:</strong> Diskon hingga 50% untuk Semua Bundle &amp; Template Digital!</span>
        <span className="text-blue-500 font-extrabold ml-1">→</span>
      </div>

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-2xs transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Logo 3D Origami + Story.in */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 9L6 21L12 17L18 21L21 9L12 2Z" fill="white" fillOpacity="0.9" />
                  <path d="M12 2L12 17L18 21L21 9L12 2Z" fill="white" fillOpacity="0.35" />
                </svg>
              </div>
              <span className="text-2xl sm:text-[26px] font-heading font-black tracking-tight text-slate-900">
                Story<span className="text-blue-600">.in</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation Menu: Capsule Pill Container */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-slate-50 border border-slate-200/70 shadow-2xs text-xs sm:text-[13px] font-bold">
            {navItems.map((item) => {
              const isActive = currentView === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    if (item.key === 'shop') setActiveCategory('all');
                    navigateTo(item.key);
                  }}
                  className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-100/90 text-indigo-700 shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Search Circle */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowSearchModal(true)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105"
              title="Cari Produk & Lisensi Story.in"
            >
              <Search size={17} />
            </button>
          </div>

        </div>
      </header>

      {/* Quick Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-24 px-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Pencarian Produk Story.in</span>
              <button 
                onClick={() => setShowSearchModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari financial planner, habit tracker, prompt pack, template..."
                autoFocus
                className="w-full bg-slate-50 rounded-2xl border border-slate-200 py-3.5 pl-11 pr-4 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
              />
              <Search size={18} className="absolute left-3.5 top-4 text-slate-400" />
            </form>
          </div>
        </div>
      )}
    </>
  );
};
