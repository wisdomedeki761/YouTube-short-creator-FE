import { create } from 'zustand';
import { UserProfile, ApiKey } from '@/types/user';
import { Video } from '@/types/video';

interface UserStore {
  profile: UserProfile | null;
  apiKeys: ApiKey[];
  videos: Video[];
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  fetchApiKeys: () => Promise<void>;
  addApiKey: (platform: 'youtube' | 'facebook', key: string) => Promise<void>;
  deleteApiKey: (id: string) => Promise<void>;
  fetchVideos: (filters?: any) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  profile: null,
  apiKeys: [],
  videos: [],
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const { token } = await import('./authStore').then(m => m.useAuthStore.getState());
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
      set({ profile: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    set({ loading: true, error: null });
    try {
      const { token } = await import('./authStore').then(m => m.useAuthStore.getState());
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const updated = await response.json();
      if (!response.ok) throw new Error(updated.message || 'Failed to update profile');
      set({ profile: updated, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchApiKeys: async () => {
    set({ loading: true, error: null });
    try {
      const { token } = await import('./authStore').then(m => m.useAuthStore.getState());
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/api-keys`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = await response.json();
      if (!response.ok) {
        const errorMsg = responseData.body?.error?.message || responseData.message || 'Failed to fetch API keys';
        throw new Error(errorMsg);
      }
      // Backend returns: { body: { success: true, data: [...] } }
      const apiKeys = responseData.body?.data || responseData.data || responseData || [];
      set({ apiKeys: Array.isArray(apiKeys) ? apiKeys : [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false, apiKeys: [] });
    }
  },

  addApiKey: async (platform: 'youtube' | 'facebook', key: string) => {
    set({ loading: true, error: null });
    try {
      const { token } = await import('./authStore').then(m => m.useAuthStore.getState());
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/api-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ platform, apiKey: key }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        const errorMsg = responseData.body?.error?.message || responseData.message || 'Failed to add API key';
        throw new Error(errorMsg);
      }
      // Backend returns: { body: { success: true, data: {...} } }
      const newKey = responseData.body?.data || responseData.data || responseData;
      set((state) => ({ apiKeys: [...(Array.isArray(state.apiKeys) ? state.apiKeys : []), newKey], loading: false }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteApiKey: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { token } = await import('./authStore').then(m => m.useAuthStore.getState());
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/api-keys/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete API key');
      }
      set((state) => ({
        apiKeys: state.apiKeys.filter((k) => k.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchVideos: async (filters?: any) => {
    set({ loading: true, error: null });
    try {
      const { token } = await import('./authStore').then(m => m.useAuthStore.getState());

      // Build clean params - skip undefined/null values
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.set(key, String(value));
          }
        });
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/videos?${params.toString()}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch videos');

      const videos = data.data || [];
      console.log('Fetched videos:', videos.length);
      set({ videos: Array.isArray(videos) ? videos : [], loading: false });
    } catch (error: any) {
      console.error('fetchVideos error:', error.message);
      set({ error: error.message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

