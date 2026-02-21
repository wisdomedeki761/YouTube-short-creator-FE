import { Header } from '@/components/layout/Header';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';

export default function ResetPasswordPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <PasswordResetForm />
      </main>
    </>
  );
}

