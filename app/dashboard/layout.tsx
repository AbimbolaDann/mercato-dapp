import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { needsOnboarding, ONBOARDING_SETTINGS_PATH } from '@/lib/profile/onboarding'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', user.id)
    .single()

  if (needsOnboarding(profile?.user_type)) {
    redirect(ONBOARDING_SETTINGS_PATH)
  }

  const userType = profile?.user_type ?? 'pyme'

  return <DashboardShell userType={userType}>{children}</DashboardShell>
}
