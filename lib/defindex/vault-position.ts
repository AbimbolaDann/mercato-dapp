import { rawToDisplayAmount } from './amounts'

export type VaultOwnershipBreakdown = {
  userPositionDisplay: number
  vaultTvlDisplay: number
  othersDisplay: number
  userSharePercent: number
  othersSharePercent: number
  hasPosition: boolean
  isSoleDepositor: boolean
}

export type VaultPositionSummary = VaultOwnershipBreakdown & {
  dfTokensRaw: number
  dfTokensDisplay: number
  apy: number | null
  estimatedYearlyYieldDisplay: number | null
  supplySymbol: string
}

export function computeVaultOwnershipBreakdown(input: {
  userPositionDisplay: number
  vaultTvlDisplay: number
}): VaultOwnershipBreakdown {
  const user = Math.max(0, input.userPositionDisplay)
  const tvl = Math.max(0, input.vaultTvlDisplay)

  if (user <= 0) {
    return {
      userPositionDisplay: 0,
      vaultTvlDisplay: tvl,
      othersDisplay: tvl,
      userSharePercent: 0,
      othersSharePercent: tvl > 0 ? 100 : 0,
      hasPosition: false,
      isSoleDepositor: false,
    }
  }

  if (tvl <= 0) {
    return {
      userPositionDisplay: user,
      vaultTvlDisplay: 0,
      othersDisplay: 0,
      userSharePercent: 100,
      othersSharePercent: 0,
      hasPosition: true,
      isSoleDepositor: true,
    }
  }

  const cappedUser = Math.min(user, tvl)
  const others = Math.max(0, tvl - cappedUser)
  const userSharePercent = (cappedUser / tvl) * 100
  const othersSharePercent = Math.max(0, 100 - userSharePercent)

  return {
    userPositionDisplay: cappedUser,
    vaultTvlDisplay: tvl,
    othersDisplay: others,
    userSharePercent,
    othersSharePercent,
    hasPosition: true,
    isSoleDepositor: others <= 0.000001,
  }
}

export function buildVaultPositionSummary(input: {
  userPositionDisplay: number
  vaultTvlDisplay: number
  dfTokensRaw: number
  apy?: number | null
  supplySymbol?: string
  assetDecimals?: number
}): VaultPositionSummary {
  const breakdown = computeVaultOwnershipBreakdown({
    userPositionDisplay: input.userPositionDisplay,
    vaultTvlDisplay: input.vaultTvlDisplay,
  })

  const dfTokensDisplay = rawToDisplayAmount(input.dfTokensRaw, input.assetDecimals)
  const apy =
    typeof input.apy === 'number' && Number.isFinite(input.apy) && input.apy > 0 ? input.apy : null
  const estimatedYearlyYieldDisplay =
    apy != null && breakdown.userPositionDisplay > 0
      ? (breakdown.userPositionDisplay * apy) / 100
      : null

  return {
    ...breakdown,
    dfTokensRaw: input.dfTokensRaw,
    dfTokensDisplay,
    apy,
    estimatedYearlyYieldDisplay,
    supplySymbol: input.supplySymbol ?? 'USDC',
  }
}
