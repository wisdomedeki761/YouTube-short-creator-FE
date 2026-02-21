import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const router = useRouter();
  const { user, token, isAuthenticated, logout } = useAuthStore();

  const requireAuth = () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return false;
    }
    return true;
  };

  const requireAdmin = () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return false;
    }
    if (user?.status !== 'approved') {
      router.push('/dashboard');
      return false;
    }
    return true;
  };

  return {
    user,
    token,
    isAuthenticated: isAuthenticated(),
    requireAuth,
    requireAdmin,
    logout,
  };
};

