import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TopicData } from '../types';
import { PieChart as PieChartIcon, Activity, Zap } from 'lucide-react';

interface AnalyticsPanelProps {
  topics: TopicData[];
  materialCount: number;
  isDarkMode: boolean;
}

const COLORS = ['#6366f1', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ topics, materialCount, isDarkMode }) => {
  
  if (topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="relative">
           <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full"></div>
           <Activity className="w-20 h-20 text-slate-300 dark:text-slate-700 mb-6 relative z-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200">No Insights Yet</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md text-lg">Process your study materials to generate a personalized knowledge graph.</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 h-full overflow-y-auto scrollbar-thin bg-white/40 dark:bg-slate-900/40">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
           <Zap className="w-6 h-6 text-yellow-500 mr-2 fill-yellow-500" />
           Knowledge Insights
        </h2>
        <p className="text-slate-500 dark:text-slate-400">Analysis derived from {materialCount} source documents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-black/20 min-h-[350px] flex flex-col">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
             <PieChartIcon className="w-5 h-5 mr-2 text-indigo-500" />
             Topic Relevance
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <BarChart data={topics} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120} 
                  tick={{fontSize: 12, fill: isDarkMode ? '#cbd5e1' : '#475569', fontWeight: 500}} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{fill: isDarkMode ? '#1e293b' : '#f1f5f9'}}
                  contentStyle={{
                    borderRadius: '12px', 
                    border: 'none', 
                    background: isDarkMode ? '#1e293b' : '#fff',
                    color: isDarkMode ? '#fff' : '#000',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="relevance" radius={[0, 6, 6, 0]} barSize={24} animationDuration={1500}>
                  {topics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Details Cards */}
        <div className="space-y-4">
          {topics.map((topic, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all hover:shadow-md group cursor-default relative overflow-hidden">
              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-2 pl-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-lg">{topic.name}</h4>
                <span className="text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
                  {topic.relevance}%
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pl-2 border-l-2 border-slate-100 dark:border-slate-700 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-colors">
                {topic.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};