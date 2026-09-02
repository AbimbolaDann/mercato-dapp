'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SupplierLogo } from '@/components/suppliers/supplier-logo'
import type { SupplierCompany } from '@/lib/supplier-profile/types'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n/provider'

type SupplierCompanyListProps = {
  companies: SupplierCompany[]
  productCounts: Record<string, number>
  selectedId: string | null
  onSelect: (id: string) => void
  onAddCompany: () => void
}

export function SupplierCompanyList({
  companies,
  productCounts,
  selectedId,
  onSelect,
  onAddCompany,
}: SupplierCompanyListProps) {
  const { t } = useI18n()

  return (
    <div className="rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {t('supplierProfile.companiesHeading')}
        </p>
        <Button variant="ghost" size="sm" className="h-8 gap-1 rounded-full px-2" onClick={onAddCompany}>
          <Plus className="h-4 w-4" aria-hidden />
          <span className="sr-only sm:not-sr-only">{t('supplierProfile.addCompany')}</span>
        </Button>
      </div>
      <ul className="max-h-[min(420px,50vh)] overflow-y-auto p-2">
        {companies.map((company) => {
          const active = company.id === selectedId
          const count = productCounts[company.id] ?? 0
          return (
            <li key={company.id}>
              <button
                type="button"
                onClick={() => onSelect(company.id)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors',
                  active
                    ? 'bg-amber-500/10 ring-1 ring-amber-500/30'
                    : 'hover:bg-muted/50',
                )}
              >
                <SupplierLogo
                  logoUrl={company.logo_url}
                  companyName={company.company_name || t('supplierProfile.unnamedCompany')}
                  size="xs"
                  className={cn(
                    'h-9 w-9 rounded-lg',
                    active && 'ring-1 ring-amber-500/40',
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium leading-snug">
                    {company.company_name || t('supplierProfile.unnamedCompany')}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t('supplierProfile.productsCount', { count })}
                  </p>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
