import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchHero } from './components/SearchHero';
import { AuditResult } from './components/AuditResult';
import { IncomeCalculatorModal } from './components/IncomeCalculatorModal';
import { AffiliateSettingsModal } from './components/AffiliateSettingsModal';
import { Web3AdBanner } from './components/Web3AdBanner';
import { HardwareSecurityBanner } from './components/HardwareSecurityBanner';
import { Footer } from './components/Footer';
import { auditToken, DEMO_TOKENS } from './services/api';
import type { SecurityReport, ReferralSettings } from './types';

import { AlertCircle } from 'lucide-react';

const DEFAULT_SETTINGS: ReferralSettings = {
  trojanRef: import.meta.env.VITE_TROJAN_REF || 'r-misterpokhrel',
  maestroRef: import.meta.env.VITE_MAESTRO_REF || 'r-misterpokhrel',
  photonRef: import.meta.env.VITE_PHOTON_REF || 'degencheck',
  bananaGunRef: import.meta.env.VITE_BANANAGUN_REF || 'degencheck_vip',
  bullXRef: import.meta.env.VITE_BULLX_REF || 'degencheck',
  ledgerRef: import.meta.env.VITE_LEDGER_REF || 'https://shop.ledger.com/?r=degencheck',
};




export function App() {
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);

  // Settings in localStorage
  const [settings, setSettings] = useState<ReferralSettings>(() => {
    try {
      const saved = localStorage.getItem('degencheck_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const handleSaveSettings = (newSettings: ReferralSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('degencheck_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  const handleAudit = async (address: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await auditToken(address);
      setReport(res);
      // Update window hash for sharable links
      window.location.hash = address;
    } catch (err: any) {
      console.error('Audit failed:', err);
      setError(err?.message || 'Failed to scan contract. Verify the address is valid.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load: Check URL hash or load default demo token
  useEffect(() => {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash && (hash.startsWith('0x') || hash.length >= 32)) {
      handleAudit(hash);
    } else {
      // Default to initial demo token (PEPE) so visitors immediately see the value
      handleAudit(DEMO_TOKENS[0].address);
    }
  }, []);

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'DegenCheck - 1-Sec Token Safety Audit & DEX Sniper',
        text: 'Audit any Solana or EVM token for honeypots, mint dilution, and rugpull risks before buying!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Direct link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Header Navigation */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onShareApp={handleShareApp}
      />

      {/* 2. Search & Hero */}
      <main className="flex-1">
        <SearchHero onSearch={handleAudit} isLoading={isLoading} />

        {/* Error message */}
        {error && (
          <div className="max-w-2xl mx-auto px-4 my-4">
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* 3. Loading skeleton */}
        {isLoading && (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 text-sm font-mono animate-pulse">
              Simulating swap, querying GoPlus Honeypot Engine & DexScreener telemetry...
            </p>
          </div>
        )}

        {/* Web3 Sponsored Monetization Banner */}
        <Web3AdBanner trojanRef={settings.trojanRef} />

        {/* 4. Live Audit Result */}
        {!isLoading && report && (
          <>
            <AuditResult report={report} settings={settings} />
            <HardwareSecurityBanner ledgerRef={settings.ledgerRef} />
          </>
        )}

      </main>

      {/* 5. Footer */}
      <Footer />

      {/* Auxiliary Modals */}
      <IncomeCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <AffiliateSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  );
}

export default App;
