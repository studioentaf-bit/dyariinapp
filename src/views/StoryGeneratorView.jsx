import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Maximize2, Minimize2, ExternalLink, RefreshCw } from 'lucide-react';

export const StoryGeneratorView = () => {
  const { navigateTo } = useStore();
  const [iframeKey, setIframeKey] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const openNewTab = () => {
    window.open('/story-generator/index.html', '_blank');
  };

  return (
    <div
      className="w-full relative overflow-hidden bg-[#F8F7F4]"
      style={{
        height: isFullscreen ? '100vh' : 'calc(100vh - 5rem)',
        width: '100%',
        position: isFullscreen ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: isFullscreen ? 99999 : 1
      }}
    >
      {/* Sleek Floating Quick-Controls Pill (Top-Right) */}
      <div className="absolute top-3.5 right-4 z-30 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-[#E6E3DA] shadow-md transition-all hover:bg-white">
        <button
          onClick={handleReload}
          className="p-1.5 rounded-lg text-gray-600 hover:text-black hover:bg-[#F0EEE6] text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
          title="Muat Ulang Studio"
        >
          <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline text-[11px]">Refresh</span>
        </button>

        <div className="w-px h-3.5 bg-gray-200" />

        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg text-gray-600 hover:text-black hover:bg-[#F0EEE6] text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh (Full Studio)'}
        >
          {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          <span className="hidden sm:inline text-[11px]">
            {isFullscreen ? 'Kecilkan' : 'Layar Penuh'}
          </span>
        </button>

        <div className="w-px h-3.5 bg-gray-200" />

        <button
          onClick={openNewTab}
          className="p-1.5 rounded-lg text-[#1C352D] hover:bg-[#EBEFEA] text-xs font-bold flex items-center gap-1 transition cursor-pointer"
          title="Buka di Tab Baru"
        >
          <ExternalLink size={13} className="text-[#EE7C6B]" />
          <span className="hidden sm:inline text-[11px]">Tab Baru</span>
        </button>
      </div>

      {/* Loading Skeleton Indicator */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#F8F7F4]/90 backdrop-blur-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#1C352D] text-white flex items-center justify-center mb-3 shadow-lg animate-bounce">
            <Sparkles size={24} className="text-[#A3E6B5]" />
          </div>
          <p className="text-sm font-bold text-[#1C352D]">Menyiapkan Story In. AI Studio...</p>
          <p className="text-xs text-gray-500 mt-1">Creative Production Studio & Video Creator</p>
        </div>
      )}

      {/* Full-Height Responsive Iframe */}
      <iframe
        key={iframeKey}
        src="/story-generator/index.html"
        title="Story Generator AI Studio"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '100%',
          border: 'none',
          display: 'block'
        }}
        allow="clipboard-read; clipboard-write; microphone; camera"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default StoryGeneratorView;
