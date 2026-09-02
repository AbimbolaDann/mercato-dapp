import type { ReactNode } from 'react'
import { Package, ShieldCheck, TrendingUp, Users } from 'lucide-react'

export type DashboardRoleKey = 'pyme' | 'investor' | 'supplier' | 'admin'

export const DASHBOARD_ROLE_THEME: Record<
  DashboardRoleKey,
  {
    icon: ReactNode
    badge: string
    header: string
    accent: string
    accentMuted: string
    actionPrimary: string
    statIcon: string
  }
> = {
  pyme: {
    icon: <Package className="h-4 w-4" />,
    badge: 'bg-brand-pale text-brand-mid ring-brand-light/30 dark:bg-white/[0.06] dark:text-brand-light',
    header: 'from-brand-ultra via-background to-brand-pale/30 dark:from-brand-dark/20 dark:via-background dark:to-transparent',
    accent: 'text-brand-mid dark:text-brand-light',
    accentMuted: 'bg-brand-mid hover:bg-brand-dark',
    actionPrimary: 'border-brand-light/40 bg-gradient-to-br from-brand-ultra to-brand-pale/60 dark:from-brand-dark/30 dark:to-white/[0.04]',
    statIcon: 'text-brand-mid',
  },
  investor: {
    icon: <TrendingUp className="h-4 w-4" />,
    badge: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400',
    header: 'from-emerald-50/80 via-background to-transparent dark:from-emerald-950/25 dark:via-background',
    accent: 'text-emerald-700 dark:text-emerald-400',
    accentMuted: 'bg-emerald-600 hover:bg-emerald-700',
    actionPrimary: 'border-emerald-500/30 bg-gradient-to-br from-emerald-50/90 to-teal-50/40 dark:from-emerald-950/30 dark:to-transparent',
    statIcon: 'text-emerald-600 dark:text-emerald-400',
  },
  supplier: {
    icon: <Users className="h-4 w-4" />,
    badge: 'bg-amber-500/10 text-amber-800 ring-amber-500/20 dark:text-amber-400',
    header: 'from-amber-50/80 via-background to-transparent dark:from-amber-950/20 dark:via-background',
    accent: 'text-amber-800 dark:text-amber-400',
    accentMuted: 'bg-amber-600 hover:bg-amber-700',
    actionPrimary: 'border-amber-500/30 bg-gradient-to-br from-amber-50/90 to-orange-50/30 dark:from-amber-950/25 dark:to-transparent',
    statIcon: 'text-amber-700 dark:text-amber-400',
  },
  admin: {
    icon: <ShieldCheck className="h-4 w-4" />,
    badge: 'bg-orange-500/10 text-orange-800 ring-orange-500/20 dark:text-orange-400',
    header: 'from-orange-50/80 via-background to-transparent dark:from-orange-950/20 dark:via-background',
    accent: 'text-orange-700 dark:text-orange-400',
    accentMuted: 'bg-orange-600 hover:bg-orange-700',
    actionPrimary: 'border-orange-500/30 bg-gradient-to-br from-orange-50/90 to-amber-50/30 dark:from-orange-950/25 dark:to-transparent',
    statIcon: 'text-orange-700 dark:text-orange-400',
  },
}

export function getRoleTheme(userType: string) {
  return DASHBOARD_ROLE_THEME[userType as DashboardRoleKey] ?? DASHBOARD_ROLE_THEME.pyme
}
