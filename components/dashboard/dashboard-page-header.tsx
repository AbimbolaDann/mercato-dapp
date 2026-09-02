type DashboardPageHeaderProps = {
  title: string
  description?: string
}

export function DashboardPageHeader({ title, description }: DashboardPageHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="font-display text-3xl font-normal tracking-tight text-foreground md:text-4xl">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-base text-muted-foreground">{description}</p>}
    </header>
  )
}
