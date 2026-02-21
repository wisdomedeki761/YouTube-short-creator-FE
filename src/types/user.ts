export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  accountType: 'email' | 'google';
  status: 'pending' | 'approved' | 'rejected' | 'revoked';
  createdAt: string;
  lastLogin?: string;
  emailVerified?: boolean;
  is_admin?: boolean;
}

export interface UserProfile extends User {
  apiKeys?: ApiKey[];
  preferences?: UserPreferences;
}

export interface ApiKey {
  id: string;
  platform: 'youtube' | 'facebook';
  key: string;
  status: 'active' | 'inactive' | 'invalid';
  createdAt: string;
  lastUsed?: string;
  usageCount?: number;
}

export interface UserPreferences {
  defaultFillerVideo?: string;
  autoPost?: boolean;
  notifications?: {
    email?: boolean;
    push?: boolean;
  };
}

