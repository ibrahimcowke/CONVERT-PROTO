export type Platform =
  | 'Detecting...'
  | 'Dashlane'
  | 'Bitwarden'
  | 'LastPass'
  | '1Password'
  | 'Google Password Manager'
  | 'iCloud Keychain'
  | 'Proton Pass'
  | 'Unknown';

export interface Credential {
  id: string; // Internal unique ID for tracking
  type: 'login' | 'card' | 'note' | 'identity';
  name: string;
  url: string;
  username: string;
  password?: string;
  note?: string;
  totp?: string;
  originalData?: Record<string, string>; // Store original row for debugging/lossless if needed
}

export type Strength = 'Weak' | 'Medium' | 'Strong' | 'Empty';

export interface DataWarning {
  id: string; // related credential id if applicable
  message: string;
  severity: 'warning' | 'danger';
}

export interface ParseResult {
  headers: string[];
  rows: Record<string, string>[];
}

export interface MigrationState {
  file: File | null;
  rawParsedResult: ParseResult | null;
  detectedSource: Platform;
  targetPlatform: Platform;
  credentials: Credential[];
  warnings: DataWarning[];
  isConverting: boolean;

  setFile: (file: File | null) => void;
  setRawParsedResult: (result: ParseResult, source: Platform) => void;
  setTargetPlatform: (target: Platform) => void;
  setCredentials: (creds: Credential[]) => void;
  setWarnings: (warnings: DataWarning[]) => void;
  setIsConverting: (status: boolean) => void;
  resetAll: () => void;
}
