import { redirect } from 'next/navigation'

export async function generateMetadata() {
  return {
    title: 'Marketplace | Mercato',
    description: 'Redirecting to Mercato deals browser...',
    alternates: {
      canonical: '/marketplace',
    },
    robots: { index: false, follow: true },
  }
}

/** @deprecated Use `/deals` — kept for bookmarks and external links. */
export default async function MarketplaceRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const filter = sp.filter
  const q =
    typeof filter === 'string' && filter
      ? `?filter=${encodeURIComponent(filter)}`
      : ''
  redirect(`/deals${q}`)
}
