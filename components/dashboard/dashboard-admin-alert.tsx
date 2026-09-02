import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AdminStats } from '@/lib/dashboard/types'

type DashboardAdminAlertProps = {
  stats: AdminStats
  labels: {
    pendingTitle: string
    pendingSingle: string
    pendingPlural: string
    goApprovals: string
    reviewNow: string
    view: string
  }
}

export function DashboardAdminAlert({ stats, labels }: DashboardAdminAlertProps) {
  if (stats.pendingApprovals <= 0) return null

  const message =
    stats.pendingApprovals === 1
      ? labels.pendingSingle
      : labels.pendingPlural.replace('{count}', String(stats.pendingApprovals))

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-300/50 bg-gradient-to-r from-amber-50/90 to-orange-50/40 px-5 py-4 dark:border-amber-800/40 dark:from-amber-950/30 dark:to-orange-950/10">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
          <ShieldCheck className="h-5 w-5 text-amber-700 dark:text-amber-400" aria-hidden />
        </div>
        <div>
          <p className="font-semibold">{labels.pendingTitle}</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
      <Button asChild className="rounded-full bg-orange-600 hover:bg-orange-700">
        <Link href="/dashboard/admin/approvals">
          {labels.goApprovals}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
