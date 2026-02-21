'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordResetRequestSchema, passwordResetSchema } from '@/lib/validation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

export const PasswordResetForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(token ? passwordResetSchema : passwordResetRequestSchema),
  });

  const onSubmitRequest = async (data: any) => {
    setIsLoading(true);
    try {
      await apiClient.requestPasswordReset(data.email);
      setEmailSent(true);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitReset = async (data: any) => {
    setIsLoading(true);
    try {
      await apiClient.resetPassword(data.token, data.newPassword);
      toast.success('Password reset successful!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-green-800">
            We&apos;ve sent a password reset link to your email. Please check your inbox.
          </p>
        </div>
        <Button onClick={() => router.push('/login')} className="w-full">
          Back to Login
        </Button>
      </div>
    );
  }

  if (token) {
    return (
      <div className="w-full max-w-md space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmitReset)} className="space-y-4">
          <Input
            type="hidden"
            value={token}
            {...register('token')}
          />
          <PasswordInput
            label="New Password"
            placeholder="••••••••"
            error={errors.newPassword?.message as string}
            {...register('newPassword')}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message as string}
            {...register('confirmPassword')}
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Reset Password
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email address and we&apos;ll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmitRequest)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message as string}
          {...register('email')}
        />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Send Reset Link
        </Button>
      </form>
    </div>
  );
};

