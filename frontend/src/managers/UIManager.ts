import { Notification } from '../components/UIComponents';

export class UIManager {
  private moneyElement: HTMLElement | null;
  private revenueElement: HTMLElement | null;
  private stationsElement: HTMLElement | null;
  private linesElement: HTMLElement | null;
  private guestMode: boolean = false;
  
  constructor() {
    this.moneyElement = document.getElementById('money');
    this.revenueElement = document.getElementById('revenue');
    this.stationsElement = document.getElementById('stations');
    this.linesElement = document.getElementById('lines');
  }
  
  updateMoney(money: number) {
    if (this.moneyElement) {
      this.moneyElement.textContent = `${Math.floor(money).toLocaleString('fr-FR')} €`;
    }
  }
  
  updateRevenue(revenue: number) {
    if (this.revenueElement) {
      // Le ~ indique que c'est une estimation basée sur les passages de trains
      const displayValue = revenue > 0 ? `~${revenue.toLocaleString('fr-FR')}` : '0';
      this.revenueElement.textContent = `${displayValue} €/s`;
    }
  }
  
  updateStations(count: number) {
    if (this.stationsElement) {
      this.stationsElement.textContent = count.toString();
    }
  }
  
  updateLines(count: number) {
    if (this.linesElement) {
      this.linesElement.textContent = count.toString();
    }
    
    // Mettre à jour le compteur dans le panneau des lignes
    const linesCount = document.getElementById('lines-count');
    if (linesCount) {
      linesCount.textContent = count.toString();
    }
  }
  
  updateLinesList(lines: any[]) {
    const linesList = document.getElementById('lines-list');
    const noLinesMessage = document.getElementById('no-lines-message');
    
    if (!linesList) return;
    
    // Afficher ou masquer le message "Aucune ligne"
    if (noLinesMessage) {
      noLinesMessage.style.display = lines.length === 0 ? 'block' : 'none';
    }
    
    // Nettoyer la liste existante (sauf le message)
    const existingLines = linesList.querySelectorAll('.line-item');
    existingLines.forEach(item => item.remove());
    
    // Ajouter chaque ligne
    lines.forEach(line => {
      if (!line.stations || line.stations.length < 2) return;
      
      const lineItem = document.createElement('div');
      lineItem.className = 'line-item p-2.5 rounded-lg transition-all hover:scale-102';
      lineItem.style.cssText = `
        background-color: var(--bg-tertiary);
        border-left: 4px solid ${line.color};
      `;
      
      // Nom de la ligne
      const lineName = document.createElement('div');
      lineName.className = 'flex items-center justify-between mb-1.5';
      lineName.innerHTML = `
        <span class="font-semibold text-sm" style="color: var(--text-primary);">${line.name}</span>
        <span class="text-xs px-1.5 py-0.5 rounded" style="background-color: ${line.color}20; color: ${line.color};">${line.stations.length} stations</span>
      `;
      
      // Liste des stations
      const stationsList = document.createElement('div');
      stationsList.className = 'flex flex-wrap gap-1 mt-1.5';
      line.stations.forEach((ls: any, index: number) => {
        const stationBadge = document.createElement('span');
        stationBadge.className = 'text-xs px-1.5 py-0.5 rounded';
        stationBadge.style.cssText = 'background-color: var(--bg-primary); color: var(--text-tertiary);';
        stationBadge.textContent = ls.station.name;
        stationsList.appendChild(stationBadge);
        
        // Ajouter une flèche entre les stations
        if (index < line.stations.length - 1) {
          const arrow = document.createElement('span');
          arrow.className = 'text-xs';
          arrow.style.color = 'var(--text-tertiary)';
          arrow.textContent = '→';
          stationsList.appendChild(arrow);
        }
      });
      
      lineItem.appendChild(lineName);
      lineItem.appendChild(stationsList);
      linesList.appendChild(lineItem);
    });
  }
  
  setUser(user: any) {
    this.guestMode = false;
    
    // Afficher la section utilisateur dans le dashboard
    const userSection = document.getElementById('user-section');
    const guestSection = document.getElementById('guest-section');
    const userAvatar = document.getElementById('user-avatar') as HTMLImageElement;
    const userName = document.getElementById('user-name');
    
    if (userSection) {
      userSection.classList.remove('hidden');
    }
    if (guestSection) {
      guestSection.classList.add('hidden');
    }
    if (userAvatar && user.avatar) {
      userAvatar.src = user.avatar;
    }
    if (userName) {
      userName.textContent = user.username;
    }
  }
  
  setGuestMode(isGuest: boolean) {
    this.guestMode = isGuest;
    
    if (isGuest) {
      // Afficher la section invité dans le dashboard
      const userSection = document.getElementById('user-section');
      const guestSection = document.getElementById('guest-section');
      
      if (userSection) {
        userSection.classList.add('hidden');
      }
      if (guestSection) {
        guestSection.classList.remove('hidden');
      }
    }
  }
  
  isGuestMode(): boolean {
    return this.guestMode;
  }
  
  setupAuthButtons(
    onDiscordLogin: () => void,
    onGithubLogin: () => void,
    onLogout: () => void
  ) {
    // Configurer le bouton de déconnexion dans le dashboard
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', onLogout);
    }
  }
  
  showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    Notification.show(message, type);
  }
}

