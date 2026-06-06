import { create } from 'zustand';
import {
  getGemsBalance,
  deductGems,
  creditGems,
  createTopUpRequest,
  getMyTopUpRequests,
} from '@/services/supabase/queries';

export interface TopUpRequest {
  id: string;
  user_id: string;
  package: string;
  amount: number;
  price_rp: number;
  proof_url: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  reviewed_at: string | null;
  created_at: string | null;
}

interface GemsState {
  balance: number;
  requests: TopUpRequest[];
  isLoading: boolean;
}

interface GemsActions {
  loadBalance: (userId: string) => Promise<void>;
  loadRequests: (userId: string) => Promise<void>;
  deduct: (userId: string, amount: number) => Promise<boolean>;
  credit: (userId: string, amount: number) => Promise<boolean>;
  submitTopUp: (
    userId: string,
    pkg: 'starter' | 'popular' | 'whale',
    amount: number,
    priceRp: number,
    proofUrl: string,
  ) => Promise<{ success: boolean; error?: string }>;
}

type GemsStore = GemsState & GemsActions;

export const useGemsStore = create<GemsStore>()((set) => ({
  balance: 0,
  requests: [],
  isLoading: false,

  loadBalance: async (userId: string) => {
    set({ isLoading: true });
    const result = await getGemsBalance(userId);
    if (result.data !== null) {
      set({ balance: result.data as number, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  loadRequests: async (userId: string) => {
    const result = await getMyTopUpRequests(userId);
    if (result.data) {
      set({ requests: result.data as unknown as TopUpRequest[] });
    }
  },

  deduct: async (userId: string, amount: number) => {
    const result = await deductGems(userId, amount);
    if (result.data !== null) {
      set({ balance: result.data as number });
      return true;
    }
    return false;
  },

  credit: async (userId: string, amount: number) => {
    const result = await creditGems(userId, amount);
    if (result.data !== null) {
      set({ balance: result.data as number });
      return true;
    }
    return false;
  },

  submitTopUp: async (userId, pkg, amount, priceRp, proofUrl) => {
    const result = await createTopUpRequest(userId, pkg, amount, priceRp, proofUrl);
    if (result.error) return { success: false, error: result.error };
    set((state) => ({
      requests: [result.data as unknown as TopUpRequest, ...state.requests],
    }));
    return { success: true };
  },
}));
