'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Layers, Waves } from 'lucide-react'
import { CopyableCodeLine } from '@/components/admin/copyable-code-line'
import { DashboardStatTile } from '@/components/dashboard/dashboard-stat-tile'
import { MercatoVaultActions } from '@/components/dashboard/mercato-vault-actions'
import {
  StellarMark,
  TokenAvatar,
  VaultSectionHeader,
} from '@/components/dashboard/vault-ui'
import {
  formatCompactCurrency,
  getPrimarySupplyAsset,
} from '@/lib/defindex/vault-display'
import { flattenStrategyRows, type FlatStrategyRow } from '@/lib/defindex/vault-strategies'
import { formatCurrency, formatPercent } from '@/lib/format'
import type { MercatoVaultMeta } from '@/hooks/useDefindex'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity, Landmark, TrendingUp, User } from 'lucide-react'

const INITIAL_STRATEGY_LIMIT = 6

type VaultDetailViewProps = {
  vaultMeta: MercatoVaultMeta | null
  isLoadingVault: boolean
  vaultInfoError: string | null
  walletBalance: number
  walletRawBalance?: number
  vaultBalance: number
  vaultRawBalance?: number
  canSignTransactions: boolean
  walletAddress: string | undefined
  isLoadingBalances: boolean
  depositToVault: (...args: unknown[]) => Promise<unknown>
  withdrawFromVault: (...args: unknown[]) => Promise<unknown>
  onRefreshBalances?: () => Promise<unknown>
  onBack: () => void
  initialTab?: 'deposit' | 'withdraw'
}

