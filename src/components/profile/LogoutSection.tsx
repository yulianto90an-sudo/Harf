'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { springPresets } from '@/animations/presets';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

export function LogoutSection() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      /* proceed */
    }
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.3 }}
      className="space-y-2"
    >
      {isAuthenticated && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          transition={springPresets.snappy}
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            'w-full py-3 rounded-xl bg-error/10 border border-error/20 text-error font-semibold text-label',
            'tap-highlight-transparent select-none',
            isLoggingOut && 'opacity-50',
          )}
        >
          {isLoggingOut ? 'Keluar...' : 'Keluar dari Akun'}
        </motion.button>
      )}

      <motion.button
        whileTap={{ scale: 0.97 }}
        transition={springPresets.snappy}
        className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-text-tertiary font-semibold text-micro"
      >
        Hapus Akun
      </motion.button>
    </motion.div>
  );
}
