import { create } from 'zustand';
import type { MigrationState, Credential } from '../types';
import { encrypt, clearSession } from '../utils/crypto';

export const useMigrationStore = create<MigrationState>((set) => ({
  file: null,
  rawParsedResult: null,
  detectedSource: 'Detecting...',
  targetPlatform: 'Proton Pass',
  credentials: [],
  warnings: [],
  isConverting: false,

  setFile: (file) => set({ file }),
  setRawParsedResult: async (result, source) => {
    // Security: Encrypt originalData fields in rows before storing
    const encryptedRows = await Promise.all(result.rows.map(async row => {
      const encryptedRow: Record<string, string> = {};
      for (const [key, value] of Object.entries(row)) {
        encryptedRow[key] = await encrypt(value);
      }
      return encryptedRow;
    }));
    
    set({ 
      rawParsedResult: { ...result, rows: encryptedRows }, 
      detectedSource: source 
    });
  },
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
  clearAll: () => {
    clearSession();
    set({
      file: null,
      rawParsedResult: null,
      detectedSource: 'Detecting...',
      credentials: [],
      warnings: [],
      targetPlatform: 'Proton Pass',
    });
  },
}));
