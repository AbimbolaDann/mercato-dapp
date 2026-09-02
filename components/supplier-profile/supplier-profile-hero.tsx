'use client'

import Link from 'next/link'
import { ArrowRight, Building2, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'

type SupplierProfileHeroProps = {
  companiesCount: number
  productsCount: number
}

export function SupplierProfileHero({ companiesCount, productsCount }: SupplierProfileHeroProps) {
  const { t } = useI18n()

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-50/90 via-background to-orange-50/30 px-6 py-7 shadow-sm dark:from-amber-950/25 dark:via-background dark:to-transparent md:px-8">
      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {t('supplierProfile.hubLabel')}
          </p>
          <h1 className="font-display text-3xl font-normal leading-[1.05] tracking-tight md:text-4xl">
            {t('supplierProfile.title')}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">{t('supplierProfile.subtitle')}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1">
              <Building2 className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" aria-hidden />
              {t('supplierProfile.statsCompanies', { count: companiesCount })}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-2.5 py-1">
              <Package className="h-3.5 w-3.5" aria-hidden />
              {t('supplierProfile.statsProducts', { count: productsCount })}
            </span>
          </div>
        </div>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/dashboard/deals">
            {t('supplierProfile.viewDeals')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
