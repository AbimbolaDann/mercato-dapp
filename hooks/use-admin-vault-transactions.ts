'use client'

import { useCallback } from 'react'
import type { SendTransactionResponse } from '@defindex/sdk'
import { useWallet } from '@/hooks/use-wallet'
import { usePollarSession } from '@/providers/pollar-provider'
import { signTransaction } from '@/lib/trustless/wallet-kit'

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: unknown }
    if (typeof data?.error === 'string' && data.error) return data.error
  } catch {
    /* ignore */
  }
  return `Request failed (${response.status})`
}

export function useAdminVaultTransactions() {
  const { walletInfo, provider } = useWallet()
  const pollar = usePollarSession()

  const signAndSubmit = useCallback(
    async (unsignedXdr: string, signerAddress: string): Promise<SendTransactionResponse> => {
      if (provider === 'pollar') {
        const txHash = await pollar.signAndSubmitTx(unsignedXdr)
        return { success: true, txHash } as SendTransactionResponse
      }

      const signedXdr = await signTransaction({
        unsignedTransaction: unsignedXdr,
        address: signerAddress,
      })
      const submitResponse = await fetch('/api/defindex/submit', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xdr: signedXdr }),
      })
      if (!submitResponse.ok) throw new Error(await readErrorMessage(submitResponse))
      return (await submitResponse.json()) as SendTransactionResponse
    },
    [pollar, provider],
  )

  const submitAdminXdr = useCallback(
    async (endpoint: string, body: Record<string, unknown>) => {
      const address = walletInfo?.address?.trim()
      if (!address) throw new Error('Connect your admin wallet first.')

      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, caller: address }),
      })
      if (!res.ok) throw new Error(await readErrorMessage(res))

      const { xdr } = (await res.json()) as { xdr?: string }
      if (!xdr) throw new Error('No transaction XDR returned.')

      return signAndSubmit(xdr, address)
    },
    [signAndSubmit, walletInfo?.address],
  )

  const signPreparedXdr = useCallback(
    async (unsignedXdr: string) => {
      const address = walletInfo?.address?.trim()
      if (!address) throw new Error('Connect your admin wallet first.')

      if (provider === 'pollar') {
        const txHash = await pollar.signAndSubmitTx(unsignedXdr)
        return { success: true, txHash } as SendTransactionResponse
      }

      const signedXdr = await signTransaction({
        unsignedTransaction: unsignedXdr,
        address,
      })

      const submitResponse = await fetch('/api/stellar/submit', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xdr: signedXdr }),
      })
      if (!submitResponse.ok) throw new Error(await readErrorMessage(submitResponse))

      const result = (await submitResponse.json()) as { success?: boolean; txHash?: string }
      return {
        success: result.success !== false,
        txHash: result.txHash,
      } as SendTransactionResponse
    },
    [pollar, provider, walletInfo?.address],
  )

  return {
    walletAddress: walletInfo?.address ?? null,
    provider,
    signAndSubmit,
    signPreparedXdr,
    submitAdminXdr,
  }
}
