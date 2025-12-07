
export interface TradeSignal {
  timeframe: 'Short-term' | 'Mid-term' | 'Long-term';
  assetPair: string;
  direction: 'LONG' | 'SHORT';
  duration: string;
  entryZone: string;
  leverage: string;
  stopLoss: string;
  positionRisk: string;
  riskRewardRatio: string;
  tp1: string;
  tp2: string;
  tp3: string;
  strategyNote: string;
  technicalJustification: string[];
  fundamentalContext: string[];
}

export interface AnalysisMethod {
  name: string;
  value: string;
  interpretation: 'Bullish' | 'Bearish' | 'Neutral';
  details: string;
}

export interface AnalysisCategory {
  categoryName: string;
  score: number; // 0 to 100
  methods: AnalysisMethod[];
}

export interface FullAnalysisResponse {
  symbol: string;
  currentPrice: string;
  trend: 'Up' | 'Down' | 'Sideways';
  timestamp: string;
  signals: TradeSignal[];
  deepAnalysis: AnalysisCategory[];
}

export interface TrendingToken {
  symbol: string;
  name: string;
  change24h: string;
  price: string;
}
