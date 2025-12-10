# 🚇 Transport-Net - Guide d'installation

## Prérequis

- Node.js 18+ et npm installés
- Un navigateur web moderne

## Installation

### 1. Installer les dépendances

À la racine du projet, exécutez :

```bash
npm install
npm run install:all
```

Cette commande installera les dépendances pour le backend et le frontend.

### 2. Configurer la base de données

La base de données est déjà configurée avec PostgreSQL hébergé sur Prisma.

```bash
cd backend
npm run prisma:generate
npx prisma db push  # Synchroniser le schéma avec la base de données
```

> **Note** : Le projet utilise PostgreSQL hébergé. La base de données est partagée et accessible via l'URL configurée dans `backend/.env`.

### 3. Configurer les variables d'environnement

Un fichier d'exemple `env.example` est disponible à la racine et dans le dossier `backend/`. 

**Méthode 1 : Copier le fichier d'exemple**
```bash
cp env.example backend/.env
```

**Méthode 2 : Le fichier `.env` a déjà été créé dans `backend/.env`**

Vous pouvez modifier `backend/.env` pour :

- Configurer l'authentification OAuth (Discord, GitHub, Twitter)
- Modifier le port du serveur
- Changer le secret de session

Pour configurer OAuth :

#### Discord
1. Allez sur https://discord.com/developers/applications
2. Créez une nouvelle application
3. Ajoutez un OAuth2 redirect URL : `http://localhost:3000/api/auth/discord/callback`
4. Copiez le Client ID et Client Secret dans `backend/.env`

#### GitHub
1. Allez sur https://github.com/settings/developers
2. Créez une nouvelle OAuth App
3. Authorization callback URL : `http://localhost:3000/api/auth/github/callback`
4. Copiez le Client ID et Client Secret dans `backend/.env`

## Lancement du projet

### Mode développement

À la racine du projet :

```bash
npm run dev
```

Cette commande lancera simultanément :
- Le backend sur http://localhost:3000
- Le frontend sur http://localhost:3001

### Lancement séparé

Backend uniquement :
```bash
npm run dev:backend
```

Frontend uniquement :
```bash
npm run dev:frontend
```

## Accès à l'application

Une fois lancé, ouvrez votre navigateur à l'adresse :
**http://localhost:3001**

## Structure du projet

```
transport-net/
├── backend/              # Serveur Node.js + Express
│   ├── src/
│   │   ├── config/      # Configuration Passport OAuth
│   │   ├── db/          # Client Prisma
│   │   ├── middleware/  # Middlewares Express
│   │   ├── routes/      # Routes API
│   │   └── index.ts     # Point d'entrée
│   ├── prisma/
│   │   └── schema.prisma # Schéma de base de données
│   └── package.json
│
├── frontend/             # Client Phaser
│   ├── src/
│   │   ├── scenes/      # Scènes Phaser
│   │   ├── managers/    # Gestionnaires (UI, etc.)
│   │   ├── services/    # Services API
│   │   ├── index.html   # Page HTML
│   │   └── index.ts     # Point d'entrée
│   └── package.json
│
└── package.json          # Scripts racine
```

## Fonctionnalités implémentées

✅ Backend Node.js + Express + TypeScript
✅ Base de données Prisma ORM avec **PostgreSQL hébergé**
✅ Authentification OAuth (Discord, GitHub)
✅ API REST complète (réseaux, stations, lignes)
✅ Frontend Phaser + TypeScript
✅ Interface utilisateur moderne avec **Tailwind CSS**
✅ **Composants UI réutilisables** (Card, Button, Modal, Notification, etc.)
✅ **Système de design cohérent** avec palette de couleurs personnalisée
✅ Système de création de stations
✅ Calcul des revenus en temps réel
✅ Sauvegarde automatique
✅ Notifications utilisateur élégantes

## Prochaines étapes

- Implémenter la création de lignes via l'interface
- Ajouter plus de types de stations (tramway, bus, etc.)
- Améliorer le système de revenus
- Ajouter des défis et objectifs
- Implémenter un système de zoom/déplacement de la carte
- Ajouter des animations

## Support

Pour toute question ou problème, consultez les logs dans votre terminal.

