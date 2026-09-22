import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { testimonials } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ProductMockup } from '../components/ProductMockup';
import { 
  ArrowRight, 
  Zap, 
  Sparkles, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUp, 
  Check 
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
    reviews
  } = useStore();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const bundleProduct = products.find(p => p.id === 'cyberton-700-library') || products[0];

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 md:space-y-20 pb-12 overflow-hidden bg-[#FCFAF5]">
      
      {/* 01 — HERO SECTION */}
      <section className="relative pt-8 pb-12 md:pt-14 md:pb-16 overflow-hidden">
        {/* Decorative soft leaf vector illustrations */}
        <div className="absolute top-6 left-6 text-[#2E5545] opacity-20 pointer-events-none hidden sm:block">
          <svg width="60" height="60" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 10 C30 35, 20 65, 50 90 C80 65, 70 35, 50 10 Z" />
          </svg>
        </div>
        <div className="absolute top-12 right-12 text-[#2E5545] opacity-20 pointer-events-none hidden sm:block">
          <svg width="70" height="70" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 10 C30 35, 20 65, 50 90 C80 65, 70 35, 50 10 Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Hero Text */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#737873] block">
                PRODUK DIGITAL UNTUK KESEHARIANMU.
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-heading font-extrabold text-[#1C352D] leading-[1.14] tracking-tight">
                {storeSettings?.heroTitle || 'Bikin keseharianmu jadi lebih mudah.'}
              </h1>

              <p className="text-sm sm:text-base text-[#6E736E] max-w-lg leading-relaxed">
                {storeSettings?.heroSubtitle || 'Template, tools, prompt & berbagai resource digital yang dirancang untuk membantu kamu mengatur, berkarya, dan berkembang.'}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button 
                  onClick={() => { setActiveCategory('all'); navigateTo('shop'); }}
                  className="bg-[#EE7C6B] hover:bg-[#E26A59] text-white font-heading font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95"
                >
                  <span>Jelajahi Produk</span>
                  <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => { setActiveCategory('bundel'); navigateTo('shop'); }}
                  className="border border-[#D1DDD3] bg-transparent hover:bg-white text-[#1C352D] font-heading font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 shadow-2xs active:scale-95"
                >
                  <span>Lihat Bundel</span>
                </button>
              </div>
            </div>

            {/* Right Hero Visual: Floating product image cards (CyberTon-style) */}
            <div className="lg:col-span-6 relative flex justify-center items-center py-4">
              {/* Soft organic backdrop blob */}
              <div className="absolute inset-0 bg-[#E8F1EA] rounded-full filter blur-2xl opacity-70 transform scale-95 pointer-events-none"></div>

              <div className="relative w-full max-w-md h-[340px] sm:h-[380px] flex items-center justify-center">
                
                {/* Card 1: Produk 1 (Top Left, tilted -6deg) */}
                {products[0] && (
                  <div 
                    onClick={() => navigateTo('product-detail', products[0].id)}
                    className="absolute top-2 left-4 sm:left-8 w-44 sm:w-52 bg-white rounded-2xl shadow-xl border border-[#D5E3D8] transform -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer z-10 overflow-hidden"
                  >
                    <img src={products[0].image} alt={products[0].name} className="w-full h-28 sm:h-32 object-cover" />
                    <div className="p-2.5">
                      <p className="font-heading font-bold text-xs sm:text-sm text-[#1C352D] leading-tight truncate">{products[0].name}</p>
                      <p className="text-[9px] text-[#737873] mt-0.5">{products[0].categoryName || 'Aset Premium'}</p>
                    </div>
                  </div>
                )}

                {/* Card 2: Produk 2 (Top Right, tilted +6deg) */}
                {products[1] && (
                  <div 
                    onClick={() => navigateTo('product-detail', products[1].id)}
                    className="absolute top-6 right-4 sm:right-8 w-44 sm:w-52 bg-white rounded-2xl shadow-xl border border-[#D5E3D8] transform rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer z-10 overflow-hidden"
                  >
                    <img src={products[1].image} alt={products[1].name} className="w-full h-28 sm:h-32 object-cover" />
                    <div className="p-2.5">
                      <p className="font-heading font-bold text-xs sm:text-sm text-[#1C352D] leading-tight truncate">{products[1].name}</p>
                      <p className="text-[9px] text-[#737873] mt-0.5">{products[1].categoryName || 'Produktifitas AI'}</p>
                    </div>
                  </div>
                )}

                {/* Card 3: Produk 3 (Bottom Center, in front) */}
                {products[3] && (
                  <div 
                    onClick={() => navigateTo('product-detail', products[3].id)}
                    className="absolute bottom-2 sm:bottom-4 w-40 sm:w-48 bg-white rounded-2xl shadow-2xl border border-[#FADAD1] transform hover:scale-105 transition-all duration-300 cursor-pointer z-20 overflow-hidden"
                  >
                    <img src={products[3].image} alt={products[3].name} className="w-full h-24 sm:h-28 object-cover" />
                    <div className="p-2.5">
                      <p className="font-heading font-bold text-xs sm:text-sm text-[#1C352D] leading-tight truncate">{products[3].name}</p>
                      <p className="text-[9px] text-[#EE7C6B] mt-0.5 font-medium">{products[3].categoryName || 'Template Produktifitas'}</p>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>



      {/* 02 — TEMUKAN YANG KAMU BUTUHKAN (CATEGORIES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1C352D]">
            Temukan yang kamu butuhkan.
          </h2>
          <button 
            onClick={() => { setActiveCategory('all'); navigateTo('shop'); }}
            className="text-xs font-semibold text-[#1C352D] hover:text-[#EE7C6B] flex items-center gap-1 transition-colors"
          >
            <span>Lihat Semua</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 6 Pastel Category Cards */}
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

      {/* 03 — PRODUK PILIHAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1C352D]">
              Produk Pilihan
            </h2>
            <p className="text-xs text-[#737873] mt-0.5">
              Dibuat untuk keseharianmu.
            </p>
          </div>
          <button 
            onClick={() => { setActiveCategory('all'); navigateTo('shop'); }}
            className="text-xs font-semibold text-[#1C352D] hover:text-[#EE7C6B] flex items-center gap-1 transition-colors"
          >
            <span>Lihat Semua Produk</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Product Cards Grid (CyberTon style 2-col mobile, 4-col desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 04 — KENAPA DYARI? (Wide rounded card with 3 columns) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#E4ECE6] rounded-3xl p-6 sm:p-8 border border-[#D2DFD5]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Header with Leaf Icon */}
            <div className="lg:col-span-4 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#D1E2D6] flex items-center justify-center text-xl shrink-0 text-[#1C352D]">
                🌿
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1C352D]">
                  Kenapa dyari?
                </h3>
                <p className="text-xs text-[#526357] leading-relaxed">
                  Produk digital sederhana,<br />dibuat untuk kehidupan nyata.
                </p>
              </div>
            </div>

            {/* 3 Pillars with Circular Badges */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Pilar 1: Akses Instan */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#D1E2D6] text-[#1C352D] flex items-center justify-center shrink-0">
                  <Zap size={18} className="fill-[#1C352D]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#1C352D]">Akses Instan</h4>
                  <p className="text-[11px] text-[#55665A] mt-0.5 leading-snug">
                    Produk langsung tersedia setelah pembayaran.
                  </p>
                </div>
              </div>

              {/* Pilar 2: Mudah Digunakan */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#D1E2D6] text-[#1C352D] flex items-center justify-center shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#1C352D]">Mudah Digunakan</h4>
                  <p className="text-[11px] text-[#55665A] mt-0.5 leading-snug">
                    Tanpa setup yang ribet.
                  </p>
                </div>
              </div>

              {/* Pilar 3: Pilihan Terpilih */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#D1E2D6] text-[#1C352D] flex items-center justify-center shrink-0">
                  <Heart size={18} className="fill-[#1C352D]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#1C352D]">Pilihan Terpilih</h4>
                  <p className="text-[11px] text-[#55665A] mt-0.5 leading-snug">
                    Produk yang benar-benar berguna untuk membantu masalah nyata.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 05 — BAGIAN BUNDEL (Productivity Starter Pack) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FDF0EC] rounded-3xl p-6 sm:p-10 border border-[#F5DDD6]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-5 space-y-3.5">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-white bg-[#EE7C6B] px-3 py-0.5 rounded-full">
                BUNDEL
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#1C352D] leading-tight">
                Lebih lengkap,<br />lebih hemat.
              </h2>
              <p className="text-xs sm:text-sm text-[#6E736E] max-w-sm leading-relaxed">
                Paket pilihan untuk membantu kamu lebih produktif dan terorganisir.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => { setActiveCategory('bundel'); navigateTo('shop'); }}
                  className="bg-[#EE7C6B] hover:bg-[#E26A59] text-white font-heading font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
                >
                  <span>Lihat Semua Bundel</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right Card: Bundle Product Details + Visual Mockups */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-[#F2D7D0] shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              
              {/* Checklist & Price */}
              <div className="sm:col-span-6 space-y-3">
                <h3 className="font-heading font-bold text-base text-[#1C352D]">
                  {bundleProduct?.name || 'Paket Bundel Spesial'}
                </h3>

                <ul className="space-y-1.5 text-xs text-[#2E473C]">
                  {(bundleProduct?.features?.slice(0, 4) || [
                    '700+ File Produk Digital Lengkap',
                    'Format PLR Bebas Dijual Kembali',
                    'Folder Google Drive Terstruktur',
                    'Akses Cloud Selamanya'
                  ]).map((item, i) => (
                    <li key={i} className="flex items-center gap-1.5 font-medium">
                      <span className="text-[#3E865D] font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    {bundleProduct?.originalPrice && (
                      <span className="text-xs text-[#9CA3AF] line-through">
                        Rp {bundleProduct.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                    <span className="font-heading font-extrabold text-xl text-[#1C352D]">
                      Rp {(bundleProduct?.price || 89000).toLocaleString('id-ID')}
                    </span>
                    {bundleProduct?.originalPrice && bundleProduct.originalPrice > bundleProduct.price && (
                      <span className="text-[10px] font-bold text-white bg-[#EE7C6B] px-1.5 py-0.5 rounded">
                        -{Math.round((1 - bundleProduct.price / bundleProduct.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (bundleProduct) {
                        addToCart(bundleProduct);
                        navigateTo('checkout');
                      }
                    }}
                    className="mt-3 w-full bg-[#EE7C6B] hover:bg-[#E26A59] text-white font-heading font-semibold text-xs py-2.5 rounded-full transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                  >
                    <span>Ambil Bundelnya</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Product Image */}
              <div className="sm:col-span-6 relative flex items-center justify-center p-2">
                <div className="relative w-full max-w-[220px] rounded-2xl overflow-hidden shadow-md border border-[#F2D7D0]">
                  <div className="absolute -top-0 -right-0 z-20 text-[10px] font-serif italic text-[#EE7C6B] bg-[#FFF3F0] px-2.5 py-1 rounded-bl-xl border-b border-l border-[#FADAD1]">
                    Akses Sekali Bayar!
                  </div>
                  <img 
                    src={bundleProduct?.image} 
                    alt={bundleProduct?.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="bg-white p-3 space-y-1">
                    <p className="font-heading font-bold text-sm text-[#1C352D] truncate">{bundleProduct?.name}</p>
                    <p className="text-[10px] text-[#737873] truncate">{bundleProduct?.tagline || 'Koleksi aset terlengkap'}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 06 — CERITA MEREKA TENTANG DYARI. (3 Testimonial Cards in a Row) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1C352D]">
            Cerita mereka tentang dyari.
          </h2>
          <button 
            onClick={() => { setActiveCategory('all'); navigateTo('shop'); }}
            className="text-xs font-semibold text-[#1C352D] hover:text-[#EE7C6B] flex items-center gap-1 transition-colors"
          >
            <span>Lihat Semua Testimoni</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {(reviews || testimonials).slice(0, 3).map((testi) => (
              <div 
                key={testi.id}
                className="bg-white rounded-2xl border border-[#E5EAE4] p-5 shadow-2xs space-y-3.5 flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <img 
                    src={testi.avatar} 
                    alt={testi.author} 
                    className="w-10 h-10 rounded-full object-cover border border-[#E5EAE4]"
                  />
                  <p className="text-xs text-[#525954] italic leading-relaxed">
                    "{testi.quote}"
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F0F4F1] flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-[#1C352D]">
                    {testi.author}
                  </span>
                  <div className="flex text-[#F59E0B] text-xs">
                    {'★'.repeat(testi.stars)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Left/Right nav buttons matching mockup */}
          <button 
            onClick={() => showToast('Testimoni', 'Menampilkan testimoni lainnya.')}
            className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-[#DDE3DC] shadow-sm items-center justify-center text-[#1C352D] hover:bg-[#F0F4F1]"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={() => showToast('Testimoni', 'Menampilkan testimoni lainnya.')}
            className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-[#DDE3DC] shadow-sm items-center justify-center text-[#1C352D] hover:bg-[#F0F4F1]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* 07 — NEWSLETTER (Dark Forest Green Pill Container) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C352D] text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl shrink-0">
              🌿
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
                Jangan ketinggalan.
              </h3>
              <p className="text-xs text-white/70 mt-0.5">
                Produk baru, resource bermanfaat, dan sesekali ada freebies buat kamu.
              </p>
            </div>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 bg-white rounded-full p-1 max-w-md w-full">
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Masukkan email kamu"
              className="flex-1 bg-transparent px-4 py-2 text-xs text-[#1C352D] placeholder:text-[#9CA3AF] focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#EE7C6B] hover:bg-[#E26A59] text-white font-heading font-bold text-xs px-5 py-2.5 rounded-full transition-all active:scale-95 shrink-0"
            >
              Berlangganan
            </button>
          </form>
        </div>
      </section>

      {/* Back to top floating button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-[#1C352D] text-white shadow-md flex items-center justify-center hover:bg-[#2A4C40] transition-colors"
          title="Kembali ke atas"
        >
          <ArrowUp size={18} />
        </button>
      </div>

    </div>
  );
};
