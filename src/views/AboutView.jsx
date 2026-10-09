import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Heart, 
  CheckCircle2,
  Store
} from 'lucide-react';

export const AboutView = () => {
  const { navigateTo } = useStore();

  return (
    <div className="bg-[#FCFAF5] min-h-screen py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* 01. HERO / BRAND INTRODUCTION */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8F2EA] border border-[#C5DCCB] text-[#1E3D2F] text-xs font-bold">
            <Sparkles size={14} className="text-[#4E8A5C]" />
            <span>Identitas Brand dyari.in</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-heading font-black text-[#191C1A] tracking-tight leading-[1.15]">
            Solusi Digital & Generator AI untuk Melipatgandakan Produktivitas
          </h1>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            <strong>dyari.in</strong> adalah ekosistem kurasi produk digital, template produktivitas cerdas, 
            dan generative AI tools yang dirancang untuk membantu kreator, profesional, dan pebisnis bekerja lebih cerdas, bukan lebih keras.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-3 rounded-full bg-[#EE7C6B] hover:bg-[#E26A59] text-white font-heading font-bold text-xs sm:text-sm transition shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Store size={16} />
              <span>Jelajahi Shop</span>
            </button>
            <button
              onClick={() => navigateTo('story-generator')}
              className="px-6 py-3 rounded-full bg-[#1E3D2F] hover:bg-[#162F24] text-white font-heading font-bold text-xs sm:text-sm transition shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles size={16} className="text-[#A3E6B5]" />
              <span>Coba Story Generator</span>
            </button>
          </div>
        </div>

        {/* 02. TWO PILLARS: DIGITAL PRODUCTS & AI GENERATOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 1: Digital Products */}
          <div className="bg-white rounded-3xl p-8 border border-[#E6E3DA] shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F2EA] text-[#1E3D2F] flex items-center justify-center text-xl shadow-2xs">
                <Layers size={24} className="text-[#4E8A5C]" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-[#191C1A]">
                1. Kurasi Produk Digital & Template
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Kami menyediakan template Notion terstruktur, spreadsheet otomasi keuangan, habit tracker, kalender konten, dan prompt library yang langsung siap pakai tanpa perlu mendesain dari nol.
              </p>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#4E8A5C]" />
                  <span>Desain minimalis, estetis, dan fungsional</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#4E8A5C]" />
                  <span>Instan download & panduan penggunaan komprehensif</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#4E8A5C]" />
                  <span>Dibuat berdasarkan alur kerja nyata para profesional</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-[#F0EEE6]">
              <button
                onClick={() => navigateTo('shop')}
                className="text-xs font-bold text-[#1E3D2F] hover:text-[#4E8A5C] flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Lihat Produk Digital di Shop</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Pillar 2: AI Productivity Generator */}
          <div className="bg-white rounded-3xl p-8 border border-[#E6E3DA] shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1E3D2F] text-[#A3E6B5] flex items-center justify-center text-xl shadow-2xs">
                <Cpu size={24} />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-[#191C1A]">
                2. Story Generator AI Studio
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Inovasi generator AI sinematik lengkap untuk memproduksi storyboard video iklan, visual prompt Imagen 3 / Veo berstandar studio, neural text-to-speech voice over, hingga penggabungan klip video langsung di browser Anda.
              </p>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#4E8A5C]" />
                  <span>Storyboard komersial, drama, animasi, & dokumenter</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#4E8A5C]" />
                  <span>Sistem BYOK (Bring Your Own Key) tanpa kuota server tersembunyi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#4E8A5C]" />
                  <span>Penyimpanan riwayat privat di browser perangkat Anda</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-[#F0EEE6]">
              <button
                onClick={() => navigateTo('story-generator')}
                className="text-xs font-bold text-[#1E3D2F] hover:text-[#4E8A5C] flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Buka Story Generator AI Studio</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 03. NILAI & PRINSIP DYARI.IN */}
        <div className="bg-[#1E3D2F] text-white rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-[#A3E6B5] uppercase tracking-wider block">
              Prinsip Kami
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              Mengapa dyari.in Hadir untuk Anda?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Kami percaya bahwa teknologi canggih tidak harus rumit atau mahal. dyari.in berfokus pada 3 prinsip utama:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/15">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#A3E6B5]">
                <Zap size={18} />
              </div>
              <h4 className="font-heading font-bold text-sm">Efisiensi Maksimal</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Memotong waktu riset, pembuatan konsep, dan penataan template dari berjam-jam menjadi hitungan menit.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#A3E6B5]">
                <ShieldCheck size={18} />
              </div>
              <h4 className="font-heading font-bold text-sm">Privasi & Transparansi</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Data hasil generate dan API Key tersimpan secara lokal di browser Anda. Aman tanpa risiko kebocoran data.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#A3E6B5]">
                <Heart size={18} />
              </div>
              <h4 className="font-heading font-bold text-sm">Ramah Kreator</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Skema lisensi adil, transparan, dan dapat digunakan untuk kebutuhan proyek komersial klien tanpa batasan.
              </p>
            </div>
          </div>
        </div>

        {/* 04. CALL TO ACTION */}
        <div className="text-center bg-white rounded-3xl p-8 sm:p-12 border border-[#E6E3DA] shadow-xs space-y-4">
          <h3 className="text-2xl font-heading font-bold text-[#191C1A]">
            Siap Melipatgandakan Produktivitas Anda Hari Ini?
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
            Mulai jelajahi produk digital unggulan kami atau aktifkan lisensi Story Generator untuk mulai memproduksi ide konten kreatif tanpa batas.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-3 rounded-full bg-[#1E3D2F] hover:bg-[#162F24] text-white font-heading font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              Kunjungi Shop
            </button>
            <button
              onClick={() => navigateTo('licenses')}
              className="px-6 py-3 rounded-full border border-[#D1DDD3] bg-white hover:bg-gray-50 text-[#1E3D2F] font-heading font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              Beli Lisensi
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutView;
