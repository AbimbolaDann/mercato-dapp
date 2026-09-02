import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DealDetailPageClient from './deal-detail-view'
import { JsonLd } from '@/components/seo/json-ld'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: dbDeal } = await supabase
    .from('deals')
    .select(`
      *,
      pyme:profiles!deals_pyme_id_fkey(company_name, full_name, contact_name)
    `)
    .eq('id', id)
    .single()

  if (!dbDeal) {
    return {
      title: 'Deal Not Found | Mercato',
    }
  }

  const dealName = dbDeal.product_name || dbDeal.title || 'Supply Chain Deal'
  const pymeName = dbDeal.pyme?.company_name || dbDeal.pyme?.full_name || dbDeal.pyme?.contact_name || 'PyME'
  const desc = dbDeal.description || `Supply chain finance deal on Mercato: ${dealName} for ${pymeName}.`

  return {
    title: `${dealName} | Mercato Deals`,
    description: desc,
    openGraph: {
      title: `${dealName} | Mercato`,
      description: desc,
      type: 'website',
    },
    alternates: {
      canonical: `/deals/${id}`,
      languages: {
        en: `/deals/${id}?lang=en`,
        es: `/deals/${id}?lang=es`,
      },
    },
  }
}

export default async function DealDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: dbDeal } = await supabase
    .from('deals')
    .select('id, product_name, title')
    .eq('id', id)
    .single()

  if (!dbDeal) {
    notFound()
  }

  const displayName = dbDeal.product_name || dbDeal.title || 'Deal Detail'

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://mercato.app',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Deals',
        'item': 'https://mercato.app/deals',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': displayName,
        'item': `https://mercato.app/deals/${dbDeal.id}`,
      },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <DealDetailPageClient />
    </>
  )
}
