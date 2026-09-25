import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { SIDEBAR_COLLAPSED_BOOTSTRAP_SCRIPT } from '@/lib/dashboard/sidebar-preference'
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

  return (
    <>
      {/*
        Apply the persisted sidebar preference before hydration so the first paint
        already uses the collapsed width and the dashboard never flashes expanded.
        The script never throws when storage is unavailable.
      */}
      <script dangerouslySetInnerHTML={{ __html: SIDEBAR_COLLAPSED_BOOTSTRAP_SCRIPT }} />
      <DashboardShell userType={userType}>{children}</DashboardShell>
    </>
  )
}
