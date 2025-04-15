import { Component, OnInit } from '@angular/core';
import { DemandeFormatee } from 'src/app/Models/DemandeFormatee';
import { DemandeMois } from 'src/app/Models/DemandeMois';
import { DemandeChequierService } from 'src/app/services/DemandeChequier.service';


@Component({
  selector: 'app-suivi-demandechequiers',
  templateUrl: './suivi-demandechequiers.component.html',
  styleUrls: ['./suivi-demandechequiers.component.scss']
})

export class SuiviDemandechequiersComponent implements OnInit{



  demandes: any[] = []
  demandesParMois: DemandeMois[] = []

  constructor(private chequierService: DemandeChequierService) {}

  ngOnInit(): void {
    this.getDemandes()
  }

  getDemandes(): void {
    this.chequierService.getDemandesParClient().subscribe({
      next: (data) => {
        console.log("Received data:", data)
        this.demandes = data
        this.formaterDemandes()
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des demandes :", err)
      },
    })
  }
  formaterDemandes(): void {
    const demandesFormatees = this.demandes.map((demande) => {
      const date = new Date(demande.dateDemande);
      const moisAbrev = this.getMoisAbrege(date.getMonth());

      // Conversion des statuts avec plus de granularité
      let status = "EN ATTENTE";
      let statusClass = "status-attente";

      switch(demande.status) {
        case "EnCoursPreparation":
          status = "EN PRÉPARATION";
          statusClass = "status-preparation";
          break;
        case "DisponibleEnAgence":
          status = "DISPONIBLE EN AGENCE";
          statusClass = "status-disponible";
          break;
        case "RemisAuClient":
          status = "REMIS AU CLIENT";
          statusClass = "status-remis";
          break;
        case "Expedie":
          status = "EXPÉDIÉ";
          statusClass = "status-expedie";
          break;
        case "REFUSEE":
        case "REFUSÉE":
          status = "REFUSÉE";
          statusClass = "status-refuse";
          break;
      }

      return {
        ...demande,
        dateDemande: date,
        jour: date.getDate(),
        moisAbrev: moisAbrev,
        status: status,
        statusClass: statusClass,
        type: demande.type.replace("chéque", "chèque")
      };
    });

    // Grouper par mois et année
    const demParMois: { [key: string]: DemandeFormatee[] } = {}

    demandesFormatees.forEach((demande) => {
      const date = demande.dateDemande
      const moisAnnee = `${date.getMonth()}-${date.getFullYear()}`

      if (!demParMois[moisAnnee]) {
        demParMois[moisAnnee] = []
      }

      demParMois[moisAnnee].push(demande)
    })
    // Convertir en tableau pour l'affichage
    this.demandesParMois = Object.keys(demParMois).map((key) => {
      const [mois, annee] = key.split("-")
      return {
        nom: this.getNomMois(Number.parseInt(mois)),
        annee: Number.parseInt(annee),
        demandes: demParMois[key],
      }
    })

    // Trier par date (plus récent en premier)
    this.demandesParMois.sort((a, b) => {
      if (a.annee !== b.annee) return b.annee - a.annee
      return (
        Number.parseInt(
          Object.keys(demParMois)
            .find((key) => key.includes(`${a.nom}-${a.annee}`))
            ?.split("-")[0] || "0",
        ) -
        Number.parseInt(
          Object.keys(demParMois)
            .find((key) => key.includes(`${b.nom}-${b.annee}`))
            ?.split("-")[0] || "0",
        )
      )
    })
  }


     /* formaterDemandes(): void {
        const demandesFormatees = this.demandes.map((demande) => {
          const date = new Date(demande.dateDemande);

          // Obtenir le mois abrégé en français
          const moisAbrev = this.getMoisAbrege(date.getMonth());

          // Convertir le statut en format d'affichage
          let status = "EN ATTENTE";
          if (demande.status === "ACCEPTEE" || demande.status === "ACCEPTÉE" ||
              demande.status === "DisponibleEnAgence" || demande.status === "Expedie") {
            status = "ACCEPTÉE";
          } else if (demande.status === "REFUSEE" || demande.status === "REFUSÉE") {
            status = "REFUSÉE";
          }

          return {
            ...demande,
            dateDemande: date,
            jour: date.getDate(),
            moisAbrev: moisAbrev,
            status: status,
            type: demande.type.replace("chéque", "chèque") // Fix French spelling
          };
        });

    // Grouper par mois et année
    const demParMois: { [key: string]: DemandeFormatee[] } = {}

    demandesFormatees.forEach((demande) => {
      const date = demande.dateDemande
      const moisAnnee = `${date.getMonth()}-${date.getFullYear()}`

      if (!demParMois[moisAnnee]) {
        demParMois[moisAnnee] = []
      }

      demParMois[moisAnnee].push(demande)
    })
    // Convertir en tableau pour l'affichage
    this.demandesParMois = Object.keys(demParMois).map((key) => {
      const [mois, annee] = key.split("-")
      return {
        nom: this.getNomMois(Number.parseInt(mois)),
        annee: Number.parseInt(annee),
        demandes: demParMois[key],
      }
    })

    // Trier par date (plus récent en premier)
    this.demandesParMois.sort((a, b) => {
      if (a.annee !== b.annee) return b.annee - a.annee
      return (
        Number.parseInt(
          Object.keys(demParMois)
            .find((key) => key.includes(`${a.nom}-${a.annee}`))
            ?.split("-")[0] || "0",
        ) -
        Number.parseInt(
          Object.keys(demParMois)
            .find((key) => key.includes(`${b.nom}-${b.annee}`))
            ?.split("-")[0] || "0",
        )
      )
    })
  }*/

  getMoisAbrege(mois: number): string {
    const moisAbreges = ["JAN", "FÉV", "MAR", "AVR", "MAI", "JUN", "JUL", "AOÛ", "SEP", "OCT", "NOV", "DÉC"]
    return moisAbreges[mois]
  }

  getNomMois(mois: number): string {
    const nomsMois = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ]
    return nomsMois[mois]
  }



  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'acceptée':
        return 'status-badge status-acceptée';
      case 'refusée':
        return 'status-badge status-refusée';
      case 'en attente':
        return 'status-badge status-en-attente';
      default:
        return 'status-badge';
    }
  }


}
