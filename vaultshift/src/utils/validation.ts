import type { Credential, DataWarning } from '../types';
import { checkPasswordStrength } from './passwordStrength';

export const analyzeCredentials = (credentials: Credential[]): DataWarning[] => {
  const warnings: DataWarning[] = [];
  const seenSignatures = new Set<string>();

  credentials.forEach(cred => {
    // Check Missing Passwords
    if (!cred.password || cred.password.trim() === '') {
      warnings.push({
        id: cred.id,
        message: `Missing password for "${cred.name || cred.username || 'Unknown'}"`,
        severity: 'danger'
      });
    } else {
      // Check Weak Passwords
      const strength = checkPasswordStrength(cred.password);
      if (strength === 'Weak') {
        warnings.push({
          id: cred.id,
          message: `Weak password detected for "${cred.name || cred.username}"`,
          severity: 'warning'
        });
      }
    }

    // Check Invalid URLs (Basic)
    if (cred.url && cred.url.trim() !== '') {
      if (!cred.url.startsWith('http://') && !cred.url.startsWith('https://') && !cred.url.includes('.')) {
        warnings.push({
          id: cred.id,
          message: `Malformed URL "${cred.url}" for entry "${cred.name}"`,
          severity: 'warning'
        });
      }
    }

    // Check Duplicates based on URL + Username combination
    if (cred.username) {
      const signature = `${cred.url?.toLowerCase()}|${cred.username.toLowerCase()}`;
      if (seenSignatures.has(signature)) {
        warnings.push({
          id: cred.id,
          message: `Duplicate entry detected: ${cred.name || cred.url} (${cred.username})`,
          severity: 'warning'
        });
      } else {
        seenSignatures.add(signature);
      }
    }
  });

  return warnings;
};
