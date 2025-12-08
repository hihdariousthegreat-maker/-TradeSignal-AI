// geminiService.js

const cleanJsonString = (str) => {
  let cleaned = str.replace(/```json/g, '').replace(/```/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  
  if (firstBrace === -1 && firstBracket === -1) return cleaned;
  
  const start = firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket) ? firstBrace : firstBracket;
  const lastBrace = cleaned.lastIndexOf('}');
  const lastBracket = cleaned.lastIndexOf(']');
  const end = Math.max(lastBrace, lastBracket);
  
  if (start !== -1 && end !== -1) {
    return cleaned.substring(start, end + 1);
  }
  return cleaned;
};

window.GeminiService = {
  fetchTrendingTokens: async () => {
    const apiKey = window.process?.env?.API_KEY;
    if (!apiKey || apiKey.includes("PASTE_YOUR")) {
      console.warn("API Key missing");
      return [
        { symbol: "BTC", name: "Bitcoin", price: "$96,500", change24h: "+1.2%" },
        { symbol: "ETH", name: "Ethereum", price: "$3,650", change24h: "+2.5%" }
      ];
    }

    const GoogleGenAI = window.GoogleGenAI;
    if (!GoogleGenAI) {
      console.error("GoogleGenAI SDK not loaded");
      return [];
    }
    const ai = new GoogleGenAI({ apiKey });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Identify 4 trending crypto tokens (excluding BTC/ETH) + Add BTC & ETH at top. 
        Tasks: Search "trending crypto coins". Get USD price & 24h change.
        Output: JSON Array only. No Markdown.
        Example: [{ "symbol": "BTC", "name": "Bitcoin", "price": "$96k", "change24h": "+2%" }]`,
        config: { tools: [{ googleSearch: {} }] },
      });

      return JSON.parse(cleanJsonString(response.text || "[]"));
    } catch (error) {
      console.error("Trending Error:", error);
      return [];
    }
  },

  analyzeToken: async (symbol) => {
    const apiKey = window.process?.env?.API_KEY;
    if (!apiKey || apiKey.includes("PASTE_YOUR")) throw new Error("API Key missing");

    const GoogleGenAI = window.GoogleGenAI;
    if (!GoogleGenAI) throw new Error("SDK not loaded");
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Act as a Quant Trader. Analyze ${symbol}/USDT.
      
      PHASE 1: REAL-TIME DATA (Use googleSearch)
      - Price, News, RSI, Funding Rates, On-Chain.
      
      PHASE 2: 5-DIMENSIONAL ANALYSIS
      1. FUNDAMENTAL
      2. TECHNICAL
      3. QUANTITATIVE
      4. GRAPH THEORY
      5. SENTIMENT

      PHASE 3: SIGNALS (Short, Mid, Long Term)
      
      OUTPUT: Valid JSON ONLY.
      {
        "symbol": "${symbol}",
        "currentPrice": "$...",
        "trend": "Up/Down",
        "timestamp": "Today",
        "signals": [
          {
            "timeframe": "Short-term",
            "assetPair": "${symbol}/USDT",
            "direction": "LONG/SHORT",
            "duration": "...",
            "entryZone": "...",
            "leverage": "...",
            "stopLoss": "...",
            "positionRisk": "...",
            "riskRewardRatio": "...",
            "tp1": "...", "tp2": "...", "tp3": "...",
            "strategyNote": "...",
            "technicalJustification": ["..."],
            "fundamentalContext": ["..."]
          }
        ],
        "deepAnalysis": [
          {
            "categoryName": "Fundamental",
            "score": 85,
            "methods": [
              { "name": "Network Growth", "value": "...", "interpretation": "Bullish", "details": "..." }
            ]
          }
        ]
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] },
      });

      return JSON.parse(cleanJsonString(response.text || "{}"));
    } catch (error) {
      console.error("Analysis Error:", error);
      throw error;
    }
  }
};