export function VaultDetailView({
  vaultMeta,
  isLoadingVault,
  vaultInfoError,
  walletBalance,
  walletRawBalance,
  vaultBalance,
  vaultRawBalance,
  canSignTransactions,
  walletAddress,
  isLoadingBalances,
  depositToVault,
  withdrawFromVault,
  onRefreshBalances,
  onBack,
  initialTab = 'deposit',
}: VaultDetailViewProps) {
  const supply = getPrimarySupplyAsset(vaultMeta)
  const tvl = vaultMeta?.totals?.tvlDisplay ?? 0
  const apy = vaultMeta?.apy ?? 0
  const hasApy = Number.isFinite(apy) && apy > 0
  const assetCount = vaultMeta?.assetRows?.length ?? vaultMeta?.assets?.length ?? 0

  const allStrategyRows = useMemo(
    () => flattenStrategyRows(vaultMeta?.assetRows ?? []),
    [vaultMeta?.assetRows],
  )
  const [showAll, setShowAll] = useState(false)
  const hasMore = allStrategyRows.length > INITIAL_STRATEGY_LIMIT
  const visibleRows = showAll ? allStrategyRows : allStrategyRows.slice(0, INITIAL_STRATEGY_LIMIT)

  return (
    <div className="space-y-8 animate-mercato-slide-up-fade">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-emerald-500/30 hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Back to vaults
      </button>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_min(100%,20rem)] xl:items-start xl:gap-8">
        <div className="min-w-0 space-y-5 sm:space-y-6">
          <header className="space-y-4">
            <div className="flex flex-wrap items-start gap-4">
              <TokenAvatar symbol={supply.symbol} size="xl" />
              <div className="min-w-0 flex-1">
                {isLoadingVault && !vaultMeta ? (
                  <Skeleton className="h-10 w-72 max-w-full" />
                ) : (
                  <h2 className="line-clamp-2 font-display text-2xl font-normal tracking-tight sm:text-3xl md:text-4xl">
                    {vaultMeta?.name ?? 'Mercato Vault'}
                  </h2>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StellarMark />
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
                    Mercato
                  </Badge>
                </div>
                {vaultMeta && (
                  <div className="mt-3 flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                    <CopyableCodeLine
                      value={vaultMeta.vaultAddress}
                      label="vault contract"
                      className="min-w-0 w-full sm:max-w-md sm:flex-1"
                    />
                    {vaultMeta.explorerContractUrl && (
                      <Button variant="outline" size="sm" className="h-8 rounded-lg" asChild>
                        <Link href={vaultMeta.explorerContractUrl} target="_blank" rel="noreferrer">
                          Explorer
                          <ExternalLink className="ml-1.5 h-3 w-3" aria-hidden />
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </header>

          {vaultInfoError && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {vaultInfoError}
            </div>
          )}

          {isLoadingVault && !vaultMeta ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <DashboardStatTile
                label="TVL"
                value={formatCompactCurrency(tvl)}
                icon={Landmark}
                iconClassName="text-emerald-600 dark:text-emerald-400"
              />
              <DashboardStatTile
                label="APY"
                value={hasApy ? formatPercent(apy, { maxFractionDigits: 2 }) : '—'}
                icon={TrendingUp}
                iconClassName="text-emerald-600 dark:text-emerald-400"
              />
              <DashboardStatTile
                label="Supply asset"
                value={supply.symbol}
                icon={Activity}
                footer={supply.name}
              />
              <DashboardStatTile label="Created by" value="Mercato" icon={User} />
            </div>
          )}

          <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5 md:p-6">
            <VaultSectionHeader title="Vault description" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {assetCount > 0
                ? `Vault with ${assetCount} underlying asset${assetCount === 1 ? '' : 's'}. Deposit ${supply.symbol} to earn yield through DeFindex strategies on Stellar.`
                : `Deposit ${supply.symbol} to earn yield through DeFindex strategies on Stellar.`}
            </p>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5 md:p-6">
            <VaultSectionHeader
              title="Liquidity"
              icon={Waves}
              description="Liquidity depends on underlying strategies and vault rules. Withdrawals may be subject to strategy capacity and idle cash in the vault."
            />
            {vaultMeta?.totals && vaultMeta.totals.tvlDisplay > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                <LiquidityPill label="Idle" value={formatCurrency(vaultMeta.totals.idleDisplay)} />
                <LiquidityPill
                  label="Invested"
                  value={formatCurrency(vaultMeta.totals.investedDisplay)}
                />
              </div>
            )}
          </section>

          <section>
            <VaultSectionHeader
              title="Strategy allocations"
              icon={Layers}
              description="Amounts deployed per strategy contract."
            />

            {isLoadingVault && !vaultMeta?.assetRows?.length ? (
              <Skeleton className="h-36 w-full rounded-2xl" />
            ) : !vaultMeta?.assetRows?.length ? (
              <p className="rounded-2xl border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
                No strategy data available yet.
              </p>
            ) : (
              <div className="space-y-3">
                {visibleRows.map((row) => (
                  <StrategyCard key={`${row.asset.address}-${row.strategy.address}`} row={row} />
                ))}
                {hasMore && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl"
                    onClick={() => setShowAll((prev) => !prev)}
                  >
                    {showAll
                      ? 'Show fewer'
                      : `Show all ${allStrategyRows.length} strategies`}
                  </Button>
                )}
              </div>
            )}
          </section>
        </div>

        <div className="min-w-0 xl:sticky xl:top-6">
          <MercatoVaultActions
            vaultMeta={vaultMeta}
            walletBalance={walletBalance}
            walletRawBalance={walletRawBalance}
            vaultBalance={vaultBalance}
            vaultRawBalance={vaultRawBalance}
            canSignTransactions={canSignTransactions}
            walletAddress={walletAddress}
            isLoadingBalances={isLoadingBalances}
            depositToVault={depositToVault}
            withdrawFromVault={withdrawFromVault}
            onRefreshBalances={onRefreshBalances}
            initialTab={initialTab}
            variant="panel"
          />
        </div>
      </div>
    </div>
  )
}

function StrategyCard({ row }: { row: FlatStrategyRow }) {
  const { asset, strategy } = row
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="flex min-w-0 flex-col gap-3 border-b border-border/50 bg-muted/20 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:px-5 sm:py-4">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{strategy.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Asset · {asset.symbol}
          </p>
        </div>
        <div className="shrink-0 sm:text-right">
          <p className="font-display text-lg tabular-nums tracking-tight sm:text-xl">
            {formatCompactCurrency(strategy.allocatedDisplay)}
          </p>
          {strategy.paused && (
            <Badge
              variant="secondary"
              className="mt-1 bg-amber-500/15 text-amber-800 dark:text-amber-200"
            >
              Paused
            </Badge>
          )}
        </div>
      </div>
      <div className="min-w-0 px-4 py-3 sm:px-5">
        <CopyableCodeLine value={strategy.address} label="strategy contract" />
      </div>
    </div>
  )
}

function LiquidityPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[7.5rem] flex-1 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 sm:flex-none">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-semibold tabular-nums">{value}</p>
    </div>
  )
}
