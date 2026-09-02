'use client'

import { useState } from 'react'
import { Package, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/lib/i18n/provider'
import { toast } from 'sonner'

type UserType = 'pyme' | 'investor' | 'supplier'

interface SelectRoleModalProps {
  userId: string
  onComplete: (userType: UserType) => void
}

export function SelectRoleModal({ userId, onComplete }: SelectRoleModalProps) {
  const { t } = useI18n()
  const [selected, setSelected] = useState<UserType>('pyme')
  const [isSaving, setIsSaving] = useState(false)

  const handleContinue = async () => {
    setIsSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('profiles')
      .update({ user_type: selected })
      .eq('id', userId)

    setIsSaving(false)

    if (error) {
      toast.error(t('auth.genericError'))
      return
    }

    onComplete(selected)
  }

  const roles: { value: UserType; label: string; hint: string; Icon: typeof Package }[] = [
    { value: 'pyme', label: t('auth.rolePyme'), hint: t('auth.rolePymeHint'), Icon: Package },
    { value: 'investor', label: t('auth.roleInvestor'), hint: t('auth.roleInvestorHint'), Icon: TrendingUp },
    { value: 'supplier', label: t('auth.roleSupplier'), hint: t('auth.roleSupplierHint'), Icon: Users },
  ]

  return (
    <Dialog open>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">{t('auth.selectRoleTitle')}</DialogTitle>
          <DialogDescription>{t('auth.selectRoleDescription')}</DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={selected}
          onValueChange={(v) => setSelected(v as UserType)}
          className="grid grid-cols-3 gap-3 py-2"
        >
          {roles.map(({ value, label, hint, Icon }) => (
            <label
              key={value}
              htmlFor={`role-modal-${value}`}
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 transition-colors ${
                selected === value
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/50'
              }`}
            >
              <RadioGroupItem value={value} id={`role-modal-${value}`} className="sr-only" />
              <Icon className="h-7 w-7 shrink-0" aria-hidden />
              <span className="text-sm font-medium">{label}</span>
              <span className="text-center text-xs text-muted-foreground">{hint}</span>
            </label>
          ))}
        </RadioGroup>

        <Button
          className="mt-2 h-11 w-full font-medium"
          onClick={handleContinue}
          disabled={isSaving}
        >
          {isSaving ? t('auth.selectRoleSaving') : t('auth.selectRoleContinue')}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
