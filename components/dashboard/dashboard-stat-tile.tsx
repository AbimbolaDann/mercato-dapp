import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

type DashboardStatTileProps = {
  label: string
  value: number | string
  icon: LucideIcon
  iconClassName?: string
  highlight?: boolean
  footer?: string
}

export function DashboardStatTile({
  label,
  value,
  icon: Icon,
  iconClassName,
  highlight,
  footer,
}: DashboardStatTileProps) {
  return (
    <div
      className={cn(
        'flex min-h-[7.5rem] min-w-0 flex-col rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5',
        highlight && 'border-amber-300/50 bg-amber-50/40 dark:border-amber-800/40 dark:bg-amber-950/20',
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2 sm:mb-3">
        <p className="min-w-0 truncate text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground sm:text-[11px]">
          {label}
        </p>
        <Icon className={cn('h-4 w-4 shrink-0 opacity-70', iconClassName)} aria-hidden />
      </div>
      <p className="min-w-0 truncate font-display text-2xl font-normal tabular-nums tracking-tight text-foreground sm:text-3xl">
        {value}
      </p>
      {footer && (
        <p className="mt-auto min-w-0 truncate pt-1.5 text-xs text-muted-foreground">{footer}</p>
      )}
    </div>
  )
}
