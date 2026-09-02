import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SupplierLogo } from '@/components/suppliers/supplier-logo'

type DashboardSupplierFilterProps = {
  companies: { id: string; company_name: string | null; logo_url?: string | null }[]
  activeCompanyId: string | null
  labels: {
    company: string
    allCompanies: string
    unnamedCompany: string
  }
}

export function DashboardSupplierFilter({
  companies,
  activeCompanyId,
  labels,
}: DashboardSupplierFilterProps) {
  if (companies.length <= 1) return null

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-card/50 px-4 py-3">
      <span className="text-sm font-medium text-muted-foreground">{labels.company}</span>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant={!activeCompanyId ? 'default' : 'outline'} size="sm" className="rounded-full">
          <Link href="/dashboard">{labels.allCompanies}</Link>
        </Button>
        {companies.map((c) => (
          <Button
            key={c.id}
            asChild
            variant={activeCompanyId === c.id ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
          >
            <Link href={`/dashboard?company=${c.id}`} className="flex items-center gap-2">
              <SupplierLogo
                logoUrl={c.logo_url ?? null}
                companyName={c.company_name || labels.unnamedCompany}
                size="xs"
              />
              {c.company_name || labels.unnamedCompany}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
