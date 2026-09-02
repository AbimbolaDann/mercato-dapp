import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const DEFAULT_POLLAR_BASE_URL = 'https://sdk.api.pollar.xyz/v1'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = (await request.json().catch(() => null)) as
    | { walletId?: unknown }
    | null

  const walletId = typeof payload?.walletId === 'string' ? payload.walletId.trim() : ''
  if (!walletId) {
    return NextResponse.json({ error: 'walletId is required' }, { status: 400 })
  }

  const secretKey = process.env.POLLAR_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: 'Pollar secret key is not configured' }, { status: 500 })
  }

  const baseUrl = process.env.POLLAR_BASE_URL ?? DEFAULT_POLLAR_BASE_URL

  try {
    const response = await fetch(`${baseUrl}/wallets/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({ walletId }),
    })

    if (response.status === 409) {
      await supabase
        .from('profiles')
        .update({
          wallet_status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      return NextResponse.json({
        status: 'active',
        message: 'Wallet activation already completed',
      })
    }

    const data = (await response.json().catch(() => null)) as
      | { status?: string; error?: string; message?: string }
      | null

    if (!response.ok) {
      const errorMessage =
        data?.error ||
        data?.message ||
        (response.status === 400
          ? 'Invalid wallet ID'
          : response.status === 402
            ? 'Wallet activation requires funding'
            : response.status === 422
              ? 'Wallet activation failed validation'
              : 'Failed to activate wallet')
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    await supabase
      .from('profiles')
      .update({
        wallet_status: 'active',
        wallet_provider: 'pollar',
        pollar_wallet_id: walletId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    return NextResponse.json({
      status: data?.status ?? 'active',
      message: data?.message ?? 'Wallet activated',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to activate wallet'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
