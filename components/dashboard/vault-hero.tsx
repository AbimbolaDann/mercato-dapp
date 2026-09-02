'use client'

import { TrendingUp } from 'lucide-react'
import { DefindexPill, StellarMark } from '@/components/dashboard/vault-ui'
import { formatCompactCurrency } from '@/lib/defindex/vault-display'
import { formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'

type VaultHeroProps = {
  tvl?: number
  apy?: number
  supplySymbol?: string
  isLoading?: boolean
}

export function VaultHero({ tvl, apy, supplySymbol = 'USDC', isLoading }: VaultHeroProps) {
  const hasApy = apy != null && Number.isFinite(apy) && apy > 0
  const hasTvl = tvl != null && Number.isFinite(tvl) && tvl > 0

  return (
    <section className="hero-ref relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-50/90 via-background to-brand-ultra/80 shadow-sm dark:from-emerald-950/30 dark:via-background dark:to-brand-dark/10">
      <div
        className="hero-glow pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full blur-3xl"
        aria-hidden
      />
      <div
        className="hero-glow-b pointer-events-none absolute -bottom-16 right-0 h-48 w-48 rounded-full blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.12]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.08) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden
      />

      <div className="relative grid gap-6 px-5 py-6 sm:px-6 sm:py-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8 md:px-8">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-1.5 sm:mb-4 sm:gap-2">
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-800 ring-1 ring-emerald-500/20 dark:text-emerald-300 sm:text-[11px]">
              <TrendingUp className="h-3 w-3" aria-hidden />
              Earn yield
            </span>
            <StellarMark className="shrink-0" />
            <DefindexPill className="shrink-0" />
          </div>

          <h1 className="font-display text-2xl font-normal leading-tight tracking-tight text-foreground sm:text-3xl md:text-[2.75rem]">
            Vaults
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-base">
            Put {supplySymbol} to work in the Mercato DeFindex vault — automated strategies on
            Stellar with transparent allocations.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-2 sm:gap-3 md:w-[15.5rem] md:shrink-0">
          <HeroStat
            label="TVL"
            value={hasTvl ? formatCompactCurrency(tvl) : '—'}
            isLoading={isLoading}
          />
          <HeroStat
            label="APY"
            value={hasApy ? formatPercent(apy, { maxFractionDigits: 2 }) : '—'}
            isLoading={isLoading}
            accent={hasApy}
          />
        </div>
      </div>
    </section>
  )
}

function HeroStat({
  label,
  value,
  isLoading,
  accent,
}: {
  label: string
  value: string
  isLoading?: boolean
  accent?: boolean
}) {
  return (
    <div className="glass-strong flex min-h-[4.75rem] min-w-0 flex-col justify-center rounded-xl px-3 py-2.5 sm:rounded-2xl sm:px-4 sm:py-3">
      <p className="truncate text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground sm:text-[10px]">
        {label}
      </p>
      <p
        className={cn(
          'mt-0.5 truncate font-display text-xl tabular-nums tracking-tight sm:text-2xl',
          accent && 'text-emerald-600 dark:text-emerald-400',
          isLoading && 'animate-pulse text-muted-foreground/50',
        )}
      >
        {isLoading ? '···' : value}
      </p>
    </div>
  )
}
