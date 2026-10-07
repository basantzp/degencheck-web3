import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Zap,
  TrendingUp,
  DollarSign,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Share2,
  Send,
} from 'lucide-react';
import type { SecurityReport, ReferralSettings } from '../types';

interface AuditResultProps {
  report: SecurityReport;
  settings: ReferralSettings;
}

export const AuditResult: React.FC<AuditResultProps> = ({ report, settings }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAlpha, setCopiedAlpha] = useState(false);

  const {
    tokenAddress,
    chain,
    chainName,
    safetyScore,
    riskLevel,
    marketData,
    isHoneypot,
    buyTax,
    sellTax,
    mintAuthRevoked,
    top10HoldersPct,
    risks,
  } = report;

  // Determine colors based on score
  const isSafe = safetyScore >= 80;
  const isModerate = safetyScore >= 55 && safetyScore < 80;

  const scoreColor = isSafe

    ? 'text-emerald-400'
    : isModerate
    ? 'text-amber-400'
    : 'text-rose-500';

  const badgeBg = isSafe
    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
    : isModerate
    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
    : 'bg-rose-500/10 border-rose-500/30 text-rose-300';

  // Sniper Bot Links with user's configured referral tags
  const isSol = chain === 'solana';
  const trojanUrl = `https://t.me/solana_trojanbot?start=${encodeURIComponent(settings.trojanRef)}_${encodeURIComponent(tokenAddress)}`;
  const photonUrl = `https://photon-sol.tinyastro.io/en/r/${encodeURIComponent(settings.photonRef)}/token/${encodeURIComponent(tokenAddress)}`;
  const maestroUrl = `https://t.me/MaestroSniperBot?start=${encodeURIComponent(settings.maestroRef)}-${encodeURIComponent(tokenAddress)}`;
  const bananaGunUrl = `https://t.me/BananaGunSniper_bot?start=${encodeURIComponent(settings.bananaGunRef)}_${encodeURIComponent(tokenAddress)}`;

  // Primary recommended bot
  const primaryBotName = isSol ? 'Trojan on Solana' : 'Maestro Sniper Bot';
  const primaryBotUrl = isSol ? trojanUrl : maestroUrl;
  const secondaryBotName = isSol ? 'Photon SOL (Web Terminal)' : 'Banana Gun Bot';
  const secondaryBotUrl = isSol ? photonUrl : bananaGunUrl;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyAlpha = () => {
    const symbol = marketData?.symbol || 'TOKEN';
    const text = `🛡️ DegenCheck Token Audit: $${symbol}\n` +
      `Chain: ${chainName}\n` +
      `Safety Score: ${safetyScore}/100 (${riskLevel})\n` +
      `• Honeypot: ${isHoneypot ? '❌ YES (CANNOT SELL)' : '✅ PASS'}\n` +
      `• Taxes: ${buyTax}% Buy / ${sellTax}% Sell\n` +
      `• Mint: ${mintAuthRevoked ? '✅ Revoked' : '⚠️ Active'}\n` +
      `• Liquidity: $${marketData ? Math.round(marketData.liquidityUsd).toLocaleString() : 'N/A'}\n` +
      `\n📊 Full Audit: ${window.location.origin}/#${tokenAddress}\n` +
      `⚡ Snipe with MEV Shield: ${primaryBotUrl}`;

    navigator.clipboard.writeText(text);
    setCopiedAlpha(true);
    setTimeout(() => setCopiedAlpha(false), 2000);
  };

  const handleShareTweet = () => {
    const symbol = marketData?.symbol || 'TOKEN';
    const tweetText = `Scanned $${symbol} contract on @DegenCheck:\n` +
      `Safety Score: ${safetyScore}/100 [${riskLevel}]\n` +
      `Taxes: ${buyTax}%/${sellTax}% | Honeypot: ${isHoneypot ? 'YES' : 'NO'}\n` +
      `Check report before buying:`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-20 space-y-6">
      {/* 1. TOP SUMMARY CARD */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Subtle background risk tint */}
        <div
          className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none ${
            isSafe ? 'bg-emerald-500/10' : isModerate ? 'bg-amber-500/10' : 'bg-rose-500/15'
          }`}
        />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          {/* Token Identification & Market Metrics */}
          <div className="flex-1 text-left w-full">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                {marketData?.name || 'Verified Token'}
                <span className="text-slate-400 font-mono text-xl sm:text-2xl">
                  (${marketData?.symbol || 'TOKEN'})
                </span>
              </span>

              <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${badgeBg}`}>
                {riskLevel}
              </span>

              <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-semibold">
                {chainName}
              </span>
            </div>

            {/* Address with copy */}
            <div className="mt-2 flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800 break-all select-all">
                {tokenAddress}
              </span>
              {marketData?.pairUrl && (
                <a
                  href={marketData.pairUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1"
                  title="View on DexScreener"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">DexScreener</span>
                </a>
              )}
            </div>

            {/* Real-time Market Stats */}
            {marketData && (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Price USD</span>
                  <span className="font-mono font-bold text-white text-sm sm:text-base">
                    {marketData.priceUsd}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">24h Change</span>
                  <span
                    className={`font-mono font-bold text-sm sm:text-base flex items-center gap-0.5 ${
                      marketData.priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {marketData.priceChange24h >= 0 ? '+' : ''}
                    {marketData.priceChange24h.toFixed(2)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Liquidity</span>
                  <span className="font-mono font-bold text-white text-sm sm:text-base">
                    ${Math.round(marketData.liquidityUsd).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">24h Volume</span>
                  <span className="font-mono font-bold text-white text-sm sm:text-base">
                    ${Math.round(marketData.volume24h).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Radial Safety Score Meter */}
          <div className="shrink-0 flex flex-col items-center justify-center p-4 bg-slate-950/90 rounded-2xl border border-slate-800 w-44 h-44 shadow-inner">
            <div className="relative flex items-center justify-center">
              {/* SVG circular progress */}
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-800"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - safetyScore / 100)}
                  strokeLinecap="round"
                  className={`${scoreColor} transition-all duration-1000 ease-out`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-3xl font-extrabold font-mono tracking-tight ${scoreColor}`}>
                  {safetyScore}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  / 100
                </span>
              </div>
            </div>
            <span className="mt-2 text-xs font-bold text-slate-300">
              Safety Score
            </span>
          </div>
        </div>
      </div>

      {/* 2. 💰 THE PROFIT CENTER: SNIPER BOT CTA BANNER */}
      <div className="relative rounded-2xl p-6 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border-2 border-emerald-500/40 shadow-xl shadow-emerald-950/40 overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-5 relative z-10">
          <div className="text-left space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>Recommended Fast Execution Route</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Snipe with MEV Shield & 0-Lag Execution
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm">
              Don't get front-run or sandwich-attacked on public DEX interfaces. Route trades through professional private RPC sniper bots with auto-slippage and instant stop-loss.
            </p>

            <div className="flex items-center gap-3 pt-1 text-[11px] text-emerald-400/90 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 10% Lifetime Fee Discount
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Anti-MEV Private Mempool
              </span>
            </div>
          </div>

          {/* Action Snipe Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <a
              href={primaryBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-teal-400 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer text-center"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Snipe on {primaryBotName}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <a
              href={secondaryBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <span>Trade via {secondaryBotName}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. CORE SECURITY ATTRIBUTES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        {/* Honeypot Check */}
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
          <div className={`p-2.5 rounded-lg shrink-0 ${isHoneypot ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
            {isHoneypot ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-slate-400 text-xs block">Honeypot Status</span>
            <span className={`font-bold text-sm ${isHoneypot ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isHoneypot ? 'HONEYPOT (Cannot Sell)' : 'Sellable (Safe)'}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isHoneypot ? 'Transfer restrictions active.' : 'Simulated sell tests execute cleanly.'}
            </p>
          </div>
        </div>

        {/* Buy & Sell Taxes */}
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
          <div className={`p-2.5 rounded-lg shrink-0 ${sellTax > 10 ? 'bg-rose-500/15 text-rose-400' : sellTax > 0 ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 text-xs block">DEX Slippage Tax</span>
            <span className={`font-bold text-sm ${sellTax > 10 ? 'text-rose-400' : sellTax > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {buyTax}% Buy / {sellTax}% Sell
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {sellTax > 10 ? 'High tax trap!' : sellTax > 0 ? 'Moderate fee on swap.' : '0% clean DEX swaps.'}
            </p>
          </div>
        </div>

        {/* Mint Authority */}
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
          <div className={`p-2.5 rounded-lg shrink-0 ${mintAuthRevoked ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
            {mintAuthRevoked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-slate-400 text-xs block">Mint Authority</span>
            <span className={`font-bold text-sm ${mintAuthRevoked ? 'text-emerald-400' : 'text-rose-400'}`}>
              {mintAuthRevoked ? 'Revoked (Capped)' : 'Active (Dilution Risk)'}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {mintAuthRevoked ? 'No extra supply can be printed.' : 'Dev can mint more tokens.'}
            </p>
          </div>
        </div>

        {/* Top 10 Concentration */}
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
          <div className={`p-2.5 rounded-lg shrink-0 ${top10HoldersPct > 40 ? 'bg-rose-500/15 text-rose-400' : top10HoldersPct > 20 ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 text-xs block">Top 10 Whales</span>
            <span className={`font-bold text-sm ${top10HoldersPct > 40 ? 'text-rose-400' : top10HoldersPct > 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {top10HoldersPct.toFixed(1)}% of Supply
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {top10HoldersPct > 40 ? 'Whale dump risk.' : 'Distributed supply.'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. DETAILED RISK AUDIT BREAKDOWN */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-left">
        <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Automated Contract Risk Findings ({risks.length})
        </h4>

        <div className="divide-y divide-slate-800/80 space-y-3">
          {risks.map((risk) => {
            const isDangerRisk = risk.level === 'danger';
            const isWarnRisk = risk.level === 'warning';
            return (
              <div key={risk.id} className="pt-3 flex items-start gap-3 justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {isDangerRisk ? (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    ) : isWarnRisk ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-200">
                      {risk.title}
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {risk.description}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded shrink-0 ${
                    isDangerRisk
                      ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      : isWarnRisk
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  }`}
                >
                  {risk.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. VIRAL ALPHA SHARING CARD */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Share2 className="w-4 h-4 text-emerald-400" />
          <span>Share this safety scorecard with your alpha group or community:</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopyAlpha}
            className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            {copiedAlpha ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAlpha ? 'Copied Alpha!' : 'Copy Alpha Report'}</span>
          </button>

          <button
            onClick={handleShareTweet}
            className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Tweet on X</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            title="Copy Direct Link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ExternalLink className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
