import React from 'react';
import { BrainCircuit, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Smart Study <span className="text-indigo-600 dark:text-indigo-400">RAG</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold hidden sm:block">Personalized Learning Engine</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
           <div className="hidden md:flex items-center px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium border border-emerald-100 dark:border-emerald-800/50">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              System Operational
           </div>
           
           <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle Dark Mode"
           >
             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>
        </div>
      </div>
    </header>
  );
};