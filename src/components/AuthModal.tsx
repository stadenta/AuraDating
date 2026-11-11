import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Gift,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Lock,
} from 'lucide-react';
import { api } from '../services/backendApi';

interface AuthModalProps {
  initialIntent?: string; // e.g. "message:reg-chloe" or "unlock:vip-elena"
  onClose: () => void;
  onSuccess: (intent?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialIntent,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    api.registerUser(name || 'New Member', email);
    onSuccess(initialIntent);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    api.loginUser(email);
    onSuccess(initialIntent);
  };

  const handleQuickDemo = (persona: 'regular' | 'vip' | 'admin') => {
    if (persona === 'regular') api.switchUser('user-regular');
    if (persona === 'vip') api.switchUser('user-vip-client');
    if (persona === 'admin') api.switchUser('user-admin');
    onSuccess(initialIntent);
  };

  const intentActionLabel = initialIntent?.startsWith('unlock')
    ? 'unlock this VIP profile'
    : initialIntent?.startsWith('message')
    ? 'message this member'
    : initialIntent?.startsWith('call')
    ? 'start a video call'
    : initialIntent?.startsWith('like')
    ? 'save this match to your favorites'
    : 'continue your discovery engagement';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close authentication modal"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Branding & Welcome */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <Sparkles className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {mode === 'register' ? 'Join Aura Discovery' : 'Welcome Back to Aura'}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            {initialIntent ? (
              <>
                Please register or sign in to <strong className="text-rose-600 dark:text-rose-400">{intentActionLabel}</strong>.
              </>
            ) : (
              'Public discovery is always free to browse. Register when you are ready to engage.'
            )}
          </p>
        </div>

        {/* 50 Free Credits Welcome Callout Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 dark:from-rose-950/30 dark:via-pink-950/20 dark:to-amber-950/30 border border-rose-200/80 dark:border-rose-900/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-slate-900 dark:text-white">
              Instant 50 Free Credits Bonus
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Automatically credited upon registration to test VIP unlocks and messaging.
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={mode === 'register' ? handleRegister : handleLogin} className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Your Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Julian Vance"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. julian@example.com"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>{mode === 'register' ? 'Register & Get 50 Credits' : 'Sign In & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Persona Evaluator Shortcuts */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 text-center uppercase tracking-wider">
            Quick Evaluator Accounts
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemo('regular')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-center transition-colors"
            >
              <div className="font-semibold text-[11px]">Regular</div>
              <div className="text-[10px] text-slate-400">50 Credits</div>
            </button>
            <button
              onClick={() => handleQuickDemo('vip')}
              className="p-2 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-center transition-colors"
            >
              <div className="font-semibold text-[11px]">VIP Patron</div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400">180 Credits</div>
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="p-2 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 text-center transition-colors"
            >
              <div className="font-semibold text-[11px]">Admin</div>
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400">Full Suite</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
