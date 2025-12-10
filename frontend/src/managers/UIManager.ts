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

