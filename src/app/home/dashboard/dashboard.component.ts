import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Compte } from 'src/app/Models/compte';
import { CompteService } from 'src/app/services/compte.service';
import { VirementService } from 'src/app/services/virement.service';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';

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
  showHistoriqueModal: boolean = false;
  historiqueVirements: any;
  selectedRib: string = '';
  filter: string = 'all';


  userRole: string = '';
  isAgent: boolean = false;
  isClient: boolean = false;
  userName: string = '';


   //variable pour gérer les erreurs d'historique
   historiqueErrorMessage: string | null = null;
  constructor(private authService:AuthService,private compteService: CompteService, private router: Router , private virementService: VirementService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.isAgent = this.authService.isAgent();
    this.isClient = this.authService.isClient();
    if(this.isClient){
      this.loadComptes() // ne l'appeler que pour le client
    }

  }
  // Rechercher un compte par RIB
  searchCompteByRib(): void {
    console.log("RIB entré par l'utilisateur : ", this.rib);

    // Réinitialiser le message d'erreur avant chaque recherche
    this.errorMessage = null;

    // Vérifier si le RIB est vide
    if (!this.rib.trim() ) {
      this.errorMessage = "Veuillez saisir le RIB de votre compte.";
      setTimeout(() => {
        this.errorMessage = null; // Effacer le message après 5 secondes
      }, 7000);
      return;
    }
// Vérifier si le RIB <20 et si contient uniquement des chiffres
    if (this.rib.trim().length < 20 || isNaN(Number(this.rib.trim()))) {
      this.errorMessage = "Veuillez entrer un RIB valide.";
      setTimeout(() => {
        this.errorMessage = null; // Effacer le message après 5 secondes
      }, 7000);
      return;
    }

    // Réinitialiser la liste des comptes avant la recherche
    this.comptes = [];

    // Appeler l'API pour rechercher le compte
    this.compteService.getCompteByRib(this.rib).subscribe({
      next: (data) => {
        console.log("Données reçues du serveur : ", data);

        // Vérifier si le compte existe
        if (!data || (Array.isArray(data) && data.length === 0)) {
          this.errorMessage = "Aucun compte n'est associé à ce RIB.";
          setTimeout(() => {
            this.errorMessage = null; // Effacer le message après 5 secondes
          }, 7000);
          this.comptes = [];
          return;
        }

        // Normaliser les données en tableau
        this.comptes = Array.isArray(data) ? data : [data];
        this.errorMessage = null;
      },
      error: (err) => {
        console.error("Erreur API : ", err);
        this.comptes = [];

        // Capturer le message d'erreur renvoyé par le serveur
        if (err.status === 404) {
          this.errorMessage = err.error.message || "Aucun compte n'est associé à ce RIB.";
        } else {
          this.errorMessage = "Une erreur est survenue lors de la recherche du compte.";
        }

        setTimeout(() => {
          this.errorMessage = null; // Effacer le message après 5 secondes
        }, 7000);
      }
    });
  }

  onRibInputChange(): void {
    // Réinitialiser le message d'erreur lorsque l'utilisateur commence à saisir un nouveau RIB
    this.errorMessage = null;
  }

  cancelSearch(): void {
    // Réinitialiser le RIB, les comptes et le message d'erreur
    this.rib = '';
    this.comptes = [];
    this.errorMessage = null;
  }

  // Afficher/Masquer le formulaire de création de compte
  toggleCreateAccountForm(): void {
    this.showCreateAccountForm = !this.showCreateAccountForm;
  }

// Créer un compte
createCompte(): void {
  // Vérifier si le type de compte est sélectionné
  if (!this.compteDto.type) {
    this.errorMessage = "Veuillez choisir un type de compte.";
    return;
  }

  // Boîte de dialogue de confirmation
  Swal.fire({
    title: 'Confirmation',
    text: `Êtes-vous sûr de vouloir créer un nouveau compte de type "${this.compteDto.type}" ?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, créer',
    cancelButtonText: 'Non, annuler',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  }).then((result) => {
    if (result.isConfirmed) {
      // Appeler l'API pour créer le compte
      this.compteService.createCompte(this.compteDto).subscribe({
        next: (data) => {
          console.log('Compte créé avec succès:', data);

          // Afficher un message de succès avec Swal
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Le compte a été créé avec succès !',
            confirmButtonText: 'OK',
          });

          // Masquer le formulaire et recharger la liste des comptes
          this.showCreateAccountForm = false;
          this.loadComptes();
        },
        error: (err) => {
          console.error('Erreur lors de la création du compte:', err);

          // Afficher un message d'erreur avec Swal
          const errorMessage = err.error?.message || 'Une erreur est survenue lors de la création du compte.';
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: errorMessage,
            confirmButtonText: 'OK',
          });

          // Afficher l'erreur dans le formulaire (optionnel)
          this.errorMessage = errorMessage;
        }
      });
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
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment clôturer ce compte ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, clôturer',
      cancelButtonText: 'Non, annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        // Appeler l'API pour clôturer le compte
        this.compteService.cloturerCompte(rib).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Le compte a été clôturé avec succès.',
              confirmButtonText: 'OK',
            });

            this.loadComptes(); // Recharger la liste des comptes après clôture
          },
          error: (err) => {
            // Vérifier si l'erreur est liée au solde du compte
            const errorMessage = err.error?.message || 'Une erreur est survenue lors de la clôture du compte.';

            // Si le solde n'est pas à zéro
            if (errorMessage.includes('mettre votre compte à zéro')) {
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Vous devez mettre votre compte à zéro puis réessayer de le clôturer.',
                confirmButtonText: 'OK',
              });
            } else {
              // Autres erreurs générales
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: errorMessage,
                confirmButtonText: 'OK',
              });
            }

            this.selectedCompte = null; // Ferme le modal après la clôture
          }
        });
      }
    });
  }
  groupVirementsByMonth(virements: any[]): { [key: string]: any[] } {
    const groupedVirements: { [key: string]: any[] } = {};

    virements.forEach(virement => {
      const date = new Date(virement.date);
      const monthYear = `${date.toLocaleString('default', { month: 'long' })}-${date.getFullYear()}`;

      if (!groupedVirements[monthYear]) {
        groupedVirements[monthYear] = [];
      }

      groupedVirements[monthYear].push(virement);
    });

    return groupedVirements;
  }

  sortMonthsDescending(groupedVirements: { [key: string]: any[] }): string[] {
    return Object.keys(groupedVirements).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB.getTime() - dateA.getTime();
    });
  }

  openHistoriqueModal(rib: string) {
    this.selectedRib = rib;
    this.showHistoriqueModal = true;
    this.filterHistorique(this.filter);
  }

  closeHistoriqueModal() {
    this.showHistoriqueModal = false;
    this.historiqueVirements = null;
    this.historiqueErrorMessage = null; // Réinitialiser l'erreur lors de la fermeture du modal
  }


  filterHistorique(filter: string) {
    this.filter = filter;
    this.historiqueErrorMessage = null; // Réinitialiser l'erreur avant chaque appel

    this.virementService.getHistoriqueVirements(this.selectedRib, filter).subscribe(
      (data) => {
        console.log(data); // Ajoutez cette ligne pour inspecter les données
        this.historiqueVirements = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'historique des virements', error);
        this.historiqueErrorMessage = error.error?.message || 'Une erreur est survenue lors de la récupération de l\'historique des virements.';
      }
    );


    }
  }
