import {
  Building2,
  DollarSign,
  Landmark,
  Package,
  ShieldCheck,
  TrendingUp,
  Unlock,
  Users,
} from 'lucide-react'
import { DashboardStatTile } from '@/components/dashboard/dashboard-stat-tile'
import { formatCurrency } from '@/lib/format'
import { getRoleTheme } from '@/lib/dashboard/role-theme'
import type { AdminStats } from '@/lib/dashboard/types'
import type { Messages } from '@/lib/i18n/dictionaries'
import { cn } from '@/lib/utils'

type AdminKpiGridProps = {
  stats: AdminStats
  t: Messages
}

export function AdminKpiGrid({ stats, t }: AdminKpiGridProps) {
  const m = t.adminDashboard
  const theme = getRoleTheme('admin')
  const dealStatus = t.dealStatus as Record<string, string>

  const platformTiles = [
    { label: m.totalVolume, value: formatCurrency(stats.totalVolume), icon: DollarSign },
    { label: m.activeVolume, value: formatCurrency(stats.activeVolume), icon: TrendingUp },
    { label: t.deals.totalDeals, value: stats.totalDeals, icon: Package },
    { label: dealStatus.seeking_funding, value: stats.seekingFunding, icon: TrendingUp },
    { label: t.deals.active, value: stats.activeDeals, icon: Package },
    { label: t.deals.completed, value: stats.completedDeals, icon: Package },
  ]

  const opsTiles = [
    {
      label: m.pendingEscrow,
      value: stats.pendingEscrowApprovals,
      icon: ShieldCheck,
      highlight: stats.pendingEscrowApprovals > 0,
      footer: stats.pendingEscrowApprovals > 0 ? t.dashboard.reviewNow : undefined,
    },
    {
      label: m.releaseQueue,
      value: stats.releaseQueue,
      icon: Unlock,
      highlight: stats.releaseQueue > 0,
    },
    { label: m.escrowDeals, value: stats.escrowDeals, icon: Landmark },
    { label: m.usersPymes, value: stats.pymeCount, icon: Building2 },
    { label: m.usersInvestors, value: stats.investorCount, icon: Users },
    { label: m.usersSuppliers, value: stats.supplierCount, icon: Users },
  ]

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {m.sectionPlatform}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {platformTiles.map((tile) => (
            <DashboardStatTile
              key={tile.label}
              label={tile.label}
              value={tile.value}
              icon={tile.icon}
              iconClassName={theme.statIcon}
            />
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {m.sectionOperations}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {opsTiles.map((tile) => (
            <DashboardStatTile
              key={tile.label}
              label={tile.label}
              value={tile.value}
              icon={tile.icon}
              iconClassName={cn(theme.statIcon, tile.highlight && 'text-amber-600 dark:text-amber-400')}
              highlight={tile.highlight}
              footer={tile.footer}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
