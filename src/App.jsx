import { useState } from "react";

export default function StockAnalysis() {
  const [ticker, setTicker] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStockAnalysis = async () => {
    if (!ticker.trim()) {
      setError("Please enter a stock ticker.");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetch(
        `https://stock-analysis-ai-api.onrender.com/get_stock?ticker=${ticker}`
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to fetch data");
      setData(result);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📈 Stock Analysis</h1>

      {/* Input and Button */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter Ticker(e.g, TSLA ,CAMS.NS)"
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none w-64 text-center"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
        />
        <button
          className={`px-5 py-3 rounded-lg text-white font-semibold shadow-md transition-all ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={fetchStockAnalysis}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Analyze"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 font-medium">{error}</p>}

      {/* Stock Analysis Output */}
      {data && (
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl animate-fade-in">
          {/* Stock Ticker & Price */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">{data.ticker} Analysis</h2>
            <p className="text-gray-500 text-sm">Powered by AI</p>
            <div className="mt-4 text-4xl font-extrabold text-green-600 bg-gray-100 px-6 py-3 rounded-lg shadow-md inline-block">
              ${data.price}
            </div>
          </div>

          {/* AI Analysis Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Groq Analysis */}
            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-blue-600">📊 Groq Analysis</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {formatText(data.groq_analysis)}
              </p>
            </div>

            {/* Gemini Analysis */}
            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-purple-600">🔍 Gemini Analysis</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {formatText(data.gemini_analysis)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to format text with bold and bullet points
function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, (_, match) => `**${match}**`) // Bold text
    .replace(/\*(.*?)\*/g, (_, match) => `• ${match}`); // Bullet points
}
