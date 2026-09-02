import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getRoleTheme } from '@/lib/dashboard/role-theme'
import { cn } from '@/lib/utils'
import type { Messages } from '@/lib/i18n/dictionaries'

type AdminCommandHeroProps = {
  welcome: string
  roleLabel: string
  t: Messages
}

export function AdminCommandHero({ welcome, roleLabel, t }: AdminCommandHeroProps) {
  const theme = getRoleTheme('admin')
  const m = t.adminDashboard

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br px-6 py-7 shadow-sm md:px-8',
        theme.header,
      )}
    >
      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {m.hubLabel}
          </p>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl font-normal leading-[1.05] tracking-tight md:text-4xl">
              {welcome}
            </h1>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
                theme.badge,
              )}
            >
              {theme.icon}
              {roleLabel}
            </span>
          </div>
          <p className="text-base text-muted-foreground">{m.tagline}</p>
        </div>
        <Button asChild className={cn('rounded-full', theme.accentMuted)}>
          <Link href="/dashboard/admin/approvals">
            {m.primaryCta}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </div>
  )
}
