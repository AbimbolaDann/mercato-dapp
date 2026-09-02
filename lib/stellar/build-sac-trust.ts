import {
  Address,
  BASE_FEE,
  Contract,
  rpc,
  TransactionBuilder,
} from '@stellar/stellar-sdk'
import { isLikelyStellarAccountId, isLikelyStellarContractId } from '@/lib/defindex/stellar-address'
import { getStellarNetworkConfig, type StellarNetwork } from '@/lib/stellar/network-config'

export async function buildSacTrustTransactionXdr(
  sourceAccount: string,
  assetContract: string,
  network: StellarNetwork,
): Promise<string> {
  if (!isLikelyStellarAccountId(sourceAccount)) {
    throw new Error('Invalid Stellar account.')
  }
  if (!isLikelyStellarContractId(assetContract)) {
    throw new Error('Invalid asset contract address.')
  }

  const { rpcUrl, networkPassphrase } = getStellarNetworkConfig(network)
  const rpcServer = new rpc.Server(rpcUrl)
  const account = await rpcServer.getAccount(sourceAccount)

  const contract = new Contract(assetContract)
  const operation = contract.call('trust', new Address(sourceAccount).toScVal())

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(operation)
    .setTimeout(180)
    .build()

  const prepared = await rpcServer.prepareTransaction(transaction)
  return prepared.toXDR()
}
