import React, { useState, useMemo } from 'react';
import { useMigrationStore } from '../store/useMigrationStore';
import { Eye, EyeOff, LayoutList, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export const PreviewTable: React.FC = () => {
  const { credentials } = useMigrationStore();
  const [showPasswords, setShowPasswords] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  if (credentials.length === 0) return null;

  const filteredCredentials = useMemo(() => {
    if (!searchTerm.trim()) return credentials;
    const lowerQuery = searchTerm.toLowerCase();
    return credentials.filter(cred => 
      (cred.name && cred.name.toLowerCase().includes(lowerQuery)) ||
      (cred.url && cred.url.toLowerCase().includes(lowerQuery)) ||
      (cred.username && cred.username.toLowerCase().includes(lowerQuery)) ||
      (cred.note && cred.note.toLowerCase().includes(lowerQuery))
    );
  }, [credentials, searchTerm]);

  const totalPages = Math.ceil(filteredCredentials.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredCredentials.length);
  const currentData = filteredCredentials.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 bg-slate-800/80 rounded-xl shadow-lg border border-slate-700 overflow-hidden backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50 gap-4">
        
        <div className="flex items-center space-x-3 whitespace-nowrap">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <LayoutList className="w-5 h-5 text-[var(--color-brand-primary)]" />
          </div>
          <h3 className="font-semibold text-lg text-slate-100">Data Preview</h3>
        </div>
        
        <div className="flex-1 w-full max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        <button
          onClick={() => setShowPasswords(!showPasswords)}
          className="flex items-center justify-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg whitespace-nowrap w-full sm:w-auto"
        >
          {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showPasswords ? 'Hide Passwords' : 'Show Passwords'}</span>
        </button>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        {currentData.length > 0 ? (
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th scope="col" className="px-6 py-3 font-semibold w-[20%]">Name / Title</th>
                <th scope="col" className="px-6 py-3 font-semibold w-[20%]">URL</th>
                <th scope="col" className="px-6 py-3 font-semibold w-[15%]">Username</th>
                <th scope="col" className="px-6 py-3 font-semibold w-[15%]">Password</th>
                <th scope="col" className="px-6 py-3 font-semibold w-[30%]">Notes</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((cred) => (
                <tr key={cred.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white truncate max-w-xs" title={cred.name}>{cred.name}</td>
                  <td className="px-6 py-4 truncate max-w-xs" title={cred.url}>{cred.url}</td>
                  <td className="px-6 py-4 truncate max-w-[150px]" title={cred.username}>{cred.username}</td>
                  <td className="px-6 py-4 font-mono tracking-wider truncate max-w-[150px]">
                    {showPasswords ? cred.password : '••••••••'}
                  </td>
                  <td className="px-6 py-4 truncate max-w-sm text-slate-400" title={cred.note}>
                    {cred.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Search className="w-12 h-12 mb-4 text-slate-600 opacity-50" />
            <p className="text-lg">No entries found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-slate-700 bg-slate-800/50 gap-4">
        <div className="text-sm text-slate-400">
          Showing <span className="font-semibold text-white">{filteredCredentials.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-semibold text-white">{endIndex}</span> of <span className="font-semibold text-white">{filteredCredentials.length}</span> entries 
          {searchTerm && ` (filtered from ${credentials.length})`}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-sm text-slate-300 font-medium px-4">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
             <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
};
