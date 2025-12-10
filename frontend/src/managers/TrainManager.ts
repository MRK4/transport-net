/**
 * Gestionnaire des trains sur le réseau
 */

import { Train } from '../entities/Train';

export class TrainManager {
  private trains: Train[] = [];
  private nextTrainId: number = 1;
  
  // Créer des trains pour toutes les lignes
  createTrainsForLines(lines: any[]): void {
    this.trains = [];
    
    lines.forEach(line => {
      if (line.stations && line.stations.length >= 2) {
        // Créer 1 train par ligne par défaut
        const trainColor = parseInt(line.color.replace('#', '0x'));
        
        const train = new Train({
          id: `train-${this.nextTrainId++}`,
          line: line,
          speed: 100, // 100 pixels par seconde
          color: trainColor
        });
        
        this.trains.push(train);
      }
    });
  }
  
  update(delta: number, onStationArrival: (train: Train, station: any) => void): void {
    this.trains.forEach(train => {
      const result = train.update(delta);
      
      if (result.arrivedAtStation && result.station) {
        onStationArrival(train, result.station);
      }
    });
  }
  
  draw(graphics: Phaser.GameObjects.Graphics): void {
    graphics.clear();
    
    this.trains.forEach(train => {
      train.draw(graphics);
    });
  }
  
  getTrains(): Train[] {
    return this.trains;
  }
  
  clear(): void {
    this.trains = [];
  }
}

