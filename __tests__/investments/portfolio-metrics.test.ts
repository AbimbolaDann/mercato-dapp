import { describe, expect, test } from 'bun:test'
import { buildInvestorPortfolio } from '@/lib/investments/portfolio-metrics'
import type { InvestorDeal } from '@/lib/investments/types'

function makeDeal(overrides: Partial<InvestorDeal> = {}): InvestorDeal {
  return {
    id: overrides.id ?? 'deal-1',
    title: 'Test Deal',
    product_name: 'Widgets',
    status: 'funded',
    amount: 10_000,
    interest_rate: 5,
    term_days: 30,
    created_at: '2026-01-01T00:00:00Z',
    funded_at: '2026-01-01T00:00:00Z',
    pyme_id: 'pyme-1',
    escrow_contract_address: null,
    pyme: { company_name: 'Test PyME' },
    ...overrides,
  }
}

function baseSummary(overrides: Record<string, unknown> = {}) {
  return {
    total_deployed: 500_000,
    active_capital: 100_000,
    completed_principal: 400_000,
    pending_yield_at_maturity: 5_000,
    accrued_yield: 2_000,
    realized_yield: 20_000,
    weighted_apr: 5,
    deal_count: 250,
    active_count: 3,
    completed_count: 247,
    open_escrows_by_smb: { 'pyme-1': 4 },
    ...overrides,
  }
}

describe('buildInvestorPortfolio', () => {
  test('KPI totals reflect the DB summary, independent of the fetched history page', () => {
    const portfolio = buildInvestorPortfolio({
      activeDeals: [makeDeal({ status: 'funded', pyme_id: 'pyme-1' })],
      historyDeals: [makeDeal({ id: 'deal-2', status: 'completed' })], // only 1 of 247 fetched
      historyTotal: 247,
      page: 1,
      pageSize: 10,
      summary: baseSummary(),
      displayName: 'Test',
      smbFallback: 'SMB',
      dealFallbackTitle: 'Deal',
    })

    expect(portfolio.metrics.dealCount).toBe(250) // full-history count, not page size
    expect(portfolio.metrics.completedPrincipal).toBe(400_000)
    expect(portfolio.active[0].openEscrowsWithSmb).toBe(4) // grouped count, not fetched rows
    expect(portfolio.metrics.netReturnPercent).toBeCloseTo((20_000 / 400_000) * 100)
  })

  test('hasMore is true when more history pages remain', () => {
    const portfolio = buildInvestorPortfolio({
      activeDeals: [],
      historyDeals: [makeDeal({ status: 'completed' })],
      historyTotal: 35,
      page: 1,
      pageSize: 10,
      summary: baseSummary({ deal_count: 35, active_count: 0, completed_count: 35 }),
      displayName: null,
      smbFallback: 'SMB',
      dealFallbackTitle: 'Deal',
    })

    expect(portfolio.history.hasMore).toBe(true)
  })

  test('hasMore is false on the last page', () => {
    const portfolio = buildInvestorPortfolio({
      activeDeals: [],
      historyDeals: [makeDeal({ status: 'completed' })],
      historyTotal: 35,
      page: 4,
      pageSize: 10,
      summary: baseSummary({ deal_count: 35, active_count: 0, completed_count: 35 }),
      displayName: null,
      smbFallback: 'SMB',
      dealFallbackTitle: 'Deal',
    })

    expect(portfolio.history.hasMore).toBe(false)
  })

  test('open escrow counts come entirely from the grouped summary, not fetched deal rows', () => {
    const portfolio = buildInvestorPortfolio({
      activeDeals: [
        makeDeal({ id: 'a1', pyme_id: 'pyme-1' }),
        makeDeal({ id: 'a2', pyme_id: 'pyme-2' }),
      ],
      historyDeals: [],
      historyTotal: 0,
      page: 1,
      pageSize: 10,
      summary: baseSummary({ open_escrows_by_smb: { 'pyme-1': 4, 'pyme-2': 1 } }),
      displayName: null,
      smbFallback: 'SMB',
      dealFallbackTitle: 'Deal',
    })

    expect(portfolio.active.find((d) => d.pyme_id === 'pyme-1')?.openEscrowsWithSmb).toBe(4)
    expect(portfolio.active.find((d) => d.pyme_id === 'pyme-2')?.openEscrowsWithSmb).toBe(1)
  })
})
