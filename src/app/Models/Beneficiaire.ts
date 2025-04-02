import { Client } from "./Client";

export interface Beneficiaire {
  id?: number; // Généré côté serveur
  ribCompte: string; // Obligatoire
  prenom: string; // Obligatoire
  nom: string; // Obligatoire
  Email?: string | null; // Optionnel
  Telephone?: string | null; // Optionnel
  client?: Client | null; // Optionnel
}
