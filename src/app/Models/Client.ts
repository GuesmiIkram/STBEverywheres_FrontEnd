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
  numCIN?: string;
  dateDelivranceCIN?: Date;
  dateExpirationCIN?: Date;
  lieuDelivranceCIN?: string;
  photoClient?: string;
  genre: string;
  profession: string;
  situationProfessionnelle: string;
  niveauEducation: string;
  nombreEnfants: number;
  revenuMensuel: number;
  paysNaissance?: string;
  nomMere?: string;
  nomPere?: string;
  id_convention?: number;

}
