import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, cartTotal, navigateTo } = useStore();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-forest/30 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-dyariborder flex flex-col justify-between transform transition-transform ease-out duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-dyariborder flex items-center justify-between bg-cream/50">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="text-forest" size={22} />
              <h2 className="text-xl font-heading font-bold text-forest">Keranjang Kamu</h2>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-sage/70 text-forest transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-warmgray">
                <div className="w-16 h-16 rounded-full bg-sage flex items-center justify-center text-forest">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <p className="font-heading font-semibold text-forest text-lg">Keranjang masih kosong</p>
                  <p className="text-sm mt-1 text-warmgray">Pilih produk digital impianmu untuk memulai rutinitas baru yang lebih rapi.</p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('shop');
                  }}
                  className="btn-dyari-primary text-sm mt-2"
                >
                  Jelajahi Produk
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-dyari-sm border border-dyariborder bg-cream/40 hover:bg-cream transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      loading="lazy"
                      decoding="async"
                      className="w-14 h-14 rounded-xl object-cover border border-dyariborder/60"
                    />
                    <div>
                      <h4 className="font-heading font-semibold text-forest text-sm leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-xs text-warmgray mt-0.5">{item.category}</p>
                      <p className="text-sm font-bold text-forest mt-1">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-warmgray hover:text-coral transition-colors"
                    title="Hapus dari keranjang"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-dyariborder bg-cream/60 space-y-4">
              <div className="flex items-center justify-between text-base">
                <span className="text-warmgray font-medium">Subtotal</span>
                <span className="text-xl font-heading font-extrabold text-forest">
                  Rp {cartTotal.toLocaleString('id-ID')}
                </span>
              </div>

              <p className="text-xs text-warmgray text-center">
                Akses instan langsung dikirim ke dashboard & email setelah pembayaran.
              </p>

              <button
                onClick={handleCheckout}
                className="w-full bg-coral hover:bg-coral-hover text-forest font-heading font-bold py-3.5 px-6 rounded-dyari-sm shadow-soft transition-all duration-200 flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>Lanjut ke Pembayaran</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
