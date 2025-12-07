import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTrendingTokens } from '../services/geminiService';
import { TrendingToken } from '../types';

const Dashboard: React.FC = () => {
  const [tokens, setTokens] = useState<TrendingToken[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const data = await fetchTrendingTokens();
        setTokens(data);
      } catch (err) {
        console.error("Failed to load trending tokens", err);
      } finally {
        setLoading(false);
      }
    };
    loadTokens();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const symbol = formData.get('symbol') as string;
    if (symbol) {
        navigate(`/analysis/${symbol.toUpperCase()}`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-4 py-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Intelligent Crypto Signals
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-lg">
          AI-powered trade analysis combining Technicals, Fundamentals, Quantitative models, and On-chain Graph Theory.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-md mx-auto mt-8 relative">
            <input 
                name="symbol"
                type="text" 
                placeholder="Enter Token Symbol (e.g. BTC, SOL, DOGE)" 
                className="w-full bg-slate-800 border border-slate-700 text-white px-5 py-4 rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-center uppercase tracking-widest font-bold placeholder:text-slate-600 placeholder:normal-case placeholder:tracking-normal"
            />
            <button type="submit" className="absolute right-2 top-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-2.5 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Trending & Major Assets
        </h3>
        
        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1,2,3,4].map(i => (
                    <div key={i} className="h-24 bg-slate-800/50 rounded-xl animate-pulse"></div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tokens.map((token) => (
                    <div 
                        key={token.symbol} 
                        onClick={() => navigate(`/analysis/${token.symbol}`)}
                        className="group bg-slate-800 border border-slate-700 hover:border-indigo-500/50 p-5 rounded-xl cursor-pointer transition-all hover:bg-slate-800/80 flex justify-between items-center"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white shadow-inner">
                                {token.symbol.substring(0, 1)}
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">{token.name}</h4>
                                <span className="text-xs text-slate-500 font-mono">{token.symbol}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-mono font-bold text-lg text-slate-200">{token.price}</div>
                            <div className={`text-sm font-bold ${token.change24h.includes('-') ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {token.change24h}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
