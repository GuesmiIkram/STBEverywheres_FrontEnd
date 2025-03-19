import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Compte } from 'src/app/Models/compte';
import { VirementService } from 'src/app/services/virement.service';

@Component({
  selector: 'app-initier-virement',
  templateUrl: './initier-virement.component.html',
  styleUrls: ['./initier-virement.component.scss']
})
export class InitierVirementComponent implements OnInit {

  comptes: Compte[] = [];
  virementForm: FormGroup;

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
  }

  // Fonction pour envoyer le virement
  effectuerVirement(): void {
    console.log('Fonction effectuerVirement() appelée !');
    if (!this.virementForm.valid) {
      console.log('Formulaire invalide :', this.virementForm.value);
      return;
    }

      const virementData = {
        RIB_Emetteur: this.virementForm.value.compteEmetteur,
        RIB_Recepteur: this.virementForm.value.ribBeneficiaire,
        Montant: this.virementForm.value.montant,
        Motif: this.virementForm.value.motif,
        Description: this.virementForm.value.description,
      };
      console.log('Données envoyées pour le virement :', virementData);
      this.virementService.effectuerVirement(virementData).subscribe(
        (response: any) => {  // Ajout de `any` pour éviter l erreur TS7006
          console.log('Réponse du serveur:', response); // Log de la réponse
          alert('Virement effectué avec succès !');
        },
        (error: any) => {  // Ajout de `any` pour éviter TS7006
          console.error('Erreur API :', error);
          alert('Erreur lors du virement : ' + error.error.message);
        }
      );

  }
}
