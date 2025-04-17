export interface Client {
  id: number; // Clé primaire
  nom: string;
  prenom: string;
  dateNaissance: Date;
  telephone: string;
  email: string;
  adresse: string;
  civilite: string;
  nationalite: string;
  etatCivil: string;
  residence: string;
  numCIN?: string; // Optionnel
  dateDelivranceCIN?: Date; // Optionnel
  dateExpirationCIN?: Date; // Optionnel
  lieuDelivranceCIN?: string; // Optionnel
  photoClient?: string; // Optionnel 
  genre: string; 
  profession: string; 
  situationProfessionnelle: string; 
  niveauEducation: string; 
  nombreEnfants: number; 
  revenuMensuel: number;
  paysNaissance?: string; // Optionnel
  nomMere?: string; // Optionnel
  nomPere?: string; // Optionnel


}