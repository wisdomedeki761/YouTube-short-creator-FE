'use client';

import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';
import { AlertCircle } from 'lucide-react';

interface ApprovalGuardProps {
  children: React.ReactNode;
}

export function ApprovalGuard({ children }: ApprovalGuardProps) {
  const { user } = useAuthStore();

  // Admins bypass approval check
  if (user?.isAdmin || user?.is_admin) {
    return <>{children}</>;
  }

  // Show pending approval message if not approved
  if (user && !user.isApproved && !user.is_approved) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="max-w-md p-8 text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Account Pending Approval
          </h2>
          <p className="text-gray-600 mb-4">
            Your account is currently under review by an administrator.
            You&apos;ll receive an email once your account is approved.
          </p>
          <p className="text-sm text-gray-500">
            This usually takes 24-48 hours.
          </p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
