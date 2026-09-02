import Link from 'next/link'
import { ArrowRight, LineChart } from 'lucide-react'
import { Button } from '@/components/ui/button'

type InvestmentsEmptyProps = {
  labels: {
    emptyTitle: string
    emptyDescription: string
    browseDeals: string
  }
}

export function InvestmentsEmpty({ labels }: InvestmentsEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/50 px-6 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
        <LineChart className="h-8 w-8 text-emerald-600 dark:text-emerald-400" aria-hidden />
      </div>
      <h2 className="mb-2 text-xl font-semibold">{labels.emptyTitle}</h2>
      <p className="mb-8 max-w-md text-sm text-muted-foreground">{labels.emptyDescription}</p>
      <Button asChild size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-700">
        <Link href="/deals">
          {labels.browseDeals}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
