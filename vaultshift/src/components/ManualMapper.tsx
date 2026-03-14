import React, { useState } from 'react';
import { useMigrationStore } from '../store/useMigrationStore';
import { Settings2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Credential } from '../types';

export const ManualMapper: React.FC = () => {
  const { rawParsedResult, setCredentials } = useMigrationStore();
  const [mappings, setMappings] = useState<Record<string, string>>({
    name: '',
    url: '',
    username: '',
    password: '',
    note: ''
  });

  if (!rawParsedResult || rawParsedResult.headers.length === 0) return null;

  const headers = rawParsedResult.headers;
  const targetFields = [
    { key: 'name', label: 'Title / Name' },
    { key: 'url', label: 'URL / Website' },
    { key: 'username', label: 'Username / Email' },
    { key: 'password', label: 'Password' },
    { key: 'note', label: 'Notes' }
  ];

  const handleMappingChange = (field: string, header: string) => {
    setMappings(prev => ({ ...prev, [field]: header }));
  };

  const applyMapping = () => {
    const credentials: Credential[] = rawParsedResult.rows.map((row) => ({
      id: crypto.randomUUID(),
      type: 'login',
      name: row[mappings.name] || 'Unnamed Entry',
      url: row[mappings.url] || '',
      username: row[mappings.username] || '',
      password: row[mappings.password] || '',
      note: row[mappings.note] || '',
      originalData: row
    }));

    setCredentials(credentials);
  };

  const isIncomplete = !mappings.username || !mappings.password;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto mt-8 p-6 bg-slate-800/40 rounded-2xl border border-slate-700/50 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-indigo-500/20 rounded-lg">
          <Settings2 className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Custom Format Detected</h2>
          <p className="text-xs text-slate-400">Map your CSV columns to continue the migration.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {targetFields.map(field => (
            <div key={field.key} className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest flex items-center">
                {field.label}
                {['username', 'password'].includes(field.key) && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </label>
              <select 
                value={mappings[field.key]}
                onChange={(e) => handleMappingChange(field.key, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="">-- Select Column --</option>
                {headers.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between bg-slate-900/40 rounded-xl p-6 border border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2 text-emerald-400" />
              Mapping Status
            </h3>
            {isIncomplete ? (
              <div className="flex items-start p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 mr-2 shrink-0 mt-0.5" />
                <p className="text-xs text-red-400 leading-snug">
                  Please map at least **Username** and **Password** to proceed with the conversion.
                </p>
              </div>
            ) : (
              <div className="flex items-start p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-400 leading-snug">
                  Excellent! Your mapping is ready. Click the button below to parse all {rawParsedResult.rows.length} entries.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={applyMapping}
            disabled={isIncomplete}
            className="mt-8 w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center space-x-2"
          >
            <span>Finish Mapping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
