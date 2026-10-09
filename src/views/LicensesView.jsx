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
  Laptop
} from 'lucide-react';
import api from '../services/api';

export const LicensesView = () => {
  const { navigateTo, showToast, storeSettings, licensePackages } = useStore();
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

    return {
      ...pkg,
      formattedPrice,
      period: periodStr,
      icon: iconComp,
      features: featuresList,
      ctaText: pkg.ctaText || `Pilih ${pkg.name}`,
      isPopular: Boolean(pkg.isPopular)
    };
  });

  const handleOrderLicense = (tier) => {
    const waNumber = storeSettings?.whatsapp || '6282330626054';
    const message = `Halo dyari.in, saya ingin membeli Lisensi Resmi: *${tier.name} (${tier.period})* seharga *${tier.formattedPrice}* untuk akses Story Generator. Mohon info nomor rekening & aktivasi serial kodenya. Terima kasih!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
  };

  return (
    <div className="bg-[#FCFAF5] min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* 01. HEADER TITLE */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F2EA] border border-[#C5DCCB] text-[#1E3D2F] text-xs font-bold">
            <KeyRound size={14} className="text-[#4E8A5C]" />
            <span>Lisensi Resmi dyari.in</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-[#191C1A] tracking-tight">
            Akses Penuh Story Generator & Tools Produktivitas
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Dapatkan lisensi resmi untuk membuka studio Story Generator AI dan software tools digital dyari.in. 
            Akses cepat, langsung aktif di browser Anda tanpa ribet langganan server mahal.
          </p>
        </div>

        {/* 02. CARA KERJA LISENSI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6E3DA] shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#1E3D2F] text-white flex items-center justify-center font-black text-sm shrink-0">
              1
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#191C1A]">Pilih Paket Lisensi</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Pilih durasi akses yang Anda butuhkan (1 Bulan, 1 Tahun, atau Lifetime sekali bayar).
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
                Kode lisensi unik (format <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px] font-mono">DYARI-XXXX-XXXX</code>) diterbitkan langsung ke email Anda.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#1E3D2F] text-white flex items-center justify-center font-black text-sm shrink-0">
              3
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#191C1A]">Aktivasi di Story Generator</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Buka menu Story Generator, masukkan email dan kode lisensi Anda. Studio langsung terbuka seketika!
              </p>
            </div>
          </div>
        </div>

        {/* 03. PRICING CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {licenseTiers.map((tier) => {
            const IconComp = tier.icon;
            return (
              <div 
                key={tier.id}
                className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                  tier.isPopular 
                    ? 'bg-[#1E3D2F] text-white shadow-xl scale-[1.02] border-2 border-[#4E8A5C]' 
                    : 'bg-white text-[#191C1A] border border-[#E6E3DA] shadow-xs hover:border-[#1E3D2F]/30'
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#EE7C6B] text-white font-extrabold text-[11px] shadow-sm tracking-wide">
                    {tier.badge}
                  </span>
                )}

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-heading font-extrabold text-lg ${tier.isPopular ? 'text-white' : 'text-[#191C1A]'}`}>
                        {tier.name}
                      </h3>
                      <p className={`text-xs mt-0.5 ${tier.isPopular ? 'text-gray-300' : 'text-gray-500'}`}>
                        {tier.subtitle}
                      </p>
                    </div>
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${tier.isPopular ? 'bg-white/10 text-[#A3E6B5]' : 'bg-[#F0EEE6] text-[#1E3D2F]'}`}>
                      <IconComp size={22} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-3xl sm:text-4xl font-heading font-black tracking-tight ${tier.isPopular ? 'text-white' : 'text-[#191C1A]'}`}>
                        {tier.formattedPrice || tier.price}
                      </span>
                    </div>
                    <span className={`text-xs font-semibold block mt-1 ${tier.isPopular ? 'text-[#A3E6B5]' : 'text-[#4E8A5C]'}`}>
                      {tier.period}
                    </span>
                  </div>

                  <div className={`pt-5 border-t ${tier.isPopular ? 'border-white/10' : 'border-[#F0EEE6]'} space-y-3`}>
                    <p className={`text-xs font-bold uppercase tracking-wider ${tier.isPopular ? 'text-gray-300' : 'text-gray-400'}`}>
                      Fasilitas & Keuntungan:
                    </p>
                    <ul className="space-y-2.5 text-xs">
                      {tier.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${tier.isPopular ? 'text-[#A3E6B5]' : 'text-[#4E8A5C]'}`} />
                          <span className={tier.isPopular ? 'text-gray-200' : 'text-gray-700'}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => handleOrderLicense(tier)}
                    className={`w-full py-3.5 px-6 rounded-2xl font-heading font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 ${
                      tier.isPopular 
                        ? 'bg-[#EE7C6B] hover:bg-[#E26A59] text-white' 
                        : 'bg-[#1E3D2F] hover:bg-[#162F24] text-white'
                    }`}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight size={16} />
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
