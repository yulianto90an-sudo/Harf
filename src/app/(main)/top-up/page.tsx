'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScreenContainer } from '@/components/shared/ScreenContainer';
import { useAuthStore } from '@/stores/authStore';
import { useGemsStore } from '@/stores/gemsStore';
import { cn } from '@/utils/cn';

const PACKAGES = [
  {
    id: 'starter' as const,
    name: 'Starter',
    gems: 100,
    price: 50000,
    priceLabel: 'Rp50.000',
    badge: 'Hemat',
    badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  },
  {
    id: 'popular' as const,
    name: 'Populer',
    gems: 300,
    price: 75000,
    priceLabel: 'Rp75.000',
    badge: 'Terlaris',
    badgeColor: 'text-gold-400 bg-gold-400/10 border-gold-400/20',
  },
  {
    id: 'whale' as const,
    name: 'Whale',
    gems: 500,
    price: 120000,
    priceLabel: 'Rp120.000',
    badge: 'Best Value',
    badgeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  },
] as const;

export default function TopUpPage() {
  const user = useAuthStore((s) => s.user);
  const { balance, loadBalance, submitTopUp, loadRequests } = useGemsStore();
  const [selected, setSelected] = useState<typeof PACKAGES[number]['id'] | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadBalance(user.id);
      loadRequests(user.id);
    }
  }, [user?.id, loadBalance, loadRequests]);

  const pkg = PACKAGES.find((p) => p.id === selected);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async () => {
    if (!user || !pkg || !preview) return;
    setSubmitting(true);
    const result = await submitTopUp(user.id, pkg.id, pkg.gems, pkg.price, preview);
    if (result.success) {
      setSuccess(true);
      loadRequests(user.id);
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <ScreenContainer>
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <h2 className="text-display-2 text-text-primary text-center">Permintaan Terkirim!</h2>
          <p className="text-body text-text-secondary text-center">
            Admin akan memproses permintaan top-up kamu. Kami akan mengirimkan notifikasi setelah diverifikasi.
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSuccess(false);
              setSelected(null);
              setPreview(null);
            }}
            className="mt-4 h-12 px-8 rounded-xl bg-emerald-500 text-white font-bold text-body-bold"
          >
            Kirim Lagi
          </motion.button>
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <div className="flex flex-col gap-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display-2 text-text-primary">Top Up</h1>
            <p className="text-body-small text-text-tertiary mt-1">Isi permata untuk fitur eksklusif</p>
          </div>
          <div className="flex items-center gap-2 h-10 px-3.5 rounded-xl bg-gold-400/10 border border-gold-400/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FBBF24">
              <path d="M12 2l2.4 7.2H22l-6.4 4.8 2.4 7.2L12 16.8 6 21.2l2.4-7.2L2 9.2h7.6z" />
            </svg>
            <span className="text-body-bold text-gold-400">{balance}</span>
          </div>
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-3 gap-3">
          {PACKAGES.map((p) => {
            const isSelected = selected === p.id;
            return (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelected(p.id)}
                className={cn(
                  'relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-colors',
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-glow-emerald'
                    : 'bg-bg-card border-white/5',
                )}
              >
                <span className={cn('text-label px-2 py-0.5 rounded-full border', p.badgeColor)}>
                  {p.badge}
                </span>
                <span className="text-display-1 text-text-primary font-bold">{p.gems}</span>
                <div className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24">
                    <path d="M12 2l2.4 7.2H22l-6.4 4.8 2.4 7.2L12 16.8 6 21.2l2.4-7.2L2 9.2h7.6z" />
                  </svg>
                  <span className="text-body-small text-text-tertiary">{p.priceLabel}</span>
                </div>
                {isSelected && (
                  <motion.div
                    layoutId="check"
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Bank Info */}
        <div className="rounded-2xl bg-bg-card border border-white/5 p-5">
          <h3 className="text-heading-2 text-text-primary mb-3">Transfer ke</h3>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-bg-elevated">
            <div>
              <p className="text-body-small text-text-tertiary">Bank BSI</p>
              <p className="text-display-2 text-text-primary font-bold tracking-wider">9700707005</p>
              <p className="text-body-small text-text-tertiary mt-0.5">a.n. Yuvi Ads Indonesia</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigator.clipboard.writeText('9700707005')}
              className="h-10 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-label"
            >
              Salin
            </motion.button>
          </div>
        </div>

        {/* Upload Proof */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-bg-card border border-white/5 p-5"
          >
            <h3 className="text-heading-2 text-text-primary mb-3">Upload Bukti Transfer</h3>

            {!preview ? (
              <label className="flex flex-col items-center justify-center h-36 rounded-xl border-2 border-dashed border-white/10 bg-bg-elevated cursor-pointer hover:border-emerald-500/30 transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B6B80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-body-small text-text-tertiary mt-2">Ketuk untuk upload</span>
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden">
                <img src={preview} alt="Bukti transfer" className="w-full h-48 object-cover rounded-xl" />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setPreview(null); }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </motion.button>
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={!preview || submitting}
              className={cn(
                'w-full h-12 rounded-xl font-bold text-body-bold mt-4 transition-colors',
                submitting
                  ? 'bg-emerald-500/50 text-white/50 cursor-not-allowed'
                  : 'bg-emerald-500 text-white',
              )}
            >
              {submitting ? 'Mengirim...' : `Kirim Permintaan Top Up`}
            </motion.button>
          </motion.div>
        )}
      </div>
    </ScreenContainer>
  );
}
