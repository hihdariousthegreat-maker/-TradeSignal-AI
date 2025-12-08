// TokenAnalysis.js
const TokenAnalysis = () => {
  const React = window.React;
  const { useEffect, useState } = React;
  const { useParams, useNavigate } = window.ReactRouterDOM;
  const { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } = window.Recharts;
  
  const SignalCard = window.SignalCard;
  const AnalysisBlock = window.AnalysisBlock;
  const { analyzeToken } = window.GeminiService;

  const { symbol } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await analyzeToken(symbol);
        setData(result);
      } catch (err) {
        setError("Analysis failed. Please check API Key.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol]);

  if (loading) return <div className="text-center py-20 text-indigo-400 animate-pulse font-bold">Analyzing {symbol}...</div>;
  if (error || !data) return <div className="text-center py-20 text-rose-400 font-bold">{error}</div>;

  const chartData = data.deepAnalysis.map(cat => ({ subject: cat.categoryName, A: cat.score, fullMark: 100 }));

  return (
    <div className="space-y-8 pb-10 fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
            <button onClick={() => navigate('/')} className="text-slate-500 text-sm mb-2">← Back</button>
            <h1 className="text-4xl font-extrabold text-white">{data.symbol} <span className="text-slate-500 text-2xl">/ USDT</span></h1>
            <div className="flex gap-4 mt-2 items-center">
                <span className="text-2xl font-mono text-indigo-300">{data.currentPrice}</span>
                <span className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">{data.timestamp}</span>
            </div>
        </div>
        <div className="h-48 w-full md:w-64">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar dataKey="A" stroke="#818cf8" fill="#6366f1" fillOpacity={0.3} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Trade Signals</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {data.signals.map((signal, idx) => <SignalCard key={idx} signal={signal} />)}
        </div>
      </div>

      <div className="space-y-4 pt-8">
        <h2 className="text-xl font-bold text-white">Deep Dive Analysis</h2>
        {data.deepAnalysis.map((category, idx) => <AnalysisBlock key={idx} category={category} />)}
      </div>
    </div>
  );
};
window.TokenAnalysis = TokenAnalysis;