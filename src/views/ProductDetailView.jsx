import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ChevronRight, 
  ChevronDown, 
  Star, 
  Check, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Clock, 
  FileText, 
  ArrowLeft,
  ExternalLink 
} from 'lucide-react';

export const ProductDetailView = () => {
  const { 
    products, 
    selectedProductId, 
    navigateTo, 
    addToCart, 
    setActiveCategory 
  } = useStore();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState(0);
  const [addingState, setAddingState] = useState(false);

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  // Ketersediaan Stok
  const hasAccountStock = Array.isArray(product.accountStock);
  const availableStock = hasAccountStock 
    ? product.accountStock.filter(s => !s.isSold).length 
    : (product.stockCount !== undefined ? product.stockCount : 100);
  const isOutOfStock = (hasAccountStock && availableStock <= 0) || (product.stockCount !== undefined && product.stockCount <= 0);

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast('Stok Habis', `Mohon maaf, stok untuk produk "${product.name}" sedang habis.`);
      return;
    }
    setAddingState(true);
    setTimeout(() => {
      addToCart(product);
      setAddingState(false);
    }, 400);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      showToast('Stok Habis', `Mohon maaf, stok untuk produk "${product.name}" sedang habis.`);
      return;
    }
    addToCart(product);
    navigateTo('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Top Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs sm:text-sm text-warmgray">
        <button 
          onClick={() => navigateTo('home')} 
          className="hover:text-forest transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={14} />
          <span>Beranda</span>
        </button>
        <ChevronRight size={14} />
        <button 
          onClick={() => {
            setActiveCategory(product.category);
            navigateTo('shop');
          }} 
          className="hover:text-forest transition-colors"
        >
          {product.categoryName}
        </button>
        <ChevronRight size={14} />
        <span className="font-semibold text-forest truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Hero / Purchase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        
        {/* Left Column: Gallery / Carousel Screenshot Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[16/10] w-full rounded-dyari-lg overflow-hidden bg-sage/40 border border-dyariborder shadow-soft relative group">
            <img 
              src={images[activeImageIdx]} 
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-matcha text-forest text-xs font-black px-3 py-1.5 rounded-full shadow-sm">
                {product.badge}
              </span>
            )}
            <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-forest text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              {product.type}
            </span>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-16 rounded-dyari-sm overflow-hidden border-2 transition-all ${
                    activeImageIdx === idx 
                      ? 'border-forest ring-2 ring-forest/20 scale-105' 
                      : 'border-dyariborder opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Isi Produk Checklist */}
          <div className="bg-white rounded-dyari-lg border border-dyariborder p-6 sm:p-8 shadow-card space-y-4 mt-6">
            <h3 className="font-heading font-bold text-lg text-forest flex items-center gap-2">
              <FileText size={18} className="text-forest" />
              <span>Yang Kamu Dapatkan di Dalam Produk Ini:</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {product.features?.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-forest bg-cream/60 p-3 rounded-dyari-sm border border-dyariborder/60">
                  <div className="w-5 h-5 rounded-full bg-matcha text-forest flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span className="font-medium leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Purchase Call to Action */}
        <div className="lg:col-span-5 bg-white rounded-dyari-lg border border-dyariborder p-6 sm:p-8 shadow-card space-y-6 sticky top-28">
          
          <div className="space-y-2">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-warmgray bg-sage px-2.5 py-1 rounded-full">
              Produk Digital
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-forest">
              {product.name}
            </h1>
            <p className="text-warmgray text-sm leading-relaxed">
              {product.tagline}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 text-sm border-y border-dyariborder py-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400" />
              ))}
            </div>
            <span className="font-bold text-forest">{product.rating}</span>
            <span className="text-warmgray">({product.reviewsCount} ulasan)</span>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-heading font-black text-forest">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
              {product.originalPrice && (
                <span className="text-base text-warmgray line-through">
                  Rp {product.originalPrice.toLocaleString('id-ID')}
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-700 font-medium">
              Sekali bayar, dapat digunakan seterusnya tanpa biaya langganan tersembunyi.
            </p>
          </div>

          {/* Keterangan Jumlah Stok Produk */}
          {isOutOfStock ? (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="font-heading font-extrabold text-xs sm:text-sm text-rose-800">
                  Status Ketersediaan: STOK HABIS
                </span>
              </div>
              <span className="text-[11px] font-bold text-rose-700 bg-white border border-rose-200 px-2.5 py-0.5 rounded-lg shadow-2xs">
                0 Stok Ready
              </span>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-heading font-extrabold text-xs sm:text-sm text-emerald-900">
                  Status Ketersediaan: STOK TERSEDIA
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-800 bg-white border border-emerald-200 px-2.5 py-0.5 rounded-lg shadow-2xs">
                {hasAccountStock ? `${availableStock} Stok Ready` : 'Tersedia Lengkap'}
              </span>
            </div>
          )}

          {/* Guarantee Perks List */}
          <div className="space-y-2.5 bg-cream/70 p-4 rounded-dyari-sm border border-dyariborder/70 text-xs sm:text-sm font-medium text-forest">
            {product.perks?.map((perk, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Check size={16} className="text-forest stroke-[2.5]" />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-2">
            {isOutOfStock ? (
              <>
                <button
                  disabled
                  className="w-full bg-gray-200 text-gray-500 font-heading font-bold py-4 px-6 rounded-dyari-sm cursor-not-allowed flex items-center justify-center gap-2 text-base shadow-none select-none"
                >
                  <Zap size={18} className="fill-gray-400 text-gray-400" />
                  <span>STOK HABIS (TIDAK DAPAT DIBELI)</span>
                </button>

                <button
                  disabled
                  className="w-full border-2 border-gray-200 bg-gray-100 text-gray-400 font-heading font-bold py-3.5 px-6 rounded-dyari-sm cursor-not-allowed flex items-center justify-center gap-2 text-sm select-none"
                >
                  <ShoppingBag size={18} />
                  <span>TIDAK BISA DITAMBAHKAN KE KERANJANG</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-coral hover:bg-coral-hover text-forest font-heading font-bold py-4 px-6 rounded-dyari-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 text-base cursor-pointer"
                >
                  <Zap size={18} className="fill-forest" />
                  <span>BELI SEKARANG</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={addingState}
                  className="w-full border-2 border-forest bg-white hover:bg-sage text-forest font-heading font-bold py-3.5 px-6 rounded-dyari-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 text-sm cursor-pointer"
                >
                  <ShoppingBag size={18} />
                  <span>{addingState ? 'MENAMBAHKAN...' : 'TAMBAH KE KERANJANG'}</span>
                </button>
              </>
            )}
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 text-xs text-warmgray pt-2">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-forest" />
              100% Aman QRIS & Transfer
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} className="text-forest" />
              Unduh Detik Ini Juga
            </span>
          </div>

        </div>

      </div>

      {/* Cara Kerja Section (Spec #11) */}
      <section className="bg-cream rounded-dyari-lg p-8 sm:p-12 border border-dyariborder space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-warmgray">LANGKAH MUDAH</span>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-forest">
            Cara Kerja
          </h2>
          <p className="text-warmgray text-sm">
            Proses otomatis & praktis dari pembelian hingga produk siap kamu nikmati.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Beli Produk', desc: 'Pilih produk digital atau bundel yang kamu butuhkan.' },
            { step: '02', title: 'Lakukan Pembayaran', desc: 'Bayar instan melalui QRIS, E-Wallet, atau Transfer Bank.' },
            { step: '03', title: 'Dapatkan Akses', desc: 'Sistem langsung membuka file dan lisensi akunmu secara otomatis.' },
            { step: '04', title: 'Mulai Gunakan', desc: 'Gunakan template atau aplikasimu untuk rutinitas yang lebih teratur.' },
          ].map((s, idx) => (
            <div key={idx} className="bg-white p-6 rounded-dyari border border-dyariborder shadow-xs space-y-2 relative">
              <span className="text-3xl font-heading font-extrabold text-matcha-dark/70">
                {s.step}
              </span>
              <h4 className="font-heading font-bold text-forest text-base">
                {s.title}
              </h4>
              <p className="text-xs text-warmgray leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section (Spec #11) */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="max-w-3xl mx-auto space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-forest">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-warmgray text-sm">
              Semua hal yang perlu kamu ketahui sebelum membeli.
            </p>
          </div>

          <div className="space-y-3">
            {product.faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-dyari-sm border border-dyariborder overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-heading font-bold text-forest text-sm sm:text-base hover:bg-cream/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown 
                      size={18} 
                      className={`text-warmgray transition-transform duration-200 ${isOpen ? 'transform rotate-180 text-forest' : ''}`} 
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-warmgray leading-relaxed border-t border-dyariborder/40 bg-cream/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
};
