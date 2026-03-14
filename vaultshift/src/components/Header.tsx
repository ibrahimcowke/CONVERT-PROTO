import React from 'react';
import { LockKeyhole, ShieldX } from 'lucide-react';
import { useMigrationStore } from '../store/useMigrationStore';

import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const { credentials, clearAll } = useMigrationStore();

  return (
    <header className="w-full py-8 text-center relative">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
          <LockKeyhole className="w-8 h-8 text-[var(--color-brand-primary)]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          VaultShift
        </h1>
      </div>

      {credentials.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:absolute right-0 top-1/2 lg:-translate-y-1/2 mb-4 lg:mb-0"
        >
          <button 
            onClick={() => {
              if (confirm("THIS WILL INSTANTLY PURGE ALL DATA FROM MEMORY. Continue?")) {
                clearAll();
              }
            }}
            className="flex items-center mx-auto lg:mx-0 space-x-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 px-4 py-2 rounded-full transition-all group"
          >
            <ShieldX className="w-4 h-4 group-hover:scale-125 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Panic Purge</span>
          </button>
        </motion.div>
      )}

      <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto px-4 sm:px-0">
        Securely migrate your credentials across password managers. 
        Privacy-first, universally compatible, completely offline.
      </p>
    </header>
  );
};
