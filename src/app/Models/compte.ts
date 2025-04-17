import { Client } from "./Client";

export interface Compte {
  rib: string;
  iban:string;
  numCin: string;
  client: Client | null;
  type: string;
  solde: number;
  decouvertAutorise: number;
  dateCreation: string; 
  statut: string;
  montantMaxAutoriseParJour: number; 
  nbrOperationsAutoriseesParJour: string; 
}
