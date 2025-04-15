/*export interface Reclamation {
  id: number;
  objet: string;
  message: string;
  dateCreation: Date;
}*/
export interface Reclamation {
  id: number;          // Doit correspondre au backend
  objet: string;       // Correspond à "Objet" dans la réponse
  message: string;     // Correspond à "Message"
  motif: string;       // Nouveau champ
  dateCreation: Date; // Format "yyyy-MM-dd"
      // Nouveau champ
  // Ajoutez d'autres champs si nécessaire
}
