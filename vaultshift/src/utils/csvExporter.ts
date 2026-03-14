import Papa from 'papaparse';
import type { Credential, Platform } from '../types';

export const generateExportCSV = (credentials: Credential[], targetPlatform: Platform): string => {
  let headers: string[] = [];
  let rows: any[] = [];

  switch (targetPlatform) {
    case 'Proton Pass':
      // Proton Pass is very strict about header names. Using official template keywords:
      // title, website, login, password, notes, otpSecret
      headers = ['title', 'website', 'login', 'password', 'notes'];
      rows = credentials.map(c => {
        const orig = c.originalData || {};
        const usernameFields = ['username', 'email', 'login', 'secondarylogin', 'username2', 'secondaryusername', 'alias'];
        
        // Use the primary username identified during conversion
        const primaryLogin = c.username;
        
        // Collect ALL other unique identifiers found in original data
        const secondaryLogins = new Set<string>();
        usernameFields.forEach(field => {
          const val = orig[field];
          if (val && typeof val === 'string' && val.trim() && val.trim() !== primaryLogin) {
            secondaryLogins.add(val.trim());
          }
        });
        
        // Construct the note with secondary logins
        const loginList = Array.from(secondaryLogins);
        const usernamesNote = loginList.map(l => `Alt Login: ${l}`).join(' | ');
        
        let finalNote = usernamesNote;
        if (c.note) {
          finalNote = finalNote ? `${finalNote}\n---\n${c.note}` : c.note;
        }

        return [
          c.name || c.url || 'Untitled',
          c.url || '',
          primaryLogin,
          c.password || '',
          finalNote
        ];
      });
      break;
    case 'Bitwarden':
      headers = ['folder', 'favorite', 'type', 'name', 'notes', 'login_uri', 'login_username', 'login_password', 'login_totp'];
      rows = credentials.map(c => [
        '', // folder
        '0', // favorite
        'login', // type
        c.name || 'Untitled',
        c.note || '',
        c.url || '',
        c.username || '',
        c.password || '',
        c.totp || ''
      ]);
      break;
    case 'Dashlane':
      headers = ['url', 'username', 'secondaryLogin', 'password', 'title'];
      rows = credentials.map(c => {
        const orig = c.originalData || {};
        // Preservation using normalized keys from converter
        const originalUser = orig.username || orig.login || c.username || '';
        const originalSec = orig.secondarylogin || orig.username2 || '';
        
        return [
          c.url || '',
          originalUser,
          originalSec,
          c.password || '',
          c.name || 'Untitled'
        ];
      });
      break;
    case '1Password':
      headers = ['Title', 'URL', 'Username', 'Password', 'Notes', 'OTPAuth'];
      rows = credentials.map(c => [
        c.name || 'Untitled',
        c.url || '',
        c.username || '',
        c.password || '',
        c.note || '',
        c.totp || ''
      ]);
      break;
    default:
      // Generic fallback
      headers = ['name', 'url', 'username', 'password', 'note'];
      rows = credentials.map(c => [
        c.name || 'Untitled',
        c.url || '',
        c.username || '',
        c.password || '',
        c.note || ''
      ]);
      break;
  }

  // Combine headers and rows
  const data = [headers, ...rows];
  
  return Papa.unparse(data);
};

export const downloadFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Cleanup
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
