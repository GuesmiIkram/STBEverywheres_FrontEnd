import { Client } from "./Client";

export interface Compte {
  rib: string;
  numCin: string;
  client: Client | null;
  type: string;
  solde: number;
  dateCreation: string; // Correction : date_creation => dateCreation
  statut: string;
  montantMaxAutoriseParJour: number; // Correction : MontantMaxAutoriseParJour => montantMaxAutoriseParJour
  nbrOperationsAutoriseesParJour: string; // Correction : NbrOperationsAutoriseesParJour => nbrOperationsAutoriseesParJour
}
