import React, { useState } from 'react';
import { Search, Sparkles, AlertTriangle, ArrowRight, Clipboard, Check } from 'lucide-react';
import { DEMO_TOKENS, detectChain } from '../services/api';

interface SearchHeroProps {
  onSearch: (address: string) => void;
  isLoading: boolean;
}

export const SearchHero: React.FC<SearchHeroProps> = ({ onSearch, isLoading }) => {
  const [inputVal, setInputVal] = useState('');
  const [copiedDemo, setCopiedDemo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onSearch(inputVal.trim());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputVal(text.trim());
        onSearch(text.trim());
      }
    } catch (err) {
      console.warn('Clipboard read error:', err);
    }
  };

  const handleSelectDemo = (address: string, label: string) => {
    setInputVal(address);
    setCopiedDemo(label);
    setTimeout(() => setCopiedDemo(null), 1500);
    onSearch(address);
  };

  const { isSolana } = detectChain(inputVal);

  return (
    <div className="relative pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full"></div>

      {/* Pill header */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-6 shadow-inner">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>Multi-Chain Rugpull & Honeypot Defense Engine</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
        Don’t Get Rugged. <br className="hidden sm:inline" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
          Audit Any Token in 1-Second.
        </span>
      </h1>

      <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
        Scan Solana, Base & EVM contracts for honeypots, hidden taxes, active mint authorities, and dev dump risks before executing your snipe.
      </p>

      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="mt-8 relative max-w-2xl mx-auto">
        <div className="relative flex items-center bg-slate-900/90 border-2 border-slate-800 hover:border-slate-700 focus-within:border-emerald-500/80 rounded-2xl p-2 shadow-2xl transition group">
          <div className="pl-3 pr-2 text-slate-500">
            <Search className="w-5 h-5 group-focus-within:text-emerald-400 transition" />
          </div>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Paste Contract Address (0x... or Solana Mint)"
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none font-mono"
            disabled={isLoading}
          />

          {inputVal.trim().length > 0 && (
            <div className="mr-2">
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                isSolana
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {isSolana ? 'Solana' : 'EVM'}
              </span>
            </div>
          )}

          {/* Quick paste button if empty */}
          {!inputVal && (
            <button
              type="button"
              onClick={handlePaste}
              className="mr-2 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/80 border border-slate-700/60 hidden sm:flex items-center gap-1 cursor-pointer"
            >
              <Clipboard className="w-3 h-3" />
              Paste
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25 shrink-0"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <span>Audit Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Demo Tokens */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-slate-500 flex items-center gap-1 mr-1">
          Try Live Demo:
        </span>
        {DEMO_TOKENS.map((demo) => {
          const isHoneypot = demo.badge.includes('Scam');
          return (
            <button
              key={demo.label}
              onClick={() => handleSelectDemo(demo.address, demo.label)}
              className={`px-3 py-1 rounded-lg border text-xs font-mono transition flex items-center gap-1.5 cursor-pointer ${
                isHoneypot
                  ? 'bg-rose-950/40 border-rose-800/60 text-rose-300 hover:bg-rose-900/50'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              {isHoneypot && <AlertTriangle className="w-3 h-3 text-rose-400" />}
              {copiedDemo === demo.label ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">Loaded!</span>
                </>
              ) : (
                <>
                  <span>{demo.label}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-sans ${
                    isHoneypot ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {demo.badge}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
