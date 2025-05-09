export interface RechargeCarteDTO {
  carteEmetteurNum: string;
  carteRecepteurNum: string;
  montant: number;
  cvv: string;         // Ajout du champ CVV (3 chiffres)
  dateExpiration: string; // Format "MM/yy" (ex: "12/25")
}