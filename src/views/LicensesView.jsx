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
    const message = `Halo dyari.in, saya ingin membeli Lisensi Resmi: *${tier.name} (${tier.period})* seharga *${tier.formattedPrice}* untuk akses ${tier.category === 'app' ? 'Aplikasi Desktop' : 'Web Story Generator'}. Mohon info nomor rekening & aktivasi serial kodenya. Terima kasih!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
  };

  return (
    <div className="bg-[#FCFAF5] min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* 01. HEADER TITLE */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F2EA] border border-[#C5DCCB] text-[#1E3D2F] text-xs font-bold">
            <KeyRound size={14} className="text-[#4E8A5C]" />
            <span>Lisensi Resmi dyari.in</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-[#191C1A] tracking-tight">
            Pilihan Lisensi Aplikasi & Story Generator
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Dapatkan lisensi resmi untuk membuka software <strong>Story.in AI Manager Desktop</strong> atau studio <strong>Story Generator Website</strong>. Langsung aktif dan terverifikasi otomatis.
          </p>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-[#1E3D2F] text-white shadow-sm'
                : 'bg-white text-gray-600 border border-[#E6E3DA] hover:bg-gray-50'
            }`}
          >
            Semua Lisensi ({licenseTiers.length})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('app')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              categoryFilter === 'app'
                ? 'bg-[#1E3D2F] text-white shadow-sm'
                : 'bg-white text-gray-600 border border-[#E6E3DA] hover:bg-gray-50'
            }`}
          >
            <Monitor size={14} />
            <span>💻 Lisensi Aplikasi Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('web')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              categoryFilter === 'web'
                ? 'bg-[#1E3D2F] text-white shadow-sm'
                : 'bg-white text-gray-600 border border-[#E6E3DA] hover:bg-gray-50'
            }`}
          >
            <Globe size={14} />
            <span>🌐 Lisensi Story Generator Website</span>
          </button>
        </div>

        {/* 02. CARA KERJA LISENSI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6E3DA] shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#1E3D2F] text-white flex items-center justify-center font-black text-sm shrink-0">
              1
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#191C1A]">Pilih Lisensi</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Pilih kategori Aplikasi Desktop Windows atau Web Story Generator sesuai kebutuhan Anda.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#1E3D2F] text-white flex items-center justify-center font-black text-sm shrink-0">
              2
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#191C1A]">Terima Kode Serial & Email</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Kode lisensi unik (format <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px] font-mono">DYARI-XXXX-XXXX</code>) diterbitkan langsung setelah pembayaran.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#1E3D2F] text-white flex items-center justify-center font-black text-sm shrink-0">
              3
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#191C1A]">Aktivasi Seketika</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Masukkan email dan kode serial pada pop up aktivasi aplikasi desktop atau di web studio. Fitur langsung terbuka!
              </p>
            </div>
          </div>
        </div>

        {/* 03. PRICING CARDS (Compact sizing matching shop product cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
          {filteredTiers.map((tier) => {
            const IconComp = tier.icon;
            return (
              <div 
                key={tier.id}
                className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 relative ${
                  tier.isPopular 
                    ? 'bg-[#1E3D2F] text-white shadow-lg scale-[1.01] border-2 border-[#4E8A5C]' 
                    : 'bg-white text-[#191C1A] border border-[#E6E3DA] shadow-2xs hover:border-[#1E3D2F]/30 hover:-translate-y-1'
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#EE7C6B] text-white font-extrabold text-[10px] shadow-xs tracking-wide">
                    {tier.badge}
                  </span>
                )}

                <div className="space-y-3.5">
                  {/* Category Pill */}
                  <div>
                    {tier.category === 'app' ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        tier.isPopular ? 'bg-white/20 text-[#A3E6B5]' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        <Monitor size={11} />
                        <span>💻 DESKTOP APP</span>
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        tier.isPopular ? 'bg-white/20 text-[#A3E6B5]' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        <Globe size={11} />
                        <span>🌐 WEB STUDIO</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className={`font-heading font-extrabold text-sm sm:text-base leading-tight ${tier.isPopular ? 'text-white' : 'text-[#191C1A]'}`}>
                        {tier.name}
                      </h3>
                      <p className={`text-[11px] mt-0.5 ${tier.isPopular ? 'text-gray-300' : 'text-gray-500'}`}>
                        {tier.subtitle}
                      </p>
                    </div>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tier.isPopular ? 'bg-white/10 text-[#A3E6B5]' : 'bg-[#F0EEE6] text-[#1E3D2F]'}`}>
                      <IconComp size={18} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-2xl sm:text-3xl font-heading font-black tracking-tight ${tier.isPopular ? 'text-white' : 'text-[#191C1A]'}`}>
                        {tier.formattedPrice || tier.price}
                      </span>
                    </div>
                    <span className={`text-[11px] font-semibold block mt-0.5 ${tier.isPopular ? 'text-[#A3E6B5]' : 'text-[#4E8A5C]'}`}>
                      {tier.period}
                    </span>
                  </div>

                  <div className={`pt-3 border-t ${tier.isPopular ? 'border-white/10' : 'border-[#F0EEE6]'} space-y-2`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${tier.isPopular ? 'text-gray-300' : 'text-gray-400'}`}>
                      Fasilitas:
                    </p>
                    <ul className="space-y-1.5 text-[11px]">
                      {tier.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                          <CheckCircle2 size={13} className={`shrink-0 mt-0.5 ${tier.isPopular ? 'text-[#A3E6B5]' : 'text-[#4E8A5C]'}`} />
                          <span className={tier.isPopular ? 'text-gray-200' : 'text-gray-700'}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  <button
                    onClick={() => openInstantCheckout(tier, 'license')}
                    className={`w-full py-2.5 px-4 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                      tier.isPopular 
                        ? 'bg-[#EE7C6B] hover:bg-[#E26A59] text-white' 
                        : 'bg-[#1E3D2F] hover:bg-[#162F24] text-white'
                    }`}
                  >
                    <span>{tier.ctaText || 'Beli Lisensi'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 04. CEK / VERIFIKASI KODE LISENSI */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6E3DA] shadow-xs max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F2EA] text-[#1E3D2F] flex items-center justify-center text-lg">
              <ShieldCheck size={22} className="text-[#4E8A5C]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#191C1A]">Sudah Memiliki Lisensi? Cek Status di Sini</h3>
              <p className="text-xs text-gray-500">Cek validitas lisensi Anda atau langsung aktifkan ke studio Story Generator.</p>
            </div>
          </div>

          <form onSubmit={handleVerifyLicense} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Terdaftar</label>
              <input 
                type="email"
                value={checkEmail}
                onChange={(e) => setCheckEmail(e.target.value)}
                placeholder="nama@emailanda.com"
                className="w-full bg-[#FAFBF9] rounded-xl border border-[#DDE3DC] px-4 py-2.5 text-xs text-[#1C352D] focus:outline-none focus:border-[#1C352D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Kode Lisensi (Serial Key)</label>
              <input 
                type="text"
                value={checkKey}
                onChange={(e) => setCheckKey(e.target.value.toUpperCase())}
                placeholder="DYARI-XXXX-XXXX-XXXX"
                className="w-full bg-[#FAFBF9] rounded-xl border border-[#DDE3DC] px-4 py-2.5 text-xs text-[#1C352D] font-mono tracking-wider focus:outline-none focus:border-[#1C352D]"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isChecking}
              className="w-full py-3 rounded-xl bg-[#1E3D2F] hover:bg-[#162F24] text-white font-heading font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                Story Generator menggunakan sistem BYOK (Bring Your Own Key) Google Gemini. Anda dapat menggunakan API Key resmi Gemini gratis langsung dari Google AI Studio tanpa biaya server dari dyari.in.
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
