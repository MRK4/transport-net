import Phaser from 'phaser';
import { APIClient } from '../services/APIClient';
import { UIManager } from '../managers/UIManager';
import { CostDisplay } from '../components/CostDisplay';
import { TrainManager } from '../managers/TrainManager';

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
  private trainGraphics!: Phaser.GameObjects.Graphics;
  private gameTitle!: Phaser.GameObjects.Text;
  
  // Gestionnaire de trains
  private trainManager!: TrainManager;
  private revenuePerArrival: number = 0; // Revenu par arrivée de train
  
  // Création de ligne
  private lineCreationMode: 'selecting_first' | 'selecting_second' | 'none' = 'none';
  private selectedStationForLine: any = null;
  private temporaryLineGraphics!: Phaser.GameObjects.Graphics;
  
  constructor() {
    super({ key: 'GameScene' });
  }
  
  update(time: number, delta: number): void {
    // Mettre à jour les trains et gérer les arrivées en station
    this.trainManager.update(delta, (train, station) => {
      this.handleTrainArrival(train, station);
    });
    
    // Redessiner les trains
    this.trainManager.draw(this.trainGraphics);
  }
  
  private handleTrainArrival(train: any, station: any): void {
    // Calculer le revenu généré par ce passage
    const revenue = this.calculateRevenueForArrival(train.line, station);
    
    if (revenue > 0) {
      this.money += revenue;
      this.updateUI();
      
      // Afficher un petit indicateur de revenus (optionnel)
      this.showRevenueIndicator(station.x, station.y, revenue);
    }
  }
  
  private calculateRevenueForArrival(line: any, station: any): number {
    // Revenu de base par arrivée
    let revenue = 50; // 50€ par arrivée de base
    
    // Bonus selon le nombre de stations sur la ligne
    const stationCount = line.stations ? line.stations.length : 0;
    revenue += stationCount * 10; // +10€ par station sur la ligne
    
    // Bonus si la station est une correspondance
    const connectionCount = this.lines.filter(l =>
      l.stations && l.stations.some((ls: any) => ls.station.id === station.id)
    ).length;
    
    if (connectionCount >= 2) {
      revenue *= (1 + (connectionCount - 1) * 0.25); // +25% par ligne supplémentaire
    }
    
    return Math.round(revenue);
  }
  
  private showRevenueIndicator(x: number, y: number, revenue: number): void {
    // Créer un texte flottant qui indique le revenu
    const text = this.add.text(x, y - 20, `+${revenue}€`, {
      fontSize: '14px',
      color: '#16c784',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    });
    
    // Animation de montée et disparition
    this.tweens.add({
      targets: text,
      y: y - 50,
      alpha: 0,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        text.destroy();
      }
    });
  }
  
  init() {
    this.apiClient = this.registry.get('apiClient');
    this.uiManager = this.registry.get('uiManager');
    this.costDisplay = new CostDisplay();
    this.trainManager = new TrainManager();
  }
  
  create() {
    // Créer les graphiques (ordre important pour le z-index)
    this.lineGraphics = this.add.graphics();
    this.stationGraphics = this.add.graphics();
    this.trainGraphics = this.add.graphics();
    this.temporaryLineGraphics = this.add.graphics();
    
    // Gérer les clics sur la carte
    this.input.on('pointerdown', this.handleMapClick, this);
    
    // Connecter les boutons de l'UI
    this.setupUIButtons();
    
    // Charger le réseau de l'utilisateur
    this.loadNetwork();
    
    // Afficher un message de bienvenue
    this.addText();
    
    // Écouter les changements de thème
    this.setupThemeListener();
    
    // Initialiser l'affichage des coûts
    this.updateUI();
    
    // Sauvegarder périodiquement (toutes les 30 secondes)
    this.time.addEvent({
      delay: 30000,
      callback: this.saveProgress,
      callbackScope: this,
      loop: true
    });
  }
  
  private saveProgress() {
    if (!this.uiManager.isGuestMode() && this.network) {
      this.apiClient.updateNetworkMoney(this.network.id, this.money)
        .catch(err => console.error('Erreur de sauvegarde:', err));
    }
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
      if (this.stations.length === 0 && this.lines.length === 0) {
        this.uiManager.showNotification('Rien à supprimer', 'info');
      } else {
        this.uiManager.showNotification('Cliquez sur une station ou ligne à supprimer', 'info');
      }
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
        
        // Créer les trains pour les lignes existantes
        this.trainManager.createTrainsForLines(this.lines);
        
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
    } else if (this.currentTool === 'delete') {
      this.handleDeleteClick(pointer.x, pointer.y);
    }
  }
  
  private handleDeleteClick(x: number, y: number) {
    // D'abord essayer de trouver une station
    const clickedStation = this.findStationAtPosition(x, y, 30);
    
    if (clickedStation) {
      this.deleteStation(clickedStation);
      return;
    }
    
    // Sinon, essayer de trouver une ligne
    const clickedLine = this.findLineAtPosition(x, y, 15);
    
    if (clickedLine) {
      this.deleteLine(clickedLine);
      return;
    }
    
    this.uiManager.showNotification('Cliquez sur une station ou une ligne à supprimer', 'info');
  }
  
  private findLineAtPosition(x: number, y: number, radius: number): any {
    for (const line of this.lines) {
      if (line.stations && line.stations.length >= 2) {
        // Vérifier chaque segment de la ligne
        for (let i = 0; i < line.stations.length - 1; i++) {
          const station1 = line.stations[i].station;
          const station2 = line.stations[i + 1].station;
          
          // Calculer la distance du point au segment de ligne
          const distance = this.distanceToLineSegment(
            x, y,
            station1.x, station1.y,
            station2.x, station2.y
          );
          
          if (distance <= radius) {
            return line;
          }
        }
      }
    }
    return null;
  }
  
  private distanceToLineSegment(
    px: number, py: number,
    x1: number, y1: number,
    x2: number, y2: number
  ): number {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) {
      param = dot / lenSq;
    }
    
    let xx, yy;
    
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    const dx = px - xx;
    const dy = py - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  private handleLineCreationClick(x: number, y: number) {
    // Trouver la station la plus proche du clic
    const clickedStation = this.findStationAtPosition(x, y, 30); // Rayon de 30px pour faciliter le clic
    
    if (!clickedStation) {
      this.uiManager.showNotification('Cliquez sur une station existante', 'warning');
      return;
    }
    
    if (this.lineCreationMode === 'selecting_first' || this.lineCreationMode === 'none') {
      // Première station sélectionnée
      this.selectedStationForLine = clickedStation;
      this.lineCreationMode = 'selecting_second';
      this.highlightStation(clickedStation);
      this.uiManager.showNotification(`"${clickedStation.name}" sélectionnée → Cliquez sur la 2ème station`, 'success');
    } else if (this.lineCreationMode === 'selecting_second') {
      // Deuxième station sélectionnée
      if (clickedStation.id === this.selectedStationForLine.id) {
        this.uiManager.showNotification('Sélectionnez une station différente', 'warning');
        return;
      }
      
      // Créer la ligne entre les deux stations
      this.createLine(this.selectedStationForLine, clickedStation);
      
      // Réinitialiser
      this.lineCreationMode = 'selecting_first';
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
    // Utiliser renderNetwork qui gère maintenant le surlignage
    this.renderNetwork();
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
  
  private async deleteStation(station: any) {
    // Vérifier si la station est connectée à des lignes
    const connectedLines = this.lines.filter(line =>
      line.stations && line.stations.some((ls: any) => ls.station.id === station.id)
    );
    
    if (connectedLines.length > 0) {
      this.uiManager.showNotification(
        `Supprimez d'abord les ${connectedLines.length} ligne(s) connectée(s)`,
        'warning'
      );
      return;
    }
    
    // Calculer le remboursement (10% du coût de construction)
    const stationIndex = this.stations.findIndex(s => s.id === station.id);
    const cost = station.cost || 1000;
    const refund = Math.round(cost * 0.10);
    
    // Mode invité - suppression locale
    if (this.uiManager.isGuestMode()) {
      if (stationIndex !== -1) {
        this.stations.splice(stationIndex, 1);
        this.money += refund;
        this.calculateRevenue();
        this.renderNetwork();
        this.updateUI();
        this.uiManager.showNotification(`Station supprimée (+${refund.toLocaleString('fr-FR')} €)`, 'success');
      }
      return;
    }
    
    // Mode connecté - suppression avec backend
    try {
      await this.apiClient.deleteStation(station.id);
      
      if (stationIndex !== -1) {
        this.stations.splice(stationIndex, 1);
      }
      
      this.money += refund;
      this.calculateRevenue();
      this.renderNetwork();
      this.updateUI();
      this.uiManager.showNotification(`Station supprimée (+${refund.toLocaleString('fr-FR')} €)`, 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression de la station:', error);
      this.uiManager.showNotification('Erreur lors de la suppression', 'error');
    }
  }
  
  private async deleteLine(line: any) {
    // Calculer le remboursement (10% du coût de construction)
    const lineIndex = this.lines.findIndex(l => l.id === line.id);
    // Estimer le coût basé sur l'index (avec formule progressive)
    const estimatedCost = Math.round(500 * Math.pow(1.10, lineIndex));
    const refund = Math.round(estimatedCost * 0.10);
    
    // Mode invité - suppression locale
    if (this.uiManager.isGuestMode()) {
      if (lineIndex !== -1) {
        this.lines.splice(lineIndex, 1);
        this.money += refund;
        
        // Recréer les trains pour les lignes restantes
        this.trainManager.createTrainsForLines(this.lines);
        
        this.calculateRevenue();
        this.renderNetwork();
        this.updateUI();
        this.uiManager.showNotification(`Ligne supprimée (+${refund.toLocaleString('fr-FR')} €)`, 'success');
      }
      return;
    }
    
    // Mode connecté - suppression avec backend
    try {
      await this.apiClient.deleteLine(line.id);
      
      if (lineIndex !== -1) {
        this.lines.splice(lineIndex, 1);
      }
      
      this.money += refund;
      
      // Recréer les trains pour les lignes restantes
      this.trainManager.createTrainsForLines(this.lines);
      
      this.calculateRevenue();
      this.renderNetwork();
      this.updateUI();
      this.uiManager.showNotification(`Ligne supprimée (+${refund.toLocaleString('fr-FR')} €)`, 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression de la ligne:', error);
      this.uiManager.showNotification('Erreur lors de la suppression', 'error');
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
      
      // Créer les trains pour les lignes
      this.trainManager.createTrainsForLines(this.lines);
      
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
      
      // Créer les trains pour toutes les lignes
      this.trainManager.createTrainsForLines(this.lines);
      
      this.updateUI();
      this.uiManager.showNotification(`Ligne créée ! (${cost.toLocaleString('fr-FR')} €)`, 'success');
    } catch (error) {
      console.error('Erreur lors de la création de la ligne:', error);
      this.uiManager.showNotification('Erreur lors de la création de la ligne', 'error');
    }
  }
  
  private calculateRevenue() {
    // Calculer le revenu moyen par arrivée de train
    let totalRevenuePerArrival = 0;
    let trainCount = 0;
    
    for (const line of this.lines) {
      if (line.stations && line.stations.length >= 2) {
        trainCount++;
        
        // Calculer le revenu moyen pour cette ligne
        const stationCount = line.stations.length;
        let lineRevenue = 50 + (stationCount * 10); // Base + bonus stations
        
        // Vérifier les correspondances pour chaque station
        line.stations.forEach((ls: any) => {
          const station = ls.station;
          const connectionCount = this.lines.filter(l =>
            l.stations && l.stations.some((s: any) => s.station.id === station.id)
          ).length;
          
          if (connectionCount >= 2) {
            lineRevenue *= (1 + (connectionCount - 1) * 0.25);
          }
        });
        
        totalRevenuePerArrival += lineRevenue;
      }
    }
    
    // Le "revenu/s" affiché est une estimation basée sur la fréquence des trains
    // En supposant qu'un train arrive toutes les 5 secondes en moyenne
    this.revenuePerArrival = totalRevenuePerArrival / Math.max(trainCount, 1);
    this.revenue = Math.round((totalRevenuePerArrival / 5) * trainCount); // Estimation /s
  }
  
  private renderNetwork() {
    // Effacer les graphiques précédents
    this.stationGraphics.clear();
    this.lineGraphics.clear();
    
    // Dessiner les lignes
    this.lines.forEach(line => {
      if (line.stations && line.stations.length > 1) {
        // Ligne plus épaisse en mode suppression pour faciliter le clic
        const lineWidth = this.currentTool === 'delete' ? 10 : 6;
        this.lineGraphics.lineStyle(lineWidth, parseInt(line.color.replace('#', '0x')), 0.8);
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
      // Vérifier si c'est la station sélectionnée
      const isSelected = this.selectedStationForLine && station.id === this.selectedStationForLine.id;
      
      // Vérifier si la station est connectée à des lignes
      const isConnected = this.lines.some(line =>
        line.stations && line.stations.some((ls: any) => ls.station.id === station.id)
      );
      
      if (isSelected) {
        // Station sélectionnée - surlignée en or avec glow
        this.stationGraphics.fillStyle(0xffd700, 1);
        this.stationGraphics.fillCircle(station.x, station.y, 16);
        this.stationGraphics.lineStyle(4, 0xffffff, 1);
        this.stationGraphics.strokeCircle(station.x, station.y, 16);
        
        // Effet de glow
        this.stationGraphics.lineStyle(2, 0xffd700, 0.5);
        this.stationGraphics.strokeCircle(station.x, station.y, 20);
      } else if (this.currentTool === 'delete' && isConnected) {
        // Station connectée en mode suppression - rouge
        this.stationGraphics.fillStyle(0xea3943, 1);
        this.stationGraphics.fillCircle(station.x, station.y, 12);
        this.stationGraphics.lineStyle(3, 0xffffff, 1);
        this.stationGraphics.strokeCircle(station.x, station.y, 12);
      } else {
        // Station normale - vert si connectée, gris si isolée
        const color = isConnected ? 0x16c784 : 0x94a3b8;
        this.stationGraphics.fillStyle(color, 1);
        this.stationGraphics.fillCircle(station.x, station.y, 12);
        this.stationGraphics.lineStyle(3, 0xffffff, 1);
        this.stationGraphics.strokeCircle(station.x, station.y, 12);
      }
      
      // Ajouter un cercle de détection visuel en mode ligne (debug)
      if (this.currentTool === 'line' && this.lineCreationMode !== 'none') {
        this.stationGraphics.lineStyle(1, 0xff00ff, 0.3);
        this.stationGraphics.strokeCircle(station.x, station.y, 30);
      }
      
      // Cercle de détection en mode suppression
      if (this.currentTool === 'delete') {
        const deleteColor = isConnected ? 0xff0000 : 0x00ff00;
        this.stationGraphics.lineStyle(1, deleteColor, 0.3);
        this.stationGraphics.strokeCircle(station.x, station.y, 30);
      }
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

