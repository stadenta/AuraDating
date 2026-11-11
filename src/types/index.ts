export type UserRole = 'guest' | 'regular' | 'vip' | 'admin';

export type VipTier = 'Silver' | 'Gold' | 'Diamond' | 'Elite';

export type OnlineStatus = 'online' | 'recently_active' | 'offline';

export type UnlockDuration = 'permanent' | '24h' | '7d' | '30d';

export interface PrivacySettings {
  hideFromPublic: boolean;
  hideOnlineStatus: boolean;
  privatePhotosOnly: boolean;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
  isPrivate?: boolean;
}

export interface Profile {
  id: string;
  displayName: string;
  age: number;
  gender: 'female' | 'male' | 'non-binary';
  country: string;
  city: string;
  interests: string[];
  bio: string;
  fullBio: string;
  avatar: string;
  blurredAvatar?: string;
  gallery: GalleryPhoto[];
  isVip: boolean;
  vipTier?: VipTier;
  onlineStatus: OnlineStatus;
  lastActiveText?: string;
  privacySettings: PrivacySettings;
  occupation: string;
  languages: string[];
  verified: boolean;
  metrics: {
    viewsCount: number;
    unlocksCount: number;
    engagementCount: number;
  };
}

/**
 * Sanitized profile representation sent to clients.
 * For locked VIP profiles viewed by guests or un-unlocked users,
 * sensitive fields are redacted on the backend service level.
 */
export interface SanitizedProfile {
  id: string;
  displayName: string;
  age: number;
  gender: 'female' | 'male' | 'non-binary';
  country: string;
  city: string;
  interests: string[];
  bio: string;
  avatar: string;
  isVip: boolean;
  vipTier?: VipTier;
  onlineStatus: OnlineStatus;
  lastActiveText?: string;
  verified: boolean;
  occupation?: string;
  languages?: string[];
  metrics: {
    viewsCount: number;
    unlocksCount: number;
    engagementCount: number;
  };
  // VIP Unlock State
  isUnlocked: boolean;
  unlockExpiresAt?: number | null;
  // Restricted information only revealed after unlock
  fullBio?: string;
  gallery?: GalleryPhoto[];
  galleryCount: number;
  isRestrictedVip: boolean;
}

export interface PricingConfig {
  regularProfileView: number; // 0 (Free)
  vipProfileView: number; // e.g. 10 credits
  vipProfileDuration: UnlockDuration;
  vipTierCharges: Record<VipTier, number>;
  regularTextMessage: number; // e.g. 2 credits
  vipTextMessage: number; // e.g. 5 credits
  regularVideoCallPerMinute: number; // e.g. 5 credits/min
  vipVideoCallPerMinute: number; // e.g. 10 credits/min
  regularGiftFee: number; // e.g. 5 credits
  vipGiftFee: number; // e.g. 15 credits
}

export type TransactionType =
  | 'vip_unlock'
  | 'text_message'
  | 'video_call'
  | 'gift'
  | 'credit_topup'
  | 'registration_bonus';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: TransactionType;
  targetProfileId?: string;
  targetProfileName?: string;
  credits: number;
  timestamp: string;
  description: string;
  isVipInteraction: boolean;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  credits: number;
  unlockedProfileIds: string[];
  favorites: string[];
  blockedUserIds: string[];
  privacySettings: PrivacySettings;
  avatar?: string;
}

export interface VipUnlockRecord {
  id: string;
  userId: string;
  profileId: string;
  unlockedAt: number;
  expiresAt: number | null; // null = permanent
  creditsPaid: number;
}

export interface ReportTicket {
  id: string;
  reportedByUserId: string;
  reportedByName: string;
  targetProfileId: string;
  targetProfileName: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  timestamp: string;
}

export interface VipApplication {
  id: string;
  userId: string;
  userName: string;
  requestedTier: VipTier;
  reason: string;
  portfolioLink?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  timestamp: string;
  creditsDeducted?: number;
  isVipRate?: boolean;
}
