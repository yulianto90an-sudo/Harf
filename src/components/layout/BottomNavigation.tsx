'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets } from '@/animations/presets';

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const TABS: TabConfig[] = [
  {
    id: 'home',
    label: 'Beranda',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    path: '/',
  },
  {
    id: 'battle',
    label: 'Battle',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    path: '/battle',
  },
  {
    id: 'progress',
    label: 'Progress',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    path: '/progress',
  },
  {
    id: 'social',
    label: 'Peringkat',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 6 9 6 9z" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 18 9 18 9z" />
        <path d="M4 22h16" />
        <path d="M10 22V4l4-2v20" />
      </svg>
    ),
    path: '/social',
  },
  {
    id: 'profile',
    label: 'Profil',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    path: '/profile',
  },
];

interface BottomNavigationProps {
  className?: string;
}

export function BottomNavigation({ className }: BottomNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveIndex = () => {
    const idx = TABS.findIndex(
      (t) => pathname === t.path || pathname.startsWith(t.path + '/') || (t.path !== '/' && pathname.startsWith(t.path)),
    );
    return idx >= 0 ? idx : 0;
  };

  const activeIndex = getActiveIndex();

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app z-50',
        'bg-bg-surface/80 backdrop-blur-2xl border-t border-white/[0.04]',
        'shadow-bottom-nav rounded-t-2xl pb-safe-bottom',
        className,
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-[60px] px-2">
        {TABS.map((tab, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              className={cn(
                'relative flex flex-col items-center justify-center w-14 h-full gap-0.5',
                'tap-highlight-transparent select-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-md',
              )}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 w-8 h-[3px] bg-emerald-500 rounded-full"
                  transition={springPresets.snappy}
                />
              )}
              <span
                className={cn(
                  'transition-colors duration-200',
                  isActive ? 'text-emerald-400' : 'text-text-tertiary',
                )}
              >
                {tab.icon}
              </span>
              <span
                className={cn(
                  'text-micro transition-colors duration-200',
                  isActive ? 'text-emerald-400 font-semibold' : 'text-text-tertiary',
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
