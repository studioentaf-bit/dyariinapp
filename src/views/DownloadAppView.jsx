import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  RefreshCw, 
  Volume2, 
  KeyRound,
  FileCode,
  Laptop
} from 'lucide-react';

export const DownloadAppView = () => {
  const { navigateTo, showToast, appVersionInfo } = useStore();
  const [downloading, setDownloading] = useState(false);

  const rawVersion = appVersionInfo?.version || '0.0.16';
  const currentVersion = ['0.0.1', '0.0.2', '0.0.3', '0.0.4', '0.0.5', '0.0.6', '0.0.7', '0.0.8', '0.0.9', '0.0.10', '0.0.11', '0.0.12', '0.0.13', '0.0.14', '0.0.15', '0.0.16', '0.0.17'].includes(rawVersion) ? '0.0.16' : rawVersion;
  const currentDownloadUrl = appVersionInfo?.downloadUrl || `https://github.com/studioentaf-bit/dyariinapp/releases/download/v${currentVersion}/Story.in-AI-Manager.exe`;
  const currentReleaseUrl = appVersionInfo?.releaseUrl || `https://github.com/studioentaf-bit/dyariinapp/releases/tag/v${currentVersion}`;
  const currentSize = appVersionInfo?.size || '165 MB';

  const handleDirectDownload = () => {
    setDownloading(true);
    showToast('Mengunduh Aplikasi', `File Story.in-AI-Manager.exe v${currentVersion} sedang diunduh ke komputer Anda...`, 'info');

    // Trigger direct download without opening popups or new browser tabs
    const link = document.createElement('a');
    link.href = '/api/app/download';
    link.setAttribute('download', 'Story.in-AI-Manager.exe');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
      showToast('Unduhan Berjalan', 'Jika unduhan belum mulai otomatis, klik tombol unduh kembali.', 'success');
    }, 2500);
  };

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0EA] text-[#1C352D] text-xs font-bold tracking-wide uppercase">
          <Sparkles size={14} className="text-[#EE7C6B]" />
          <span>Story.in AI Manager Desktop v{currentVersion}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#1C352D] tracking-tight leading-tight">
          Download Aplikasi Desktop <br className="hidden sm:inline" />
          <span className="text-[#EE7C6B]">Story.in AI Manager</span>
        </h1>
        <p className="text-sm sm:text-base text-[#616863] leading-relaxed">
          Aplikasi desktop all-in-one untuk kreator konten dan otomasi multi-akun platform AI. 
          Tinggal download langsung buka (portabel), tanpa instalasi rumit.
        </p>
      </div>

      {/* Main Download Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#E5EAE4] p-6 sm:p-10 shadow-sm relative overflow-hidden mb-16">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8F0EA]/50 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-[#1C352D] text-white text-[11px] font-bold">
                Versi {currentVersion} (Resmi)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#F2F5F2] text-[#1C352D] text-[11px] font-semibold border border-[#E5EAE4]">
                Windows 10 / 11 (64-bit)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#FFF5F2] text-[#EE7C6B] text-[11px] font-bold border border-[#FCD9D0]">
                Single-File Standalone ({currentSize})
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C352D]">
              Siap Digunakan Seketika
            </h2>
            <p className="text-xs sm:text-sm text-[#616863] leading-relaxed">
              File executable self-contained yang sudah memaketkan runtime secara mandiri. Cukup unduh satu file <code className="font-mono bg-[#F2F5F2] text-[#1C352D] px-1.5 py-0.5 rounded text-xs">Story.in-AI-Manager.exe</code> dan klik dua kali untuk langsung membuka workspace.
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-[#1C352D]">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#4E8A5C] shrink-0" />
                <span><strong>Langsung Buka</strong>: Tidak memerlukan installer atau dependensi terpisah.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#4E8A5C] shrink-0" />
                <span><strong>Auto-Updater Bawaan</strong>: Pembaruan versi otomatis langsung terdeteksi dari GitHub Release.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#4E8A5C] shrink-0" />
                <span><strong>Terintegrasi Lisensi Website</strong>: Aktivasi mudah menggunakan kode lisensi resmi Dyari.</span>
              </li>
            </ul>

            {/* Direct Download Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={currentDownloadUrl}
                download="Story.in-AI-Manager.exe"
                onClick={() => {
                  showToast('Mengunduh Aplikasi', `File Story.in-AI-Manager.exe v${currentVersion} sedang diunduh ke komputer Anda...`, 'info');
                }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#1C352D] hover:bg-[#28493E] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Download size={18} />
                <span>Download Sekarang (v{currentVersion})</span>
              </a>

              <button
                onClick={() => navigateTo('licenses')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#FAFBF9] hover:bg-[#E8F0EA] border border-[#E5EAE4] text-[#1C352D] font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <KeyRound size={16} className="text-[#4E8A5C]" />
                <span>Beli / Klaim Lisensi</span>
              </button>
            </div>
            <p className="text-[11px] text-[#8A918B]">
              *Tautan langsung bersumber dari rilis resmi GitHub. Unduhan dimulai seketika tanpa pop-up iklan.
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm bg-[#FAFBF9] rounded-2xl p-5 border border-[#E5EAE4] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE4]">
                <div className="flex items-center gap-2">
                  <Laptop size={18} className="text-[#1C352D]" />
                  <span className="text-xs font-bold text-[#1C352D]">Spesifikasi Rilis</span>
                </div>
                <span className="text-[10px] bg-[#E8F0EA] text-[#1C352D] px-2 py-0.5 rounded-full font-bold">Terverifikasi</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#F0F4F0]">
                  <span className="text-[#737873]">Nama File:</span>
                  <span className="font-mono font-bold text-[#1C352D]">Story.in-AI-Manager.exe</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F0F4F0]">
                  <span className="text-[#737873]">Versi Rilis:</span>
                  <span className="font-bold text-[#1C352D]">{currentVersion} (Resmi)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F0F4F0]">
                  <span className="text-[#737873]">Ukuran Berkas:</span>
                  <span className="font-bold text-[#1C352D]">{currentSize}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F0F4F0]">
                  <span className="text-[#737873]">Sistem Operasi:</span>
                  <span className="font-bold text-[#1C352D]">Windows 10 / 11 64-bit</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#737873]">Lisensi:</span>
                  <span className="font-bold text-[#EE7C6B]">Diperlukan (Cek Menu Lisensi)</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={currentReleaseUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#4E8A5C] hover:underline flex items-center gap-1 justify-center font-medium"
                >
                  <FileCode size={12} />
                  <span>Lihat Catatan Rilis di GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="space-y-6 mb-16">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-[#1C352D]">
            Fitur Utama Aplikasi Desktop
          </h3>
          <p className="text-xs sm:text-sm text-[#737873]">
            Dirancang khusus untuk mempercepat alur kerja pembuatan konten dan pengelolaan platform AI Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E5EAE4] space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#E8F0EA] text-[#1C352D] flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <h4 className="text-sm font-bold text-[#1C352D]">Story Generator Lengkap</h4>
            <p className="text-xs text-[#616863] leading-relaxed">
              Hasilkan naskah cerita, storyboard visual per adegan, ide konten iklan, drama, animasi, edukasi, hingga dokumenter secara instan.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5EAE4] space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#FFF5F2] text-[#EE7C6B] flex items-center justify-center">
              <Volume2 size={20} />
            </div>
            <h4 className="text-sm font-bold text-[#1C352D]">Voice Over AI (Gemini TTS)</h4>
            <p className="text-xs text-[#616863] leading-relaxed">
              Konversi naskah teks menjadi narasi suara realistis Bahasa Indonesia & Inggris dengan pilihan voice male/female, style emosi, dan target durasi.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5EAE4] space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#F0F7F2] text-[#4E8A5C] flex items-center justify-center">
              <Layers size={20} />
            </div>
            <h4 className="text-sm font-bold text-[#1C352D]">Multi-Akun Platform AI</h4>
            <p className="text-xs text-[#616863] leading-relaxed">
              Jalankan puluhan akun ChatGPT, Claude, Gemini, Midjourney, dan Canva dalam satu jendela dengan sesi login terisolasi tanpa saling bentrok.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5EAE4] space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#E8F0EA] text-[#1C352D] flex items-center justify-center">
              <Cpu size={20} />
            </div>
            <h4 className="text-sm font-bold text-[#1C352D]">Video Tools Bawaan</h4>
            <p className="text-xs text-[#616863] leading-relaxed">
              Dilengkapi Video Splitter dan Video Merger internal untuk memotong dan menggabungkan klip video konten Anda tanpa watermark.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5EAE4] space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#FFF5F2] text-[#EE7C6B] flex items-center justify-center">
              <RefreshCw size={20} />
            </div>
            <h4 className="text-sm font-bold text-[#1C352D]">Auto-Updater Terpadu</h4>
            <p className="text-xs text-[#616863] leading-relaxed">
              Mendeteksi versi rilis terbaru secara otomatis. Cukup satu klik untuk mengunduh dan menerapkan pembaruan tanpa perlu download manual lagi.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5EAE4] space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#F0F7F2] text-[#4E8A5C] flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h4 className="text-sm font-bold text-[#1C352D]">Aktivasi Lisensi Resmi</h4>
            <p className="text-xs text-[#616863] leading-relaxed">
              Sistem lisensi terikat HWID komputer dan tersinkronisasi valid dengan database admin Dyari untuk perlindungan akses yang aman.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Steps Activation */}
      <div className="bg-[#FAFBF9] rounded-3xl border border-[#E5EAE4] p-6 sm:p-10 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-[#1C352D]">
            Langkah Cepat Memulai
          </h3>
          <p className="text-xs sm:text-sm text-[#737873]">
            Ikuti 4 langkah mudah berikut untuk mengaktifkan seluruh menu dan fitur aplikasi:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E5EAE4] space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1C352D] text-white flex items-center justify-center font-bold text-sm">1</div>
            <h5 className="font-bold text-sm text-[#1C352D]">Download Aplikasi</h5>
            <p className="text-xs text-[#616863] leading-relaxed">
              Klik tombol download di halaman ini untuk mengunduh berkas <code className="font-mono text-[11px]">Story.in-AI-Manager.exe</code>.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5EAE4] space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1C352D] text-white flex items-center justify-center font-bold text-sm">2</div>
            <h5 className="font-bold text-sm text-[#1C352D]">Buka Aplikasi</h5>
            <p className="text-xs text-[#616863] leading-relaxed">
              Jalankan file langsung di komputer Anda (tidak perlu instalasi). HWID komputer Anda akan langsung terdeteksi.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5EAE4] space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1C352D] text-white flex items-center justify-center font-bold text-sm">3</div>
            <h5 className="font-bold text-sm text-[#1C352D]">Beli Lisensi Resmi</h5>
            <p className="text-xs text-[#616863] leading-relaxed">
              Pilih paket lisensi yang diinginkan di menu <button onClick={() => navigateTo('licenses')} className="text-[#EE7C6B] underline font-bold">Lisensi</button> untuk mendapatkan kode lisensi Anda.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5EAE4] space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1C352D] text-white flex items-center justify-center font-bold text-sm">4</div>
            <h5 className="font-bold text-sm text-[#1C352D]">Aktivasi & Nikmati</h5>
            <p className="text-xs text-[#616863] leading-relaxed">
              Masukkan email dan kode lisensi di aplikasi. Seluruh menu dan fitur Pro akan terbuka seketika!
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => navigateTo('licenses')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1C352D] hover:text-[#EE7C6B] transition-colors cursor-pointer"
          >
            <span>Lihat Paket Lisensi Resmi Dyari</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
