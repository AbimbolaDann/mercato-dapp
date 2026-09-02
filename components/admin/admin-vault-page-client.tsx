'use client'

import { Landmark, Settings2 } from 'lucide-react'
import { AdminDefindexVaultPanel } from '@/components/admin/admin-defindex-vault-panel'
import { AdminVaultMonitor } from '@/components/admin/admin-vault-monitor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useI18n } from '@/lib/i18n/provider'

type AdminVaultPageClientProps = {
  configuredVaultAddress: string
}

export function AdminVaultPageClient({ configuredVaultAddress }: AdminVaultPageClientProps) {
  const { messages } = useI18n()
  const m = messages.adminVaultMonitor

  return (
    <Tabs defaultValue="monitor" className="space-y-6">
      <TabsList className="h-10 w-full justify-start rounded-xl border border-border bg-card px-1 sm:w-auto">
        <TabsTrigger value="monitor" className="gap-2 rounded-lg text-sm">
          <Landmark className="h-4 w-4" aria-hidden />
          {m.tabMonitor}
        </TabsTrigger>
        <TabsTrigger value="setup" className="gap-2 rounded-lg text-sm">
          <Settings2 className="h-4 w-4" aria-hidden />
          {m.tabSetup}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="monitor" className="mt-0">
        <AdminVaultMonitor configuredVaultAddress={configuredVaultAddress} />
      </TabsContent>

      <TabsContent value="setup" className="mt-0 space-y-6">
        <AdminDefindexVaultPanel configuredVaultAddress={configuredVaultAddress} />
      </TabsContent>
    </Tabs>
  )
}
