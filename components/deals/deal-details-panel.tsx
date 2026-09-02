'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DealFactRow } from '@/components/deals/deal-fact-row'
import { formatDate } from '@/lib/date-utils'
import type { Deal } from '@/lib/types'
import { useI18n } from '@/lib/i18n/provider'

export function DealDetailsPanel({ deal }: { deal: Deal }) {
  const { t } = useI18n()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t('dealDetail.dealInformation')}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <DealFactRow label={t('dealDetail.labelPymeBuyer')}>
          {deal.pymeId ? (
            <Link href={`/pymes/${deal.pymeId}`} className="hover:underline">
              {deal.pymeName}
            </Link>
          ) : (
            deal.pymeName
          )}
        </DealFactRow>
        <DealFactRow label={t('dealDetail.stakeholderLabelSupplier')}>
          {deal.supplierId ? (
            <Link href={`/suppliers/${deal.supplierId}`} className="hover:underline">
              {deal.supplier}
            </Link>
          ) : (
            deal.supplier
          )}
        </DealFactRow>
        <DealFactRow label={t('dealDetail.labelCreatedShort')}>{formatDate(deal.createdAt)}</DealFactRow>
        {deal.fundedAt && (
          <DealFactRow label={t('dealDetail.labelFundedShort')}>{formatDate(deal.fundedAt)}</DealFactRow>
        )}
        {deal.fundingExpiresAt && (
          <DealFactRow label={t('dealDetail.fundingDeadlineLabel')}>
            {formatDate(deal.fundingExpiresAt)}
          </DealFactRow>
        )}
        <DealFactRow label={t('dealDetail.fundingWindowLabel')}>
          {t('dealDetail.fundingWindowWithExtensions', {
            days: deal.fundingWindowDays ?? '—',
            ext:
              deal.extensionCount > 0
                ? ` ${t('dealDetail.extensionsCount', { count: deal.extensionCount })}`
                : '',
          })}
        </DealFactRow>
      </CardContent>
    </Card>
  )
}
