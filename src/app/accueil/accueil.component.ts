import { Component, type OnInit, type AfterViewInit, ViewChild, type ElementRef } from "@angular/core"
import * as L from "leaflet"
import { ChatbotService } from "../services/ChatbotService"

@Component({
  selector: "app-accueil",
  templateUrl: "./accueil.component.html",
  styleUrls: ["./accueil.component.scss"],
})
export class AccueilComponent implements OnInit, AfterViewInit {
  @ViewChild("authSection") authSection!: ElementRef
  expandedService: string | null = null
  epargneMontant = 1000
  epargneDuree = 3
  epargneResultat: number | null = null
  montant = 50000
  duree = 36
  taux = 7
  typeAmortissement = "constant"
  result: any = null
  details: any[] = []
  showSimulator = false
  showChatbot = false
  showMap = false
  private map!: L.Map
  private markersLayer!: L.LayerGroup
  filteredAgences: any[] = []
  selectedAgence: any = null
  messages: { text: string, sender: 'user' | 'bot' }[] = [];
  newMessage = '';

  // Liste des agences STB
  agences = [
    {
      name: "STB Tunis Centre",
      lat: 36.8008,
      lng: 10.1803,
      address: "Avenue Habib Bourguiba, Tunis",
      shortAddress: "Avenue Habib Bourguiba",
      phone: "+216 71 340 477",
      hours: "Lun-Ven: 8h-16h, Sam: 8h-12h",
    },
    {
      name: "STB Lafayette",
      lat: 36.8114,
      lng: 10.1849,
      address: "Rue de Marseille, Tunis",
      shortAddress: "Rue de Marseille",
      phone: "+216 71 783 140",
      hours: "Lun-Ven: 8h-16h, Sam: 8h-12h",
    },
    {
      name: "STB El Menzah",
      lat: 36.8381,
      lng: 10.1651,
      address: "Avenue de la Liberté, El Menzah",
      shortAddress: "Avenue de la Liberté",
      phone: "+216 71 238 680",
      hours: "Lun-Ven: 8h-16h, Sam: 8h-12h",
    },
    {
      name: "STB Lac",
      lat: 36.8389,
      lng: 10.2417,
      address: "Les Berges du Lac, Tunis",
      shortAddress: "Les Berges du Lac",
      phone: "+216 71 861 861",
      hours: "Lun-Ven: 8h-16h, Sam: 8h-12h",
    },
    {
      name: "STB Ariana",
      lat: 36.8625,
      lng: 10.1956,
      address: "Avenue de la République, Ariana",
      shortAddress: "Avenue de la République",
      phone: "+216 71 709 900",
      hours: "Lun-Ven: 8h-16h, Sam: 8h-12h",
    },
  ]
  selectedService: string | null = null;

  showDetails(service: string): void {
    this.selectedService = service;
  }
  
  closeDetails(): void {
    this.selectedService = null;
  }
  
  constructor(private chatbotService: ChatbotService)  {
    this.filteredAgences = [...this.agences]
  }

  ngOnInit(): void {
    // Précharger les ressources Leaflet
    this.preloadLeafletResources()
  }

  ngAfterViewInit(): void {
    if (this.showMap) {
      setTimeout(() => {
        this.initMap()
      }, 500)
    }
  }

  // Préchargement des ressources Leaflet pour éviter les problèmes CORS
  private preloadLeafletResources(): void {
    // Précharger quelques tuiles de carte
    const preloadTiles = () => {
      const img1 = new Image()
      img1.crossOrigin = "Anonymous"
      img1.src = "https://tile.openstreetmap.org/10/512/384.png"

      const img2 = new Image()
      img2.crossOrigin = "Anonymous"
      img2.src = "https://tile.openstreetmap.org/10/512/385.png"
    }

    setTimeout(preloadTiles, 100)
  }
  toggleblock() {
    this.showChatbot = !this.showChatbot;
  }
  toggleBlock(block: string): void {
    this.showSimulator = block === "simulator"
    this.showChatbot = block === "chatbot"

    // Gérer l'affichage de la carte
    if (block === "map") {
      this.showMap = true

      // Attendre que le DOM soit complètement rendu
      setTimeout(() => {
        this.initMap()
      }, 500)
    } else {
      this.showMap = false
    }
  }

