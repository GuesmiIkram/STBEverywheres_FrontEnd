import { NomCarte } from "../enums/nom-carte.enum";
import { TypeCarte } from "../enums/type-carte.enum";

export  interface DemandeCarte{
    numCompte: string;
    nomCarte: NomCarte;
    typeCarte: TypeCarte;
    cin: string;
    email: string;
    numTel: string;
  }