'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle2, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CopyableCodeLine } from '@/components/admin/copyable-code-line'
import { buildVaultEnvLines } from '@/lib/defindex/extract-vault-address'

type VaultDeploymentChecklistProps = {
  txHash: string
  vaultAddress: string | null
  managerAddress: string
  strategyAddress: string
}

export function VaultDeploymentChecklist({
  txHash,
  vaultAddress,
  managerAddress,
  strategyAddress,
}: VaultDeploymentChecklistProps) {
  const [copiedCurl, setCopiedCurl] = useState(false)
  const envLines = vaultAddress ? buildVaultEnvLines(vaultAddress) : null

  const manager = managerAddress.trim() || 'YOUR_MANAGER_ADDRESS'
  const strategy = strategyAddress.trim() || 'STRATEGY_ADDRESS'
  const vault = vaultAddress ?? 'VAULT_ADDRESS'

  const rebalanceCurl = `curl -X POST https://api.defindex.io/vault/${vault}/rebalance?network=testnet \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"caller":"${manager}","instructions":[{"type":"Invest","strategy_address":"${strategy}","amount":1000000}]}'`

  const copyCurl = async () => {
    try {
      await navigator.clipboard.writeText(rebalanceCurl)
      setCopiedCurl(true)
      toast.success('Copied rebalance command')
      setTimeout(() => setCopiedCurl(false), 2000)
    } catch {
      toast.error('Could not copy to clipboard')
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
        <p className="font-semibold text-emerald-700 dark:text-emerald-400">
          Vault deployed — complete these 3 steps to go live
        </p>
      </div>

      {vaultAddress ? (
        <div className="space-y-2">
          <p className="font-medium text-foreground">Vault contract address</p>
          <CopyableCodeLine value={vaultAddress} label="vault address" />
          <p className="text-muted-foreground">
            Detected from the DeFindex create-vault simulation and on-chain submit response.
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground">
          We could not read the vault address automatically. Open the transaction on Stellar Expert and copy the new{' '}
          <code className="rounded bg-muted px-0.5">C…</code> contract from the result.
        </p>
      )}

      <CopyableCodeLine value={txHash} label="transaction hash" />

      <ol className="space-y-3 pl-1">
        <li className="flex gap-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
            1
          </span>
          <div>
            <p className="font-medium text-foreground">Verify on explorer</p>
            <p className="mt-0.5 text-muted-foreground">
              <a
                href={`https://testnet.stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 underline underline-offset-2"
              >
                View transaction on Stellar Expert <ExternalLink className="h-2.5 w-2.5" />
              </a>
              {vaultAddress ? ' — address above should match the deployed contract.' : '.'}
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
            2
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="font-medium text-foreground">Set env vars &amp; redeploy</p>
            <p className="text-muted-foreground">
              Add to <code className="rounded bg-muted px-0.5">.env</code> (use copy on each line):
            </p>
            {envLines ? (
              <>
                <CopyableCodeLine value={envLines.publicVar} label="NEXT_PUBLIC_DEFINDEX_VAULT_ADDRESS" />
                <CopyableCodeLine value={envLines.serverVar} label="MERCATO_DEFINDEX_VAULT_ADDRESS" />
                <CopyableCodeLine value={envLines.block} label=".env block" />
              </>
            ) : (
              <p className="text-muted-foreground">
                Paste your <code className="rounded bg-muted px-0.5">C…</code> address into{' '}
                <code className="rounded bg-muted px-0.5">NEXT_PUBLIC_DEFINDEX_VAULT_ADDRESS</code> and{' '}
                <code className="rounded bg-muted px-0.5">MERCATO_DEFINDEX_VAULT_ADDRESS</code>.
              </p>
            )}
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
            3
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="font-medium text-foreground">First deposit + first rebalance</p>
            <p className="text-muted-foreground">
              On the <strong>Monitor</strong> tab, use <strong>Activate vault for investors</strong> to sign deposit and
              rebalance in-app. Or use the advanced curl below (minimum 1001 stroops deposit first).
            </p>
            <div className="relative">
              <pre className="rounded-md border border-border/80 bg-muted/50 px-2 py-1.5 pr-10 text-[11px] leading-relaxed whitespace-pre-wrap">
                {rebalanceCurl}
              </pre>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7"
                onClick={() => void copyCurl()}
                aria-label="Copy rebalance curl"
                title="Copy rebalance curl"
              >
                {copiedCurl ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                )}
              </Button>
            </div>
          </div>
        </li>
      </ol>
    </div>
  )
}
