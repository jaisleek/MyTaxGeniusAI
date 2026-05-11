import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import {
  Folder,
  FileText,
  UploadCloud,
  Download,
  Trash2,
  Plus,
  Search,
  MoreVertical,
  X,
  File,
  FileImage,
  FileSpreadsheet
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'sheet' | 'doc';
  size: string;
  updatedAt: string;
}

interface VaultFolder {
  id: string;
  name: string;
  documents: Document[];
}

const initialFolders: VaultFolder[] = [
  {
    id: 'f1',
    name: 'Tax Clearance Certificates',
    documents: [
      { id: 'd1', name: 'TCC_2024_Q1.pdf', type: 'pdf', size: '1.2 MB', updatedAt: 'Oct 12, 2024' },
      { id: 'd2', name: 'TCC_2023_Annual.pdf', type: 'pdf', size: '2.4 MB', updatedAt: 'Jan 15, 2024' }
    ]
  },
  {
    id: 'f2',
    name: 'Invoices & Receipts',
    documents: [
      { id: 'd3', name: 'TechCorp_Invoice_Oct.pdf', type: 'pdf', size: '450 KB', updatedAt: 'Oct 28, 2024' },
      { id: 'd4', name: 'Office_Supplies_Receipt.jpg', type: 'image', size: '1.8 MB', updatedAt: 'Nov 02, 2024' }
    ]
  },
  {
    id: 'f3',
    name: 'Company Registration',
    documents: [
      { id: 'd5', name: 'CAC_Certificate.pdf', type: 'pdf', size: '3.1 MB', updatedAt: 'Mar 10, 2023' },
      { id: 'd6', name: 'Memart.doc', type: 'doc', size: '5.2 MB', updatedAt: 'Mar 10, 2023' }
    ]
  }
];

