import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { UIManager } from './managers/UIManager';
import { APIClient } from './services/APIClient';
import { LoginModal } from './components/LoginModal';
import { ThemeManager } from './managers/ThemeManager';
import './styles/main.css';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'phaser-game',
  backgroundColor: '#0f172a', // Sera mis à jour par le ThemeManager
  scene: [GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

// Initialiser le jeu
const game = new Phaser.Game(config);

// Initialiser les gestionnaires
const uiManager = new UIManager();
const apiClient = new APIClient();
const themeManager = new ThemeManager();

// Passer l'API client à la scène de jeu
game.registry.set('apiClient', apiClient);
game.registry.set('uiManager', uiManager);

// Flag pour le mode invité
let isGuestMode = false;

// Callback pour le mode invité
const handleGuestMode = () => {
  isGuestMode = true;
  uiManager.setGuestMode(true);
  uiManager.showNotification('Mode invité activé - Aucune sauvegarde', 'info');
  console.log('🎮 Mode invité activé');
};

// Créer la modale de connexion
const loginModal = new LoginModal(handleGuestMode);

// Vérifier l'authentification au démarrage
apiClient.checkAuth().then(user => {
  if (user) {
    // Utilisateur déjà connecté, ne pas afficher la modale
    uiManager.setUser(user);
    loginModal.remove();
    console.log('👤 Utilisateur connecté:', user.username);
  } else {
    // Pas d'utilisateur connecté, afficher la modale
    loginModal.show();
  }
}).catch(() => {
  // Erreur d'authentification, afficher la modale
  loginModal.show();
});

// Gérer le redimensionnement de la fenêtre
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});

// Exposer le mode invité pour les autres modules
(window as any).isGuestMode = () => isGuestMode;

console.log('🚇 Transport-Net démarré !');

