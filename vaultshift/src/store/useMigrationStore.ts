import { create } from 'zustand';
import type { MigrationState } from '../types';

export const useMigrationStore = create<MigrationState>((set) => ({
  file: null,
  rawParsedResult: null,
  detectedSource: 'Detecting...',
  targetPlatform: 'Proton Pass',
  credentials: [],
  warnings: [],
  isConverting: false,

  setFile: (file) => set({ file }),
  setRawParsedResult: (result, source) =>
    set({ rawParsedResult: result, detectedSource: source }),
  setTargetPlatform: (target) => set({ targetPlatform: target }),
  setCredentials: (credentials) => set({ credentials }),
  setWarnings: (warnings) => set({ warnings }),
  setIsConverting: (isConverting) => set({ isConverting }),
  resetAll: () =>
    set({
      file: null,
      rawParsedResult: null,
      detectedSource: 'Detecting...',
      credentials: [],
      warnings: [],
    }),
}));
