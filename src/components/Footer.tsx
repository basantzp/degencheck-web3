import React from 'react';
import { ShieldCheck } from 'lucide-react';


export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-10 text-slate-500 text-xs text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-center gap-2 text-slate-400 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>DegenCheck Protocol Engine</span>
          <span>•</span>
          <span>Powered by DexScreener & GoPlus Security APIs</span>
        </div>

        <p className="max-w-2xl mx-auto text-slate-600 text-[11px] leading-relaxed">
          Disclaimer: DegenCheck is an algorithmic smart-contract heuristic tool. Automated audits do not guarantee 100% security against sophisticated multi-sig drainers or off-chain developer manipulation. Always conduct independent due diligence.
        </p>

        <div className="flex items-center justify-center gap-4 text-slate-400 pt-2">
          <span>EVM & Solana Real-Time Auditor</span>
          <span>•</span>
          <span className="text-emerald-400 font-mono">0.1s Fast Heuristics</span>
          <span>•</span>
          <span>Open Web3 Architecture</span>
        </div>
      </div>
    </footer>
  );
};
