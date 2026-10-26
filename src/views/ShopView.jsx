import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

export const ShopView = () => {
  const { products, isProductsLoading, categories, activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useStore();
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'newest' | 'price-low' | 'price-high'
  const [visibleCount, setVisibleCount] = useState(24);

  // Dynamic Filter Categories list from store
  const filterTabs = [
    { id: 'all', label: 'Semua' },
    ...(categories || []).map(cat => ({ id: cat.id, label: cat.name }))
  ];

  // Reset pagination to 24 when filter or search changes
  useEffect(() => {
    setVisibleCount(24);
  }, [activeCategory, searchQuery, sortBy]);

  // Filtering products
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'popular') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    if (sortBy === 'newest') return (b.badge === 'BARU' ? 1 : 0) - (a.badge === 'BARU' ? 1 : 0);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  // Limit displayed products to visibleCount for lightning-fast rendering
  const displayedProducts = sortedProducts.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-left space-y-2 border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-xs font-bold uppercase tracking-wider border border-sky-100">
          <Sparkles size={14} className="text-sky-500" />
          <span>Katalog Digital Story.in</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
          Jelajahi Semua Produk Digital.
        </h1>
        <p className="text-slate-500 text-sm sm:text-base">
          Temukan template cerdas, tools otomasi AI, paket prompt premium, dan workspace apps yang meningkatkan produktivitas Anda.
        </p>
      </div>

      {/* Filter, Search & Sort Bar */}
      <div className="space-y-4">
        
        {/* Top Controls: Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Cari produk di Story.in..."
              className="w-full bg-white rounded-2xl border border-slate-200 border-b-[3px] border-b-slate-300 py-3 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition"
            />
            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold transition"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs sm:text-sm">
            <span className="text-slate-500 font-bold flex items-center gap-1.5">
              <SlidersHorizontal size={14} />
              <span>Urutkan:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 border-b-[3px] border-b-slate-300 text-slate-800 font-bold rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-sky-400 cursor-pointer shadow-xs"
            >
              <option value="popular">Paling Populer</option>
              <option value="newest">Terbaru</option>
              <option value="price-low">Harga: Termurah</option>
              <option value="price-high">Harga: Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Category Pills 3D */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4.5 py-2.5 rounded-full text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-150 cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-slate-900 text-white border-b-[3px] border-slate-950 shadow-[0_6px_18px_rgba(15,23,42,0.35)] -translate-y-0.5'
                  : 'bg-white border border-slate-200 border-b-[3px] border-b-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs hover:-translate-y-0.5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Count & Active Status Badge */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Menampilkan <strong className="text-slate-900 font-extrabold">{sortedProducts.length}</strong> produk digital
          </span>
          {activeCategory !== 'all' && (
            <button 
              onClick={() => setActiveCategory('all')} 
              className="text-sky-600 hover:text-sky-700 font-bold hover:underline cursor-pointer"
            >
              Reset ke Semua Kategori
            </button>
          )}
        </div>

      </div>

      {/* Grid Produk: Desktop 4 kolom, Tablet 2 kolom, Mobile 2 kolom */}
      {isProductsLoading && products.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white rounded-3xl border border-slate-100 p-4 space-y-4 shadow-sm">
              <div className="w-full h-44 bg-slate-100 rounded-2xl"></div>
              <div className="h-4 bg-slate-100 rounded-lg w-3/4"></div>
              <div className="h-3 bg-slate-100 rounded-lg w-1/2"></div>
              <div className="h-9 bg-slate-100 rounded-xl mt-4"></div>
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 my-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-600 text-2xl shadow-inner">
            🔍
          </div>
          <h3 className="font-heading font-extrabold text-lg text-slate-900">Produk tidak ditemukan</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Tidak ada produk yang cocok dengan kriteria pencarian &ldquo;{searchQuery}&rdquo;. Coba kata kunci lain atau reset filter.
          </p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex cursor-pointer shadow-sm transition"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More Button if remaining products exist */}
          {visibleCount < sortedProducts.length && (
            <div className="text-center pt-8 pb-4 space-y-2">
              <button
                onClick={() => setVisibleCount((prev) => prev + 24)}
                className="btn-3d-dark px-8 py-3.5 mx-auto"
              >
                <span>Muat Lebih Banyak Produk</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono font-bold">
                  +{Math.min(24, sortedProducts.length - visibleCount)}
                </span>
              </button>
              <p className="text-xs text-slate-500">
                Menampilkan <span className="font-bold text-slate-900">{displayedProducts.length}</span> dari <span className="font-bold text-slate-900">{sortedProducts.length}</span> produk
              </p>
            </div>
          )}
        </>
      )}

    </div>
  );
};
