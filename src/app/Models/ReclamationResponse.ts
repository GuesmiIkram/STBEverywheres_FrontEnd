export interface ReclamationResponse {
    id: number;
    objet: string;
    description: string;
    dateCreation: string;
    statut: string;
    reference: string;
    reponse?: string;
  }