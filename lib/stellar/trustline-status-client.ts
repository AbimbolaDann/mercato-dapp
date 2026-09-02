import { createDedupedFetcher } from '@/lib/client/deduped-fetch'
import type { ClassicBalanceHint } from '@/lib/stellar/vault-asset-trustline'

type TrustlineStatusResponse = {
  classicBlendBalances?: ClassicBalanceHint[]
  hasVaultSacTrust?: boolean
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: unknown }
    if (typeof data?.error === 'string' && data.error) return data.error
  } catch {
    /* ignore */
  }
  return `Request failed (${response.status})`
}

const trustlineStatusRequest = createDedupedFetcher(
  async (account: string, assetContract: string, symbol?: string): Promise<TrustlineStatusResponse> => {
    const params = new URLSearchParams({
      account,
      assetContract,
    })
    if (symbol) params.set('symbol', symbol)
    const res = await fetch(`/api/stellar/trustline-status?${params}`, { credentials: 'include' })
    if (!res.ok) {
      throw new Error(await readErrorMessage(res))
    }
    return (await res.json()) as TrustlineStatusResponse
  },
  (account, assetContract, symbol) => `trustline-status:${account}:${assetContract}:${symbol ?? ''}`,
  30_000,
)

export function fetchTrustlineStatus(
  account: string,
  assetContract: string,
  symbol?: string,
): Promise<TrustlineStatusResponse> {
  return trustlineStatusRequest.fetch(account, assetContract, symbol)
}

export function invalidateTrustlineStatusCache(
  account: string,
  assetContract: string,
  symbol?: string,
) {
  trustlineStatusRequest.invalidate(account, assetContract, symbol)
}
