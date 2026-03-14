import { create } from 'zustand';
import type { MigrationState, Credential } from '../types';

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
  updateCredential: (id: string, updates: Partial<Credential>) => set((state) => ({
    credentials: state.credentials.map((c): Credential => c.id === id ? { ...c, ...updates } : c)
  })),
  removeCredential: (id: string) => set((state) => ({
    credentials: state.credentials.filter(c => c.id !== id)
  })),
  removeMultipleCredentials: (ids: string[]) => set((state) => ({
    credentials: state.credentials.filter(c => !ids.includes(c.id))
  })),
  resetAll: () =>
    set({
      file: null,
      rawParsedResult: null,
      detectedSource: 'Detecting...',
      credentials: [],
      warnings: [],
    }),
}));
