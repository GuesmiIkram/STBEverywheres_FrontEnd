import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Compte } from 'src/app/Models/compte';
import { CompteService } from 'src/app/services/compte.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  comptes: Compte[] = [];
  errorMessage: string | null = null;
  rib: string = ''; // Variable pour le RIB saisi par l'utilisateur
  compteDto = { type: 'courant' }; // Objet pour stocker le type de compte choisi
  showCreateAccountForm: boolean = false; // Propriété pour afficher le formulaire d'ajout de compte
  selectedCompte: Compte | null = null; // Stocke le compte sélectionné
  showCompteDetails: boolean = false; // Gère l'affichage des détails du compte

  constructor(private compteService: CompteService, private router: Router) {}

  ngOnInit(): void {
    this.loadComptes();
  }

  // Rechercher un compte par RIB
  searchCompteByRib(): void {
    console.log("RIB entré par l'utilisateur : ", this.rib);

    if (!this.rib.trim()) {
      this.errorMessage = "Veuillez entrer un RIB valide.";
      return;
    }

    this.compteService.getCompteByRib(this.rib).subscribe({
      next: (data) => {
        console.log("Données reçues du serveur : ", data);

        if (!data || (Array.isArray(data) && data.length === 0)) {
          this.errorMessage = "Compte introuvable.";
          this.comptes = [];
          return;
        }

        this.comptes = Array.isArray(data) ? data : [data]; // Normalisation en tableau
        this.errorMessage = null;
      },
      error: (err) => {
        console.error("Erreur API : ", err);
        this.comptes = [];
        this.errorMessage = "Compte introuvable pour ce RIB.";
      }
    });
  }

  // Afficher/Masquer le formulaire de création de compte
  toggleCreateAccountForm(): void {
    this.showCreateAccountForm = !this.showCreateAccountForm;
  }

  // Créer un compte
  createCompte(): void {
    if (!this.compteDto.type) {
      this.errorMessage = "Veuillez choisir un type de compte.";
      return;
    }

    this.compteService.createCompte(this.compteDto).subscribe({
      next: (data) => {
        console.log('Compte créé avec succès:', data);
        alert("Compte créé avec succès !");
        this.showCreateAccountForm = false;
        this.loadComptes(); // Recharger la liste des comptes après création
      },
      error: (err) => {
        console.error('Erreur lors de la création du compte:', err);
        this.errorMessage = err.error?.message || 'Erreur inattendue.';
      }
    });
  }

  // Charger la liste des comptes
  loadComptes(): void {
    this.compteService.getComptesByCin().subscribe({
      next: (data) => {
        this.comptes = data;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  // Sélectionner un compte et afficher le modal
openModal(rib: string): void {
  this.compteService.getCompteByRib(rib).subscribe({
    next: (data) => {
      if (!data || (Array.isArray(data) && data.length === 0)) {
        this.errorMessage = "Compte introuvable.";
        return;
      }

      this.selectedCompte = Array.isArray(data) ? data[0] : data; // Prendre le premier compte trouvé
      console.log("Compte sélectionné :", this.selectedCompte); // Vérifier si les valeurs existent
    },
    error: (err) => {
      console.error("Erreur API :", err);
      this.errorMessage = "Compte introuvable.";
    }
  });
}

// Fermer le modal
closeModal(): void {
  this.selectedCompte = null;
}


  // Clôturer un compte
  cloturerCompte(rib: string): void {
    if (confirm("Êtes-vous sûr de vouloir clôturer ce compte ?")) {
      this.compteService.cloturerCompte(rib).subscribe({
        next: () => {
          alert("Compte clôturé avec succès !");

          this.loadComptes(); // Recharger les comptes après clôture
        },
        error: (err) => {
          this.selectedCompte = null; // Ferme le modal après la clôture
          this.errorMessage = err.error?.message || 'Erreur lors de la clôture du compte.';
        }
      });
    }
  }
}
