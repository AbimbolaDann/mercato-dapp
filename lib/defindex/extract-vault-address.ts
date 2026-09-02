import { isLikelyStellarContractId } from '@/lib/defindex/stellar-address'

function normalizeContractId(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return isLikelyStellarContractId(trimmed) ? trimmed : null
}

/** Vault address returned by DeFindex simulate-before-create (`simulationResponse`). */
export function extractVaultFromCreateVaultResponse(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null
  const simulationResponse = (payload as { simulationResponse?: unknown }).simulationResponse
  return normalizeContractId(simulationResponse)
}

/** Vault address from submit (`result.value` or top-level fields). */
export function extractVaultFromSubmitResponse(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null
  const o = payload as Record<string, unknown>

  const fromResult = normalizeContractId(
    o.result && typeof o.result === 'object'
      ? (o.result as { value?: unknown }).value
      : null,
  )
  if (fromResult) return fromResult

  return (
    normalizeContractId(o.value) ??
    normalizeContractId(o.simulationResponse) ??
    normalizeContractId(o.vaultAddress)
  )
}

/** Prefer on-chain submit result, then pre-submit simulation. */
export function resolveDeployedVaultAddress(
  createPayload: unknown,
  submitPayload: unknown,
): string | null {
  return (
    extractVaultFromSubmitResponse(submitPayload) ??
    extractVaultFromCreateVaultResponse(createPayload)
  )
}

export function buildVaultEnvLines(vaultAddress: string): {
  publicVar: string
  serverVar: string
  block: string
} {
  const publicVar = `NEXT_PUBLIC_DEFINDEX_VAULT_ADDRESS=${vaultAddress}`
  const serverVar = `MERCATO_DEFINDEX_VAULT_ADDRESS=${vaultAddress}`
  return {
    publicVar,
    serverVar,
    block: `${publicVar}\n${serverVar}`,
  }
}
