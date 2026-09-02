'use client'

import { useCallback } from 'react'
import { type ISupportedWallet } from '@creit.tech/stellar-wallets-kit'
import { stellarWalletKit } from '@/lib/trustless/wallet-kit'
import type { ConnectedWallet } from '@/lib/mercato-wallet'

export function useExternalWallet(persistWallet: (w: ConnectedWallet | null) => void) {
  const connectExternalWallet = useCallback(async () => {
    if (!stellarWalletKit) return

    await stellarWalletKit.openModal({
      modalTitle: 'Connect Your Stellar Wallet',
      onWalletSelected: async (option: ISupportedWallet) => {
        stellarWalletKit.setWallet(option.id)
        const { address } = await stellarWalletKit.getAddress()
        persistWallet({
          provider: 'stellar-wallets-kit',
          publicKey: address,
          isEmbedded: false,
          status: 'active',
          walletName: option.name,
        })
      },
    })
  }, [persistWallet])

  return { connectExternalWallet }
}
