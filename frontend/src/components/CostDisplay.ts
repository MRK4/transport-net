/**
 * Affichage dynamique des coûts de construction
 */

export class CostDisplay {
  private stationCostElement: HTMLElement | null = null;
  private lineCostElement: HTMLElement | null = null;
  
  constructor() {
    this.createCostDisplays();
  }
  
  private createCostDisplays() {
    // Trouver les boutons et ajouter l'affichage des coûts
    const stationBtn = document.getElementById('tool-station');
    const lineBtn = document.getElementById('tool-line');
    
    if (stationBtn) {
      this.stationCostElement = document.createElement('span');
      this.stationCostElement.className = 'text-xs opacity-75 ml-1';
      this.stationCostElement.id = 'station-cost';
      stationBtn.appendChild(this.stationCostElement);
    }
    
    if (lineBtn) {
      this.lineCostElement = document.createElement('span');
      this.lineCostElement.className = 'text-xs opacity-75 ml-1';
      this.lineCostElement.id = 'line-cost';
      lineBtn.appendChild(this.lineCostElement);
    }
  }
  
  updateStationCost(cost: number) {
    if (this.stationCostElement) {
      this.stationCostElement.textContent = `(${cost.toLocaleString('fr-FR')} €)`;
    }
  }
  
  updateLineCost(cost: number) {
    if (this.lineCostElement) {
      this.lineCostElement.textContent = `(${cost.toLocaleString('fr-FR')} €)`;
    }
  }
}

