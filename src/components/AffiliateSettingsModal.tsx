import React, { useState } from 'react';
import { X, Settings, Save, RotateCcw, Check } from 'lucide-react';
import type { ReferralSettings } from '../types';


interface AffiliateSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReferralSettings;
  onSave: (newSettings: ReferralSettings) => void;
}

export const AffiliateSettingsModal: React.FC<AffiliateSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [form, setForm] = useState<ReferralSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    const defaultSettings: ReferralSettings = {
      trojanRef: 'degencheck_vip',
      maestroRef: 'degencheck_alpha',
      photonRef: 'degencheck',
      bananaGunRef: 'degencheck_vip',
      bullXRef: 'degencheck',
      ledgerRef: 'https://shop.ledger.com/?r=degencheck',
    };
    setForm(defaultSettings);
    onSave(defaultSettings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Monetization & Referral Setup
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Plug in your referral IDs to route 100% of bot transaction fee shares into your wallet.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm mt-5">
          {/* Trojan on Solana */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Trojan on Solana Referral Code:
            </label>
            <input
              type="text"
              value={form.trojanRef}
              onChange={(e) => setForm({ ...form, trojanRef: e.target.value })}
              placeholder="e.g. your_trojan_tag"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs sm:text-sm outline-none"
            />
            <span className="text-[11px] text-slate-500">
              Get via Telegram: Open <code>@solana_trojanbot</code> &gt; type <code>/referral</code>. Pays 30% lifetime fees.
            </span>
          </div>

          {/* Maestro Sniper Bot */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Maestro Sniper Bot Referral Code:
            </label>
            <input
              type="text"
              value={form.maestroRef}
              onChange={(e) => setForm({ ...form, maestroRef: e.target.value })}
              placeholder="e.g. your_maestro_ref"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs sm:text-sm outline-none"
            />
            <span className="text-[11px] text-slate-500">
              Multi-chain (ETH/Base/BSC/SOL). Open <code>@MaestroSniperBot</code> &gt; type <code>/referral</code>. Pays 25% lifetime fees.
            </span>
          </div>

          {/* Photon-SOL */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Photon SOL Referral Code:
            </label>
            <input
              type="text"
              value={form.photonRef}
              onChange={(e) => setForm({ ...form, photonRef: e.target.value })}
              placeholder="e.g. photon_ref_code"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs sm:text-sm outline-none"
            />
          </div>

          {/* Banana Gun */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Banana Gun Bot Referral Code:
            </label>
            <input
              type="text"
              value={form.bananaGunRef}
              onChange={(e) => setForm({ ...form, bananaGunRef: e.target.value })}
              placeholder="e.g. bananagun_tag"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs sm:text-sm outline-none"
            />
          </div>

          {/* Hardware Wallet Link */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Ledger / Trezor Affiliate Link:
            </label>
            <input
              type="text"
              value={form.ledgerRef}
              onChange={(e) => setForm({ ...form, ledgerRef: e.target.value })}
              placeholder="https://shop.ledger.com/?r=yourid"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs sm:text-sm outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm hover:from-emerald-400 hover:to-teal-400 transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved & Applied!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Referral IDs
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
