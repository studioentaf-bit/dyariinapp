import React, { useState } from 'react';
import { useStore, getProductAvailableStock } from '../context/StoreContext';
import { ShoppingBag, Star } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { openInstantCheckout, showToast } = useStore();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isExpandedDesc, setIsExpandedDesc] = useState(false);
  const rawDesc = (product.description || product.tagline || '').trim();
  const hasLongDesc = rawDesc.length > 80 || rawDesc.includes('\n');

  const pType = product.productType || (
    product.category === 'tools-ai' || product.type === 'LISENSI'
      ? 'LICENSE_TOOL'
      : (product.category === 'aplikasi' || product.type === 'AKSES PREMIUM' || /gemini|capcut|canva|netflix|chatgpt|youtube/i.test(product.name || '')
          ? 'APPS_PREMIUM'
          : 'DIGITAL_PREMIUM')
  );
  const availableStock = getProductAvailableStock(product);
  const isOutOfStock = availableStock <= 0;

  const handleCardClick = () => {
    if (isOutOfStock) {
      showToast('Stok Habis', `Mohon maaf, stok untuk produk "${product.name}" sedang habis.`);
      return;
    }
    openInstantCheckout(product, 'product');
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group cursor-pointer bg-white rounded-3xl border border-slate-200/80 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_30px_-6px_rgba(37,99,235,0.16)] hover:border-blue-300/80 flex flex-col relative"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-blue-50 animate-pulse flex items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-slate-200/60 flex items-center justify-center">
              <span className="text-slate-400 text-lg">📦</span>
            </div>
          </div>
        )}
        
        <img 
          src={
            product.image?.includes('res.cloudinary.com') && product.image?.includes('/upload/') && !product.image?.includes('/upload/f_auto')
              ? product.image.replace('/upload/', '/upload/f_auto,q_auto,w_600/')
              : product.image
          } 
          alt={product.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'} ${isOutOfStock ? 'grayscale-40 contrast-90' : ''}`}
        />

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />

        {/* Badge — Top Left */}
        {isOutOfStock ? (
          <span className="absolute top-3 left-3 z-10 text-[9.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md bg-rose-500 text-white flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>HABIS</span>
          </span>
        ) : product.badge ? (
          <span className={`absolute top-3 left-3 text-[9.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm ${product.badgeColor || 'bg-rose-500 text-white'}`}>
            {product.badge}
          </span>
        ) : null}

        {/* Category pill — Top Right */}
        <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200/60 shadow-2xs">
          {product.categoryName}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-2.5">
        <h3 className="font-heading font-black text-slate-900 text-sm sm:text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        <div className="space-y-1">
          <p className={`text-[11.5px] text-slate-500 leading-relaxed whitespace-pre-line ${isExpandedDesc ? '' : 'line-clamp-2'}`}>
            {rawDesc}
          </p>
          {hasLongDesc && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpandedDesc(!isExpandedDesc);
              }}
              className="text-[10.5px] font-bold text-blue-600 hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>{isExpandedDesc ? '▲ Tutup Deskripsi' : '▼ Selengkapnya...'}</span>
            </button>
          )}
        </div>

        {/* Rating row & Stock Indicator */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-1 text-xs">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="font-black text-slate-800">{product.rating}</span>
            <span className="text-slate-400 font-medium">({product.reviewsCount})</span>
          </div>

          {isOutOfStock ? (
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>Habis</span>
            </span>
          ) : pType === 'DIGITAL_PREMIUM' ? (
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>Akses Instan</span>
            </span>
          ) : pType === 'LICENSE_TOOL' ? (
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              <span>Lisensi Siap</span>
            </span>
          ) : (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{availableStock} Stok</span>
            </span>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="pt-2.5 mt-auto border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-heading font-black text-blue-600">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            {product.originalPrice && (
              <span className="text-[10.5px] text-slate-400 line-through">
                Rp {product.originalPrice.toLocaleString('id-ID')}
              </span>
            )}
          </div>

          {isOutOfStock ? (
            <button
              disabled
              onClick={(e) => e.stopPropagation()}
              className="px-3.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
            >
              Habis
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openInstantCheckout(product, 'product');
              }}
              className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white active:scale-95 transition-all flex items-center gap-1.5 shadow-[0_4px_12px_-2px_rgba(37,99,235,0.35)] cursor-pointer"
            >
              <ShoppingBag size={13} />
              <span>Beli Sekarang</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
