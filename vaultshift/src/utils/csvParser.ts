import Papa from 'papaparse';
import type { ParseResult } from '../types';

export const parseCSV = (file: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        if (results.errors.length > 0) {
           console.warn('PapaParse encountered warnings:', results.errors);
        }
        const headers = results.meta.fields || [];
        resolve({
          headers,
          rows: results.data
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const parseStringCSV = (content: string): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(content, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        const headers = results.meta.fields || [];
        resolve({
          headers,
          rows: results.data
        });
      },
      error: (error: any) => {
        reject(error);
      }
    });
  });
};
