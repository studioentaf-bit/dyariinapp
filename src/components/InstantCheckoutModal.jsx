import React, { useState, useEffect } from 'react';
import { useStore, getProductAvailableStock } from '../context/StoreContext';
import { 
  X, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  KeyRound, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ShoppingBag,
  Download,
  Landmark,
  Wallet
} from 'lucide-react';

export const InstantCheckoutModal = () => {
  const {
    instantCheckout,
    closeInstantCheckout,
    submitInstantOrder,
    orders,
    storeSettings,
    showToast,
    navigateTo,
    openInvoice
  } = useStore();

  const { isOpen, item, type, step, order } = instantCheckout;

  // Form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qty, setQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [paymentMethodTab, setPaymentMethodTab] = useState('qris'); // 'qris' | 'bank' | 'ewallet'
  const [copiedAccIndex, setCopiedAccIndex] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Sync currentOrder with order prop or find in orders
  useEffect(() => {
    if (order) {
      const live = orders.find(o => o.id === order.id) || order;
      setCurrentOrder(live);
    } else {
      setCurrentOrder(null);
    }
  }, [order, orders]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setQty(1);
      setIsSubmitting(false);
      setIsCheckingStatus(false);
      setCopiedKey(false);
      setCopiedAccount(false);
      // Pre-fill user data if logged in
      try {
        const savedUser = localStorage.getItem('dyari_current_user');
        if (savedUser) {
          const u = JSON.parse(savedUser);
          if (u.name) setFullName(u.name);
          if (u.email) setEmail(u.email);
          if (u.phone) setPhone(u.phone);
        }
      } catch (_) {}
    }
  }, [isOpen, item]);

  // Real-time polling for order approval status (when on step 'qris')
  useEffect(() => {
    if (!isOpen || step !== 'qris' || !currentOrder) return;

    const interval = setInterval(async () => {
      // 1. Cek di local store state
      const foundInStore = orders.find(o => o.id === currentOrder.id);
      if (foundInStore && (foundInStore.status === 'Lunas' || foundInStore.status === 'Terbayar')) {
        setCurrentOrder(foundInStore);
        return;
      }

      // 2. Cek di backend PostgreSQL endpoint status
      try {
        const cleanId = (currentOrder.id || '').replace('#', '').trim();
        const res = await fetch(`/api/orders/status/${cleanId}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.order && (data.order.status === 'LUNAS' || data.order.status === 'Lunas')) {
            // Temukan atau perbarui status pesanan serta data fulfillment (kredensial / lisensi / link)
            const updatedItems = (currentOrder.items || []).map((it, idx) => {
              const backendItem = (data.items || []).find(bi => bi.product_id === it.id || bi.id === it.id) || (data.items || [])[idx] || {};
              return {
                ...it,
                generatedLicense: backendItem.license_key || it.generatedLicense || (data.licenses && data.licenses.length > 0 ? data.licenses[0].license_key : null),
                assignedAccount: backendItem.assigned_account || it.assignedAccount || null,
                accessUrl: backendItem.access_link || it.accessUrl || it.masterAccessUrl || null,
                masterAccessUrl: backendItem.access_link || it.masterAccessUrl || null
              };
            });

            setCurrentOrder(prev => ({
              ...prev,
              status: 'Lunas',
              items: updatedItems
            }));
          }
        }
      } catch (_) {}
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, step, currentOrder, orders]);

  if (!isOpen || !item) return null;

  const isLicense = type === 'license' ||
    item?.productType === 'LICENSE_TOOL' ||
    item?.category === 'tools-ai' ||
    item?.type === 'LISENSI' ||
    (item?.name || '').toLowerCase().includes('lisensi') ||
    (item?.name || '').toLowerCase().includes('story generator');
  const availableStock = !isLicense ? getProductAvailableStock(item) : 999;
  const unitPrice = Number(item.price || 0);
  const totalAmount = unitPrice * qty;

  const handleQtyChange = (delta) => {
    setQty(prev => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > availableStock) return availableStock;
      return next;
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Nama Lengkap Wajib', 'Silakan masukkan nama lengkap Anda.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      showToast('Email Tidak Valid', 'Silakan masukkan alamat email yang valid.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newOrder = await submitInstantOrder({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        qty: isLicense ? 1 : qty
      });
      setCurrentOrder(newOrder);
    } catch (err) {
      showToast('Gagal Memproses', 'Terjadi kesalahan saat membuat pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualCheckStatus = async () => {
    if (!currentOrder) return;
    setIsCheckingStatus(true);
    try {
      // Cek di local store
      const found = orders.find(o => o.id === currentOrder.id);
      if (found && (found.status === 'Lunas' || found.status === 'Terbayar')) {
        setCurrentOrder(found);
        showToast('Pembayaran Terverifikasi!', 'Pesanan Anda telah disetujui admin.');
        setIsCheckingStatus(false);
        return;
      }

      // Cek di backend
      const cleanId = (currentOrder.id || '').replace('#', '').trim();
      const res = await fetch(`/api/orders/status/${cleanId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.order && (data.order.status === 'LUNAS' || data.order.status === 'Lunas')) {
          setCurrentOrder(prev => ({ ...prev, status: 'Lunas' }));
          showToast('Pembayaran Terverifikasi!', 'Pesanan Anda telah disetujui admin.');
          setIsCheckingStatus(false);
          return;
        }
      }
      showToast('Masih Menunggu Persetujuan', 'Admin sedang memeriksa bukti pembayaran Anda. Mohon tunggu sejenak.');
    } catch (_) {
      showToast('Info', 'Admin sedang memverifikasi pesanan Anda.');
    } finally {
      setTimeout(() => setIsCheckingStatus(false), 800);
    }
  };

  const handleWhatsAppConfirm = () => {
    if (!currentOrder) return;
    const waNumber = storeSettings?.whatsapp || '6282330626054';
    const cleanWa = waNumber.replace(/[^0-9]/g, '');
    const cleanTargetWa = cleanWa.startsWith('0') ? '62' + cleanWa.substring(1) : (cleanWa.startsWith('62') ? cleanWa : '62' + cleanWa);
    const itemName = item.name || currentOrder.items?.[0]?.name || 'Produk';
    const methodLabel = paymentMethodTab === 'qris' ? 'QRIS' : (paymentMethodTab === 'bank' ? 'Transfer Bank' : 'E-Wallet');
    const text = encodeURIComponent(
      `Halo Admin dyari.in,\n\nSaya sudah melakukan pembayaran via ${methodLabel} untuk pesanan:\n` +
      `📌 *No. Pesanan:* ${currentOrder.id}\n` +
      `📦 *Produk/Lisensi:* ${itemName}\n` +
      `👤 *Nama:* ${fullName || currentOrder.customerName}\n` +
      `📧 *Email:* ${email || currentOrder.email}\n` +
      `💰 *Total:* Rp ${currentOrder.total?.toLocaleString('id-ID')}\n\n` +
      `Mohon bantuannya untuk approve/verifikasi pesanan saya agar lisensi & akses materi dapat langsung aktif. Terima kasih!`
    );
    window.open(`https://wa.me/${cleanTargetWa}?text=${text}`, '_blank');
  };

  const handleOpenStoryGeneratorWithLicense = (licCode) => {
    if (licCode) {
      try {
        const licensePayload = {
          license_key: licCode,
          user_email: (email || currentOrder?.email || '').trim().toLowerCase(),
          status: 'AKTIF',
          is_lifetime: item.duration?.toLowerCase().includes('lifetime') || item.period?.toLowerCase().includes('lifetime') || true,
          product_title: item.name || 'Story Generator Pro AI'
        };
        localStorage.setItem('storygen_license_data', JSON.stringify(licensePayload));
      } catch (_) {}
    }
    closeInstantCheckout();
    navigateTo('story-generator');
  };

  const isOrderApproved = currentOrder && (currentOrder.status === 'Lunas' || currentOrder.status === 'Terbayar' || currentOrder.status === 'LUNAS');
  const activeStep = isOrderApproved ? 'success' : step;

  // Extract credentials from fulfilled order items
  const fulfilledItem = currentOrder?.items?.[0] || {};
  const generatedLicenseCode = fulfilledItem.generatedLicense || 
    orders.find(o => o.id === currentOrder?.id)?.items?.[0]?.generatedLicense ||
    (isLicense ? `DYARI-${(item.name || 'TOOL').substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}` : null);
  const assignedAccountCredential = fulfilledItem.assignedAccount || 
    orders.find(o => o.id === currentOrder?.id)?.items?.[0]?.assignedAccount ||
    null;
  const accessUrl = fulfilledItem.accessUrl || item.accessUrl || '';

  const qrisImage = storeSettings?.payment?.qrisImageUrl || 
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white rounded-3xl border border-[#E5EAE4] shadow-2xl max-w-md w-full overflow-hidden relative my-auto"
      >
        {/* TOP BAR / CLOSE BUTTON */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-[#F0F4F1]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
            <span className="text-[11px] font-bold text-[#1C352D] uppercase tracking-wider">
              {activeStep === 'form' ? 'Checkout Instan' : (activeStep === 'qris' ? 'Pembayaran QRIS' : 'Akses Terbuka')}
            </span>
          </div>
          <button
            onClick={closeInstantCheckout}
            className="w-8 h-8 rounded-full bg-[#F4F6F4] text-[#1C352D] hover:bg-[#E5EAE4] flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        {/* STEP 1: FORM PENGISIAN DATA & QTY */}
        {activeStep === 'form' && (
          <div className="p-5 sm:p-6 space-y-5">
            {/* PRODUCT / LICENSE BRIEF PREVIEW */}
            <div className="p-3.5 bg-[#F8FAF9] rounded-2xl border border-[#E5EAE4] flex items-center gap-3.5">
              {isLicense ? (
                <div className="w-12 h-12 rounded-xl bg-[#1C352D] text-[#A3E6B5] flex items-center justify-center shrink-0 shadow-xs">
                  <KeyRound size={22} />
                </div>
              ) : (
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'} 
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  className="w-12 h-12 rounded-xl object-cover border border-[#E5EAE4] shrink-0 bg-white"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-[#E7F0E9] text-[#1C352D]">
                    {isLicense ? (item.period || item.duration || 'Lisensi') : (item.categoryName || 'Produk Digital')}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-xs sm:text-sm text-[#1C352D] truncate">
                  {item.name}
                </h4>
                <p className="text-xs font-mono font-extrabold text-[#059669]">
                  Rp {unitPrice.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* FORM INPUTS */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* NAMA LENGKAP */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1C352D]">
                  Nama Lengkap
                </label>
                <input 
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Rian Pratama"
                  className="w-full bg-[#FAFBF9] rounded-xl border border-[#D5DDD6] px-3.5 py-2.5 text-xs text-[#1C352D] placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 transition"
                />
              </div>

              {/* EMAIL PENERIMA */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1C352D]">
                  Email Penerima (Untuk Pengiriman Link/Akun)
                </label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rian@gmail.com"
                  className="w-full bg-[#FAFBF9] rounded-xl border border-[#D5DDD6] px-3.5 py-2.5 text-xs text-[#1C352D] placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 transition"
                />
              </div>

              {/* NOMOR WHATSAPP (OPSIONAL) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1C352D]">
                  Nomor WhatsApp <span className="text-[10px] font-normal text-gray-500">(Opsional untuk konfirmasi)</span>
                </label>
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="082330626054"
                  className="w-full bg-[#FAFBF9] rounded-xl border border-[#D5DDD6] px-3.5 py-2.5 text-xs text-[#1C352D] placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 transition"
                />
              </div>

              {/* JUMLAH / QTY ROW (PERSIS SEPERTI GAMBAR USER) */}
              {!isLicense && (
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1C352D]">Jumlah / Qty</span>
                    <span className="text-xs font-semibold text-gray-500">
                      Tersedia: {availableStock}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(-1)}
                      disabled={qty <= 1}
                      className="w-10 h-10 rounded-xl bg-[#F4F6F4] hover:bg-[#E5EAE4] disabled:opacity-40 text-base font-bold text-[#1C352D] flex items-center justify-center transition cursor-pointer"
                    >
                      -
                    </button>
                    <div className="w-16 h-10 rounded-xl bg-[#F8FAF9] border border-[#D5DDD6] flex items-center justify-center text-xs font-bold text-[#1C352D]">
                      {qty}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(1)}
                      disabled={qty >= availableStock}
                      className="w-10 h-10 rounded-xl bg-[#F4F6F4] hover:bg-[#E5EAE4] disabled:opacity-40 text-base font-bold text-[#1C352D] flex items-center justify-center transition cursor-pointer"
                    >
                      +
                    </button>

                    <div className="ml-auto text-right">
                      <span className="block text-[10px] text-gray-500">Total Harga:</span>
                      <span className="text-sm font-heading font-extrabold text-[#1C352D]">
                        Rp {totalAmount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isLicense && (
                <div className="p-3 bg-[#F8FAF9] rounded-xl border border-[#E5EAE4] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1C352D]">Total Pembayaran</span>
                  <span className="text-sm font-heading font-extrabold text-[#059669]">
                    Rp {totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || (!isLicense && availableStock <= 0)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#059669] hover:bg-[#047857] active:scale-[0.98] text-white font-heading font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CreditCard size={18} />
                      <span>Lanjut ke Pembayaran QRIS</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: PEMBAYARAN MULTI-METODE & MENUNGGU APPROVE ADMIN */}
        {activeStep === 'qris' && (
          <div className="p-5 sm:p-6 space-y-4 text-center">
            {/* ORDER INFO HEADER */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-gray-500">
                Invoice {currentOrder?.id}
              </span>
              <h3 className="text-xl font-heading font-extrabold text-[#1C352D]">
                Rp {currentOrder?.total?.toLocaleString('id-ID')}
              </h3>
              <p className="text-xs text-gray-500">
                {currentOrder?.items?.[0]?.name}
              </p>
            </div>

            {/* TAB SELECTOR METODE PEMBAYARAN */}
            <div className="flex items-center justify-center gap-1.5 p-1 bg-[#F4F6F4] rounded-2xl border border-[#E5EAE4]">
              <button
                type="button"
                onClick={() => setPaymentMethodTab('qris')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethodTab === 'qris'
                    ? 'bg-white text-forest shadow-xs'
                    : 'text-warmgray hover:text-forest'
                }`}
              >
                <QrCode size={13} />
                <span>QRIS Instant</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethodTab('bank')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethodTab === 'bank'
                    ? 'bg-white text-forest shadow-xs'
                    : 'text-warmgray hover:text-forest'
                }`}
              >
                <Landmark size={13} />
                <span>Transfer Bank</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethodTab('ewallet')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethodTab === 'ewallet'
                    ? 'bg-white text-forest shadow-xs'
                    : 'text-warmgray hover:text-forest'
                }`}
              >
                <Wallet size={13} />
                <span>E-Wallet</span>
              </button>
            </div>

            {/* KONTEN TAB 1: QRIS */}
            {paymentMethodTab === 'qris' && (
              <div className="bg-[#FAFBF9] border-2 border-dashed border-[#B8D8C0] p-4 rounded-3xl max-w-[240px] mx-auto shadow-inner">
                <img 
                  src={qrisImage} 
                  alt="QRIS Pembayaran dyari.in" 
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-square object-contain rounded-2xl bg-white p-2 shadow-2xs"
                />
                <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#1C352D]">
                  <QrCode size={13} className="text-[#059669]" />
                  <span>Scan BCA / GoPay / OVO / DANA / Mandiri</span>
                </div>
              </div>
            )}

            {/* KONTEN TAB 2: TRANSFER BANK */}
            {paymentMethodTab === 'bank' && (
              <div className="space-y-2 text-left">
                {(() => {
                  const banks = storeSettings?.payment?.virtualAccounts?.filter(va => va.active) || [
                    { bank: 'BCA', accNo: '8210984123', accName: 'Tony Anggoro (dyari.in)' },
                    { bank: 'Mandiri', accNo: '1370019284192', accName: 'Tony Anggoro (dyari.in)' }
                  ];
                  return banks.map((va, idx) => (
                    <div key={idx} className="bg-[#FAFBF9] border border-[#E5EAE4] p-3 rounded-2xl flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-forest">{va.bank}</span>
                          <span className="text-[10px] text-warmgray">({va.accName})</span>
                        </div>
                        <span className="font-mono font-extrabold text-sm text-forest">{va.accNo}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(va.accNo);
                          setCopiedAccIndex(`va-${idx}`);
                          showToast('No Rekening Disalin', `${va.bank}: ${va.accNo}`);
                          setTimeout(() => setCopiedAccIndex(null), 2000);
                        }}
                        className="btn-dyari-outline text-[11px] px-2.5 py-1 font-bold inline-flex items-center gap-1"
                      >
                        {copiedAccIndex === `va-${idx}` ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        <span>{copiedAccIndex === `va-${idx}` ? 'Disalin' : 'Salin'}</span>
                      </button>
                    </div>
                  ));
                })()}
              </div>
            )}

            {/* KONTEN TAB 3: E-WALLET */}
            {paymentMethodTab === 'ewallet' && (
              <div className="space-y-2 text-left">
                {(() => {
                  const wallets = storeSettings?.payment?.ewallets?.filter(ew => ew.active) || [
                    { name: 'GoPay', phone: '082330626054', nameAccount: 'Tony Anggoro' },
                    { name: 'DANA', phone: '082330626054', nameAccount: 'Tony Anggoro' },
                    { name: 'OVO', phone: '082330626054', nameAccount: 'Tony Anggoro' }
                  ];
                  return wallets.map((ew, idx) => (
                    <div key={idx} className="bg-[#FAFBF9] border border-[#E5EAE4] p-3 rounded-2xl flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-forest">{ew.name}</span>
                          <span className="text-[10px] text-warmgray">({ew.nameAccount})</span>
                        </div>
                        <span className="font-mono font-extrabold text-sm text-forest">{ew.phone}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(ew.phone);
                          setCopiedAccIndex(`ew-${idx}`);
                          showToast('Nomor E-Wallet Disalin', `${ew.name}: ${ew.phone}`);
                          setTimeout(() => setCopiedAccIndex(null), 2000);
                        }}
                        className="btn-dyari-outline text-[11px] px-2.5 py-1 font-bold inline-flex items-center gap-1"
                      >
                        {copiedAccIndex === `ew-${idx}` ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        <span>{copiedAccIndex === `ew-${idx}` ? 'Disalin' : 'Salin'}</span>
                      </button>
                    </div>
                  ));
                })()}
              </div>
            )}

            {/* INSTRUKSI PEMBAYARAN JIKA DIKONFIGURASI ADMIN */}
            {storeSettings?.payment?.instructions && (
              <div className="p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-left text-[11px] text-blue-900 leading-relaxed">
                💡 <strong>Catatan Admin:</strong> {storeSettings.payment.instructions}
              </div>
            )}

            {/* PULSATING STATUS BADGE */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-left flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping mt-1 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-900 leading-snug">
                  Menunggu Pembayaran & Persetujuan Admin
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                  Setelah Anda scan dan bayar QRIS, admin akan menyetujui pembayaran. Lisensi dan akses produk Anda akan <strong>otomatis terbuka langsung di layar ini</strong>.
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleWhatsAppConfirm}
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>Konfirmasi Pembayaran via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleManualCheckStatus}
                disabled={isCheckingStatus}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F4F6F4] hover:bg-[#E5EAE4] text-[#1C352D] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RefreshCw size={14} className={isCheckingStatus ? 'animate-spin' : ''} />
                <span>{isCheckingStatus ? 'Memeriksa status...' : 'Cek Status Persetujuan'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LUNAS / APPROVED -> LANGSUNG MUNCUL PRODUK & LISENSI */}
        {activeStep === 'success' && (
          <div className="p-5 sm:p-6 space-y-5 text-center">
            {/* SUCCESS BANNER */}
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={32} className="stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-heading font-extrabold text-[#1C352D]">
                Pembayaran Disetujui! 🎉
              </h3>
              <p className="text-xs text-gray-600">
                Terima kasih, <strong>{currentOrder?.customerName}</strong>. Akses Anda telah aktif.
              </p>
            </div>

            {/* KONTEN LISENSI ATAU PRODUK */}
            {isLicense ? (
              <div className="p-4 bg-gradient-to-br from-[#1C352D] to-[#2E5545] text-white rounded-2xl shadow-md text-left space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#A3E6B5]">
                    <Sparkles size={14} />
                    <span>Lisensi Resmi Story Generator AI</span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#A3E6B5] border border-emerald-400/30">
                    Aktif
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-300 block mb-1">Kode Serial Lisensi Anda:</span>
                  <div className="flex items-center justify-between bg-black/30 rounded-xl p-2.5 border border-white/20">
                    <span className="font-mono font-black text-sm tracking-wider text-white select-all">
                      {generatedLicenseCode || 'DYARI-PRO-ACTIVE'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const codeToCopy = generatedLicenseCode || 'DYARI-PRO-ACTIVE';
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(codeToCopy);
                          setCopiedKey(true);
                          setTimeout(() => setCopiedKey(false), 2000);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold transition flex items-center gap-1"
                    >
                      {copiedKey ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedKey ? 'Disalin' : 'Salin'}</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenStoryGeneratorWithLicense(generatedLicenseCode)}
                  className="w-full py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-heading font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <span>Langsung Buka Story Generator</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <div className="p-4 bg-[#F8FAF9] rounded-2xl border border-[#E5EAE4] text-left space-y-3">
                <div className="flex items-center justify-between border-b border-[#E5EAE4] pb-2">
                  <span className="text-xs font-bold text-[#1C352D]">Akses Produk Digital</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Siap Digunakan
                  </span>
                </div>

                {assignedAccountCredential ? (
                  <div>
                    <span className="text-[10px] text-gray-500 block mb-1">Akun / Kredensial Unik Anda:</span>
                    <div className="flex items-center justify-between bg-white rounded-xl p-2.5 border border-[#D5DDD6]">
                      <span className="font-mono text-xs font-bold text-[#1C352D] select-all break-all max-w-[240px]">
                        {assignedAccountCredential}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(assignedAccountCredential);
                            setCopiedAccount(true);
                            setTimeout(() => setCopiedAccount(false), 2000);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#E7F0E9] hover:bg-[#D5E3D8] text-xs font-bold text-[#1C352D] transition flex items-center gap-1 shrink-0"
                      >
                        {copiedAccount ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedAccount ? 'Disalin' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>
                ) : null}

                {accessUrl ? (
                  <a
                    href={accessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-heading font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition text-center cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Buka Akses / Unduh Materi Produk</span>
                  </a>
                ) : (
                  !assignedAccountCredential && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                      Pesanan Anda telah disetujui. Silakan klik tombol invoice di bawah untuk rincian materi digital Anda.
                    </div>
                  )
                )}

                {(fulfilledItem?.afterPurchaseMessage || item?.afterPurchaseMessage) && (
                  <p className="text-[11px] text-gray-500 italic bg-white p-2.5 rounded-xl border border-[#E5EAE4]">
                    💡 {fulfilledItem?.afterPurchaseMessage || item?.afterPurchaseMessage}
                  </p>
                )}
              </div>
            )}

            {/* BUTTONS INVOICE / TUTUP */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  closeInstantCheckout();
                  openInvoice(currentOrder?.id);
                }}
                className="flex-1 py-2.5 rounded-xl border border-[#D5DDD6] bg-white hover:bg-[#F4F6F4] text-[#1C352D] font-bold text-xs transition"
              >
                Lihat Bukti Invoice
              </button>
              <button
                type="button"
                onClick={closeInstantCheckout}
                className="flex-1 py-2.5 rounded-xl bg-[#1C352D] hover:bg-[#2A4D3E] text-white font-bold text-xs transition cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
