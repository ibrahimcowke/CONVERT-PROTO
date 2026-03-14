import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const SecurityBanner: React.FC = () => {
  return (
    <div className="w-full bg-emerald-900/30 border-b border-emerald-800/50 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center text-sm">
        <ShieldCheck className="w-5 h-5 text-[var(--color-brand-success)] mr-3 flex-shrink-0" />
        <span className="text-emerald-100/90 font-medium text-center">
          <strong className="text-emerald-400">Zero-Knowledge Security:</strong> Your passwords never leave your device. All processing occurs locally in your browser memory.
        </span>
      </div>
    </div>
  );
};
