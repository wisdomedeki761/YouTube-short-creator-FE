'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Chrome } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { GOOGLE_CLIENT_ID } from '@/lib/constants';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    google?: any;
  }
}

export const GoogleOAuthButton: React.FC = () => {
  const router = useRouter();
  const { loginWithGoogle } = useAuthStore();

  const handleGoogleLogin = async () => {
    if (!window.google) {
      toast.error('Google Sign-In is not available');
      return;
    }

    try {
      const response = await window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: async (tokenResponse: any) => {
          try {
            await loginWithGoogle(tokenResponse.access_token);
            
            // Get user data from store to check if admin
            const { user } = useAuthStore.getState();
            
            toast.success('Login successful!');
            
            // Redirect based on user role - use replace to avoid back button issues
            if (user?.is_admin) {
              router.replace('/admin');
            } else {
              router.replace('/dashboard');
            }
          } catch (error: any) {
            toast.error(error.message || 'Google login failed');
          }
        },
      });
      response.requestAccessToken();
    } catch (error: any) {
      toast.error(error.message || 'Failed to initialize Google Sign-In');
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogleLogin}
    >
      <Chrome className="mr-2 h-5 w-5" />
      Sign in with Google
    </Button>
  );
};

