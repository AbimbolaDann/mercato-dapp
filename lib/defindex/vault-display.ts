import type { MercatoVaultMeta } from '@/hooks/useDefindex'

export function truncateContractAddress(address: string, head = 6, tail = 6): string {
  if (address.length <= head + tail + 1) return address
  return `${address.slice(0, head)}…${address.slice(-tail)}`
}

export function getPrimarySupplyAsset(vaultMeta: MercatoVaultMeta | null): {
  symbol: string
  name: string
} {
  const fromRow = vaultMeta?.assetRows?.[0]
  if (fromRow) {
    return { symbol: fromRow.symbol, name: fromRow.name }
  }
  const fromAsset = vaultMeta?.assets?.[0]
  if (fromAsset?.symbol) {
    return {
      symbol: fromAsset.symbol,
      name: fromAsset.name ?? fromAsset.symbol,
    }
  }
  return { symbol: 'USDC', name: 'USD Coin' }
}

export function formatCompactCurrency(value: number): string {
  if (!Number.isFinite(value)) return '$0'
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}k`
  }
  return `$${value.toFixed(2)}`
}
