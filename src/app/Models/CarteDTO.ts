import { NomCarte } from "../enums/nom-carte.enum";
import { StatutCarte } from "../enums/statut-carte.enum";
import { TypeCarte } from "../enums/type-carte.enum";
export interface CarteDTO {
  numCarte: string; // Numéro de la carte (identifiant unique)
  nomCarte: NomCarte; // Utilisation de l'enum pour le nom de la carte
  typeCarte: TypeCarte; // Utilisation de l'enum pour le type de carte
  dateCreation: Date; // Date de création de la carte
  dateExpiration: Date; // Date d'expiration de la carte
  statut: StatutCarte; // Utilisation de l'enum pour le statut de la carte
  nature?: string; // postpayee, prepayee (optionnel)
  iddemande: number; // Référence à la demande de carte
  rib: string; // Référence au compte
  solde?: number; // Solde de la carte (optionnel)
  dateRecuperation?: Date; // Date de récupération de la carte (optionnel)
  codePIN: string; // Code PIN à 4 chiffres
  codeCVV: string; // Code CVV à 3 chiffres
  plafondTPE: number; // Plafond TPE (par défaut 4000)
  plafondDAP: number; // Plafond DAP (par défaut 2000)
}