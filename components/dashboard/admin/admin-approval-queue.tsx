import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format'
import type { AdminApprovalPreview } from '@/lib/dashboard/types'
import type { Messages } from '@/lib/i18n/dictionaries'

type AdminApprovalQueueProps = {
  items: AdminApprovalPreview[]
  t: Messages
}

export function AdminApprovalQueue({ items, t }: AdminApprovalQueueProps) {
  const m = t.adminDashboard

  return (
    <div className="rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {m.sectionQueue}
        </h2>
        <Button variant="ghost" size="sm" asChild className="rounded-full">
          <Link href="/dashboard/admin/approvals">
            {m.queueViewAll}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">{m.queueEmpty}</p>
      ) : (
        <ul className="divide-y divide-border/60">
          {items.map((item) => (
            <li key={item.milestoneId}>
              <Link
                href="/dashboard/admin/approvals"
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.dealTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.milestoneTitle} · {item.pymeName} → {item.supplierName}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  {formatCurrency(item.amount)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
