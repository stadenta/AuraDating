import React, { useState } from 'react';
import {
  X,
  Coins,
  CreditCard,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  Crown,
  Sparkles,
} from 'lucide-react';
import { UserSession, Transaction } from '../types';
import { api } from '../services/backendApi';

interface WalletModalProps {
  currentUser: UserSession;
  onClose: () => void;
  onRefreshUser: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  currentUser,
  onClose,
  onRefreshUser,
}) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'history'>('packages');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successNote, setSuccessNote] = useState<string | null>(null);

  const transactions = api.getTransactions(currentUser.id);

  const PACKAGES = [
    {
      id: 'pkg-starter',
      name: 'Explorer Tier',
      credits: 100,
      price: '$9.99',
      badge: 'Starter',
      popular: false,
      description: 'Ideal for browsing public profiles and trying out direct VIP messaging.',
    },
    {
      id: 'pkg-popular',
      name: 'Patron Selection',
      credits: 300,
      price: '$24.99',
      badge: 'Best Value',
      popular: true,
      description: 'Unlock multiple VIP profiles and engage in live high-definition video calls.',
    },
    {
      id: 'pkg-vip',
      name: 'High Roller VIP',
      credits: 1000,
      price: '$69.99',
      badge: 'Maximum Access',
      popular: false,
      description: 'Full uninhibited VIP access, unlimited video discussions, and premium gifts.',
    },
  ];

  const handlePurchase = (pkg: typeof PACKAGES[0]) => {
    setIsProcessing(true);
    setTimeout(() => {
      api.topUpCredits(pkg.credits, pkg.name);
      onRefreshUser();
      setIsProcessing(false);
      setSuccessNote(`Successfully added ${pkg.credits} credits to your account!`);
      setTimeout(() => setSuccessNote(null), 4000);
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close wallet"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header & Balance Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold tracking-wider uppercase text-rose-500">
              Aura Credit Treasury
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Credit Balance & Packages
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Credits power all paid discovery unlocks, direct messages, and live video sessions.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">Available Credits</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-amber-900 dark:text-amber-100">
                {currentUser.credits}
              </div>
            </div>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('packages')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'packages'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Credit Top-Up Packages
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'history'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Transaction History ({transactions.length})
          </button>
        </div>

        {/* Success toast */}
        {successNote && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successNote}</span>
          </div>
        )}

        {/* Packages View */}
        {activeTab === 'packages' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-2xl p-4 flex flex-col justify-between border transition-all ${
                  pkg.popular
                    ? 'border-rose-500 dark:border-rose-500 bg-rose-50/30 dark:bg-rose-950/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    {pkg.badge}
                  </div>
                )}

                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {pkg.name}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      +{pkg.credits}
                    </span>
                    <span className="text-xs text-slate-500">Credits</span>
                  </div>
                  <div className="text-base font-bold text-rose-600 dark:text-rose-400 mt-1">
                    {pkg.price}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={isProcessing}
                  className={`mt-4 w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-98 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Instant Add {pkg.credits} Cr</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Transaction Ledger */
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No credit transactions logged yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((tx) => {
                  const isPositive = tx.credits > 0;
                  return (
                    <div
                      key={tx.id}
                      className="py-2.5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isPositive
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {isPositive ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {tx.description}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {new Date(tx.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`font-mono tabular-nums font-bold ${
                          isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {isPositive ? `+${tx.credits}` : tx.credits} cr
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
