import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileType, CheckCircle } from 'lucide-react';
import { useMigrationStore } from '../store/useMigrationStore';
import { parseCSV } from '../utils/csvParser';
import { detectFormat } from '../utils/formatDetector';

export const UploadPanel: React.FC = () => {
  const { file, setFile, setRawParsedResult, detectedSource, targetPlatform } = useMigrationStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      setFile(selected);
      try {
        const result = await parseCSV(selected);
        const source = detectFormat(result.headers);
        setRawParsedResult(result, source);
      } catch (err) {
        console.error('Failed to parse file:', err);
      }
    }
  }, [setFile, setRawParsedResult]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-[var(--color-brand-surface)] rounded-xl shadow-lg border border-slate-700/50 transition-all duration-300">
      
      {!file ? (
        <div 
          {...getRootProps()} 
          className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200
            ${isDragActive ? 'border-[var(--color-brand-primary)] bg-blue-900/20' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'}`}
        >
          <input {...getInputProps()} />
          <div className="p-4 bg-slate-800 rounded-full mb-4 group-hover:bg-slate-700 transition">
            <Upload className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Drag & Drop file to upload</h3>
          <p className="text-slate-400 text-sm max-w-sm text-center">
            Upload your CSV or JSON password export. Supported: Dashlane, Bitwarden, LastPass, 1Password, Google, iCloud.
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 bg-slate-800/50 rounded-lg border border-slate-700 w-full">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-0 w-full sm:w-auto">
            <div className="p-2 sm:p-3 bg-blue-500/20 rounded-lg shrink-0">
              <FileType className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--color-brand-primary)]" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-base sm:text-lg truncate max-w-[150px] sm:max-w-[300px]">{file.name}</p>
              <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center sm:justify-end space-x-4 sm:space-x-6 text-xs sm:text-sm w-full sm:w-auto">
            <div className="flex flex-col items-center sm:items-end">
              <span className="text-slate-500 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider mb-1">Source</span>
              <span className="flex items-center text-emerald-400 font-bold bg-emerald-400/10 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                {detectedSource}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-700"></div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-slate-500 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider mb-1">Target</span>
              <span className="font-bold bg-blue-500/10 text-blue-400 px-2 sm:px-3 py-1 rounded-full border border-blue-500/20 whitespace-nowrap">
                {targetPlatform}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
