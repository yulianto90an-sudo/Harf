-- Harf Gems & Top-Up System
-- Migration: 20260606_gems_and_topup

-- 1. Add gems column to profiles
ALTER TABLE profiles
ADD COLUMN gems INTEGER DEFAULT 0 CHECK (gems >= 0);

-- 2. Top-Up Requests table
CREATE TABLE top_up_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  package TEXT NOT NULL CHECK (package IN ('starter', 'popular', 'whale')),
  amount INTEGER NOT NULL CHECK (amount > 0),
  price_rp INTEGER NOT NULL CHECK (price_rp > 0),
  proof_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_top_up_requests_user ON top_up_requests(user_id, created_at DESC);
CREATE INDEX idx_top_up_requests_status ON top_up_requests(status, created_at DESC);

ALTER TABLE top_up_requests ENABLE ROW LEVEL SECURITY;

-- RLS: users can read own requests, insert own requests
CREATE POLICY "Users can read own top-up requests"
  ON top_up_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own top-up requests"
  ON top_up_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS: service role can manage all
CREATE POLICY "Service role can manage all top-up requests"
  ON top_up_requests FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- 3. RPC: credit gems to a user (used by admin API, SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION credit_gems(p_user_id UUID, p_amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  UPDATE profiles SET
    gems = COALESCE(gems, 0) + p_amount
  WHERE user_id = p_user_id
  RETURNING gems INTO v_new_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  RETURN v_new_balance;
END;
$$;
