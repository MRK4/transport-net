import Phaser from 'phaser';
import { APIClient } from '../services/APIClient';
import { UIManager } from '../managers/UIManager';
import { CostDisplay } from '../components/CostDisplay';

export class GameScene extends Phaser.Scene {
  private apiClient!: APIClient;
  private uiManager!: UIManager;
  private costDisplay!: CostDisplay;
  private stations: any[] = [];
  private lines: any[] = [];
  private currentTool: string = 'none';
  private network: any = null;
  private money: number = 10000;
  private revenue: number = 0;
  
  // Graphiques
  private stationGraphics!: Phaser.GameObjects.Graphics;
  private lineGraphics!: Phaser.GameObjects.Graphics;
  private gameTitle!: Phaser.GameObjects.Text;
  
  // Création de ligne
  private lineCreationMode: 'selecting_first' | 'selecting_second' | 'none' = 'none';
  private selectedStationForLine: any = null;
  private temporaryLineGraphics!: Phaser.GameObjects.Graphics;
  
  constructor() {
    super({ key: 'GameScene' });
  }
  
  init() {
    this.apiClient = this.registry.get('apiClient');
    this.uiManager = this.registry.get('uiManager');
    this.costDisplay = new CostDisplay();
  }
  
  create() {
    // Créer les graphiques
    this.lineGraphics = this.add.graphics();
    this.stationGraphics = this.add.graphics();
    this.temporaryLineGraphics = this.add.graphics();
    
    // Gérer les clics sur la carte
    this.input.on('pointerdown', this.handleMapClick, this);
    
    // Connecter les boutons de l'UI
    this.setupUIButtons();
    
    // Charger le réseau de l'utilisateur
    this.loadNetwork();
    
    // Mettre à jour les revenus toutes les secondes
    this.time.addEvent({
      delay: 1000,
      callback: this.updateRevenue,
      callbackScope: this,
      loop: true
    });
    
    // Afficher un message de bienvenue
    this.addText();
    
    // Écouter les changements de thème
    this.setupThemeListener();
    
    // Initialiser l'affichage des coûts
    this.updateUI();
  }
  
