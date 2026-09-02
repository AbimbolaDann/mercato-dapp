import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { WalletStatusCard } from '@/components/wallet/wallet-status-card'
import { getServerDictionary } from '@/lib/i18n/server'

export default async function DashboardWalletsPage() {
  const t = await getServerDictionary()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <DashboardPageHeader
        title={t.dashboardNav.wallets}
        description={t.dashboardNav.walletsDescription}
      />
      <WalletStatusCard />
    </div>
  )
}
