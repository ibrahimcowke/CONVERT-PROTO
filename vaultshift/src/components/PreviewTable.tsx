import React, { useState, useMemo } from 'react';
import { useMigrationStore } from '../store/useMigrationStore';
import { Eye, EyeOff, LayoutList, Search, ChevronLeft, ChevronRight, Edit2, Check, Trash2, AlertTriangle } from 'lucide-react';

export const PreviewTable: React.FC = () => {
  const { credentials, removeCredential, removeMultipleCredentials, updateCredential, warnings } = useMigrationStore();
  const [showPasswords, setShowPasswords] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWarnings, setFilterWarnings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const itemsPerPage = 50;

  if (credentials.length === 0) return null;

  const filteredCredentials = useMemo(() => {
    let result = credentials;
    
    if (filterWarnings) {
      const warningIds = new Set(warnings.map(w => w.id));
      result = result.filter(cred => warningIds.has(cred.id));
    }

    if (!searchTerm.trim()) return result;
    const lowerQuery = searchTerm.toLowerCase();
    
    return result.filter(cred => 
      (cred.name && cred.name.toLowerCase().includes(lowerQuery)) ||
      (cred.url && cred.url.toLowerCase().includes(lowerQuery)) ||
      (cred.username && cred.username.toLowerCase().includes(lowerQuery)) ||
      (cred.note && cred.note.toLowerCase().includes(lowerQuery))
    );
  }, [credentials, searchTerm, filterWarnings, warnings]);

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

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {selectedIds.size > 0 && (
            <button
              onClick={() => {
                removeMultipleCredentials(Array.from(selectedIds));
                setSelectedIds(new Set());
              }}
              className="flex items-center justify-center space-x-2 text-sm text-red-400 hover:text-white transition-colors bg-red-900/30 border border-red-700/50 px-3 py-2 rounded-lg whitespace-nowrap"
            >
              <span>Delete {selectedIds.size} selected</span>
            </button>
          )}

          <button
            onClick={() => setFilterWarnings(!filterWarnings)}
            className={`flex items-center justify-center space-x-2 text-sm transition-colors border px-3 py-2 rounded-lg whitespace-nowrap 
              ${filterWarnings 
                ? 'bg-orange-500/20 border-orange-500 text-orange-400' 
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'}`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{filterWarnings ? 'Showing Warnings' : 'Filter Warnings'}</span>
          </button>

          <button
            onClick={() => setShowPasswords(!showPasswords)}
            className="flex items-center justify-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg whitespace-nowrap"
          >
            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showPasswords ? 'Hide Passwords' : 'Show Passwords'}</span>
          </button>
        </div>
      </div>

      <div className="md:hidden overflow-hidden min-h-[400px]">
        {currentData.length > 0 ? (
          <div className="flex flex-col p-4 space-y-4">
            {currentData.map((cred) => (
              <div 
                key={cred.id} 
                className={`p-4 rounded-xl border transition-all ${
                  selectedIds.has(cred.id) 
                    ? 'bg-blue-500/10 border-blue-500/50' 
                    : 'bg-slate-900 border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                     <input 
                      type="checkbox" 
                      checked={selectedIds.has(cred.id)}
                      onChange={() => {
                        const newSelected = new Set(selectedIds);
                        if (newSelected.has(cred.id)) newSelected.delete(cred.id);
                        else newSelected.add(cred.id);
                        setSelectedIds(newSelected);
                      }}
                      className="rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500 w-5 h-5"
                    />
                    <div className="font-bold text-white text-lg truncate max-w-[200px]">
                       {editingId === cred.id ? (
                        <input 
                          className="bg-slate-800 border border-blue-500 rounded px-2 py-1 w-full text-white"
                          defaultValue={cred.name}
                          autoFocus
                          onBlur={(e) => {
                            updateCredential(cred.id, { name: e.target.value });
                            setEditingId(null);
                          }}
                        />
                      ) : cred.name}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                     <button 
                        onClick={() => setEditingId(editingId === cred.id ? null : cred.id)}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                      >
                        {editingId === cred.id ? <Check className="w-5 h-5 text-green-500" /> : <Edit2 className="w-5 h-5" />}
                      </button>
                      <button 
                        onClick={() => removeCredential(cred.id)}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-slate-400">
                    <span className="w-20 font-semibold text-[10px] uppercase tracking-wider">URL:</span>
                    <span className="truncate text-blue-400">
                      {editingId === cred.id ? (
                        <input className="bg-slate-800 border-slate-700 rounded px-2 py-1 w-full" defaultValue={cred.url} onBlur={(e) => updateCredential(cred.id, { url: e.target.value })} />
                      ) : cred.url || '---'}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <span className="w-20 font-semibold text-[10px] uppercase tracking-wider">User:</span>
                    <span className="truncate">
                      {editingId === cred.id ? (
                        <input className="bg-slate-800 border-slate-700 rounded px-2 py-1 w-full" defaultValue={cred.username} onBlur={(e) => updateCredential(cred.id, { username: e.target.value })} />
                      ) : cred.username || '---'}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <span className="w-20 font-semibold text-[10px] uppercase tracking-wider">Pass:</span>
                    <span className="font-mono tracking-widest text-xs">
                      {showPasswords ? cred.password : '••••••••'}
                    </span>
                  </div>
                  <div className="flex items-start text-slate-500 mt-2 bg-slate-800/50 p-2 rounded text-xs italic">
                     {editingId === cred.id ? (
                        <textarea className="bg-transparent border-none w-full outline-none focus:ring-0 resize-none h-12" defaultValue={cred.note} onBlur={(e) => updateCredential(cred.id, { note: e.target.value })} />
                      ) : cred.note || 'No notes available'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Search className="w-12 h-12 mb-4 text-slate-600 opacity-50" />
            <p className="text-lg">No entries found</p>
          </div>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto min-h-[400px]">
        {currentData.length > 0 ? (
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th scope="col" className="px-6 py-3 font-semibold w-[40px]">
                  <input 
                    type="checkbox" 
                    checked={currentData.length > 0 && currentData.every(c => selectedIds.has(c.id))}
                    onChange={(e) => {
                      const newSelected = new Set(selectedIds);
                      currentData.forEach(c => {
                        if (e.target.checked) newSelected.add(c.id);
                        else newSelected.delete(c.id);
                      });
                      setSelectedIds(newSelected);
                    }}
                    className="rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
                  />
                </th>
                <th scope="col" className="px-6 py-3 font-semibold w-[20%]">Name / Title</th>
                <th scope="col" className="px-6 py-3 font-semibold w-[20%]">URL</th>
                <th scope="col" className="px-6 py-3 font-semibold w-[15%]">Username</th>
                <th scope="col" className="px-6 py-3 font-semibold w-[15%]">Password</th>
                <th scope="col" className="px-6 py-3 font-semibold w-[25%]">Notes</th>
                <th scope="col" className="px-6 py-3 font-semibold w-[5%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((cred) => (
                <tr key={cred.id} className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${selectedIds.has(cred.id) ? 'bg-blue-500/10' : ''}`}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(cred.id)}
                      onChange={() => {
                        const newSelected = new Set(selectedIds);
                        if (newSelected.has(cred.id)) newSelected.delete(cred.id);
                        else newSelected.add(cred.id);
                        setSelectedIds(newSelected);
                      }}
                      className="rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-white truncate max-w-xs" title={cred.name}>
                    {editingId === cred.id ? (
                      <input 
                        className="bg-slate-900 border border-blue-500 rounded px-2 py-1 w-full text-white"
                        defaultValue={cred.name}
                        autoFocus
                        onBlur={(e) => {
                          updateCredential(cred.id, { name: e.target.value });
                          setEditingId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateCredential(cred.id, { name: e.currentTarget.value });
                            setEditingId(null);
                          }
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                    ) : (
                      cred.name
                    )}
                  </td>
                  <td className="px-6 py-4 truncate max-w-xs" title={cred.url}>
                    {editingId === cred.id ? (
                      <input 
                        className="bg-slate-900 border border-blue-500 rounded px-2 py-1 w-full text-slate-300"
                        defaultValue={cred.url}
                        onBlur={(e) => updateCredential(cred.id, { url: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateCredential(cred.id, { url: e.currentTarget.value });
                            setEditingId(null);
                          }
                        }}
                      />
                    ) : (
                      cred.url
                    )}
                  </td>
                  <td className="px-6 py-4 truncate max-w-[150px]" title={cred.username}>
                    {editingId === cred.id ? (
                      <input 
                        className="bg-slate-900 border border-blue-500 rounded px-2 py-1 w-full text-slate-300"
                        defaultValue={cred.username}
                        onBlur={(e) => updateCredential(cred.id, { username: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateCredential(cred.id, { username: e.currentTarget.value });
                            setEditingId(null);
                          }
                        }}
                      />
                    ) : (
                      cred.username
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono tracking-wider truncate max-w-[150px]">
                    {showPasswords ? cred.password : '••••••••'}
                  </td>
                  <td className="px-6 py-4 truncate max-w-sm text-slate-400" title={cred.note}>
                    {editingId === cred.id ? (
                      <input 
                        className="bg-slate-900 border border-blue-500 rounded px-2 py-1 w-full text-slate-400"
                        defaultValue={cred.note}
                        onBlur={(e) => updateCredential(cred.id, { note: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateCredential(cred.id, { note: e.currentTarget.value });
                            setEditingId(null);
                          }
                        }}
                      />
                    ) : (
                      cred.note
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                       <button 
                        onClick={() => setEditingId(editingId === cred.id ? null : cred.id)}
                        className="text-slate-400 hover:text-white p-1 transition-colors"
                        title={editingId === cred.id ? "Done Editing" : "Edit Entry"}
                      >
                        {editingId === cred.id ? <Check className="w-4 h-4 text-green-500" /> : <Edit2 className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => removeCredential(cred.id)}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