  private setupThemeListener() {
    // Observer les changements de classe sur l'élément root
    const observer = new MutationObserver(() => {
      this.updateBackgroundColor();
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Appliquer la couleur initiale
    this.updateBackgroundColor();
  }
  
  private updateBackgroundColor() {
    const isDark = document.documentElement.classList.contains('dark') || 
                   !document.documentElement.classList.contains('light');
    
    // Couleurs adaptées au thème
    const bgColor = isDark ? 0x0f172a : 0xffffff; // Gris très foncé ou blanc
    const textColor = isDark ? '#ffffff' : '#0f172a';
    
    if (this.cameras.main) {
      this.cameras.main.setBackgroundColor(bgColor);
    }
    
    // Mettre à jour la couleur du texte
    if (this.gameTitle) {
      this.gameTitle.setColor(textColor);
    }
  }
  
  private addText() {
    const isDark = document.documentElement.classList.contains('dark') || 
                   !document.documentElement.classList.contains('light');
    
    this.gameTitle = this.add.text(20, 20, '🚇 Transport-Net', {
      fontSize: '32px',
      color: isDark ? '#ffffff' : '#0f172a',
      fontStyle: 'bold'
    });
    this.gameTitle.setScrollFactor(0);
    this.gameTitle.setDepth(1000);
  }
  
  private setupUIButtons() {
    // Toolbar
    document.getElementById('tool-station')?.addEventListener('click', () => {
      this.currentTool = 'station';
      this.updateToolButtons();
    });
    
    document.getElementById('tool-line')?.addEventListener('click', () => {
      this.currentTool = 'line';
      this.updateToolButtons();
    });
    
    document.getElementById('tool-delete')?.addEventListener('click', () => {
      this.currentTool = 'delete';
      this.updateToolButtons();
    });
    
    // Authentication
    this.uiManager.setupAuthButtons(
      () => window.location.href = 'http://localhost:3000/api/auth/discord',
      () => window.location.href = 'http://localhost:3000/api/auth/github',
      async () => {
        await this.apiClient.logout();
        this.uiManager.setUser(null);
        this.uiManager.showNotification('Déconnexion réussie', 'success');
        setTimeout(() => location.reload(), 1000);
      }
    );
  }
  
  private updateToolButtons() {
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    if (this.currentTool === 'station') {
      document.getElementById('tool-station')?.classList.add('active');
      this.lineCreationMode = 'none';
      this.selectedStationForLine = null;
    } else if (this.currentTool === 'line') {
      document.getElementById('tool-line')?.classList.add('active');
      if (this.stations.length < 2) {
        this.uiManager.showNotification('Vous devez avoir au moins 2 stations', 'warning');
        this.currentTool = 'none';
        this.updateToolButtons();
        return;
      }
      this.lineCreationMode = 'selecting_first';
      this.uiManager.showNotification('Cliquez sur la première station', 'info');
    } else if (this.currentTool === 'delete') {
      document.getElementById('tool-delete')?.classList.add('active');
      this.lineCreationMode = 'none';
      this.selectedStationForLine = null;
    }
    
    // Redessiner le réseau si on change d'outil
    if (this.currentTool !== 'line') {
      this.renderNetwork();
    }
  }
  
  private async loadNetwork() {
    try {
      const networks = await this.apiClient.getNetworks();
      if (networks && networks.length > 0) {
        this.network = networks[0];
        this.money = this.network.money;
        this.stations = this.network.stations || [];
        this.lines = this.network.lines || [];
        this.calculateRevenue();
        this.renderNetwork();
        this.updateUI();
      }
    } catch (error) {
      console.log('Réseau non chargé (non authentifié?)');
    }
  }
  
  private handleMapClick(pointer: Phaser.Input.Pointer) {
    if (this.currentTool === 'station') {
      this.createStation(pointer.x, pointer.y);
    } else if (this.currentTool === 'line') {
      this.handleLineCreationClick(pointer.x, pointer.y);
    }
  }
  
  private handleLineCreationClick(x: number, y: number) {
    // Trouver la station la plus proche du clic
    const clickedStation = this.findStationAtPosition(x, y, 20); // Rayon de 20px
    
    if (!clickedStation) {
      this.uiManager.showNotification('Cliquez sur une station', 'info');
      return;
    }
    
    if (this.lineCreationMode === 'none') {
      // Première station sélectionnée
      this.selectedStationForLine = clickedStation;
      this.lineCreationMode = 'selecting_second';
      this.highlightStation(clickedStation);
      this.uiManager.showNotification(`Station "${clickedStation.name}" sélectionnée. Cliquez sur une autre station.`, 'info');
    } else if (this.lineCreationMode === 'selecting_second') {
      // Deuxième station sélectionnée
      if (clickedStation.id === this.selectedStationForLine.id) {
        this.uiManager.showNotification('Sélectionnez une station différente', 'warning');
        return;
      }
      
      // Créer la ligne entre les deux stations
      this.createLine(this.selectedStationForLine, clickedStation);
      
      // Réinitialiser
      this.lineCreationMode = 'none';
      this.selectedStationForLine = null;
      this.renderNetwork();
    }
  }
  
  private findStationAtPosition(x: number, y: number, radius: number): any {
    for (const station of this.stations) {
      const distance = Phaser.Math.Distance.Between(x, y, station.x, station.y);
      if (distance <= radius) {
        return station;
      }
    }
    return null;
  }
  
  private highlightStation(station: any) {
    this.stationGraphics.clear();
    
    // Redessiner toutes les stations
    this.stations.forEach(s => {
      if (s.id === station.id) {
        // Station sélectionnée - surlignée
        this.stationGraphics.fillStyle(0xffd700); // Or
        this.stationGraphics.fillCircle(s.x, s.y, 15);
        this.stationGraphics.lineStyle(3, 0xffffff);
        this.stationGraphics.strokeCircle(s.x, s.y, 15);
      } else {
        // Station normale
        this.stationGraphics.fillStyle(0x16c784);
        this.stationGraphics.fillCircle(s.x, s.y, 10);
        this.stationGraphics.lineStyle(2, 0xffffff);
        this.stationGraphics.strokeCircle(s.x, s.y, 10);
      }
    });
  }
  
  private calculateStationCost(): number {
    // Coût progressif : 1000 × (1.10)^(n) où n est le nombre de stations actuelles
    const baseCost = 1000;
    const count = this.stations.length;
    return Math.round(baseCost * Math.pow(1.10, count));
  }
  
  private calculateLineCost(): number {
    // Coût progressif : 500 × (1.10)^(n-1) où n est le nombre de lignes + 1
    const baseCost = 500;
    const count = this.lines.length;
    return Math.round(baseCost * Math.pow(1.10, count));
  }
  
  private async createStation(x: number, y: number) {
    const cost = this.calculateStationCost();
    
    // Vérifier si l'utilisateur a assez d'argent
    if (this.money < cost) {
      this.uiManager.showNotification('Pas assez d\'argent pour créer une station !', 'error');
      return;
    }
    
    // Mode invité - création locale uniquement
    if (this.uiManager.isGuestMode()) {
      const station = {
        id: `local-${Date.now()}`,
        networkId: 'guest',
        name: `Station ${this.stations.length + 1}`,
        x,
        y,
        type: 'metro',
        revenue: 100,
        cost,
        createdAt: new Date()
      };
      
      this.stations.push(station);
      this.money -= cost;
      this.calculateRevenue();
      this.renderNetwork();
      this.updateUI();
      this.uiManager.showNotification('Station créée (non sauvegardée)', 'success');
      return;
    }
    
    // Mode connecté - création avec sauvegarde
    if (!this.network) {
      this.uiManager.showNotification('Erreur: réseau non chargé', 'error');
      return;
    }
    
    try {
      const station = await this.apiClient.createStation({
        networkId: this.network.id,
        name: `Station ${this.stations.length + 1}`,
        x,
        y,
        cost
      });
      
      this.stations.push(station);
      this.money -= cost;
      this.calculateRevenue();
      this.renderNetwork();
      this.updateUI();
      this.uiManager.showNotification(`Station créée ! (${cost.toLocaleString('fr-FR')} €)`, 'success');
    } catch (error) {
      console.error('Erreur lors de la création de la station:', error);
      this.uiManager.showNotification('Erreur lors de la création de la station', 'error');
    }
  }
  
  private async createLine(station1: any, station2: any) {
    const cost = this.calculateLineCost();
    
    // Vérifier si l'utilisateur a assez d'argent
    if (this.money < cost) {
      this.uiManager.showNotification('Pas assez d\'argent pour créer une ligne !', 'error');
      return;
    }
    
    // Vérifier si ces deux stations ne sont pas déjà connectées
    const alreadyConnected = this.lines.some(line => 
      line.stations && line.stations.some((ls: any) => 
        (ls.station.id === station1.id || ls.station.id === station2.id)
      )
    );
    
    // Générer une couleur aléatoire pour la ligne
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Mode invité - création locale uniquement
    if (this.uiManager.isGuestMode()) {
      const newLine = {
        id: `local-line-${Date.now()}`,
        networkId: 'guest',
        name: `Ligne ${this.lines.length + 1}`,
        color: randomColor,
        type: 'metro',
        createdAt: new Date(),
        stations: [
          { station: station1, order: 0 },
          { station: station2, order: 1 }
        ]
      };
      
      this.lines.push(newLine);
      this.money -= cost;
      this.calculateRevenue();
      this.renderNetwork();
      this.updateUI();
      this.uiManager.showNotification(`Ligne créée ! (${cost.toLocaleString('fr-FR')} €, non sauvegardée)`, 'success');
      return;
    }
    
    // Mode connecté - création avec sauvegarde
    if (!this.network) {
      this.uiManager.showNotification('Erreur: réseau non chargé', 'error');
      return;
    }
    
    try {
      // Créer la ligne
      const line = await this.apiClient.createLine({
        networkId: this.network.id,
        name: `Ligne ${this.lines.length + 1}`,
        color: randomColor,
        type: 'metro'
      });
      
      // Ajouter les stations à la ligne
      await this.apiClient.addStationToLine(line.id, station1.id);
      await this.apiClient.addStationToLine(line.id, station2.id);
      
      // Ajouter la ligne localement avec les stations
      line.stations = [
        { station: station1, order: 0 },
        { station: station2, order: 1 }
      ];
      
      this.lines.push(line);
      this.money -= cost;
      this.calculateRevenue();
      this.renderNetwork();
      this.updateUI();
      this.uiManager.showNotification(`Ligne créée ! (${cost.toLocaleString('fr-FR')} €)`, 'success');
    } catch (error) {
      console.error('Erreur lors de la création de la ligne:', error);
      this.uiManager.showNotification('Erreur lors de la création de la ligne', 'error');
    }
  }
  
  private calculateRevenue() {
    // Une station ne génère des revenus QUE si elle est reliée à au moins une ligne
    let totalRevenue = 0;
    
    for (const station of this.stations) {
      // Vérifier si la station est connectée à au moins une ligne
      const isConnected = this.lines.some(line => 
        line.stations && line.stations.some((ls: any) => 
          ls.station && ls.station.id === station.id
        )
      );
      
      if (isConnected) {
        // Station connectée : génère des revenus
        totalRevenue += station.revenue || 100;
      }
      // Sinon : pas de revenus (station isolée)
    }
    
    this.revenue = totalRevenue;
  }
  
  private updateRevenue() {
    if (this.revenue > 0) {
      this.money += this.revenue;
      
      // Sauvegarder l'argent sur le serveur toutes les 10 secondes (seulement si connecté)
      if (!this.uiManager.isGuestMode() && this.network && Math.random() < 0.1) {
        this.apiClient.updateNetworkMoney(this.network.id, this.money);
      }
      
      this.updateUI();
    }
  }
  
  private renderNetwork() {
    // Effacer les graphiques précédents
    this.stationGraphics.clear();
    this.lineGraphics.clear();
    
    // Dessiner les lignes
    this.lines.forEach(line => {
      if (line.stations && line.stations.length > 1) {
        this.lineGraphics.lineStyle(4, parseInt(line.color.replace('#', '0x')));
        this.lineGraphics.beginPath();
        
        line.stations.forEach((ls: any, index: number) => {
          const station = ls.station;
          if (index === 0) {
            this.lineGraphics.moveTo(station.x, station.y);
          } else {
            this.lineGraphics.lineTo(station.x, station.y);
          }
        });
        
        this.lineGraphics.strokePath();
      }
    });
    
    // Dessiner les stations
    this.stations.forEach(station => {
      this.stationGraphics.fillStyle(0x16c784);
      this.stationGraphics.fillCircle(station.x, station.y, 10);
      this.stationGraphics.lineStyle(2, 0xffffff);
      this.stationGraphics.strokeCircle(station.x, station.y, 10);
    });
  }
  
  private updateUI() {
    this.uiManager.updateMoney(this.money);
    this.uiManager.updateRevenue(this.revenue);
    this.uiManager.updateStations(this.stations.length);
    this.uiManager.updateLines(this.lines.length);
    
    // Mettre à jour les coûts affichés
    this.costDisplay.updateStationCost(this.calculateStationCost());
    this.costDisplay.updateLineCost(this.calculateLineCost());
  }
}

