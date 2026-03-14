import React, { useState } from 'react';
import { useMigrationStore } from '../store/useMigrationStore';
import { generateExportCSV, downloadFile } from '../utils/csvExporter';
import { Download, RefreshCcw, Loader2 } from 'lucide-react';

export const DownloadPanel: React.FC = () => {
  const { credentials, targetPlatform, resetAll, isConverting, setIsConverting } = useMigrationStore();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (credentials.length === 0) return null;

  const handleDownload = async (chunkIndex?: number) => {
    setIsConverting(true);
    setDownloadSuccess(false);
    
    setTimeout(() => {
      try {
        let credsToExport = credentials;
        let suffix = '';
        
        if (chunkIndex !== undefined) {
          const CHUNK_SIZE = 50;
          const start = chunkIndex * CHUNK_SIZE;
          credsToExport = credentials.slice(start, start + CHUNK_SIZE);
          suffix = `_part${chunkIndex + 1}`;
        }
        
        const csvContent = generateExportCSV(credsToExport, targetPlatform);
        const filename = `${targetPlatform.toLowerCase().replace(/\s+/g, '_')}_export${suffix}_${new Date().getTime()}.csv`;
        downloadFile(csvContent, filename);
        setDownloadSuccess(true);
      } catch (err) {
        console.error('Download failed', err);
      } finally {
        setIsConverting(false);
        setTimeout(() => setDownloadSuccess(false), 3000);
      }
    }, 400);
  };

  const CHUNK_SIZE = 50;
  const numChunks = Math.ceil(credentials.length / CHUNK_SIZE);
  const needsChunking = credentials.length > CHUNK_SIZE;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
      
      {/* Decorative bg light */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Ready for Export</h2>
        <p className="text-slate-400 max-w-md">
          {credentials.length} credentials have been successfully mapped from detected source to <strong className="text-white">{targetPlatform}</strong> format.
        </p>
        {needsChunking && targetPlatform === 'Proton Pass' && (
          <p className="text-orange-400 text-sm mt-3 bg-orange-500/10 p-2 rounded border border-orange-500/20">
            <strong>Note:</strong> Proton Pass sometimes restricts large imports ("Too many verification requests"). We recommend downloading via the Parts below.
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto z-10 flex-wrap justify-end">
        <button
          onClick={resetAll}
          className="px-5 py-3 rounded-lg font-medium border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full sm:w-auto flex items-center justify-center whitespace-nowrap"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Start Over
        </button>

        {!needsChunking || targetPlatform !== 'Proton Pass' ? (
          <button
            onClick={() => handleDownload()}
            disabled={isConverting}
            className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg transition-all w-full sm:w-auto flex items-center justify-center whitespace-nowrap
              ${downloadSuccess 
                ? 'bg-[var(--color-brand-success)] hover:bg-emerald-400 shadow-emerald-500/30' 
                : 'bg-gradient-to-r from-[var(--color-brand-primary)] to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/30 transform hover:scale-105 active:scale-95'
              }`}
          >
            {isConverting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : downloadSuccess ? (
              <>
                <Download className="w-5 h-5 mr-2" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download {targetPlatform} File
              </>
            )}
          </button>
        ) : (
          <div className="flex flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0 items-end">
            <span className="text-sm text-slate-400 font-medium mb-1">Download in Parts (50 items each):</span>
            <div className="flex flex-wrap gap-2 justify-end">
              {Array.from({ length: numChunks }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDownload(idx)}
                  disabled={isConverting}
                  className="px-4 py-2 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center whitespace-nowrap text-sm bg-blue-600 hover:bg-blue-500 shadow-blue-500/30"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Part {idx + 1}
                </button>
              ))}
            </div>
            <button
               onClick={() => handleDownload()}
               className="text-xs text-slate-500 hover:text-slate-300 transition-colors mt-2"
            >
               Or download all as one single file
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
