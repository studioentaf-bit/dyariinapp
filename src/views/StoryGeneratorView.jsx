import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Maximize2, ExternalLink, ArrowLeft, RefreshCw, Compass } from 'lucide-react';

export const StoryGeneratorView = () => {
  const { navigateTo } = useStore();
  const [iframeKey, setIframeKey] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const openNewTab = () => {
    window.open('/story-generator/index.html', '_blank');
  };

  return (
    <div className={`flex flex-col bg-[#F8F7F4] ${isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen' : 'min-h-[calc(100vh-5rem)]'}`}>
      {/* Sub-header Controls Bar */}
      <div className="bg-white/90 backdrop-blur-md border-b border-[#EBEFEA] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xs shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('shop')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#616863] hover:text-[#1C352D] px-2.5 py-1.5 rounded-lg hover:bg-[#F0EEE6] transition-colors"
            title="Kembali ke Toko"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Kembali ke Toko</span>
          </button>
          <div className="h-4 w-px bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#1C352D] text-white flex items-center justify-center text-xs shadow-2xs">
              <Sparkles size={13} className="text-[#A3E6B5]" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-extrabold text-[#1C352D] leading-none flex items-center gap-1.5">
                Story In. AI
                <span className="bg-[#1C352D]/10 text-[#1C352D] text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  Creative Studio
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleReload}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-[#E6E3DA] bg-white text-gray-700 hover:text-black hover:bg-[#F0EEE6] text-xs font-semibold flex items-center gap-1 transition"
            title="Muat Ulang Studio"
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
            <span className="hidden md:inline">Refresh</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-[#E6E3DA] bg-white text-gray-700 hover:text-black hover:bg-[#F0EEE6] text-xs font-semibold flex items-center gap-1 transition"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            <Maximize2 size={12} />
            <span className="hidden md:inline">{isFullscreen ? 'Kecilkan' : 'Layar Penuh'}</span>
          </button>

          <button
            onClick={openNewTab}
            className="px-2.5 py-1 rounded-lg bg-[#1C352D] text-white hover:bg-[#2A523F] text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
            title="Buka Studio di Tab Baru"
          >
            <ExternalLink size={12} className="text-[#A3E6B5]" />
            <span>Tab Baru</span>
          </button>
        </div>
      </div>

      {/* Main Studio Frame */}
      <div className="flex-1 relative w-full h-[calc(100vh-8.5rem)] sm:h-[calc(100vh-7.5rem)] bg-[#F8F7F4]">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F8F7F4]/90 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-2xl bg-[#1C352D] text-white flex items-center justify-center mb-3 shadow-md animate-bounce">
              <Sparkles size={20} className="text-[#A3E6B5]" />
            </div>
            <p className="text-sm font-bold text-[#1C352D]">Memuat Story In. AI Studio...</p>
            <p className="text-xs text-gray-500 mt-1">Menyiapkan workspace AI Storyboard & Video Kreator</p>
          </div>
        )}

        <iframe
          key={iframeKey}
          src="/story-generator/index.html"
          title="Story Generator AI Studio"
          className="w-full h-full border-0 block"
          onLoad={() => setIsLoading(false)}
          allow="clipboard-read; clipboard-write; microphone; camera"
        />
      </div>
    </div>
  );
};
export default StoryGeneratorView;
