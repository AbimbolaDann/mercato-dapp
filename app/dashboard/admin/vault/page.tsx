import { Landmark } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AdminVaultPageClient } from '@/components/admin/admin-vault-page-client'
import { getConfiguredVaultAddress, requireAdminProfile } from '@/lib/admin/require-admin'
import { getServerDictionary, tr } from '@/lib/i18n/server'

export default async function AdminVaultPage() {
  await requireAdminProfile()
  const m = await getServerDictionary()
  const configuredVaultAddress = getConfiguredVaultAddress()

  return (
    <div className="space-y-6">
      <header>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <Landmark className="h-5 w-5 text-primary" aria-hidden />
          <h1 className="text-2xl font-bold tracking-tight">{tr(m, 'adminPage.vaultTitle')}</h1>
          <Badge variant="secondary" className="text-xs">
            Admin
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{tr(m, 'adminPage.vaultPageSubtitle')}</p>
      </header>

      <AdminVaultPageClient configuredVaultAddress={configuredVaultAddress} />
    </div>
  )
}
