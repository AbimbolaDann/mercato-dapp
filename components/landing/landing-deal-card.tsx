'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Package,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n/provider'
import type { FeedEventType, LandingFeedItem } from '@/lib/landing/landing-deal-feed'

const EVENT_META: Record<
  FeedEventType,
  { icon: React.ElementType; pill: string; glow: string }
> = {
  open: {
    icon: Zap,
    pill: 'bg-brand-pale text-brand-mid ring-1 ring-brand-light/30 dark:bg-white/[0.06] dark:text-brand-light',
    glow: 'shadow-[0_12px_40px_hsl(var(--brand-mid)/0.22)]',
  },
  funded: {
    icon: TrendingUp,
    pill: 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-400',
    glow: 'shadow-[0_12px_40px_rgba(16,185,129,0.2)]',
  },
  production: {
    icon: Package,
    pill: 'bg-brand-pale text-brand-dark ring-1 ring-brand-mid/20 dark:bg-white/[0.06] dark:text-brand-light',
    glow: 'shadow-[0_12px_48px_hsl(var(--brand-light)/0.25)]',
  },
  milestone: {
    icon: CheckCircle2,
    pill: 'bg-orange-500/10 text-orange-700 ring-1 ring-orange-500/25 dark:text-orange-400',
    glow: 'shadow-[0_12px_40px_rgba(249,115,22,0.18)]',
  },
  repaid: {
    icon: CircleDollarSign,
    pill: 'bg-muted text-muted-foreground ring-1 ring-border',
    glow: 'shadow-[0_8px_32px_hsl(var(--brand-dark)/0.08)]',
  },
}

type LandingDealCardProps = {
  item: LandingFeedItem
  highlighted?: boolean
  style?: React.CSSProperties
}

export function LandingDealCard({ item, highlighted, style }: LandingDealCardProps) {
  const { t } = useI18n()
  const meta = EVENT_META[item.eventType]
  const Icon = meta.icon
  const eventLabel =
    item.eventLabel ||
    t(item.eventLabelKey, item.eventLabelParams)
  const progress =
    item.milestonesTotal > 0
      ? Math.round((item.milestonesCompleted / item.milestonesTotal) * 100)
      : 0

  return (
    <Link
      href={item.href}
      style={style}
      className={cn(
        'landing-deal-card group relative block rounded-2xl border border-border/70 bg-card/95 p-5 backdrop-blur-sm',
        'transition-[transform,box-shadow,opacity,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-colors',
        'hover:-translate-y-1 hover:border-brand-light/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid',
        highlighted ? cn('z-20 scale-[1.03] border-brand-light/50', meta.glow) : 'z-0 scale-100 opacity-90',
      )}
    >
      {!item.isLive && (
        <span className="absolute right-3 top-3 rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
          {t('landing.liveDeals.card.example')}
        </span>
      )}

      <div className="mb-3 flex items-center gap-2">
        <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold', meta.pill)}>
          <Icon className="h-3 w-3" aria-hidden />
          {eventLabel}
        </span>
        {highlighted && (
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-light opacity-70" />
            <span className="relative h-2 w-2 rounded-full bg-brand-light" />
          </span>
        )}
      </div>

      {item.category && (
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {item.category}
        </p>
      )}
      <h3 className="mb-1 line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-brand-mid dark:group-hover:text-brand-light">
        {item.productName}
      </h3>
      {item.companyLine && (
        <p className="mb-4 line-clamp-1 text-sm text-muted-foreground">{item.companyLine}</p>
      )}

      <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl border border-border/60 bg-muted/25 p-2">
        <div>
          <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">{t('landing.liveDeals.card.amount')}</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums">{item.amountLabel}</p>
        </div>
        <div className="border-x border-border/50 px-2 text-center">
          <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">{t('landing.liveDeals.card.apr')}</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-brand-mid dark:text-brand-light">
            {item.aprLabel ?? '—'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">{t('landing.liveDeals.card.term')}</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums">{item.termDays}d</p>
        </div>
      </div>

      {item.milestonesTotal > 0 && (
        <div className="mb-4">
          <div className="mb-1.5 flex justify-between text-[10px] text-muted-foreground">
            <span>{t('landing.liveDeals.card.milestones')}</span>
            <span className="tabular-nums">
              {item.milestonesCompleted}/{item.milestonesTotal}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-mid to-brand-light transition-[width] duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div
        className={cn(
          'flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition-colors',
          item.eventType === 'open'
            ? 'bg-brand-pale/80 text-brand-mid group-hover:bg-brand-mid group-hover:text-white dark:bg-white/[0.06] dark:text-brand-light dark:group-hover:bg-brand-mid'
            : 'bg-muted/40 text-foreground group-hover:bg-muted',
        )}
      >
        {item.eventType === 'open' ? t('landing.liveDeals.card.fundDeal') : t('landing.liveDeals.card.viewDeal')}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </div>
    </Link>
  )
}
