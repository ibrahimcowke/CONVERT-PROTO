import type { Strength } from '../types';

export const checkPasswordStrength = (password?: string): Strength => {
  if (!password || password.trim() === '') return 'Empty';
  
  let score = 0;
  
  if (password.length > 8) score += 1;
  if (password.length > 12) score += 1;
  
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  if (score < 3) return 'Weak';
  if (score < 5) return 'Medium';
  return 'Strong';
};
