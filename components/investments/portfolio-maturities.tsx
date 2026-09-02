import Link from 'next/link'
import { CalendarClock, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/date-utils'
import { formatInvestUsd } from '@/lib/investments/portfolio-metrics'
import type { MaturityEvent } from '@/lib/investments/types'
import { cn } from '@/lib/utils'

type PortfolioMaturitiesProps = {
  events: MaturityEvent[]
  labels: {
    title: string
    subtitle: string
    empty: string
    principal: string
    yield: string
    daysUntil: string
    overdue: string
    today: string
  }
}

function tr(template: string, vars: Record<string, string | number>) {
  return Object.entries(vars).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), template)
}

export function PortfolioMaturities({ events, labels }: PortfolioMaturitiesProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
          <CalendarClock className="h-5 w-5 text-amber-700 dark:text-amber-400" aria-hidden />
        </div>
        <div>
          <h2 className="text-base font-semibold">{labels.title}</h2>
          <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
        </div>
      </div>

      {events.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{labels.empty}</p>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => {
            const urgency =
              event.daysUntil <= 0
                ? 'overdue'
                : event.daysUntil <= 14
                  ? 'soon'
                  : 'normal'
            const whenLabel =
              event.daysUntil <= 0
                ? labels.overdue
                : event.daysUntil === 0
                  ? labels.today
                  : tr(labels.daysUntil, { n: event.daysUntil })

            return (
              <li key={event.dealId}>
                <Link
                  href={`/deals/${event.dealId}`}
                  className="group flex gap-3 rounded-xl border border-border/60 p-3 transition-colors hover:border-emerald-500/30 hover:bg-muted/30"
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg text-center text-[10px] font-bold leading-tight',
                      urgency === 'overdue' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
                      urgency === 'soon' && 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400',
                      urgency === 'normal' && 'bg-muted text-muted-foreground',
                    )}
                  >
                    <span className="text-xs tabular-nums">
                      {event.daysUntil <= 0 ? '!' : event.daysUntil}
                    </span>
                    <span className="uppercase opacity-80">d</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                      {event.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{event.smbName}</p>
                    <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      <span>
                        {labels.principal}:{' '}
                        <span className="font-medium text-foreground">{formatInvestUsd(event.principal)}</span>
                      </span>
                      <span>
                        {labels.yield}:{' '}
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          {formatInvestUsd(event.expectedYield, 2)}
                        </span>
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {formatDate(event.maturityDate.toISOString())} · {whenLabel}
                    </p>
                  </div>
                  <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
