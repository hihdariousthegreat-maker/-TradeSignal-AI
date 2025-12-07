
import { GoogleGenAI } from "@google/genai";
import { FullAnalysisResponse, TrendingToken } from "../types";

// Helper to get API Key safely
const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    console.error("API_KEY is missing from environment variables.");
    return "";
  }
  return key;
};

// Helper to clean JSON string from Markdown formatting or extra text
const cleanJsonString = (str: string): string => {
  let cleaned = str.replace(/```json/g, '').replace(/```/g, '').trim();
  // Ensure we start with { or [
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  
  if (firstBrace === -1 && firstBracket === -1) return cleaned;
  
  const start = firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket) ? firstBrace : firstBracket;
  
  // Find the last } or ]
  const lastBrace = cleaned.lastIndexOf('}');
  const lastBracket = cleaned.lastIndexOf(']');
  const end = Math.max(lastBrace, lastBracket);
  
  if (start !== -1 && end !== -1) {
    return cleaned.substring(start, end + 1);
  }
  
  return cleaned;
};

export const fetchTrendingTokens = async (): Promise<TrendingToken[]> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Identify 4 currently trending cryptocurrency tokens based on REAL-TIME search data (exclude BTC and ETH from the trending count). However, ALWAYS include BTC and ETH at the very top of the list (total 6 items).
      
      Tasks:
      1. Search for "top trending crypto coins today" and "crypto gainers today".
      2. Get the current approximate price in USD.
      3. Get the 24h % change.

      OUTPUT RULES:
      1. Return ONLY a raw JSON array.
      2. Do NOT use Markdown formatting.
      3. No conversational text.
      
      Expected JSON Structure:
      [
        { "symbol": "BTC", "name": "Bitcoin", "price": "$96,000", "change24h": "+2.1%" },
        ...
      ]`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const jsonStr = cleanJsonString(response.text || "[]");
    return (JSON.parse(jsonStr) as TrendingToken[]);
  } catch (error) {
    console.error("Error fetching trending tokens:", error);
    // Fallback data if API fails
    return [
      { symbol: "BTC", name: "Bitcoin", price: "N/A", change24h: "0%" },
      { symbol: "ETH", name: "Ethereum", price: "N/A", change24h: "0%" }
    ];
  }
};

export const analyzeToken = async (symbol: string): Promise<FullAnalysisResponse> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Act as a world-class Quantitative Analyst and Crypto Trader.
    Perform a deep-dive, REAL-TIME analysis on ${symbol} (against USDT).
    
    PHASE 1: DATA GATHERING (Use 'googleSearch' tool MANDATORY)
    - Search for: "current price of ${symbol} USDT", "latest ${symbol} news", "current RSI ${symbol}", "${symbol} funding rates", "Fear and Greed Index crypto today", "${symbol} on-chain activity".
    - Get the current date and time.
    
    PHASE 2: 5-DIMENSIONAL ANALYSIS (5 Methods per Dimension)
    You must evaluate the token using strictly these methods:
    
    1. FUNDAMENTAL
       - Method A: Network Growth (Active Addresses/Tx Count)
       - Method B: TVL / Revenue Protocol trends
       - Method C: Tokenomics (Supply Schedule/Unlocks)
       - Method D: Developer Activity (Recent Github commits/Updates)
       - Method E: Major Roadmap Events / Partnerships
       
    2. TECHNICAL
       - Method A: RSI (14) & Stochastic RSI status
       - Method B: MACD Momentum (Crossovers/Histogram)
       - Method C: Moving Averages (EMA 20/50/200 trends)
       - Method D: Key Support/Resistance Levels (Pivot Points)
       - Method E: Volume Profile & OBV (On-Balance Volume)
       
    3. QUANTITATIVE
       - Method A: Volatility (ATR - Average True Range)
       - Method B: Beta vs BTC (Correlation check)
       - Method C: Sharpe Ratio (Risk-adjusted return est.)
       - Method D: Z-Score (Statistical deviation)
       - Method E: Liquidations & Long/Short Ratio
       
    4. GRAPH THEORY / ON-CHAIN
       - Method A: NVT Ratio (Network Value to Transactions)
       - Method B: Whale Concentration (>1% holders activity)
       - Method C: Exchange Net Flow (Inflow vs Outflow)
       - Method D: MVRV Ratio (Market Value to Realized Value)
       - Method E: Network Hashrate or Staking Security Score
       
    5. SENTIMENT
       - Method A: Fear & Greed Index (Market & Asset)
       - Method B: Social Volume (Twitter/Reddit mentions)
       - Method C: Weighted Sentiment (Positive vs Negative)
       - Method D: Funding Rates (Perpetual Futures sentiment)
       - Method E: Open Interest Trends

    PHASE 3: SIGNAL GENERATION
    Generate 3 distinct trade signals (Short, Mid, Long term) based on the analysis above.
    
    OUTPUT RULES:
    1. Return ONLY a valid raw JSON object.
    2. Do NOT use Markdown formatting.
    3. Ensure all numbers are based on the real-time search results.
    
    JSON Template:
    {
      "symbol": "${symbol}",
      "currentPrice": "e.g. $1.23",
      "trend": "Up" | "Down" | "Sideways",
      "timestamp": "e.g. Oct 26, 2023 14:30 UTC",
      "signals": [
        {
          "timeframe": "Short-term" | "Mid-term" | "Long-term",
          "assetPair": "e.g. BTC/USDT",
          "direction": "LONG" | "SHORT",
          "duration": "e.g. 1-3 Days",
          "entryZone": "e.g. $1.20 - $1.22",
          "leverage": "e.g. 5x",
          "stopLoss": "e.g. $1.15",
          "positionRisk": "e.g. 1%",
          "riskRewardRatio": "e.g. 1:3",
          "tp1": "price",
          "tp2": "price",
          "tp3": "price",
          "strategyNote": "text",
          "technicalJustification": ["point 1", "point 2"],
          "fundamentalContext": ["point 1", "point 2"]
        }
      ],
      "deepAnalysis": [
        {
          "categoryName": "Fundamental",
          "score": 85,
          "methods": [
            {
              "name": "Network Growth",
              "value": "125k Active Addr",
              "interpretation": "Bullish",
              "details": "Daily active addresses up 5% week-over-week."
            }
          ]
        }
        // ... Repeat for Technical, Quant, Graph Theory, Sentiment
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "{}";
    const cleanedText = cleanJsonString(text);
    const data = JSON.parse(cleanedText);
    return data as FullAnalysisResponse;
  } catch (error) {
    console.error("Error analyzing token:", error);
    throw error;
  }
};
