import React from 'react';
import { useStore } from '../context/StoreContext';

export const Footer = () => {
  const { navigateTo, setActiveCategory } = useStore();

  const handleNav = (cat) => {
    setActiveCategory(cat);
    navigateTo('shop');
  };

  return (
    <footer className="relative bg-white border-t border-slate-200/80 pt-14 pb-12 text-slate-800 overflow-hidden">
      
      {/* Decorative soft pastel background elements */}
      <div className="absolute bottom-0 left-0 text-blue-500 opacity-5 pointer-events-none -translate-x-4 translate-y-4">
        <svg width="140" height="140" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="45" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 text-indigo-500 opacity-5 pointer-events-none translate-x-4 translate-y-4">
        <svg width="150" height="150" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="45" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-100">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <img 
                src="/story-in-logo.png" 
                alt="Story.in Official 3D Logo" 
                className="w-8 h-8 rounded-xl object-contain drop-shadow-md" 
              />
              <span className="text-2xl font-heading font-black tracking-tight text-slate-900">
                Story<span className="text-blue-600">.in</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium">
              Produk digital untuk membuat keseharian lebih mudah.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 hover:bg-pink-50 hover:text-pink-600 border border-slate-200/60 flex items-center justify-center text-slate-500 transition-colors shadow-2xs">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60 flex items-center justify-center text-slate-500 transition-colors shadow-2xs">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.33a6.33 6.33 0 0 0-6.6 6.33 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.51a8.28 8.28 0 0 0 4.18 1.18V6.69z"/>
                </svg>
              </a>
              <a href="https://telegram.org" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200/60 flex items-center justify-center text-slate-500 transition-colors shadow-2xs">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* 3 Navigation Columns (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-3 gap-6">
            
            {/* TOKO */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                TOKO
              </h4>
              <ul className="space-y-2 text-xs text-slate-500 font-medium">
                <li>
                  <button onClick={() => handleNav('all')} className="hover:text-blue-600 transition-colors">
                    Semua Produk
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('aset-premium')} className="hover:text-blue-600 transition-colors">
                    Aset Premium
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('produktifitas-ai')} className="hover:text-blue-600 transition-colors">
                    Produktifitas AI
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('worksheet')} className="hover:text-blue-600 transition-colors">
                    Worksheet
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('template-produktifitas')} className="hover:text-blue-600 transition-colors">
                    Template Produktifitas
                  </button>
                </li>
              </ul>
            </div>

            {/* BANTUAN */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                BANTUAN
              </h4>
              <ul className="space-y-2 text-xs text-slate-500 font-medium">
                <li>
                  <button onClick={() => navigateTo('download')} className="hover:text-blue-600 font-bold text-blue-600 transition-colors flex items-center gap-1">
                    <span>💻 Download Aplikasi Desktop</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('licenses')} className="hover:text-blue-600 transition-colors">
                    Aktivasi Lisensi
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('about')} className="hover:text-blue-600 transition-colors">
                    Tentang Story.in
                  </button>
                </li>
                <li className="cursor-pointer hover:text-blue-600">FAQ</li>
                <li className="cursor-pointer hover:text-blue-600">Hubungi Kami</li>
              </ul>
            </div>

            {/* IKUTI KAMI */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                IKUTI KAMI
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-500 font-medium">
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <span>TikTok</span>
                  </a>
                </li>
                <li>
                  <a href="https://telegram.org" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <span>Telegram</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© 2026 Story.in • All rights reserved</p>
          <div className="flex items-center gap-3">
            <span className="hover:text-slate-600 cursor-pointer">Syarat &amp; Ketentuan</span>
            <span>|</span>
            <span className="hover:text-slate-600 cursor-pointer">Kebijakan Privasi</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
