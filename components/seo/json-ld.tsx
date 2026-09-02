export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD is non-interactive SEO markup. Browser wallet extensions
      // (Leather, MetaMask, etc.) inject <script> tags into the DOM, which
      // shifts sibling order and trips React's hydration check on these nodes.
      // Suppress the expected mismatch rather than letting it spam the console.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
