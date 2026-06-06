import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export async function POST(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD not set in .env.local' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ') || authHeader.slice(7) !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { action, requestId, adminNotes } = body as {
    action: 'approve' | 'reject';
    requestId: string;
    adminNotes?: string;
  };

  if (!action || !requestId) {
    return NextResponse.json({ error: 'Missing action or requestId' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return NextResponse.json({ error: 'Supabase URL not configured' }, { status: 500 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey ?? anonKey;

  if (!key) {
    return NextResponse.json({ error: 'No Supabase key configured' }, { status: 500 });
  }

  const client = createClient<Database>(supabaseUrl, key);

  if (action === 'approve') {
    const { data: request } = await client
      .from('top_up_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (!request) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    if (request.status !== 'pending') {
      return NextResponse.json({ error: 'Request already processed' }, { status: 400 });
    }

    const { error: updateError } = await client
      .from('top_up_requests')
      .update({
        status: 'approved',
        admin_notes: adminNotes ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

    const { error: gemsError } = await client.rpc('credit_gems', {
      p_user_id: request.user_id,
      p_amount: request.amount,
    });

    if (gemsError) return NextResponse.json({ error: gemsError.message }, { status: 500 });

    return NextResponse.json({ success: true });
  }

  if (action === 'reject') {
    const { data: request } = await client
      .from('top_up_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (!request) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    if (request.status !== 'pending') {
      return NextResponse.json({ error: 'Request already processed' }, { status: 400 });
    }

    const { error } = await client
      .from('top_up_requests')
      .update({
        status: 'rejected',
        admin_notes: adminNotes ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
