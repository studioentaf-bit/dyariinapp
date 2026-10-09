import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Store, KeyRound, Sparkles, Info } from 'lucide-react';

export const MobileBottomNav = () => {
  const { currentView, navigateTo, setActiveCategory } = useStore();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EBEFEA] py-2 px-3 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto text-xs font-medium text-[#737873]">
        
        {/* Beranda */}
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            currentView === 'home' ? 'text-[#1C352D] font-bold' : 'hover:text-[#1C352D]'
          }`}
        >
          <Home size={19} className={currentView === 'home' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px]">Beranda</span>
        </button>

        {/* Shop */}
        <button
          onClick={() => { setActiveCategory('all'); navigateTo('shop'); }}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            currentView === 'shop' ? 'text-[#1C352D] font-bold' : 'hover:text-[#1C352D]'
          }`}
        >
          <Store size={19} className={currentView === 'shop' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px]">Shop</span>
        </button>

        {/* Lisensi */}
        <button
          onClick={() => navigateTo('licenses')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            currentView === 'licenses' ? 'text-[#1C352D] font-bold' : 'hover:text-[#1C352D]'
          }`}
        >
          <KeyRound size={19} className={currentView === 'licenses' ? 'stroke-[2.5] text-[#4E8A5C]' : ''} />
          <span className="text-[10px]">Lisensi</span>
        </button>

        {/* Story Generator */}
        <button
          onClick={() => navigateTo('story-generator')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            currentView === 'story-generator' ? 'text-[#EE7C6B] font-bold' : 'hover:text-[#1C352D] text-[#1C352D]'
          }`}
        >
          <div className="relative">
            <Sparkles size={19} className={currentView === 'story-generator' ? 'stroke-[2.5] text-[#EE7C6B]' : 'text-[#EE7C6B]'} />
            <span className="absolute -top-1 -right-2 bg-[#EE7C6B] text-white text-[8px] font-black px-1 rounded-full">AI</span>
          </div>
          <span className="text-[10px]">Story AI</span>
        </button>

        {/* Tentang */}
        <button
          onClick={() => navigateTo('about')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            currentView === 'about' ? 'text-[#1C352D] font-bold' : 'hover:text-[#1C352D]'
          }`}
        >
          <Info size={19} className={currentView === 'about' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px]">Tentang</span>
        </button>

      </div>
    </div>
  );
};
