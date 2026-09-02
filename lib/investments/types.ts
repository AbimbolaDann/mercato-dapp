export type PortfolioMetrics = {
  totalDeployed: number
  activeCapital: number
  completedPrincipal: number
  pendingYieldAtMaturity: number
  accruedYield: number
  realizedYield: number
  weightedApr: number
  netReturnPercent: number
  dealCount: number
  activeCount: number
  completedCount: number
}

export type InvestorHistoryPage = {
  deals: EnrichedInvestorDeal[]
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}


export type InvestorDeal = {
  id: string
  title: string
  product_name: string | null
  status: string
  amount: number
  interest_rate: number | null
  term_days: number | null
  created_at: string | null
  funded_at: string | null
  pyme_id: string | null
  escrow_contract_address: string | null
  pyme?: { company_name?: string; full_name?: string; contact_name?: string } | null
}

export type PortfolioBucket = 'active' | 'completed' | 'other'

export type EnrichedInvestorDeal = InvestorDeal & {
  bucket: PortfolioBucket
  displayTitle: string
  smbName: string
  amountNum: number
  apr: number
  termDays: number
  expectedYield: number
  accruedYield: number
  termProgress: {
    percent: number
    daysElapsed: number
    daysRemaining: number
    maturityDate: Date | null
  }
  openEscrowsWithSmb: number
}

export type AllocationSlice = {
  id: string
  label: string
  amount: number
  percent: number
  dealCount: number
}

export type MaturityEvent = {
  dealId: string
  title: string
  smbName: string
  principal: number
  expectedYield: number
  maturityDate: Date
  daysUntil: number
}

export type InvestorPortfolio = {
  active: EnrichedInvestorDeal[]
  completed: EnrichedInvestorDeal[]
  other: EnrichedInvestorDeal[]
  metrics: PortfolioMetrics
  allocation: AllocationSlice[]
  maturities: MaturityEvent[]
  openEscrowsBySmb: Record<string, number>
  displayName: string | null
  history: InvestorHistoryPage
}
