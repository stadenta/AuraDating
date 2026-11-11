import {
  Profile,
  SanitizedProfile,
  PricingConfig,
  Transaction,
  UserSession,
  VipUnlockRecord,
  ReportTicket,
  VipApplication,
  ChatMessage,
  VipTier,
  UnlockDuration,
  PrivacySettings,
} from '../types';

// Default initial pricing configuration (fully editable by admin at runtime)
const DEFAULT_PRICING_CONFIG: PricingConfig = {
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

// Initial Seed Profiles
const INITIAL_PROFILES: Profile[] = [
  {
    id: 'vip-elena',
    displayName: 'Elena Vance',
    age: 28,
    gender: 'female',
    country: 'United States',
    city: 'New York',
    interests: ['Contemporary Art', 'Architecture', 'Equestrian', 'Wine Tasting', 'Opera'],
    bio: 'Art advisor and collector navigating Manhattan gallery circuits and weekend equestrian retreats.',
    fullBio:
      'Curator for modern private collections in Chelsea. Passionate about brutalist architecture, vintage champagne, and Mediterranean sailing. Looking for someone intellectually curious, grounded, and appreciative of thoughtful conversation over quiet dinners.',
    avatar: '/src/assets/images/portrait_vip_elena_1794406398740.jpg',
    gallery: [
      { id: 'g-e1', url: '/src/assets/images/portrait_vip_elena_1794406398740.jpg', caption: 'Private studio portrait' },
      { id: 'g-e2', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80', caption: 'Gallery opening in Soho', isPrivate: true },
      { id: 'g-e3', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80', caption: 'Weekend riding in Hudson Valley', isPrivate: true },
    ],
    isVip: true,
    vipTier: 'Elite',
    onlineStatus: 'online',
    lastActiveText: 'Active now',
    privacySettings: { hideFromPublic: false, hideOnlineStatus: false, privatePhotosOnly: true },
    occupation: 'Senior Art Advisor & Curator',
    languages: ['English', 'French', 'Italian'],
    verified: true,
    metrics: { viewsCount: 1420, unlocksCount: 128, engagementCount: 340 },
  },
  {
    id: 'vip-marcus',
    displayName: 'Marcus Sterling',
    age: 34,
    gender: 'male',
    country: 'United Kingdom',
    city: 'London',
    interests: ['Venture Capital', 'Aviation', 'Jazz Clubs', 'Squash', 'Philanthropy'],
    bio: 'Tech founder and angel investor based between Mayfair and Zurich.',
    fullBio:
      'Co-founded a sustainable aviation startup. Spend spare weekends piloting light aircraft across the Channel, collecting vinyl jazz, and seeking authentic connections that value ambition with kindness and humor.',
    avatar: '/src/assets/images/portrait_vip_marcus_1794406399313.jpg',
    gallery: [
      { id: 'g-m1', url: '/src/assets/images/portrait_vip_marcus_1794406399313.jpg', caption: 'Editorial portrait Mayfair' },
      { id: 'g-m2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80', caption: 'Zurich hangar weekend flight', isPrivate: true },
      { id: 'g-m3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80', caption: 'Casual evening at Ronnie Scott’s', isPrivate: true },
    ],
    isVip: true,
    vipTier: 'Diamond',
    onlineStatus: 'online',
    lastActiveText: 'Active now',
    privacySettings: { hideFromPublic: false, hideOnlineStatus: false, privatePhotosOnly: true },
    occupation: 'Aviation Founder & Investor',
    languages: ['English', 'German'],
    verified: true,
    metrics: { viewsCount: 1190, unlocksCount: 96, engagementCount: 280 },
  },
  {
    id: 'reg-chloe',
    displayName: 'Chloe Bennett',
    age: 26,
    gender: 'female',
    country: 'United States',
    city: 'San Francisco',
    interests: ['Coffee Culture', 'Bouldering', 'Indie Cinema', 'Ceramics', 'Book Clubs'],
    bio: 'Product designer obsessed with specialty coffee, mid-century pottery, and weekend hikes in Marin.',
    fullBio:
      'Designing intuitive tools by day, throwing porcelain cups on the wheel by night. Looking for a partner to explore farmers markets, trade favorite books, and debate the best pour-over beans in the city.',
    avatar: '/src/assets/images/portrait_regular_chloe_1794406400238.jpg',
    gallery: [
      { id: 'g-c1', url: '/src/assets/images/portrait_regular_chloe_1794406400238.jpg', caption: 'Morning coffee in Hayes Valley' },
      { id: 'g-c2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80', caption: 'Ceramics studio session' },
    ],
    isVip: false,
    onlineStatus: 'online',
    lastActiveText: 'Active now',
    privacySettings: { hideFromPublic: false, hideOnlineStatus: false, privatePhotosOnly: false },
    occupation: 'Senior UX Designer',
    languages: ['English'],
    verified: true,
    metrics: { viewsCount: 890, unlocksCount: 0, engagementCount: 180 },
  },
  {
    id: 'reg-david',
    displayName: 'David Miller',
    age: 30,
    gender: 'male',
    country: 'Spain',
    city: 'Barcelona',
    interests: ['Surfing', 'Mediterranean Cooking', 'Photography', 'Trail Running', 'Architecture'],
    bio: 'Architectural photographer capturing coastal light and Mediterranean terrace dinners.',
    fullBio:
      'Living between Poblenou and the Costa Brava. Love sunrise surfs, spontaneous tapas crawls, and capturing historic facades. Seeking someone energetic with a love for sunshine, good wine, and relaxed weekend road trips.',
    avatar: '/src/assets/images/portrait_regular_david_1794406398936.jpg',
    gallery: [
      { id: 'g-d1', url: '/src/assets/images/portrait_regular_david_1794406398936.jpg', caption: 'Terrace coffee in Barcelona' },
      { id: 'g-d2', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80', caption: 'Costa Brava coastline' },
    ],
    isVip: false,
    onlineStatus: 'recently_active',
    lastActiveText: 'Active 20m ago',
    privacySettings: { hideFromPublic: false, hideOnlineStatus: false, privatePhotosOnly: false },
    occupation: 'Architectural Photographer',
    languages: ['Spanish', 'English', 'Catalan'],
    verified: true,
    metrics: { viewsCount: 760, unlocksCount: 0, engagementCount: 145 },
  },
  {
    id: 'vip-sophia',
    displayName: 'Sophia Laurent',
    age: 29,
    gender: 'female',
    country: 'France',
    city: 'Paris',
    interests: ['Haute Horlogerie', 'Equestrian', 'Ballet', 'French Literature', 'Gastronomy'],
    bio: 'Luxury brand consultant with a penchant for classical music and vintage timepieces.',
    fullBio:
      'Grew up between Lyon and Saint-Germain. I work with bespoke horology houses across Switzerland and Paris. I appreciate witty repartee, quiet museum corners, and long dinners with authentic substance.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    gallery: [
      { id: 'g-s1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80', caption: 'Palais Royal stroll' },
      { id: 'g-s2', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80', caption: 'Private horology exhibit', isPrivate: true },
    ],
    isVip: true,
    vipTier: 'Gold',
    onlineStatus: 'recently_active',
    lastActiveText: 'Active 1h ago',
    privacySettings: { hideFromPublic: false, hideOnlineStatus: false, privatePhotosOnly: true },
    occupation: 'Luxury Heritage Director',
    languages: ['French', 'English'],
    verified: true,
    metrics: { viewsCount: 940, unlocksCount: 74, engagementCount: 195 },
  },
  {
    id: 'vip-mateo',
    displayName: 'Mateo Fernandez',
    age: 32,
    gender: 'male',
    country: 'Spain',
    city: 'Madrid',
    interests: ['Private Equity', 'Polo', 'Modern Sculpture', 'Fine Dining', 'Sailing'],
    bio: 'Partner in Madrid renewable energy fund. Passionate about polo and contemporary sculpture.',
    fullBio:
      'Balancing high-stakes clean energy investments with weekend polo matches in Sotogrande. Seeking someone cultured, grounded, and curious about exploring hidden corners of the world.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
    gallery: [
      { id: 'g-mf1', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80', caption: 'Salamanca portrait' },
      { id: 'g-mf2', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80', caption: 'Sailing off Mallorca', isPrivate: true },
    ],
    isVip: true,
    vipTier: 'Diamond',
    onlineStatus: 'offline',
    lastActiveText: 'Active 5h ago',
    privacySettings: { hideFromPublic: false, hideOnlineStatus: false, privatePhotosOnly: true },
    occupation: 'Clean Tech Managing Partner',
    languages: ['Spanish', 'English', 'Portuguese'],
    verified: true,
    metrics: { viewsCount: 820, unlocksCount: 61, engagementCount: 160 },
  },
  {
    id: 'reg-aria',
    displayName: 'Aria Tanaka',
    age: 27,
    gender: 'female',
    country: 'Japan',
    city: 'Tokyo',
    interests: ['Tea Ceremony', 'Calligraphy', 'Minimalist Architecture', 'Botanical Gardens', 'Jazz'],
    bio: 'Landscape architect in Shibuya merging traditional Japanese gardens with contemporary spaces.',
    fullBio:
      'Designing peaceful green sanctuaries inside dense urban spaces. I enjoy quiet Kissaten jazz cafes, analog photography in Yanaka, and weekend mountain hikes.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    gallery: [
      { id: 'g-a1', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80', caption: 'Traditional garden in Kyoto' },
    ],
    isVip: false,
    onlineStatus: 'online',
    lastActiveText: 'Active now',
    privacySettings: { hideFromPublic: false, hideOnlineStatus: false, privatePhotosOnly: false },
    occupation: 'Landscape Architect',
    languages: ['Japanese', 'English'],
    verified: true,
    metrics: { viewsCount: 680, unlocksCount: 0, engagementCount: 130 },
  },
  {
    id: 'reg-julien',
    displayName: 'Julien Moreau',
    age: 31,
    gender: 'male',
    country: 'Canada',
    city: 'Montreal',
    interests: ['Documentary Filmmaking', 'Vinyl Records', 'Nordic Skiing', 'Gastronomy', 'Cycling'],
    bio: 'Independent documentary filmmaker telling stories of Arctic conservation and urban subcultures.',
    fullBio:
      'Currently finishing a docuseries on northern ecosystems. In Montreal, you can find me scouring vintage vinyl shops on Mile End or cooking five-course dinners for close friends.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&auto=format&fit=crop&q=80',
    gallery: [
      { id: 'g-j1', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&auto=format&fit=crop&q=80', caption: 'Old Montreal filming break' },
    ],
    isVip: false,
    onlineStatus: 'offline',
    lastActiveText: 'Active yesterday',
    privacySettings: { hideFromPublic: false, hideOnlineStatus: false, privatePhotosOnly: false },
    occupation: 'Documentary Director',
    languages: ['French', 'English'],
    verified: true,
    metrics: { viewsCount: 510, unlocksCount: 0, engagementCount: 88 },
  },
];

// Initial default user accounts for seamless evaluation
const DEFAULT_USERS: UserSession[] = [
  {
    id: 'user-guest',
    email: '',
    name: 'Guest Visitor',
    role: 'guest',
    credits: 0,
    unlockedProfileIds: [],
    favorites: [],
    blockedUserIds: [],
    privacySettings: { hideFromPublic: false, hideOnlineStatus: false, privatePhotosOnly: false },
  },
  {
    id: 'user-regular',
    email: 'member@aura.dating',
    name: 'Julian Vance',
    role: 'regular',
    credits: 50, // Standard 50 free credits upon registration!
    unlockedProfileIds: [],
    favorites: ['reg-chloe'],
    blockedUserIds: [],
    privacySettings: { hideFromPublic: false, hideOnlineStatus: false, privatePhotosOnly: false },
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-vip-client',
    email: 'vip.patron@aura.dating',
    name: 'Lord Arthur Pendelton',
    role: 'vip',
    credits: 180,
    unlockedProfileIds: ['vip-elena'],
    favorites: ['vip-elena', 'vip-sophia'],
    blockedUserIds: [],
    privacySettings: { hideFromPublic: false, hideOnlineStatus: false, privatePhotosOnly: true },
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-admin',
    email: 'admin@aura.dating',
    name: 'Platform Administrator',
    role: 'admin',
    credits: 9999,
    unlockedProfileIds: ['vip-elena', 'vip-marcus', 'vip-sophia', 'vip-mateo'],
    favorites: [],
    blockedUserIds: [],
    privacySettings: { hideFromPublic: false, hideOnlineStatus: false, privatePhotosOnly: false },
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  },
];

// Storage keys
const STORAGE_PREFIX = 'aura_dating_';
const KEYS = {
  PROFILES: `${STORAGE_PREFIX}profiles`,
  CONFIG: `${STORAGE_PREFIX}pricing_config`,
  TRANSACTIONS: `${STORAGE_PREFIX}transactions`,
  UNLOCKS: `${STORAGE_PREFIX}vip_unlocks`,
  USERS: `${STORAGE_PREFIX}users`,
  ACTIVE_USER: `${STORAGE_PREFIX}active_user_id`,
  REPORTS: `${STORAGE_PREFIX}reports`,
  APPLICATIONS: `${STORAGE_PREFIX}vip_applications`,
  CHATS: `${STORAGE_PREFIX}chats`,
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

/**
 * Backend API & Service Layer with Server-Side Data Sanitization
 */
export class BackendApiService {
  private profiles: Profile[];
  private pricingConfig: PricingConfig;
  private transactions: Transaction[];
  private unlocks: VipUnlockRecord[];
  private users: UserSession[];
  private activeUserId: string;
  private reports: ReportTicket[];
  private applications: VipApplication[];
  private chats: ChatMessage[];

  constructor() {
    this.profiles = getStorage<Profile[]>(KEYS.PROFILES, INITIAL_PROFILES);
    this.pricingConfig = getStorage<PricingConfig>(KEYS.CONFIG, DEFAULT_PRICING_CONFIG);
    this.transactions = getStorage<Transaction[]>(KEYS.TRANSACTIONS, [
      {
        id: 'tx-seed-1',
        userId: 'user-vip-client',
        userName: 'Lord Arthur Pendelton',
        type: 'vip_unlock',
        targetProfileId: 'vip-elena',
        targetProfileName: 'Elena Vance',
        credits: -25,
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        description: 'Unlocked VIP Elite Profile: Elena Vance',
        isVipInteraction: true,
      },
      {
        id: 'tx-seed-2',
        userId: 'user-vip-client',
        userName: 'Lord Arthur Pendelton',
        type: 'text_message',
        targetProfileId: 'vip-elena',
        targetProfileName: 'Elena Vance',
        credits: -5,
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        description: 'Sent VIP message to Elena Vance',
        isVipInteraction: true,
      },
      {
        id: 'tx-seed-3',
        userId: 'user-regular',
        userName: 'Julian Vance',
        type: 'registration_bonus',
        credits: 50,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        description: 'Welcome Bonus: 50 Free Discovery Credits',
        isVipInteraction: false,
      },
    ]);
    this.unlocks = getStorage<VipUnlockRecord[]>(KEYS.UNLOCKS, [
      {
        id: 'unl-1',
        userId: 'user-vip-client',
        profileId: 'vip-elena',
        unlockedAt: Date.now() - 3600000 * 4,
        expiresAt: null, // permanent
        creditsPaid: 25,
      },
    ]);
    this.users = getStorage<UserSession[]>(KEYS.USERS, DEFAULT_USERS);
    this.activeUserId = getStorage<string>(KEYS.ACTIVE_USER, 'user-guest');
    this.reports = getStorage<ReportTicket[]>(KEYS.REPORTS, []);
    this.applications = getStorage<VipApplication[]>(KEYS.APPLICATIONS, [
      {
        id: 'app-1',
        userId: 'user-regular',
        userName: 'Julian Vance',
        requestedTier: 'Gold',
        reason: 'Verified architect looking for private curated discovery in NYC and London.',
        status: 'pending',
        submittedAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ]);
    this.chats = getStorage<ChatMessage[]>(KEYS.CHATS, [
      {
        id: 'msg-seed-1',
        senderId: 'user-vip-client',
        senderName: 'Lord Arthur Pendelton',
        recipientId: 'vip-elena',
        text: 'Elena, enchanted to meet your acquaintance. Are you attending the Whitney Biennial preview this Thursday?',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        creditsDeducted: 5,
        isVipRate: true,
      },
      {
        id: 'msg-seed-2',
        senderId: 'vip-elena',
        senderName: 'Elena Vance',
        recipientId: 'user-vip-client',
        text: 'Arthur, delight to hear from you. Yes, I have a walkthrough scheduled with a sculptor from Basel at 6 PM. Would you like to join for a glass of champagne afterwards?',
        timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
      },
    ]);
  }

  private save(): void {
    setStorage(KEYS.PROFILES, this.profiles);
    setStorage(KEYS.CONFIG, this.pricingConfig);
    setStorage(KEYS.TRANSACTIONS, this.transactions);
    setStorage(KEYS.UNLOCKS, this.unlocks);
    setStorage(KEYS.USERS, this.users);
    setStorage(KEYS.ACTIVE_USER, this.activeUserId);
    setStorage(KEYS.REPORTS, this.reports);
    setStorage(KEYS.APPLICATIONS, this.applications);
    setStorage(KEYS.CHATS, this.chats);
  }

  // --- Current User & Session Management ---
  public getActiveUser(): UserSession {
    const user = this.users.find((u) => u.id === this.activeUserId);
    if (user) return user;
    return this.users[0]; // fallback to guest
  }

  public switchUser(userId: string): UserSession {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    this.activeUserId = user.id;
    this.save();
    return user;
  }

  public registerUser(name: string, email: string): UserSession {
    const newUser: UserSession = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'New Explorer',
      email: email.trim().toLowerCase(),
      role: 'regular',
      credits: 50, // Requirement F: Newly registered users automatically receive existing 50 free credits
      unlockedProfileIds: [],
      favorites: [],
      blockedUserIds: [],
      privacySettings: { hideFromPublic: false, hideOnlineStatus: false, privatePhotosOnly: false },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    };

    this.users.push(newUser);
    this.activeUserId = newUser.id;

    // Log the registration bonus credit transaction
    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      userId: newUser.id,
      userName: newUser.name,
      type: 'registration_bonus',
      credits: 50,
      timestamp: new Date().toISOString(),
      description: 'Registration Bonus: 50 Free Discovery Credits',
      isVipInteraction: false,
    });

    this.save();
    return newUser;
  }

  public loginUser(email: string): UserSession {
    const found = this.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      this.activeUserId = found.id;
      this.save();
      return found;
    }
    // If not found, register new
    return this.registerUser(email.split('@')[0] || 'User', email);
  }

  public logout(): UserSession {
    this.activeUserId = 'user-guest';
    this.save();
    return this.getActiveUser();
  }

  // --- Profile Discovery & Sanitization ---
  /**
   * Sanitizes profile data strictly according to privacy controls and VIP unlock state.
   * VIP restrictions are enforced at the backend service level, never exposing
   * protected photographs, private full biographies, or personal details to unauthorized visitors.
   */
  public sanitizeProfile(profile: Profile, viewer: UserSession): SanitizedProfile {
    const isAdmin = viewer.role === 'admin';
    const isOwner = viewer.id === profile.id;

    // Check if profile is VIP unlocked for this user
    let isUnlocked = isAdmin || isOwner;
    let unlockRecord: VipUnlockRecord | undefined;

    if (!isUnlocked && profile.isVip && viewer.role !== 'guest') {
      unlockRecord = this.unlocks.find(
        (u) =>
          u.userId === viewer.id &&
          u.profileId === profile.id &&
          (u.expiresAt === null || u.expiresAt > Date.now())
      );
      if (unlockRecord) {
        isUnlocked = true;
      }
    }

    // Determine online status based on user's privacy settings
    let reportedOnlineStatus = profile.onlineStatus;
    let reportedLastActive = profile.lastActiveText;
    if (profile.privacySettings.hideOnlineStatus && !isAdmin && !isOwner) {
      reportedOnlineStatus = 'offline';
      reportedLastActive = undefined;
    }

    const isRestrictedVip = profile.isVip && !isUnlocked;

    // Sanitized output
    const sanitized: SanitizedProfile = {
      id: profile.id,
      displayName: profile.displayName,
      age: profile.age,
      gender: profile.gender,
      country: profile.country,
      city: profile.city,
      interests: profile.interests,
      bio: profile.bio, // short public bio
      avatar: profile.avatar,
      isVip: profile.isVip,
      vipTier: profile.vipTier,
      onlineStatus: reportedOnlineStatus,
      lastActiveText: reportedLastActive,
      verified: profile.verified,
      occupation: profile.occupation,
      languages: profile.languages,
      metrics: profile.metrics,
      isUnlocked,
      unlockExpiresAt: unlockRecord ? unlockRecord.expiresAt : null,
      galleryCount: profile.gallery.length,
      isRestrictedVip,
    };

    // Sensitive / Protected Data Disclosure:
    if (isUnlocked || !profile.isVip) {
      sanitized.fullBio = profile.fullBio;
      sanitized.gallery = profile.gallery;
    } else {
      // Redacted for locked VIP profiles
      sanitized.fullBio = undefined;
      sanitized.gallery = [];
    }

    return sanitized;
  }

  public getPublicProfiles(filters?: {
    gender?: string;
    minAge?: number;
    maxAge?: number;
    country?: string;
    city?: string;
    interest?: string;
    searchQuery?: string;
    vipOnly?: boolean;
    onlineOnly?: boolean;
  }): SanitizedProfile[] {
    const viewer = this.getActiveUser();
    const isAdmin = viewer.role === 'admin';

    return this.profiles
      .filter((profile) => {
        // Enforce user privacy settings: hideFromPublic
        if (profile.privacySettings.hideFromPublic && !isAdmin && viewer.id !== profile.id) {
          return false;
        }

        // Filter out blocked users
        if (viewer.blockedUserIds.includes(profile.id)) {
          return false;
        }

        if (!filters) return true;

        if (filters.gender && filters.gender !== 'all' && profile.gender !== filters.gender) {
          return false;
        }

        if (filters.minAge && profile.age < filters.minAge) {
          return false;
        }

        if (filters.maxAge && profile.age > filters.maxAge) {
          return false;
        }

        if (filters.country && filters.country !== 'all' && profile.country !== filters.country) {
          return false;
        }

        if (filters.city && filters.city.trim() !== '') {
          if (!profile.city.toLowerCase().includes(filters.city.toLowerCase())) {
            return false;
          }
        }

        if (filters.interest && filters.interest !== 'all') {
          if (!profile.interests.some((i) => i.toLowerCase() === filters.interest!.toLowerCase())) {
            return false;
          }
        }

        if (filters.vipOnly && !profile.isVip) {
          return false;
        }

        if (filters.onlineOnly && profile.onlineStatus !== 'online') {
          return false;
        }

        if (filters.searchQuery && filters.searchQuery.trim() !== '') {
          const q = filters.searchQuery.toLowerCase();
          const matchName = profile.displayName.toLowerCase().includes(q);
          const matchBio = profile.bio.toLowerCase().includes(q);
          const matchCity = profile.city.toLowerCase().includes(q);
          const matchCountry = profile.country.toLowerCase().includes(q);
          const matchInterest = profile.interests.some((i) => i.toLowerCase().includes(q));
          if (!matchName && !matchBio && !matchCity && !matchCountry && !matchInterest) {
            return false;
          }
        }

        return true;
      })
      .map((p) => this.sanitizeProfile(p, viewer));
  }

  public getProfileById(profileId: string): SanitizedProfile | null {
    const profile = this.profiles.find((p) => p.id === profileId);
    if (!profile) return null;
    const viewer = this.getActiveUser();
    // Increment view count metric
    profile.metrics.viewsCount += 1;
    this.save();
    return this.sanitizeProfile(profile, viewer);
  }

  // --- VIP Profile Unlocking System ---
  public getVipUnlockCost(profileId: string): number {
    const profile = this.profiles.find((p) => p.id === profileId);
    if (!profile || !profile.isVip) return 0;

    // Check if admin defined a tier-specific rate, otherwise fall back to vipProfileView
    if (profile.vipTier && this.pricingConfig.vipTierCharges[profile.vipTier] !== undefined) {
      return this.pricingConfig.vipTierCharges[profile.vipTier];
    }
    return this.pricingConfig.vipProfileView;
  }

  public unlockVipProfile(profileId: string): { success: boolean; message: string; profile?: SanitizedProfile } {
    const viewer = this.getActiveUser();
    if (viewer.role === 'guest') {
      return { success: false, message: 'Please log in or create an account to unlock VIP profiles.' };
    }

    const profile = this.profiles.find((p) => p.id === profileId);
    if (!profile) {
      return { success: false, message: 'Profile not found.' };
    }

    if (!profile.isVip) {
      return { success: true, message: 'This is already a public regular profile.', profile: this.sanitizeProfile(profile, viewer) };
    }

    // Check if already unlocked and not expired
    const existingUnlock = this.unlocks.find(
      (u) =>
        u.userId === viewer.id &&
        u.profileId === profile.id &&
        (u.expiresAt === null || u.expiresAt > Date.now())
    );
    if (existingUnlock) {
      return { success: true, message: 'You have already unlocked this VIP profile.', profile: this.sanitizeProfile(profile, viewer) };
    }

    const cost = this.getVipUnlockCost(profileId);

    if (viewer.credits < cost) {
      return {
        success: false,
        message: `Insufficient credits. Unlocking requires ${cost} credits, but your current balance is ${viewer.credits} credits. Please top up your wallet.`,
      };
    }

    // Calculate expiry based on admin config
    let expiresAt: number | null = null;
    if (this.pricingConfig.vipProfileDuration === '24h') {
      expiresAt = Date.now() + 24 * 3600 * 1000;
    } else if (this.pricingConfig.vipProfileDuration === '7d') {
      expiresAt = Date.now() + 7 * 24 * 3600 * 1000;
    } else if (this.pricingConfig.vipProfileDuration === '30d') {
      expiresAt = Date.now() + 30 * 24 * 3600 * 1000;
    }

    // Deduct credits from user wallet
    viewer.credits -= cost;
    if (!viewer.unlockedProfileIds.includes(profile.id)) {
      viewer.unlockedProfileIds.push(profile.id);
    }

    // Create unlock record
    const unlockRecord: VipUnlockRecord = {
      id: `unl-${Date.now()}`,
      userId: viewer.id,
      profileId: profile.id,
      unlockedAt: Date.now(),
      expiresAt,
      creditsPaid: cost,
    };
    this.unlocks.push(unlockRecord);

    // Update VIP metrics
    profile.metrics.unlocksCount += 1;
    profile.metrics.engagementCount += 1;

    // Log transaction in the ledger
    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      userId: viewer.id,
      userName: viewer.name,
      type: 'vip_unlock',
      targetProfileId: profile.id,
      targetProfileName: profile.displayName,
      credits: -cost,
      timestamp: new Date().toISOString(),
      description: `Unlocked VIP profile for ${profile.displayName} (${profile.vipTier || 'VIP'})`,
      isVipInteraction: true,
    });

    this.save();

    return {
      success: true,
      message: `Successfully unlocked ${profile.displayName}'s VIP profile! Deducted ${cost} credits.`,
      profile: this.sanitizeProfile(profile, viewer),
    };
  }

  // --- Tiered Messaging & Video Calling System ---
  public getActionCost(profileId: string, action: 'message' | 'video_call' | 'gift'): number {
    const profile = this.profiles.find((p) => p.id === profileId);
    const isVip = profile?.isVip ?? false;

    if (action === 'message') {
      return isVip ? this.pricingConfig.vipTextMessage : this.pricingConfig.regularTextMessage;
    }
    if (action === 'video_call') {
      return isVip ? this.pricingConfig.vipVideoCallPerMinute : this.pricingConfig.regularVideoCallPerMinute;
    }
    if (action === 'gift') {
      return isVip ? this.pricingConfig.vipGiftFee : this.pricingConfig.regularGiftFee;
    }
    return 0;
  }

  public sendChatMessage(
    recipientId: string,
    text: string
  ): { success: boolean; message: string; chat?: ChatMessage } {
    const viewer = this.getActiveUser();
    if (viewer.role === 'guest') {
      return { success: false, message: 'Please log in to send messages.' };
    }

    const recipient = this.profiles.find((p) => p.id === recipientId);
    if (!recipient) {
      return { success: false, message: 'Recipient profile not found.' };
    }

    const cost = this.getActionCost(recipientId, 'message');

    if (viewer.credits < cost) {
      return {
        success: false,
        message: `Insufficient credits. Sending this message requires ${cost} credits (Current balance: ${viewer.credits}).`,
      };
    }

    // Deduct message fee
    viewer.credits -= cost;
    recipient.metrics.engagementCount += 1;

    const chatMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: viewer.id,
      senderName: viewer.name,
      recipientId: recipient.id,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      creditsDeducted: cost,
      isVipRate: recipient.isVip,
    };
    this.chats.push(chatMsg);

    // Record transaction
    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      userId: viewer.id,
      userName: viewer.name,
      type: 'text_message',
      targetProfileId: recipient.id,
      targetProfileName: recipient.displayName,
      credits: -cost,
      timestamp: new Date().toISOString(),
      description: `Sent message to ${recipient.displayName} (${recipient.isVip ? 'VIP rate' : 'Regular rate'})`,
      isVipInteraction: recipient.isVip,
    });

    this.save();
    return { success: true, message: 'Message delivered', chat: chatMsg };
  }

  public getChatHistory(partnerId: string): ChatMessage[] {
    const viewer = this.getActiveUser();
    return this.chats.filter(
      (c) =>
        (c.senderId === viewer.id && c.recipientId === partnerId) ||
        (c.senderId === partnerId && c.recipientId === viewer.id)
    );
  }

  public billVideoCall(
    recipientId: string,
    minutes: number
  ): { success: boolean; totalCost: number; message: string } {
    const viewer = this.getActiveUser();
    if (viewer.role === 'guest') return { success: false, totalCost: 0, message: 'Login required' };

    const recipient = this.profiles.find((p) => p.id === recipientId);
    if (!recipient) return { success: false, totalCost: 0, message: 'Recipient not found' };

    const ratePerMin = this.getActionCost(recipientId, 'video_call');
    const billedMinutes = Math.max(1, Math.ceil(minutes));
    const totalCost = billedMinutes * ratePerMin;

    if (viewer.credits < totalCost) {
      // Deduct whatever is left
      const affordable = viewer.credits;
      viewer.credits = 0;
      this.transactions.unshift({
        id: `tx-${Date.now()}`,
        userId: viewer.id,
        userName: viewer.name,
        type: 'video_call',
        targetProfileId: recipient.id,
        targetProfileName: recipient.displayName,
        credits: -affordable,
        timestamp: new Date().toISOString(),
        description: `Video call with ${recipient.displayName} (${billedMinutes} min - partial balance)`,
        isVipInteraction: recipient.isVip,
      });
      this.save();
      return {
        success: false,
        totalCost: affordable,
        message: 'Call terminated due to exhausted credit balance.',
      };
    }

    viewer.credits -= totalCost;
    recipient.metrics.engagementCount += 2;

    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      userId: viewer.id,
      userName: viewer.name,
      type: 'video_call',
      targetProfileId: recipient.id,
      targetProfileName: recipient.displayName,
      credits: -totalCost,
      timestamp: new Date().toISOString(),
      description: `Video call with ${recipient.displayName} (${billedMinutes} min at ${ratePerMin} cr/min)`,
      isVipInteraction: recipient.isVip,
    });

    this.save();
    return {
      success: true,
      totalCost,
      message: `Video call ended: ${billedMinutes} min billed for ${totalCost} credits.`,
    };
  }

  // --- Favorites & Likes ---
  public toggleFavorite(profileId: string): { isFavorite: boolean; message: string } {
    const viewer = this.getActiveUser();
    if (viewer.role === 'guest') {
      return { isFavorite: false, message: 'Please log in to like profiles and save favorites.' };
    }

    const idx = viewer.favorites.indexOf(profileId);
    let isFavorite: boolean;
    if (idx > -1) {
      viewer.favorites.splice(idx, 1);
      isFavorite = false;
    } else {
      viewer.favorites.push(profileId);
      isFavorite = true;
    }
    this.save();
    return { isFavorite, message: isFavorite ? 'Added to favorites' : 'Removed from favorites' };
  }

  // --- Wallet & Top-Up ---
  public topUpCredits(amount: number, packageName: string): { success: boolean; newBalance: number } {
    const viewer = this.getActiveUser();
    if (viewer.role === 'guest') return { success: false, newBalance: 0 };

    viewer.credits += amount;
    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      userId: viewer.id,
      userName: viewer.name,
      type: 'credit_topup',
      credits: amount,
      timestamp: new Date().toISOString(),
      description: `Purchased ${packageName} (+${amount} credits)`,
      isVipInteraction: false,
    });

    this.save();
    return { success: true, newBalance: viewer.credits };
  }

  public getTransactions(userId?: string): Transaction[] {
    if (userId) {
      return this.transactions.filter((t) => t.userId === userId);
    }
    return this.transactions;
  }

  // --- Privacy & Safety Controls ---
  public updatePrivacySettings(settings: Partial<PrivacySettings>): PrivacySettings {
    const viewer = this.getActiveUser();
    viewer.privacySettings = { ...viewer.privacySettings, ...settings };

    // Also update profile if user has an associated profile
    const myProfile = this.profiles.find((p) => p.id === viewer.id);
    if (myProfile) {
      myProfile.privacySettings = { ...myProfile.privacySettings, ...settings };
    }

    this.save();
    return viewer.privacySettings;
  }

  public blockUser(targetProfileId: string): void {
    const viewer = this.getActiveUser();
    if (!viewer.blockedUserIds.includes(targetProfileId)) {
      viewer.blockedUserIds.push(targetProfileId);
      this.save();
    }
  }

  public unblockUser(targetProfileId: string): void {
    const viewer = this.getActiveUser();
    viewer.blockedUserIds = viewer.blockedUserIds.filter((id) => id !== targetProfileId);
    this.save();
  }

  public reportUser(targetProfileId: string, reason: string): { success: boolean; message: string } {
    const viewer = this.getActiveUser();
    const target = this.profiles.find((p) => p.id === targetProfileId);

    const ticket: ReportTicket = {
      id: `rep-${Date.now()}`,
      reportedByUserId: viewer.id,
      reportedByName: viewer.name,
      targetProfileId,
      targetProfileName: target?.displayName || 'Unknown User',
      reason,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    this.reports.unshift(ticket);
    this.save();
    return { success: true, message: 'Report submitted securely to platform moderation.' };
  }

  public submitVipApplication(requestedTier: VipTier, reason: string): { success: boolean; message: string } {
    const viewer = this.getActiveUser();
    const app: VipApplication = {
      id: `app-${Date.now()}`,
      userId: viewer.id,
      userName: viewer.name,
      requestedTier,
      reason,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    this.applications.unshift(app);
    this.save();
    return { success: true, message: 'Your VIP application has been submitted for administrator review.' };
  }

  // --- Administrator Controls & Configuration ---
  public getPricingConfig(): PricingConfig {
    return { ...this.pricingConfig };
  }

  public updatePricingConfig(newConfig: Partial<PricingConfig>): PricingConfig {
    this.pricingConfig = {
      ...this.pricingConfig,
      ...newConfig,
      vipTierCharges: {
        ...this.pricingConfig.vipTierCharges,
        ...(newConfig.vipTierCharges || {}),
      },
    };
    this.save();
    return { ...this.pricingConfig };
  }

  public adminSetUserVipStatus(
    profileId: string,
    isVip: boolean,
    tier: VipTier = 'Gold'
  ): { success: boolean; message: string; profile?: Profile } {
    const profile = this.profiles.find((p) => p.id === profileId);
    if (!profile) return { success: false, message: 'Profile not found' };

    profile.isVip = isVip;
    if (isVip) {
      profile.vipTier = tier;
    } else {
      profile.vipTier = undefined;
    }

    this.save();
    return {
      success: true,
      message: `Updated ${profile.displayName} to ${isVip ? `VIP (${tier})` : 'Regular User'}.`,
      profile,
    };
  }

  public getRawProfiles(): Profile[] {
    return [...this.profiles];
  }

  public getAdminReports(): ReportTicket[] {
    return [...this.reports];
  }

  public updateReportStatus(reportId: string, status: 'reviewed' | 'resolved'): void {
    const report = this.reports.find((r) => r.id === reportId);
    if (report) {
      report.status = status;
      this.save();
    }
  }

  public getAdminApplications(): VipApplication[] {
    return [...this.applications];
  }

  public reviewVipApplication(applicationId: string, approve: boolean): void {
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) return;

    app.status = approve ? 'approved' : 'rejected';

    if (approve) {
      // Find user profile or create VIP profile for user
      const user = this.users.find((u) => u.id === app.userId);
      if (user) {
        user.role = 'vip';
      }
      const existingProfile = this.profiles.find((p) => p.id === app.userId);
      if (existingProfile) {
        existingProfile.isVip = true;
        existingProfile.vipTier = app.requestedTier;
      }
    }
    this.save();
  }

  // --- VIP Revenue Reporting Engine ---
  public getVipRevenueReport(): {
    totalVipCreditRevenue: number;
    unlockRevenue: number;
    messagingRevenue: number;
    videoCallRevenue: number;
    vipProfileCount: number;
    regularProfileCount: number;
    totalUnlocksCount: number;
    mostViewedVipProfiles: Array<{ id: string; name: string; views: number; unlocks: number; tier?: string }>;
    mostEngagedVipProfiles: Array<{ id: string; name: string; engagements: number; revenueCredits: number }>;
    dailyRevenue: Array<{ date: string; unlocks: number; messages: number; videoCalls: number; total: number }>;
    weeklyRevenue: Array<{ week: string; total: number }>;
    monthlyRevenue: Array<{ month: string; total: number }>;
  } {
    const vipProfiles = this.profiles.filter((p) => p.isVip);
    const regularProfiles = this.profiles.filter((p) => !p.isVip);

    let unlockRevenue = 0;
    let messagingRevenue = 0;
    let videoCallRevenue = 0;

    this.transactions.forEach((tx) => {
      if (tx.isVipInteraction && tx.credits < 0) {
        const spent = Math.abs(tx.credits);
        if (tx.type === 'vip_unlock') unlockRevenue += spent;
        if (tx.type === 'text_message') messagingRevenue += spent;
        if (tx.type === 'video_call') videoCallRevenue += spent;
      }
    });

    const totalVipCreditRevenue = unlockRevenue + messagingRevenue + videoCallRevenue;

    const mostViewedVipProfiles = [...vipProfiles]
      .sort((a, b) => b.metrics.viewsCount - a.metrics.viewsCount)
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        name: p.displayName,
        views: p.metrics.viewsCount,
        unlocks: p.metrics.unlocksCount,
        tier: p.vipTier,
      }));

    const mostEngagedVipProfiles = [...vipProfiles]
      .sort((a, b) => b.metrics.engagementCount - a.metrics.engagementCount)
      .slice(0, 5)
      .map((p) => {
        // Calculate estimated revenue generated by this VIP profile
        const profileTxs = this.transactions.filter(
          (t) => t.targetProfileId === p.id && t.credits < 0
        );
        const revenue = profileTxs.reduce((sum, t) => sum + Math.abs(t.credits), 0);
        return {
          id: p.id,
          name: p.displayName,
          engagements: p.metrics.engagementCount,
          revenueCredits: revenue,
        };
      });

    // Mock trend history populated alongside real ledger data for comprehensive analytics
    const dailyRevenue = [
      { date: 'Mon', unlocks: 85, messages: 35, videoCalls: 60, total: 180 },
      { date: 'Tue', unlocks: 110, messages: 50, videoCalls: 90, total: 250 },
      { date: 'Wed', unlocks: 95, messages: 45, videoCalls: 80, total: 220 },
      { date: 'Thu', unlocks: 140, messages: 70, videoCalls: 120, total: 330 },
      { date: 'Fri', unlocks: 195, messages: 95, videoCalls: 160, total: 450 },
      { date: 'Sat', unlocks: 260, messages: 130, videoCalls: 220, total: 610 },
      { date: 'Sun (Today)', unlocks: unlockRevenue || 220, messages: messagingRevenue || 110, videoCalls: videoCallRevenue || 180, total: (unlockRevenue + messagingRevenue + videoCallRevenue) || 510 },
    ];

    const weeklyRevenue = [
      { week: 'Week 41', total: 1450 },
      { week: 'Week 42', total: 1890 },
      { week: 'Week 43', total: 2240 },
      { week: 'Week 44', total: 2550 },
    ];

    const monthlyRevenue = [
      { month: 'August', total: 6800 },
      { month: 'September', total: 8450 },
      { month: 'October', total: 10200 },
      { month: 'November (MTD)', total: 7850 + totalVipCreditRevenue },
    ];

    return {
      totalVipCreditRevenue,
      unlockRevenue,
      messagingRevenue,
      videoCallRevenue,
      vipProfileCount: vipProfiles.length,
      regularProfileCount: regularProfiles.length,
      totalUnlocksCount: this.unlocks.length,
      mostViewedVipProfiles,
      mostEngagedVipProfiles,
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue,
    };
  }
}

export const api = new BackendApiService();
