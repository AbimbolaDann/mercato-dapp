'use client'

import { useWalletContext } from '@/providers/wallet-provider'

export function useMercatoWallet() {
  return useWalletContext()
}
