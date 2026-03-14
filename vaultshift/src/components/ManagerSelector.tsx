import React from 'react';
import { useMigrationStore } from '../store/useMigrationStore';
import type { Platform } from '../types';
import { ArrowRightLeft } from 'lucide-react';

const KNOWN_PLATFORMS: Platform[] = [
  'Dashlane',
  'Bitwarden',
  'LastPass',
  '1Password',
  'Google Password Manager',
  'Proton Pass',
];

export const ManagerSelector: React.FC = () => {
  const { detectedSource, targetPlatform, setTargetPlatform, setRawParsedResult, rawParsedResult } = useMigrationStore();

  const handleSourceOverride = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as Platform;
    if (rawParsedResult) {
      setRawParsedResult(rawParsedResult, val);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-800/80 rounded-xl shadow-lg border border-slate-700 mt-6 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Source */}
        <div className="flex-1 w-full space-y-2">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Import From (Source)</label>
          <div className="relative">
            <select
              value={detectedSource === 'Unknown' || detectedSource === 'Detecting...' ? 'Unknown' : detectedSource}
              onChange={handleSourceOverride}
              className="w-full appearance-none bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent cursor-pointer transition-shadow"
            >
              <option value="Unknown">Auto-Detect / Custom</option>
              {KNOWN_PLATFORMS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Separator icon */}
        <div className="hidden md:flex flex-col justify-center items-center mt-6">
          <div className="p-3 bg-slate-900 rounded-full border border-slate-700 shadow-inner">
            <ArrowRightLeft className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        {/* Target */}
        <div className="flex-1 w-full space-y-2">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Export To (Target)</label>
          <div className="relative">
            <select
              value={targetPlatform}
              onChange={(e) => setTargetPlatform(e.target.value as Platform)}
              className="w-full appearance-none bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-success)] focus:border-transparent cursor-pointer transition-shadow"
            >
              <option value="Proton Pass" className="font-bold">Proton Pass</option>
              <option value="Bitwarden">Bitwarden</option>
              <option value="Dashlane">Dashlane</option>
              <option value="1Password">1Password</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
