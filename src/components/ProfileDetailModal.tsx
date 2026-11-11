import React, { useState } from 'react';
import {
  X,
  Crown,
  Heart,
  MessageCircle,
  Video,
  Lock,
  Unlock,
  MapPin,
  CheckCircle2,
  Shield,
  Flag,
  Ban,
  Sparkles,
  Globe2,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { SanitizedProfile, PricingConfig, UserSession } from '../types';

interface ProfileDetailModalProps {
  profile: SanitizedProfile | null;
  currentUser: UserSession;
  pricingConfig: PricingConfig;
  unlockCost: number;
  messageCost: number;
  videoCallCost: number;
  onClose: () => void;
  onUnlockVip: (profile: SanitizedProfile) => void;
  onMessage: (profile: SanitizedProfile) => void;
  onVideoCall: (profile: SanitizedProfile) => void;
  onToggleFavorite: (profileId: string) => void;
  isFavorite: boolean;
  onReport: (profile: SanitizedProfile) => void;
  onBlock: (profileId: string) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  currentUser,
  pricingConfig,
  unlockCost,
  messageCost,
  videoCallCost,
  onClose,
  onUnlockVip,
  onMessage,
  onVideoCall,
  onToggleFavorite,
  isFavorite,
  onReport,
  onBlock,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!profile) return null;

  const isVipLocked = profile.isRestrictedVip;
  const isGuest = currentUser.role === 'guest';

  // Available photos for display
  const displayPhotos = profile.gallery && profile.gallery.length > 0
    ? profile.gallery
    : [{ id: 'main', url: profile.avatar, caption: 'Profile photograph' }];

  const currentPhoto = displayPhotos[activePhotoIdx] || displayPhotos[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Visual Showcase */}
          <div className="relative bg-slate-950 flex flex-col justify-between overflow-hidden">
            {/* Main Stage Image */}
            <div className="relative aspect-3/4 md:aspect-auto md:h-full w-full bg-slate-900 overflow-hidden">
              <img
                src={currentPhoto.url}
                alt={profile.displayName}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-all ${
                  isVipLocked ? 'blur-md scale-105 brightness-90' : ''
                }`}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

              {/* Locked VIP Overlay message */}
              {isVipLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white z-10 bg-slate-950/40 backdrop-blur-xs">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 shadow-lg">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-white tracking-wide uppercase">
                    VIP Restricted Profile
                  </h4>
                  <p className="text-xs text-amber-200/90 mt-1 max-w-xs leading-relaxed">
                    High-definition gallery, unblurred photographs, and personal contact biography are protected.
                  </p>
                  <button
                    onClick={() => onUnlockVip(profile)}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/30 flex items-center gap-1.5 transition-all active:scale-98"
                  >
                    <Sparkles className="w-4 h-4 fill-slate-950/20" />
                    <span>Unlock for {unlockCost} Credits</span>
                  </button>
                </div>
              )}

              {/* Top VIP / Regular Badge */}
              <div className="absolute top-4 left-4 z-10">
                {profile.isVip ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/90 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md">
                    <Crown className="w-4 h-4 fill-slate-950" />
                    <span>VIP {profile.vipTier || 'Elite'}</span>
                  </div>
                ) : (
                  <div className="px-2.5 py-1 rounded-md bg-black/60 text-white text-xs font-medium backdrop-blur-md">
                    Verified Public Member
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery (if unlocked or regular) */}
            {!isVipLocked && displayPhotos.length > 1 && (
              <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
                {displayPhotos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activePhotoIdx === idx
                        ? 'border-rose-500 scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || ''}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Profile Information & Engagements */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Header Details */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                      {profile.displayName}, {profile.age}
                      {profile.verified && (
                        <CheckCircle2 className="w-5 h-5 text-sky-500 fill-sky-500/20 inline-block" />
                      )}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>
                          {profile.city}, {profile.country}
                        </span>
                      </div>
                      <span aria-hidden="true">·</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            profile.onlineStatus === 'online'
                              ? 'bg-emerald-500'
                              : profile.onlineStatus === 'recently_active'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span className="capitalize">
                          {profile.onlineStatus === 'online'
                            ? 'Online now'
                            : profile.lastActiveText || 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Favorite Toggle */}
                  <button
                    onClick={() => onToggleFavorite(profile.id)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isFavorite
                        ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900/50'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Key Attributes Strip */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
                  {profile.occupation && (
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{profile.occupation}</span>
                    </div>
                  )}
                  {profile.languages && profile.languages.length > 0 && (
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Globe2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{profile.languages.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Biography Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  About Me
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {profile.bio}
                </p>

                {/* Restricted Full Biography */}
                {isVipLocked ? (
                  <div className="mt-3 p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
                      <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Protected Extended Biography</span>
                    </div>
                    <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
                      Detailed lifestyle answers, dating intentions, personal preferences, and gallery photos are private to VIP unlock holders.
                    </p>
                    <button
                      onClick={() => onUnlockVip(profile)}
                      className="text-xs font-bold text-amber-900 dark:text-amber-200 hover:underline flex items-center gap-1"
                    >
                      Unlock full VIP dossier ({unlockCost} credits) →
                    </button>
                  </div>
                ) : (
                  profile.fullBio && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-1">
                        Extended Biography & Lifestyle
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {profile.fullBio}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* Interests & Passions (Clean unboxed metadata §1.A) */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Interests & Passions
                </h4>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {profile.interests.map((interest, idx) => (
                    <React.Fragment key={interest}>
                      {idx > 0 && <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>}
                      <span>{interest}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Privacy Notice Guarantee */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-700 dark:text-slate-300">Privacy Safeguard:</strong> Direct contact details (phone, email, exact residence) are protected and never disclosed publicly.
                </div>
              </div>
            </div>

            {/* Bottom Actions & Rates Disclosure */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {/* Engagement Pricing Strip */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>
                  Message Fee: <strong className="font-mono tabular-nums text-slate-800 dark:text-slate-200">{messageCost} cr</strong>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Video Call: <strong className="font-mono tabular-nums text-slate-800 dark:text-slate-200">{videoCallCost} cr/min</strong>
                </span>
              </div>

              {/* Primary Interaction Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onMessage(profile)}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-rose-600 dark:hover:bg-rose-500 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Message ({messageCost} cr)</span>
                </button>

                <button
                  onClick={() => onVideoCall(profile)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Video className="w-4 h-4 text-rose-500" />
                  <span>Video Call ({videoCallCost} cr/m)</span>
                </button>
              </div>

              {/* Moderation safety triggers */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <button
                  onClick={() => onReport(profile)}
                  className="flex items-center gap-1 hover:text-amber-600 transition-colors"
                >
                  <Flag className="w-3 h-3" />
                  <span>Report suspicious profile</span>
                </button>

                <button
                  onClick={() => onBlock(profile.id)}
                  className="flex items-center gap-1 hover:text-rose-600 transition-colors"
                >
                  <Ban className="w-3 h-3" />
                  <span>Block user</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
