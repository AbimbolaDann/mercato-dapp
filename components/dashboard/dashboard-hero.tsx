import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getRoleTheme } from '@/lib/dashboard/role-theme'
import { cn } from '@/lib/utils'

type DashboardHeroProps = {
  userType: string
  hubLabel: string
  welcome: string
  roleLabel: string
  tagline: string
  companyLine?: string | null
  primaryAction?: { label: string; href: string; icon?: React.ReactNode }
}

export function DashboardHero({
  userType,
  hubLabel,
  welcome,
  roleLabel,
  tagline,
  companyLine,
  primaryAction,
}: DashboardHeroProps) {
  const theme = getRoleTheme(userType)

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br px-6 py-7 shadow-sm md:px-8 md:py-8',
        theme.header,
      )}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-light/10 blur-3xl dark:bg-brand-light/5"
        aria-hidden
      />
      <div className="relative flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-2xl">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {hubLabel}
          </p>
          <h1 className="font-display text-3xl font-normal leading-[1.05] tracking-tight text-foreground md:text-4xl">
            {welcome}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn('gap-1.5 font-semibold ring-1', theme.badge)}>
              {theme.icon}
              {roleLabel}
            </Badge>
            {companyLine && <span className="text-sm text-muted-foreground">{companyLine}</span>}
          </div>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{tagline}</p>
        </div>
        {primaryAction && (
          <Button asChild size="lg" className={cn('rounded-full px-6 shadow-md', theme.accentMuted)}>
            <Link href={primaryAction.href}>
              {primaryAction.icon}
              {primaryAction.label}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
