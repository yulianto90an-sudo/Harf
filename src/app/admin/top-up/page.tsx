'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { createClient } from '@/services/supabase/client';

interface TopUpRequest {
  id: string;
  user_id: string;
  package: string;
  amount: number;
  price_rp: number;
  proof_url: string;
  status: string;
  admin_notes: string | null;
  reviewed_at: string | null;
  created_at: string | null;
  user?: { username: string; avatar_url: string | null } | null;
}

const PACKAGE_LABELS: Record<string, string> = {
  starter: 'Starter - 100 ✦',
  popular: 'Populer - 300 ✦',
  whale: 'Whale - 500 ✦',
};

function AdminLogin({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json();
      if (data.valid) {
        onLogin(pw);
      } else {
        setError('Password salah');
      }
    } catch {
      setError('Gagal terhubung ke server');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-dvh bg-bg-primary px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-5">
        <div className="text-center">
          <h1 className="text-display-2 text-text-primary">Admin Panel</h1>
          <p className="text-body-small text-text-tertiary mt-1">Masukkan password admin</p>
        </div>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="w-full h-12 px-4 rounded-xl bg-bg-elevated border border-white/5 text-text-primary text-body outline-none focus:border-emerald-500/40 transition-colors"
          autoFocus
        />
        {error && <p className="text-body-small text-error text-center">{error}</p>}
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading || !pw}
          className={cn(
            'w-full h-12 rounded-xl font-bold text-body-bold transition-colors',
            loading ? 'bg-emerald-500/50 text-white/50 cursor-not-allowed' : 'bg-emerald-500 text-white',
          )}
        >
          {loading ? 'Memeriksa...' : 'Masuk'}
        </motion.button>
      </form>
    </div>
  );
}

function formatDate(d: string | null) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminTopUpPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [requests, setRequests] = useState<TopUpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const apiFetch = useCallback(async (action: string, requestId: string, adminNotes?: string) => {
    setProcessing(requestId);
    try {
      const res = await fetch('/api/admin/top-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ action, requestId, adminNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId
              ? { ...r, status: action === 'approve' ? 'approved' : 'rejected', reviewed_at: new Date().toISOString() }
              : r,
          ),
        );
      } else {
        alert('Error: ' + (data.error ?? 'Unknown'));
      }
    } catch {
      alert('Network error');
    }
    setProcessing(null);
  }, [password]);

  useEffect(() => {
    if (!password) return;
    const client = createClient();
    client
      .from('top_up_requests')
      .select('*, user:user_id(username, avatar_url)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setRequests(data as unknown as TopUpRequest[]);
        }
        setLoading(false);
      });
  }, [password]);

  if (!password) return <AdminLogin onLogin={setPassword} />;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-bg-primary">
        <p className="text-body text-text-tertiary">Memuat...</p>
      </div>
    );
  }

  const pending = requests.filter((r) => r.status === 'pending');
  const history = requests.filter((r) => r.status !== 'pending');

  return (
    <div className="min-h-dvh bg-bg-primary px-4 py-6">
      <div className="max-w-lg mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display-2 text-text-primary">Top-Up Requests</h1>
            <p className="text-body-small text-text-tertiary mt-1">{pending.length} pending</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setPassword(null)}
            className="h-9 px-3.5 rounded-xl bg-bg-elevated border border-white/5 text-text-secondary text-micro"
          >
            Logout
          </motion.button>
        </div>

        {pending.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6B6B80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="text-body text-text-tertiary">Tidak ada permintaan pending</p>
          </div>
        )}

        {pending.map((req) => (
          <motion.div
            key={req.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-bg-card border border-white/5 p-5 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-body-bold text-text-primary">{PACKAGE_LABELS[req.package] ?? req.package}</p>
                <p className="text-micro text-text-tertiary mt-0.5">
                  {req.user?.username ?? req.user_id.slice(0, 8)} &middot; {formatDate(req.created_at)}
                </p>
              </div>
              <span className="text-label px-2.5 py-1 rounded-full bg-warning/10 text-warning border border-warning/20">
                Pending
              </span>
            </div>

            <div className="flex items-center gap-2 text-body-small text-text-tertiary">
              <span>Rp{req.price_rp.toLocaleString('id-ID')}</span>
              <span className="text-white/10">|</span>
              <span>{req.amount} ✦ gems</span>
            </div>

            {req.proof_url && (
              <div className="rounded-xl overflow-hidden bg-bg-elevated">
                <img src={req.proof_url} alt="Bukti transfer" className="w-full h-48 object-contain" />
              </div>
            )}

            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => apiFetch('approve', req.id)}
                disabled={processing === req.id}
                className={cn(
                  'flex-1 h-10 rounded-xl font-bold text-label transition-colors',
                  processing === req.id
                    ? 'bg-emerald-500/50 text-white/50'
                    : 'bg-emerald-500 text-white',
                )}
              >
                {processing === req.id ? '...' : 'Setujui'}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const notes = prompt('Alasan ditolak (opsional):');
                  apiFetch('reject', req.id, notes ?? undefined);
                }}
                disabled={processing === req.id}
                className="flex-1 h-10 rounded-xl bg-error/10 text-error border border-error/20 font-bold text-label"
              >
                Tolak
              </motion.button>
            </div>
          </motion.div>
        ))}

        {history.length > 0 && (
          <div>
            <h2 className="text-heading-2 text-text-primary mb-3">Riwayat</h2>
            <div className="flex flex-col gap-2">
              {history.map((req) => (
                <div
                  key={req.id}
                  className="rounded-xl bg-bg-card border border-white/5 p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-body-small text-text-primary">{PACKAGE_LABELS[req.package] ?? req.package}</p>
                    <p className="text-micro text-text-tertiary">{formatDate(req.created_at)}</p>
                  </div>
                  <span
                    className={cn(
                      'text-label px-2.5 py-1 rounded-full border',
                      req.status === 'approved'
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-error/10 text-error border-error/20',
                    )}
                  >
                    {req.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
