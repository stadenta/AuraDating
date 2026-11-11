import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Crown,
  Sparkles,
  RotateCcw,
  Users,
  Compass,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SanitizedProfile, PricingConfig, UserSession } from '../types';
import { ProfileCard } from './ProfileCard';

interface DiscoveryFeedProps {
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
}

export const DiscoveryFeed: React.FC<DiscoveryFeedProps> = ({
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
}) => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedInterest, setSelectedInterest] = useState<string>('all');
  const [vipOnly, setVipOnly] = useState<boolean>(false);
  const [onlineOnly, setOnlineOnly] = useState<boolean>(false);
  const [ageRange, setAgeRange] = useState<number>(55);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState<boolean>(false);

  // Extract unique countries and interests
  const countries = useMemo(() => {
    const list = Array.from(new Set(profiles.map((p) => p.country))).sort();
    return ['all', ...list];
  }, [profiles]);

  const allInterests = useMemo(() => {
    const set = new Set<string>();
    profiles.forEach((p) => p.interests.forEach((i) => set.add(i)));
    return ['all', ...Array.from(set).sort()];
  }, [profiles]);

  // Apply Client Filtering
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      if (genderFilter !== 'all' && p.gender !== genderFilter) return false;
      if (selectedCountry !== 'all' && p.country !== selectedCountry) return false;
      if (selectedInterest !== 'all' && !p.interests.includes(selectedInterest)) return false;
      if (vipOnly && !p.isVip) return false;
      if (onlineOnly && p.onlineStatus !== 'online') return false;
      if (p.age > ageRange) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.displayName.toLowerCase().includes(q);
        const matchCity = p.city.toLowerCase().includes(q);
        const matchCountry = p.country.toLowerCase().includes(q);
        const matchBio = p.bio.toLowerCase().includes(q);
        const matchInterests = p.interests.some((i) => i.toLowerCase().includes(q));
        if (!matchName && !matchCity && !matchCountry && !matchBio && !matchInterests) {
          return false;
        }
      }

      return true;
    });
  }, [profiles, genderFilter, selectedCountry, selectedInterest, vipOnly, onlineOnly, ageRange, searchQuery]);

  const resetFilters = () => {
    setSearchQuery('');
    setGenderFilter('all');
    setSelectedCountry('all');
    setSelectedInterest('all');
    setVipOnly(false);
    setOnlineOnly(false);
    setAgeRange(55);
  };

  const isGuest = currentUser.role === 'guest';
  const vipCount = profiles.filter((p) => p.isVip).length;
  const regularCount = profiles.filter((p) => !p.isVip).length;

  return (
    <div className="space-y-8">
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-rose-400 uppercase">
            <Compass className="w-4 h-4" />
            <span>Public Discovery & Curated Matchmaking</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance leading-tight">
            Discover Exceptional Members Worldwide.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Browse freely as a guest without creating an account. Regular member profiles are completely open;
            VIP profiles offer exclusive protected galleries and verified lifestyle details unlocked with credits.
          </p>

          {/* Guest welcome callout */}
          {isGuest && (
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenAuth('register')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 flex items-center gap-2 transition-all active:scale-98"
              >
                <span>Claim 50 Free Credits</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>No password required to browse public profiles</span>
              </div>
            </div>
          )}
        </div>

        {/* Discovery Summary Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-slate-400">Total Registered</div>
            <div className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">
              {profiles.length} Members
            </div>
          </div>
          <div>
            <div className="text-slate-400">VIP Exclusive</div>
            <div className="text-lg font-bold font-mono tabular-nums text-amber-400 mt-0.5">
              {vipCount} Verified VIPs
            </div>
          </div>
          <div>
            <div className="text-slate-400">Open Public Profiles</div>
            <div className="text-lg font-bold font-mono tabular-nums text-emerald-400 mt-0.5">
              {regularCount} Free to View
            </div>
          </div>
          <div>
            <div className="text-slate-400">VIP Viewing Fee</div>
            <div className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">
              From {pricingConfig.vipProfileView} Credits
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Controls Bar */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-4">
        {/* Row 1: Search Input & Quick Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, city, country, profession, or interest..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Gender Segmented Filter (Interactive buttons allowed per §1.A) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
            <button
              onClick={() => setGenderFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                genderFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Genders
            </button>
            <button
              onClick={() => setGenderFilter('female')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                genderFilter === 'female'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Women
            </button>
            <button
              onClick={() => setGenderFilter('male')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                genderFilter === 'male'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Men
            </button>
          </div>

          {/* Filter Drawer Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
              className={`px-3.5 py-2 text-xs font-medium rounded-xl border flex items-center gap-1.5 transition-colors ${
                showFiltersDrawer
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(selectedCountry !== 'all' || selectedInterest !== 'all' || vipOnly || onlineOnly || ageRange < 55) && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              )}
            </button>

            {(selectedCountry !== 'all' || selectedInterest !== 'all' || vipOnly || onlineOnly || ageRange < 55 || searchQuery || genderFilter !== 'all') && (
              <button
                onClick={resetFilters}
                title="Reset all filters"
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Advanced Filter Drawer */}
        {showFiltersDrawer && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs animate-in fade-in duration-150">
            {/* Country Selector */}
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="all">All Countries</option>
                {countries.filter((c) => c !== 'all').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Interest Selector */}
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Interest / Lifestyle
              </label>
              <select
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value)}
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="all">All Interests</option>
                {allInterests.filter((i) => i !== 'all').map((interest) => (
                  <option key={interest} value={interest}>
                    {interest}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Age Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-slate-700 dark:text-slate-300">
                  Max Age: <span className="font-mono tabular-nums">{ageRange}</span>
                </label>
              </div>
              <input
                type="range"
                min="22"
                max="65"
                value={ageRange}
                onChange={(e) => setAgeRange(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>

            {/* VIP Only & Online Only Toggles */}
            <div className="flex flex-col justify-end space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={vipOnly}
                  onChange={(e) => setVipOnly(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  VIP Members Only
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlineOnly}
                  onChange={(e) => setOnlineOnly(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Online Now Only
                </span>
              </label>
            </div>
          </div>
        )}
      </section>

      {/* Profiles Grid Section */}
      <section>
        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Showing <strong className="font-mono tabular-nums text-slate-900 dark:text-white">{filteredProfiles.length}</strong> available profiles
            {genderFilter !== 'all' && ` · ${genderFilter === 'female' ? 'Women' : 'Men'}`}
            {vipOnly && ' · VIP Only'}
            {onlineOnly && ' · Online'}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>VIP Tiered</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span>Open Public</span>
            </span>
          </div>
        </div>

        {/* Grid or Empty State */}
        {filteredProfiles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center bg-white/50 dark:bg-slate-900/50">
            <Users className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No matching profiles found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria, widening the age range, or resetting filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 text-xs font-medium rounded-lg bg-slate-900 text-white dark:bg-slate-700 hover:bg-slate-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProfiles.map((profile) => (
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
        )}
      </section>
    </div>
  );
};
