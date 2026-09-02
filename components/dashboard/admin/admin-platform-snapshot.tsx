import Link from 'next/link'
import { ArrowRight, Building2, CheckCircle2, Landmark, Users, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AdminStats } from '@/lib/dashboard/types'
import type { Messages } from '@/lib/i18n/dictionaries'
import { cn } from '@/lib/utils'

type AdminPlatformSnapshotProps = {
  stats: AdminStats
  t: Messages
}

export function AdminPlatformSnapshot({ stats, t }: AdminPlatformSnapshotProps) {
  const m = t.adminDashboard

  const rows = [
    { label: m.usersPymes, value: stats.pymeCount, icon: Users },
    { label: m.usersInvestors, value: stats.investorCount, icon: Users },
    { label: m.usersSuppliers, value: stats.supplierCount, icon: Users },
    { label: m.supplierCompanies, value: stats.supplierCompanyCount, icon: Building2 },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {m.sectionCommunity}
      </h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
          <ul className="space-y-3">
            {rows.map((row) => (
              <li key={row.label} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <row.icon className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                  {row.label}
                </span>
                <span className="font-semibold tabular-nums">{row.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={cn(
            'flex flex-col justify-between rounded-2xl border p-5 shadow-sm',
            stats.vaultConfigured
              ? 'border-emerald-500/25 bg-emerald-50/30 dark:border-emerald-800/30 dark:bg-emerald-950/15'
              : 'border-amber-500/25 bg-amber-50/30 dark:border-amber-800/30 dark:bg-amber-950/15',
          )}
        >
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Landmark className="h-5 w-5 text-muted-foreground" aria-hidden />
              <p className="font-semibold">{m.vaultStatus}</p>
              {stats.vaultConfigured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" aria-hidden />
                  {m.vaultReady}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-900 dark:text-amber-300">
                  <XCircle className="h-3 w-3" aria-hidden />
                  {m.vaultMissing}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.vaultConfigured ? m.vaultHintReady : m.vaultHintMissing}
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="mt-4 w-fit rounded-full">
            <Link href="/dashboard/admin/vault">
              {m.manageVault}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
