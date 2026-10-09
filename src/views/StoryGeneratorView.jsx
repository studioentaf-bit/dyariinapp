import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  KeyRound, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  LogOut, 
  Mail, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';

export const StoryGeneratorView = () => {
  const { navigateTo, showToast } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [licenseData, setLicenseData] = useState(null);
  const [checkingLicense, setCheckingLicense] = useState(true);

  // Form states for license gate
  const [inputEmail, setInputEmail] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Check initial license stored in browser
  useEffect(() => {
    try {
      const stored = localStorage.getItem('storygen_license_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.license_key) {
          setLicenseData(parsed);
        }
      }
    } catch (e) {
      console.error('Error reading license storage:', e);
    } finally {
      setCheckingLicense(false);
    }
  }, []);

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!inputEmail.trim()) {
      setErrorMessage('Email terdaftar wajib diisi.');
      return;
    }
    if (!inputKey.trim()) {
      setErrorMessage('Kode lisensi serial wajib diisi.');
      return;
    }

    setIsVerifying(true);

    try {
      const cleanKey = inputKey.trim().toUpperCase();
      const cleanEmail = inputEmail.trim().toLowerCase();
      const res = await api.licenses.validate(cleanKey, cleanEmail);

      if (res.isValid && res.license) {
        const fullLic = {
          ...res.license,
          user_email: cleanEmail
        };
        localStorage.setItem('storygen_license_data', JSON.stringify(fullLic));
        setLicenseData(fullLic);
        showToast('Akses Terbuka', 'Lisensi valid! Selamat datang di Story Generator.', 'success');
      } else {
        setErrorMessage(res.message || 'Lisensi tidak valid atau masa berlaku telah berakhir.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Kode lisensi atau email tidak sesuai dengan data di sistem.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogoutLicense = () => {
    if (confirm('Keluar dari lisensi saat ini? Anda perlu memasukkan kode lisensi kembali untuk mengakses studio.')) {
      localStorage.removeItem('storygen_license_data');
      setLicenseData(null);
      setErrorMessage('');
      showToast('Lisensi Dilepas', 'Lisensi telah dikeluarkan dari sesi browser ini.', 'info');
    }
  };

  if (checkingLicense) {
    return (
      <div className="h-[calc(100vh-5rem)] flex items-center justify-center bg-[#F8F7F4]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-[#1E3D2F] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-gray-500">Memverifikasi lisensi...</span>
        </div>
      </div>
    );
  }

  // 1. IF NO VALID LICENSE: RENDER LICENSE GATE
  if (!licenseData) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-[#F8F7F4] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-[#E6E3DA] shadow-xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E8F2EA] text-[#1E3D2F] flex items-center justify-center text-2xl shadow-xs">
              <Lock size={26} className="text-[#4E8A5C]" />
            </div>
            <h2 className="text-2xl font-heading font-extrabold text-[#191C1A]">
              Aktivasi Lisensi Story Generator
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
              Fitur Story Generator memerlukan lisensi aktif. Masukkan email dan kode lisensi resmi yang terdaftar di panel admin.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Mail size={13} className="text-gray-400" />
                <span>Email Terdaftar</span>
              </label>
              <input
                type="email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="nama@emailanda.com"
                required
                className="w-full bg-[#FAFBF9] rounded-xl border border-[#DDE3DC] px-4 py-3 text-xs sm:text-sm text-[#1C352D] focus:outline-none focus:border-[#1E3D2F] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <KeyRound size={13} className="text-gray-400" />
                <span>Kode Lisensi Serial</span>
              </label>
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value.toUpperCase())}
                placeholder="DYARI-XXXX-XXXX-XXXX"
                required
                className="w-full bg-[#FAFBF9] rounded-xl border border-[#DDE3DC] px-4 py-3 text-xs sm:text-sm font-mono tracking-wider text-[#1C352D] focus:outline-none focus:border-[#1E3D2F] transition"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 rounded-xl bg-[#1E3D2F] hover:bg-[#162F24] text-white font-heading font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memverifikasi Lisensi...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} className="text-[#A3E6B5]" />
                  <span>Aktivasi & Masuk Studio</span>
                </>
              )}
            </button>
          </form>

          {/* Call to buy license */}
          <div className="pt-4 border-t border-[#F0EEE6] text-center space-y-2">
            <p className="text-xs text-gray-500">
              Belum memiliki lisensi Story Generator?
            </p>
            <button
              type="button"
              onClick={() => navigateTo('licenses')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EE7C6B] hover:text-[#E26A59] transition cursor-pointer"
            >
              <span>Beli Lisensi Resmi di Sini</span>
              <ArrowRight size={13} />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 2. IF VALID LICENSE EXISTS: RENDER STUDIO
  return (
    <div className="w-full flex flex-col bg-[#F8F7F4]" style={{ height: 'calc(100vh - 4.5rem)' }}>
      {/* Slim Top Bar Status Lisensi */}
      <div className="h-9 px-4 sm:px-6 bg-[#1E3D2F] text-white text-[11px] font-medium flex items-center justify-between shrink-0 border-b border-[#162F24]">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-[#A3E6B5] hidden sm:inline">Lisensi Aktif:</span>
          <span className="font-mono text-gray-200 truncate">{licenseData.license_key}</span>
          {licenseData.user_email && (
            <span className="text-gray-400 hidden md:inline truncate">({licenseData.user_email})</span>
          )}
          {licenseData.duration_label && (
            <span className="px-1.5 py-0.2 rounded bg-white/10 text-[9px] font-bold text-gray-300">
              {licenseData.duration_label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo('licenses')}
            className="hover:text-[#A3E6B5] transition text-[10px] hidden sm:inline cursor-pointer"
            title="Kelola & Beli Lisensi"
          >
            Info Lisensi
          </button>
          <button
            onClick={handleLogoutLicense}
            className="flex items-center gap-1 text-[10px] font-bold text-red-300 hover:text-red-100 transition cursor-pointer"
            title="Ganti atau Lepas Lisensi"
          >
            <LogOut size={11} />
            <span>Ganti Lisensi</span>
          </button>
        </div>
      </div>

      {/* Main Studio Frame Container */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#F8F7F4]/90 backdrop-blur-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#1C352D] text-white flex items-center justify-center mb-3 shadow-lg animate-bounce">
              <Sparkles size={24} className="text-[#A3E6B5]" />
            </div>
            <p className="text-sm font-bold text-[#1C352D]">Membuka Story Generator Studio...</p>
            <p className="text-xs text-gray-500 mt-1">Creative Production Studio & Video Creator</p>
          </div>
        )}

        <iframe
          src="/story-generator/index.html"
          title="Story Generator AI Studio"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
          }}
          allow="clipboard-read; clipboard-write; microphone; camera; fullscreen"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};

export default StoryGeneratorView;
