import { NomCarte } from "../enums/nom-carte.enum";
import { TypeCarte } from "../enums/type-carte.enum";

export  interface DemandeCarte{
    NumCompte: string;
    NomCarte: NomCarte;
    TypeCarte: TypeCarte;
    CIN: string;
    Email: string;
    NumTel: string;
  }
