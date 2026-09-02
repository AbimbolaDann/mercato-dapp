import Link from 'next/link'
import {
  ArrowRight,
  CalendarClock,
  Lock,
  Package,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/date-utils'
import { formatInvestUsd } from '@/lib/investments/portfolio-metrics'
import type { EnrichedInvestorDeal } from '@/lib/investments/types'
import { cn } from '@/lib/utils'

function tr(template: string, vars: Record<string, string | number>) {
  return Object.entries(vars).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), template)
}

type ActiveInvestmentCardProps = {
  deal: EnrichedInvestorDeal
  statusLabel: string
  labels: {
    smbPrefix: string
    fundedOn: string
    amount: string
    usdcInEscrow: string
    expectedYield: string
    atMaturity: string
    accruedToDate: string
    accruedHint: string
    apr: string
    dayTerm: string
    openEscrows: string
    openEscrowsThisOnly: string
    openEscrowsSameSmb: string
    termProgress: string
    daysRemaining: string
    maturedOn: string
    maturesOn: string
    progressEmDash: string
    securedOnChain: string
    viewDeal: string
  }
}

export function ActiveInvestmentCard({ deal, statusLabel, labels }: ActiveInvestmentCardProps) {
  const { percent, daysRemaining, maturityDate } = deal.termProgress
  const progressPct = Math.round(percent * 100)

  return (
    <article className="overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-card via-card to-emerald-50/30 shadow-sm dark:to-emerald-950/10">
      <div className="border-b border-border/60 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
              <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-snug">{deal.displayTitle}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {labels.smbPrefix} {deal.smbName}
                {deal.funded_at &&
                  ` · ${tr(labels.fundedOn, { date: formatDate(deal.funded_at) })}`}
              </p>
            </div>
          </div>
          <Badge className="border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            {statusLabel}
          </Badge>
        </div>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCell label={labels.amount} value={formatInvestUsd(deal.amountNum)} hint={labels.usdcInEscrow} />
        <MetricCell
          label={labels.accruedToDate}
          value={formatInvestUsd(deal.accruedYield, 2)}
          hint={labels.accruedHint}
          accent
        />
        <MetricCell
          label={labels.expectedYield}
          value={formatInvestUsd(deal.expectedYield, 2)}
          hint={labels.atMaturity}
          accent
        />
        <MetricCell
          label={labels.apr}
          value={`${deal.apr}%`}
          hint={tr(labels.dayTerm, { n: deal.termDays })}
        />
      </div>

      {deal.termDays > 0 && (
        <div className="border-t border-border/60 px-5 py-4">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-medium">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden />
              {labels.termProgress}
            </span>
            <span className="tabular-nums font-semibold text-foreground">
              {daysRemaining > 0
                ? tr(labels.daysRemaining, { n: daysRemaining })
                : maturityDate
                  ? tr(labels.maturedOn, { date: formatDate(maturityDate.toISOString()) })
                  : labels.progressEmDash}
            </span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            {maturityDate && (
              <p className="text-muted-foreground">
                {tr(labels.maturesOn, { date: formatDate(maturityDate.toISOString()) })}
              </p>
            )}
            <p className="text-muted-foreground">
              {deal.openEscrowsWithSmb <= 1 ? labels.openEscrowsThisOnly : labels.openEscrowsSameSmb}
              {' · '}
              <span className="font-medium text-foreground">{deal.openEscrowsWithSmb}</span> {labels.openEscrows}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-5 py-3">
        {deal.escrow_contract_address ? (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" aria-hidden />
            {labels.securedOnChain}
          </p>
        ) : (
          <span />
        )}
        <Button asChild size="sm" className="rounded-full bg-emerald-600 hover:bg-emerald-700">
          <Link href={`/deals/${deal.id}`}>
            {labels.viewDeal}
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </article>
  )
}

function MetricCell({
  label,
  value,
  hint,
  accent,
}: {
  label: string
  value: string
  hint?: string
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/60 bg-background/60 p-3',
        accent && 'border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20',
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p
        className={cn(
          'mt-1 text-xl font-semibold tabular-nums',
          accent && 'text-emerald-700 dark:text-emerald-400',
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
