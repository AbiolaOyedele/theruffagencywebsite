import { Suspense } from 'react';
import { LoginForm } from '@/components/features/admin/LoginForm';
import { RuffLogo } from '@/components/ui/RuffLogo';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <RuffLogo style={{ height: 28, width: 'auto', display: 'block', marginBottom: 28 }} />
        <h1 className="text-2xl font-bold tracking-tight">Studio</h1>
        <p className="mt-1 mb-6 text-sm text-[#6b5a55]">
          Sign in to edit the site and see how it is doing.
        </p>
        {/* Reads the `next` parameter, so it is suspended rather than
            forcing the sign-in screen to render per request. */}
        <Suspense fallback={<div className="h-64" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
