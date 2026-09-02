import Link from 'next/link'
import { FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getServerDictionary, tr } from '@/lib/i18n/server'

type AdminQueueFiltersProps = {
  basePath: string
  companyFilter: string | null
  sortOrder: 'newest' | 'oldest'
  uniquePymes: { id: string; name: string }[]
  uniqueSuppliers: { id: string; name: string }[]
  hasFilters: boolean
}

function buildHref(basePath: string, company: string | null, sort: string) {
  const params = new URLSearchParams()
  if (company) params.set('company', company)
  params.set('sort', sort)
  const q = params.toString()
  return q ? `${basePath}?${q}` : basePath
}

export async function AdminQueueFilters({
  basePath,
  companyFilter,
  sortOrder,
  uniquePymes,
  uniqueSuppliers,
  hasFilters,
}: AdminQueueFiltersProps) {
  const m = await getServerDictionary()

  if (!hasFilters) return null

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <span className="text-xs font-medium text-muted-foreground">{tr(m, 'adminPage.filterCompany')}</span>
      <div className="flex flex-wrap gap-2">
        <Button
          asChild
          variant={!companyFilter ? 'secondary' : 'ghost'}
          size="sm"
          className="h-7 text-xs"
        >
          <Link href={buildHref(basePath, null, sortOrder)}>{tr(m, 'adminPage.filterAll')}</Link>
        </Button>
        {uniquePymes.map((p) => (
          <Button
            key={`pyme-${p.id}`}
            asChild
            variant={companyFilter === `pyme:${p.id}` ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs"
          >
            <Link href={buildHref(basePath, `pyme:${p.id}`, sortOrder)}>
              {tr(m, 'adminPage.filterPymePrefix')} {p.name}
            </Link>
          </Button>
        ))}
        {uniqueSuppliers.map((s) => (
          <Button
            key={`supplier-${s.id}`}
            asChild
            variant={companyFilter === `supplier:${s.id}` ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs"
          >
            <Link href={buildHref(basePath, `supplier:${s.id}`, sortOrder)}>
              {tr(m, 'adminPage.filterSupplierPrefix')} {s.name}
            </Link>
          </Button>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-1">
        <span className="text-xs text-muted-foreground">{tr(m, 'adminPage.sortLabel')}</span>
        <Button
          asChild
          variant={sortOrder === 'newest' ? 'secondary' : 'ghost'}
          size="sm"
          className="h-7 text-xs"
        >
          <Link href={buildHref(basePath, companyFilter, 'newest')}>{tr(m, 'adminPage.newestFirst')}</Link>
        </Button>
        <Button
          asChild
          variant={sortOrder === 'oldest' ? 'secondary' : 'ghost'}
          size="sm"
          className="h-7 text-xs"
        >
          <Link href={buildHref(basePath, companyFilter, 'oldest')}>{tr(m, 'adminPage.oldestFirst')}</Link>
        </Button>
      </div>
    </div>
  )
}

export async function AdminApprovalsEmpty({ emptyState }: { emptyState: boolean }) {
  const m = await getServerDictionary()
  if (!emptyState) return null

  return (
    <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
      <FileCheck className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" aria-hidden />
      <p className="font-medium">{tr(m, 'adminPage.pendingTitle')}</p>
      <p className="mt-1 text-sm text-muted-foreground">{tr(m, 'adminPage.pendingEmptyDescription')}</p>
    </div>
  )
}
