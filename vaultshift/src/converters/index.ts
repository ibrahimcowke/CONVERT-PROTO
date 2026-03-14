import type { Credential, Platform } from '../types';

const generateId = () => Math.random().toString(36).substring(2, 11);

const normalizeRow = (row: any) => {
  const normalized: any = {};
  for (const key in row) {
    // lowercase and remove non-alphanumeric to be super robust e.g. "Username 2" -> "username2"
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    normalized[normalizedKey] = row[key];
  }
  return normalized;
};

export const converters: Record<string, (row: any) => Credential | null> = {
  Dashlane: (row) => {
    const r = normalizeRow(row);
    // Dashlane headers typically: "url", "username", "username2", "email", "secondaryLogin", "password", "title", "note"
    if (!r.password && !r.username && !r.login && !r.email && !r.username2 && !r.secondarylogin) return null;
    
    // Pick a primary username for display, prioritizing in this order
    const username = r.username || r.email || r.login || r.secondarylogin || r.username2 || '';
    const url = r.url || r.website || '';
    
    return {
      id: generateId(),
      type: 'login',
      name: r.title || r.name || url || username || 'Untitled',
      url: url,
      username: username,
      password: r.password || '',
      note: r.note || r.notes || '',
      originalData: r, // Store the normalized data for the exporter to find keys easily
    };
  },
  'Proton Pass': (row) => {
    const url = row.url || row.URL || '';
    const password = row.password || row.Password || '';
    if (!password && !url) return null;
    return {
      id: generateId(),
      type: 'login',
      name: url || 'Untitled',
      url: url,
      username: '',
      password: password,
      note: '',
      originalData: row,
    };
  },
  Bitwarden: (row) => {
    // Bitwarden headers: "folder", "favorite", "type", "name", "notes", "fields", "reprompt", "login_uri", "login_username", "login_password", "login_totp"
    if (row.type !== 'login' && !row.login_password) return null;
    const username = row.login_username || '';
    const url = row.login_uri || '';
    return {
      id: generateId(),
      type: 'login',
      name: row.name || url || username || 'Untitled',
      url: url,
      username: username,
      password: row.login_password || '',
      note: row.notes || '',
      totp: row.login_totp || '',
      originalData: row,
    };
  },
  LastPass: (row) => {
    // Lastpass: "url", "username", "password", "totp", "extra", "name", "grouping", "fav"
    if (!row.password && !row.username) return null;
    const username = row.username || '';
    const url = row.url || '';
    return {
      id: generateId(),
      type: 'login',
      name: row.name || url || username || 'Untitled',
      url: url,
      username: username,
      password: row.password || '',
      note: row.extra || '',
      totp: row.totp || '',
      originalData: row,
    };
  },
  '1Password': (row) => {
    // 1Password: "Title", "URL", "Username", "Password", "Notes", "OTPAuth"
    const title = row.Title || row.title;
    const url = row.URL || row.url || '';
    const username = row.Username || row.username || '';
    const password = row.Password || row.password;
    if (!password && !username) return null;
    return {
      id: generateId(),
      type: 'login',
      name: title || url || username || 'Untitled',
      url: url,
      username: username,
      password: password || '',
      note: row.Notes || row.notes || '',
      totp: row.OTPAuth || row.otpauth || '',
      originalData: row,
    };
  },
  'Google Password Manager': (row) => {
    // Google: "name", "url", "username", "password", "note"
    if (!row.password && !row.username) return null;
    const username = row.username || '';
    const url = row.url || '';
    return {
      id: generateId(),
      type: 'login',
      name: row.name || url || username || 'Untitled',
      url: url,
      username: username,
      password: row.password || '',
      note: row.note || '',
      originalData: row,
    };
  },
  Unknown: (row) => {
    // Fallback best effort
    const url = row.url || row.website || row.URL || row.login_uri || '';
    const username = row.username || row.login || row.email || row.Username || '';
    const password = row.password || row.Password;
    if (!password && !username) return null;
    return {
      id: generateId(),
      type: 'login',
      name: row.name || row.title || row.Title || url || username || 'Untitled',
      url: url,
      username: username,
      password: password || '',
      note: row.note || row.notes || row.Notes || '',
      originalData: row,
    };
  }
};

const normalizeUrl = (url: string | undefined): string => {
  if (!url || typeof url !== 'string' || url.trim() === '') return '';
  let cleanUrl = url.trim().toLowerCase();
  
  // Proton pass absolutely hates just 'http://' or 'https://'
  if (cleanUrl === 'http://' || cleanUrl === 'https://') return '';
  
  // Basic validation - if it has no dot, it's likely a local network or garbage name. 
  // We'll pass it if it starts with http explicitly, but otherwise clear it.
  if (!cleanUrl.includes('.')) return '';

  return url.trim(); // Return original casing if valid
};

const normalizeTotp = (totp: string | undefined): string => {
  if (!totp || typeof totp !== 'string' || totp.trim() === '') return '';
  // TOTP secrets are base32. If there are weird chars or it's a full URI, Proton might choke.
  const clean = totp.trim();
  if (clean.startsWith('otpauth://')) return clean; // Native URI is usually fine
  // If it's just a raw secret, ensure it's alphanumeric base32 roughly
  if (/^[A-Z2-7=]+$/i.test(clean)) return clean;
  return ''; // Strip it to be safe
};

export const normalizeToCredentials = (rows: Record<string, string>[], sourcePlatform: Platform): Credential[] => {
  const converter = converters[sourcePlatform] || converters['Unknown'];
  return rows
    .map(row => {
      const cred = converter(row);
      if (cred) {
        cred.url = normalizeUrl(cred.url);
        cred.totp = normalizeTotp(cred.totp);
      }
      return cred;
    })
    .filter((cred): cred is Credential => cred !== null);
};
