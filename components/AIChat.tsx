
import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { Sparkles, RefreshCw, Send, Loader2, BrainCircuit } from 'lucide-react';
import { getSmartProductivityAdvice } from '../services/geminiService';

interface AIChatProps {
  tasks: Task[];
}

const AIChat: React.FC<AIChatProps> = ({ tasks }) => {
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdvice = async () => {
    setIsLoading(true);
    const result = await getSmartProductivityAdvice(tasks);
    setAdvice(result);
    setIsLoading(false);
  };

  useEffect(() => {
    if (tasks.length > 0) {
      fetchAdvice();
    }
  }, []);

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto space-y-6">
      <div className="text-center py-8">
        <div className="inline-flex p-4 rounded-3xl bg-indigo-50 text-indigo-600 mb-4 animate-bounce">
          <BrainCircuit size={48} />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800">Syncro AI Assistant</h2>
        <p className="text-slate-500 max-w-sm mx-auto mt-2">Personalized productivity insights powered by Gemini for your specific workload.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles size={80} className="text-indigo-600" />
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <span className="flex items-center gap-2 text-indigo-600 font-bold text-sm tracking-wide uppercase">
            <Sparkles size={16} />
            Smart Productivity Plan
          </span>
          <button 
            onClick={fetchAdvice}
            disabled={isLoading}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors disabled:opacity-50"
          >
            <RefreshCw size={20} className={`text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="prose prose-slate max-w-none">
          {isLoading ? (
            <div className="space-y-4 py-4">
              <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse" />
            </div>
          ) : advice ? (
            <div className="text-slate-600 leading-relaxed whitespace-pre-wrap animate-in fade-in duration-700">
              {advice}
            </div>
          ) : (
            <div className="text-slate-400 italic text-center py-8">
              Add some tasks to get AI-powered productivity advice.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
          <h4 className="font-bold text-emerald-800 text-sm mb-2">Identify Blockers</h4>
          <p className="text-emerald-600 text-xs">AI analyzes your "In Progress" tasks to find potential delays.</p>
        </div>
        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
          <h4 className="font-bold text-blue-800 text-sm mb-2">Prioritization Check</h4>
          <p className="text-blue-600 text-xs">Ensures your focus aligns with deadlines and priority levels.</p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
