'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { GoogleOAuthButton } from './GoogleOAuthButton';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { validatePasswordStrength } from '@/utils/validators';

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { register: registerUser, error, clearError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    valid: boolean;
    errors: string[];
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);

  React.useEffect(() => {
    if (password) {
      setPasswordStrength(validatePasswordStrength(password));
    } else {
      setPasswordStrength(null);
    }
  }, [password]);

  React.useEffect(() => {
    if (confirmPassword && password) {
      setPasswordMatch(password === confirmPassword);
    } else {
      setPasswordMatch(null);
    }
  }, [password, confirmPassword]);

  const onSubmit = async (data: any) => {
    // Double-check password match before submitting
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Check password strength one more time
    const strengthCheck = validatePasswordStrength(data.password);
    if (!strengthCheck.valid) {
      toast.error('Password does not meet requirements');
      return;
    }

    setIsLoading(true);
    clearError();
    try {
      await registerUser(data.email, data.password, data.username);
      
      // Get user data from store to check if admin
      const { user } = useAuthStore.getState();
      
      toast.success('Registration successful!');
      
      // Redirect based on user role (new users are typically not admin) - use replace
      if (user?.is_admin) {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Get started with your free account today
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={clearError} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message as string}
          {...register('email')}
        />

        <Input
          label="Username"
          type="text"
          placeholder="Choose a username"
          error={errors.username?.message as string}
          {...register('username')}
        />

        <div>
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message as string}
            {...register('password')}
          />
          {passwordStrength && password && (
            <div className="mt-2 space-y-1">
              {passwordStrength.valid ? (
                <p className="text-xs text-green-600 dark:text-green-400">✓ Password meets all requirements</p>
              ) : (
                passwordStrength.errors.map((err, idx) => (
                  <p key={idx} className="text-xs text-red-600 dark:text-red-400">
                    • {err}
                  </p>
                ))
              )}
            </div>
          )}
        </div>

        <div>
          <PasswordInput
            label="Confirm Password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message as string}
            {...register('confirmPassword')}
          />
          {confirmPassword && passwordMatch !== null && (
            <p className={`mt-1 text-xs ${passwordMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {passwordMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
            </p>
          )}
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            {...register('termsAccepted')}
            className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span>
            I agree to the{' '}
            <Link href="/terms" target="_blank" className="text-primary-600 hover:text-primary-700 underline">
              Terms and Conditions
            </Link>
          </span>
        </label>
        {errors.termsAccepted && (
          <p className="text-sm text-red-600">{errors.termsAccepted.message as string}</p>
        )}

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create account
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <GoogleOAuthButton />

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </div>
  );
};

