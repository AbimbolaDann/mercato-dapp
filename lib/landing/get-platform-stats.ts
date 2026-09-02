import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { LandingPlatformStats } from '@/lib/landing/platform-stats'

export type { LandingPlatformStats } from '@/lib/landing/platform-stats'

const FUNDED_STATUSES = ['funded', 'in_progress', 'completed'] as const
const ACTIVE_SME_STATUSES = ['funded', 'in_progress'] as const

function monthBounds() {
  const now = new Date()
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return {
    thisMonthIso: startOfThisMonth.toISOString(),
    lastMonthIso: startOfLastMonth.toISOString(),
  }
}

function sumFundedAmounts(
  rows: { amount: number | string | null; funded_at: string | null }[] | null,
  fromIso: string,
  toIso?: string,
) {
  let total = 0
  for (const row of rows ?? []) {
    const fundedAt = row.funded_at
    if (!fundedAt) continue
    const at = new Date(fundedAt).getTime()
    if (at < new Date(fromIso).getTime()) continue
    if (toIso && at >= new Date(toIso).getTime()) continue
    total += Number(row.amount ?? 0)
  }
  return total
}

async function fetchLandingPlatformStats(): Promise<LandingPlatformStats> {
  const empty: LandingPlatformStats = {
    ordersFunded: 0,
    openForFunding: 0,
    activeSmes: 0,
    smesWithActiveDeals: 0,
    verifiedSuppliers: 0,
    supplierCountries: 0,
    capitalMobilized: 0,
    capitalFundedThisMonth: 0,
    capitalMonthGrowthPercent: null,
  }

  try {
    const supabase = await createClient()
    const { thisMonthIso, lastMonthIso } = monthBounds()

    const [
      { count: ordersFunded },
      { count: openForFunding },
      { data: pymeDealRows },
      { data: activePymeRows },
      { count: verifiedSuppliers },
      { data: supplierCountryRows },
      { data: volumeRows },
      { data: fundedAtRows },
    ] = await Promise.all([
      supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .in('status', [...FUNDED_STATUSES]),
      supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'seeking_funding'),
      supabase.from('deals').select('pyme_id'),
      supabase.from('deals').select('pyme_id').in('status', [...ACTIVE_SME_STATUSES]),
      supabase.from('supplier_companies').select('*', { count: 'exact', head: true }),
      supabase.from('supplier_companies').select('country'),
      supabase.from('deals').select('amount').in('status', [...FUNDED_STATUSES]),
      supabase
        .from('deals')
        .select('amount, funded_at')
        .in('status', [...FUNDED_STATUSES])
        .not('funded_at', 'is', null)
        .gte('funded_at', lastMonthIso),
    ])

    const activeSmes = new Set(
      (pymeDealRows ?? []).map((r) => r.pyme_id).filter(Boolean),
    ).size
    const smesWithActiveDeals = new Set(
      (activePymeRows ?? []).map((r) => r.pyme_id).filter(Boolean),
    ).size

    const supplierCountries = new Set(
      (supplierCountryRows ?? [])
        .map((r) => r.country?.trim())
        .filter((c): c is string => Boolean(c)),
    ).size

    const capitalMobilized = (volumeRows ?? []).reduce(
      (sum, row) => sum + Number(row.amount ?? 0),
      0,
    )

    const capitalFundedThisMonth = sumFundedAmounts(fundedAtRows, thisMonthIso)
    const capitalFundedLastMonth = sumFundedAmounts(
      fundedAtRows,
      lastMonthIso,
      thisMonthIso,
    )

    let capitalMonthGrowthPercent: number | null = null
    if (capitalFundedLastMonth > 0) {
      capitalMonthGrowthPercent =
        ((capitalFundedThisMonth - capitalFundedLastMonth) / capitalFundedLastMonth) * 100
    } else if (capitalFundedThisMonth > 0) {
      capitalMonthGrowthPercent = 100
    }

    return {
      ordersFunded: ordersFunded ?? 0,
      openForFunding: openForFunding ?? 0,
      activeSmes,
      smesWithActiveDeals,
      verifiedSuppliers: verifiedSuppliers ?? 0,
      supplierCountries,
      capitalMobilized,
      capitalFundedThisMonth,
      capitalMonthGrowthPercent,
    }
  } catch (e) {
    console.error('[getLandingPlatformStats]', e)
    return empty
  }
}

export const getLandingPlatformStats = cache(fetchLandingPlatformStats)
