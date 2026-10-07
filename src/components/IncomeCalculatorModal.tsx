import React, { useState } from 'react';
import { X, DollarSign, Users, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';


interface IncomeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IncomeCalculatorModal: React.FC<IncomeCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [traders, setTraders] = useState(50);
  const [dailyVolume, setDailyVolume] = useState(500);
  const [monthlyVisitors, setMonthlyVisitors] = useState(15000);

  if (!isOpen) return null;

  // Math
  const botFeeRate = 0.01; // 1%
  const referralShareRate = 0.30; // 30%
  const dailyTotalVolume = traders * dailyVolume;
  const dailyBotFees = dailyTotalVolume * botFeeRate;
  const yourDailyBotCut = dailyBotFees * referralShareRate;
  const yourMonthlyBotCut = yourDailyBotCut * 30;

  // Secondary Ad Revenue (Crypto CPM ~ $25)
  const monthlyAdRevenue = (monthlyVisitors / 1000) * 25;

  const totalMonthlyIncome = yourMonthlyBotCut + monthlyAdRevenue;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Passive Web3 Revenue Simulator
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Calculate projected monthly cashflow from sniper bot referral fee sharing.
            </p>
          </div>
        </div>

        {/* Big Highlight Earnings Metric */}
        <div className="my-6 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-950 to-teal-950/80 border-2 border-emerald-500/40 text-center relative overflow-hidden">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold block mb-1">
            Projected Monthly Passive Revenue
          </span>
          <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 font-mono">
            ${Math.round(totalMonthlyIncome).toLocaleString()}
            <span className="text-base text-slate-400 font-normal"> / month</span>
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-300">
            <span>🤖 Bot Fees: <strong className="text-emerald-400">${Math.round(yourMonthlyBotCut).toLocaleString()}</strong></span>
            <span>•</span>
            <span>📢 Web3 Ads: <strong className="text-teal-400">${Math.round(monthlyAdRevenue).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Interactive Sliders */}
        <div className="space-y-5 text-sm">
          {/* Slider 1: Active Traders */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Active Traders Using Your Bot Link:
              </span>
              <span className="font-mono font-bold text-emerald-400 text-base">
                {traders} traders
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              step="5"
              value={traders}
              onChange={(e) => setTraders(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Typical conversion: ~2% - 4% of visitors click and connect the bot to trade.
            </span>
          </div>

          {/* Slider 2: Average Daily Volume */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-400" />
                Avg. Daily Trading Volume per Trader:
              </span>
              <span className="font-mono font-bold text-teal-400 text-base">
                ${dailyVolume.toLocaleString()} / day
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="3000"
              step="50"
              value={dailyVolume}
              onChange={(e) => setDailyVolume(parseInt(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Active meme coin degens typically trade between $300 and $2,000 per day.
            </span>
          </div>

          {/* Slider 3: Monthly Traffic */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Monthly Page Visitors:
              </span>
              <span className="font-mono font-bold text-cyan-400 text-base">
                {monthlyVisitors.toLocaleString()} views
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={monthlyVisitors}
              onChange={(e) => setMonthlyVisitors(parseInt(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Why this model works */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2 text-slate-300">
          <span className="font-bold text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Why This Outperforms Traditional Blogs:
          </span>
          <p>
            1. <strong>Lifetime Revenue Share:</strong> Unlike e-commerce where you get a single $5 commission, bot referral programs pay you a percentage of every single buy and sell order your referred user makes forever.
          </p>
          <p>
            2. <strong>High Frequency Trading:</strong> Crypto meme traders flip 5 to 30 coins a day. Even a small pool of 50 traders produces massive compounding fee volume.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition cursor-pointer"
        >
          Got it, Close Simulator
        </button>
      </div>
    </div>
  );
};
