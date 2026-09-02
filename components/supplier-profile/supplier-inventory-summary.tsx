'use client'

import { AlertTriangle, Boxes, CheckCircle2, PackageX } from 'lucide-react'
import type { computeInventoryStats } from '@/lib/supplier-profile/inventory'
import { useI18n } from '@/lib/i18n/provider'

type InventoryStats = ReturnType<typeof computeInventoryStats>

type SupplierInventorySummaryProps = {
  stats: InventoryStats
}

export function SupplierInventorySummary({ stats }: SupplierInventorySummaryProps) {
  const { t } = useI18n()

  const cards = [
    {
      key: 'skus',
      label: t('supplierProfile.inventorySkus'),
      value: stats.skuCount,
      sub: t('supplierProfile.inventoryOnHandSub', { count: stats.totalOnHand }),
      icon: Boxes,
      className: 'text-foreground',
    },
    {
      key: 'in_stock',
      label: t('supplierProfile.inventoryInStock'),
      value: stats.inStock,
      sub: t('supplierProfile.inventoryAvailableSub', { count: stats.totalAvailable }),
      icon: CheckCircle2,
      className: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      key: 'low',
      label: t('supplierProfile.inventoryLowStock'),
      value: stats.lowStock,
      sub: t('supplierProfile.inventoryLowStockSub'),
      icon: AlertTriangle,
      className: 'text-amber-600 dark:text-amber-400',
    },
    {
      key: 'out',
      label: t('supplierProfile.inventoryOutOfStock'),
      value: stats.outOfStock,
      sub: t('supplierProfile.inventoryOutOfStockSub'),
      icon: PackageX,
      className: 'text-destructive',
    },
  ] as const

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, value, sub, icon: Icon, className }) => (
        <div
          key={key}
          className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <p className={`mt-1 text-2xl font-bold tabular-nums tracking-tight ${className}`}>
                {value}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
            </div>
            <Icon className={`h-5 w-5 shrink-0 opacity-80 ${className}`} aria-hidden />
          </div>
        </div>
      ))}
    </div>
  )
}
