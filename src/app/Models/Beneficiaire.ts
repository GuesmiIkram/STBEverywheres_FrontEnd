import { Client } from "./Client";

export interface Beneficiaire {
  id?: number; // Généré côté serveur
  ribCompte: string; // Obligatoire
  prenom: string; // Obligatoire
  nom: string; // Obligatoire
  email?: string | null; // Optionnel
  telephone?: string | null; // Optionnel
  client?: Client | null; // Optionnel
}
