
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analyzeToken } from '../services/geminiService';
import { FullAnalysisResponse } from '../types';
import SignalCard from '../components/SignalCard';
import AnalysisBlock from '../components/AnalysisBlock';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const TokenAnalysis: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<FullAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await analyzeToken(symbol);
        setData(result);
      } catch (err) {
        setError("Failed to generate analysis. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-indigo-900 rounded-full"></div>
            <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">Analyzing {symbol}...</h3>
            <p className="text-slate-400 text-sm">Processing 5 quantitative models & searching live data</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <div className="text-rose-400 mb-4 text-xl font-bold">{error || "Token not found"}</div>
        <button 
            onClick={() => navigate('/')} 
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors"
        >
            Back to Dashboard
        </button>
      </div>
    );
  }

  // Prepare Chart Data - Cleaning names for display
  const chartData = data.deepAnalysis.map(cat => ({
    subject: cat.categoryName.replace(' Theory', '').replace(' Analysis', ''),
    A: cat.score,
    fullMark: 100,
  }));

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
            <button onClick={() => navigate('/')} className="text-slate-500 hover:text-white text-sm mb-2 flex items-center gap-1 transition-colors">
                ← Back
            </button>
            <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
                {data.symbol}
                <span className="text-2xl text-slate-500 font-normal">/ USDT</span>
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-mono text-indigo-300 font-bold">{data.currentPrice}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        data.trend === 'Up' ? 'bg-emerald-500/20 text-emerald-400' : 
                        data.trend === 'Down' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                        Trend: {data.trend}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 px-2 py-1 rounded border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Updated: {data.timestamp}
                </div>
            </div>
        </div>
        
        {/* Radar Chart (Small) */}
        <div className="h-48 w-full md:w-64 -ml-4 md:ml-0">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name={data.symbol} dataKey="A" stroke="#818cf8" strokeWidth={2} fill="#6366f1" fillOpacity={0.3} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Signals Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Trade Signals
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {data.signals.map((signal, idx) => (
                <SignalCard key={idx} signal={signal} />
            ))}
        </div>
      </div>

      {/* Deep Analysis Section */}
      <div className="space-y-4 pt-8">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Deep Dive Analysis (5-Model Consensus)
        </h2>
        
        <div className="grid grid-cols-1 gap-2">
            {data.deepAnalysis.map((category, idx) => (
                <AnalysisBlock key={idx} category={category} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default TokenAnalysis;
