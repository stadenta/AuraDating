import React, { useState } from 'react';
import {
  X,
  Shield,
  Eye,
  EyeOff,
  UserX,
  Lock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { UserSession, PrivacySettings } from '../types';
import { api } from '../services/backendApi';

interface PrivacySettingsModalProps {
  currentUser: UserSession;
  onClose: () => void;
  onRefreshUser: () => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  currentUser,
  onClose,
  onRefreshUser,
}) => {
  const [hidePublic, setHidePublic] = useState(currentUser.privacySettings.hideFromPublic);
  const [hideOnline, setHideOnline] = useState(currentUser.privacySettings.hideOnlineStatus);
  const [privatePhotos, setPrivatePhotos] = useState(currentUser.privacySettings.privatePhotosOnly);
  const [savedNote, setSavedNote] = useState(false);

  const blockedList = currentUser.blockedUserIds;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    api.updatePrivacySettings({
      hideFromPublic: hidePublic,
      hideOnlineStatus: hideOnline,
      privatePhotosOnly: privatePhotos,
    });
    onRefreshUser();
    setSavedNote(true);
    setTimeout(() => {
      setSavedNote(false);
      onClose();
    }, 1200);
  };

  const handleUnblock = (id: string) => {
    api.unblockUser(id);
    onRefreshUser();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Privacy & Discovery Controls
            </h3>
            <p className="text-xs text-slate-500">
              Manage how your profile appears in public guest browsing and search.
            </p>
          </div>
        </div>

        {savedNote && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Privacy preferences saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Setting 1: Hide from public browsing */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <EyeOff className="w-4 h-4 text-slate-500" />
                <span>Hide Profile From Public Discovery</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                When enabled, anonymous guests cannot find or see your profile. Only authenticated members you interact with can discover you.
              </p>
            </div>
            <input
              type="checkbox"
              checked={hidePublic}
              onChange={(e) => setHidePublic(e.target.checked)}
              className="mt-1 h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
            />
          </div>

          {/* Setting 2: Hide online status */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span>Hide Live Online Status</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Always show your activity status as Offline. Prevents others from seeing when you are active on the application.
              </p>
            </div>
            <input
              type="checkbox"
              checked={hideOnline}
              onChange={(e) => setHideOnline(e.target.checked)}
              className="mt-1 h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
            />
          </div>

          {/* Setting 3: Private photos only */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-slate-500" />
                <span>Restrict Photos to Unlocked Connections</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Require credit unlock or mutual match approval before revealing supplementary gallery photographs.
              </p>
            </div>
            <input
              type="checkbox"
              checked={privatePhotos}
              onChange={(e) => setPrivatePhotos(e.target.checked)}
              className="mt-1 h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
            />
          </div>

          {/* Blocked Users Section */}
          <div className="pt-2">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
              <UserX className="w-4 h-4 text-slate-400" />
              <span>Blocked Profiles ({blockedList.length})</span>
            </div>

            {blockedList.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">No blocked members.</p>
            ) : (
              <div className="space-y-1.5 max-h-24 overflow-y-auto">
                {blockedList.map((id) => (
                  <div
                    key={id}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <span className="font-mono text-[11px]">{id}</span>
                    <button
                      type="button"
                      onClick={() => handleUnblock(id)}
                      className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-rose-600 dark:hover:bg-rose-500 text-xs font-semibold shadow-sm transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
