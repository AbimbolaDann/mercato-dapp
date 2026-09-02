import { buildDashboardViewModel } from '@/lib/dashboard/build-view-model'
import type { DashboardPayload } from '@/lib/dashboard/types'
import type { Messages } from '@/lib/i18n/dictionaries'
import { DashboardDealsPanel } from '@/components/dashboard/dashboard-deals-panel'
import { AdminCommandHero } from './admin-command-hero'
import { AdminOperationsGrid } from './admin-operations-grid'
import { AdminPipeline } from './admin-pipeline'
import { AdminPriorityStrip } from './admin-priority-strip'

type AdminDashboardProps = {
  data: DashboardPayload
  t: Messages
}

export function AdminDashboard({ data, t }: AdminDashboardProps) {
  const { adminStats, deals, profile } = data
  if (!adminStats) return null

  const vm = buildDashboardViewModel(t, data)

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-8 px-4 py-8">
      <AdminCommandHero welcome={vm.welcome} roleLabel={vm.roleLabel} t={t} />

      <AdminPriorityStrip stats={adminStats} t={t} />

      <AdminPipeline stats={adminStats} t={t} />

      <AdminOperationsGrid t={t} />

      <div className="min-w-0">
        <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {t.adminDashboard.sectionDeals}
        </h2>
        <DashboardDealsPanel
          userType={profile.userType}
          deals={deals}
          totalCount={adminStats.totalDeals}
          viewAllHref={vm.dealsViewAllHref}
          statusLabels={vm.statusLabels}
          labels={vm.dealsLabels}
          columns={vm.dealsColumns}
        />
      </div>
    </div>
  )
}
