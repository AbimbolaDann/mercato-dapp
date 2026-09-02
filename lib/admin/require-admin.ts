import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function requireAdminProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', user.id)
    .single()

  if (profile?.user_type !== 'admin') {
    redirect('/dashboard')
  }

  return { supabase, user }
}

export function getConfiguredVaultAddress(): string {
  return (
    process.env.NEXT_PUBLIC_DEFINDEX_VAULT_ADDRESS?.trim() ||
    process.env.NEXT_PUBLIC_MERCATO_DEFINDEX_VAULT_ADDRESS?.trim() ||
    process.env.MERCATO_DEFINDEX_VAULT_ADDRESS?.trim() ||
    ''
  )
}
