import type { SupplierProduct } from './types'

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export type StockFilter = 'all' | StockStatus

const DEFAULT_LOW_STOCK_THRESHOLD = 5

export function getAvailableQuantity(product: Pick<SupplierProduct, 'stock_quantity' | 'reserved_quantity'>): number {
  const onHand = Math.max(0, Math.floor(Number(product.stock_quantity) || 0))
  const reserved = Math.max(0, Math.floor(Number(product.reserved_quantity) || 0))
  return Math.max(0, onHand - reserved)
}

export function getStockStatus(product: Pick<SupplierProduct, 'stock_quantity' | 'reserved_quantity' | 'reorder_point'>): StockStatus {
  const available = getAvailableQuantity(product)
  if (available <= 0) return 'out_of_stock'

  const reorder = Math.max(0, Math.floor(Number(product.reorder_point) || 0))
  const lowThreshold = reorder > 0 ? reorder : DEFAULT_LOW_STOCK_THRESHOLD
  if (available <= lowThreshold) return 'low_stock'

  return 'in_stock'
}

export function productMatchesStockFilter(product: SupplierProduct, filter: StockFilter): boolean {
  if (filter === 'all') return true
  return getStockStatus(product) === filter
}

export function computeInventoryStats(products: SupplierProduct[]) {
  let inStock = 0
  let lowStock = 0
  let outOfStock = 0
  let totalOnHand = 0
  let totalAvailable = 0

  for (const p of products) {
    const status = getStockStatus(p)
    if (status === 'in_stock') inStock += 1
    else if (status === 'low_stock') lowStock += 1
    else outOfStock += 1
    totalOnHand += Math.max(0, Math.floor(Number(p.stock_quantity) || 0))
    totalAvailable += getAvailableQuantity(p)
  }

  return {
    skuCount: products.length,
    inStock,
    lowStock,
    outOfStock,
    totalOnHand,
    totalAvailable,
  }
}

export const STOCK_STATUS_BADGE_CLASS: Record<StockStatus, string> = {
  in_stock: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  low_stock: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  out_of_stock: 'bg-destructive/10 text-destructive',
}
