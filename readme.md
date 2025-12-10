# Transport-Net — jeu de réseau de transport 2D minimaliste

## 🎯 Objectif du projet  
Transport-Net est un jeu solo accessible via navigateur permettant à l’utilisateur de créer et gérer son propre réseau de transport (métro, tramway, etc.).  
Le but est de proposer une expérience simple et minimaliste : poser des stations, tracer des lignes, visualiser les revenus générés, et suivre la performance du réseau.  

## Fonctionnalités principales (MVP)  
- Création de stations et de lignes sur une carte 2D.  
- Simulation simplifiée : calcul des revenus générés par le réseau, affichage des revenus par seconde.  
- Tableau de bord indiquant : performance du réseau, argent généré par seconde, liste des lignes existantes.  
- Authentification utilisateur (via OAuth — ex. Discord, GitHub, Twitter) pour permettre la sauvegarde et la récupération de la progression.  
- Persistance des données du joueur (état du réseau, argent, historique, etc.) sur serveur.  

## Technologies & stack envisagées  
- **Frontend (client)** :  
  - Phaser (HTML5 / Canvas ou WebGL) pour la partie "jeu 2D". :contentReference[oaicite:1]{index=1}  
  - HTML / CSS / JavaScript ou TypeScript — selon ton confort.  
  - Une UI overlay pour le tableau de bord (statistiques, interface utilisateur simple).  
- **Backend (serveur)** :  
  - Node.js (Express) pour gérer l'authentification, les APIs de sauvegarde, récupération des données, etc.  
  - Base de données **Prisma ORM** avec **PostgreSQL** hébergé pour stocker les réseaux utilisateurs, données persistantes.

## 🚀 Statut du projet

✅ **Projet initialisé et prêt à l'emploi !**

### Ce qui a été mis en place :

#### Backend (Node.js + Express + TypeScript)
- ✅ Structure complète avec TypeScript
- ✅ Base de données Prisma ORM avec **PostgreSQL hébergé** et schéma complet
- ✅ Authentification OAuth (Discord, GitHub)
- ✅ API REST complète :
  - Routes d'authentification
  - Gestion des réseaux
  - Gestion des stations
  - Gestion des lignes
- ✅ Middleware de sécurité

#### Frontend (Phaser + TypeScript)
- ✅ Configuration Webpack + TypeScript
- ✅ Scène de jeu Phaser fonctionnelle
- ✅ Interface utilisateur moderne et responsive
- ✅ Gestionnaire d'API client
- ✅ Système de création de stations
- ✅ Tableau de bord en temps réel
- ✅ Authentification intégrée

#### Configuration
- ✅ Fichiers de configuration (.gitignore, .env, tsconfig, etc.)
- ✅ Scripts NPM pour faciliter le développement
- ✅ Documentation d'installation (voir INSTALL.md)

### Pour démarrer :

```bash
# Installer les dépendances
npm install
npm run install:all

# Configurer la base de données
cd backend
npm run prisma:generate
npm run prisma:migrate
cd ..

# Lancer en mode développement
npm run dev
```

Le jeu sera accessible sur **http://localhost:3001**

Consultez **INSTALL.md** pour les instructions détaillées d'installation et de configuration.
