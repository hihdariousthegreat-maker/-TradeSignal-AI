// Dashboard.js
const Dashboard = () => {
  const React = window.React;
  const { useEffect, useState } = React;
  const { useNavigate } = window.ReactRouterDOM;
  const { fetchTrendingTokens } = window.GeminiService;

  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const data = await fetchTrendingTokens();
        setTokens(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTokens();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const symbol = new FormData(e.currentTarget).get('symbol');
    if (symbol) navigate(`/analysis/${symbol.toUpperCase()}`);
  };

  return (
    <div className="space-y-8 fade-in">
      <div className="text-center py-10">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
          TradeSignal AI
        </h2>
        <form onSubmit={handleSearch} className="max-w-md mx-auto mt-8 relative">
            <input name="symbol" type="text" placeholder="ENTER SYMBOL (e.g. BTC)" 
                className="w-full bg-slate-800 border border-slate-700 text-white px-5 py-4 rounded-full shadow-xl text-center font-bold uppercase" />
            <button type="submit" className="absolute right-2 top-2 bg-indigo-600 text-white rounded-full p-2.5">GO</button>
        </form>
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-200 mb-4">Trending</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? <div className="text-slate-500">Loading market data...</div> : tokens.map((token) => (
                <div key={token.symbol} onClick={() => navigate(`/analysis/${token.symbol}`)}
                    className="bg-slate-800 border border-slate-700 p-5 rounded-xl cursor-pointer hover:border-indigo-500 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold">{token.symbol[0]}</div>
                        <div><h4 className="font-bold text-white">{token.name}</h4><span className="text-xs text-slate-500">{token.symbol}</span></div>
                    </div>
                    <div className="text-right">
                        <div className="font-mono font-bold">{token.price}</div>
                        <div className={`text-sm ${token.change24h.includes('-') ? 'text-rose-400' : 'text-emerald-400'}`}>{token.change24h}</div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
window.Dashboard = Dashboard;