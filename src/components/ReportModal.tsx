import React, { useState } from 'react';
import { X, Flag, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SanitizedProfile } from '../types';
import { api } from '../services/backendApi';

interface ReportModalProps {
  profile: SanitizedProfile | null;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ profile, onClose }) => {
  const [reason, setReason] = useState('Inappropriate photos or impersonation');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!profile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.reportUser(profile.id, `${reason}: ${details.trim() || 'No additional notes'}`);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close report modal"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Report Profile
            </h3>
            <p className="text-xs text-slate-500">
              Report {profile.displayName} to platform moderation.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Thank you. Your report has been dispatched to platform administrators.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Reason for report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="Inappropriate photos or impersonation">Inappropriate photos or impersonation</option>
                <option value="Solicitation or spam activity">Solicitation or spam activity</option>
                <option value="Fake or misleading identity details">Fake or misleading identity details</option>
                <option value="Harassment or rude conduct in chat">Harassment or rude conduct in chat</option>
                <option value="Other security concern">Other security concern</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Additional context (optional)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe any specifics..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
