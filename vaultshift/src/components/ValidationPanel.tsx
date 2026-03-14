import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { useMigrationStore } from '../store/useMigrationStore';

export const ValidationPanel: React.FC = () => {
  const { warnings } = useMigrationStore();
  const [isExpanded, setIsExpanded] = useState(false);

  if (warnings.length === 0) return null;

  const dangerCount = warnings.filter(w => w.severity === 'danger').length;
  const warningCount = warnings.filter(w => w.severity === 'warning').length;

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 bg-slate-800/80 rounded-xl shadow-lg border border-orange-500/30 overflow-hidden backdrop-blur-sm">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            {dangerCount > 0 ? (
              <ShieldAlert className="w-6 h-6 text-red-500" />
            ) : (
              <AlertCircle className="w-6 h-6 text-orange-400" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg flex items-center text-slate-100">
              Health Checks
              <span className="ml-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 border border-slate-700 text-slate-400">
                {warnings.length} issues
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {dangerCount} critical · {warningCount} suggested improvements
            </p>
          </div>
        </div>
        
        <div className="text-slate-400">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-700 bg-slate-900/50 p-4 max-h-64 overflow-y-auto">
          <ul className="space-y-2">
            {warnings.map((warning, idx) => (
              <li 
                key={`${warning.id}-${idx}`} 
                className={`flex items-start p-3 rounded-lg border ${
                  warning.severity === 'danger' 
                    ? 'bg-red-500/10 border-red-500/20 text-red-200' 
                    : 'bg-orange-500/10 border-orange-500/20 text-orange-200'
                }`}
              >
                <span className="mr-3 mt-0.5">
                  {warning.severity === 'danger' ? '🔴' : '⚠️'}
                </span>
                <span className="text-sm">{warning.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
