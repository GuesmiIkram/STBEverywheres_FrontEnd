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
  photoClient?: string; // Optionnel // Optionnel
  genre: string; // Nouveau champ : Genre (Masculin, Féminin, Autre)
  profession: string; // Nouveau champ : Profession
  situationProfessionnelle: string; // Nouveau champ : Situation professionnelle
  niveauEducation: string; // Nouveau champ : Niveau d'éducation
  nombreEnfants: number; // Nouveau champ : Nombre d'enfants
  revenuMensuel: number; // Nouveau champ : Revenu mensuel
  paysNaissance?: string; // Optionnel
  nomMere?: string; // Optionnel
  nomPere?: string; // Optionnel


}