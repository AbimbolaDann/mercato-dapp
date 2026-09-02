'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LATAM_COUNTRIES, SECTORS } from '@/lib/constants'
import { useI18n } from '@/lib/i18n/provider'

export type CompanyFieldsValues = {
  company_name: string
  phone: string
  country: string
  sector: string
}

type SupplierCompanyFieldsProps = {
  idPrefix: string
  values: CompanyFieldsValues
  onChange: (patch: Partial<CompanyFieldsValues>) => void
  showName?: boolean
}

export function SupplierCompanyFields({
  idPrefix,
  values,
  onChange,
  showName = true,
}: SupplierCompanyFieldsProps) {
  const { t } = useI18n()

  return (
    <div className="space-y-4">
      {showName && (
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-company-name`}>{t('supplierProfile.companyName')}</Label>
          <Input
            id={`${idPrefix}-company-name`}
            value={values.company_name}
            onChange={(e) => onChange({ company_name: e.target.value })}
            placeholder={t('supplierProfile.placeholderCompanyPh')}
            autoComplete="organization"
          />
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-phone`}>{t('supplierProfile.phone')}</Label>
          <Input
            id={`${idPrefix}-phone`}
            type="tel"
            value={values.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder={t('supplierProfile.placeholderPhonePh')}
            autoComplete="tel"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-country`}>{t('supplierProfile.country')}</Label>
          <Select value={values.country || undefined} onValueChange={(v) => onChange({ country: v })}>
            <SelectTrigger id={`${idPrefix}-country`} aria-label={t('supplierProfile.country')}>
              <SelectValue placeholder={t('supplierProfile.selectCountry')} />
            </SelectTrigger>
            <SelectContent>
              {LATAM_COUNTRIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-sector`}>{t('supplierProfile.sector')}</Label>
        <Select value={values.sector || undefined} onValueChange={(v) => onChange({ sector: v })}>
          <SelectTrigger id={`${idPrefix}-sector`} aria-label={t('supplierProfile.sector')}>
            <SelectValue placeholder={t('supplierProfile.selectSector')} />
          </SelectTrigger>
          <SelectContent>
            {SECTORS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
