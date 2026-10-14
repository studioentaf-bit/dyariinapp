import React, { useState } from 'react';
import { useStore, getProductAvailableStock } from '../context/StoreContext';
import { ShoppingBag, Star, Check, ExternalLink } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { openInstantCheckout, showToast } = useStore();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isExpandedDesc, setIsExpandedDesc] = useState(false);
  const rawDesc = (product.description || product.tagline || '').trim();
  const hasLongDesc = rawDesc.length > 80 || rawDesc.includes('\n');

  // Ketersediaan Stok Sinkron & Valid dari Manajemen Stok (Default 0 / Habis jika belum diinput)
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
      className="group cursor-pointer bg-white rounded-2xl sm:rounded-3xl border border-[#E5E9E4] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-[#B8D8C0]/20 hover:border-[#B8D8C0]/50 flex flex-col relative"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4F8F5]">
        {/* Loading skeleton */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#E7F0E9] to-[#F4F8F5] animate-pulse flex items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-[#D5E3D8] flex items-center justify-center">
              <span className="text-[#8AAB97] text-lg">📦</span>
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

        {/* Gradient overlay at bottom for readability */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {/* Badge — Top Left (Prioritas Badge HABIS jika stok kosong) */}
        {isOutOfStock ? (
          <span className="absolute top-2.5 left-2.5 z-10 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md bg-rose-600 text-white flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>HABIS</span>
          </span>
        ) : product.badge ? (
          <span className={`absolute top-2.5 left-2.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm ${product.badgeColor || 'bg-[#F28574] text-white'}`}>
            {product.badge}
          </span>
        ) : null}

        {/* Category pill — Top Right */}
        <span className="absolute top-2.5 right-2.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm text-[#29463A] border border-white/40 shadow-sm">
          {product.categoryName}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between space-y-2">
        {/* Title */}
        <h3 className="font-heading font-bold text-[#1C352D] text-sm sm:text-base leading-snug group-hover:text-[#2E5545] transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        {/* Full / Expandable Description without cutoff */}
        <div className="space-y-1">
          <p className={`text-[11px] sm:text-xs text-[#737873] leading-relaxed whitespace-pre-line ${isExpandedDesc ? '' : 'line-clamp-2'}`}>
            {rawDesc}
          </p>
          {hasLongDesc && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpandedDesc(!isExpandedDesc);
              }}
              className="text-[10.5px] font-bold text-[#1E3D2F] hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>{isExpandedDesc ? '▲ Tutup Deskripsi' : '▼ Selengkapnya...'}</span>
            </button>
          )}
        </div>

        {/* Rating row & Stock Indicator */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-1 text-xs">
            <Star size={13} className="fill-[#F59E0B] text-[#F59E0B]" />
            <span className="font-bold text-[#1C352D]">{product.rating}</span>
            <span className="text-[#8A8F8A]">({product.reviewsCount})</span>
          </div>

          {/* Keterangan Jumlah Stok */}
          {isOutOfStock ? (
            <span className="text-[10px] sm:text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>Habis</span>
            </span>
          ) : (
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{availableStock} Stok</span>
            </span>
          )}
        </div>

        {/* Price & Cart Button */}
        <div className="pt-2 mt-auto border-t border-[#F0F4F1] flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-heading font-extrabold text-[#1C352D]">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-[#9CA3AF] line-through">
                Rp {product.originalPrice.toLocaleString('id-ID')}
              </span>
            )}
          </div>

          {/* Action Button: Beli Sekarang */}
          {isOutOfStock ? (
            <button
              disabled
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
              title="Stok Habis"
            >
              Habis
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openInstantCheckout(product, 'product');
              }}
              className="px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold bg-[#1C352D] text-white hover:bg-[#2A4D3E] active:scale-95 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Beli Produk Langsung"
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
