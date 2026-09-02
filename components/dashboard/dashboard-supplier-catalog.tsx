'use client'

import Link from 'next/link'
import { ArrowRight, Package } from 'lucide-react'
import { getLocalizedCategoryLabel } from '@/lib/categories'
import { useI18n } from '@/lib/i18n/provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProductImage } from '@/components/media/product-image'
import type { SupplierProductsCard } from '@/lib/dashboard/types'
import { getRoleTheme } from '@/lib/dashboard/role-theme'
import { cn } from '@/lib/utils'

type DashboardSupplierCatalogProps = {
  products: SupplierProductsCard | null
  hasCompanies: boolean
  showCatalog: boolean
  labels: {
    title: string
    descAll: string
    descPickCompany: string
    categories: string
    products: string
    moreProducts: string
    noProductsCompany: string
    hintNoCompanies: string
    hintPickCompany: string
    manageCatalog: string
  }
}

export function DashboardSupplierCatalog({
  products,
  hasCompanies,
  showCatalog,
  labels,
}: DashboardSupplierCatalogProps) {
  const { messages } = useI18n()
  const theme = getRoleTheme('supplier')

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', theme.actionPrimary)}>
          <Package className={cn('h-5 w-5', theme.statIcon)} aria-hidden />
        </div>
        <div>
          <h3 className="text-base font-semibold">{labels.title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {showCatalog ? labels.descAll : labels.descPickCompany}
          </p>
        </div>
      </div>

      {products ? (
        <div className="space-y-4">
          {products.categories.length > 0 && (
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {labels.categories}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {products.categories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="text-xs">
                    {getLocalizedCategoryLabel(cat, messages)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {products.items.length > 0 && (
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {labels.products}
              </p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {products.items.slice(0, 6).map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/20 px-2.5 py-2"
                  >
                    <ProductImage imageUrl={item.image_url} alt={item.name} size="xs" />
                    <span className="min-w-0 truncate text-sm font-medium">{item.name}</span>
                  </li>
                ))}
              </ul>
              {products.items.length > 6 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {labels.moreProducts.replace('{count}', String(products.items.length - 6))}
                </p>
              )}
            </div>
          )}
          {products.categories.length === 0 && products.items.length === 0 && (
            <p className="text-sm text-muted-foreground">{labels.noProductsCompany}</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {!hasCompanies ? labels.hintNoCompanies : labels.hintPickCompany}
        </p>
      )}

      <Button asChild variant="outline" size="sm" className="mt-5 w-full rounded-full">
        <Link href="/dashboard/supplier-profile">
          {labels.manageCatalog}
          <ArrowRight className="ml-2 h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  )
}
