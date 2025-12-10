import { Card, StatItem } from './UIComponents';

export class Dashboard {
  private container: HTMLElement;
  private moneyStat: StatItem;
  private revenueStat: StatItem;
  private stationsStat: StatItem;
  private linesStat: StatItem;
  
  constructor(containerId: string) {
    const element = document.getElementById(containerId);
    if (!element) {
      throw new Error(`Element with id ${containerId} not found`);
    }
    this.container = element;
    
    // Créer les composants de statistiques
    this.moneyStat = new StatItem('Argent', '10 000 €', '💰');
    this.revenueStat = new StatItem('Revenu/s', '0 €/s', '📈');
    this.revenueStat.setColor('primary');
    
    this.stationsStat = new StatItem('Stations', '0', '🚉');
    this.stationsStat.setColor('warning');
    
    this.linesStat = new StatItem('Lignes', '0', '🚆');
    this.linesStat.setColor('warning');
  }
  
  updateMoney(money: number): void {
    this.moneyStat.setValue(`${Math.floor(money).toLocaleString('fr-FR')} €`);
  }
  
  updateRevenue(revenue: number): void {
    this.revenueStat.setValue(`${revenue.toLocaleString('fr-FR')} €/s`);
  }
  
  updateStations(count: number): void {
    this.stationsStat.setValue(count.toString());
  }
  
  updateLines(count: number): void {
    this.linesStat.setValue(count.toString());
  }
}

