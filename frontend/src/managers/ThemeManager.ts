/**
 * Gestionnaire de thème clair/sombre
 */

export type Theme = 'light' | 'dark';

export class ThemeManager {
  private currentTheme: Theme;
  private themeToggleBtn: HTMLElement | null;
  private themeIcon: HTMLElement | null;
  
  constructor() {
    // Récupérer le thème sauvegardé ou utiliser le thème sombre par défaut
    const savedTheme = localStorage.getItem('theme') as Theme;
    this.currentTheme = savedTheme || 'dark';
    
    this.themeToggleBtn = document.getElementById('theme-toggle');
    this.themeIcon = document.getElementById('theme-icon');
    
    // Appliquer le thème initial
    this.applyTheme(this.currentTheme);
    
    // Configurer le bouton de toggle
    this.setupToggleButton();
  }
  
  private setupToggleButton(): void {
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }
  
  toggleTheme(): void {
    const newTheme: Theme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
  
  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.applyTheme(theme);
    localStorage.setItem('theme', theme);
  }
  
  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      if (this.themeIcon) {
        this.themeIcon.textContent = '☀️';
      }
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      if (this.themeIcon) {
        this.themeIcon.textContent = '🌙';
      }
    }
  }
  
  getCurrentTheme(): Theme {
    return this.currentTheme;
  }
}

