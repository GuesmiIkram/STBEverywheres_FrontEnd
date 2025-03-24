import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Compte } from 'src/app/Models/compte';
import { VirementService } from 'src/app/services/virement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-initier-virement-unitaire-autre-benef',
  templateUrl: './initier-virement-unitaire-autre-benef.component.html',
  styleUrls: ['./initier-virement-unitaire-autre-benef.component.scss']
})
export class InitierVirementUnitaireAutreBenefComponent implements OnInit {
  comptes: Compte[] = [];
  virementForm: FormGroup;
  soldeCompteSelectionne: number | null = null; // stocker le solde de compte emetteur
  constructor(private virementService: VirementService, private fb: FormBuilder) {
    this.virementForm = this.fb.group({
      compteEmetteur: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(1)]],
      motif: ['', Validators.required],
      nomBeneficiaire: ['', Validators.required],
      ribBeneficiaire: ['', Validators.required],
      description: ['', Validators.required]  // Ajoute cette ligne pour bien initialiser le champ description

    });
    console.log('Formulaire initialisé :', this.virementForm.value);
  }

  ngOnInit(): void {
    this.virementService.getComptesClient().subscribe(
      (data: Compte[]) => { // Ajout du type `Compte[]`
        this.comptes = data;
      },
      (error) => { console.error('Erreur lors du chargement des comptes :', error); }
    );

    this.virementForm.get('compteEmetteur')?.valueChanges.subscribe((selectedCompteEmetteur) => {

      // Trouver le compte sélectionné pour extraire le solde de compte emetteur
      const compteSelectionne = this.comptes.find(compte => compte.rib === selectedCompteEmetteur);
      this.soldeCompteSelectionne = compteSelectionne ? compteSelectionne.solde : null;
    });
  }
//envoi de virement
effectuerVirement(): void {
  console.log('Fonction effectuerVirement() appelée !');

  // Vérifier si le formulaire est invalide
  if (!this.virementForm.valid) {
    console.log('Formulaire invalide :', this.virementForm.value);

    // Afficher un message d'erreur avec Swal
    Swal.fire({
      icon: 'error',
      title: 'Formulaire invalide',
      text: 'Veuillez remplir tous les champs obligatoires.',
      confirmButtonText: 'OK',
    });
    return;
  }

  // Si le formulaire est valide, préparer les données du virement
  const virementData = {
    RIB_Emetteur: this.virementForm.value.compteEmetteur,
    RIB_Recepteur: this.virementForm.value.ribBeneficiaire,
    Montant: this.virementForm.value.montant,
    Motif: this.virementForm.value.motif,
    Description: this.virementForm.value.description,
    TypeVirement: 'VirementUnitaireVersAutreBenef',
  };

  console.log('Données envoyées pour le virement :', virementData);

  // Afficher une boîte de dialogue de confirmation avec les détails du virement
  Swal.fire({
    title: 'Confirmer le virement',
    html: `
      <p><strong>Compte Émetteur:</strong> ${virementData.RIB_Emetteur}</p>
      <p><strong>Compte Récepteur:</strong> ${virementData.RIB_Recepteur}</p>
      <p><strong>Montant:</strong> ${virementData.Montant}</p>
      <p><strong>Motif:</strong> ${virementData.Motif}</p>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirmer',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
      // Si l'utilisateur confirme, envoyer les données du virement au serveur
      this.virementService.effectuerVirement(virementData).subscribe(
        (response: any) => {
          console.log('Réponse du serveur:', response);

          // Afficher un message de succès avec Swal
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Virement effectué avec succès !',
            confirmButtonText: 'OK',
          });
        },
        (error: any) => {
          console.error('Erreur API :', error);

          // Afficher un message d'erreur avec Swal
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors du virement : ' + (error.error?.message || 'Une erreur est survenue.'),
            confirmButtonText: 'OK',
          });
        }
      );
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Si l'utilisateur annule, afficher un message d'annulation
      Swal.fire({
        icon: 'info',
        title: 'Annulé',
        text: 'Le virement a été annulé.',
        confirmButtonText: 'OK',
      });
    }
  });
}}
