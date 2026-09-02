import { Suspense } from 'react'
import { DealsBrowse } from './deals-browse'
import { getServerDictionary } from '@/lib/i18n/server'
import { JsonLd } from '@/components/seo/json-ld'

export async function generateMetadata() {
  return {
    title: 'Browse Deals | Mercato Supply Chain Finance',
    description: 'Explore live supply chain invoice financing deals in Latin America. Support PyMEs and earn short-term yield secured by smart contracts.',
    alternates: {
      canonical: '/deals',
      languages: {
        en: '/deals?lang=en',
        es: '/deals?lang=es',
      },
    },
  }
}

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
  ],
}

export default async function DealsPage() {
  const dict = await getServerDictionary()

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <Suspense
        fallback={
          <div className="flex min-h-screen flex-col">
            <div className="container mx-auto px-4 py-8">
              <p className="text-muted-foreground">{dict.deals.loadingDeals}</p>
            </div>
          </div>
        }
      >
        <DealsBrowse />
      </Suspense>
    </>
  )
}
