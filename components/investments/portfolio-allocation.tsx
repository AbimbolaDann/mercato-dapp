import { PieChart } from 'lucide-react'
import { formatInvestUsd } from '@/lib/investments/portfolio-metrics'
import type { AllocationSlice } from '@/lib/investments/types'
import { cn } from '@/lib/utils'

const BAR_COLORS = [
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-indigo-400',
  'bg-slate-400',
]

type PortfolioAllocationProps = {
  slices: AllocationSlice[]
  labels: {
    title: string
    subtitle: string
    empty: string
    dealsCount: string
    other: string
  }
}

export function PortfolioAllocation({ slices, labels }: PortfolioAllocationProps) {
  const displaySlices = slices.map((s) => ({
    ...s,
    label: s.id === '__other__' ? labels.other : s.label,
  }))

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
          <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
        </div>
        <div>
          <h2 className="text-base font-semibold">{labels.title}</h2>
          <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
        </div>
      </div>

      {displaySlices.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{labels.empty}</p>
      ) : (
        <ul className="space-y-4">
          {displaySlices.map((slice, i) => (
            <li key={slice.id}>
              <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                <span className="font-medium truncate">{slice.label}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {formatInvestUsd(slice.amount)} · {slice.percent.toFixed(0)}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn('h-full rounded-full transition-all', BAR_COLORS[i % BAR_COLORS.length])}
                  style={{ width: `${Math.max(slice.percent, 2)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {labels.dealsCount.replace('{count}', String(slice.dealCount))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
