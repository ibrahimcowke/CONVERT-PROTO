import React, { useMemo } from 'react';
import { useMigrationStore } from '../store/useMigrationStore';
import { ShieldAlert, Fingerprint, Copy, Globe, Activity, CheckCircle2, Info, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const StatsDashboard: React.FC = () => {
  const { credentials, warnings } = useMigrationStore();

  if (credentials.length === 0) return null;

  const weakCount = warnings.filter(w => w.message.toLowerCase().includes('weak')).length;
  const duplicateCount = warnings.filter(w => w.message.toLowerCase().includes('duplicate')).length;
  const malformedUrlCount = warnings.filter(w => w.message.toLowerCase().includes('malformed url')).length;
  
  const healthScore = useMemo(() => {
    return Math.max(0, 100 - (weakCount * 5) - (duplicateCount * 2) - (malformedUrlCount * 1));
  }, [weakCount, duplicateCount, malformedUrlCount]);

  const strengthStats = useMemo(() => {
    const total = credentials.length;
    const neutralCount = total - weakCount;
    return {
      weak: (weakCount / total) * 100,
      strong: (neutralCount / total) * 100,
      total
    };
  }, [credentials.length, weakCount]);

  const recommendations = useMemo(() => {
    const recs = [];
    if (weakCount > 0) recs.push({ text: `Rotate ${weakCount} weak passwords to improve security.`, icon: <ShieldAlert className="w-4 h-4 text-red-400" />, priority: 'high' });
    if (duplicateCount > 0) recs.push({ text: `Resolve ${duplicateCount} duplicate entries to prevent credential stuffing.`, icon: <Copy className="w-4 h-4 text-orange-400" />, priority: 'med' });
    if (malformedUrlCount > 0) recs.push({ text: `Fix ${malformedUrlCount} broken URLs for better autofill reliability.`, icon: <Globe className="w-4 h-4 text-yellow-400" />, priority: 'low' });
    if (healthScore === 100) recs.push({ text: "Vault looks perfect! Maintain good password hygiene.", icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, priority: 'none' });
    return recs;
  }, [weakCount, duplicateCount, malformedUrlCount, healthScore]);

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-emerald-400';
    if (score > 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score > 80) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score > 50) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 space-y-6">
      {/* Header & Score Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`lg:col-span-2 relative overflow-hidden rounded-2xl p-6 border flex items-center justify-between shadow-2xl backdrop-blur-xl group ${getScoreBg(healthScore)}`}
        >
          {/* Animated Background Pulse for Low Scores */}
          {healthScore < 80 && (
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
              className={`absolute inset-0 pointer-events-none rounded-2xl ${healthScore < 50 ? 'bg-red-500' : 'bg-yellow-500'}`}
            />
          )}

          <div className="relative z-10">
            <h3 className="text-slate-400 text-xs font-bold mb-1 flex items-center uppercase tracking-[0.2em]">
              <Activity className="w-4 h-4 mr-2 text-indigo-400" />
              Security Health
            </h3>
            <div className={`text-5xl sm:text-6xl font-black tracking-tight ${getScoreColor(healthScore)}`}>
              {healthScore}%
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider flex items-center">
              Vault Status: 
              <span className={`ml-2 ${getScoreColor(healthScore)}`}>
                {healthScore > 80 ? 'EXCELLENT' : healthScore > 50 ? 'FAIR' : 'AT RISK'}
              </span>
            </p>
          </div>

          <div className="relative w-24 h-24 sm:w-28 sm:h-28 z-10">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                  <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                  <motion.circle
                      initial={{ strokeDashoffset: 263.8 }}
                      animate={{ strokeDashoffset: 263.8 - (263.8 * healthScore) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8"
                      strokeDasharray={263.8}
                      strokeLinecap="round"
                      fill="transparent"
                      className={getScoreColor(healthScore)}
                  />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <LockCircle score={healthScore} />
              </div>
          </div>
        </motion.div>

        {/* Strength Distribution Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 shadow-xl backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-slate-200 text-xs font-bold flex items-center uppercase tracking-widest">
                <ShieldAlert className="w-4 h-4 mr-2 text-blue-400" />
                Strength Distribution
              </h3>
              <div className="flex items-center space-x-3 text-[10px] font-bold uppercase">
                <span className="flex items-center text-emerald-400"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" /> Strong</span>
                <span className="flex items-center text-red-500"><div className="w-2 h-2 rounded-full bg-red-500 mr-1.5" /> Weak</span>
              </div>
            </div>

            <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-700">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${strengthStats.strong}%` }}
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
              />
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${strengthStats.weak}%` }}
                className="h-full bg-gradient-to-r from-red-600 to-red-400"
              />
            </div>
            
            <div className="grid grid-cols-2 mt-4 gap-4">
              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                <div className="text-2xl font-black text-white">{credentials.length - weakCount}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Strong Passwords</div>
              </div>
              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                <div className="text-2xl font-black text-white">{weakCount}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Weak Passwords</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recommendations Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 shadow-xl backdrop-blur-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-200 text-xs font-bold flex items-center uppercase tracking-widest">
            <ArrowUpRight className="w-4 h-4 mr-2 text-indigo-400" />
            Priority Recommendations
          </h3>
          <Info className="w-4 h-4 text-slate-500 cursor-help hover:text-slate-300 transition-colors" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recommendations.map((rec, i) => (
            <div 
              key={i} 
              className={`flex items-start p-4 rounded-xl border transition-all hover:translate-x-1 ${
                rec.priority === 'high' ? 'bg-red-500/5 border-red-500/20' : 
                rec.priority === 'med' ? 'bg-orange-500/5 border-orange-500/20' : 
                'bg-slate-900/40 border-slate-800'
              }`}
            >
              <div className="mt-1 mr-3">{rec.icon}</div>
              <p className="text-xs sm:text-sm text-slate-300 leading-snug">{rec.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Helper Component for the health score circle center
const LockCircle = ({ score }: { score: number }) => {
    return (
        <>
            <Fingerprint className={`w-8 h-8 ${score > 80 ? 'text-emerald-400' : score > 50 ? 'text-yellow-400' : 'text-red-400'}`} />
            <span className="text-[8px] font-black text-slate-600 mt-1 uppercase tracking-tighter">Verified</span>
        </>
    );
};
