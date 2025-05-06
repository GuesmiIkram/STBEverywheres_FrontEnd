export interface ModificationRequest {
    id: number;
    clientId: number;
    fieldToModify: string;
    newValue: string;
    justificationPath: string;
    requestDate: Date;
    status: 'EnCours' | 'Acceptee' | 'Refusee';
    processedByAgentId?: number;
    processedDate?: Date;
    responseComment?: string;
    

    client?: {
      id: number;
      nom: string;
      prenom: string;
   
    };
  }