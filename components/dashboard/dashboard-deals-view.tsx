import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DashboardDealsPanel } from '@/components/dashboard/dashboard-deals-panel'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardSupplierFilter } from '@/components/dashboard/dashboard-supplier-filter'
import { buildDashboardViewModel } from '@/lib/dashboard/build-view-model'
import type { DashboardPayload } from '@/lib/dashboard/types'
import type { Messages } from '@/lib/i18n/dictionaries'

type DashboardDealsViewProps = {
  data: DashboardPayload
  t: Messages
}

export function DashboardDealsView({ data, t }: DashboardDealsViewProps) {
  const vm = buildDashboardViewModel(t, data)
  const { profile, deals, supplierCompanies, companyFilterId } = data
  const userType = profile.userType
  const showSupplierFilter = userType === 'supplier' && supplierCompanies.length > 1

  const title =
    userType === 'admin'
      ? t.dashboard.recentPlatformDeals
      : userType === 'supplier'
        ? t.nav.activeDeals
        : t.dashboard.recentDeals

  return (
    <div className="container mx-auto max-w-7xl space-y-6 px-4 py-8">
      <DashboardPageHeader title={title} description={t.dashboardNav.dealsDescription} />

      {showSupplierFilter && (
        <DashboardSupplierFilter
          companies={supplierCompanies}
          activeCompanyId={companyFilterId}
          labels={{
            company: t.dashboard.company,
            allCompanies: t.dashboard.allCompanies,
            unnamedCompany: t.dashboard.unnamedCompany,
          }}
        />
      )}

      <DashboardDealsPanel
        userType={userType}
        deals={deals}
        totalCount={vm.totalDealsCount}
        viewAllHref={vm.dealsViewAllHref}
        statusLabels={vm.statusLabels}
        labels={vm.dealsLabels}
        columns={vm.dealsColumns}
      />

      {userType === 'pyme' && (
        <div className="flex justify-end">
          <Button asChild className="rounded-full">
            <Link href="/create-deal">
              {t.dashboard.newDeal}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
