import { useEffect } from 'react';
import { useMigrationStore } from './store/useMigrationStore';
import { normalizeToCredentials } from './converters';
import { analyzeCredentials } from './utils/validation';

import { Header } from './components/Header';
import { SecurityBanner } from './components/SecurityBanner';
import { UploadPanel } from './components/UploadPanel';
import { ManagerSelector } from './components/ManagerSelector';
import { ValidationPanel } from './components/ValidationPanel';
import { PreviewTable } from './components/PreviewTable';
import { DownloadPanel } from './components/DownloadPanel';
import { StatsDashboard } from './components/StatsDashboard';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { 
    rawParsedResult, 
    detectedSource, 
    targetPlatform, 
    setCredentials, 
    setWarnings,
    credentials
  } = useMigrationStore();

  // Core Reactivity Engine: Update standardized credentials whenever parsed source data or target format changes
  useEffect(() => {
    if (rawParsedResult) {
      // 1. Normalize
      const normalized = normalizeToCredentials(rawParsedResult.rows, detectedSource);
      setCredentials(normalized);
    }
  }, [rawParsedResult, detectedSource, targetPlatform, setCredentials]);

  // Re-validate whenever credentials change (from edits, deletions, or initial load)
  useEffect(() => {
    const issueWarnings = analyzeCredentials(credentials);
    setWarnings(issueWarnings);
  }, [credentials, setWarnings]);

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] text-slate-200 font-sans flex flex-col selection:bg-[var(--color-brand-primary)] selection:text-white">
      <SecurityBanner />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col">
        <Header />

        <div className="flex-1 w-full flex flex-col items-center">
          <AnimatePresence mode="wait">
            {/* Stage 1: Upload */}
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <UploadPanel />
            </motion.div>

            {/* Stage 2: Options & Validation */}
            {rawParsedResult && (
              <motion.div 
                key="options"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full"
              >
                <ManagerSelector />
                <ValidationPanel />
              </motion.div>
            )}

            {/* Stage 3: Preview & Download */}
            {credentials.length > 0 && (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full pb-20"
              >
                <StatsDashboard />
                <DownloadPanel />
                <PreviewTable />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="w-full text-center py-6 text-sm text-slate-500 border-t border-slate-800">
        <p>VaultShift • Local Processing Only • Zero Knowledge</p>
      </footer>
    </div>
  );
}

export default App;
