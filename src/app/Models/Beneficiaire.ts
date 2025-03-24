import { Client } from "./Client";

export interface Beneficiaire {
  RibCompte: string;
  Prenom: string;
  client: Client | null;
  Nom: string;
Email: string;
Telephone: string;
Type: string;

}
