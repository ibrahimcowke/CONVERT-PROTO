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
        <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FileType className="w-8 h-8 text-[var(--color-brand-primary)]" />
            </div>
            <div>
              <p className="font-semibold text-lg">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Detected Format</span>
              <span className="flex items-center text-emerald-400 font-medium bg-emerald-400/10 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                {detectedSource}
              </span>
            </div>
            <div className="h-10 w-px bg-slate-700 mx-2"></div>
            <div className="flex flex-col items-start">
              <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Target Format</span>
              <span className="font-medium bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                {targetPlatform}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
