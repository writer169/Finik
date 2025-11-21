import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { askGeminiVet } from '../services/geminiService';
import { CalendarEvent, Note } from '../types';

interface AiAssistantProps {
  events: CalendarEvent[];
  notes: Note[];
}

const AiAssistant: React.FC<AiAssistantProps> = ({ events, notes }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Initial auto-analysis
  useEffect(() => {
    if (isOpen && !response) {
        handleAsk("Проанализируй график роста Финика и его последние события.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleAsk = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setResponse(null);
    
    const result = await askGeminiVet(text, events, notes);
    
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 shadow-sm border border-indigo-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500 rounded-xl text-white shadow-md shadow-indigo-200">
                <Sparkles size={20} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-indigo-900">AI Помощник</h3>
                <p className="text-xs text-indigo-400">Powered by Gemini</p>
            </div>
        </div>
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-indigo-400 hover:text-indigo-600 text-sm underline"
        >
            {isOpen ? 'Свернуть' : 'Развернуть'}
        </button>
      </div>

      {isOpen && (
          <>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 min-h-[100px] mb-4 text-sm text-gray-700 leading-relaxed shadow-inner">
                {loading ? (
                <div className="flex items-center justify-center h-20 text-indigo-400">
                    <Loader2 className="animate-spin mr-2" /> Думаю...
                </div>
                ) : (
                response || "Привет! Я проанализировал данные Финика. Спросите меня о его диете, весе или прививках!"
                )}
            </div>

            <div className="flex gap-2">
                <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk(query)}
                placeholder="Напр: Нормальный ли вес 2120г?"
                className="flex-grow px-4 py-2 rounded-xl border border-indigo-100 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm shadow-sm"
                />
                <button
                onClick={() => handleAsk(query)}
                disabled={loading || !query}
                className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-xl disabled:opacity-50 transition-all shadow-sm"
                >
                <Send size={18} />
                </button>
            </div>
          </>
      )}
      {!isOpen && (
          <p className="text-sm text-indigo-800/70">
              Получите совет по поводу набора веса в {2120-1100}г за последний месяц.
          </p>
      )}
    </div>
  );
};

export default AiAssistant;