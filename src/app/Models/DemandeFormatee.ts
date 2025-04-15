export interface DemandeFormatee {
  id?: number
  dateDemande: Date
  jour: number
  moisAbrev: string
  ribCompte: string
  status: string
  statusClass: string
  type: string
  plafondChequier: number
  nombreFeuilles: number
}
