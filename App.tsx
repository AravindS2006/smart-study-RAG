import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { IngestionPanel } from './components/IngestionPanel';
import { ChatPanel } from './components/ChatPanel';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { ResumeGuide } from './components/ResumeGuide';
import { StudyMaterial, TopicData, Message, AppState } from './types';
import { analyzeStudyMaterial, generateRAGResponse } from './services/geminiService';
import { FileText, MessageSquare, BarChart3, GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ingest' | 'chat' | 'analytics' | 'resume'>('ingest');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Initialize state
  const [appState, setAppState] = useState<AppState>({
    materials: [],
    isProcessing: false,
    topics: [],
    chatHistory: [
      {
        role: 'model',
        content: 'Hello! I am your AI Tutor. Upload your notes (TXT, MD, CSV, JSON, Code) in the Ingestion tab to get started.',
        timestamp: new Date()
      }
    ]
  });

  // Check system preference on mount
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  const handleMaterialAdd = useCallback(async (content: string, fileName: string) => {
    setAppState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const newMaterial: StudyMaterial = {
        id: Date.now().toString(),
        title: fileName,
        content: content,
        timestamp: new Date()
      };

      const allContent = [...appState.materials, newMaterial].map(m => m.content).join('\n\n');
      const analysis = await analyzeStudyMaterial(allContent);

      setAppState(prev => ({
        ...prev,
        materials: [...prev.materials, newMaterial],
        topics: analysis.topics,
        isProcessing: false
      }));
      
      setActiveTab('chat');
    } catch (error) {
      console.error("Failed to process material:", error);
      setAppState(prev => ({ ...prev, isProcessing: false }));
      alert("Failed to analyze material. Please try again.");
    }
  }, [appState.materials]);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() };
    setAppState(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, userMsg]
    }));

    try {
      const context = appState.materials.map(m => m.content).join('\n\n');
      const responseText = await generateRAGResponse(text, context, appState.chatHistory);

      const modelMsg: Message = { role: 'model', content: responseText, timestamp: new Date() };
      setAppState(prev => ({
        ...prev,
        chatHistory: [...prev.chatHistory, modelMsg]
      }));
    } catch (error) {
      console.error("RAG Generation failed:", error);
      const errorMsg: Message = { role: 'model', content: "I encountered an error. Please try again.", timestamp: new Date(), isError: true };
      setAppState(prev => ({
        ...prev,
        chatHistory: [...prev.chatHistory, errorMsg]
      }));
    }
  }, [appState.materials, appState.chatHistory]);

  const renderContent = () => {
    switch (activeTab) {
      case 'ingest':
        return <IngestionPanel onMaterialAdd={handleMaterialAdd} isProcessing={appState.isProcessing} materials={appState.materials} />;
      case 'chat':
        return <ChatPanel messages={appState.chatHistory} onSendMessage={handleSendMessage} hasMaterials={appState.materials.length > 0} />;
      case 'analytics':
        return <AnalyticsPanel topics={appState.topics} materialCount={appState.materials.length} isDarkMode={isDarkMode} />;
      case 'resume':
        return <ResumeGuide isDarkMode={isDarkMode} />;
      default:
        return null;
    }
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
        <Header isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
        
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 z-10 relative">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 flex flex-col space-y-3">
            <NavButton 
              active={activeTab === 'ingest'} 
              onClick={() => setActiveTab('ingest')} 
              icon={<FileText size={20} />} 
              label="Knowledge Base" 
              desc="Upload & Index"
            />
            <NavButton 
              active={activeTab === 'chat'} 
              onClick={() => setActiveTab('chat')} 
              icon={<MessageSquare size={20} />} 
              label="Smart Tutor" 
              desc="Interactive RAG Chat"
            />
            <NavButton 
              active={activeTab === 'analytics'} 
              onClick={() => setActiveTab('analytics')} 
              icon={<BarChart3 size={20} />} 
              label="Insights" 
              desc="Topic Graph"
            />
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-4 mx-2" />
            <NavButton 
              active={activeTab === 'resume'} 
              onClick={() => setActiveTab('resume')} 
              icon={<GraduationCap size={20} />} 
              label="Project Info" 
              desc="For Reviewers"
              special
            />
          </aside>

          {/* Main Content Area */}
          <section className="lg:col-span-9 glass-card rounded-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden h-[80vh] lg:h-[85vh] flex flex-col relative shadow-xl transition-all duration-300">
            {renderContent()}
          </section>
        </main>

        {/* Ambient Background Glow */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-0">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-teal-500/10 dark:bg-teal-500/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
};

const NavButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  desc: string;
  special?: boolean;
}> = ({ active, onClick, icon, label, desc, special }) => (
  <button
    onClick={onClick}
    className={`flex items-center p-4 rounded-2xl transition-all duration-300 text-left group relative overflow-hidden
      ${active 
        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20 translate-x-1' 
        : 'bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-white/20 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900'
      }
      ${special && !active ? 'border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10 text-indigo-700 dark:text-indigo-300' : ''}
    `}
  >
    <div className={`p-2.5 rounded-xl mr-4 transition-colors duration-300 ${active ? 'bg-white/20 backdrop-blur-sm' : 'bg-slate-100 dark:bg-slate-900 group-hover:scale-110'}`}>
      {icon}
    </div>
    <div className="z-10">
      <div className="font-bold text-sm tracking-wide">{label}</div>
      <div className={`text-xs mt-0.5 ${active ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'}`}>{desc}</div>
    </div>
  </button>
);

export default App;