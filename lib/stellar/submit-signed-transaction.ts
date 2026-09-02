import { rpc, Transaction, TransactionBuilder } from '@stellar/stellar-sdk'
import { getAppStellarNetwork, getStellarNetworkConfig } from '@/lib/stellar/network-config'

export type StellarSubmitResult = {
  success: boolean
  txHash?: string
  status?: string
  error?: string
}

/** Submit a signed Soroban/classic transaction XDR via Stellar RPC. */
export async function submitSignedStellarTransactionXdr(
  signedXdr: string,
  network = getAppStellarNetwork(),
): Promise<StellarSubmitResult> {
  const { rpcUrl, networkPassphrase } = getStellarNetworkConfig(network)
  const rpcServer = new rpc.Server(rpcUrl)

  const transaction = TransactionBuilder.fromXDR(signedXdr, networkPassphrase) as Transaction

  const response = await rpcServer.sendTransaction(transaction)
  if (response.status === 'ERROR') {
    const error =
      typeof response.errorResult === 'string'
        ? response.errorResult
        : response.errorResult?.toXDR?.('base64') ?? 'Transaction submission failed.'
    return { success: false, error }
  }

  return {
    success: true,
    txHash: response.hash,
    status: response.status,
  }
}
