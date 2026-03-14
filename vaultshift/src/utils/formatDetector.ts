import type { Platform } from '../types';

export const detectFormat = (headers: string[]): Platform => {
  const h = headers.map(header => header.toLowerCase().trim());

  // Check unique Bitwarden signatures
  if (h.includes('login_uri') && h.includes('login_username') && h.includes('login_password')) {
    return 'Bitwarden';
  }

  // Check Proton Pass signatures
  if (h.length === 2 && h.includes('url') && h.includes('password')) {
    return 'Proton Pass';
  }

  // Check Dashlane signatures
  if (h.includes('secondarylogin') || h.includes('email')) {
    if (h.includes('url') && h.includes('username') && h.includes('password')) {
       return 'Dashlane';
    }
  }

  if (h.includes('url') && h.includes('username') && h.includes('email') && h.includes('password') && h.includes('title')) {
    return 'Dashlane';
  }
  
  // older or alternative dashlane export fields
  if (h.includes('website') && (h.includes('login') || h.includes('username')) && h.includes('password') && h.includes('name')) {
    return 'Dashlane';
  }

  // Check LastPass signatures
  if (h.includes('url') && h.includes('username') && h.includes('password') && h.includes('grouping')) {
    return 'LastPass';
  }

  // Check 1Password signatures (often Title, URL, Username, Password)
  if (h.includes('title') && h.includes('url') && h.includes('username') && h.includes('password') && !h.includes('grouping')) {
    return '1Password'; // Or iCloud Keychain
  }

  // Check Google Password Manager (name, url, username, password, note)
  if (h.includes('name') && h.includes('url') && h.includes('username') && h.includes('password') && h.includes('note') && !h.includes('type')) {
    return 'Google Password Manager';
  }

  // Default fallback or unknown
  return 'Unknown';
}
