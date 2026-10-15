import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Copy, 
  ExternalLink, 
  Printer, 
  Share2, 
  ArrowLeft, 
  ShieldCheck, 
  MessageCircle, 
  Sparkles, 
  Key, 
  Smartphone, 
  FolderDown, 
  Search,
  Check,
  AlertCircle,
  QrCode,
  CreditCard,
  Building2
} from 'lucide-react';

export const PublicInvoiceView = () => {
  const { 
    orders, 
    lastOrder, 
    products, 
    activeInvoiceId, 
    openInvoice, 
    navigateTo, 
    updateOrderStatus, 
    settings, 
    showToast,
    getInvoiceUrl,
    sendInvoiceWhatsApp
  } = useStore();

  const [copiedKey, setCopiedKey] = useState(null);
  const [searchIdInput, setSearchIdInput] = useState('');

  // Extract ID from hash if activeInvoiceId is not set
  const currentHash = (window.location.hash || '').replace('#', '');
  const hashIdMatch = currentHash.includes('id=') ? currentHash.split('id=')[1]?.split('&')[0] : null;
  const targetId = activeInvoiceId || hashIdMatch;

  // Find target order
  const order = orders.find(o => {
    if (!targetId) return false;
    const cleanOId = o.id.replace('#', '').toLowerCase();
    const cleanTId = decodeURIComponent(targetId).replace('#', '').toLowerCase();
    return cleanOId === cleanTId;
  }) || lastOrder || orders[0];

  const handleCopy = (text, keyName) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    showToast('Teks Disalin', text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSimulatePay = () => {
    if (order) {
      updateOrderStatus(order.id, 'Lunas');
      showToast('Pembayaran Diterima!', `Pesanan ${order.id} berhasil dilunasi. Kredensial telah aktif.`);
    }
  };

  const isLunas = order?.status === 'Lunas' || order?.status === 'Terbayar';
  const isPending = order?.status === 'Menunggu Pembayaran' || order?.status === 'Pending' || order?.status === 'Menunggu Verifikasi';
  const isCancelled = order?.status === 'Dibatalkan';

  const invoiceUrl = order ? getInvoiceUrl(order.id) : window.location.href;

  return (
    <div className="min-h-screen bg-[#F8F9F7] py-8 px-4 sm:px-6 lg:px-8 font-sans text-forest">
      
      {/* Top Floating Bar for Navigation & Action */}
      <div className="max-w-3xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          onClick={() => navigateTo('shop')}
          className="inline-flex items-center gap-2 text-xs font-bold text-warmgray hover:text-forest bg-white px-3.5 py-2 rounded-xl border border-[#E5EAE4] shadow-2xs hover:shadow-xs transition"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Toko</span>
        </button>

        <div className="flex items-center gap-2">
          {order && (
            <>
              <button
                onClick={() => handleCopy(invoiceUrl, 'invoice-link')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-forest bg-white px-3.5 py-2 rounded-xl border border-[#E5EAE4] shadow-2xs hover:bg-[#F2F5F2] transition"
                title="Salin Link Invoice Ini"
              >
                {copiedKey === 'invoice-link' ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                <span>{copiedKey === 'invoice-link' ? 'Link Disalin!' : 'Salin Link'}</span>
              </button>

              <button
                onClick={() => sendInvoiceWhatsApp(order)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 shadow-2xs hover:bg-emerald-100 transition"
                title="Kirim ke WhatsApp Pembeli"
              >
                <MessageCircle size={14} />
                <span>Kirim via WA</span>
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-forest px-3.5 py-2 rounded-xl shadow-2xs hover:bg-[#152822] transition"
                title="Cetak atau Simpan PDF"
              >
                <Printer size={14} />
                <span>Cetak / PDF</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Invoice Sheet Container */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-[#E5EAE4] shadow-xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
        
        {/* Status Header Banner */}
        <div className={`p-5 sm:p-6 text-white ${
          isLunas 
            ? 'bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800' 
            : isCancelled 
              ? 'bg-gradient-to-r from-rose-800 to-red-700' 
              : 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
                {isLunas && <CheckCircle2 size={26} className="text-emerald-200" />}
                {isPending && <Clock size={26} className="text-amber-200 animate-pulse" />}
                {isCancelled && <XCircle size={26} className="text-rose-200" />}
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-white/80 block">
                  {isLunas ? 'BUKTI PEMBAYARAN LUNAS' : isPending ? 'MENUNGGU PEMBAYARAN' : 'STATUS PESANAN'}
                </span>
                <h1 className="text-xl sm:text-2xl font-heading font-black tracking-tight text-white">
                  {isLunas ? 'Transaksi Berhasil & Terverifikasi' : isPending ? 'Selesaikan Pembayaran Anda' : 'Pesanan Telah Dibatalkan'}
                </h1>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black shadow-xs ${
                isLunas ? 'bg-white text-emerald-900' : isPending ? 'bg-white text-amber-900' : 'bg-white text-rose-900'
              }`}>
                {isLunas && '✓ LUNAS'}
                {isPending && '⏳ PENDING'}
                {isCancelled && '✕ CANCEL'}
              </span>
              <p className="text-[11px] text-white/80 mt-1">
                ID: <span className="font-mono font-bold">{order?.id}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
          
          {/* Brand & Invoice Meta */}
          <div className="flex flex-wrap items-start justify-between gap-6 border-b border-[#F0F4F1] pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#1C352D] text-white flex items-center justify-center font-black text-sm">
                  D
                </div>
                <span className="font-heading font-black text-xl text-forest tracking-tight">
                  {settings?.branding?.storeName || 'dyari.in'}
                </span>
              </div>
              <p className="text-xs text-warmgray">Platform Produk Digital, AI Tools & Apps Premium</p>
              <p className="text-[11px] text-warmgray font-mono">https://dyari.in · CS: 0823-3062-6054</p>
            </div>

            <div className="text-right space-y-1 text-xs">
              <p className="text-warmgray">Nomor Invoice</p>
              <p className="font-mono font-black text-base text-forest">{order?.id}</p>
              <p className="text-warmgray mt-1">Tanggal Transaksi</p>
              <p className="font-bold text-forest">{order?.date || 'Hari ini'}</p>
            </div>
          </div>

          {/* Customer & Payment Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAFBF9] border border-[#E5EAE4] text-xs">
            <div>
              <span className="text-warmgray block text-[11px] uppercase tracking-wider font-bold">Ditujukan Kepada (Pembeli):</span>
              <p className="font-bold text-sm text-forest mt-0.5">{order?.customer || order?.customerName || 'Pelanggan Dyari'}</p>
              <p className="text-warmgray font-mono text-[11px]">{order?.email || 'email.pembeli@gmail.com'}</p>
              {order?.phone && <p className="text-warmgray text-[11px] mt-0.5">WhatsApp: {order.phone}</p>}
            </div>

            <div className="sm:text-right">
              <span className="text-warmgray block text-[11px] uppercase tracking-wider font-bold">Metode Pembayaran:</span>
              <p className="font-bold text-sm text-forest mt-0.5">{order?.paymentMethod || 'QRIS Instant'}</p>
              <div className="mt-1">
                {isLunas ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                    <ShieldCheck size={12} />
                    <span>Terverifikasi Otomatis</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-md">
                    <Clock size={12} />
                    <span>Menunggu Transfer / Verifikasi</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Table of Order Items */}
          <div className="space-y-3">
            <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-warmgray">
              Rincian Item Pembelian
            </h3>

            <div className="border border-[#E5EAE4] rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F2F5F2] text-warmgray font-bold border-b border-[#E5EAE4]">
                  <tr>
                    <th className="py-3 px-4">Produk / Layanan</th>
                    <th className="py-3 px-4 text-center">Tipe</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Harga</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F4F1]">
                  {order?.items?.map((it, idx) => {
                    const prod = products.find(p => p.id === it.id || p.name === it.name);
                    const isLicenseTool = prod?.productType === 'LICENSE_TOOL' ||
                      prod?.category === 'tools-ai' ||
                      prod?.type === 'LISENSI' ||
                      (it.name || '').toLowerCase().includes('lisensi') ||
                      (it.name || '').toLowerCase().includes('license') ||
                      (it.name || '').toLowerCase().includes('story generator');
                    const pType = isLicenseTool 
                      ? 'LICENSE_TOOL' 
                      : (it.assignedAccount || (it.name || '').toLowerCase().includes('canva') || (it.name || '').toLowerCase().includes('capcut') || (it.name || '').toLowerCase().includes('gemini') || (it.name || '').toLowerCase().includes('netflix') ? 'APPS_PREMIUM' : 'DIGITAL_PREMIUM');

                    return (
                      <tr key={idx} className="hover:bg-[#FCFAF5]">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-forest">{it.name}</p>
                          <p className="text-[11px] text-warmgray">{prod?.tagline || 'Produk Digital Resmi dyari.in'}</p>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {pType === 'APPS_PREMIUM' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                              Apps Premium
                            </span>
                          )}
                          {pType === 'LICENSE_TOOL' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                              Lisensi Tools
                            </span>
                          )}
                          {pType === 'DIGITAL_PREMIUM' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Digital Premium
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">{it.quantity || 1}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-forest">
                          Rp {(it.price || 0).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Total Calculation Row */}
              <div className="bg-[#FAFBF9] border-t border-[#E5EAE4] p-4 flex justify-between items-center">
                <span className="text-xs font-bold text-warmgray">Total Tagihan</span>
                <span className="font-heading font-black text-xl text-forest">
                  Rp {(order?.total || 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 1: KREDENSIAL PENGIRIMAN PRODUK (KHUSUS STATUS LUNAS)   */}
          {/* ============================================================== */}
          {isLunas && (
            <div className="space-y-4 pt-2 border-t border-[#F0F4F1]">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-700" />
                <h3 className="font-heading font-extrabold text-sm text-forest uppercase tracking-wider">
                  Kredensial & Hak Akses Produk Anda
                </h3>
              </div>

              <div className="space-y-3">
                {order?.items?.map((it, idx) => {
                  const prod = products.find(p => p.id === it.id || p.name === it.name);
                  const isLicenseTool = prod?.productType === 'LICENSE_TOOL' ||
                    prod?.category === 'tools-ai' ||
                    prod?.type === 'LISENSI' ||
                    (it.name || '').toLowerCase().includes('lisensi') ||
                    (it.name || '').toLowerCase().includes('story generator');
                  const pType = it.productType || prod?.productType || (isLicenseTool ? 'LICENSE_TOOL' : 'APPS_PREMIUM');

                  // 1. APPS & SHOP DIGITAL: Line Account / Exclusive Credentials
                  if (it.assignedAccount || (!isLicenseTool && (pType === 'APPS_PREMIUM' || (it.name || '').toLowerCase().includes('gemini') || (it.name || '').toLowerCase().includes('canva')))) {
                    const cred = it.assignedAccount || prod?.accessUrl || 'https://dyari.in/claim?id=' + order?.id;
                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 text-left">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-black text-blue-900">
                            <Smartphone size={14} />
                            <span>Akun / Link Akses Eksklusif Anda:</span>
                          </span>
                          <span className="text-[10px] font-bold bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded-full">
                            {it.name}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-blue-200/80 flex items-center justify-between gap-3">
                          <code className="text-xs font-mono font-extrabold text-blue-900 break-all select-all">
                            {cred}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopy(cred, `apps-${idx}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 shadow-2xs transition"
                          >
                            {copiedKey === `apps-${idx}` ? <Check size={13} /> : <Copy size={13} />}
                            <span>{copiedKey === `apps-${idx}` ? 'Disalin' : 'Salin'}</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-blue-800">
                          🔒 <em>Kredensial ini bersifat privat dan hanya diterbitkan 1x untuk nomor transaksi ini.</em>
                        </p>
                      </div>
                    );
                  }

                  // 2. LICENSE TOOLS: Auto Generated License Key (Hanya untuk produk lisensi)
                  if (isLicenseTool && (it.generatedLicense || pType === 'LICENSE_TOOL')) {
                    const licenseKey = it.generatedLicense || 'DYARI-TOOL-ACTIVE';
                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2 text-left">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-black text-purple-900">
                            <Key size={14} />
                            <span>Kunci Lisensi Aktivasi Tools & AI (Lifetime):</span>
                          </span>
                          <span className="text-[10px] font-bold bg-purple-200/80 text-purple-900 px-2 py-0.5 rounded-full">
                            {it.name}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-purple-200/80 flex items-center justify-between gap-3">
                          <code className="text-sm font-mono font-black text-purple-900 tracking-wider break-all select-all">
                            {licenseKey}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopy(licenseKey, `lic-${idx}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-2xs transition shrink-0"
                          >
                            {copiedKey === `lic-${idx}` ? <Check size={13} /> : <Copy size={13} />}
                            <span>{copiedKey === `lic-${idx}` ? 'Disalin' : 'Salin Kunci'}</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-purple-800">
                          ✨ <em>Gunakan kode lisensi di atas untuk aktivasi akun/tools resmi Anda.</em>
                        </p>
                      </div>
                    );
                  }

                  // 3. DIGITAL PREMIUM: Master Shared Link (Google Drive / Sheets)
                  const accessLink = it.masterAccessUrl || prod?.accessUrl || 'https://docs.google.com/spreadsheets/d/12lHxAjbdNQWyw6888AyGFYXUlQbzii_dK6FSMrhBfVI/edit?usp=drivesdk';
                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-900">
                          <FolderDown size={14} />
                          <span>Link Folder / Template Resmi Google Drive (Shared):</span>
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                          {it.name}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-emerald-200/80 flex items-center justify-between gap-3">
                        <span className="text-xs font-mono text-emerald-900 truncate block max-w-sm">
                          {accessLink}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopy(accessLink, `dig-${idx}`)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition"
                          >
                            <Copy size={12} />
                            <span>Salin</span>
                          </button>
                          <a
                            href={accessLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs transition"
                          >
                            <span>Buka Link</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        📦 <em>Tautan ini bebas diakses selamanya oleh akun Google Anda.</em>
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* ========================================================= */}
              {/* PESAN PETUNJUK SETELAH PEMBELIAN DARI PENJUAL              */}
              {/* ========================================================= */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F9F5] border border-emerald-200 text-left space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 size={15} className="text-emerald-700" />
                  <span>Pesan Petunjuk Setelah Pembelian dari Penjual:</span>
                </div>
                <div className="text-xs text-emerald-900 leading-relaxed space-y-1.5">
                  {order?.items?.map((it, idx) => {
                    const prod = products.find(p => p.id === it.id || p.name === it.name);
                    const msg = it.afterPurchaseMessage || prod?.afterPurchaseMessage;
                    if (!msg) return null;
                    return (
                      <div key={idx} className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-emerald-100">
                        <span className="font-bold text-emerald-950 shrink-0">• {it.name}:</span>
                        <span className="text-emerald-900">{msg}</span>
                      </div>
                    );
                  })}
                  {!order?.items?.some(it => {
                    const prod = products.find(p => p.id === it.id || p.name === it.name);
                    return it.afterPurchaseMessage || prod?.afterPurchaseMessage;
                  }) && (
                    <p className="text-emerald-800">
                      Terima kasih atas pembelian Anda di dyari.in! Simpan link invoice ini untuk mengakses file dan update produk Anda kapan saja.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION 2: INSTRUKSI PEMBAYARAN (KHUSUS STATUS PENDING)         */}
          {/* ============================================================== */}
          {isPending && (
            <div className="space-y-4 pt-2 border-t border-[#F0F4F1] text-left">
              <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200 space-y-4">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                  <AlertCircle size={18} className="text-amber-700" />
                  <span>Petunjuk Pembayaran — Batas Waktu 24 Jam</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Payment Details */}
                  <div className="space-y-3 bg-white p-4 rounded-2xl border border-amber-200/80 text-xs">
                    <p className="text-warmgray">Metode Pembayaran Dipilih:</p>
                    <p className="font-heading font-black text-forest text-base">
                      {order?.paymentMethod || 'QRIS (Semua Pembayaran)'}
                    </p>

                    {order?.paymentMethod?.includes('QRIS') ? (
                      <div className="space-y-2">
                        <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-[#E5EAE4] shadow-xs flex items-center justify-center">
                          <img 
                            src={settings?.payment?.qrisImageUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80"} 
                            alt="QRIS Barcode" 
                            className="w-full h-full object-cover rounded-lg" 
                          />
                        </div>
                        <p className="text-center text-[10px] text-warmgray">Scan QRIS menggunakan BCA Mobile, GoPay, OVO, DANA, dll.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 pt-1 border-t border-[#F0F4F1]">
                        <p className="text-warmgray">Nomor Rekening / Virtual Account:</p>
                        {(() => {
                          const accounts = settings?.payment?.virtualAccounts?.filter(va => va.active) || [
                            { bank: 'BCA', accNo: '8210984123', accName: 'Tony Anggoro (dyari.in)' }
                          ];
                          const selectedAcc = accounts.find(a => order?.paymentMethod?.toLowerCase().includes(a.bank.toLowerCase())) || accounts[0];
                          return (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between bg-[#FAFBF9] p-2.5 rounded-xl border border-[#E5EAE4]">
                                <div>
                                  <span className="text-[10px] font-bold text-gray-500 block">{selectedAcc?.bank || 'Bank Transfer'}</span>
                                  <span className="font-mono font-extrabold text-forest text-sm">{selectedAcc?.accNo || '8210984123'}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(selectedAcc?.accNo || '8210984123', 'rek')}
                                  className="text-xs text-forest font-bold hover:underline"
                                >
                                  {copiedKey === 'rek' ? 'Tersalin' : 'Salin'}
                                </button>
                              </div>
                              <p className="text-[11px] text-warmgray">a.n. <strong>{selectedAcc?.accName || 'Tony Anggoro (dyari.in)'}</strong></p>
                              {accounts.length > 1 && (
                                <div className="pt-1">
                                  <span className="text-[10px] text-warmgray block mb-1">Pilihan Rekening Pembayaran:</span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {accounts.map((ac, idx) => (
                                      <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleCopy(ac.accNo, `rek-${idx}`)}
                                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-forest px-2 py-0.5 rounded font-mono font-bold"
                                        title={`Salin no rek ${ac.bank}`}
                                      >
                                        {ac.bank}: {ac.accNo}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Payment Summary & Notice */}
                  <div className="space-y-3 flex flex-col justify-between bg-white p-4 rounded-2xl border border-amber-200/80 text-xs">
                    <div>
                      <p className="text-warmgray">Jumlah yang Harus Ditransfer:</p>
                      <p className="font-heading font-black text-2xl text-amber-700">
                        Rp {(order?.total || 0).toLocaleString('id-ID')}
                      </p>
                      <p className="text-[11px] text-amber-900 mt-2 leading-relaxed">
                        ⚠️ <em>Akses akun Apps Premium, kunci lisensi tools, atau folder Google Drive akan otomatis aktif dan ditampilkan di invoice ini begitu pembayaran Anda terverifikasi.</em>
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => sendInvoiceWhatsApp(order)}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                      >
                        <MessageCircle size={14} />
                        <span>Konfirmasi Bukti Transfer via WA</span>
                      </button>

                      {/* Interactive Simulation Button for Testing */}
                      <button
                        onClick={handleSimulatePay}
                        className="w-full py-2 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 border border-amber-300 transition"
                      >
                        <Sparkles size={13} className="text-amber-700" />
                        <span>⚡ Simulasi: Tandai Lunas Sekarang (Uji Coba)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Order Finder Modal / Fallback UI if Needed */}
          <div className="pt-4 border-t border-[#F0F4F1] flex flex-wrap items-center justify-between gap-3 text-xs text-warmgray print:hidden">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-700" />
              <span>Invoice resmi ini dienkripsi dan diotentikasi oleh server <strong>dyari.in</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px]">Uji Simulasi Lain:</span>
              {['#DY-10401', '#DY-10402', '#DY-10403', '#DY-10404', '#DY-10405', '#DY-10406'].map(simId => (
                <button
                  key={simId}
                  onClick={() => openInvoice(simId)}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold transition ${
                    order?.id === simId ? 'bg-forest text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {simId.replace('#DY-', '')}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
