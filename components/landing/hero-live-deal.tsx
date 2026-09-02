'use client'

import { Building2, Package, Star } from 'lucide-react'
import { MercatoLogo } from '@/components/mercato-logo'
import { useI18n } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

const CENTER = { x: 200, y: 198 }

const TRIANGLE = {
  sme: { x: 200, y: 58 },
  supplier: { x: 14, y: 264 },
  order: { x: 372, y: 264 },
} as const

const TRIANGLE_EDGES = [
  { from: 'order', to: 'sme', index: 0 },
  { from: 'sme', to: 'supplier', index: 1 },
  { from: 'supplier', to: 'order', index: 2 },
] as const

function DealCard({
  className,
  label,
  children,
  icon: Icon,
}: {
  className?: string
  label: string
  children: React.ReactNode
  icon: React.ElementType
}) {
  return (
    <div
      className={cn(
        'hero-deal-card absolute z-20 w-[min(10.25rem,88vw)] max-w-[11.5rem] rounded-xl border p-2.5 backdrop-blur-md sm:w-[min(11.5rem,42vw)] sm:p-3',
        'border-brand-mid/15 bg-white/90 shadow-[0_12px_40px_-12px_hsl(var(--brand-dark)/0.12)]',
        'dark:border-white/10 dark:bg-[hsl(0_0%_6%/0.82)] dark:shadow-[0_12px_40px_-12px_hsl(0_0%_0%/0.7)]',
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-1.5">
        <Icon className="h-3 w-3 shrink-0 text-brand-mid dark:text-brand-light" aria-hidden />
        <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand-mid dark:text-brand-light/90">
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}

function ConnectionDot({
  cx,
  cy,
  pulseDelay = 0,
  size = 5,
}: {
  cx: number
  cy: number
  pulseDelay?: number
  size?: number
}) {
  return (
    <g className="hero-deal-dot">
      <circle
        cx={cx}
        cy={cy}
        r={size + 4}
        className="hero-deal-dot-ring fill-brand-light/15"
        style={{ animationDelay: `${pulseDelay}s` }}
      />
      <circle
        cx={cx}
        cy={cy}
        r={size}
        className="hero-deal-dot-core fill-brand-light stroke-white/20 stroke-[1.5] dark:stroke-white/30"
        style={{ animationDelay: `${pulseDelay}s` }}
      />
    </g>
  )
}

export function HeroLiveDeal() {
  const { t } = useI18n()

  const hubLinks = [
    { x: TRIANGLE.sme.x, y: TRIANGLE.sme.y },
    { x: TRIANGLE.supplier.x, y: TRIANGLE.supplier.y },
    { x: TRIANGLE.order.x, y: TRIANGLE.order.y },
  ]

  return (
    <div
      className="hero-live-deal relative mx-auto aspect-square w-full min-w-0 max-w-[min(100%,17.5rem)] overflow-visible sm:max-w-[24rem] md:max-w-[28rem] lg:max-w-[min(100%,34rem)] xl:max-w-[38rem] 2xl:max-w-[40rem]"
      aria-label={t('landing.hero.liveDeal.sme.label')}
    >
      <svg
        className="hero-deal-triangle absolute inset-0 h-full w-full"
        viewBox="0 0 400 400"
        aria-hidden
      >
        {TRIANGLE_EDGES.map(({ from, to, index }) => {
          const a = TRIANGLE[from]
          const b = TRIANGLE[to]
          const delay = index * -2.8
          return (
            <g key={`${from}-${to}`}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="hsl(var(--brand-light))"
                strokeWidth="1.5"
                strokeDasharray="6 8"
                className="hero-deal-edge"
                style={{ animationDelay: `${delay}s` }}
              />
              <circle r="2.5" className="hero-deal-flow-dot" fill="hsl(var(--brand-light))">
                <animateMotion
                  dur="3.4s"
                  repeatCount="indefinite"
                  path={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
                  begin={`${index * 1.15}s`}
                />
              </circle>
            </g>
          )
        })}

        {hubLinks.map((node, i) => (
          <line
            key={`hub-${i}`}
            x1={CENTER.x}
            y1={CENTER.y}
            x2={node.x}
            y2={node.y}
            stroke="hsl(var(--brand-light))"
            strokeWidth="1"
            strokeOpacity="0.35"
            strokeDasharray="4 6"
            className="hero-deal-hub"
            style={{ animationDelay: `${i * -1.1}s` }}
          />
        ))}

        <ConnectionDot cx={CENTER.x} cy={CENTER.y} size={6} />
        <ConnectionDot cx={TRIANGLE.sme.x} cy={TRIANGLE.sme.y} pulseDelay={0} />
        <ConnectionDot cx={TRIANGLE.supplier.x} cy={TRIANGLE.supplier.y} pulseDelay={-0.9} />
        <ConnectionDot cx={TRIANGLE.order.x} cy={TRIANGLE.order.y} pulseDelay={-1.8} />
      </svg>

      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-mid/20 bg-white/95 shadow-[0_8px_24px_-8px_hsl(var(--brand-dark)/0.18)] backdrop-blur-md sm:h-14 sm:w-14 dark:border-brand-light/25 dark:bg-[hsl(0_0%_4%/0.92)] dark:shadow-[0_8px_28px_-10px_hsl(0_0%_0%/0.55)]">
          <MercatoLogo className="h-4 w-auto dark:hidden sm:h-[1.125rem]" />
          <MercatoLogo className="hidden h-4 w-auto dark:block sm:h-[1.125rem]" onBrand />
        </div>
      </div>

      <DealCard
        className="left-1/2 top-0 -translate-x-1/2 -translate-y-1"
        label={t('landing.hero.liveDeal.sme.label')}
        icon={Building2}
      >
        <p className="truncate text-xs font-bold text-foreground dark:text-white">
          {t('landing.hero.liveDeal.sme.name')}
        </p>
        <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground dark:text-white/55">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />
          <span>{t('landing.hero.liveDeal.sme.rating')}</span>
        </div>
        <p className="mt-0.5 text-[10px] text-muted-foreground dark:text-white/45">
          {t('landing.hero.liveDeal.sme.location')}
        </p>
      </DealCard>

      <DealCard
        className="left-[8%] top-[64%] -translate-x-1/2 -translate-y-1/2 sm:left-[4%] sm:top-[66%] lg:left-[2%] lg:top-[66%]"
        label={t('landing.hero.liveDeal.supplier.label')}
        icon={Building2}
      >
        <p className="truncate text-xs font-bold text-foreground dark:text-white">
          {t('landing.hero.liveDeal.supplier.name')}
        </p>
        <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground dark:text-white/55">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />
          <span>{t('landing.hero.liveDeal.supplier.rating')}</span>
        </div>
        <p className="mt-0.5 text-[10px] text-muted-foreground dark:text-white/45">
          {t('landing.hero.liveDeal.supplier.location')}
        </p>
      </DealCard>

      <DealCard
        className="left-[92%] top-[64%] -translate-x-1/2 -translate-y-1/2 sm:left-[94%] sm:top-[66%] lg:left-[95%] lg:top-[66%]"
        label={t('landing.hero.liveDeal.order.label')}
        icon={Package}
      >
        <p className="truncate text-xs font-bold text-foreground dark:text-white">
          {t('landing.hero.liveDeal.order.name')}
        </p>
        <p className="mt-0.5 text-[11px] font-semibold text-brand-mid dark:text-brand-light">
          {t('landing.hero.liveDeal.order.amount')}
        </p>
        <span className="mt-1.5 inline-block rounded-full bg-brand-pale px-2 py-0.5 text-[9px] font-medium text-brand-mid dark:bg-brand-mid/30 dark:text-brand-light">
          {t('landing.hero.liveDeal.order.status')}
        </span>
      </DealCard>
    </div>
  )
}
