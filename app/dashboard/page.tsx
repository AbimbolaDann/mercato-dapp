import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardHome } from '@/components/dashboard/dashboard-home'
import { getDashboardData } from '@/lib/dashboard/get-dashboard-data'
import { getServerDictionary } from '@/lib/i18n/server'

type DashboardSearchParams = Promise<{ company?: string }> | { company?: string }

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: DashboardSearchParams
}) {
  const supabase = await createClient()
  const t = await getServerDictionary()

  const params = searchParams
    ? typeof (searchParams as Promise<{ company?: string }>).then === 'function'
      ? await (searchParams as Promise<{ company?: string }>)
      : (searchParams as { company?: string })
    : {}
  const companyFilterId = params.company ?? null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const data = await getDashboardData(supabase, user.id, profile, user.email, companyFilterId)

  return <DashboardHome data={data} t={t} />
}
