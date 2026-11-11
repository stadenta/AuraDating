import React, { useState } from 'react';
import {
  Crown,
  Sparkles,
  Lock,
  Unlock,
  Coins,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
} from 'lucide-react';
import { SanitizedProfile, PricingConfig, UserSession } from '../types';

interface VipUnlockModalProps {
  profile: SanitizedProfile | null;
  currentUser: UserSession;
  pricingConfig: PricingConfig;
  unlockCost: number;
  onClose: () => void;
  onConfirmUnlock: (profileId: string) => void;
  onOpenWallet: () => void;
  onOpenAuth: (intent?: string) => void;
}

export const VipUnlockModal: React.FC<VipUnlockModalProps> = ({
  profile,
  currentUser,
  pricingConfig,
  unlockCost,
  onClose,
  onConfirmUnlock,
  onOpenWallet,
  onOpenAuth,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!profile) return null;

  const isGuest = currentUser.role === 'guest';
  const hasEnoughCredits = currentUser.credits >= unlockCost;
  const remainingCredits = currentUser.credits - unlockCost;

  const durationLabel = {
    permanent: 'Permanent Lifetime Access',
    '24h': '24 Hours Access',
    '7d': '7 Days Access',
    '30d': '30 Days Access',
  }[pricingConfig.vipProfileDuration];

  const handleUnlock = () => {
    if (isGuest) {
      onOpenAuth(`unlock:${profile.id}`);
      return;
    }

    if (!hasEnoughCredits) {
      onOpenWallet();
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      onConfirmUnlock(profile.id);
      setIsProcessing(false);
      onClose();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-600/40 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-amber-400/30 border border-amber-400/50 flex items-center justify-center text-amber-500 shadow-inner">
            <Crown className="w-8 h-8 fill-amber-500" />
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold tracking-wider uppercase text-amber-600 dark:text-amber-400">
              VIP Tier Access Protocol
            </div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Unlock {profile.displayName}&apos;s Profile
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {profile.city}, {profile.country} · VIP {profile.vipTier || 'Elite'}
            </p>
          </div>
        </div>

        {/* Benefits list */}
        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Unblur full ultra-high-definition photo gallery ({profile.galleryCount} photos)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Reveal extended personal biography & dating lifestyle preferences</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Validity period: <strong className="font-medium text-amber-900 dark:text-amber-300">{durationLabel}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Backend enforced privacy guarantee</span>
          </div>
        </div>

        {/* Financial calculation breakdown */}
        <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>VIP Profile Viewing Fee</span>
            <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
              {unlockCost} Credits
            </span>
          </div>

          {!isGuest && (
            <>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Your Current Wallet Balance</span>
                <span className="font-mono tabular-nums font-semibold text-amber-600 dark:text-amber-400">
                  {currentUser.credits} Credits
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 font-medium">
                <span className="text-slate-700 dark:text-slate-300">Remaining Balance After Unlock</span>
                <span
                  className={`font-mono tabular-nums font-bold ${
                    remainingCredits >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-500'
                  }`}
                >
                  {remainingCredits >= 0 ? `${remainingCredits} Credits` : 'Insufficient Credits'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Warning if insufficient credits */}
        {!isGuest && !hasEnoughCredits && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              You need <strong className="font-mono">{unlockCost - currentUser.credits}</strong> more credits to unlock this VIP profile.
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-2">
          {isGuest ? (
            <button
              onClick={handleUnlock}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>Register to Unlock (+50 Free Credits)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : !hasEnoughCredits ? (
            <button
              onClick={() => {
                onClose();
                onOpenWallet();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Coins className="w-4 h-4" />
              <span>Top Up Wallet Credits</span>
            </button>
          ) : (
            <button
              onClick={handleUnlock}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/30 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Unlocking Dossier...</span>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Confirm & Deduct {unlockCost} Credits</span>
                </>
              )}
            </button>
          )}

          <p className="text-[11px] text-center text-slate-400">
            Credits are only deducted upon successful profile disclosure.
          </p>
        </div>
      </div>
    </div>
  );
};
