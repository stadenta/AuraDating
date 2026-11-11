import React from 'react';
import {
  Crown,
  Heart,
  MessageCircle,
  Video,
  Lock,
  Unlock,
  MapPin,
  CheckCircle2,
  Eye,
  Sparkles,
} from 'lucide-react';
import { SanitizedProfile, PricingConfig, UserSession } from '../types';

interface ProfileCardProps {
  profile: SanitizedProfile;
  currentUser: UserSession;
  pricingConfig: PricingConfig;
  unlockCost: number;
  messageCost: number;
  videoCallCost: number;
  onViewDetails: (profile: SanitizedProfile) => void;
  onUnlockVip: (profile: SanitizedProfile) => void;
  onMessage: (profile: SanitizedProfile) => void;
  onVideoCall: (profile: SanitizedProfile) => void;
  onToggleFavorite: (profileId: string) => void;
  isFavorite: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  currentUser,
  pricingConfig,
  unlockCost,
  messageCost,
  videoCallCost,
  onViewDetails,
  onUnlockVip,
  onMessage,
  onVideoCall,
  onToggleFavorite,
  isFavorite,
}) => {
  const isGuest = currentUser.role === 'guest';
  const isVipLocked = profile.isRestrictedVip;

  // Status indicator styling
  const statusConfig = {
    online: {
      label: 'Online',
      color: 'bg-emerald-500',
      textClass: 'text-emerald-700 dark:text-emerald-400',
    },
    recently_active: {
      label: profile.lastActiveText || 'Recent',
      color: 'bg-amber-500',
      textClass: 'text-amber-700 dark:text-amber-400',
    },
    offline: {
      label: 'Offline',
      color: 'bg-slate-400',
      textClass: 'text-slate-500 dark:text-slate-400',
    },
  }[profile.onlineStatus];

  // VIP Tier Badge Color styling
  const vipTierBadges: Record<string, { bg: string; text: string; border: string }> = {
    Elite: {
      bg: 'bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 dark:from-amber-500/30 dark:via-rose-500/30 dark:to-purple-500/30',
      text: 'text-amber-700 dark:text-amber-300 font-bold',
      border: 'border-amber-400/50 dark:border-amber-500/40',
    },
    Diamond: {
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      text: 'text-sky-700 dark:text-sky-300 font-bold',
      border: 'border-sky-300 dark:border-sky-700',
    },
    Gold: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-300 font-bold',
      border: 'border-amber-300 dark:border-amber-700',
    },
    Silver: {
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-700 dark:text-slate-300 font-bold',
      border: 'border-slate-300 dark:border-slate-700',
    },
  };

  const currentBadge = profile.vipTier ? vipTierBadges[profile.vipTier] || vipTierBadges.Gold : vipTierBadges.Gold;

  return (
    <div
      className={`group relative flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border transition-all duration-200 hover:shadow-lg ${
        profile.isVip
          ? 'border-amber-300/80 dark:border-amber-500/40 hover:border-amber-400'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Photo Frame Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={profile.avatar}
          alt={profile.displayName}
          referrerPolicy="no-referrer"
          className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-102 ${
            isVipLocked ? 'blur-md brightness-90 saturate-75 scale-105' : ''
          }`}
        />

        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Badges Strip */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
          {/* VIP Badge */}
          {profile.isVip ? (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md backdrop-blur-md border shadow-xs text-xs tracking-wider uppercase ${currentBadge.bg} ${currentBadge.border} ${currentBadge.text}`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>VIP {profile.vipTier || 'MEMBER'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-white/90 text-xs font-medium">
              <span>Verified Member</span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(profile.id);
            }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-black/30 hover:bg-black/50 text-white/90'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Locked Overlay for VIP preview */}
        {isVipLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 pointer-events-none">
            <div className="w-11 h-11 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-white tracking-wide uppercase">
              VIP Restricted Profile
            </div>
            <div className="text-[11px] text-amber-200/90 mt-0.5">
              Unlock with {unlockCost} Credits
            </div>
          </div>
        )}

        {/* Bottom Photo Overlay Info */}
        <div className="absolute bottom-3 inset-x-3 text-white z-10">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 truncate">
              {profile.displayName}, {profile.age}
              {profile.verified && (
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 inline-block fill-sky-400/20" />
              )}
            </h3>

            {/* Unlocked marker if user already paid */}
            {profile.isVip && !isVipLocked && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                <Unlock className="w-3 h-3" />
                Unlocked
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-white/80 mt-0.5">
            <div className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 shrink-0 text-white/60" />
              <span>
                {profile.city}, {profile.country}
              </span>
            </div>
            <span aria-hidden="true">·</span>
            {/* Status with clean unboxed text and status dot */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.color}`} />
              <span className="text-[11px]">{statusConfig.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Biography */}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {profile.bio}
          </p>

          {/* Interests as unboxed text with subtle separators */}
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
            {profile.interests.slice(0, 3).map((interest, i) => (
              <React.Fragment key={interest}>
                {i > 0 && <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>}
                <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                  {interest}
                </span>
              </React.Fragment>
            ))}
            {profile.interests.length > 3 && (
              <>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-slate-400">+{profile.interests.length - 3}</span>
              </>
            )}
          </div>
        </div>

        {/* Pricing & Interaction Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {/* Rates disclosure row */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
            <span>
              Chat: <strong className="font-mono tabular-nums text-slate-700 dark:text-slate-200">{messageCost} cr</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Video: <strong className="font-mono tabular-nums text-slate-700 dark:text-slate-200">{videoCallCost} cr/m</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {profile.isVip ? (
                <>View: <strong className="font-mono tabular-nums text-amber-600 dark:text-amber-400">{unlockCost} cr</strong></>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">View: Free</span>
              )}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {/* Left Button: View or Unlock */}
            {isVipLocked ? (
              <button
                onClick={() => onUnlockVip(profile)}
                className="w-full py-2 px-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-98"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950/20" />
                <span>Unlock ({unlockCost} cr)</span>
              </button>
            ) : (
              <button
                onClick={() => onViewDetails(profile)}
                className="w-full py-2 px-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Full Profile</span>
              </button>
            )}

            {/* Right Button: Message or Video Call */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onMessage(profile)}
                title={`Send message (${messageCost} credits)`}
                className="flex-1 py-2 px-2 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-rose-600 dark:hover:bg-rose-500 flex items-center justify-center gap-1 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => onVideoCall(profile)}
                title={`Start video call (${videoCallCost} credits/min)`}
                className="p-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
