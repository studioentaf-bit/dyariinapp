import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export const StoryGeneratorView = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className="w-full relative overflow-hidden bg-[#F8F7F4]"
      style={{
        height: 'calc(100vh - 5rem)',
        width: '100%',
        position: 'relative',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
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
        src="/story-generator/index.html"
        title="Story Generator AI Studio"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '100%',
          border: 'none',
          display: 'block'
        }}
        allow="clipboard-read; clipboard-write; microphone; camera; fullscreen"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default StoryGeneratorView;
