import React, { useState, useEffect } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Coins,
  Crown,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { SanitizedProfile, UserSession } from '../types';
import { api } from '../services/backendApi';

interface VideoCallModalProps {
  profile: SanitizedProfile | null;
  currentUser: UserSession;
  ratePerMinute: number;
  onClose: () => void;
  onRefreshUser: () => void;
  onOpenWallet: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  profile,
  currentUser,
  ratePerMinute,
  onClose,
  onRefreshUser,
  onOpenWallet,
}) => {
  const [callActive, setCallActive] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isBilled, setIsBilled] = useState(false);
  const [billReceipt, setBillReceipt] = useState<{ totalMinutes: number; totalCost: number } | null>(null);

  // Timer loop when active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => {
          const next = prev + 1;
          // Check if user credit limit is reached in real-time
          const currentMinutes = Math.ceil(next / 60);
          if (currentMinutes * ratePerMinute > currentUser.credits) {
            handleEndCall(next);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callActive, currentUser.credits, ratePerMinute]);

  if (!profile) return null;

  const currentMinutes = Math.max(1, Math.ceil(secondsElapsed / 60));
  const runningCost = callActive ? currentMinutes * ratePerMinute : 0;
  const isVip = profile.isVip;

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    if (currentUser.credits < ratePerMinute) {
      onOpenWallet();
      return;
    }
    setCallActive(true);
    setSecondsElapsed(0);
    setIsBilled(false);
  };

  const handleEndCall = (finalSeconds?: number) => {
    const sec = finalSeconds !== undefined ? finalSeconds : secondsElapsed;
    setCallActive(false);
    if (!isBilled && sec > 0) {
      const minutes = Math.max(1, Math.ceil(sec / 60));
      const res = api.billVideoCall(profile.id, minutes);
      setBillReceipt({ totalMinutes: minutes, totalCost: res.totalCost });
      setIsBilled(true);
      onRefreshUser();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col aspect-4/3 max-h-[90vh]">
        {/* Top Info Bar */}
        <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-white">
              {profile.displayName}
            </span>
            {isVip && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-400/30">
                <Crown className="w-3 h-3 fill-amber-400" />
                VIP
              </span>
            )}
          </div>

          {callActive && (
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-white font-mono text-xs">
              <span className="tabular-nums font-bold text-rose-400">{formatTimer(secondsElapsed)}</span>
              <span className="text-white/40">·</span>
              <span className="text-amber-300 font-semibold tabular-nums">{runningCost} cr</span>
            </div>
          )}

          <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-amber-400 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5" />
            <span>Balance: {currentUser.credits} cr</span>
          </div>
        </div>

        {/* Video Stage Frame */}
        <div className="relative flex-1 w-full bg-slate-950 overflow-hidden flex items-center justify-center">
          {callActive ? (
            <>
              {/* Remote Partner Video (Simulated Feed) */}
              <img
                src={profile.avatar}
                alt={profile.displayName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter contrast-105"
              />

              {/* Subtle film grain / ambient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

              {/* Local User Self View PiP */}
              <div className="absolute bottom-20 right-4 w-32 h-24 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl bg-slate-800">
                {isVideoOn ? (
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center text-white/50 text-[11px]">
                    Self View (Live)
                  </div>
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white/30 text-[11px]">
                    Camera Off
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Pre-call / Call ended state */
            <div className="p-8 text-center text-white max-w-md space-y-4">
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-amber-400/50 shadow-xl">
                <img
                  src={profile.avatar}
                  alt={profile.displayName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-tight text-white">
                  Direct Video Call with {profile.displayName}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Private HD 1-on-1 audio & video streaming
                </p>
              </div>

              {/* Bill Receipt if call just concluded */}
              {billReceipt && (
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-left space-y-1 text-xs">
                  <div className="text-emerald-400 font-semibold">Call Ended Successfully</div>
                  <div className="flex justify-between text-slate-300">
                    <span>Duration:</span>
                    <span className="font-mono tabular-nums">{billReceipt.totalMinutes} minute(s)</span>
                  </div>
                  <div className="flex justify-between text-slate-300 font-bold border-t border-slate-700/60 pt-1 mt-1">
                    <span>Total Billed:</span>
                    <span className="font-mono tabular-nums text-amber-400">{billReceipt.totalCost} Credits</span>
                  </div>
                </div>
              )}

              {/* Rate announcement */}
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 text-left space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-amber-300">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Call Rate: {ratePerMinute} Credits / Minute</span>
                </div>
                <p className="text-[11px] text-amber-200/80">
                  {isVip
                    ? 'Premium VIP engagement rate applies. Metered per minute.'
                    : 'Standard member engagement rate. Metered per minute.'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartCall}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all active:scale-98"
                >
                  <Video className="w-4 h-4" />
                  <span>Start Live Call</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Call Controls (When Active) */}
        {callActive && (
          <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-center gap-4">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3.5 rounded-full backdrop-blur-md border transition-colors ${
                isMicOn
                  ? 'bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700'
                  : 'bg-rose-600/90 border-rose-500 text-white'
              }`}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => handleEndCall()}
              className="px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/40 transition-transform active:scale-95"
            >
              <PhoneOff className="w-5 h-5" />
              <span>End Call</span>
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3.5 rounded-full backdrop-blur-md border transition-colors ${
                isVideoOn
                  ? 'bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700'
                  : 'bg-rose-600/90 border-rose-500 text-white'
              }`}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
