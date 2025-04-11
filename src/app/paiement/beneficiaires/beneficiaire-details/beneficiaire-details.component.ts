import { Component, OnInit } from '@angular/core';
import { BeneficiaireService } from 'src/app/services/beneficiaire.service';
import { Beneficiaire } from 'src/app/Models/Beneficiaire';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBeneficiaireComponent } from '../add-beneficiaire/add-beneficiaire.component';

@Component({
  selector: 'app-beneficiaire-details',
  templateUrl: './beneficiaire-details.component.html',
  styleUrls: ['./beneficiaire-details.component.scss']
})
export class BeneficiaireDetailsComponent implements OnInit {



  beneficiaires: Beneficiaire[] = [];
  isLoading = true;

  constructor(private beneficiaireService: BeneficiaireService,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadBeneficiaires();
    this.chargerBeneficiaires();
  }

  loadBeneficiaires(): void {
    this.isLoading = true;
    this.beneficiaireService.getBeneficiairesByClientId().subscribe({
      next: (data) => {
        console.log("benef retourne de back",data);
        this.beneficiaires = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur est survenue lors du chargement des bénéficiaires.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error('Error loading beneficiaires:', error);
      }
    });
  }



  formatTelephone(tel: string | null | undefined): string {
    if (!tel) return '-';
    return tel.replace(/(\d{2})(?=\d)/g, '$1 ');
  }




  chargerBeneficiaires(): void {
    this.beneficiaireService.getBeneficiairesByClientId().subscribe({
      next: (data: Beneficiaire[]) => {
        console.log('Données bénéficiaires reçues:', data);
        this.beneficiaires = data;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des bénéficiaires:', error);
      }
    });
  }




openAddBeneficiaireModal(): void {
  const modalRef = this.modalService.open(AddBeneficiaireComponent, {
    size: 'lg',
    centered: true,
    backdropClass: 'transparent-backdrop', // Classe personnalisée pour le fond
    modalDialogClass: 'custom-modal-dialog' // Classe personnalisée pour la boîte de dialogue
  });

    // Attendre que le modal soit rendu pour insérer le bouton de fermeture
    setTimeout(() => {
      const modalElement = document.querySelector('.modal-content');
      if (modalElement) {
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.classList.add('close-modal-btn');

        // Style en ligne pour le bouton de fermeture
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';  // Moins d'espacement par rapport au haut
        closeButton.style.right = '5px';  // Moins d'espacement à droite
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = '#dc3545';  // Fond rouge
        closeButton.style.color = 'white';             // Texte blanc
        closeButton.style.fontSize = '18px';           // Plus petit pour un bouton plus discret
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '5px';             // Moins de padding
        closeButton.style.borderRadius = '0';          // Forme carrée
        closeButton.style.transition = 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease';
        closeButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';  // Ombre discrète

        // Effet au survol
        closeButton.addEventListener('mouseover', () => {
          closeButton.style.backgroundColor = '#c82333';  // Changer la couleur au survol
          closeButton.style.transform = 'scale(1.1)';     // Agrandir légèrement
        });

        closeButton.addEventListener('mouseout', () => {
          closeButton.style.backgroundColor = '#dc3545';  // Rétablir la couleur
          closeButton.style.transform = 'scale(1)';       // Rétablir la taille normale
        });

        // Fonction de fermeture
        closeButton.addEventListener('click', () => modalRef.dismiss());

        modalElement.appendChild(closeButton);
      }
    }, 100); // Petite attente pour que le modal soit chargé

    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          this.chargerBeneficiaires();
          Swal.fire('Succès', 'Bénéficiaire ajouté avec succès!', 'success');
        }
      },
      (dismissed) => {
        console.log('Modal fermé sans ajout');
      }
    );
  }




}
