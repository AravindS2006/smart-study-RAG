import React from 'react';
import { FileCode, Server, Database, Cpu, Copy, Terminal, Layers } from 'lucide-react';

export const ResumeGuide: React.FC<{isDarkMode: boolean}> = ({ isDarkMode }) => {
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
    alert("Copied to clipboard!");
  };

  return (
    <div className="p-8 h-full overflow-y-auto scrollbar-thin bg-slate-50/50 dark:bg-slate-950/50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Project Documentation</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Technical Reference & Resume Assets</p>
        </div>

        {/* Project Summary Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
              <FileCode className="mr-2" />
              Executive Summary
            </h3>
            <button onClick={() => copyToClipboard("Developed a 'Smart Study' RAG system using Google Gemini 2.5 and React. Features client-side vector simulation, automated knowledge graphing, and interactive AI tutoring with strict context adherence.")} className="text-xs flex items-center px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 hover:text-indigo-700 transition-colors font-medium">
              <Copy className="w-3 h-3 mr-1.5" /> Copy Snippet
            </button>
          </div>
          <div className="glass-card p-8 rounded-2xl border border-white/40 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 leading-relaxed shadow-sm">
             <p className="mb-4">
              Developed a <strong>Production-Grade Retrieval-Augmented Generation (RAG) System</strong> tailored for educational use. 
              Leveraging the massive context window of <strong>Google Gemini 2.5 Flash</strong>, this application eliminates the need for external vector databases for small-to-medium datasets by implementing high-performance context stuffing and client-side processing.
             </p>
             <div className="flex flex-wrap gap-2 mt-4">
               <Badge text="Zero-Hallucination Architecture" />
               <Badge text="Client-Side Edge AI" />
               <Badge text="Automated Knowledge Graph" />
             </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="mb-10">
          <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-5 flex items-center">
             <Layers className="mr-2" />
             Technical Stack
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SkillCard 
              title="GenAI Engineering" 
              icon={<Cpu size={18} />}
              skills={["Google Gemini 2.5 Flash", "Schema-based JSON Output", "Prompt Engineering", "In-Context Learning"]}
            />
            <SkillCard 
              title="Frontend Architecture" 
              icon={<Terminal size={18} />}
              skills={["React 18", "TypeScript", "Tailwind CSS (Neorealism)", "Glassmorphism UI"]}
            />
            <SkillCard 
              title="RAG Pipeline" 
              icon={<Database size={18} />}
              skills={["Unstructured Data Ingestion", "Topic Modeling", "Semantic Retrieval Simulation", "Fact-Grounding"]}
            />
            <SkillCard 
              title="DevOps & Quality" 
              icon={<Server size={18} />}
              skills={["CI/CD Concepts", "Modular Component Design", "Error Boundary Management", "Accessibility (Dark Mode)"]}
            />
          </div>
        </section>

        {/* HR Explanation Section */}
        <section className="mb-10">
          <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-5 flex items-center">
             <Cpu className="mr-2" />
             Talking Points
          </h3>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl border border-indigo-100 dark:border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Server size={100} />
            </div>
            <p className="mb-4 text-slate-700 dark:text-slate-300 relative z-10 font-medium">
              "I moved beyond simple API wrappers to build a <strong>context-aware application</strong>. 
              This project demonstrates my ability to handle unstructured user data, visualize complex AI outputs, and design intuitive interfaces that bridge the gap between raw LLM capabilities and end-user needs. 
              It highlights full-stack proficiency, from managing API latency to crafting pixel-perfect UI."
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

const SkillCard: React.FC<{title: string, skills: string[], icon: React.ReactNode}> = ({title, skills, icon}) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
    <div className="flex items-center mb-4 text-indigo-600 dark:text-indigo-400">
      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg mr-3">
        {icon}
      </div>
      <h4 className="font-bold text-slate-800 dark:text-slate-100">{title}</h4>
    </div>
    <ul className="space-y-2">
      {skills.map(s => (
        <li key={s} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2 mt-1.5 shrink-0"></span>
          {s}
        </li>
      ))}
    </ul>
  </div>
);

const Badge: React.FC<{text: string}> = ({text}) => (
  <span className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
    {text}
  </span>
);