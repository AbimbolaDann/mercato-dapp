import { describe, expect, test } from 'bun:test'
import { flattenStrategyRows } from '@/lib/defindex/vault-strategies'
import type { VaultMonitorAssetRow } from '@/lib/defindex/vault-monitor'

function makeStrategy(overrides: Partial<VaultMonitorAssetRow['strategies'][0]> = {}) {
  return {
    address: overrides.address ?? 'CSTRAT' + Math.random().toString(36).slice(2, 10).toUpperCase(),
    name: overrides.name ?? 'Strategy',
    paused: overrides.paused ?? false,
    allocatedDisplay: overrides.allocatedDisplay ?? 100,
    allocatedRaw: overrides.allocatedRaw ?? '1000000000',
  }
}

function makeAssetRow(
  overrides: Partial<VaultMonitorAssetRow> & { strategies?: VaultMonitorAssetRow['strategies'] } = {},
): VaultMonitorAssetRow {
  return {
    address: overrides.address ?? 'CASSET' + Math.random().toString(36).slice(2, 10).toUpperCase(),
    name: overrides.name ?? 'USD Coin',
    symbol: overrides.symbol ?? 'USDC',
    idleDisplay: overrides.idleDisplay ?? 0,
    investedDisplay: overrides.investedDisplay ?? 0,
    totalDisplay: overrides.totalDisplay ?? 0,
    idleRaw: overrides.idleRaw ?? '0',
    investedRaw: overrides.investedRaw ?? '0',
    totalRaw: overrides.totalRaw ?? '0',
    idlePercent: overrides.idlePercent ?? 0,
    strategies: overrides.strategies ?? [makeStrategy()],
  }
}

describe('flattenStrategyRows', () => {
  test('returns empty array for empty input', () => {
    expect(flattenStrategyRows([])).toEqual([])
  })

  test('flattens single asset with single strategy', () => {
    const strategy = makeStrategy({ name: 'Blend USDC', address: 'CBLEND001' })
    const asset = makeAssetRow({ name: 'USD Coin', symbol: 'USDC', address: 'CUSDC001', strategies: [strategy] })
    const result = flattenStrategyRows([asset])

    expect(result).toHaveLength(1)
    expect(result[0].asset).toEqual({ address: 'CUSDC001', name: 'USD Coin', symbol: 'USDC' })
    expect(result[0].strategy).toBe(strategy)
  })

  test('flattens multiple assets with multiple strategies', () => {
    const rows = [
      makeAssetRow({ strategies: [makeStrategy(), makeStrategy(), makeStrategy()] }),
      makeAssetRow({ strategies: [makeStrategy(), makeStrategy()] }),
    ]
    const result = flattenStrategyRows(rows)
    expect(result).toHaveLength(5)
  })

  test('preserves asset context on each row', () => {
    const rows = [
      makeAssetRow({ name: 'USD Coin', symbol: 'USDC', address: 'CUSDC', strategies: [makeStrategy(), makeStrategy()] }),
      makeAssetRow({ name: 'Euro Coin', symbol: 'EURC', address: 'CEURC', strategies: [makeStrategy()] }),
    ]
    const result = flattenStrategyRows(rows)

    expect(result[0].asset.symbol).toBe('USDC')
    expect(result[1].asset.symbol).toBe('USDC')
    expect(result[2].asset.symbol).toBe('EURC')
  })

  test('preserves paused status', () => {
    const paused = makeStrategy({ paused: true, name: 'Paused Strat' })
    const active = makeStrategy({ paused: false, name: 'Active Strat' })
    const result = flattenStrategyRows([makeAssetRow({ strategies: [paused, active] })])

    expect(result[0].strategy.paused).toBe(true)
    expect(result[1].strategy.paused).toBe(false)
  })

  test('handles asset with no strategies', () => {
    const result = flattenStrategyRows([makeAssetRow({ strategies: [] })])
    expect(result).toHaveLength(0)
  })

  test('handles large multi-asset strategy payloads', () => {
    const assets = Array.from({ length: 20 }, (_, i) =>
      makeAssetRow({
        address: `CASSET${i}`,
        name: `Asset ${i}`,
        symbol: `A${i}`,
        strategies: Array.from({ length: 10 }, (_, j) =>
          makeStrategy({ address: `CSTRAT${i}_${j}`, name: `Strat ${i}-${j}` }),
        ),
      }),
    )
    const result = flattenStrategyRows(assets)

    expect(result).toHaveLength(200)
    // Spot-check: row 15 belongs to asset 1 (strategies 0-9 for asset 0, then 10-19 for asset 1)
    expect(result[15].asset.address).toBe('CASSET1')
    expect(result[15].strategy.address).toBe('CSTRAT1_5')
  })
})
