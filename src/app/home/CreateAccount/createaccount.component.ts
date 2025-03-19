import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Compte } from 'src/app/Models/compte';
import { CompteService } from 'src/app/services/compte.service';

@Component({
  selector: 'app-Createaccount',
  templateUrl: './Createaccount.component.html',
  styleUrls: ['./Createaccount.component.scss']
})
export class CreateaccountComponent implements OnInit {

  compteDto = { type: 'courant' };
  errorMessage: string = ''; // Initialisation avec une chaîne vide

  constructor(private compteService: CompteService) {}

  ngOnInit(): void {
    // Logique au démarrage (si nécessaire)
  }

  createCompte(): void {
    this.compteService.createCompte(this.compteDto).subscribe({
      next: (data) => {
        console.log('Compte créé avec succès:', data);
        // Logique pour rafraîchir la liste des comptes ou gérer le succès
      },
      error: (err) => {
        console.error('Erreur lors de la création du compte:', err);
        this.errorMessage = err.error?.message || 'Erreur inattendue.';
      }
    });
  }
}
