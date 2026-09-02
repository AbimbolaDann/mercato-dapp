import {
  Activity,
  BarChart3,
  CircleDollarSign,
  Sprout,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { formatInvestUsd } from '@/lib/investments/portfolio-metrics'
import type { InvestorPortfolio } from '@/lib/investments/types'
import { cn } from '@/lib/utils'

type PortfolioKpisProps = {
  portfolio: InvestorPortfolio
  labels: {
    totalDeployed: string
    activeCapital: string
    accruedYield: string
    pendingYield: string
    realizedYield: string
    weightedApr: string
    dealsTotal: string
    dealsTotalPlural: string
    activeDealsLine: string
    activeDealsLinePlural: string
    accruedHint: string
    pendingYieldHint: string
    completedDealsLine: string
    completedDealsLinePlural: string
    acrossPortfolio: string
  }
}

function tr(template: string, vars: Record<string, string | number>) {
  return Object.entries(vars).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), template)
}

export function PortfolioKpis({ portfolio, labels }: PortfolioKpisProps) {
  const { metrics } = portfolio
  const dealCountLabel =
    metrics.dealCount === 1
      ? tr(labels.dealsTotal, { count: metrics.dealCount })
      : tr(labels.dealsTotalPlural, { count: metrics.dealCount })
  const activeLine =
    metrics.activeCount === 1
      ? tr(labels.activeDealsLine, { count: metrics.activeCount })
      : tr(labels.activeDealsLinePlural, { count: metrics.activeCount })
  const completedLine =
    metrics.completedCount === 1
      ? tr(labels.completedDealsLine, { count: metrics.completedCount })
      : tr(labels.completedDealsLinePlural, { count: metrics.completedCount })

  const tiles: Array<{
    label: string
    value: string
    footer?: string
    icon: LucideIcon
    accent?: boolean
  }> = [
    {
      label: labels.totalDeployed,
      value: formatInvestUsd(metrics.totalDeployed),
      footer: dealCountLabel,
      icon: BarChart3,
    },
    {
      label: labels.activeCapital,
      value: formatInvestUsd(metrics.activeCapital),
      footer: activeLine,
      icon: Activity,
      accent: true,
    },
    {
      label: labels.accruedYield,
      value: formatInvestUsd(metrics.accruedYield, 2),
      footer: labels.accruedHint,
      icon: Sprout,
      accent: true,
    },
    {
      label: labels.pendingYield,
      value: formatInvestUsd(metrics.pendingYieldAtMaturity, 2),
      footer: labels.pendingYieldHint,
      icon: TrendingUp,
    },
  ]

  if (metrics.completedCount > 0) {
    tiles.push({
      label: labels.realizedYield,
      value: formatInvestUsd(metrics.realizedYield, 2),
      footer: completedLine,
      icon: CircleDollarSign,
    })
  } else if (metrics.activeCount === 0 && metrics.weightedApr > 0) {
    tiles[3] = {
      label: labels.weightedApr,
      value: `${metrics.weightedApr.toFixed(1)}%`,
      footer: labels.acrossPortfolio,
      icon: TrendingUp,
    }
  }

  return (
    <div
      className={cn(
        'grid gap-3 sm:grid-cols-2',
        tiles.length >= 5 ? 'xl:grid-cols-5' : 'xl:grid-cols-4',
      )}
    >
      {tiles.map((tile) => (
        <KpiTile key={tile.label} {...tile} />
      ))}
    </div>
  )
}

function KpiTile({
  label,
  value,
  footer,
  icon: Icon,
  accent,
}: {
  label: string
  value: string
  footer?: string
  icon: LucideIcon
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-shadow hover:shadow-md',
        accent && 'border-emerald-500/25 bg-emerald-50/30 dark:border-emerald-800/30 dark:bg-emerald-950/15',
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <Icon className={cn('h-4 w-4 shrink-0 opacity-70', accent && 'text-emerald-600 dark:text-emerald-400')} aria-hidden />
      </div>
      <p
        className={cn(
          'font-display text-3xl font-normal tabular-nums tracking-tight',
          accent ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground',
        )}
      >
        {value}
      </p>
      {footer && <p className="mt-1.5 text-xs text-muted-foreground">{footer}</p>}
    </div>
  )
}
