import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  KeyRound, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle,
  Clock,
  Infinity,
  Laptop,
  Monitor,
  Globe
} from 'lucide-react';
import api from '../services/api';

export const LicensesView = () => {
  const { navigateTo, showToast, storeSettings, licensePackages, openInstantCheckout } = useStore();
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'app' | 'web'
  const [checkKey, setCheckKey] = useState('');
  const [checkEmail, setCheckEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  const handleVerifyLicense = async (e) => {
    e.preventDefault();
    if (!checkKey.trim()) {
      showToast('Peringatan', 'Masukkan kode lisensi untuk mengecek.', 'warning');
      return;
    }

    setIsChecking(true);
    setCheckResult(null);

    try {
      const res = await api.licenses.validate(checkKey.trim(), checkEmail.trim());
      setCheckResult(res);
      if (res.isValid) {
        showToast('Lisensi Valid', 'Lisensi Anda aktif dan siap digunakan!', 'success');
      } else {
        showToast('Lisensi Tidak Aktif', res.message || 'Lisensi tidak valid.', 'error');
      }
    } catch (err) {
      setCheckResult({
        isValid: false,
        message: err.message || 'Kode lisensi tidak ditemukan di sistem.'
      });
      showToast('Gagal Verifikasi', err.message || 'Lisensi tidak ditemukan.', 'error');
    } finally {
      setIsChecking(false);
    }
  };

  const handleActivateToStudio = () => {
    if (checkResult && checkResult.isValid && checkResult.license) {
      localStorage.setItem('storygen_license_data', JSON.stringify({
        ...checkResult.license,
        user_email: checkEmail.trim() || checkResult.license.user_email
      }));
      navigateTo('story-generator');
    }
  };

  const rawPackages = (storeSettings?.licensePackages && storeSettings.licensePackages.length > 0)
    ? storeSettings.licensePackages
    : (licensePackages && licensePackages.length > 0 ? licensePackages : []);

  const licenseTiers = rawPackages.map((pkg, idx) => {
    let iconComp = Clock;
    if (pkg.isPopular || idx === 1) iconComp = Sparkles;
    else if (pkg.id === 'lifetime' || (pkg.duration && pkg.duration.toLowerCase().includes('lifetime')) || idx === 2) iconComp = Infinity;

    const formattedPrice = typeof pkg.price === 'number' 
      ? `Rp ${pkg.price.toLocaleString('id-ID')}` 
      : (pkg.price?.toString().startsWith('Rp') ? pkg.price : `Rp ${pkg.price}`);

    const periodStr = pkg.period || pkg.duration || 'Akses Berkelanjutan';
    const featuresList = Array.isArray(pkg.features) 
      ? pkg.features 
      : (typeof pkg.features === 'string' ? pkg.features.split('\n').map(s => s.trim()).filter(Boolean) : []);

    const category = pkg.category || (
      (pkg.id && pkg.id.toLowerCase().includes('app')) || (pkg.name && pkg.name.toLowerCase().includes('desktop'))
        ? 'app'
        : 'web'
    );

    return {
      ...pkg,
      category,
      formattedPrice,
      period: periodStr,
      icon: iconComp,
      features: featuresList,
      ctaText: pkg.ctaText || `Pilih ${pkg.name}`,
      isPopular: Boolean(pkg.isPopular)
    };
  });

  const filteredTiers = licenseTiers.filter(tier => {
    if (categoryFilter === 'all') return true;
    return tier.category === categoryFilter;
  });

  const handleOrderLicense = (tier) => {
    const waNumber = storeSettings?.whatsapp || '6282330626054';
    const message = `Halo Story.in, saya ingin membeli Lisensi Resmi: *${tier.name} (${tier.period})* seharga *${tier.formattedPrice}* untuk akses ${tier.category === 'app' ? 'Aplikasi Desktop' : 'Web Story Generator'}. Mohon info nomor rekening & aktivasi serial kodenya. Terima kasih!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
  };

  return (
    <div className="bg-[#f8faff] min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* 01. HEADER TITLE */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-2xs">
            <KeyRound size={14} className="text-blue-600" />
            <span>Lisensi Resmi Story.in</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-900 tracking-tight">
            Pilihan Lisensi Aplikasi &amp; Story Generator
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Dapatkan lisensi resmi untuk membuka software <strong>Story.in AI Manager Desktop</strong> atau studio <strong>Story Generator Website</strong>. Langsung aktif dan terverifikasi otomatis.
          </p>
        </div>

        {/* CATEGORY FILTER TABS (3D Pills) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-slate-900 text-white border-b-[3px] border-slate-950 shadow-[0_6px_16px_rgba(15,23,42,0.35)] -translate-y-0.5'
                : 'bg-white text-slate-700 border border-slate-200 border-b-[3px] border-b-slate-200 hover:bg-slate-50 shadow-2xs'
            }`}
          >
            Semua Lisensi ({licenseTiers.length})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('app')}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              categoryFilter === 'app'
                ? 'bg-slate-900 text-white border-b-[3px] border-slate-950 shadow-[0_6px_16px_rgba(15,23,42,0.35)] -translate-y-0.5'
                : 'bg-white text-slate-700 border border-slate-200 border-b-[3px] border-b-slate-200 hover:bg-slate-50 shadow-2xs'
            }`}
          >
            <Monitor size={14} />
            <span>💻 Lisensi Desktop App</span>
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('web')}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              categoryFilter === 'web'
                ? 'bg-slate-900 text-white border-b-[3px] border-slate-950 shadow-[0_6px_16px_rgba(15,23,42,0.35)] -translate-y-0.5'
                : 'bg-white text-slate-700 border border-slate-200 border-b-[3px] border-b-slate-200 hover:bg-slate-50 shadow-2xs'
            }`}
          >
            <Globe size={14} />
            <span>🌐 Lisensi Web Studio</span>
          </button>
        </div>

        {/* 02. CARA KERJA LISENSI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 border-b-[4px] border-b-slate-200 shadow-[0_10px_28px_-6px_rgba(0,0,0,0.06)]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
              1
            </div>
            <div>
              <h4 className="font-heading font-black text-sm text-slate-900">Pilih Lisensi</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                Pilih kategori Aplikasi Desktop Windows atau Web Story Generator sesuai kebutuhan Anda.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
              2
            </div>
            <div>
              <h4 className="font-heading font-black text-sm text-slate-900">Terima Kode Serial &amp; Email</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                Kode lisensi unik (format <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold text-slate-800">STORY-XXXX-XXXX</code>) diterbitkan langsung setelah pembayaran.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
              3
            </div>
            <div>
              <h4 className="font-heading font-black text-sm text-slate-900">Aktivasi Seketika</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                Masukkan email dan kode serial pada pop up aktivasi aplikasi desktop atau di web studio. Fitur langsung terbuka!
              </p>
            </div>
          </div>
        </div>

        {/* 03. PRICING CARDS 3D BENTO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {filteredTiers.map((tier) => {
            const IconComp = tier.icon;
            return (
              <div 
                key={tier.id}
                className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 relative ${
                  tier.isPopular 
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-[0_16px_40px_-6px_rgba(37,99,235,0.35)] scale-[1.02] border-2 border-blue-500 border-b-[5px] border-b-blue-600' 
                    : 'bg-white text-slate-900 border border-slate-200 border-b-[4px] border-b-slate-200 shadow-[0_10px_28px_-6px_rgba(0,0,0,0.06)] hover:border-blue-400 hover:-translate-y-1.5'
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#ff5e7e] to-[#f43f5e] text-white font-black text-[10px] shadow-md border-b-[2px] border-rose-800 tracking-wider uppercase">
                    {tier.badge}
                  </span>
                )}

                <div className="space-y-3.5">
                  {/* Category Pill */}
                  <div>
                    {tier.category === 'app' ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                        tier.isPopular ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        <Monitor size={11} />
                        <span>💻 DESKTOP APP</span>
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                        tier.isPopular ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        <Globe size={11} />
                        <span>🌐 WEB STUDIO</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className={`font-heading font-black text-base sm:text-lg leading-tight ${tier.isPopular ? 'text-white' : 'text-slate-900'}`}>
                        {tier.name}
                      </h3>
                      <p className={`text-[11px] mt-0.5 font-medium ${tier.isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
                        {tier.subtitle}
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${tier.isPopular ? 'bg-white/10 text-blue-400' : 'bg-slate-100 text-slate-800'}`}>
                      <IconComp size={20} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-2xl sm:text-3xl font-heading font-black tracking-tight ${tier.isPopular ? 'text-white' : 'text-slate-900'}`}>
                        {tier.formattedPrice || tier.price}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold block mt-0.5 ${tier.isPopular ? 'text-blue-300' : 'text-blue-600'}`}>
                      {tier.period}
                    </span>
                  </div>

                  <div className={`pt-3 border-t ${tier.isPopular ? 'border-white/10' : 'border-slate-100'} space-y-2`}>
                    <p className={`text-[10px] font-black uppercase tracking-wider ${tier.isPopular ? 'text-slate-400' : 'text-slate-400'}`}>
                      Fasilitas:
                    </p>
                    <ul className="space-y-1.5 text-[11px]">
                      {tier.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug font-medium">
                          <CheckCircle2 size={13} className={`shrink-0 mt-0.5 ${tier.isPopular ? 'text-blue-400' : 'text-emerald-600'}`} />
                          <span className={tier.isPopular ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5 mt-auto">
                  <button
                    onClick={() => openInstantCheckout(tier, 'license')}
                    className={`w-full ${tier.isPopular ? 'btn-3d-coral' : 'btn-3d-blue'} text-xs sm:text-sm py-3`}
                  >
                    <span>{tier.ctaText || 'Beli Lisensi'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 04. CEK / VERIFIKASI KODE LISENSI (3D Bento Card) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 border-b-[4px] border-b-slate-200 shadow-[0_12px_32px_-6px_rgba(0,0,0,0.06)] max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-2xs">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-slate-900">Sudah Memiliki Lisensi? Cek Status di Sini</h3>
              <p className="text-xs text-slate-500 font-medium">Cek validitas lisensi Anda atau langsung aktifkan ke studio Story Generator.</p>
            </div>
          </div>

          <form onSubmit={handleVerifyLicense} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Terdaftar</label>
              <input 
                type="email"
                value={checkEmail}
                onChange={(e) => setCheckEmail(e.target.value)}
                placeholder="nama@emailanda.com"
                className="w-full bg-slate-50 rounded-2xl border border-slate-200 border-b-[3px] border-b-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-blue-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kode Lisensi (Serial Key)</label>
              <input 
                type="text"
                value={checkKey}
                onChange={(e) => setCheckKey(e.target.value.toUpperCase())}
                placeholder="STORY-XXXX-XXXX-XXXX"
                className="w-full bg-slate-50 rounded-2xl border border-slate-200 border-b-[3px] border-b-slate-200 px-4 py-3 text-xs text-slate-900 font-mono tracking-wider focus:outline-none focus:border-blue-400 font-bold"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isChecking}
              className="w-full btn-3d-dark py-3.5 text-xs sm:text-sm"
            >
              {isChecking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memeriksa Sistem...</span>
                </>
              ) : (
                <>
                  <KeyRound size={15} />
                  <span>Cek Validitas Lisensi</span>
                </>
              )}
            </button>
          </form>

          {/* Result Card */}
          {checkResult && (
            <div className={`p-4 rounded-2xl border text-xs space-y-3 ${
              checkResult.isValid 
                ? 'bg-[#F2F7F4] border-[#C5DCCB] text-[#1E3D2F]' 
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-extrabold flex items-center gap-1.5">
                  {checkResult.isValid ? (
                    <><CheckCircle2 size={16} className="text-[#4E8A5C]" /> Lisensi Aktif & Terverifikasi!</>
                  ) : (
                    <span>⚠️ Lisensi Tidak Aktif</span>
                  )}
                </span>
                {checkResult.license?.duration_label && (
                  <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-bold border border-current">
                    {checkResult.license.duration_label}
                  </span>
                )}
              </div>
              
              <p className="text-[11px] leading-relaxed">
                {checkResult.message}
              </p>

              {checkResult.isValid && (
                <button
                  type="button"
                  onClick={handleActivateToStudio}
                  className="w-full py-2.5 rounded-xl bg-[#4E8A5C] hover:bg-[#3C6E48] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Laptop size={14} />
                  <span>Buka Story Generator Sekarang →</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* 05. FAQ LISENSI */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h3 className="text-xl font-heading font-bold text-[#191C1A] text-center">
            Pertanyaan Umum Mengenai Lisensi
          </h3>
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4.5 border border-[#E6E3DA]">
              <h5 className="font-bold text-xs text-[#191C1A] mb-1">Apakah lisensi bisa dipindahkan ke perangkat lain?</h5>
              <p className="text-xs text-gray-500 leading-relaxed">
                Bisa. Cukup masukkan email terdaftar dan kode lisensi Anda di perangkat baru.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4.5 border border-[#E6E3DA]">
              <h5 className="font-bold text-xs text-[#191C1A] mb-1">Apakah ada biaya tambahan untuk generate AI?</h5>
              <p className="text-xs text-gray-500 leading-relaxed">
                Story Generator menggunakan sistem BYOK (Bring Your Own Key) Google Gemini. Anda dapat menggunakan API Key resmi Gemini gratis langsung dari Google AI Studio tanpa biaya server dari Story.in.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4.5 border border-[#E6E3DA]">
              <h5 className="font-bold text-xs text-[#191C1A] mb-1">Bagaimana jika lisensi saya kadaluarsa?</h5>
              <p className="text-xs text-gray-500 leading-relaxed">
                Anda dapat memperpanjang lisensi kapan saja. Seluruh riwayat generate lokal di browser Anda tetap aman dan tidak akan hilang.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LicensesView;
