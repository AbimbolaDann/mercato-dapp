import { Networks } from '@stellar/stellar-sdk'

export type StellarNetwork = 'testnet' | 'mainnet'

export function getAppStellarNetwork(): StellarNetwork {
  return process.env.NEXT_PUBLIC_TRUSTLESS_NETWORK === 'mainnet' ? 'mainnet' : 'testnet'
}

export function getStellarNetworkConfig(network: StellarNetwork = getAppStellarNetwork()) {
  return {
    horizonUrl:
      network === 'mainnet' ? 'https://horizon.stellar.org' : 'https://horizon-testnet.stellar.org',
    rpcUrl:
      network === 'mainnet'
        ? 'https://soroban-rpc.mainnet.stellar.org'
        : 'https://soroban-testnet.stellar.org',
    networkPassphrase: network === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET,
  }
}
