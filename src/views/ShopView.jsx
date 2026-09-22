import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

export const ShopView = () => {
  const { products, categories, activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useStore();
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'newest' | 'price-low' | 'price-high'

  // Dynamic Filter Categories list from store
  const filterTabs = [
    { id: 'all', label: 'Semua' },
    ...(categories || []).map(cat => ({ id: cat.id, label: cat.name }))
  ];

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-left space-y-2 border-b border-dyariborder pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-warmgray uppercase tracking-wider">
          <Sparkles size={14} className="text-forest" />
          <span>Katalog Digital dyari.in</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-forest">
          Jelajahi semua produk.
        </h1>
        <p className="text-warmgray text-sm sm:text-base">
          Temukan template, tools otomasi, paket prompt, dan aplikasi yang membuat harimu lebih teratur.
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
              placeholder="🔍 Cari produk..."
              className="w-full bg-white rounded-dyari-sm border border-dyariborder py-2.5 pl-10 pr-4 text-sm text-forest placeholder:text-warmgray focus:outline-none focus:border-forest shadow-xs"
            />
            <Search size={18} className="absolute left-3.5 top-3 text-warmgray" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-warmgray hover:text-forest"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs sm:text-sm">
            <span className="text-warmgray font-medium flex items-center gap-1.5">
              <SlidersHorizontal size={14} />
              <span>Urutkan:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-dyariborder text-forest font-semibold rounded-dyari-sm px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-forest cursor-pointer shadow-xs"
            >
              <option value="popular">Paling Populer</option>
              <option value="newest">Terbaru</option>
              <option value="price-low">Harga: Termurah</option>
              <option value="price-high">Harga: Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                activeCategory === tab.id
                  ? 'bg-forest text-white shadow-sm'
                  : 'bg-white border border-dyariborder text-warmgray hover:text-forest hover:border-forest/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Count & Active Status Badge (CyberTon style) */}
        <div className="flex items-center justify-between text-xs text-warmgray pt-1">
          <span>
            Menampilkan <strong className="text-forest font-bold">{sortedProducts.length}</strong> produk digital
          </span>
          {activeCategory !== 'all' && (
            <button 
              onClick={() => setActiveCategory('all')} 
              className="text-coral hover:underline font-semibold"
            >
              Reset ke Semua Kategori
            </button>
          )}
        </div>

      </div>

      {/* Grid Produk: Desktop 4 kolom, Tablet 2 kolom, Mobile 2 kolom (spec #10) */}
      {sortedProducts.length === 0 ? (
        <div className="bg-white rounded-dyari-lg border border-dyariborder p-12 text-center space-y-4 my-8">
          <div className="w-16 h-16 rounded-full bg-sage mx-auto flex items-center justify-center text-forest text-2xl">
            🔍
          </div>
          <h3 className="font-heading font-bold text-lg text-forest">Produk tidak ditemukan</h3>
          <p className="text-warmgray text-sm max-w-md mx-auto">
            Tidak ada produk yang cocok dengan kriteria pencarian &ldquo;{searchQuery}&rdquo;. Coba kata kunci lain atau reset filter.
          </p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            className="btn-dyari-outline text-xs inline-flex"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
