import React from 'react';
import { ExternalLink, Zap } from 'lucide-react';


interface Web3AdBannerProps {
  trojanRef: string;
}

export const Web3AdBanner: React.FC<Web3AdBannerProps> = ({ trojanRef }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 my-6">
      {/* High-CTR Web3 Native Sponsor Unit */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/40 transition">
        <div className="flex items-center gap-3 text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            Sponsored
          </span>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0 fill-emerald-400" />
            <span className="text-slate-300 font-medium">
              Tired of slow transactions on Raydium & Uniswap? 
              <span className="text-white font-semibold ml-1">
                Snipe newly launched tokens with sub-100ms private RPC execution.
              </span>
            </span>
          </div>
        </div>

        <a
          href={`https://t.me/solana_trojanbot?start=${encodeURIComponent(trojanRef)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5 transition shrink-0 cursor-pointer"
        >
          <span>Claim 10% Fee Rebate</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
