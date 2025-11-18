import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  hasMaterials: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, hasMaterials }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
        setIsTyping(true);
    } else {
        setIsTyping(false);
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-end ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 flex-shrink-0 shadow-lg shadow-indigo-500/20 mb-1">
                <Bot className="text-white w-5 h-5" />
              </div>
            )}
            
            <div className={`max-w-[85%] lg:max-w-[75%] rounded-2xl px-6 py-4 shadow-md ${
              msg.role === 'user' 
                ? 'bg-slate-900 dark:bg-indigo-600 text-white rounded-br-sm' 
                : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm'
            }`}>
              {msg.isError ? (
                 <div className="text-red-500 dark:text-red-400 font-medium flex items-center">
                   <span className="mr-2">⚠️</span> {msg.content}
                 </div>
              ) : (
                <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'dark:prose-invert'}`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center ml-3 flex-shrink-0 mb-1">
                <User className="text-slate-600 dark:text-slate-300 w-5 h-5" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
           <div className="flex items-end animate-in fade-in duration-300">
               <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 flex-shrink-0 shadow-lg shadow-indigo-500/20 mb-1">
                <Sparkles className="text-white w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center space-x-1.5">
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
           </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Floating Input Area */}
      <div className="p-6 pt-2">
        <form onSubmit={handleSubmit} className="relative flex items-center shadow-2xl rounded-full group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!hasMaterials && messages.length > 1}
            placeholder={hasMaterials ? "Ask about your notes..." : "Upload materials to enable chat..."}
            className="w-full bg-white dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500/30 dark:focus:border-indigo-500/50 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-full py-4 pl-6 pr-16 focus:outline-none transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-900"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || (!hasMaterials && messages.length > 1)}
            className="absolute right-2 p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all transform hover:scale-105 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:scale-100 shadow-lg shadow-indigo-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        {!hasMaterials && messages.length > 1 && (
          <div className="text-center mt-3 text-xs text-amber-500 font-medium animate-pulse">
            Please upload documents in the Knowledge Base tab to continue.
          </div>
        )}
      </div>
    </div>
  );
};