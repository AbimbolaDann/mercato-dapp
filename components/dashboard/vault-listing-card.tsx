'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DefindexPill, StellarMark, TokenAvatar } from '@/components/dashboard/vault-ui'
import { formatPercent } from '@/lib/format'
import {
  formatCompactCurrency,
  getPrimarySupplyAsset,
  truncateContractAddress,
} from '@/lib/defindex/vault-display'
import type { MercatoVaultMeta } from '@/hooks/useDefindex'
import { cn } from '@/lib/utils'

type VaultListingCardProps = {
  vaultMeta: MercatoVaultMeta | null
  isLoading: boolean
  onOpen: () => void
  onDeposit: () => void
}

export function VaultListingCard({
  vaultMeta,
  isLoading,
  onOpen,
  onDeposit,
}: VaultListingCardProps) {
  const supply = getPrimarySupplyAsset(vaultMeta)
  const tvl = vaultMeta?.totals?.tvlDisplay ?? 0
  const apy = vaultMeta?.apy ?? 0
  const hasApy = Number.isFinite(apy) && apy > 0

  if (isLoading && !vaultMeta) {
    return <Skeleton className="h-64 w-full max-w-xl rounded-2xl" />
  }

  if (!vaultMeta) {
    return (
      <div className="w-full max-w-xl rounded-2xl border border-dashed border-border/80 bg-card/50 p-8 text-center">
        <p className="text-sm font-medium text-foreground">Vault not configured</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact your administrator to deploy the Mercato vault.
        </p>
      </div>
    )
  }

  return (
    <article className="w-full max-w-xl overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow hover:border-emerald-500/20 hover:shadow-md">
      {/* Identity */}
      <div className="border-b border-border/60 bg-muted/15 px-5 py-4">
        <div className="flex gap-3">
          <TokenAvatar symbol={supply.symbol} size="lg" className="mt-0.5" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
              <h3 className="line-clamp-2 min-w-0 flex-1 text-base font-semibold leading-snug text-foreground">
                {vaultMeta.name}
              </h3>
              <Badge
                variant="secondary"
                className="shrink-0 bg-emerald-500/10 text-[11px] text-emerald-700 dark:text-emerald-300"
              >
                Lending
              </Badge>
            </div>
            <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
              {truncateContractAddress(vaultMeta.vaultAddress, 8, 6)}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Supply {supply.symbol} on Stellar
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <StellarMark />
          <DefindexPill />
        </div>
      </div>

      {/* Metrics + actions */}
      <div className="px-5 py-4">
        <p className="text-xs text-muted-foreground">
          Created by <span className="font-medium text-foreground">Mercato</span>
        </p>

        <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-xl border border-border/60 bg-muted/10">
          <StatCell label="TVL" value={formatCompactCurrency(tvl)} />
          <StatCell
            label="APY"
            value={hasApy ? formatPercent(apy, { maxFractionDigits: 2 }) : '—'}
            accent={hasApy}
            bordered
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            type="button"
            className="h-10 rounded-xl bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            onClick={onDeposit}
          >
            Deposit
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl text-sm font-medium"
            onClick={onOpen}
          >
            Details
          </Button>
        </div>
      </div>
    </article>
  )
}

function StatCell({
  label,
  value,
  accent,
  bordered,
}: {
  label: string
  value: string
  accent?: boolean
  bordered?: boolean
}) {
  return (
    <div
      className={cn(
        'px-4 py-3.5',
        bordered && 'border-l border-border/60',
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          'mt-1 text-lg font-semibold tabular-nums tracking-tight',
          accent ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground',
        )}
      >
        {value}
      </p>
    </div>
  )
}
