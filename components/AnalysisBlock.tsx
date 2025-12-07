import React, { useState } from 'react';
import { AnalysisCategory } from '../types';

interface AnalysisBlockProps {
  category: AnalysisCategory;
}

const AnalysisBlock: React.FC<AnalysisBlockProps> = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate color based on score
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400';
    if (score <= 30) return 'text-rose-400';
    return 'text-amber-400';
  };

  const getInterpretationColor = (interp: string) => {
    switch (interp) {
        case 'Bullish': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        case 'Bearish': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
        default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/60 transition-colors"
      >
        <div className="flex items-center gap-3">
            <div className={`text-lg font-bold ${getScoreColor(category.score)} font-mono`}>
                {category.score}
            </div>
            <h3 className="font-semibold text-slate-200">{category.categoryName}</h3>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline-block">{category.methods.length} methods</span>
            <svg 
                className={`w-5 h-5 text-slate-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-1 bg-slate-900/30 border-t border-slate-700/50">
            <div className="space-y-4 mt-3">
                {category.methods.map((method, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-3 text-sm">
                        <div className="min-w-[140px] font-medium text-slate-300">
                            {method.name}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs px-2 py-0.5 rounded border ${getInterpretationColor(method.interpretation)}`}>
                                    {method.interpretation}
                                </span>
                                <span className="font-mono text-slate-200">{method.value}</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">{method.details}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisBlock;
