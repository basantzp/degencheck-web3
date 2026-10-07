import React from 'react';
import { ShieldCheck, DollarSign, Settings, Share2 } from 'lucide-react';


interface HeaderProps {
  onOpenSettings: () => void;
  onOpenCalculator: () => void;
  onShareApp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenCalculator,
  onShareApp,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white flex items-center">
                Degen<span className="text-emerald-400">Check</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                v2.4 Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              1-Sec Token Safety Audit & DEX Sniper Companion
            </p>
          </div>
        </div>

        {/* Supported Chains Badges */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Multi-Chain:
          </span>
          <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[11px]">SOL</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[11px]">BASE</span>
          <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[11px]">ETH</span>
          <span className="px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 font-mono text-[11px]">BSC</span>
          <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono text-[11px]">ARB</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Revenue Model Explainer / Calculator */}
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition cursor-pointer"
            title="View Passive Revenue Math"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Affiliate</span> Math
          </button>

          {/* Share Site */}
          <button
            onClick={onShareApp}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
            title="Share Website"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
            title="Set Your Referral Links"
          >
            <Settings className="w-4 h-4" />
            <span className="text-xs hidden lg:inline">Ref Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
