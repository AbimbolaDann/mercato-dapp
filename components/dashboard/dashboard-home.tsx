import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import type { DashboardPayload } from '@/lib/dashboard/types'
import type { Messages } from '@/lib/i18n/dictionaries'

type DashboardHomeProps = {
  data: DashboardPayload
  t: Messages
}

export function DashboardHome({ data, t }: DashboardHomeProps) {
  return <DashboardOverview data={data} t={t} />
}
