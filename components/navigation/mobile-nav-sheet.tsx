'use client'

import type { ReactNode } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useMounted } from '@/hooks/use-mounted'

type MobileNavSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  menuLabel: string
  children: ReactNode
}

/** Defer Radix Sheet until mount so SSR/client `aria-controls` ids stay in sync. */
export function MobileNavSheet({
  open,
  onOpenChange,
  menuLabel,
  children,
}: MobileNavSheetProps) {
  const mounted = useMounted()

  const trigger = (
    <Button variant="ghost" size="icon" aria-label={menuLabel} type="button">
      <Menu className="h-5 w-5" aria-hidden />
    </Button>
  )

  if (!mounted) {
    return trigger
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-[300px] overscroll-contain">
        {children}
      </SheetContent>
    </Sheet>
  )
}