export default function Vault() {
  const [folders, setFolders] = useState<VaultFolder[]>(initialFolders);
  const [activeFolderId, setActiveFolderId] = useState<string>(initialFolders[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  // Clear selection when folder changes
  React.useEffect(() => {
    setSelectedDocumentIds([]);
  }, [activeFolderId]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const activeFolder = folders.find(f => f.id === activeFolderId) || folders[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      // Reset input to allow adding same file again if desired
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removePendingFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };
  
  const confirmUpload = () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    
    setTimeout(() => {
      const newDocs: Document[] = selectedFiles.map((file, index) => {
        let ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
        if (!['pdf', 'docx', 'xlsx', 'jpg', 'png'].includes(ext)) {
          ext = 'pdf'; // fallback to pdf for unknown icon types
        }
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        const displaySize = sizeMB === '0.0' ? `${(file.size / 1024).toFixed(1)} KB` : `${sizeMB} MB`;

        return {
          id: `d${Date.now()}_${index}`,
          name: file.name,
          type: ext as any,
          size: displaySize,
          updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        };
      });
      
      setFolders(folders.map(f => {
        if (f.id === activeFolderId) {
          return { ...f, documents: [...f.documents, ...newDocs] };
        }
        return f;
      }));
      
      setIsUploading(false);
      setIsUploadModalOpen(false);
      setSelectedFiles([]); // clear after successful upload
    }, 1500);
  };

  const handleQuickAddFolder = () => {
    const newFolder: VaultFolder = {
      id: `f${Date.now()}`,
      name: `New Folder ${folders.length + 1}`,
      documents: []
    };
    setFolders([...folders, newFolder]);
    setActiveFolderId(newFolder.id);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: VaultFolder = {
      id: `f${Date.now()}`,
      name: newFolderName.trim(),
      documents: []
    };
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setIsCreateFolderModalOpen(false);
    setActiveFolderId(newFolder.id);
  };

  const handleDeleteFolder = (folderId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (folders.length <= 1) {
      alert("You cannot delete the last folder.");
      return;
    }
    const updatedFolders = folders.filter(f => f.id !== folderId);
    setFolders(updatedFolders);
    if (activeFolderId === folderId) {
      setActiveFolderId(updatedFolders[0].id);
    }
  };

  const handleDownloadDocument = (doc: Document) => {
    const docPdf = new jsPDF();
    docPdf.text('MyTaxGeniusAI Digital Vault', 20, 20);
    docPdf.text(`Document Name: ${doc.name}`, 20, 30);
    docPdf.text(`Document Type: ${doc.type.toUpperCase()}`, 20, 40);
    docPdf.text(`Size: ${doc.size}`, 20, 50);
    docPdf.text(`Updated At: ${doc.updatedAt}`, 20, 60);
    
    // Download the document as PDF
    const safeName = doc.name.replace(/\.[^/.]+$/, "");
    docPdf.save(`${safeName}.pdf`);
  };

  const handleDeleteDocument = (docId: string) => {
    setFolders(folders.map(f => {
      if (f.id === activeFolderId) {
        return { ...f, documents: f.documents.filter(d => d.id !== docId) };
      }
      return f;
    }));
    setSelectedDocumentIds(prev => prev.filter(id => id !== docId));
  };

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocumentIds(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const handleBulkDelete = () => {
    if (selectedDocumentIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedDocumentIds.length} document(s)?`)) {
      setFolders(folders.map(f => {
        if (f.id === activeFolderId) {
          return { ...f, documents: f.documents.filter(d => !selectedDocumentIds.includes(d.id)) };
        }
        return f;
      }));
      setSelectedDocumentIds([]);
    }
  };

  const getFileIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf': return <FileText className="w-8 h-8 text-red-500" />;
      case 'image': return <FileImage className="w-8 h-8 text-emerald-500" />;
      case 'sheet': return <FileSpreadsheet className="w-8 h-8 text-emerald-600" />;
      case 'doc': return <File className="w-8 h-8 text-blue-500" />;
      default: return <File className="w-8 h-8 text-slate-500" />;
    }
  };

  const filteredDocuments = activeFolder.documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 font-sans">
      {/* Sidebar Folders */}
      <div className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Digital Vault</h2>
          <button 
            onClick={handleQuickAddFolder}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors mb-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Folder
          </button>
          
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Your Folders</p>
            {folders.map(folder => (
              <div key={folder.id} className="relative group w-full flex items-center">
                <button
                  onClick={() => setActiveFolderId(folder.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors pr-10 ${
                    activeFolderId === folder.id 
                      ? 'bg-emerald-50 text-emerald-700 font-bold' 
                      : 'text-slate-600 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <Folder className={`w-5 h-5 mr-3 shrink-0 ${activeFolderId === folder.id ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <span className="truncate">{folder.name}</span>
                  <span className="ml-auto text-xs bg-white/50 px-2 py-0.5 rounded-full border border-slate-100 flex-shrink-0 group-hover:hidden">
                    {folder.documents.length}
                  </span>
                </button>
                <button 
                  onClick={(e) => handleDeleteFolder(folder.id, e)}
                  className="absolute right-2 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg hidden group-hover:flex transition-colors"
                  title="Delete Folder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Arena */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mr-4">
              <Folder className="w-6 h-6 text-emerald-600 fill-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900">{activeFolder.name}</h1>
                <button 
                  onClick={() => handleDeleteFolder(activeFolder.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Folder"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-500 font-medium text-sm">{activeFolder.documents.length} documents stored safely</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search documents..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm font-medium transition-all outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>
            {selectedDocumentIds.length > 0 && (
              <button 
                onClick={handleBulkDelete}
                className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center shrink-0 shadow-sm"
              >
                <Trash2 className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">Delete ({selectedDocumentIds.length})</span>
              </button>
            )}
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center shrink-0 shadow-sm"
            >
              <UploadCloud className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:inline">Upload</span>
            </button>
          </div>
        </header>

        {/* Document Grid */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50/50">
          {filteredDocuments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No documents found</h3>
              <p className="text-slate-500 font-medium mb-8">This folder is empty or no documents match your search.</p>
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-6 py-3 rounded-xl font-bold transition-colors flex items-center"
              >
                <UploadCloud className="w-5 h-5 mr-2" />
                Upload your first document
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDocuments.map(doc => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={doc.id}
                  onClick={() => toggleDocumentSelection(doc.id)}
                  className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group relative cursor-pointer ${
                    selectedDocumentIds.includes(doc.id) ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10' : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-slate-50 p-3 rounded-xl relative">
                      {selectedDocumentIds.includes(doc.id) && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                      {getFileIcon(doc.type)}
                    </div>
                    <div className={`flex items-center space-x-1 transition-opacity ${selectedDocumentIds.includes(doc.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDownloadDocument(doc); }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download as PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteDocument(doc.id); }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm truncate mb-1" title={doc.name}>{doc.name}</h4>
                    <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider space-x-2">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.updatedAt}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h3 className="text-xl font-black text-slate-900">Upload Document</h3>
                <button 
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setSelectedFiles([]);
                  }} 
                  className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                />
                
                {selectedFiles.length > 0 ? (
                  <div className="mb-6 space-y-3 max-h-48 overflow-y-auto">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <span className="text-sm font-bold text-slate-700 truncate">{file.name}</span>
                        </div>
                        <button 
                          onClick={() => removePendingFile(idx)} 
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={isUploading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => !isUploading && fileInputRef.current?.click()}
                      className="w-full py-3 border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl text-sm font-bold text-emerald-600 transition-colors flex items-center justify-center bg-emerald-50/10"
                      disabled={isUploading}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add More Files
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isUploading ? 'bg-emerald-50 border-emerald-500 opacity-50 cursor-wait' : 'bg-slate-50 hover:bg-emerald-50/30'} group mb-6`}
                  >
                    <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {isUploading ? (
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <UploadCloud className="w-8 h-8 text-emerald-500" />
                      )}
                    </div>
                    <p className="font-bold text-slate-900 mb-1">
                      {isUploading ? 'Uploading...' : 'Click to browse or drag file here'}
                    </p>
                    <p className="text-xs font-medium text-slate-500">Supports PDF, DOCX, JPG, PNG (Max 10MB)</p>
                  </div>
                )}

                <div className="flex flex-col space-y-3">
                  {selectedFiles.length > 0 && (
                    <button 
                      onClick={confirmUpload}
                      disabled={isUploading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm uppercase tracking-wide text-sm flex items-center justify-center"
                    >
                      {isUploading ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> Uploading...</>
                      ) : (
                        `Upload ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}`
                      )}
                    </button>
                  )}
                  {!isUploading && (
                    <button 
                      onClick={() => {
                        setIsUploadModalOpen(false);
                        setSelectedFiles([]); // clear when closed
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-colors shadow-sm uppercase tracking-wide text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isCreateFolderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h3 className="text-xl font-black text-slate-900">New Folder</h3>
                <button onClick={() => setIsCreateFolderModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">Folder Name</label>
                <input 
                  type="text" 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Q3 Receipts"
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl outline-none font-medium transition-all mb-6"
                />
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setIsCreateFolderModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreateFolder}
                    disabled={!newFolderName.trim()}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
