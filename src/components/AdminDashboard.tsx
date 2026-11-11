import React, { useState, useMemo } from 'react';
import {
  Shield,
  Crown,
  DollarSign,
  TrendingUp,
  Settings2,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  FileText,
  Lock,
  Unlock,
  MessageCircle,
  Video,
  Eye,
  Sliders,
  Save,
  RotateCcw,
  Sparkles,
  Award,
  Filter,
  AlertTriangle,
} from 'lucide-react';
import {
  PricingConfig,
  Profile,
  VipTier,
  UnlockDuration,
  ReportTicket,
  VipApplication,
  Transaction,
} from '../types';
import { api } from '../services/backendApi';

interface AdminDashboardProps {
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onRefreshData }) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'rates' | 'users' | 'revenue' | 'ledger' | 'applications' | 'reports'
  >('rates');

  // Rates State (Live Config)
  const currentConfig = api.getPricingConfig();
  const [pricing, setPricing] = useState<PricingConfig>(currentConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Raw Profiles State
  const [profiles, setProfiles] = useState<Profile[]>(api.getRawProfiles());
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'vip' | 'regular'>('all');

  // Applications & Reports State
  const [applications, setApplications] = useState<VipApplication[]>(api.getAdminApplications());
  const [reports, setReports] = useState<ReportTicket[]>(api.getAdminReports());

  // Revenue Report Data
  const revenueReport = api.getVipRevenueReport();
  const transactions = api.getTransactions();

  // Handle Rate Changes
  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = api.updatePricingConfig(pricing);
    setPricing(updated);
    setSavedSuccess(true);
    onRefreshData();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetRatesDefault = () => {
    const defaults: PricingConfig = {
      regularProfileView: 0,
      vipProfileView: 10,
      vipProfileDuration: 'permanent',
      vipTierCharges: {
        Silver: 8,
        Gold: 10,
        Diamond: 15,
        Elite: 25,
      },
      regularTextMessage: 2,
      vipTextMessage: 5,
      regularVideoCallPerMinute: 5,
      vipVideoCallPerMinute: 10,
      regularGiftFee: 5,
      vipGiftFee: 15,
    };
    const updated = api.updatePricingConfig(defaults);
    setPricing(updated);
    onRefreshData();
  };

  // Handle VIP User Promotion / Demotion
  const handleToggleVip = (profileId: string, makeVip: boolean, tier: VipTier = 'Gold') => {
    api.adminSetUserVipStatus(profileId, makeVip, tier);
    setProfiles(api.getRawProfiles());
    onRefreshData();
  };

  // Handle Application Review
  const handleReviewApp = (appId: string, approve: boolean) => {
    api.reviewVipApplication(appId, approve);
    setApplications(api.getAdminApplications());
    setProfiles(api.getRawProfiles());
    onRefreshData();
  };

  // Filtered Profiles for User Management
  const filteredUsers = useMemo(() => {
    return profiles.filter((p) => {
      if (userRoleFilter === 'vip' && !p.isVip) return false;
      if (userRoleFilter === 'regular' && p.isVip) return false;
      if (userSearchQuery.trim()) {
        const q = userSearchQuery.toLowerCase();
        return (
          p.displayName.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          p.occupation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [profiles, userRoleFilter, userSearchQuery]);

  // CSV Export for Revenue Data
  const exportToCsv = () => {
    const rows = [
      ['Date/Period', 'Unlocks Revenue (Cr)', 'Messaging Revenue (Cr)', 'Video Call Revenue (Cr)', 'Total Revenue (Cr)'],
      ...revenueReport.dailyRevenue.map((d) => [
        d.date,
        d.unlocks,
        d.messages,
        d.videoCalls,
        d.total,
      ]),
      [],
      ['Summary Metric', 'Value'],
      ['Total VIP Revenue (Credits)', revenueReport.totalVipCreditRevenue],
      ['VIP Profile Unlocks Revenue', revenueReport.unlockRevenue],
      ['VIP Text Messaging Revenue', revenueReport.messagingRevenue],
      ['VIP Video Call Revenue', revenueReport.videoCallRevenue],
      ['Total VIP Profiles Registered', revenueReport.vipProfileCount],
      ['Total Completed VIP Unlocks', revenueReport.totalUnlocksCount],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aura_vip_revenue_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Printable PDF Export Trigger
  const exportToPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Admin Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Shield className="w-4 h-4" />
            <span>Master Administration Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            VIP Governance & Dynamic Rate Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Configure tiered viewing charges, promote verified members to VIP status, monitor real-time
            transaction ledgers, and analyze multi-channel VIP credit revenue.
          </p>
        </div>

        {/* Global KPI quick pill cards */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-center min-w-[110px]">
            <div className="text-[11px] text-slate-400 font-medium">VIP Members</div>
            <div className="text-xl font-bold font-mono tabular-nums text-amber-400 mt-0.5">
              {revenueReport.vipProfileCount}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-center min-w-[120px]">
            <div className="text-[11px] text-slate-400 font-medium">VIP Revenue</div>
            <div className="text-xl font-bold font-mono tabular-nums text-emerald-400 mt-0.5">
              {revenueReport.totalVipCreditRevenue} cr
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Navigation Bar (clean interactive tabs) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveSubTab('rates')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeSubTab === 'rates'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Rate Configuration</span>
        </button>

        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeSubTab === 'users'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>VIP User Management</span>
        </button>

        <button
          onClick={() => setActiveSubTab('revenue')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeSubTab === 'revenue'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <span>VIP Revenue Reports</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeSubTab === 'ledger'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Unlock Ledger</span>
        </button>

        <button
          onClick={() => setActiveSubTab('applications')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeSubTab === 'applications'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>VIP Applications ({applications.filter((a) => a.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reports')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeSubTab === 'reports'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span>Reports & Flags ({reports.filter((r) => r.status === 'pending').length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. DYNAMIC RATE CONFIGURATION ENGINE (Section C, D, 17) */}
      {/* ========================================================================= */}
      {activeSubTab === 'rates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Tiered Interaction Pricing Engine
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust credit consumption rates for viewing, messaging, and video calling. Changes take effect instantly across all client viewports.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetRatesDefault}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>All platform pricing rates updated and synchronized successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveRates} className="space-y-6">
            {/* Group A: VIP Profile Viewing & Access Expiry */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>VIP Profile Viewing Charges & Unlock Validity</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Regular Profile Viewing Fee
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={pricing.regularProfileView}
                      onChange={(e) =>
                        setPricing({ ...pricing, regularProfileView: Number(e.target.value) })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
                      Credits (Default 0 = Free)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Default VIP Profile Viewing Fee
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={pricing.vipProfileView}
                      onChange={(e) =>
                        setPricing({ ...pricing, vipProfileView: Number(e.target.value) })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
                      Credits (e.g. 10)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Unlocked Profile Access Duration
                  </label>
                  <select
                    value={pricing.vipProfileDuration}
                    onChange={(e) =>
                      setPricing({
                        ...pricing,
                        vipProfileDuration: e.target.value as UnlockDuration,
                      })
                    }
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="permanent">Permanent Lifetime Access</option>
                    <option value="24h">24 Hours from Unlock</option>
                    <option value="7d">7 Days from Unlock</option>
                    <option value="30d">30 Days from Unlock</option>
                  </select>
                </div>
              </div>

              {/* Tier Specific Viewing Charges */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Category-Specific VIP Viewing Charges:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {(['Silver', 'Gold', 'Diamond', 'Elite'] as VipTier[]).map((tier) => (
                    <div key={tier} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                        {tier} Tier
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          value={pricing.vipTierCharges[tier] || 10}
                          onChange={(e) =>
                            setPricing({
                              ...pricing,
                              vipTierCharges: {
                                ...pricing.vipTierCharges,
                                [tier]: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-xs"
                        />
                        <span className="text-[11px] text-slate-400 shrink-0">cr</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Group B: Messaging & Video Call Engagement Rates */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Sliders className="w-4 h-4 text-rose-500" />
                <span>Tiered Engagement Charges: Regular vs VIP Users</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-3">Engagement Activity</th>
                      <th className="py-2.5 px-3">Regular User Rate</th>
                      <th className="py-2.5 px-3">VIP User Rate (Tiered Higher)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>View Complete Profile</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium">
                          Free (0 Credits)
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {pricing.vipProfileView} Credits
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>Send Text Message</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 w-32">
                          <input
                            type="number"
                            min="0"
                            value={pricing.regularTextMessage}
                            onChange={(e) =>
                              setPricing({
                                ...pricing,
                                regularTextMessage: Number(e.target.value),
                              })
                            }
                            className="w-full py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                          />
                          <span className="text-[11px] text-slate-400">cr</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 w-32">
                          <input
                            type="number"
                            min="1"
                            value={pricing.vipTextMessage}
                            onChange={(e) =>
                              setPricing({
                                ...pricing,
                                vipTextMessage: Number(e.target.value),
                              })
                            }
                            className="w-full py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-amber-600 dark:text-amber-400 font-bold"
                          />
                          <span className="text-[11px] text-slate-400">cr</span>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Video className="w-3.5 h-3.5 text-slate-400" />
                        <span>Video Call (Per Minute)</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 w-32">
                          <input
                            type="number"
                            min="1"
                            value={pricing.regularVideoCallPerMinute}
                            onChange={(e) =>
                              setPricing({
                                ...pricing,
                                regularVideoCallPerMinute: Number(e.target.value),
                              })
                            }
                            className="w-full py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                          />
                          <span className="text-[11px] text-slate-400">cr/m</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 w-32">
                          <input
                            type="number"
                            min="1"
                            value={pricing.vipVideoCallPerMinute}
                            onChange={(e) =>
                              setPricing({
                                ...pricing,
                                vipVideoCallPerMinute: Number(e.target.value),
                              })
                            }
                            className="w-full py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-amber-600 dark:text-amber-400 font-bold"
                          />
                          <span className="text-[11px] text-slate-400">cr/m</span>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                        <span>Virtual VIP Gifts & Super-Likes</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 w-32">
                          <input
                            type="number"
                            min="1"
                            value={pricing.regularGiftFee}
                            onChange={(e) =>
                              setPricing({
                                ...pricing,
                                regularGiftFee: Number(e.target.value),
                              })
                            }
                            className="w-full py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                          />
                          <span className="text-[11px] text-slate-400">cr</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 w-32">
                          <input
                            type="number"
                            min="1"
                            value={pricing.vipGiftFee}
                            onChange={(e) =>
                              setPricing({
                                ...pricing,
                                vipGiftFee: Number(e.target.value),
                              })
                            }
                            className="w-full py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-amber-600 dark:text-amber-400 font-bold"
                          />
                          <span className="text-[11px] text-slate-400">cr</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 font-semibold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Save & Enforce New Rates</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. VIP USER MANAGEMENT & CLASSIFICATION (Section B, E) */}
      {/* ========================================================================= */}
      {activeSubTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Member Classification & VIP Promotion
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Classify members as Regular or VIP. Assign distinctive VIP badge tiers and manage unlock permissions.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex items-center gap-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-48 text-xs focus:outline-none"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value as any)}
                className="py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
              >
                <option value="all">All Members ({profiles.length})</option>
                <option value="vip">VIP Members Only ({profiles.filter((p) => p.isVip).length})</option>
                <option value="regular">Regular Members ({profiles.filter((p) => !p.isVip).length})</option>
              </select>
            </div>
          </div>

          {/* Members Table */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4">VIP Tier</th>
                    <th className="py-3 px-4 text-right">Profile Views</th>
                    <th className="py-3 px-4 text-right">VIP Unlocks</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.avatar}
                            alt={p.displayName}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{p.displayName}</span>
                              <span className="text-slate-400 font-normal">({p.age})</span>
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                              {p.occupation}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {p.city}, {p.country}
                      </td>

                      <td className="py-3 px-4">
                        {p.isVip ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700">
                            <Crown className="w-3 h-3 fill-amber-500" />
                            <span>VIP</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            Regular
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {p.isVip ? (
                          <select
                            value={p.vipTier || 'Gold'}
                            onChange={(e) =>
                              handleToggleVip(p.id, true, e.target.value as VipTier)
                            }
                            className="py-1 px-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20 text-xs font-semibold text-amber-900 dark:text-amber-200"
                          >
                            <option value="Silver">Silver Tier</option>
                            <option value="Gold">Gold Tier</option>
                            <option value="Diamond">Diamond Tier</option>
                            <option value="Elite">Elite Tier</option>
                          </select>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {p.metrics.viewsCount}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-amber-600 dark:text-amber-400">
                        {p.metrics.unlocksCount}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {p.isVip ? (
                          <button
                            onClick={() => handleToggleVip(p.id, false)}
                            className="px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[11px] font-semibold transition-colors"
                          >
                            Demote to Regular
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleVip(p.id, true, 'Gold')}
                            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 text-[11px] font-bold shadow-xs transition-colors"
                          >
                            Promote to VIP
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VIP REVENUE REPORTING & EXPORTS (Section H) */}
      {/* ========================================================================= */}
      {activeSubTab === 'revenue' && (
        <div className="space-y-6">
          {/* Header & Export CTAs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                VIP Revenue Analytics & Consumption Ledger
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Financial reporting on VIP viewing unlocks, premium messaging, and video consultations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportToCsv}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export to Excel (CSV)</span>
              </button>

              <button
                onClick={exportToPdf}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-slate-700 hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export PDF Report</span>
              </button>
            </div>
          </div>

          {/* 4 Core Financial KPI Metric Cards (§1.C Single-elevation) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Total VIP Credit Revenue</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                {revenueReport.totalVipCreditRevenue} <span className="text-xs font-sans font-normal text-slate-400">Credits</span>
              </div>
              <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Across all VIP interaction channels</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-400 font-medium">VIP Profile Unlocks Revenue</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400 mt-1">
                {revenueReport.unlockRevenue} <span className="text-xs font-sans font-normal text-slate-400">Credits</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                From {revenueReport.totalUnlocksCount} verified unlocks
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-400 font-medium">VIP Text Messaging Revenue</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 mt-1">
                {revenueReport.messagingRevenue} <span className="text-xs font-sans font-normal text-slate-400">Credits</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                Rate: {pricing.vipTextMessage} cr per message
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-400 font-medium">VIP Video Call Revenue</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400 mt-1">
                {revenueReport.videoCallRevenue} <span className="text-xs font-sans font-normal text-slate-400">Credits</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                Rate: {pricing.vipVideoCallPerMinute} cr per min
              </div>
            </div>
          </div>

          {/* Daily, Weekly, and Monthly Breakdown Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Revenue Table */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Daily VIP Revenue Trajectory
                </h3>
                <span className="text-xs text-slate-400 font-mono">Last 7 Days</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2">Day</th>
                      <th className="py-2 text-right">Unlocks</th>
                      <th className="py-2 text-right">Chat</th>
                      <th className="py-2 text-right">Video</th>
                      <th className="py-2 text-right font-bold">Total (Cr)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {revenueReport.dailyRevenue.map((d) => (
                      <tr key={d.date}>
                        <td className="py-2 font-medium text-slate-800 dark:text-slate-200">{d.date}</td>
                        <td className="py-2 text-right font-mono tabular-nums text-amber-600">{d.unlocks}</td>
                        <td className="py-2 text-right font-mono tabular-nums text-rose-500">{d.messages}</td>
                        <td className="py-2 text-right font-mono tabular-nums text-indigo-500">{d.videoCalls}</td>
                        <td className="py-2 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                          {d.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Weekly & Monthly Growth */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly & Weekly Revenue Aggregations
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-2">Monthly Totals</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {revenueReport.monthlyRevenue.map((m) => (
                      <div
                        key={m.month}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                      >
                        <span className="font-medium text-slate-700 dark:text-slate-300">{m.month}</span>
                        <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                          {m.total} cr
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-2">Weekly Performance</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {revenueReport.weeklyRevenue.map((w) => (
                      <div
                        key={w.week}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                      >
                        <span className="font-medium text-slate-700 dark:text-slate-300">{w.week}</span>
                        <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                          {w.total} cr
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Viewed & Most Engaged VIP Profiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-500" />
                <span>Most Viewed VIP Profiles</span>
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {revenueReport.mostViewedVipProfiles.map((item, idx) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 font-semibold">{idx + 1}.</span>
                      <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>
                      <span className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                        {item.tier || 'VIP'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono tabular-nums">
                      <span className="text-slate-600 dark:text-slate-300">{item.views} views</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {item.unlocks} unlocks
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Highest Grossing VIP Profiles</span>
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {revenueReport.mostEngagedVipProfiles.map((item, idx) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 font-semibold">{idx + 1}.</span>
                      <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono tabular-nums">
                      <span className="text-slate-500">{item.engagements} actions</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {item.revenueCredits} cr generated
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. REAL-TIME UNLOCK & ENGAGEMENT LEDGER */}
      {/* ========================================================================= */}
      {activeSubTab === 'ledger' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Live Interaction & Unlock Transaction Ledger
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audited stream of credit deductions, VIP profile unlocks, and member wallet top-ups.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-400 uppercase text-[11px]">
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Event Type</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-right">Credit Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{tx.id}</td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(tx.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                        {tx.userName}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          tx.type === 'vip_unlock'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                            : tx.type === 'video_call'
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                            : tx.type === 'text_message'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        }`}>
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {tx.description}
                      </td>
                      <td className={`py-3 px-4 text-right font-mono tabular-nums font-bold ${
                        tx.credits > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {tx.credits > 0 ? `+${tx.credits}` : tx.credits} cr
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. VIP MEMBERSHIP APPLICATIONS QUEUE */}
      {/* ========================================================================= */}
      {activeSubTab === 'applications' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              VIP Membership Application Reviews
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and approve member applications seeking verified VIP classification.
            </p>
          </div>

          <div className="space-y-3">
            {applications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                No VIP applications in queue.
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {app.userName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                        Requested: {app.requestedTier}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      &quot;{app.reason}&quot;
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {app.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleReviewApp(app.id, false)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleReviewApp(app.id, true)}
                          className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs"
                        >
                          Approve VIP
                        </button>
                      </>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${
                        app.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                      }`}>
                        {app.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODERATION REPORTS & SECURITY FLAGS */}
      {/* ========================================================================= */}
      {activeSubTab === 'reports' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Trust & Safety Reports
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Suspicious activity tickets submitted by members during discovery.
            </p>
          </div>

          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                Zero security reports or suspicious flags filed.
              </div>
            ) : (
              reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Target: {rep.targetProfileName}
                      </span>
                      <span className="text-xs text-slate-400">
                        Reported by {rep.reportedByName}
                      </span>
                    </div>
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                      {rep.reason}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {rep.status === 'pending' ? (
                      <button
                        onClick={() => {
                          api.updateReportStatus(rep.id, 'resolved');
                          setReports(api.getAdminReports());
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-slate-700 hover:bg-slate-800 text-xs font-semibold"
                      >
                        Mark Reviewed
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800">
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
