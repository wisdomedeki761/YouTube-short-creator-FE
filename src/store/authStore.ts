import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/user';
import { STORAGE_KEYS } from '@/lib/constants';

interface AuthStore {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
  register: (email: string, password: string, username?: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  isAuthenticated: () => boolean;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
          console.log('Login API URL:', `${apiUrl}/api/auth/login`); // Debug log
          const response = await fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          console.log('Login response:', data); // Debug log
          
          if (!response.ok) {
            const errorMsg = data.body?.error?.message || data.message || 'Login failed';
            console.error('Login error response:', data);
            throw new Error(errorMsg);
          }
          
          // Backend response structure: { body: { success: true, data: { user, accessToken, refreshToken } } }
          // The successResponse wraps the result in body.data
          const responseData = data.body?.data || data.data || data;
          const userData = responseData?.user || data.user;
          const accessToken = responseData?.accessToken || data.accessToken;
          const refreshToken = responseData?.refreshToken || data.refreshToken;
          
          if (!userData || !accessToken) {
            console.error('Invalid login response - missing user or token:', {
              hasUser: !!userData,
              hasToken: !!accessToken,
              responseData,
              fullData: data
            });
            throw new Error('Invalid response from server - missing user data or token');
          }
          
          // Store refresh token
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }
          
          console.log('Login successful, user:', userData); // Debug log
          
          set({
            user: userData,
            token: accessToken,
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      loginWithGoogle: async (token: string) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: token }),
          });
          const data = await response.json();
          if (!response.ok) {
            const errorMsg = data.body?.error?.message || data.message || 'Google login failed';
            throw new Error(errorMsg);
          }
          // Backend returns accessToken and refreshToken
          const userData = data.body?.data?.user || data.user;
          const accessToken = data.body?.data?.accessToken || data.accessToken;
          const refreshToken = data.body?.data?.refreshToken || data.refreshToken;
          // Store refresh token
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }
          set({
            user: userData,
            token: accessToken,
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, username?: string) => {
        set({ loading: true, error: null });
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
          const response = await fetch(`${apiUrl}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, ...(username && { username }) }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            // Try to extract error message from different response formats
            const errorMsg = 
              data.body?.error?.message || 
              data.error?.message || 
              data.message || 
              `Registration failed (${response.status})`;
            console.error('Registration error:', { status: response.status, data });
            throw new Error(errorMsg);
          }
          
          // Backend returns accessToken and refreshToken
          const userData = data.body?.data?.user || data.data?.user || data.user;
          const accessToken = data.body?.data?.accessToken || data.data?.accessToken || data.accessToken;
          const refreshToken = data.body?.data?.refreshToken || data.data?.refreshToken || data.refreshToken;
          
          if (!userData || !accessToken) {
            console.error('Invalid response format:', data);
            throw new Error('Invalid response from server');
          }
          
          // Store refresh token
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }
          
          set({
            user: userData,
            token: accessToken,
            loading: false,
          });
        } catch (error: any) {
          console.error('Registration failed:', error);
          const errorMessage = error.message || 'Registration failed. Please check your connection and try again.';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem('refresh_token');
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      },

      refreshToken: async () => {
        const { token } = get();
        if (!token) return;
        try {
          // Get refresh token from localStorage
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) {
            get().logout();
            return;
          }
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });
          const data = await response.json();
          if (response.ok) {
            const newToken = data.body?.data?.accessToken || data.accessToken;
            if (newToken) {
              set({ token: newToken });
            }
          } else {
            get().logout();
          }
        } catch (error) {
          get().logout();
        }
      },

      setUser: (user: User | null) => set({ user }),
      setToken: (token: string | null) => set({ token }),
      
      isAuthenticated: () => {
        const { user, token } = get();
        return !!user && !!token;
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