  private initMap(): void {
    console.log("Initialisation de la carte...")

    // Vérifier si l'élément map existe dans le DOM
    const mapElement = document.getElementById("map")
    if (!mapElement) {
      console.error("Élément map non trouvé dans le DOM")
      return
    }

    // S'assurer que le conteneur a des dimensions
    mapElement.style.height = "500px"
    mapElement.style.width = "100%"

    // Détruire la carte existante si elle existe
    if (this.map) {
      console.log("Suppression de la carte existante")
      this.map.remove()
      this.map = null as any
    }

    try {
      // Créer une nouvelle carte avec des options spécifiques
      this.map = L.map("map", {
        center: [36.8065, 10.1815],
        zoom: 13,
        zoomControl: true,
        attributionControl: true,
      })

      // Utiliser OpenStreetMap directement (solution la plus fiable et gratuite)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        crossOrigin: "anonymous",
      }).addTo(this.map)

      // Créer une couche pour les marqueurs
      this.markersLayer = L.layerGroup().addTo(this.map)

      // Ajouter les marqueurs pour chaque agence
      this.agences.forEach((agence) => {
        // Créer un marqueur HTML personnalisé
        const customIcon = L.divIcon({
          className: "custom-div-icon",
          html: `<div class="marker-pin"></div>`,
          iconSize: [30, 42],
          iconAnchor: [15, 42],
          popupAnchor: [0, -35],
        })

        const marker = L.marker([agence.lat, agence.lng], { icon: customIcon })
          .addTo(this.markersLayer)
          .bindPopup(`
          <div class="custom-popup">
            <h3>${agence.name}</h3>
            <p><i class="fas fa-map-marker-alt"></i> ${agence.address}</p>
            <p><i class="fas fa-phone"></i> ${agence.phone}</p>
            <p><i class="fas fa-clock"></i> ${agence.hours}</p>
          </div>
        `)

        // Ajouter un événement pour ouvrir le popup au clic
        marker.on("click", () => {
          this.selectedAgence = agence
        })
      })

      // Ajuster la vue pour montrer toutes les agences
      const bounds = L.latLngBounds(this.agences.map((agence) => [agence.lat, agence.lng]))
      this.map.fitBounds(bounds, { padding: [50, 50] })

      // Forcer plusieurs redimensionnements pour s'assurer que la carte est correctement rendue
      this.forceMapResize()

      console.log("Carte initialisée avec succès")
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte:", error)

