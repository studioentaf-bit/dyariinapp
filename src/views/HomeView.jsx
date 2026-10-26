import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { testimonials } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  Clapperboard, 
  CheckCircle2, 
  Volume2, 
  Video, 
  Layers, 
  ShieldCheck,
  Star,
  Download,
  Bot,
  Laptop,
  Check,
  Crown,
  Lock,
  Flame,
  Gift
} from 'lucide-react';

export const HomeView = () => {
  const { 
    products, 
    categories,
    navigateTo, 
    setActiveCategory, 
    addToCart, 
    showToast,
    storeSettings,
    reviews,
    appVersionInfo
  } = useStore();

  const bundleProduct = products.find(p => p.id.includes('super-bundling') || p.id === 'cyberton-700-library') || products[0];

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    navigateTo('shop');
  };

  const appVer = (appVersionInfo?.version && !['0.0.1', '0.0.2', '0.0.3', '0.0.4', '0.0.5', '0.0.6', '0.0.7', '0.0.8', '0.0.9', '0.0.10', '0.0.11', '0.0.12', '0.0.13', '0.0.14', '0.0.15', '0.0.16', '0.0.17', '0.0.18', '0.0.19', '0.0.20', '0.0.21', '0.0.22'].includes(appVersionInfo.version)) 
    ? appVersionInfo.version 
    : '0.0.23';

  return (
    <div className="space-y-16 md:space-y-24 pb-20 overflow-hidden bg-[#f8faff]">
      
      {/* 01 — HERO SECTION (3D PLAYFUL PASTEL BENTO) */}
      <section className="relative pt-6 pb-12 md:pt-12 md:pb-16 overflow-hidden">
        {/* Soft pastel ambient background blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-20 right-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-5 left-1/3 w-64 h-64 bg-pink-200/25 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-2xs">
                <Sparkles size={14} className="text-blue-600" />
                <span>Ekosistem Produk Digital &amp; AI Generator Kreator</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-heading font-black text-slate-900 leading-[1.12] tracking-tight">
                Bikin keseharianmu jadi{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  sedikit lebih mudah.
                </span> ✨
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed font-medium">
                Template, tools, prompt &amp; berbagai resource digital yang dirancang untuk membantu kamu mengatur, berkarya, dan berkembang.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => { setActiveCategory('all'); navigateTo('shop'); }}
                  className="btn-3d-coral text-xs sm:text-sm px-7 py-3.5"
                >
                  <span>Jelajahi Shop</span>
                  <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => navigateTo('story-generator')}
                  className="btn-3d-blue text-xs sm:text-sm px-6 py-3.5"
                >
                  <Sparkles size={16} className="text-blue-200" />
                  <span>Story Generator AI</span>
                </button>
                <button 
                  onClick={() => navigateTo('download')}
                  className="btn-3d-white text-xs sm:text-sm px-5 py-3.5"
                >
                  <Download size={15} className="text-blue-500" />
                  <span>Download App (v{appVer})</span>
                </button>
              </div>

              {/* 3 Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600 font-bold">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 shadow-2xs">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Akses Instan &amp; Aman</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/70 text-amber-800 shadow-2xs">
                  <Crown size={15} className="text-amber-500" />
                  <span>Lisensi Komersial</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200/70 text-purple-800 shadow-2xs">
                  <Lock size={15} className="text-purple-500" />
                  <span>Privasi Lokal Browser</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Cards (3D Playful Floating Composition) */}
            <div className="lg:col-span-5 relative flex justify-center items-center py-6">
              <div className="relative w-full max-w-md h-[380px] sm:h-[420px] flex items-center justify-center">
                
                {/* 3D Laptop Mockup Illustration Card */}
                <div className="w-72 sm:w-80 h-48 sm:h-56 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-4 shadow-[0_20px_50px_-10px_rgba(79,70,229,0.35)] border border-white/20 flex flex-col justify-between text-white relative z-10 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    </div>
                    <span className="text-[10px] font-mono bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Studio AI Ready</span>
                  </div>

                  <div className="text-center py-2">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner mb-2">
                      <Clapperboard size={24} className="text-white" />
                    </div>
                    <h5 className="font-heading font-black text-sm text-white">Story.in AI Studio</h5>
                    <p className="text-[11px] text-blue-100 mt-0.5">Automated Storyboard &amp; Video Prompts</p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10 font-bold">
                    <span>⚡ AI Generative 8K</span>
                    <span className="text-emerald-300">Online &amp; Aktif</span>
                  </div>
                </div>

                {/* Floating Bento Pill 1: Story Generator Spotlight (Top Right) */}
                <div 
                  onClick={() => navigateTo('story-generator')}
                  className="absolute top-0 right-0 sm:-right-2 bg-white rounded-2xl p-3.5 shadow-[0_12px_30px_-6px_rgba(0,0,0,0.12)] border border-slate-200/80 transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer z-20 space-y-1.5 w-48 sm:w-52"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-black border border-emerald-200/60">
                      Studio AI Terintegrasi
                    </span>
                    <Sparkles size={13} className="text-blue-500" />
                  </div>
                  <h4 className="font-heading font-black text-xs text-slate-900 leading-tight">Story Generator AI</h4>
                  <p className="text-[9.5px] text-slate-500 leading-snug">Storyboard, Prompt, Audio &amp; Voice Over TTS</p>
                  <div className="pt-1 flex items-center justify-between text-[10px] font-bold text-blue-600">
                    <span>Buka Sekarang</span>
                    <span>→</span>
                  </div>
                </div>

                {/* Floating Bento Pill 2: CapCut Pro / Product Card (Bottom Left) */}
                {products[0] && (
                  <div 
                    onClick={() => navigateTo('product-detail', products[0].id)}
                    className="absolute bottom-2 left-0 sm:-left-2 bg-white rounded-2xl shadow-[0_14px_35px_-8px_rgba(37,99,235,0.2)] border border-slate-200/80 transform -rotate-4 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer z-20 overflow-hidden w-48 sm:w-52"
                  >
                    <div className="relative h-20 w-full overflow-hidden bg-slate-100">
                      <img 
                        src={products[0].image} 
                        alt={products[0].name} 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[8px] font-black shadow-2xs">
                        HOT
                      </span>
                    </div>
                    <div className="p-2.5">
                      <p className="font-heading font-black text-xs text-slate-900 leading-tight truncate">{products[0].name}</p>
                      <p className="text-[11px] text-blue-600 font-black mt-0.5">
                        Rp {products[0].price?.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 02 — FEATURED SPOTLIGHT: STORY GENERATOR AI STUDIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_16px_40px_-10px_rgba(37,99,235,0.12)] border border-blue-100 relative overflow-hidden">
          {/* Subtle colored glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-bold shadow-2xs">
                <Clapperboard size={14} className="text-emerald-600" />
                <span>Produksi Konten Sinematik</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black tracking-tight text-slate-900 leading-tight">
                Story Generator: Dari Konsep Menjadi{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Visual &amp; Audio
                </span>{' '}
                Siap Eksekusi
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl font-medium">
                Tidak perlu pusing memikirkan ide video iklan, plot drama, atau caption media sosial. 
                Story Generator merancang storyboard adegan, formula prompt Imagen 3 / Veo berstandar studio, 
                hingga sulih suara natural MP3 langsung di browser Anda.
              </p>

              {/* 4 Feature Badges (2x2 Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                {/* 1: 5 Mode Storyboard */}
                <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/60 flex items-start gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Clapperboard size={16} />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900">5 Mode Storyboard</h5>
                    <p className="text-[10.5px] text-slate-500 leading-snug mt-0.5">Komersial, Drama, Animasi, Edukasi, Dokumenter</p>
                  </div>
                </div>

                {/* 2: Prompt Studio 8K */}
                <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/60 flex items-start gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900">Prompt Studio 8K</h5>
                    <p className="text-[10.5px] text-slate-500 leading-snug mt-0.5">Prompt terstruktur, hingga ribuan ide visual</p>
                  </div>
                </div>

                {/* 3: Neural Voice Over */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex items-start gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Volume2 size={16} />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900">Neural Voice Over</h5>
                    <p className="text-[10.5px] text-slate-500 leading-snug mt-0.5">Suara natural Bahasa Indonesia &amp; banyak (MP3)</p>
                  </div>
                </div>

                {/* 4: Video Tools Merger */}
                <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200/60 flex items-start gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Video size={16} />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900">Video Tools Merger</h5>
                    <p className="text-[10.5px] text-slate-500 leading-snug mt-0.5">Satukan hasil AI langsung di browser tanpa aplikasi</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigateTo('story-generator')}
                  className="btn-3d-blue text-xs sm:text-sm px-6 py-3"
                >
                  <Sparkles size={16} />
                  <span>Buka Story Generator →</span>
                </button>
                <button
                  onClick={() => navigateTo('licenses')}
                  className="btn-3d-white text-xs sm:text-sm px-5 py-3"
                >
                  <KeyRound size={15} className="text-blue-600" />
                  <span>Beli Lisensi Akses</span>
                </button>
              </div>
            </div>

            {/* Right Studio Card: Preview Output AI */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.5)] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-black text-blue-400">Preview Output AI</span>
                <span className="text-[10px] text-slate-400 font-mono font-bold">STORY-ENGINE V3.8</span>
              </div>
              <div className="space-y-2.5 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-200">
                  <span className="text-amber-400 font-black block mb-1">🎬 Scene 01 / Hook 3s</span>
                  "Extreme close-up shot of hands creating an eco-friendly morning habit, soft sunlight, 8k..."
                </div>
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-200">
                  <span className="text-teal-400 font-black block mb-1">🗣 Voice Over TTS</span>
                  "Dapat mikirin konten setiap hari? Sekarang bikin lebih mudah dengan Story.in..."
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>🔑 Akses Lisensi Aktif</span>
                <span className="text-emerald-400 font-black bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full border-b-[2px] border-b-emerald-700 shadow-xs">
                  Siap Dipakai
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — VALUE PROPOSITION: APA YANG DITAWARKAN STORY.IN UNTUK ANDA? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
            Apa yang Ditawarkan Story.in untuk Anda?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Kombinasi produk digital siap pakai dan generative tools yang dirancang untuk kebutuhan nyata.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 border-b-[4px] border-b-emerald-400 shadow-[0_12px_32px_-6px_rgba(16,185,129,0.18)] space-y-3 hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60 shadow-2xs">
                <Bot size={22} />
              </div>
              <Sparkles size={16} className="text-amber-400" />
            </div>
            <h4 className="font-heading font-black text-sm text-slate-900">AI Story Generator</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Otomasi konsep video, visual prompt, naskah drama, dan suara neural dalam hitungan detik.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 border-b-[4px] border-b-rose-400 shadow-[0_12px_32px_-6px_rgba(244,63,94,0.18)] space-y-3 hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-200/60 shadow-2xs">
                <Layers size={22} />
              </div>
              <Sparkles size={16} className="text-amber-400" />
            </div>
            <h4 className="font-heading font-black text-sm text-slate-900">Template Produktivitas</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Template Notion, Google Sheets keuangan, planner harian, dan habit tracker yang minimalis &amp; fungsional.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 border-b-[4px] border-b-purple-400 shadow-[0_12px_32px_-6px_rgba(147,51,234,0.18)] space-y-3 hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/60 shadow-2xs">
                <KeyRound size={22} />
              </div>
              <Sparkles size={16} className="text-amber-400" />
            </div>
            <h4 className="font-heading font-black text-sm text-slate-900">Lisensi Jelas &amp; Hemat</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Beli sekali atau langganan hemat tanpa biaya server tersembunyi. Bebas digunakan untuk komersial.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-3xl p-6 border border-blue-100 border-b-[4px] border-b-blue-400 shadow-[0_12px_32px_-6px_rgba(37,99,235,0.18)] space-y-3 hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-2xs">
                <ShieldCheck size={22} />
              </div>
              <Sparkles size={16} className="text-amber-400" />
            </div>
            <h4 className="font-heading font-black text-sm text-slate-900">Privasi &amp; Penyimpanan Lokal</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Hasil generate dan API Key tersimpan aman di browser Anda tanpa dipungut biaya per token.
            </p>
          </div>
        </div>
      </section>

      {/* 04 — KATEGORI PRODUK DIGITAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
              Kategori Produk Digital
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Pilih kategori sesuai kebutuhan alur kerja Anda.</p>
          </div>
          <button 
            onClick={() => { setActiveCategory('all'); navigateTo('shop'); }}
            className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Lihat Semua</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="cursor-pointer bg-white rounded-3xl p-5 text-center transition-all duration-200 hover:-translate-y-2 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_32px_-6px_rgba(37,99,235,0.2)] hover:border-blue-300 border border-slate-200/90 border-b-[4px] border-b-slate-200 flex flex-col items-center justify-between active:translate-y-0 active:border-b-[2px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-100 flex items-center justify-center text-2xl mb-3 shadow-inner">
                {cat.icon}
              </div>
              <div>
                <h3 className="font-heading font-black text-slate-900 text-sm leading-tight">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-snug font-medium">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 05 — PRODUK TERPOPULER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
              Produk Terpopuler
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Pilihan favorit kreator dan pebisnis digital.
            </p>
          </div>
          <button 
            onClick={() => { setActiveCategory('all'); navigateTo('shop'); }}
            className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Buka Semua di Shop</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 06 — SUPER BUNDLE PROMO BANNER */}
      {bundleProduct && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-rose-50 via-purple-50 to-blue-50 rounded-3xl p-6 sm:p-10 border border-rose-200/70 shadow-[0_16px_40px_-10px_rgba(244,63,94,0.12)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-block text-[10px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-rose-500 to-pink-500 px-3.5 py-1 rounded-full shadow-sm">
                  SUPER BUNDLE HEMAT
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-slate-900 leading-tight">
                  Satu Paket Lengkap untuk Seluruh{' '}
                  <span className="text-[#f43f5e]">Kebutuhan Digitalmu.</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Dapatkan ratusan template, formula prompt, dan panduan komprehensif dalam satu paket sekali bayar dengan potongan harga istimewa.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      addToCart(bundleProduct);
                      navigateTo('checkout');
                    }}
                    className="btn-3d-coral text-xs sm:text-sm px-7 py-3.5"
                  >
                    Beli Paket Bundel Sekarang →
                  </button>
                  <button
                    onClick={() => { setActiveCategory('bundel'); navigateTo('shop'); }}
                    className="btn-3d-white text-xs sm:text-sm px-6 py-3.5"
                  >
                    Lihat Pilihan Bundel Lain →
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group">
                  <img 
                    src={bundleProduct.image} 
                    alt={bundleProduct.name}
                    loading="lazy"
                    decoding="async"
                    className="rounded-3xl max-h-64 object-cover shadow-[0_12px_30px_-6px_rgba(0,0,0,0.18)] border border-white"
                  />
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-white flex items-center justify-center shadow-lg transform rotate-12">
                    <Gift size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 07 — TESTIMONI: CERITA MEREKA TENTANG STORY.IN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
            Cerita Mereka Tentang Story.in
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Dipercaya oleh ribuan kreator konten, desainer, dan pemilik bisnis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {(reviews || testimonials).slice(0, 3).map((testi) => (
            <div 
              key={testi.id}
              className="bg-white rounded-3xl border border-purple-100 border-b-[4px] border-b-purple-300 p-6 shadow-[0_12px_28px_-6px_rgba(147,51,234,0.12)] space-y-4 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex text-amber-400 text-sm gap-0.5">
                  {'★'.repeat(testi.stars || 5)}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed font-medium">
                  "{testi.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <img 
                  src={testi.avatar} 
                  alt={testi.author} 
                  loading="lazy"
                  decoding="async"
                  className="w-9 h-9 rounded-full object-cover border border-purple-200"
                />
                <span className="font-heading font-black text-xs text-slate-900">
                  {testi.author}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomeView;
