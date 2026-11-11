import React from 'react';
import {
  Coins,
  CheckCircle2,
  Crown,
  Sparkles,
  Eye,
  MessageCircle,
  Video,
  Gift,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { PricingConfig, UserSession } from '../types';

interface RatesViewProps {
  pricingConfig: PricingConfig;
  currentUser: UserSession;
  onOpenWallet: () => void;
  onOpenAuth: (intent?: string) => void;
}

export const RatesView: React.FC<RatesViewProps> = ({
  pricingConfig,
  currentUser,
  onOpenWallet,
  onOpenAuth,
}) => {
  const isGuest = currentUser.role === 'guest';

  const durationLabel = {
    permanent: 'Permanent Lifetime Access',
    '24h': '24 Hours Access',
    '7d': '7 Days Access',
    '30d': '30 Days Access',
  }[pricingConfig.vipProfileDuration];

  return (
    <div className="space-y-10">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-semibold">
          <Coins className="w-3.5 h-3.5" />
          <span>Transparent Credit-Based Marketplace</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Tiered Engagement Pricing & Credits
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Public visitors browse regular profiles completely free. When you choose to interact or explore
          exclusive VIP portfolios, our credit-based system ensures clarity, discretion, and fair value.
        </p>
      </div>

      {/* The Two Modes Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mode 1: Guest Browsing */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Access Tier 01
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Mode 1: Guest Browsing
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Experience the platform with zero barriers. No registration, email, or credit card required.
            </p>

            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Browse regular user profiles without logging in</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Filter by age, country, city, interests, and gender</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>View public bios, photographs, and active status</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <span className="w-4 h-4 flex items-center justify-center font-bold text-slate-300 dark:text-slate-600">✕</span>
                <span>Restricted from sending messages, calls, or unlocking VIPs</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-mono">Cost: $0.00 / Always Free</span>
          </div>
        </div>

        {/* Mode 2: Registered Member */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-2 border-rose-300 dark:border-rose-900/60 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Access Tier 02
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                +50 Free Credits Included
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Mode 2: Registered User
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Register when you want to engage. Receive 50 free credits upon sign-up to immediately test interactions.
            </p>

            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>50 Welcome Credits automatically deposited</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Direct encrypted 1-on-1 text messaging</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Live HD video calls with metered credit billing</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Unlock VIP dossiers ({durationLabel})</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-rose-100 dark:border-slate-800 flex items-center justify-between">
            {isGuest ? (
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>Register Now & Get 50 Free Credits</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenWallet}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white dark:bg-slate-700 hover:bg-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Open Wallet (Current: {currentUser.credits} Credits)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Official Master Rate Matrix (Section D & 17) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Official Engagement Rate Card
            </h3>
            <p className="text-xs text-slate-500">
              Configured independently by platform administrators. All charges are shown before engaging.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Unlock Duration: <strong className="text-slate-900 dark:text-white">{durationLabel}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Activity</th>
                <th className="py-3 px-4">Regular Member</th>
                <th className="py-3 px-4">VIP Member (Tiered)</th>
                <th className="py-3 px-4">Deduction Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>View Complete Profile</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Free (0 Credits)
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                  {pricingConfig.vipProfileView} Credits (Standard)
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  Deducted only upon successful profile reveal
                </td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>Category-Specific VIP Unlocks</span>
                </td>
                <td className="py-3.5 px-4 text-slate-400">
                  N/A
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                  Silver: {pricingConfig.vipTierCharges.Silver} cr · Gold: {pricingConfig.vipTierCharges.Gold} cr · Diamond: {pricingConfig.vipTierCharges.Diamond} cr · Elite: {pricingConfig.vipTierCharges.Elite} cr
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  Tier-based administrative pricing
                </td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-slate-400" />
                  <span>Send Text Message</span>
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {pricingConfig.regularTextMessage} Credits
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                  {pricingConfig.vipTextMessage} Credits
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  Charged per message sent
                </td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-slate-400" />
                  <span>1-on-1 Video Call</span>
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {pricingConfig.regularVideoCallPerMinute} Credits / Minute
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                  {pricingConfig.vipVideoCallPerMinute} Credits / Minute
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  Metered in real time; rounded up to whole minute
                </td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <Gift className="w-4 h-4 text-slate-400" />
                  <span>Virtual Gifts & Priority Boosts</span>
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {pricingConfig.regularGiftFee} Credits
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                  {pricingConfig.vipGiftFee} Credits
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  One-time priority dispatch fee
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
