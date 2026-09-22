import React from 'react';
import { useStore } from '../context/StoreContext';
import { Check } from 'lucide-react';

export const Toast = () => {
  const { toast } = useStore();

  if (!toast.show) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-6 z-50 animate-bounce-short">
      <div className="bg-forest text-cream px-5 py-4 rounded-dyari shadow-2xl border border-matcha/30 flex items-start gap-3.5 max-w-sm backdrop-blur-md">
        <div className="w-6 h-6 rounded-full bg-matcha text-forest flex items-center justify-center shrink-0 mt-0.5 font-bold">
          <Check size={14} strokeWidth={3} />
        </div>
        <div className="text-sm leading-snug">
          <p className="font-semibold text-white">{toast.title}</p>
          <p className="text-cream/80 text-xs mt-0.5">{toast.message}</p>
        </div>
      </div>
    </div>
  );
};
