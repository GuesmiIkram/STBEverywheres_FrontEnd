import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Compte } from 'src/app/Models/compte';
import { Beneficiaire } from 'src/app/Models/Beneficiaire';
import { VirementService } from 'src/app/services/virement.service';
import { BeneficiaireService } from 'src/app/services/beneficiaire.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBeneficiaireComponent } from 'src/app/paiement/beneficiaires/add-beneficiaire/add-beneficiaire.component';
@Component({
  selector: 'app-initier-virement-unitaire-autre-benef',
  templateUrl: './initier-virement-unitaire-autre-benef.component.html',
  styleUrls: ['./initier-virement-unitaire-autre-benef.component.scss']
})
export class InitierVirementUnitaireAutreBenefComponent implements OnInit {
  comptes: Compte[] = [];
  beneficiaires: Beneficiaire[] = [];
  virementForm: FormGroup;
  soldeCompteSelectionne: number | null = null;


  constructor(
    private virementService: VirementService,
    private beneficiaireService: BeneficiaireService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.virementForm = this.fb.group({
      compteEmetteur: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(1)]],
      motif: ['', Validators.required],
      description: ['', Validators.required],
      idBeneficiaire: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.chargerComptes();
    this.chargerBeneficiaires();

    this.virementForm.get('compteEmetteur')?.valueChanges.subscribe((selectedCompteEmetteur) => {
      const compteSelectionne = this.comptes.find(compte => compte.rib === selectedCompteEmetteur);
      this.soldeCompteSelectionne = compteSelectionne ? compteSelectionne.solde : null;
    });
  }

  chargerComptes(): void {
    this.virementService.getComptesClient().subscribe(
      (data: Compte[]) => {
        this.comptes = data;
      },
      (error: any) => {
        console.error('Erreur lors du chargement des comptes :', error);
      }
    );
  }

  chargerBeneficiaires(): void {
    this.beneficiaireService.getBeneficiairesByClientId().subscribe({
      next: (data: Beneficiaire[]) => {
        console.log('Données reçues:', JSON.stringify(data, null, 2));
        this.beneficiaires = data;
      },
      error: (error: any) => {
        console.error('Erreur chargement bénéficiaires', error);
      }
    });
  }

  openAddBeneficiaireModal(): void {
    const modalRef = this.modalService.open(AddBeneficiaireComponent, {
      size: 'lg',
      centered: true
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




  effectuerVirement(): void {
    if (!this.virementForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulaire invalide',
        text: 'Veuillez remplir tous les champs obligatoires.',
        confirmButtonText: 'OK',
      });
      return;
    }
  const beneficiaireId = Number(this.virementForm.value.idBeneficiaire);
  //Le sélecteur HTML renvoie id comme  une chaîne de caractères alors que id dans beneficiaire est number
  const beneficiaireSelectionne = this.beneficiaires.find(b =>
    b.id?.toString() === this.virementForm.value.idBeneficiaire.toString()
  );    console.log('ID recherché:', beneficiaireId);
    console.log('Liste des bénéficiaires:', this.beneficiaires);
    console.log('Bénéficiaire trouvé:', beneficiaireSelectionne);

    console.log('Bénéficiaire sélectionné:', beneficiaireSelectionne);

    const virementData = {
      RIB_Emetteur: this.virementForm.value.compteEmetteur,
      Montant: this.virementForm.value.montant,
      Motif: this.virementForm.value.motif,
      Description: this.virementForm.value.description,
      TypeVirement: 'VirementUnitaireVersAutreBenef',
      IdBeneficiaire: this.virementForm.value.idBeneficiaire
    };

    Swal.fire({
      title: 'Confirmer le virement',
      html: `
        <p><strong>Compte Émetteur:</strong> ${virementData.RIB_Emetteur}</p>
        <p><strong>Compte Recepteur:</strong> ${beneficiaireSelectionne?.ribCompte} </p>

        <p><strong>Montant:</strong> ${virementData.Montant} TND</p>
        <p><strong>Motif:</strong> ${virementData.Motif}</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.virementService.effectuerVirement(virementData).subscribe(
          (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Virement effectué avec succès !',
              confirmButtonText: 'OK',
            });
          },
          (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Erreur lors du virement : ' + (error.error?.message || 'Une erreur est survenue.'),
              confirmButtonText: 'OK',
            });
          }
        );
      }
    });
  }
}
