'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isGuest, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isGuest) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, isGuest, router]);

  if (isLoading || (!isAuthenticated && !isGuest)) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-bg-primary">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
