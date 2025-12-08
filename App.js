// App.js
const App = () => {
  const React = window.React;
  const { useEffect } = React;
  const { HashRouter, Routes, Route, Navigate } = window.ReactRouterDOM;
  
  const Dashboard = window.Dashboard;
  const TokenAnalysis = window.TokenAnalysis;

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.setHeaderColor('#0f172a');
      window.Telegram.WebApp.setBackgroundColor('#0f172a');
    }
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-20">
        <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-white">TradeSignal AI</h1>
            <div className="text-xs font-mono text-slate-500">Gemini 2.5</div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analysis/:symbol" element={<TokenAnalysis />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

// MOUNT THE APP
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);