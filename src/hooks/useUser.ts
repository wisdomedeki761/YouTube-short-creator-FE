import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

export const useUser = () => {
  const { profile, loading, fetchProfile, updateProfile } = useUserStore();

  useEffect(() => {
    if (!profile && !loading) {
      fetchProfile();
    }
  }, [profile, loading, fetchProfile]);

  return {
    profile,
    loading,
    fetchProfile,
    updateProfile,
  };
};

