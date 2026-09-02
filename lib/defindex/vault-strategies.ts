import type { VaultMonitorAssetRow, VaultMonitorStrategyRow } from './vault-monitor'

export type FlatStrategyRow = {
  asset: { address: string; name: string; symbol: string }
  strategy: VaultMonitorStrategyRow
}

/** Flatten asset rows into a list of strategy entries with asset context attached. */
export function flattenStrategyRows(assetRows: VaultMonitorAssetRow[]): FlatStrategyRow[] {
  const rows: FlatStrategyRow[] = []
  for (const asset of assetRows) {
    const ctx = { address: asset.address, name: asset.name, symbol: asset.symbol }
    for (const strategy of asset.strategies) {
      rows.push({ asset: ctx, strategy })
    }
  }
  return rows
}
