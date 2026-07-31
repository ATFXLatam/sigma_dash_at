// Snapshot from Sigma_Tournament_Ranking_Table_26.xlsx · sheet Data_Ranking

export type SigmaRankingEntry = {
  bdm: string
  status: 'Active' | 'Inactive'
  month: string
  country: string
  grossDeposit: number
  clients: number
  teamOffice: string
}

export const SIGMA_RANKING_MONTH = 'Jul'

export const SIGMA_RANKING: SigmaRankingEntry[] = [
  {
    bdm: 'Irvin Ortega',
    status: 'Active',
    month: 'Jul',
    country: 'Colombia',
    grossDeposit: 130000,
    clients: 2,
    teamOffice: 'Colombia&Peru',
  },
  {
    bdm: 'Joel Flores',
    status: 'Active',
    month: 'Jul',
    country: 'Colombia',
    grossDeposit: 101000,
    clients: 1,
    teamOffice: 'México',
  },
  {
    bdm: 'Alejandro Granados',
    status: 'Active',
    month: 'Jul',
    country: 'México',
    grossDeposit: 22869,
    clients: 1,
    teamOffice: 'México',
  },
]
