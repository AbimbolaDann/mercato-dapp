import { CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getAdminQueueData } from '@/lib/admin/get-admin-queue-data'
import { requireAdminProfile } from '@/lib/admin/require-admin'
import { getServerDictionary, tr } from '@/lib/i18n/server'
import { ReleaseFundsFallback } from '../release-funds-fallback'

export default async function AdminReleasesPage() {
  const { supabase } = await requireAdminProfile()
  const m = await getServerDictionary()
  const queue = await getAdminQueueData(supabase)

  return (
    <div className="space-y-6">
      <header>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden />
          <h1 className="text-2xl font-bold tracking-tight">{tr(m, 'adminPage.releaseTitle')}</h1>
          <Badge variant="secondary" className="text-xs">
            Admin
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{tr(m, 'adminPage.releaseSubtitle')}</p>
      </header>

      {queue.releaseFallbackItems.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
          <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" aria-hidden />
          <p className="font-medium">{tr(m, 'adminPage.releaseEmptyTitle')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{tr(m, 'adminPage.releaseEmptyHint')}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            {tr(m, 'adminPage.releaseListHint')}
          </p>
          <ReleaseFundsFallback items={queue.releaseFallbackItems} />
        </div>
      )}
    </div>
  )
}
