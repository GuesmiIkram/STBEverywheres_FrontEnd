import { Component, OnInit } from '@angular/core';
import { ClientService } from '../services/client.service';
import { Client } from '../Models/Client';

@Component({
  selector: 'app-simulateur-credit',
  templateUrl: './simulateur-credit.component.html',
  styleUrls: ['./simulateur-credit.component.scss']
})
export class SimulateurCreditComponent implements OnInit {
  montant: number = 50000;
  duree: number = 36;
  TMM: number = 7.5;//TMM
  taux: number = 7;

  typeAmortissement: string = 'constant';

  clientConventionne: boolean = false;
  margeBancaire: number = 0;
  nomConvention: string | null = null;

  result: any = null;
  details: any[] = [];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.chargerConventionClient();
  }

  chargerConventionClient() {
    this.clientService.getClientInfo().subscribe({
      next: (client: Client) => {
        console.log("client retourne:",client);
        if (client.id_convention) {
          console.log("id de convention",client.id_convention)
          this.clientConventionne = true;
          // Charger les infos de la convention
          this.clientService.getConventionById(client.id_convention).subscribe({
            next: (convention) => {
              console.log("convention retourne",convention);
              this.margeBancaire = convention.marge_bancaire;

              this.nomConvention = convention.nom_convention;
              // Mettre à jour le taux
              this.taux = this.TMM+ this.margeBancaire;
            },
            error: (err) => {
              console.error('Erreur chargement convention', err);
            }
          });
        } else {
          // Pas de convention
          this.clientConventionne = false;
          this.nomConvention = null;
          this.margeBancaire = 5.0;
          this.taux = this.TMM+this.margeBancaire;
        }
      },
      error: (err) => {
        console.error('Erreur chargement client', err);
      }
    });
  }

  calculerCredit() {
    let tauxMensuel = (this.taux / 12) / 100;
    let nombreMensualites = this.duree;

    if (this.typeAmortissement === 'constant') {
      let mensualite = this.montant * tauxMensuel / (1 - Math.pow(1 + tauxMensuel, -nombreMensualites));
      this.result = { type: 'Mensualité constante', mensualite: mensualite.toFixed(2) };
    } else if (this.typeAmortissement === 'variable') {
      let capitalFixe = this.montant / nombreMensualites;
      let capitalRestant = this.montant;

      this.details = [];
let totalMensualite = 0;
    let totalInteret = 0;
      for (let i = 1; i <= nombreMensualites; i++) {
        let interet = capitalRestant * tauxMensuel;
        let mensualite = capitalFixe + interet;
        const principal = mensualite - interet;

        this.details.push({
          mois: i,
          mensualite: mensualite.toFixed(2),
          interet: interet.toFixed(2),
           principal: principal.toFixed(2),
          capitalRestant: capitalRestant.toFixed(2)
        });
         totalMensualite += mensualite;
      totalInteret += interet;
        capitalRestant -= capitalFixe;
      }
      this.result = { type: 'Amortissement variable', details: this.details ,totalMensualite: totalMensualite.toFixed(2),
      totalInteret: totalInteret.toFixed(2),
      totalPrincipal: this.montant.toFixed(2) };
    }
  }
}
