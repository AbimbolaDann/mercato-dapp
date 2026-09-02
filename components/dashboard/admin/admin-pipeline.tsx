import type { AdminStats } from '@/lib/dashboard/types'
import type { Messages } from '@/lib/i18n/dictionaries'
import { cn } from '@/lib/utils'

type AdminPipelineProps = {
  stats: AdminStats
  t: Messages
}

export function AdminPipeline({ stats, t }: AdminPipelineProps) {
  const m = t.adminDashboard
  const total = Math.max(stats.totalDeals, 1)

  const segments = [
    {
      key: 'seeking',
      label: m.pipelineSeeking,
      count: stats.seekingFunding,
      className: 'bg-sky-500',
    },
    {
      key: 'active',
      label: m.pipelineActive,
      count: stats.activeDeals,
      className: 'bg-orange-500',
    },
    {
      key: 'completed',
      label: m.pipelineCompleted,
      count: stats.completedDeals,
      className: 'bg-emerald-500',
    },
  ]

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {m.sectionPipeline}
        </h2>
        <p className="text-sm text-muted-foreground">
          {m.pipelineTotal.replace('{count}', String(stats.totalDeals))}
        </p>
      </div>

      <div className="mb-4 flex h-3 overflow-hidden rounded-full bg-muted">
        {segments.map((seg) => {
          const width = stats.totalDeals === 0 ? 0 : (seg.count / total) * 100
          if (width <= 0) return null
          return (
            <div
              key={seg.key}
              className={cn('h-full transition-all', seg.className)}
              style={{ width: `${width}%` }}
              title={`${seg.label}: ${seg.count}`}
            />
          )
        })}
      </div>

      <ul className="grid gap-2 sm:grid-cols-3">
        {segments.map((seg) => (
          <li key={seg.key} className="flex items-center gap-2 text-sm">
            <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', seg.className)} aria-hidden />
            <span className="text-muted-foreground">{seg.label}</span>
            <span className="ml-auto font-semibold tabular-nums">{seg.count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
