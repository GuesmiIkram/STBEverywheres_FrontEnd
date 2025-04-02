import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Compte } from 'src/app/Models/compte';
import { VirementService } from 'src/app/services/virement.service';
import { Beneficiaire } from 'src/app/Models/Beneficiaire';
import { BeneficiaireService } from 'src/app/services/beneficiaire.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBeneficiaireComponent } from 'src/app/paiement/beneficiaires/add-beneficiaire/add-beneficiaire.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-initier-virement-masse',
  templateUrl: './initier-virement-masse.component.html',
  styleUrls: ['./initier-virement-masse.component.scss']
})
export class InitierVirementMasseComponent implements OnInit {
  virementForm: FormGroup;
  fichier: File | null = null;
  methodeVirement: string = 'form'; // Valeur par défaut : formulaire
  soldeCompteSelectionne: number | null = null;
  beneficiaires: Beneficiaire[] = []; // Liste des bénéficiaires récupérés
  comptes: Compte[] = []; // Stocke les comptes récupérés

  constructor(private fb: FormBuilder, private virementService: VirementService, private beneficiaireService: BeneficiaireService,private modalService: NgbModal
  ) {
    this.virementForm = this.fb.group({
      fichier: [null],
      ribEmetteur: ['', Validators.required],
      motif: ['', Validators.required],
      description: ['', Validators.required],
      beneficiaires: this.fb.array([
        this.fb.group({
          idBeneficiaire: ['', Validators.required],
          montant: ['', [Validators.required, Validators.min(1)]]
        })
      ])
    });
  }

  ngOnInit(): void {
    console.log('Component InitierVirementMasse initialisé');
    this.chargerComptes();
    this.chargerBeneficiaires();

    // Écoute des changements dans le champ 'ribEmetteur'
    this.virementForm.get('ribEmetteur')?.valueChanges.subscribe((ribEmetteur: string) => {
      const compteSelectionne = this.comptes.find(compte => compte.rib === ribEmetteur);
      this.soldeCompteSelectionne = compteSelectionne ? compteSelectionne.solde : null;
    });
  }

  get beneficiairesFormArray(): FormArray {
    return this.virementForm.get('beneficiaires') as FormArray;
  }

  chargerComptes(): void {
    this.virementService.getComptesClient().subscribe(
      (data: Compte[]) => {
        this.comptes = data;
        console.log('Comptes récupérés:', this.comptes);
      },
      (error: any) => {
        console.error('Erreur lors du chargement des comptes :', error);
      }
    );
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

  // Créer un nouvel objet bénéficiaire
  nouveauBeneficiaire(): FormGroup {
    return this.fb.group({
      idBeneficiaire: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(1)]]
    });
  }

  // Ajouter un bénéficiaire dynamiquement
  ajouterBeneficiaire(): void {
    this.beneficiairesFormArray.push(this.nouveauBeneficiaire());
  }

  // Supprimer un bénéficiaire dynamiquement
  supprimerBeneficiaire(index: number): void {
    if (this.beneficiairesFormArray.length > 1) {
      this.beneficiairesFormArray.removeAt(index);
    }
  }

  onMethodChange(methode: string): void {
    console.log('Méthode de virement sélectionnée:', methode);
    this.methodeVirement = methode;
  }

  onFileChange(event: any): void {
    if (!event.target.files || event.target.files.length === 0) {
      console.warn('Aucun fichier sélectionné');
      return;
    }

    this.fichier = event.target.files[0];
    console.log('Fichier sélectionné:', this.fichier);
  }

  onSubmit(): void {
    if (this.methodeVirement === 'file') {
      this.submitFile();
    } else {
      this.submitForm();
    }
  }

  submitFile(): void {
    if (!this.fichier) {
      alert('Veuillez sélectionner un fichier.');
      return;
    }

    const formData = new FormData();
    formData.append('Fichier', this.fichier, this.fichier.name);

    this.virementService.uploadVirementMasseFile(formData).subscribe(
      response => {
        console.log('Virement par fichier réussi:', response);
        alert('Virement en masse effectué avec succès.');
        this.fichier = null;
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = ''; // Efface le champ de sélection du fichier
        }
      },
      error => {
        console.error('Erreur lors du virement par fichier:', error);
        alert('Erreur lors du virement.');
      }
    );
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

  submitForm(): void {
    if (this.virementForm.invalid) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    this.virementService.uploadVirementMasseForm(this.virementForm.value).subscribe(
      response => {
        console.log('Virement par formulaire réussi:', response);
        alert('Virement en masse effectué avec succès.');
        this.virementForm.reset();
      },
      error => {
        console.error('Erreur lors du virement par formulaire:', error);
        alert('Erreur lors du virement.');
      }
    );
  }
}
