import React, { useState } from 'react';
import {
  Crown,
  Sparkles,
  Lock,
  Shield,
  Coins,
  CheckCircle2,
  ArrowRight,
  Send,
} from 'lucide-react';
import { SanitizedProfile, PricingConfig, UserSession, VipTier } from '../types';
import { ProfileCard } from './ProfileCard';
import { api } from '../services/backendApi';

interface VipLoungeViewProps {
  profiles: SanitizedProfile[];
  currentUser: UserSession;
  pricingConfig: PricingConfig;
  getUnlockCost: (profileId: string) => number;
  getActionCost: (profileId: string, action: 'message' | 'video_call' | 'gift') => number;
  onViewDetails: (profile: SanitizedProfile) => void;
  onUnlockVip: (profile: SanitizedProfile) => void;
  onMessage: (profile: SanitizedProfile) => void;
  onVideoCall: (profile: SanitizedProfile) => void;
  onToggleFavorite: (profileId: string) => void;
  onOpenAuth: (intent?: string) => void;
  onOpenWallet: () => void;
}

export const VipLoungeView: React.FC<VipLoungeViewProps> = ({
  profiles,
  currentUser,
  pricingConfig,
  getUnlockCost,
  getActionCost,
  onViewDetails,
  onUnlockVip,
  onMessage,
  onVideoCall,
  onToggleFavorite,
  onOpenAuth,
  onOpenWallet,
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [appTier, setAppTier] = useState<VipTier>('Gold');
  const [appReason, setAppReason] = useState('');
  const [appSuccess, setAppSuccess] = useState(false);

  const vipProfiles = profiles.filter((p) => p.isVip);

  const filteredVips = vipProfiles.filter((p) => {
    if (selectedTier !== 'all' && p.vipTier !== selectedTier) return false;
    return true;
  });

  const isGuest = currentUser.role === 'guest';

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appReason.trim()) return;
    api.submitVipApplication(appTier, appReason.trim());
    setAppSuccess(true);
    setTimeout(() => {
      setAppSuccess(false);
      setShowApplyModal(false);
      setAppReason('');
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Luxury Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-slate-950 to-slate-900 text-white p-6 sm:p-10 border border-amber-500/30 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-400 uppercase">
            <Crown className="w-4 h-4 fill-amber-400" />
            <span>The Private Salon · Exclusive VIP Showcase</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Curated Elegance & Verified Discretion.
          </h1>

          <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed max-w-2xl">
            VIP profiles are selectively classified by platform administrators. Visitors can preview basic details,
            while full high-definition galleries and private lifestyle dossiers remain protected until unlocked
            with credits.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {isGuest ? (
              <button
                onClick={() => onOpenAuth('register')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-98"
              >
                <span>Register to Unlock (+50 Free Credits)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-98"
              >
                <Sparkles className="w-4 h-4 fill-slate-950/20" />
                <span>Apply for VIP Classification</span>
              </button>
            )}

            <button
              onClick={onOpenWallet}
              className="px-4 py-2.5 rounded-xl border border-amber-400/30 text-amber-200 hover:bg-amber-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Wallet: {currentUser.credits} Credits</span>
            </button>
          </div>
        </div>

        {/* VIP Tier Architecture Strip */}
        <div className="mt-8 pt-6 border-t border-amber-500/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-amber-500/20">
            <div className="font-bold text-amber-400">Elite VIP</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Curated high-profile executives</div>
            <div className="font-mono text-xs text-white mt-1">
              Unlock: {pricingConfig.vipTierCharges.Elite || 25} cr
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-amber-500/20">
            <div className="font-bold text-sky-400">Diamond VIP</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Established founders & patrons</div>
            <div className="font-mono text-xs text-white mt-1">
              Unlock: {pricingConfig.vipTierCharges.Diamond || 15} cr
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-amber-500/20">
            <div className="font-bold text-amber-500">Gold VIP</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Verified creative leaders</div>
            <div className="font-mono text-xs text-white mt-1">
              Unlock: {pricingConfig.vipTierCharges.Gold || 10} cr
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-amber-500/20">
            <div className="font-bold text-slate-300">Silver VIP</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Emerging verified members</div>
            <div className="font-mono text-xs text-white mt-1">
              Unlock: {pricingConfig.vipTierCharges.Silver || 8} cr
            </div>
          </div>
        </div>
      </section>

      {/* Tier Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          {['all', 'Elite', 'Diamond', 'Gold', 'Silver'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedTier === tier
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tier === 'all' ? 'All VIPs' : `${tier} Tier`}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing <strong className="font-mono text-slate-900 dark:text-white">{filteredVips.length}</strong> VIP profiles
        </div>
      </div>

      {/* Grid of VIP Profiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVips.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            currentUser={currentUser}
            pricingConfig={pricingConfig}
            unlockCost={getUnlockCost(profile.id)}
            messageCost={getActionCost(profile.id, 'message')}
            videoCallCost={getActionCost(profile.id, 'video_call')}
            onViewDetails={onViewDetails}
            onUnlockVip={onUnlockVip}
            onMessage={onMessage}
            onVideoCall={onVideoCall}
            onToggleFavorite={onToggleFavorite}
            isFavorite={currentUser.favorites.includes(profile.id)}
          />
        ))}
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
          onClick={() => setShowApplyModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-600/40 shadow-2xl p-6 sm:p-8 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                <Crown className="w-5 h-5 fill-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  VIP Classification Application
                </h3>
                <p className="text-xs text-slate-500">
                  Request elevated VIP status reviewed by platform moderators.
                </p>
              </div>
            </div>

            {appSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Application submitted! The administrator will review your profile shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Requested VIP Tier
                  </label>
                  <select
                    value={appTier}
                    onChange={(e) => setAppTier(e.target.value as VipTier)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Silver">Silver VIP</option>
                    <option value="Gold">Gold VIP</option>
                    <option value="Diamond">Diamond VIP</option>
                    <option value="Elite">Elite VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Why are you applying for VIP classification?
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={appReason}
                    onChange={(e) => setAppReason(e.target.value)}
                    placeholder="Provide professional background, portfolio links, or motivation..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
