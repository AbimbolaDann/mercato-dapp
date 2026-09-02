import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock, Unlock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AdminStats } from '@/lib/dashboard/types'
import type { Messages } from '@/lib/i18n/dictionaries'

type AdminPriorityStripProps = {
  stats: AdminStats
  t: Messages
}

export function AdminPriorityStrip({ stats, t }: AdminPriorityStripProps) {
  const m = t.adminDashboard
  const hasPending = stats.pendingEscrowApprovals > 0
  const hasRelease = stats.releaseQueue > 0
  const needsAttention = hasPending || hasRelease

  if (!needsAttention) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-50/50 px-5 py-4 dark:border-emerald-800/30 dark:bg-emerald-950/20">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
          <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400" aria-hidden />
        </div>
        <div>
          <p className="font-semibold">{m.allClear}</p>
          <p className="text-sm text-muted-foreground">{m.allClearHint}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-w-0 space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{m.priorityTitle}</p>
      <div className="grid min-w-0 gap-3 md:grid-cols-2">
        {hasPending && (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-300/50 bg-gradient-to-r from-amber-50/90 to-orange-50/40 px-5 py-4 dark:border-amber-800/40 dark:from-amber-950/30 dark:to-orange-950/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
                <Clock className="h-5 w-5 text-amber-700 dark:text-amber-400" aria-hidden />
              </div>
              <div>
                <p className="font-semibold">{m.pendingEscrowTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {stats.pendingEscrowApprovals === 1
                    ? m.pendingEscrowSingle
                    : m.pendingEscrowPlural.replace('{count}', String(stats.pendingEscrowApprovals))}
                </p>
              </div>
            </div>
            <Button asChild size="sm" className="rounded-full bg-orange-600 hover:bg-orange-700">
              <Link href="/dashboard/admin/approvals">
                {m.openQueue}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
        {hasRelease && (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-violet-300/40 bg-violet-50/50 px-5 py-4 dark:border-violet-800/35 dark:bg-violet-950/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40">
                <Unlock className="h-5 w-5 text-violet-700 dark:text-violet-400" aria-hidden />
              </div>
              <div>
                <p className="font-semibold">{m.releaseQueueTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {stats.releaseQueue === 1
                    ? m.releaseQueueSingle
                    : m.releaseQueuePlural.replace('{count}', String(stats.releaseQueue))}
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <Link href="/dashboard/admin/releases">
                {m.opRelease}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
