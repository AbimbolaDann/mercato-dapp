import { cn } from '@/lib/utils'

type MercatoLogoProps = {
  className?: string
  /** White mark on brand-colored or dark solid backgrounds */
  onBrand?: boolean
}

/** Brand mark from `/mercato.svg`. Use next to visible “MERCATO” text; decorative when that text is present. */
export function MercatoLogo({ className, onBrand }: MercatoLogoProps) {
  return (
    <img
      src="/mercato.svg"
      alt=""
      aria-hidden
      className={cn(
        'h-5 w-auto max-w-full object-contain',
        onBrand ? 'brightness-0 invert' : 'dark:brightness-0 dark:invert',
        className,
      )}
    />
  )
}
