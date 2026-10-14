import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { testimonials } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { 
  ArrowRight, 
  Zap, 
  Sparkles, 
  Heart, 
  KeyRound, 
  Clapperboard, 
  CheckCircle2, 
  Volume2, 
  Video, 
  Layers, 
  ShieldCheck,
  Star,
  Download
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
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const bundleProduct = products.find(p => p.id.includes('super-bundling') || p.id === 'cyberton-700-library') || products[0];

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    navigateTo('shop');
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      showToast('Berhasil Berlangganan', 'Email kamu sudah terdaftar di newsletter dyari.in!');
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-16 overflow-hidden bg-[#FCFAF5]">
      
      {/* 01 — HERO SECTION */}
      <section className="relative pt-8 pb-12 md:pt-14 md:pb-16 overflow-hidden">
        {/* Soft decorative background accents */}
        <div className="absolute top-10 left-10 text-[#2E5545] opacity-15 pointer-events-none hidden sm:block">
          <svg width="70" height="70" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 10 C30 35, 20 65, 50 90 C80 65, 70 35, 50 10 Z" />
          </svg>
        </div>
        <div className="absolute top-16 right-16 text-[#EE7C6B] opacity-15 pointer-events-none hidden sm:block">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8F2EA] border border-[#C5DCCB] text-[#1E3D2F] text-xs font-bold shadow-2xs">
                <Sparkles size={13} className="text-[#4E8A5C]" />
                <span>Ekosistem Produk Digital & AI Generatif Kreator</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-heading font-black text-[#1C352D] leading-[1.14] tracking-tight">
                {storeSettings?.heroTitle || 'Bikin Keseharian & Karya Kreatifmu Lebih Cepat dan Mudah.'}
              </h1>

              <p className="text-sm sm:text-base text-[#6E736E] max-w-xl leading-relaxed">
                {storeSettings?.heroSubtitle || 'Koleksi template produktivitas terstruktur, sistem spreadsheet pintar, dan studio Story Generator AI sinematik—semua dirancang untuk membantu Anda bekerja lebih cerdas dan berkembang pesat.'}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => { setActiveCategory('all'); navigateTo('shop'); }}
                  className="bg-[#EE7C6B] hover:bg-[#E26A59] text-white font-heading font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                >
                  <span>Jelajahi Shop</span>
                  <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => navigateTo('story-generator')}
                  className="bg-[#1E3D2F] hover:bg-[#162F24] text-white font-heading font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Sparkles size={16} className="text-[#A3E6B5]" />
                  <span>Story Generator AI</span>
                </button>
                <button 
                  onClick={() => navigateTo('download')}
                  className="bg-[#1C352D] hover:bg-[#28493E] text-white font-heading font-bold text-xs sm:text-sm px-5 py-3.5 rounded-full transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Download size={15} className="text-[#4E8A5C]" />
                  <span>Download App (v{(appVersionInfo?.version && appVersionInfo.version !== '0.0.1' && appVersionInfo.version !== '0.0.2') ? appVersionInfo.version : '0.0.3'})</span>
                </button>
                <button 
                  onClick={() => navigateTo('licenses')}
                  className="border border-[#D1DDD3] bg-white hover:bg-[#F0EEE6] text-[#1C352D] font-heading font-bold text-xs sm:text-sm px-5 py-3.5 rounded-full transition-all duration-200 shadow-2xs active:scale-95 cursor-pointer"
                >
                  <KeyRound size={15} className="inline mr-1.5 text-[#4E8A5C]" />
                  <span>Lisensi Tools</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex items-center gap-6 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-[#4E8A5C]" />
                  <span>Akses Instan & Aman</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-[#4E8A5C]" />
                  <span>Lisensi Komersial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-[#4E8A5C]" />
                  <span>Privasi Lokal Browser</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div className="lg:col-span-5 relative flex justify-center items-center py-4">
              <div className="absolute inset-0 bg-[#E8F1EA] rounded-full filter blur-2xl opacity-70 transform scale-95 pointer-events-none"></div>

              <div className="relative w-full max-w-md h-[360px] sm:h-[400px] flex items-center justify-center">
                
                {/* Card 1: Story Generator Spotlight Card */}
                <div 
                  onClick={() => navigateTo('story-generator')}
                  className="absolute top-2 left-2 sm:left-4 w-48 sm:w-56 bg-[#1E3D2F] text-white rounded-3xl p-4 shadow-2xl border border-[#2D5A45] transform -rotate-4 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer z-20 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#A3E6B5] text-[9px] font-bold">
                      Studio AI Terintegrasi
                    </span>
                    <Sparkles size={14} className="text-[#A3E6B5]" />
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-xs sm:text-sm text-white">Story Generator AI</h4>
                    <p className="text-[10px] text-gray-300 mt-0.5">Storyboard, Prompt Studio & Voice Over TTS</p>
                  </div>
                  <div className="p-2 rounded-xl bg-black/30 border border-white/10 text-[9px] font-mono text-[#A3E6B5]">
                    {'>'} Auto Hook & Narasi 8K
                  </div>
                </div>

                {/* Card 2: Produk Template Card */}
                {products[0] && (
                  <div 
                    onClick={() => navigateTo('product-detail', products[0].id)}
                    className="absolute bottom-4 right-2 sm:right-4 w-48 sm:w-56 bg-white rounded-3xl shadow-xl border border-[#D5E3D8] transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer z-10 overflow-hidden"
                  >
                    <img src={products[0].image} alt={products[0].name} className="w-full h-28 object-cover" />
                    <div className="p-3">
                      <p className="font-heading font-bold text-xs text-[#1C352D] leading-tight truncate">{products[0].name}</p>
                      <p className="text-[10px] text-[#EE7C6B] font-bold mt-1">
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
        <div className="bg-[#1E3D2F] text-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl border border-[#2D5A45] relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#4E8A5C]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#A3E6B5] text-xs font-bold">
                <Clapperboard size={13} />
                <span>Produksi Konten Sinematik</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black tracking-tight text-white leading-tight">
                Story Generator: Dari Konsep Menjadi Visual & Audio Siap Eksekusi
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl">
                Tidak perlu pusing memikirkan ide video iklan, plot drama, atau caption media sosial. 
                Story Generator merancang storyboard adegan, formula prompt Imagen 3 / Veo berstandar studio, 
                hingga sulih suara neural MP3 langsung di browser Anda.
              </p>

              {/* 4 Feature Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <Clapperboard size={18} className="text-[#A3E6B5] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">5 Mode Storyboard</h5>
                    <p className="text-[10px] text-gray-300">Komersial, Drama, Animasi, Edukasi, Dokumenter</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <Sparkles size={18} className="text-[#A3E6B5] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Prompt Studio 8K</h5>
                    <p className="text-[10px] text-gray-300">Foto, Thumbnail, Infografis, UGC & Karakter</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <Volume2 size={18} className="text-[#A3E6B5] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Neural Voice Over</h5>
                    <p className="text-[10px] text-gray-300">Suara natural Bahasa Indonesia & Inggris (MP3)</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <Video size={18} className="text-[#A3E6B5] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Video Tools Merger</h5>
                    <p className="text-[10px] text-gray-300">Jahit multi-klip langsung di browser tanpa upload</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigateTo('story-generator')}
                  className="px-6 py-3 rounded-2xl bg-[#EE7C6B] hover:bg-[#E26A59] text-white font-heading font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
                >
                  <Sparkles size={16} />
                  <span>Buka Story Generator</span>
                </button>
                <button
                  onClick={() => navigateTo('licenses')}
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound size={15} />
                  <span>Beli Lisensi Akses</span>
                </button>
              </div>
            </div>

            {/* Right Interactive Card */}
            <div className="lg:col-span-5 bg-[#162F24] rounded-2xl p-6 border border-[#2D5A45] space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-[#A3E6B5]">Preview Output AI</span>
                <span className="text-[10px] text-gray-400 font-mono">DYARI-ENGINE v3.8</span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-black/40 text-gray-200">
                  <span className="text-amber-400 font-bold block mb-1">🎬 Scene 01: Hook 3s</span>
                  "Extreme close-up shot of hands cracking an egg, cinematic morning light, 8k..."
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 text-gray-200">
                  <span className="text-teal-400 font-bold block mb-1">🗣 Voice Over TTS</span>
                  "Capek mikirin konten setiap hari? Sekarang bikin iklan cuma butuh 1 klik..."
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between text-[11px] text-gray-300">
                <span>🔑 Akses Lisensi: Aktif</span>
                <span className="text-emerald-400 font-bold">Siap Dipakai</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — 4 PILAR YANG DITAWARKAN DYARI.IN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#1C352D]">
            Apa yang Ditawarkan dyari.in untuk Anda?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Kombinasi produk digital siap pakai dan generative tools yang dirancang untuk kebutuhan nyata.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E6E3DA] shadow-xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F2EA] text-[#1E3D2F] flex items-center justify-center">
              <Clapperboard size={20} className="text-[#4E8A5C]" />
            </div>
            <h4 className="font-heading font-bold text-sm text-[#191C1A]">AI Story Generator</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Otomasi konsep video, visual prompt, naskah drama, dan suara neural dalam hitungan detik.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E6E3DA] shadow-xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FDF0EC] text-[#EE7C6B] flex items-center justify-center">
              <Layers size={20} />
            </div>
            <h4 className="font-heading font-bold text-sm text-[#191C1A]">Template Produktivitas</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Template Notion, Google Sheets keuangan, planner harian, dan habit tracker yang minimalis & fungsional.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E6E3DA] shadow-xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F2EA] text-[#1E3D2F] flex items-center justify-center">
              <KeyRound size={20} className="text-[#4E8A5C]" />
            </div>
            <h4 className="font-heading font-bold text-sm text-[#191C1A]">Lisensi Jelas & Hemat</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Beli sekali atau langganan hemat tanpa biaya server tersembunyi. Bebas digunakan untuk komersial.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E6E3DA] shadow-xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F0EEE6] text-[#1E3D2F] flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-heading font-bold text-sm text-[#191C1A]">Privasi & Penyimpanan Lokal</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Hasil generate dan API Key tersimpan aman di browser Anda tanpa dipungut biaya per token.
            </p>
          </div>
        </div>
      </section>

      {/* 04 — TEMUKAN YANG KAMU BUTUHKAN (CATEGORIES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1C352D]">
              Kategori Produk Digital
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Pilih kategori aset sesuai kebutuhan alur kerja Anda.</p>
          </div>
          <button 
            onClick={() => { setActiveCategory('all'); navigateTo('shop'); }}
            className="text-xs font-semibold text-[#1C352D] hover:text-[#EE7C6B] flex items-center gap-1 transition-colors cursor-pointer"
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
              style={{ backgroundColor: cat.bgColor }}
              className="cursor-pointer rounded-2xl p-4 sm:p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col items-center justify-between border border-black/5"
            >
              <div className="text-2xl sm:text-3xl mb-3">
                {cat.icon}
              </div>
              <div>
                <h3 className="font-heading font-bold text-[#1C352D] text-sm sm:text-base leading-tight">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#555C56] mt-1 line-clamp-2 leading-snug">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 05 — PRODUK PILIHAN DI SHOP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1C352D]">
              Produk Terpopuler
            </h2>
            <p className="text-xs text-[#737873] mt-0.5">
              Pilihan favorit kreator dan pebisnis digital.
            </p>
          </div>
          <button 
            onClick={() => { setActiveCategory('all'); navigateTo('shop'); }}
            className="text-xs font-semibold text-[#1C352D] hover:text-[#EE7C6B] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Buka Semua di Shop</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 06 — BUNDLE HIGHLIGHT */}
      {bundleProduct && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FDF0EC] rounded-3xl p-6 sm:p-10 border border-[#F5DDD6]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-white bg-[#EE7C6B] px-3 py-1 rounded-full">
                  SUPER BUNDEL HEMAT
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#1C352D] leading-tight">
                  Satu Paket Lengkap untuk Seluruh Kebutuhan Digitalmu.
                </h2>
                <p className="text-xs sm:text-sm text-[#6E736E] leading-relaxed">
                  Dapatkan ratusan template, formula prompt, dan panduan komprehensif dalam satu paket sekali bayar dengan potongan harga istimewa.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      addToCart(bundleProduct);
                      navigateTo('checkout');
                    }}
                    className="bg-[#EE7C6B] hover:bg-[#E26A59] text-white font-heading font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all active:scale-95 shadow-sm cursor-pointer"
                  >
                    Beli Paket Bundel Sekarang
                  </button>
                  <button
                    onClick={() => { setActiveCategory('bundel'); navigateTo('shop'); }}
                    className="text-xs font-bold text-[#1C352D] hover:underline cursor-pointer"
                  >
                    Lihat Pilihan Bundel Lain →
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 flex justify-center">
                <img 
                  src={bundleProduct.image} 
                  alt={bundleProduct.name}
                  className="rounded-2xl max-h-64 object-cover shadow-lg border border-[#F5DDD6]"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 07 — TESTIMONI PENGGUNA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1C352D]">
            Cerita Mereka Tentang dyari.in
          </h2>
          <p className="text-xs text-gray-500">
            Dipercaya oleh ribuan kreator konten, desainer, dan pemilik bisnis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {(reviews || testimonials).slice(0, 3).map((testi) => (
            <div 
              key={testi.id}
              className="bg-white rounded-2xl border border-[#E5EAE4] p-5 shadow-2xs space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex text-[#F59E0B] text-xs">
                  {'★'.repeat(testi.stars || 5)}
                </div>
                <p className="text-xs text-[#525954] italic leading-relaxed">
                  "{testi.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0F4F1] flex items-center gap-3">
                <img 
                  src={testi.avatar} 
                  alt={testi.author} 
                  className="w-8 h-8 rounded-full object-cover border border-[#E5EAE4]"
                />
                <span className="font-heading font-bold text-xs text-[#1C352D]">
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
