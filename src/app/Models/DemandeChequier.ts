import { DemandeChequierStatus } from "src/app/enums/DemandeChequierStatus.enum";
import { ModeLivraisonChequier } from "../enums/ModeLivraisonChequier.enum";

export interface DemandeChequier {
  idDemande: number;
  ribCompte: string;
  dateDemande: Date;
  nombreFeuilles: number;
  status: DemandeChequierStatus;
  otp: boolean;
  modeLivraison: ModeLivraisonChequier;
  adresseComplete?: string;
  codePostal?: string;
  email: string;
  numTel: string;
  numeroChequier: string;
  plafondChequier: number;
  raisonDemande?: string;
  accepteEngagement?: boolean;
  isBarre: boolean;
  idAgent?: number;
}
