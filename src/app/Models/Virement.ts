interface Virement {
  date: string | Date;
  montant: number;
  riB_Recepteur?: string;
  riB_Emetteur?: string;
  motif?: string;

}
