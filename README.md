# 🏦 STB Everywhere – Frontend (Angular)

Interface web de **STB Everywhere**, une plateforme de **banque en ligne** avec un **espace client** (comptes, virements, cartes, chéquiers, demandes, réclamations) et un **espace agent** (traitement des demandes et suivi statistique).

![Angular](https://img.shields.io/badge/Angular_16-DD0031?style=flat&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular_Material-757575?style=flat&logo=angular&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=flat&logo=bootstrap&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chartdotjs&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white)

> Backend associé (microservices .NET) : [STBEverywheres_Back](https://github.com/GuesmiIkram/STBEverywheres_Back)

<!-- ✏️ Ajoutez ici des captures d'écran, par exemple :
![Tableau de bord client](docs/dashboard-client.png)
![Espace agent](docs/dashboard-agent.png)
-->

---

## Fonctionnalités

### Espace client
- **Compte utilisateur** : inscription, connexion, vérification d'email, mot de passe oublié, changement de mot de passe, paramètres du profil
- **Tableau de bord** : vue d'ensemble des comptes
- **Ma banque** : comptes, RIB / IBAN, extraits, découvert
- **Paiements** : virements, bénéficiaires, cartes bancaires, chéquiers
- **Demandes** : carte, chéquier, découvert, augmentation de plafond, packs Elyssa et Student
- **Réclamations** : dépôt et historique des réponses
- **Simulateur de crédit**
- **Documents KYC** : téléchargement
- **Accueil** : carte interactive des agences (Leaflet), assistant **chatbot**, taux de change

### Espace agent
- **Tableau de bord** avec statistiques des demandes (Chart.js)
- Traitement des demandes (chéquier, découvert, plafond, packs) et des réclamations
- Validation des demandes de modification des informations client

---

## Stack technique

| Domaine | Technologies |
|---|---|
| Framework | Angular 16, TypeScript |
| UI | Angular Material, Bootstrap 5, ngx-toastr, ngx-spinner |
| Graphiques | Chart.js |
| Cartographie | Leaflet |
| Sécurité | Intercepteurs HTTP (ajout du JWT), gestion des cookies |
| Communication | Services Angular appelant l'API Gateway du backend |

---

## Structure

```
src/app/
├── Interceptors/        # ajout du token JWT aux requêtes
├── services/            # appels aux microservices via l'API Gateway
├── Models/, enums/      # modèles TypeScript
├── resgiter/, reset-password/, verify-email/   # authentification
├── home/                # tableau de bord client
├── ma-banque/, rib-iban/, extrait/             # comptes
├── paiement/            # virements, bénéficiaires, cartes, chéquiers
├── demandes/            # demandes de carte, chéquier, découvert, plafond, packs
├── reclamation/, historique-reclamations/
├── simulateur-credit/
└── dashbord-agent/, reponse-reclamation/, modification-requests/   # espace agent
```

---

## Lancer le projet

Prérequis : [Node.js](https://nodejs.org) 18+ et le [backend](https://github.com/GuesmiIkram/STBEverywheres_Back) démarré.

```bash
npm install
npm start
```

Puis ouvrir http://localhost:4200.

---

## Mon rôle dans le projet

Projet réalisé **en équipe** dans le cadre de mon **stage de fin d'études** (février – juin 2025).

<!-- ✏️ À compléter avec VOS contributions, par exemple : -->
- Développement des pages … (à compléter)
- Intégration des appels aux API REST via l'API Gateway
- …

---

👩‍💻 **Ikram Guesmi** — [LinkedIn](https://www.linkedin.com/in/ikram-guesmi75)
