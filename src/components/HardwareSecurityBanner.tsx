import React from 'react';
import { Key, ArrowRight } from 'lucide-react';


interface HardwareSecurityBannerProps {
  ledgerRef: string;
}

export const HardwareSecurityBanner: React.FC<HardwareSecurityBannerProps> = ({ ledgerRef }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-12">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-4 text-left">
          <div className="p-3.5 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shrink-0">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Cold Storage Rule
              </span>
              <span className="text-xs text-slate-400 font-medium">10% Off Hardware Offer</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white mt-1">
              Taking Big Meme Coin Profits? Move Funds Off Hot Wallets.
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Hot browser extensions and Telegram bots get drained. Never leave portfolio gains on active trading wallets. Secure your seed offline with a certified hardware enclave.
            </p>
          </div>
        </div>

        <a
          href={ledgerRef}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-indigo-600/20 cursor-pointer w-full md:w-auto"
        >
          <span>Get Ledger Nano X</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
