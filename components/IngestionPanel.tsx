import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, FileCode, FileJson, Database } from 'lucide-react';
import { StudyMaterial } from '../types';

interface IngestionPanelProps {
  onMaterialAdd: (content: string, title: string) => void;
  isProcessing: boolean;
  materials: StudyMaterial[];
}

export const IngestionPanel: React.FC<IngestionPanelProps> = ({ onMaterialAdd, isProcessing, materials }) => {
  const [textInput, setTextInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    onMaterialAdd(textInput, `Snippet - ${new Date().toLocaleTimeString()}`);
    setTextInput('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onMaterialAdd(content, file.name);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  return (
    <div className="flex flex-col h-full p-6 lg:p-8 overflow-y-auto scrollbar-thin bg-white/50 dark:bg-slate-900/50">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Knowledge Base Ingestion</h2>
        <p className="text-slate-500 dark:text-slate-400">Upload lecture notes, code files, or documentation to build your RAG index.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Input Section */}
        <div className="space-y-6 flex flex-col">
          
          {/* Drag & Drop Zone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden
              ${isDragging 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.01]' 
                : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }
            `}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".txt,.md,.json,.csv,.js,.jsx,.ts,.tsx,.py,.html,.css" 
              onChange={handleFileUpload} 
            />
            
            <div className={`p-5 rounded-full mb-5 transition-transform duration-300 ${isDragging ? 'scale-110 bg-indigo-100 dark:bg-indigo-800' : 'bg-indigo-50 dark:bg-slate-800 group-hover:scale-110'}`}>
              <Upload className={`w-8 h-8 ${isDragging ? 'text-indigo-600 dark:text-indigo-300' : 'text-indigo-500 dark:text-indigo-400'}`} />
            </div>
            
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">Upload Study Material</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs">
              Drag & drop or click to browse
            </p>
            
            <div className="mt-4 flex gap-2 flex-wrap justify-center">
              {['TXT', 'MD', 'JSON', 'CSV', 'CODE'].map(ext => (
                <span key={ext} className="px-2 py-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700">
                  {ext}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-slate-400 dark:text-slate-500 font-medium">OR PASTE TEXT</span>
            </div>
          </div>

          {/* Text Input Area */}
          <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-1 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all flex flex-col">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste your notes, code snippets, or raw text here..."
              className="w-full flex-1 p-4 resize-none focus:outline-none bg-transparent text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-sm leading-relaxed"
            />
            <div className="flex justify-between items-center px-4 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-b-xl border-t border-slate-100 dark:border-slate-700/50">
              <span className="text-xs text-slate-400">{textInput.length} chars</span>
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim() || isProcessing}
                className="bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-slate-900/20 dark:shadow-indigo-600/20"
              >
                {isProcessing ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                {isProcessing ? 'Indexing...' : 'Process Text'}
              </button>
            </div>
          </div>
        </div>

        {/* Processed Materials List */}
        <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center">
              <Database className="w-4 h-4 mr-2 text-indigo-500" />
              Active Index
            </h3>
            <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
              {materials.length} Documents
            </span>
          </div>

          {materials.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl m-2">
              <AlertCircle className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">Index is empty</p>
              <p className="text-xs mt-1 opacity-70">Upload content to start</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {materials.map((material) => (
                <div key={material.id} className="group bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all hover:border-indigo-300 dark:hover:border-indigo-700">
                  <div className="flex items-start">
                    <div className="mt-1 mr-3">
                      {material.title.endsWith('.json') ? <FileJson className="w-5 h-5 text-orange-500" /> : 
                       material.title.match(/\.(js|ts|py|html|css)$/) ? <FileCode className="w-5 h-5 text-blue-500" /> :
                       <FileText className="w-5 h-5 text-indigo-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{material.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 font-mono bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded">
                        {material.content.substring(0, 100)}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                         <div className="flex space-x-2">
                           <span className="text-[10px] bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded border border-green-100 dark:border-green-900/30 flex items-center">
                             <CheckCircle className="w-3 h-3 mr-1" /> Indexed
                           </span>
                         </div>
                         <span className="text-[10px] text-slate-400">{new Date(material.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};