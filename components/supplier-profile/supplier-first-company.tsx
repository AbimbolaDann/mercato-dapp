'use client'

import { useState } from 'react'
import { Building2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useI18n } from '@/lib/i18n/provider'
import { toast } from 'sonner'
import {
  SupplierCompanyFields,
  type CompanyFieldsValues,
} from './supplier-company-fields'

const EMPTY: CompanyFieldsValues = {
  company_name: '',
  phone: '',
  country: '',
  sector: '',
}

type SupplierFirstCompanyProps = {
  onCreate: (payload: CompanyFieldsValues) => Promise<boolean>
}

export function SupplierFirstCompany({ onCreate }: SupplierFirstCompanyProps) {
  const { t } = useI18n()
  const [values, setValues] = useState<CompanyFieldsValues>(EMPTY)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!values.company_name.trim()) return
    setSaving(true)
    try {
      const ok = await onCreate(values)
      if (ok) {
        setValues(EMPTY)
        toast.success(t('supplierProfile.toastCompanyCreated'))
      }
    } catch (err) {
      const e = err as { message?: string; code?: string; details?: string; hint?: string }
      console.error('Error creating supplier company:', e?.message ?? err, {
        code: e?.code,
        details: e?.details,
        hint: e?.hint,
      })
      toast.error(t('supplierProfile.toastCompanyCreateFail'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="mx-auto max-w-xl border-amber-500/20 shadow-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-800 dark:text-amber-300">
          <Building2 className="h-6 w-6" aria-hidden />
        </div>
        <CardTitle>{t('supplierProfile.firstCompanyTitle')}</CardTitle>
        <CardDescription>{t('supplierProfile.firstCompanyDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <SupplierCompanyFields
            idPrefix="first"
            values={values}
            onChange={(patch) => setValues((prev) => ({ ...prev, ...patch }))}
          />
          <Button type="submit" disabled={saving || !values.company_name.trim()} className="w-full rounded-full">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                {t('supplierProfile.creating')}
              </>
            ) : (
              t('supplierProfile.createCompany')
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
