import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { LandingFooter } from '@/components/landing/landing-footer'

export function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <div className="min-h-[calc(100vh-4rem)] bg-background">{children}</div>
      <LandingFooter />
    </>
  )
}

export function BlogBreadcrumbs({
  items,
}: {
  items: Array<{ label: string; href?: string }>
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden>/</span>}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
