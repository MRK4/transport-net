/**
 * Classe représentant un train se déplaçant sur une ligne
 */

export interface TrainConfig {
  id: string;
  line: any;
  speed: number; // Pixels par seconde
  color: number;
}

export class Train {
  public id: string;
  public line: any;
  public speed: number;
  public color: number;
  public currentStationIndex: number = 0;
  public progress: number = 0; // Progression entre deux stations (0 à 1)
  public x: number = 0;
  public y: number = 0;
  public isMoving: boolean = true;
  
  constructor(config: TrainConfig) {
    this.id = config.id;
    this.line = config.line;
    this.speed = config.speed;
    this.color = config.color;
    
    // Positionner le train à la première station
    if (this.line.stations && this.line.stations.length > 0) {
      const firstStation = this.line.stations[0].station;
      this.x = firstStation.x;
      this.y = firstStation.y;
    }
  }
  
  update(delta: number): { arrivedAtStation: boolean; station?: any } {
    if (!this.isMoving || !this.line.stations || this.line.stations.length < 2) {
      return { arrivedAtStation: false };
    }
    
    const stations = this.line.stations;
    const currentStation = stations[this.currentStationIndex].station;
    const nextStationIndex = (this.currentStationIndex + 1) % stations.length;
    const nextStation = stations[nextStationIndex].station;
    
    // Calculer la distance entre les stations (approximation pour la courbe)
    const distance = Phaser.Math.Distance.Between(
      currentStation.x, currentStation.y,
      nextStation.x, nextStation.y
    );
    
    // Calculer la progression (delta en ms, speed en px/s)
    const progressIncrement = (this.speed * delta / 1000) / distance;
    this.progress += progressIncrement;
    
    // Calculer le point de contrôle pour la courbe de Bézier
    const controlPoint = this.calculateCurveControlPoint(
      currentStation.x, currentStation.y,
      nextStation.x, nextStation.y,
      this.currentStationIndex + 1,
      stations.length
    );
    
    // Interpoler la position le long de la courbe de Bézier quadratique
    const t = this.progress;
    const oneMinusT = 1 - t;
    
    // Formule de Bézier quadratique: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
    this.x = oneMinusT * oneMinusT * currentStation.x +
             2 * oneMinusT * t * controlPoint.x +
             t * t * nextStation.x;
             
    this.y = oneMinusT * oneMinusT * currentStation.y +
             2 * oneMinusT * t * controlPoint.y +
             t * t * nextStation.y;
    
    // Vérifier si on est arrivé à la prochaine station
    if (this.progress >= 1) {
      this.progress = 0;
      this.currentStationIndex = nextStationIndex;
      this.x = nextStation.x;
      this.y = nextStation.y;
      
      return { arrivedAtStation: true, station: nextStation };
    }
    
    return { arrivedAtStation: false };
  }
  
  private calculateCurveControlPoint(
    x1: number, y1: number,
    x2: number, y2: number,
    segmentIndex: number,
    totalSegments: number
  ): { x: number, y: number } {
    // Point milieu entre les deux stations
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    // Vecteur directionnel
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Vecteur perpendiculaire (normal)
    const normalX = -dy / distance;
    const normalY = dx / distance;
    
    // Intensité de la courbure (plus faible = courbe plus douce)
    // On alterne la direction de la courbure pour donner un aspect sinueux
    const curvatureStrength = distance * 0.15; // 15% de la distance
    const direction = segmentIndex % 2 === 0 ? 1 : -1;
    
    // Point de contrôle décalé perpendiculairement
    const controlX = midX + normalX * curvatureStrength * direction;
    const controlY = midY + normalY * curvatureStrength * direction;
    
    return { x: controlX, y: controlY };
  }
  
  draw(graphics: Phaser.GameObjects.Graphics): void {
    // Dessiner le train comme un petit carré avec une ombre
    // Ombre
    graphics.fillStyle(0x000000, 0.3);
    graphics.fillRect(this.x - 3, this.y - 2, 8, 8);
    
    // Dessiner le train
    graphics.fillStyle(this.color, 1);
    graphics.fillRect(this.x - 4, this.y - 4, 8, 8);
    
    // Bordure blanche épaisse pour visibilité
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.strokeRect(this.x - 4, this.y - 4, 8, 8);
    
    // Point central pour plus de détail
    graphics.fillStyle(0xffffff, 0.8);
    graphics.fillCircle(this.x, this.y, 2);
  }
}

