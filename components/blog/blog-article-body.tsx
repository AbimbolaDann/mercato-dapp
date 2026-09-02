import type { BlogSection } from '@/lib/blog/types'
import { cn } from '@/lib/utils'

export function BlogArticleBody({ sections }: { sections: BlogSection[] }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-normal prose-headings:tracking-tight prose-p:leading-7 prose-li:leading-7">
      {sections.map((section, index) => {
        switch (section.type) {
          case 'paragraph':
            return (
              <p key={index} className="text-base text-foreground/90">
                {section.text}
              </p>
            )
          case 'heading':
            if (section.level === 2) {
              return (
                <h2 key={index} className="mt-10 scroll-mt-24 text-2xl font-semibold first:mt-0">
                  {section.text}
                </h2>
              )
            }
            return (
              <h3 key={index} className="mt-8 scroll-mt-24 text-xl font-semibold">
                {section.text}
              </h3>
            )
          case 'list': {
            const Tag = section.ordered ? 'ol' : 'ul'
            return (
              <Tag
                key={index}
                className={cn(
                  'my-4 space-y-2 pl-5 text-base',
                  section.ordered ? 'list-decimal' : 'list-disc',
                )}
              >
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </Tag>
            )
          }
          case 'callout':
            return (
              <aside
                key={index}
                className="my-6 rounded-xl border border-emerald-500/20 bg-emerald-50/60 px-5 py-4 dark:bg-emerald-950/20"
              >
                {section.title && (
                  <p className="mb-1 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    {section.title}
                  </p>
                )}
                <p className="text-sm leading-relaxed text-foreground/90">{section.text}</p>
              </aside>
            )
          case 'faq':
            return (
              <div key={index} className="my-8 space-y-4">
                {section.items.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-xl border border-border/70 bg-muted/20 px-5 py-4"
                  >
                    <h3 className="text-base font-semibold">{item.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
