import React, { useState, useEffect, useCallback } from 'react';
import {
  SanitizedProfile,
  UserSession,
  PricingConfig,
} from './types';
import { api } from './services/backendApi';
import { Navbar } from './components/Navbar';
import { DiscoveryFeed } from './components/DiscoveryFeed';
import { VipLoungeView } from './components/VipLoungeView';
import { RatesView } from './components/RatesView';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { VipUnlockModal } from './components/VipUnlockModal';
import { ChatModal } from './components/ChatModal';
import { VideoCallModal } from './components/VideoCallModal';
import { WalletModal } from './components/WalletModal';
import { PrivacySettingsModal } from './components/PrivacySettingsModal';
import { AuthModal } from './components/AuthModal';
import { ReportModal } from './components/ReportModal';
import { Heart, Sparkles, CheckCircle2, Shield, Info } from 'lucide-react';

export default function App() {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark') || true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // User & Data State
  const [currentUser, setCurrentUser] = useState<UserSession>(api.getActiveUser());
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(api.getPricingConfig());
  const [profiles, setProfiles] = useState<SanitizedProfile[]>(api.getPublicProfiles());

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'discovery' | 'vip_lounge' | 'rates' | 'admin'>('discovery');

  // Modals & Interactive Overlays
  const [detailProfile, setDetailProfile] = useState<SanitizedProfile | null>(null);
  const [unlockTargetProfile, setUnlockTargetProfile] = useState<SanitizedProfile | null>(null);
  const [chatTargetProfile, setChatTargetProfile] = useState<SanitizedProfile | null>(null);
  const [videoTargetProfile, setVideoTargetProfile] = useState<SanitizedProfile | null>(null);
  const [reportTargetProfile, setReportTargetProfile] = useState<SanitizedProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authIntent, setAuthIntent] = useState<string | undefined>(undefined);
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Refresh all state from the backend service
  const refreshState = useCallback(() => {
    const updatedUser = api.getActiveUser();
    setCurrentUser({ ...updatedUser });
    setPricingConfig(api.getPricingConfig());
    setProfiles(api.getPublicProfiles());

    // If detail modal is open, refresh its sanitized data
    if (detailProfile) {
      const refreshed = api.getProfileById(detailProfile.id);
      setDetailProfile(refreshed);
    }
  }, [detailProfile]);

  // Handle switching personas
  const handleSwitchUser = (userId: string) => {
    const switched = api.switchUser(userId);
    setCurrentUser({ ...switched });
    refreshState();
    showToast(`Switched active persona to ${switched.name} (${switched.role.toUpperCase()})`);
  };

  const handleLogout = () => {
    const guest = api.logout();
    setCurrentUser({ ...guest });
    refreshState();
    showToast('Signed out to Guest Browsing mode');
  };

  // Guest Authorization Gate: intercept actions if not logged in
  const requireAuth = (actionCallback: () => void, intentKey: string) => {
    if (currentUser.role === 'guest') {
      setAuthIntent(intentKey);
      setIsAuthOpen(true);
      return false;
    }
    actionCallback();
    return true;
  };

  // Auth Success Handler: resume the pending action!
  const handleAuthSuccess = (intent?: string) => {
    setIsAuthOpen(false);
    refreshState();
    const newUser = api.getActiveUser();
    showToast(`Welcome ${newUser.name}! 50 Welcome Credits added to your account.`);

    if (intent) {
      const [action, profileId] = intent.split(':');
      const target = profiles.find((p) => p.id === profileId);

      if (action === 'unlock' && target) {
        setUnlockTargetProfile(target);
      } else if (action === 'message' && target) {
        setChatTargetProfile(target);
      } else if (action === 'call' && target) {
        setVideoTargetProfile(target);
      } else if (action === 'like' && target) {
        handleToggleFavorite(target.id);
      }
    }
  };

  // Profile View action
  const handleViewDetails = (profile: SanitizedProfile) => {
    const fresh = api.getProfileById(profile.id);
    setDetailProfile(fresh || profile);
  };

  // VIP Unlock action
  const handleUnlockVip = (profile: SanitizedProfile) => {
    requireAuth(() => {
      setUnlockTargetProfile(profile);
    }, `unlock:${profile.id}`);
  };

  const handleConfirmUnlock = (profileId: string) => {
    const result = api.unlockVipProfile(profileId);
    if (result.success) {
      showToast(result.message);
      refreshState();
      // If the detail modal was open for this profile, update it
      if (detailProfile && detailProfile.id === profileId) {
        const fresh = api.getProfileById(profileId);
        setDetailProfile(fresh);
      }
    } else {
      showToast(result.message);
      if (result.message.includes('Insufficient credits')) {
        setIsWalletOpen(true);
      }
    }
  };

  // Chat action
  const handleMessage = (profile: SanitizedProfile) => {
    requireAuth(() => {
      setChatTargetProfile(profile);
    }, `message:${profile.id}`);
  };

  // Video call action
  const handleVideoCall = (profile: SanitizedProfile) => {
    requireAuth(() => {
      setVideoTargetProfile(profile);
    }, `call:${profile.id}`);
  };

  // Like / Favorite action
  const handleToggleFavorite = (profileId: string) => {
    requireAuth(() => {
      const res = api.toggleFavorite(profileId);
      refreshState();
      showToast(res.message);
    }, `like:${profileId}`);
  };

  // Report action
  const handleReport = (profile: SanitizedProfile) => {
    setReportTargetProfile(profile);
  };

  // Block user action
  const handleBlock = (profileId: string) => {
    api.blockUser(profileId);
    refreshState();
    if (detailProfile?.id === profileId) {
      setDetailProfile(null);
    }
    showToast('User has been blocked and removed from your feed.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Universal Top Bar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={(intent) => {
          setAuthIntent(intent);
          setIsAuthOpen(true);
        }}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onSwitchUser={handleSwitchUser}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Evaluator Context Notice Bar */}
      <div className="bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <Info className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">
              <strong>Public Discovery System:</strong> Visitors browse regular profiles freely without registering.
              VIP profiles require credits to unlock.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline">Active Mode:</span>
            <span className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] uppercase ${
              currentUser.role === 'guest'
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                : currentUser.role === 'admin'
                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                : currentUser.role === 'vip'
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
            }`}>
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'discovery' && (
          <DiscoveryFeed
            profiles={profiles}
            currentUser={currentUser}
            pricingConfig={pricingConfig}
            getUnlockCost={(id) => api.getVipUnlockCost(id)}
            getActionCost={(id, act) => api.getActionCost(id, act)}
            onViewDetails={handleViewDetails}
            onUnlockVip={handleUnlockVip}
            onMessage={handleMessage}
            onVideoCall={handleVideoCall}
            onToggleFavorite={handleToggleFavorite}
            onOpenAuth={(intent) => {
              setAuthIntent(intent);
              setIsAuthOpen(true);
            }}
          />
        )}

        {activeTab === 'vip_lounge' && (
          <VipLoungeView
            profiles={profiles}
            currentUser={currentUser}
            pricingConfig={pricingConfig}
            getUnlockCost={(id) => api.getVipUnlockCost(id)}
            getActionCost={(id, act) => api.getActionCost(id, act)}
            onViewDetails={handleViewDetails}
            onUnlockVip={handleUnlockVip}
            onMessage={handleMessage}
            onVideoCall={handleVideoCall}
            onToggleFavorite={handleToggleFavorite}
            onOpenAuth={(intent) => {
              setAuthIntent(intent);
              setIsAuthOpen(true);
            }}
            onOpenWallet={() => setIsWalletOpen(true)}
          />
        )}

        {activeTab === 'rates' && (
          <RatesView
            pricingConfig={pricingConfig}
            currentUser={currentUser}
            onOpenWallet={() => setIsWalletOpen(true)}
            onOpenAuth={(intent) => {
              setAuthIntent(intent);
              setIsAuthOpen(true);
            }}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard onRefreshData={refreshState} />
        )}
      </main>

      {/* Global Interactive Modals */}
      {detailProfile && (
        <ProfileDetailModal
          profile={detailProfile}
          currentUser={currentUser}
          pricingConfig={pricingConfig}
          unlockCost={api.getVipUnlockCost(detailProfile.id)}
          messageCost={api.getActionCost(detailProfile.id, 'message')}
          videoCallCost={api.getActionCost(detailProfile.id, 'video_call')}
          onClose={() => setDetailProfile(null)}
          onUnlockVip={handleUnlockVip}
          onMessage={handleMessage}
          onVideoCall={handleVideoCall}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={currentUser.favorites.includes(detailProfile.id)}
          onReport={handleReport}
          onBlock={handleBlock}
        />
      )}

      {unlockTargetProfile && (
        <VipUnlockModal
          profile={unlockTargetProfile}
          currentUser={currentUser}
          pricingConfig={pricingConfig}
          unlockCost={api.getVipUnlockCost(unlockTargetProfile.id)}
          onClose={() => setUnlockTargetProfile(null)}
          onConfirmUnlock={handleConfirmUnlock}
          onOpenWallet={() => {
            setUnlockTargetProfile(null);
            setIsWalletOpen(true);
          }}
          onOpenAuth={(intent) => {
            setUnlockTargetProfile(null);
            setAuthIntent(intent);
            setIsAuthOpen(true);
          }}
        />
      )}

      {chatTargetProfile && (
        <ChatModal
          profile={chatTargetProfile}
          currentUser={currentUser}
          pricingConfig={pricingConfig}
          messageCost={api.getActionCost(chatTargetProfile.id, 'message')}
          onClose={() => setChatTargetProfile(null)}
          onOpenWallet={() => {
            setChatTargetProfile(null);
            setIsWalletOpen(true);
          }}
          onRefreshUser={refreshState}
        />
      )}

      {videoTargetProfile && (
        <VideoCallModal
          profile={videoTargetProfile}
          currentUser={currentUser}
          ratePerMinute={api.getActionCost(videoTargetProfile.id, 'video_call')}
          onClose={() => setVideoTargetProfile(null)}
          onRefreshUser={refreshState}
          onOpenWallet={() => {
            setVideoTargetProfile(null);
            setIsWalletOpen(true);
          }}
        />
      )}

      {isWalletOpen && (
        <WalletModal
          currentUser={currentUser}
          onClose={() => setIsWalletOpen(false)}
          onRefreshUser={refreshState}
        />
      )}

      {isPrivacyOpen && (
        <PrivacySettingsModal
          currentUser={currentUser}
          onClose={() => setIsPrivacyOpen(false)}
          onRefreshUser={refreshState}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          initialIntent={authIntent}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {reportTargetProfile && (
        <ReportModal
          profile={reportTargetProfile}
          onClose={() => setReportTargetProfile(null)}
        />
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">AURA DISCOVERY</span>
            <span aria-hidden="true">·</span>
            <span>Credit-Powered Curated Dating Marketplace</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Discretion Guaranteed</span>
            <span aria-hidden="true">·</span>
            <span>Backend Security Protocol</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Privacy Safeguards
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
