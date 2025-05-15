export interface ExchangeRate {

   Date: string | Date;         // La date du taux
   Devise: string        // Le code de la devise (ex: "USD/TND")
   PriceBuyValue: string  // Le prix d'achat
   PriceSellValue: string // Le prix de vente
   QUOTITY: string       // La quantité (ex: "1" ou "100")
}
