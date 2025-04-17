import { NomCarte } from "../enums/nom-carte.enum";
import { StatutCarte } from "../enums/statut-carte.enum";
import { TypeCarte } from "../enums/type-carte.enum";
export interface CarteDTO {
  numCarte: string; 
  nomCarte: NomCarte; 
  typeCarte: TypeCarte; 
  dateCreation: Date; 
  dateExpiration: Date; 
  statut: StatutCarte; 
  nature?: string; 
  iddemande: number; 
  rib: string; 
  solde?: number; 
  dateRecuperation?: Date; 
  codePIN: string; 
  codeCVV: string; 
  plafondTPE: number;
  plafondDAP: number;
}