import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Store, ShoppingBag, User } from 'lucide-react';

export const MobileBottomNav = () => {
  const { currentView, navigateTo, cart, setIsCartOpen } = useStore();

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-dyariborder py-2 px-6 shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto text-xs font-medium text-warmgray">
        
        {/* Beranda */}
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === 'home' ? 'text-forest font-bold' : 'hover:text-forest'
          }`}
        >
          <Home size={20} className={currentView === 'home' ? 'stroke-[2.5]' : ''} />
          <span>Beranda</span>
        </button>

        {/* Toko */}
        <button
          onClick={() => navigateTo('shop')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === 'shop' ? 'text-forest font-bold' : 'hover:text-forest'
          }`}
        >
          <Store size={20} className={currentView === 'shop' ? 'stroke-[2.5]' : ''} />
          <span>Toko</span>
        </button>

        {/* Keranjang */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1 relative hover:text-forest transition-colors"
        >
          <div className="relative">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-coral text-forest text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span>Keranjang</span>
        </button>

        {/* Akun */}
        <button
          onClick={() => navigateTo('dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === 'dashboard' ? 'text-forest font-bold' : 'hover:text-forest'
          }`}
        >
          <User size={20} className={currentView === 'dashboard' ? 'stroke-[2.5]' : ''} />
          <span>Akun</span>
        </button>

      </div>
    </div>
  );
};
