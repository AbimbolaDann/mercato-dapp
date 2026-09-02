import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PortfolioHero } from '@/components/investments/portfolio-hero'
import { PortfolioKpis } from '@/components/investments/portfolio-kpis'
import { PortfolioAllocation } from '@/components/investments/portfolio-allocation'
import { PortfolioMaturities } from '@/components/investments/portfolio-maturities'
import { InvestmentsPositions, type PositionsTab } from '@/components/investments/investments-positions'
import { InvestmentsEmpty } from '@/components/investments/investments-empty'
import type { InvestorPortfolio } from '@/lib/investments/types'
import type { Messages } from '@/lib/i18n/dictionaries'

type InvestmentsDashboardProps = {
  portfolio: InvestorPortfolio
  tab: PositionsTab
  t: Messages
}

function parseTab(raw: string | undefined): PositionsTab {
  if (raw === 'active' || raw === 'completed' || raw === 'other') return raw
  return 'all'
}

export function parseInvestmentsTab(raw: string | undefined): PositionsTab {
  return parseTab(raw)
}

export function InvestmentsDashboard({ portfolio, tab, t }: InvestmentsDashboardProps) {
  const m = t.investments
  const statusLabel = (status: string) => {
    const labels = t.dealStatus as Record<string, string>
    return labels[status] ?? status.replace(/_/g, ' ')
  }

  const kpiLabels = {
    totalDeployed: m.totalDeployed,
    activeCapital: m.activeCapital,
    accruedYield: m.accruedYield,
    pendingYield: m.pendingYield,
    realizedYield: m.realizedYieldShort,
    weightedApr: m.weightedAprShort,
    dealsTotal: m.dealsTotal,
    dealsTotalPlural: m.dealsTotalPlural,
    activeDealsLine: m.activeDealsLine,
    activeDealsLinePlural: m.activeDealsLinePlural,
    accruedHint: m.accruedHint,
    pendingYieldHint: m.pendingYieldHint,
    completedDealsLine: m.completedDealsLine,
    completedDealsLinePlural: m.completedDealsLinePlural,
    acrossPortfolio: m.acrossPortfolio,
  }

  const cardLabels = {
    smbPrefix: m.smbPrefix,
    fundedOn: m.fundedOn,
    amount: m.amount,
    usdcInEscrow: m.usdcInEscrow,
    expectedYield: m.expectedYield,
    atMaturity: m.atMaturity,
    accruedToDate: m.accruedToDate,
    accruedHint: m.accruedToDateHint,
    apr: m.apr,
    dayTerm: m.dayTerm,
    openEscrows: m.openEscrows,
    openEscrowsThisOnly: m.openEscrowsThisOnly,
    openEscrowsSameSmb: m.openEscrowsSameSmb,
    termProgress: m.termProgress,
    daysRemaining: m.daysRemaining,
    maturedOn: m.maturedOn,
    maturesOn: m.maturesOn,
    progressEmDash: m.progressEmDash,
    securedOnChain: m.securedOnChain,
    viewDeal: m.viewDeal,
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
        <PortfolioHero
          portfolio={portfolio}
          labels={{
            hubLabel: m.hubLabel,
            titlePossessive: m.titlePossessive,
            titleDefault: m.titleDefault,
            subtitle: m.subtitle,
            portfolioValue: m.portfolioValue,
            totalReturn: m.totalReturn,
            browseDeals: m.browseDeals,
            activePositions: m.activePositions,
          }}
        />

        {portfolio.metrics.dealCount === 0 ? (
          <InvestmentsEmpty
            labels={{
              emptyTitle: m.emptyTitle,
              emptyDescription: m.emptyDescription,
              browseDeals: m.browseDeals,
            }}
          />
        ) : (
          <>
            <PortfolioKpis portfolio={portfolio} labels={kpiLabels} />

            <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/15 bg-emerald-50/40 px-4 py-3 dark:bg-emerald-950/20">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{m.securityLead}</span> {m.securityBody}
              </p>
            </div>

            <div className="grid gap-8 xl:grid-cols-12">
              <div className="space-y-6 xl:col-span-4">
                <PortfolioAllocation
                  slices={portfolio.allocation}
                  labels={{
                    title: m.allocationTitle,
                    subtitle: m.allocationSubtitle,
                    empty: m.allocationEmpty,
                    dealsCount: m.allocationDealsCount,
                    other: m.allocationOther,
                  }}
                />
                <PortfolioMaturities
                  events={portfolio.maturities}
                  labels={{
                    title: m.maturitiesTitle,
                    subtitle: m.maturitiesSubtitle,
                    empty: m.maturitiesEmpty,
                    principal: m.amount,
                    yield: m.expectedYield,
                    daysUntil: m.daysUntilMaturity,
                    overdue: m.maturityOverdue,
                    today: m.maturityToday,
                  }}
                />
              </div>

              <div className="xl:col-span-8">
                <InvestmentsPositions
                  portfolio={portfolio}
                  tab={tab}
                  statusLabel={statusLabel}
                  labels={{
                    tabAll: m.tabAll,
                    tabActive: m.tabActive,
                    tabCompleted: m.tabCompleted,
                    tabOther: m.tabOther,
                    tabEmpty: m.tabEmpty,
                    activeHeading: m.activeHeading,
                    completedHeading: m.completedHeading,
                    otherHeading: m.otherHeading,
                    yieldEarned: m.yieldEarned,
                    completedBadge: m.completedBadge,
                    viewDeal: m.viewDeal,
                    card: cardLabels,
                  }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card px-5 py-4 shadow-sm">
              <div>
                <p className="text-sm font-semibold">{m.ctaTitle}</p>
                <p className="text-xs text-muted-foreground">{m.ctaSubtitle}</p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href="/deals">
                  {m.browseDealsOutline}
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </>
        )}
    </div>
  )
}
