import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import { Check, ArrowRight, Download, PackageCheck, Copy, ExternalLink } from 'lucide-react';

export const OrderSuccessView = () => {
  const { lastOrder, user, navigateTo, setDashboardTab, showToast } = useStore();

  useEffect(() => {
    // Fire confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#B8D8C0', '#F4A69A', '#29463A', '#FFFDF8']
    });
  }, []);

  const handleOpenMyProducts = () => {
    setDashboardTab('produk-saya');
    navigateTo('dashboard');
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center space-y-8">
      
      {/* Success Icon */}
      <div className="relative mx-auto w-24 h-24">
        <div className="w-24 h-24 rounded-full bg-matcha flex items-center justify-center text-forest shadow-xl animate-in zoom-in-50 duration-300">
          <Check size={48} strokeWidth={3} />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-coral flex items-center justify-center text-white text-xs font-bold shadow-md">
          ✦
        </div>
      </div>

      {/* Main Success Message (Spec #13) */}
      <div className="space-y-3">
        <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          ✓ PEMBAYARAN BERHASIL
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-forest">
          Terima kasih, {user.name}!
        </h1>
        <p className="text-warmgray text-base sm:text-lg max-w-md mx-auto">
          Produkmu sudah siap digunakan dan telah ditambahkan langsung ke akunmu.
        </p>
      </div>

      {/* Order Snapshot Card */}
      {lastOrder && (
        <div className="bg-white rounded-dyari border border-dyariborder p-6 text-left space-y-4 shadow-card">
          <div className="flex items-center justify-between border-b border-dyariborder/70 pb-3 text-xs">
            <span className="text-warmgray">Nomor Pesanan</span>
            <span className="font-heading font-bold text-forest">{lastOrder.id}</span>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-warmgray uppercase tracking-wider">Akses Produk yang Diterbitkan:</p>
            {lastOrder.items.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#FAFBF9] border border-dyariborder/80 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-heading font-bold text-forest">{item.name}</span>
                  <span className="text-xs font-mono font-bold text-forest">
                    Rp {item.price.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Delivered: APPS PREMIUM EXCLUSIVE ACCOUNT / LINK */}
                {item.assignedAccount && (
                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between gap-2">
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-bold text-blue-900 block">📱 Akun / Link Akses Eksklusif Anda:</span>
                      <code className="text-xs font-mono font-bold text-blue-800 break-all select-all">{item.assignedAccount}</code>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.assignedAccount);
                        showToast('Akun Disalin', item.assignedAccount);
                      }}
                      className="p-1.5 rounded-lg bg-white text-blue-700 hover:bg-blue-100 shadow-2xs shrink-0 flex items-center gap-1 text-[11px] font-bold"
                      title="Salin Akun"
                    >
                      <Copy size={13} />
                      <span>Salin</span>
                    </button>
                  </div>
                )}

                {/* Delivered: LICENSE TOOLS GENERATED KEY */}
                {item.generatedLicense && (
                  <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-between gap-2">
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-bold text-purple-900 block">🔑 Kunci Lisensi Aktivasi Tools:</span>
                      <code className="text-xs font-mono font-black text-purple-900 tracking-wider select-all">{item.generatedLicense}</code>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.generatedLicense);
                        showToast('Kunci Lisensi Disalin', item.generatedLicense);
                      }}
                      className="p-1.5 rounded-lg bg-white text-purple-700 hover:bg-purple-100 shadow-2xs shrink-0 flex items-center gap-1 text-[11px] font-bold"
                      title="Salin Lisensi"
                    >
                      <Copy size={13} />
                      <span>Salin</span>
                    </button>
                  </div>
                )}

                {/* Delivered: DIGITAL PREMIUM SHARED LINK */}
                {item.masterAccessUrl && !item.assignedAccount && !item.generatedLicense && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2">
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-bold text-emerald-900 block">📦 Master Link Akses Produk (Shared):</span>
                      <span className="text-xs font-mono text-emerald-800 truncate block max-w-[280px]">
                        {item.masterAccessUrl}
                      </span>
                    </div>
                    <a
                      href={item.masterAccessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white text-emerald-700 hover:bg-emerald-100 shadow-2xs shrink-0 flex items-center gap-1 text-[11px] font-bold"
                    >
                      <span>Buka Link</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-dyariborder/70 flex justify-between items-center text-sm font-bold">
            <span>Metode: {lastOrder.paymentMethod}</span>
            <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-full text-xs">
              Status: {lastOrder.status}
            </span>
          </div>
        </div>
      )}

      {/* CTA Button (Spec #13: [ Buka Produk Saya ]) */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleOpenMyProducts}
          className="w-full bg-forest hover:bg-forest-light text-white font-heading font-bold py-4 px-8 rounded-dyari-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 text-base"
        >
          <span>Buka Produk Saya</span>
          <ArrowRight size={18} />
        </button>

        <button
          onClick={() => navigateTo('shop')}
          className="text-xs text-warmgray hover:text-forest transition-colors font-medium"
        >
          Lanjut Jelajahi Toko →
        </button>
      </div>

    </div>
  );
};
