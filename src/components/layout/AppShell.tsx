'use client';

import { AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { BottomNavigation } from './BottomNavigation';

interface AppShellProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  className?: string;
}

export function AppShell({ children, showBottomNav = true, className }: AppShellProps) {
  return (
    <div
      className={cn(
        'flex flex-col min-h-dvh max-w-app mx-auto relative bg-bg-primary',
        className,
      )}
    >
      <main className="flex-1 overflow-y-auto px-4 pb-4 pt-1">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
