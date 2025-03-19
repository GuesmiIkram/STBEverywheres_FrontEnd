import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NomCarte } from 'src/app/enums/nom-carte.enum';
import { StatutCarte } from 'src/app/enums/statut-carte.enum';
import { CarteDTO } from 'src/app/Models/CarteDTO';
import { CarteService } from 'src/app/services/carte.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carte-details',
  templateUrl: './carte-details.component.html',
  styleUrls: ['./carte-details.component.scss']
})
export class CarteDetailsComponent implements OnInit {
  carte: CarteDTO | undefined;
  cartes: CarteDTO[] = [];

  constructor(
    private route: ActivatedRoute,
    private carteService: CarteService
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit called');
    const numCarte = this.route.snapshot.paramMap.get('numCarte');
    if (numCarte) {
      this.carteService.getCarteDetails(numCarte).subscribe(
        (data: CarteDTO) => {
          this.carte = data;
          console.log('Stored carte:', this.carte); // Debugging
      
        },
        (error) => {
          console.error('Erreur lors de la récupération des détails de la carte', error);
        }
      );
    }
  }
  loadCartes(): void {
    this.carteService.getCartesByClientId().subscribe(
      (data) => {
        this.cartes = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des cartes', error);
      }
    );
  }
  getCarteImage(nomCarte: string): string {
      switch (nomCarte) {
        case NomCarte.MastercardGold:
          return 'assets/img/CARTE-MASTERCARD-GOLD-INTERNATIONALE-350x238-1.webp';
        case NomCarte.VisaClassic:
          return 'assets/img/CARTE_VISA_CLASSICNATIONALE.png';
        
        case NomCarte.VisaPlatinum:
          return 'assets/images/visa-platinum.jpg';
        
        case NomCarte.MastercardWorld:
          return 'assets/images/mastercard-world.jpg';
        default:
          return 'assets/images/default-card.jpg';
      }
    }
   
  
    formatNumeroCarte(numCarte: string): string {
      if (!numCarte|| numCarte.length < 4) {
        return '****'; // Retourne une valeur par défaut si le numéro est invalide
      }
      // Masque tous les chiffres sauf les 4 derniers
      const masked = numCarte.slice(0, -4).replace(/\d/g, '*');
      const lastFour = numCarte.slice(-4);
      return masked + lastFour;
    }

      blockCarte(numCarte: string): void {
        Swal.fire({
          title: 'Confirmation',
          text: 'Voulez-vous vraiment bloquer cette carte ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui, bloquer',
          cancelButtonText: 'Non, annuler',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            // Si l'utilisateur confirme, appeler l'API pour bloquer la carte
            this.carteService.blockCarte(numCarte).subscribe(
              (response) => {
                console.log('Carte bloquée avec succès', response);
                Swal.fire({
                  icon: 'success',
                  title: 'Succès',
                  text: 'La carte a été bloquée avec succès.',
                  confirmButtonText: 'OK',
                });
                this.loadCartes(); // Recharger la liste des cartes après le blocage
              },
              (error) => {
                console.error('Erreur lors du blocage de la carte', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Erreur',
                  text: 'Une erreur est survenue lors du blocage de la carte.',
                  confirmButtonText: 'OK',
                });
              }
            );
          }
        });
      }
      deblockCarte(numCarte: string): void {
        Swal.fire({
          title: 'Confirmation',
          text: 'Voulez-vous vraiment débloquer cette carte ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui, débloquer',
          cancelButtonText: 'Non, annuler',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            // Si l'utilisateur confirme, appeler l'API pour débloquer la carte
            this.carteService.deblockCarte(numCarte).subscribe(
              (response) => {
                console.log('Carte débloquée avec succès', response);
                Swal.fire({
                  icon: 'success',
                  title: 'Succès',
                  text: 'La carte a été débloquée avec succès.',
                  confirmButtonText: 'OK',
                });
                this.loadCartes(); // Recharger la liste des cartes après le déblocage
              },
              (error) => {
                console.error('Erreur lors du déblocage de la carte', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Erreur',
                  text: 'Une erreur est survenue lors du déblocage de la carte.',
                  confirmButtonText: 'OK',
                });
              }
            );
          }
        });
      }
      // Méthode pour déterminer si le bouton "Blocker" doit être affiché
      shouldShowBlockButton(statut: StatutCarte): boolean {
        return statut === StatutCarte.Active;
      }
    
      // Méthode pour déterminer si le bouton "Débloquer" doit être affiché
      shouldShowDeblockButton(statut: StatutCarte): boolean {
        return statut === StatutCarte.Inactive;
      }
}
