import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingBag, User, X, Download } from 'lucide-react';

export const Navbar = () => {
  const { 
    currentView, 
    navigateTo, 
    cart, 
    setIsCartOpen, 
    user, 
    setIsAuthOpen, 
    searchQuery, 
    setSearchQuery,
    setActiveCategory,
    storeSettings
  } = useStore();

  const [showSearchModal, setShowSearchModal] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('shop');
      setShowSearchModal(false);
    }
  };

  // If we are currently in Admin view, we let AdminDashboard handle its own sidebar/topbar
  if (currentView === 'admin') {
    return null;
  }

  return (
    <>
      {/* Top Announcement Bar (Managed from Admin Settings) */}
      {storeSettings?.showAnnouncement && storeSettings?.announcement && (
        <div className="bg-[#1C352D] text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <span>🌿 {storeSettings.announcement}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#FCFAF5]/95 backdrop-blur-md border-b border-[#EBEFEA] transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              {(storeSettings?.branding?.logoUrl || storeSettings?.logoUrl) ? (
                <img 
                  src={storeSettings?.branding?.logoUrl || storeSettings?.logoUrl} 
                  alt={storeSettings?.branding?.storeName || 'dyari.in'} 
                  className="h-8 sm:h-9 max-w-[180px] object-contain rounded-md"
                />
              ) : (
                <span className="text-2xl sm:text-[28px] font-heading font-extrabold tracking-tight text-[#1C352D]">
                  {storeSettings?.branding?.storeName?.includes('.') ? (
                    <>
                      {storeSettings.branding.storeName.split('.')[0]}
                      <span className="text-[#EE7C6B] font-black">.</span>
                      {storeSettings.branding.storeName.split('.').slice(1).join('.')}
                    </>
                  ) : (
                    storeSettings?.branding?.storeName || 'dyari.in'
                  )}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Navigation Menu: Beranda | Shop | Lisensi | Story Generator | Download App | Tentang */}
          <nav className="hidden md:flex items-center space-x-5 lg:space-x-7 text-xs sm:text-sm font-medium">
            <button 
              onClick={() => navigateTo('home')}
              className={`transition-colors cursor-pointer ${currentView === 'home' ? 'text-[#1C352D] font-bold' : 'text-[#616863] hover:text-[#1C352D]'}`}
            >
              Beranda
            </button>
            <button 
              onClick={() => { setActiveCategory('all'); navigateTo('shop'); }}
              className={`transition-colors cursor-pointer ${currentView === 'shop' ? 'text-[#1C352D] font-bold' : 'text-[#616863] hover:text-[#1C352D]'}`}
            >
              Shop
            </button>
            <button 
              onClick={() => navigateTo('licenses')}
              className={`transition-colors cursor-pointer ${currentView === 'licenses' ? 'text-[#1C352D] font-bold' : 'text-[#616863] hover:text-[#1C352D]'}`}
            >
              Lisensi
            </button>
            <button 
              onClick={() => navigateTo('story-generator')}
              className={`transition-colors cursor-pointer ${currentView === 'story-generator' ? 'text-[#1C352D] font-bold' : 'text-[#616863] hover:text-[#1C352D]'}`}
            >
              Story Generator
            </button>
            <button 
              onClick={() => navigateTo('download')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${currentView === 'download' ? 'bg-[#1C352D] text-white font-bold shadow-2xs' : 'bg-[#E8F0EA] text-[#1C352D] hover:bg-[#D5E5D8] font-semibold'}`}
            >
              <Download size={13} className="text-[#4E8A5C]" />
              <span>Download App</span>
            </button>
            <button 
              onClick={() => navigateTo('about')}
              className={`transition-colors cursor-pointer ${currentView === 'about' ? 'text-[#1C352D] font-bold' : 'text-[#616863] hover:text-[#1C352D]'}`}
            >
              Tentang
            </button>
          </nav>


          {/* Right Action: Search Only (Cart and Masuk removed as requested) */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowSearchModal(true)}
              className="p-2 text-[#1C352D] hover:text-[#EE7C6B] transition-colors cursor-pointer"
              title="Cari Produk & Lisensi"
            >
              <Search size={20} />
            </button>
          </div>

        </div>
      </header>

      {/* Quick Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-start justify-center pt-24 px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[#E5EAE4]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#737873] uppercase">Pencarian Produk dyari.in</span>
              <button 
                onClick={() => setShowSearchModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari financial planner, habit tracker, prompt pack..."
                autoFocus
                className="w-full bg-[#FAFBF9] rounded-xl border border-[#DDE3DC] py-3 pl-10 pr-4 text-xs sm:text-sm text-[#1C352D] focus:outline-none focus:border-[#1C352D]"
              />
              <Search size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            </form>
          </div>
        </div>
      )}
    </>
  );
};
