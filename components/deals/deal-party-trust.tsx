'use client'

import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDecimal } from '@/lib/format'
import { getTrustTier } from '@/lib/reputation-score'
import type { Reputation } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n/provider'

type PartyTrustProps = {
  roleLabel: string
  name: string
  href?: string
  reputation: Reputation | null
  /** Deal-level stake (e.g. PyME skin in the game on this deal) */
  dealStake?: number
  loading?: boolean
}

function PartyTrustCard({
  roleLabel,
  name,
  href,
  reputation,
  dealStake,
  loading,
}: PartyTrustProps) {
  const { t } = useI18n()
  const score = reputation?.reputationScore ?? reputation?.score ?? 0
  const tier = getTrustTier(score)
  const tierLabel = t(`dealDetail.trustTier.${tier.label}`)
  const deals = reputation?.dealsCompleted ?? 0
  const repaymentPct = Math.round((reputation?.repaymentPerformance ?? 0) * 100)
  const stake = Math.max(dealStake ?? 0, reputation?.stakeAmount ?? 0)

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 px-4 py-3 animate-pulse">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="mt-2 h-5 w-32 rounded bg-muted" />
        <div className="mt-2 h-3 w-24 rounded bg-muted" />
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-muted/20 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {roleLabel}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {href ? (
          <Link href={href} className="font-semibold hover:underline">
            {name}
          </Link>
        ) : (
          <span className="font-semibold">{name}</span>
        )}
        <Badge variant="secondary" className={cn('gap-1 capitalize', tier.color)}>
          <span className={cn('inline-block h-1.5 w-1.5 rounded-full', tier.dotClass)} />
          {tierLabel}
        </Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {t('dealDetail.partyScore', { score: formatDecimal(score) })}
        </span>
        {deals > 0 ? (
          <>
            {' · '}
            {t('dealDetail.partyDealsRepayment', { deals, repayment: repaymentPct })}
          </>
        ) : (
          <>
            {' · '}
            {t('dealDetail.partyNoDealsYet')}
          </>
        )}
        {stake > 0 && (
          <>
            {' · '}
            {t('dealDetail.partyStake', { amount: formatCurrency(stake) })}
          </>
        )}
      </p>
    </div>
  )
}

type DealPartyTrustProps = {
  pymeName: string
  pymeId?: string
  pymeReputation: Reputation | null
  pymeStake?: number
  pymeLoading?: boolean
  supplierName: string
  supplierId?: string
  supplierReputation: Reputation | null
  supplierLoading?: boolean
}

export function DealPartyTrust({
  pymeName,
  pymeId,
  pymeReputation,
  pymeStake,
  pymeLoading,
  supplierName,
  supplierId,
  supplierReputation,
  supplierLoading,
}: DealPartyTrustProps) {
  const { t } = useI18n()

  return (
    <div className="mt-5">
      <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
        {t('dealDetail.partyTrustTitle')}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <PartyTrustCard
          roleLabel={t('dealDetail.partyPyme')}
          name={pymeName}
          href={pymeId ? `/pymes/${pymeId}` : undefined}
          reputation={pymeReputation}
          dealStake={pymeStake}
          loading={pymeLoading}
        />
        <PartyTrustCard
          roleLabel={t('dealDetail.partySupplier')}
          name={supplierName}
          href={supplierId ? `/suppliers/${supplierId}` : undefined}
          reputation={supplierReputation}
          loading={supplierLoading}
        />
      </div>
    </div>
  )
}
