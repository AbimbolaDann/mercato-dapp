import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { VaultDashboard } from '@/components/dashboard/vault-dashboard'
import { getServerDictionary } from '@/lib/i18n/server'

export default async function DashboardVaultPage() {
  const t = await getServerDictionary()
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

  const userType = profile?.user_type
  if (userType !== 'investor' && userType !== 'pyme') {
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-10">
      <div className="sr-only">
        <h1>{t.dashboardNav.vault}</h1>
        <p>{t.dashboardNav.vaultDescription}</p>
      </div>
      <VaultDashboard viewerRole={userType === 'pyme' ? 'pyme' : 'investor'} />
    </div>
  )
}