      // Solution de secours: utiliser une iframe avec OpenStreetMap
      this.useIframeMap()
    }
  }

  // Solution de secours: utiliser une iframe avec OpenStreetMap
  private useIframeMap(): void {
    const mapElement = document.getElementById("map")
    if (!mapElement) return

    // Calculer le centre des agences
    const lats = this.agences.map((a) => a.lat)
    const lngs = this.agences.map((a) => a.lng)
    const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length
    const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length

    // Créer l'iframe avec OpenStreetMap
    mapElement.innerHTML = `
      <iframe 
        width="100%" 
        height="100%" 
        frameborder="0" 
        scrolling="no" 
        marginheight="0" 
        marginwidth="0" 
        src="https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.05}%2C${centerLat - 0.05}%2C${centerLng + 0.05}%2C${centerLat + 0.05}&amp;layer=mapnik&amp;marker=${centerLat}%2C${centerLng}" 
        style="border: 1px solid #ccc">
      </iframe>
    `

    console.log("Carte de secours (iframe) chargée")
  }

  // Ajouter cette nouvelle méthode pour forcer le redimensionnement de la carte
  private forceMapResize(): void {
    if (!this.map) return

    // Redimensionner immédiatement
    this.map.invalidateSize(true)

    // Redimensionner après un court délai
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize(true)
        console.log("Carte redimensionnée (1er appel)")
      }
    }, 300)

    // Redimensionner après un délai plus long
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize(true)
        console.log("Carte redimensionnée (2ème appel)")
      }
    }, 1000)
  }

  focusOnAgence(agence: any): void {
    if (!this.map) return

    // Centrer la carte sur l'agence sélectionnée
    this.map.setView([agence.lat, agence.lng], 15)
    this.selectedAgence = agence

    // Ouvrir le popup correspondant
    this.markersLayer.eachLayer((layer: any) => {
      const layerLatLng = layer.getLatLng()
      if (layerLatLng.lat === agence.lat && layerLatLng.lng === agence.lng) {
        layer.openPopup()
      }
    })
  }

  searchAgences(event: any): void {
    const searchTerm = event.target.value.toLowerCase()

    // Filtrer les agences selon le terme de recherche
    this.filteredAgences = this.agences.filter(
      (agence) => agence.name.toLowerCase().includes(searchTerm) || agence.address.toLowerCase().includes(searchTerm),
    )

    // Mettre à jour la visibilité des marqueurs sur la carte
    if (this.markersLayer) {
      this.markersLayer.eachLayer((layer: any) => {
        const layerLatLng = layer.getLatLng()
        const matchingAgence = this.filteredAgences.find(
          (agence) => agence.lat === layerLatLng.lat && agence.lng === agence.lng,
        )

        if (matchingAgence) {
          layer.setOpacity(1)
        } else {
          layer.setOpacity(0.3)
        }
      })
    }
  }

  calculerCredit() {
    const tauxMensuel = this.taux / 12 / 100
    const nombreMensualites = this.duree

    if (this.typeAmortissement === "constant") {
      const mensualite = (this.montant * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -nombreMensualites))
      this.result = { type: "Mensualité constante", mensualite: mensualite.toFixed(2) }
    } else if (this.typeAmortissement === "variable") {
      const capitalFixe = this.montant / nombreMensualites
      let capitalRestant = this.montant
      this.details = []

      for (let i = 1; i <= nombreMensualites; i++) {
        const interet = capitalRestant * tauxMensuel
        const mensualite = capitalFixe + interet
        this.details.push({
          mois: i,
          mensualite: mensualite.toFixed(2),
          interet: interet.toFixed(2),
          capitalRestant: capitalRestant.toFixed(2),
        })
        capitalRestant -= capitalFixe
      }
      this.result = { type: "Amortissement variable", details: this.details }
    }
  }

  toggleService(service: string) {
    this.expandedService = this.expandedService === service ? null : service
  }

  isExpanded(service: string): boolean {
    return this.expandedService === service
  }

  calculerEpargne() {
    const taux = 0.03
    this.epargneResultat = this.epargneMontant * Math.pow(1 + taux, this.epargneDuree)
  }

  scrollToAuth(tab: "login" | "register"): void {
    this.authSection.nativeElement.scrollIntoView({ behavior: "smooth" })
    setTimeout(() => {
      const authComponent = this.authSection.nativeElement.querySelector("app-auth")
      if (authComponent) {
        authComponent.activeTab = tab
      }
    }, 500)
  }
  sendMessage() {
    if (!this.newMessage.trim()) return;

    // Ajouter le message de l'utilisateur
    this.messages.push({ text: this.newMessage, sender: 'user' });
    const userMessage = this.newMessage;
    this.newMessage = '';

    // Envoyer au backend et recevoir la réponse
    this.chatbotService.sendMessage(userMessage).subscribe(
      (response: any) => {
        this.messages.push({ text: response.reply, sender: 'bot' });
      },
      (error) => {
        console.error('Erreur du chatbot:', error);
        this.messages.push({ 
          text: "Désolé, je rencontre un problème technique. Veuillez réessayer plus tard.", 
          sender: 'bot' 
        });
      }
    );
  }
}
