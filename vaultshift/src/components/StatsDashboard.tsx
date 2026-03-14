import React from 'react';
import { useMigrationStore } from '../store/useMigrationStore';
import { ShieldAlert, Fingerprint, Copy, Globe, Activity } from 'lucide-react';

export const StatsDashboard: React.FC = () => {
  const { credentials, warnings } = useMigrationStore();

  if (credentials.length === 0) return null;

  const weakCount = warnings.filter(w => w.message.toLowerCase().includes('weak')).length;
  const duplicateCount = warnings.filter(w => w.message.toLowerCase().includes('duplicate')).length;
  const malformedUrlCount = warnings.filter(w => w.message.toLowerCase().includes('malformed url')).length;
  
  const healthScore = Math.max(0, 100 - (weakCount * 5) - (duplicateCount * 2) - (malformedUrlCount * 1));
  
  const stats = [
    { 
      label: 'Total Credentials', 
      value: credentials.length, 
      icon: <Fingerprint className="w-5 h-5 text-blue-400" />,
      color: 'blue'
    },
    { 
      label: 'Weak Passwords', 
      value: weakCount, 
      icon: <ShieldAlert className="w-5 h-5 text-red-400" />, 
      color: 'red'
    },
    { 
      label: 'Duplicates', 
      value: duplicateCount, 
      icon: <Copy className="w-5 h-5 text-orange-400" />, 
      color: 'orange'
    },
    { 
      label: 'Malformed URLs', 
      value: malformedUrlCount, 
      icon: <Globe className="w-5 h-5 text-yellow-400" />, 
      color: 'yellow'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-emerald-400';
    if (score > 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-2 bg-slate-800/80 rounded-xl p-6 border border-slate-700 flex items-center justify-between shadow-lg backdrop-blur-sm">
        <div>
          <h3 className="text-slate-400 text-xs font-semibold mb-1 flex items-center uppercase tracking-wider">
            <Activity className="w-4 h-4 mr-2 text-indigo-400" />
            Vault Health
          </h3>
          <div className={`text-4xl sm:text-5xl font-black ${getScoreColor(healthScore)}`}>
            {healthScore}%
          </div>
          <p className="text-xs text-slate-500 mt-1">General security rating</p>
        </div>
        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-700"
                />
                <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={213.6}
                    strokeDashoffset={213.6 - (213.6 * healthScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className={getScoreColor(healthScore)}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-slate-500 leading-none">SCORE</span>
            </div>
        </div>
      </div>

      <div className="lg:col-span-3 grid grid-cols-2 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 shadow-lg backdrop-blur-sm hover:border-slate-600 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-${stat.color}-500/10 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
