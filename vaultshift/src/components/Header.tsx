import React from 'react';
import { LockKeyhole } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-8 text-center">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
          <LockKeyhole className="w-8 h-8 text-[var(--color-brand-primary)]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          VaultShift
        </h1>
      </div>
      <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto px-4 sm:px-0">
        Securely migrate your credentials across password managers. 
        Privacy-first, universally compatible, completely offline.
      </p>
    </header>
  );
};
