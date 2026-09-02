export interface NavProfile {
  full_name?: string
  contact_name?: string
  company_name?: string
  user_type?: string
  avatar_url?: string | null
}

export interface NavUser {
  id: string
  email?: string
}

export interface WalletNavProps {
  isConnected: boolean
  address: string | undefined
  truncatedAddress: string | null
  onConnect: () => void
  onConnectPollar: () => void
  onDisconnect: () => void
  provider?: 'stellar-wallets-kit' | 'pollar' | null
  status?: 'pending' | 'active' | null
  isEmbedded?: boolean
}
