import React from 'react';

// Renders the exact high-fidelity product mockup cards shown in the user's design screenshot
export const ProductMockup = ({ type, className = "" }) => {
  switch (type) {
    case 'financial':
      return (
        <div className={`relative w-full h-full bg-[#F3FAF5] rounded-xl overflow-hidden p-3 flex flex-col justify-between border border-[#D5E8DC] shadow-inner ${className}`}>
          {/* Subtle leaves decoration */}
          <div className="absolute -top-3 -right-3 w-16 h-16 opacity-20 pointer-events-none text-emerald-800">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 10 C30 30, 20 60, 50 90 C80 60, 70 30, 50 10 Z" />
              <path d="M80 30 C65 45, 60 70, 80 90" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#DCEEE2] text-[#234E38]">
              KEUANGAN
            </span>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A5CEB5]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#A5CEB5]"></span>
            </div>
          </div>

          <div className="my-auto text-center space-y-1 py-2">
            <p className="font-heading font-extrabold text-sm sm:text-base text-[#1E3A2F] leading-tight">
              Financial<br />Planner
            </p>
            <p className="text-[9px] text-[#527866]">Budget & Cashflow Template</p>
          </div>

          {/* Mini Sheet Grid Representation */}
          <div className="bg-white/90 backdrop-blur-xs rounded-lg p-2 shadow-xs border border-[#D5E8DC] space-y-1 text-[8px]">
            <div className="flex justify-between border-b border-[#E7F2EB] pb-0.5 font-bold text-[#234E38]">
              <span>Kategori</span>
              <span>Anggaran</span>
              <span>Sisa</span>
            </div>
            <div className="flex justify-between text-[#5C7F6E]">
              <span>Pemasukan</span>
              <span>10.000K</span>
              <span className="text-emerald-600 font-semibold">+OK</span>
            </div>
            <div className="flex justify-between text-[#5C7F6E]">
              <span>Kebutuhan</span>
              <span>5.000K</span>
              <span>50%</span>
            </div>
            <div className="w-full bg-[#E5F1E9] h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-[#4E9B70] h-full w-3/4 rounded-full"></div>
            </div>
          </div>
        </div>
      );

    case 'habit':
      return (
        <div className={`relative w-full h-full bg-[#FAFBF9] rounded-xl overflow-hidden p-3 flex flex-col justify-between border border-[#E0EAE2] shadow-inner ${className}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#EAF2EC] text-[#2F523D]">
              HABIT TRACKER
            </span>
            <span className="text-xs">🌱</span>
          </div>

          <div className="my-auto text-center py-2 space-y-0.5">
            <p className="font-heading font-extrabold text-sm sm:text-base text-[#1E3A2F]">
              Habit Tracker
            </p>
            <p className="text-[9px] text-[#637D6F]">Konsistensi Rutinitas Harian</p>
          </div>

          {/* Calendar Checkbox Grid */}
          <div className="bg-white rounded-lg p-2 border border-[#E3ECE5] shadow-xs space-y-1.5">
            <div className="grid grid-cols-7 gap-1 text-[7px] text-center font-bold text-[#718B7D]">
              <span>S</span><span>S</span><span>R</span><span>K</span><span>J</span><span>S</span><span>M</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-[8px] text-center">
              {[true, true, true, true, false, true, true, true, true, true, true, true, false, true].slice(0, 14).map((done, i) => (
                <span 
                  key={i} 
                  className={`w-3.5 h-3.5 mx-auto rounded flex items-center justify-center text-[7px] ${
                    done ? 'bg-[#98C7A8] text-[#1B402B] font-bold' : 'bg-[#F0F5F1] text-gray-400'
                  }`}
                >
                  {done ? '✓' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      );

    case 'prompt':
      return (
        <div className={`relative w-full h-full bg-[#FFF5F2] rounded-xl overflow-hidden p-3 flex flex-col justify-between border border-[#FADAD1] shadow-inner ${className}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#FEE4DD] text-[#A24A3B]">
              AI & KREATIF
            </span>
            <span className="text-xs text-[#EE7C6B]">✦</span>
          </div>

          <div className="my-auto text-center py-2 space-y-0.5">
            <p className="font-heading font-extrabold text-sm sm:text-base text-[#2E201D]">
              AI Prompt<br />Collection
            </p>
            <p className="text-[9px] text-[#8C6961]">1.000+ Formula Siap Pakai</p>
          </div>

          {/* Prompt card snippet */}
          <div className="bg-white rounded-lg p-2 border border-[#FADAD1] shadow-xs space-y-1 text-[8px] text-[#694D46]">
            <div className="flex items-center gap-1 font-bold text-[#A24A3B]">
              <span>ChatGPT & Midjourney</span>
            </div>
            <p className="line-clamp-2 bg-[#FFF9F7] p-1 rounded border border-[#FDE8E2] text-[7.5px] italic">
              "Act as a senior copywriter. Write a persuasive landing page hook..."
            </p>
          </div>
        </div>
      );

    case 'bundle':
    default:
      return (
        <div className={`relative w-full h-full bg-gradient-to-br from-[#F5F9F6] to-[#FDF4F1] rounded-xl overflow-hidden p-3 flex flex-col justify-between border border-[#DEEBE2] shadow-inner ${className}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#E5EFE8] text-[#234E38]">
              BUNDEL 4-IN-1
            </span>
            <span className="text-xs">🎁</span>
          </div>

          <div className="my-auto text-center py-1 space-y-0.5">
            <p className="font-heading font-extrabold text-sm sm:text-base text-[#1E3A2F]">
              Productivity Starter Pack
            </p>
            <p className="text-[9px] text-[#557867]">Financial + Habit + Planner</p>
          </div>

          {/* Stacked Cards Representation */}
          <div className="relative h-14 flex items-center justify-center">
            <div className="absolute w-24 h-12 bg-white rounded-md shadow-xs border border-[#D8E6DC] -rotate-6 transform -translate-x-3"></div>
            <div className="absolute w-24 h-12 bg-white rounded-md shadow-sm border border-[#F8D2CA] rotate-6 transform translate-x-3"></div>
            <div className="absolute w-26 h-12 bg-white rounded-md shadow-md border border-[#234E38]/20 flex items-center justify-center z-10 px-2">
              <span className="text-[8px] font-bold text-[#1E3A2F]">4 File Komplit Sekali Beli</span>
            </div>
          </div>
        </div>
      );
  }
};
