'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AlertTriangle, CheckCircle2, ExternalLink, Loader2, Shield } from 'lucide-react'
import { CopyableCodeLine } from '@/components/admin/copyable-code-line'
import { Button } from '@/components/ui/button'
import { useAdminVaultTransactions } from '@/hooks/use-admin-vault-transactions'
import { useI18n } from '@/lib/i18n/provider'
import {
  BLEND_TESTNET_FAUCET_URL,
  BLEND_TESTNET_USDC_CONTRACT,
  type ClassicBalanceHint,
  getVaultAssetTrustlineCopyTargets,
} from '@/lib/stellar/vault-asset-trustline'
import {
  fetchTrustlineStatus,
  invalidateTrustlineStatusCache,
} from '@/lib/stellar/trustline-status-client'

function sacTrustStorageKey(account: string, contract: string) {
  return `mercato:sac-trust:${account}:${contract}`
}

type VaultAssetTrustlineCardProps = {
  assetContract: string
  assetSymbol?: string
  assetName?: string
  onTrustlineReady?: () => void
}

export function VaultAssetTrustlineCard({
  assetContract,
  assetSymbol,
  assetName,
  onTrustlineReady,
}: VaultAssetTrustlineCardProps) {
  const { messages } = useI18n()
  const m = messages.adminVaultMonitor
  const { walletAddress, signPreparedXdr } = useAdminVaultTransactions()

  const [sacTrustReady, setSacTrustReady] = useState(false)
  const [classicBlendBalances, setClassicBlendBalances] = useState<ClassicBalanceHint[]>([])
  const [checking, setChecking] = useState(false)
  const [busyTrust, setBusyTrust] = useState(false)

  const copyTargets = getVaultAssetTrustlineCopyTargets(assetContract, assetSymbol, assetName)
  const isBlendAsset =
    assetContract === BLEND_TESTNET_USDC_CONTRACT || assetSymbol?.toUpperCase().includes('USDC')

  const markSacTrustReady = useCallback(
    (options?: { notifyParent?: boolean }) => {
      setSacTrustReady(true)
      if (walletAddress?.trim()) {
        try {
          sessionStorage.setItem(sacTrustStorageKey(walletAddress, assetContract), '1')
        } catch {
          /* ignore */
        }
      }
      if (options?.notifyParent !== false) {
        onTrustlineReady?.()
      }
    },
    [walletAddress, assetContract, onTrustlineReady],
  )

  useEffect(() => {
    if (!walletAddress?.trim()) {
      setSacTrustReady(false)
      return
    }
    try {
      const stored = sessionStorage.getItem(sacTrustStorageKey(walletAddress, assetContract))
      if (stored === '1') {
        setSacTrustReady(true)
      }
    } catch {
      /* ignore */
    }
  }, [walletAddress, assetContract])

  const refreshStatus = useCallback(async () => {
    if (!walletAddress?.trim()) {
      setClassicBlendBalances([])
      return
    }
    setChecking(true)
    try {
      const data = await fetchTrustlineStatus(walletAddress, assetContract, assetSymbol)
      setClassicBlendBalances(data.classicBlendBalances ?? [])
      if (data.hasVaultSacTrust) markSacTrustReady()
    } catch {
      setClassicBlendBalances([])
    } finally {
      setChecking(false)
    }
  }, [walletAddress, assetContract, assetSymbol, markSacTrustReady])

  useEffect(() => {
    void refreshStatus()
  }, [refreshStatus])

  const onAddTrustline = async () => {
    if (!walletAddress) {
      toast.error(m.trustConnectWallet)
      return
    }
    setBusyTrust(true)
    try {
      const buildRes = await fetch('/api/stellar/build-sac-trust', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceAccount: walletAddress, assetContract }),
      })
      if (!buildRes.ok) {
        const data = (await buildRes.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? m.trustBuildFailed)
      }
      const { xdr } = (await buildRes.json()) as { xdr?: string }
      if (!xdr) throw new Error(m.trustBuildFailed)

      const submitted = await signPreparedXdr(xdr)
      if (submitted?.success === false) {
        toast.error(m.txFailed)
        return
      }
      toast.success(m.trustSuccess)
      invalidateTrustlineStatusCache(walletAddress, assetContract, assetSymbol)
      markSacTrustReady()
      await refreshStatus()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : m.trustBuildFailed)
    } finally {
      setBusyTrust(false)
    }
  }

  const classicUsdc = classicBlendBalances.find((b) => b.code === 'USDC')

  if (sacTrustReady) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm text-emerald-800 dark:text-emerald-300">
        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
        <span>{m.trustReadySac}</span>
        <Button type="button" variant="ghost" size="sm" className="ml-auto h-7 text-xs" onClick={() => void refreshStatus()}>
          {m.refresh}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-lg border border-amber-500/35 bg-amber-500/5 px-4 py-3">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-semibold text-amber-950 dark:text-amber-100">{m.trustTitle}</p>
          <p className="text-xs text-amber-900/80 dark:text-amber-200/80">{m.trustSubtitle}</p>
          {classicUsdc && (
            <p className="text-xs text-emerald-800 dark:text-emerald-300">
              {m.trustClassicReceived.replace('{amount}', classicUsdc.balance)}
            </p>
          )}
          {isBlendAsset && (
            <p className="text-xs text-amber-900/80 dark:text-amber-200/80">
              {m.trustSacStep}{' '}
              {m.trustBlendHint}{' '}
              <Link
                href={BLEND_TESTNET_FAUCET_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 font-medium underline underline-offset-2"
              >
                testnet.blend.capital
                <ExternalLink className="h-2.5 w-2.5" aria-hidden />
              </Link>
            </p>
          )}
        </div>
        {checking && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" aria-hidden />}
      </div>

      <div className="space-y-2">
        {copyTargets.map((target) => (
          <div key={target.id} className="space-y-1">
            <p className="text-[11px] font-medium text-muted-foreground">{target.label}</p>
            <CopyableCodeLine value={target.value} label={target.label} />
            {target.description && (
              <p className="text-[10px] text-muted-foreground">{target.description}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          className="gap-1.5"
          disabled={!walletAddress || busyTrust}
          onClick={() => void onAddTrustline()}
        >
          {busyTrust ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : (
            <Shield className="h-3.5 w-3.5" aria-hidden />
          )}
          {m.trustCta}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={checking}
          onClick={() => void refreshStatus()}
        >
          {m.trustRecheck}
        </Button>
        {isBlendAsset && (
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href={BLEND_TESTNET_FAUCET_URL} target="_blank" rel="noreferrer">
              {m.trustOpenFaucet}
              <ExternalLink className="ml-1 h-3 w-3" aria-hidden />
            </Link>
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            markSacTrustReady()
            toast.message(m.trustManualConfirm)
          }}
        >
          {m.trustManualConfirm}
        </Button>
      </div>
    </div>
  )
}
