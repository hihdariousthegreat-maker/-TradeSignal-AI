import React from 'react';
import { TradeSignal } from '../types';

interface SignalCardProps {
  signal: TradeSignal;
}

const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  const isLong = signal.direction === 'LONG';
  const colorClass = isLong ? 'text-emerald-400' : 'text-rose-400';
  const bgClass = isLong ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30';
  const badgeClass = isLong ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300';

  return (
    <div className={`rounded-xl border ${bgClass} p-5 shadow-lg relative overflow-hidden transition-all hover:shadow-xl hover:scale-[1.01] duration-300`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            {signal.timeframe}
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold tracking-wider ${badgeClass}`}>
              {signal.direction}
            </span>
          </h3>
          <p className="text-sm text-slate-400 mt-1">{signal.assetPair} • {signal.duration} • {signal.leverage}</p>
        </div>
        <div className="text-right">
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">R:R Ratio</div>
            <div className="text-lg font-mono font-bold text-indigo-300">{signal.riskRewardRatio}</div>
        </div>
      </div>

      {/* Core Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900/40 rounded-lg p-3 border border-slate-700/50">
          <span className="text-xs text-slate-500 block uppercase font-semibold">Entry Zone</span>
          <span className="text-base font-mono font-bold text-white">{signal.entryZone}</span>
        </div>
        <div className="bg-slate-900/40 rounded-lg p-3 border border-slate-700/50 relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-1 h-full ${isLong ? 'bg-rose-500' : 'bg-emerald-500'} opacity-50`}></div>
          <span className="text-xs text-slate-500 block uppercase font-semibold">Stop Loss</span>
          <span className="text-base font-mono font-bold text-white">{signal.stopLoss}</span>
          <span className="text-xs text-slate-400 block mt-1">Risk: {signal.positionRisk}</span>
        </div>
      </div>

      {/* Targets */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Target 1 (Conservative)</span>
            <span className={`font-mono font-bold ${colorClass}`}>{signal.tp1}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Target 2 (Main)</span>
            <span className={`font-mono font-bold ${colorClass}`}>{signal.tp2}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Target 3 (Moonbag)</span>
            <span className={`font-mono font-bold ${colorClass}`}>{signal.tp3}</span>
        </div>
      </div>

      {/* Rationale */}
      <div className="border-t border-slate-700/50 pt-4">
        <h4 className="text-sm font-bold text-slate-300 mb-2">Technical Rationale</h4>
        <ul className="list-disc list-inside space-y-1">
            {signal.technicalJustification.slice(0, 3).map((point, idx) => (
                <li key={idx} className="text-xs text-slate-400 leading-relaxed">{point}</li>
            ))}
        </ul>
        
        <div className="mt-4 bg-slate-800/50 p-2 rounded text-xs text-slate-400 italic">
            <span className="text-indigo-400 font-bold not-italic">Strategy: </span>
            {signal.strategyNote}
        </div>
      </div>
    </div>
  );
};

export default SignalCard;
