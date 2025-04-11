export interface DemandeAugmentationPlafondDTO {
    numCarte: string;
    nouveauPlafondTPE: number;
    nouveauPlafondDAB: number;
    raison?: string;
    dateDemande:Date;
  }