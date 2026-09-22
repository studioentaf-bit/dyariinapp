import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  User, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  Headphones, 
  Lock, 
  ArrowRight, 
  X, 
  Plus, 
  Minus,
  Check
} from 'lucide-react';
import { ProductMockup } from '../components/ProductMockup';

export const CheckoutView = () => {
  const { cart, cartTotal, removeFromCart, completeOrder, createPendingOrder, navigateTo, showToast, user } = useStore();

  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [orderNote, setOrderNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const discount = couponApplied ? 10000 : 0;
  const finalTotal = Math.max(0, cartTotal - discount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      setCouponApplied(true);
      showToast('Kupon Berhasil', 'Kupon promo hemat Rp 10.000 berhasil diterapkan!');
    }
  };

  const handlePayNow = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      completeOrder({
        customerName: name,
        email,
        phone,
        paymentMethod
      });
    }, 800);
  };

  const handlePendingOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      createPendingOrder({
        customerName: name,
        email,
        phone,
        paymentMethod
      });
    }, 800);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-heading font-bold text-[#1C352D]">Keranjangmu Kosong</h2>
        <p className="text-xs text-[#737873]">Silakan pilih produk digital terlebih dahulu sebelum checkout.</p>
        <button onClick={() => navigateTo('shop')} className="btn-dyari-primary mx-auto text-xs">
          Mulai Belanja
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#FCFAF5]">
      
      {/* 4-Step Stepper (Spec in Image 2) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5EAE4] shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Step 1: Active */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1C352D] text-white flex items-center justify-center text-xs font-bold shrink-0">
              1
            </div>
            <div>
              <p className="font-heading font-bold text-xs text-[#1C352D]">Informasi</p>
              <p className="text-[10px] text-[#737873]">Data diri & kontak</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3 opacity-60">
            <div className="w-8 h-8 rounded-full border border-[#D5DCD6] text-[#737873] flex items-center justify-center text-xs font-bold shrink-0">
              2
            </div>
            <div>
              <p className="font-heading font-semibold text-xs text-[#1C352D]">Pembayaran</p>
              <p className="text-[10px] text-[#737873]">Pilih metode pembayaran</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-3 opacity-60">
            <div className="w-8 h-8 rounded-full border border-[#D5DCD6] text-[#737873] flex items-center justify-center text-xs font-bold shrink-0">
              3
            </div>
            <div>
              <p className="font-heading font-semibold text-xs text-[#1C352D]">Konfirmasi</p>
              <p className="text-[10px] text-[#737873]">Verifikasi pesanan</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-center gap-3 opacity-60">
            <div className="w-8 h-8 rounded-full border border-[#D5DCD6] text-[#737873] flex items-center justify-center text-xs font-bold shrink-0">
              4
            </div>
            <div>
              <p className="font-heading font-semibold text-xs text-[#1C352D]">Selesai</p>
              <p className="text-[10px] text-[#737873]">Pembayaran berhasil</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Two-Column Layout */}
      <form onSubmit={handlePayNow} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Kontak & Pembayaran */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card: Informasi Kontak */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5EAE4] shadow-2xs space-y-4">
            <div className="flex items-start gap-3 border-b border-[#F0F4F1] pb-3">
              <div className="w-8 h-8 rounded-full bg-[#E5EFE8] text-[#1C352D] flex items-center justify-center shrink-0">
                <User size={16} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-[#1C352D]">Informasi Kontak</h3>
                <p className="text-xs text-[#737873]">Pastikan email yang kamu gunakan aktif, ya.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1C352D] mb-1">
                  Email <span className="text-[#EE7C6B]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-[#FAFBF9] rounded-xl border border-[#DDE3DC] px-3.5 py-2 text-xs text-[#1C352D] focus:outline-none focus:border-[#1C352D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C352D] mb-1">
                  Nama Lengkap <span className="text-[#EE7C6B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap Anda"
                  className="w-full bg-[#FAFBF9] rounded-xl border border-[#DDE3DC] px-3.5 py-2 text-xs text-[#1C352D] focus:outline-none focus:border-[#1C352D]"
                />
              </div>
            </div>
          </div>

          {/* Card: Metode Pembayaran */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5EAE4] shadow-2xs space-y-4">
            <div className="flex items-start gap-3 border-b border-[#F0F4F1] pb-3">
              <div className="w-8 h-8 rounded-full bg-[#E5EFE8] text-[#1C352D] flex items-center justify-center shrink-0">
                <CreditCard size={16} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-[#1C352D]">Metode Pembayaran</h3>
                <p className="text-xs text-[#737873]">Pilih metode pembayaran yang paling nyaman untukmu.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {/* 1: QRIS */}
              <label 
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'QRIS'
                    ? 'border-[#1C352D] bg-[#F7FAF8]'
                    : 'border-[#E5EAE4] hover:border-[#CAD4CB] bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="QRIS"
                    checked={paymentMethod === 'QRIS'}
                    onChange={() => setPaymentMethod('QRIS')}
                    className="accent-[#1C352D] w-4 h-4"
                  />
                  <div>
                    <span className="font-heading font-bold text-xs text-[#1C352D]">QRIS</span>
                    <p className="text-[10px] text-[#737873]">Scan kode QR melalui aplikasi e-wallet atau mobile banking.</p>
                  </div>
                </div>

                {/* QRIS Logo Badge */}
                <div className="px-2 py-0.5 bg-[#1C352D] text-white text-[10px] font-black rounded tracking-widest uppercase">
                  QRIS
                </div>
              </label>

              {/* 2: E-Wallet */}
              <label 
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'E-Wallet'
                    ? 'border-[#1C352D] bg-[#F7FAF8]'
                    : 'border-[#E5EAE4] hover:border-[#CAD4CB] bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="E-Wallet"
                    checked={paymentMethod === 'E-Wallet'}
                    onChange={() => setPaymentMethod('E-Wallet')}
                    className="accent-[#1C352D] w-4 h-4"
                  />
                  <div>
                    <span className="font-heading font-bold text-xs text-[#1C352D]">E-Wallet</span>
                    <p className="text-[10px] text-[#737873]">OVO, GoPay, DANA, ShopeePay, dll.</p>
                  </div>
                </div>

                {/* Logos */}
                <div className="flex items-center gap-1.5 text-[9px] font-bold">
                  <span className="text-[#4C3494] bg-[#F1EEF8] px-1.5 py-0.5 rounded">OVO</span>
                  <span className="text-[#0081A0] bg-[#E5F5F8] px-1.5 py-0.5 rounded">gopay</span>
                  <span className="text-[#118EEA] bg-[#E8F3FC] px-1.5 py-0.5 rounded">dana</span>
                  <span className="text-[#EE4D2D] bg-[#FDEEED] px-1.5 py-0.5 rounded">ShopeePay</span>
                </div>
              </label>

              {/* 3: Transfer Bank */}
              <label 
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'Transfer Bank'
                    ? 'border-[#1C352D] bg-[#F7FAF8]'
                    : 'border-[#E5EAE4] hover:border-[#CAD4CB] bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Transfer Bank"
                    checked={paymentMethod === 'Transfer Bank'}
                    onChange={() => setPaymentMethod('Transfer Bank')}
                    className="accent-[#1C352D] w-4 h-4"
                  />
                  <div>
                    <span className="font-heading font-bold text-xs text-[#1C352D]">Transfer Bank</span>
                    <p className="text-[10px] text-[#737873]">BCA, BNI, BRI, Mandiri, dll.</p>
                  </div>
                </div>

                {/* Bank Badges */}
                <div className="flex items-center gap-1 text-[9px] font-bold">
                  <span className="text-[#00529C] bg-[#E6F0F8] px-1.5 py-0.5 rounded">BCA</span>
                  <span className="text-[#F15A24] bg-[#FCEEE9] px-1.5 py-0.5 rounded">BNI</span>
                  <span className="text-[#00529C] bg-[#E6F0F8] px-1.5 py-0.5 rounded">BRI</span>
                  <span className="text-[#003D79] bg-[#E6EEF5] px-1.5 py-0.5 rounded">mandiri</span>
                </div>
              </label>
            </div>
          </div>

          {/* Section: Informasi Tambahan (Opsional) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5EAE4] shadow-2xs space-y-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#1C352D] cursor-pointer">
              <input
                type="checkbox"
                checked={showNoteInput}
                onChange={(e) => setShowNoteInput(e.target.checked)}
                className="accent-[#1C352D] rounded"
              />
              <span>Informasi Tambahan (Opsional)</span>
            </label>

            {showNoteInput && (
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Tulis catatan untuk pesanan ini..."
                rows={2}
                className="w-full bg-[#FAFBF9] rounded-xl border border-[#DDE3DC] p-3 text-xs text-[#1C352D] focus:outline-none focus:border-[#1C352D]"
              />
            )}
          </div>

          {/* Pay Actions (Lunas & Pending Simulation) & Security Guarantee */}
          <div className="space-y-2.5 pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#1C352D] hover:bg-[#25463C] text-white font-heading font-bold text-sm py-3.5 rounded-full transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memproses Pembayaran...</span>
                </>
              ) : (
                <>
                  <Lock size={15} />
                  <span>Bayar Sekarang (Simulasi Lunas Instan) →</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handlePendingOrder}
              className="w-full bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-heading font-bold text-xs py-2.5 rounded-full transition-all flex items-center justify-center gap-2"
            >
              <Zap size={14} className="text-amber-600" />
              <span>Simpan Antrian (Simulasi Order Pending / Belum Bayar)</span>
            </button>

            <p className="text-[11px] text-[#737873] text-center flex items-center justify-center gap-1 pt-1">
              <Lock size={12} />
              <span>Transaksi kamu 100% aman dan terenkripsi.</span>
            </p>
          </div>

        </div>

        {/* Right Sidebar: Ringkasan Pesanan */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E5EAE4] shadow-2xs space-y-4">
          <h3 className="font-heading font-bold text-sm text-[#1C352D] border-b border-[#F0F4F1] pb-3">
            Ringkasan Pesanan
          </h3>

          {/* Cart items list with mockup thumbnail and counter */}
          <div className="space-y-3 divide-y divide-[#F0F4F1]">
            {cart.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#FAFBF9] border border-[#E5EAE4] p-1 shrink-0 overflow-hidden">
                    <ProductMockup type={item.id.includes('prompt') ? 'prompt' : 'financial'} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs text-[#1C352D]">{item.name}</h4>
                    <p className="text-[10px] text-[#737873]">{item.category}</p>
                    <p className="text-xs font-bold text-[#1C352D] mt-0.5">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-[#DDE3DC] rounded-md px-1.5 py-0.5 text-xs text-[#1C352D]">
                    <span className="px-1 text-gray-400">-</span>
                    <span className="px-1 font-bold">1</span>
                    <span className="px-1 text-gray-400">+</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-[#EE7C6B]"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Kupon Box */}
          <div className="pt-2 border-t border-[#F0F4F1] space-y-2">
            <p className="text-xs font-semibold text-[#1C352D]">Gunakan Kupon</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Masukkan kode kupon"
                className="flex-1 bg-[#FAFBF9] rounded-lg border border-[#DDE3DC] px-3 py-1.5 text-xs text-[#1C352D] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="bg-[#EAEFEA] hover:bg-[#D5E2D7] text-[#1C352D] text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors"
              >
                Gunakan
              </button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="pt-3 border-t border-[#F0F4F1] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#737873]">
              <span>Subtotal</span>
              <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-[#737873]">
              <span>Diskon</span>
              <span className={discount > 0 ? "text-emerald-600 font-bold" : ""}>
                - Rp {discount.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="pt-2 border-t border-[#F0F4F1] flex justify-between items-baseline">
              <span className="font-heading font-bold text-sm text-[#1C352D]">Total</span>
              <span className="font-heading font-black text-lg text-[#1C352D]">
                Rp {finalTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Green Notice Box */}
          <div className="bg-[#E8F2EC] text-[#245037] p-3 rounded-xl text-xs flex items-center gap-2 border border-[#D0E2D6]">
            <Check size={16} className="shrink-0 stroke-[3]" />
            <span className="leading-snug font-medium">
              Produk digital akan langsung tersedia setelah pembayaran berhasil.
            </span>
          </div>

          {/* 3 Trust points */}
          <div className="pt-3 border-t border-[#F0F4F1] space-y-2 text-[11px] text-[#555C56]">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#1C352D]" />
              <span>Pembayaran aman dengan enkripsi SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-[#1C352D]" />
              <span>Akses instan setelah pembayaran</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones size={14} className="text-[#1C352D]" />
              <span>Bantuan 24/7 siap membantu</span>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
};
