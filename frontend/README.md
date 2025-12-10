# 🎮 Transport-Net Frontend

Frontend du jeu Transport-Net utilisant Phaser, TypeScript et Tailwind CSS.

## 🏗️ Architecture

### Structure des dossiers

```
src/
├── components/          # Composants UI réutilisables
│   ├── UIComponents.ts  # Composants de base (Card, Button, Modal, etc.)
│   ├── Dashboard.ts     # Tableau de bord
│   ├── AuthPanel.ts     # Panneau d'authentification
│   └── Toolbar.ts       # Barre d'outils
├── scenes/              # Scènes Phaser
│   └── GameScene.ts     # Scène principale du jeu
├── managers/            # Gestionnaires
│   └── UIManager.ts     # Gestionnaire de l'interface utilisateur
├── services/            # Services
│   └── APIClient.ts     # Client API REST
├── styles/              # Styles
│   └── main.css         # Styles Tailwind personnalisés
├── assets/              # Assets (images, sons, etc.)
├── index.html           # Page HTML principale
└── index.ts             # Point d'entrée
```

## 🎨 Composants UI Réutilisables

### Card
Conteneur stylisé avec effet de verre :
```typescript
import { Card } from './components/UIComponents';

const card = new Card('custom-class');
card.addHeader('<h2>Titre</h2>');
card.addBody('Contenu');
card.addFooter('Pied de page');
```

### Button
Bouton avec variantes :
```typescript
import { Button } from './components/UIComponents';

const btn = new Button('Cliquez-moi', 'primary', '🚀');
btn.onClick(() => console.log('Cliqué !'));
btn.setActive(true);
btn.setDisabled(false);
```

Variantes : `primary`, `secondary`, `success`, `danger`, `outline`

### StatItem
Élément de statistique :
```typescript
import { StatItem } from './components/UIComponents';

const stat = new StatItem('Argent', '10 000 €', '💰');
stat.setValue('15 000 €');
stat.setColor('success');
```

Couleurs : `success`, `primary`, `warning`, `danger`

### Modal
Fenêtre modale :
```typescript
import { Modal } from './components/UIComponents';

const modal = new Modal();
modal.setContent('<h2>Titre</h2><p>Contenu</p>');
modal.show();
modal.hide();
```

### Notification
Notification temporaire :
```typescript
import { Notification } from './components/UIComponents';

Notification.show('Message de succès', 'success', 3000);
```

Types : `success`, `error`, `warning`, `info`

### ToolButton
Bouton d'outil avec icône :
```typescript
import { ToolButton } from './components/UIComponents';

const toolBtn = new ToolButton('Station', '🚉', 'tool-station');
toolBtn.onClick(() => console.log('Tool selected'));
toolBtn.setActive(true);
```

## 🎨 Tailwind CSS

### Classes personnalisées

#### Boutons
- `.btn` - Classe de base pour les boutons
- `.btn-primary` - Bouton primaire (bleu)
- `.btn-success` - Bouton de succès (vert)
- `.btn-danger` - Bouton de danger (rouge)
- `.btn-secondary` - Bouton secondaire (gris)
- `.btn-outline` - Bouton avec bordure

#### Cartes
- `.card` - Carte de base avec effet de verre
- `.card-header` - En-tête de carte
- `.card-body` - Corps de carte
- `.card-footer` - Pied de carte

#### Stats
- `.stat-item` - Conteneur de statistique
- `.stat-label` - Label de statistique
- `.stat-value` - Valeur de statistique

#### Utilitaires
- `.glass-effect` - Effet de verre avec transparence

### Palette de couleurs

```css
primary: #0ea5e9 (bleu)
success: #16c784 (vert)
danger: #ea3943 (rouge)
warning: #f6b93b (jaune)
dark: #0f172a - #020617 (dégradé de gris foncé)
```

## 🚀 Développement

### Lancer le serveur de développement
```bash
npm run dev
```

### Build pour la production
```bash
npm run build
```

## 🎮 Utilisation de Phaser

### Créer une nouvelle scène
```typescript
import Phaser from 'phaser';

export class MyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MyScene' });
  }
  
  create() {
    // Votre code ici
  }
}
```

### Ajouter la scène au jeu
```typescript
// Dans index.ts
const config: Phaser.Types.Core.GameConfig = {
  scene: [GameScene, MyScene]
};
```

## 🔌 API Client

### Utiliser l'API client
```typescript
import { APIClient } from './services/APIClient';

const apiClient = new APIClient();

// Authentification
const user = await apiClient.checkAuth();

// Réseaux
const networks = await apiClient.getNetworks();
const network = await apiClient.getNetwork(id);

// Stations
await apiClient.createStation({
  networkId: '...',
  name: 'Station 1',
  x: 100,
  y: 200,
  cost: 1000
});

// Lignes
await apiClient.createLine({
  networkId: '...',
  name: 'Ligne 1',
  color: '#FF0000'
});
```

## 📝 Best Practices

1. **Composants réutilisables** : Créez des composants pour les éléments UI récurrents
2. **Tailwind first** : Utilisez les classes Tailwind plutôt que du CSS custom
3. **TypeScript strict** : Respectez les types TypeScript
4. **Séparation des responsabilités** : Séparez la logique métier de l'UI
5. **Gestion d'état** : Centralisez l'état dans les managers
6. **Notifications** : Utilisez le système de notifications pour le feedback utilisateur

## 🐛 Debugging

### Activer le mode debug de Phaser
```typescript
const config: Phaser.Types.Core.GameConfig = {
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  }
};
```

### Console logs
```typescript
console.log('Debug info:', data);
```

## 📦 Dépendances principales

- **Phaser** : Moteur de jeu 2D
- **TypeScript** : Langage typé
- **Tailwind CSS** : Framework CSS utility-first
- **Webpack** : Bundler
- **PostCSS** : Traitement CSS

