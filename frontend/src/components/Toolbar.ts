import { ToolButton } from './UIComponents';

export type ToolType = 'station' | 'line' | 'delete' | 'none';

export class Toolbar {
  private container: HTMLElement;
  private buttons: Map<ToolType, ToolButton> = new Map();
  private currentTool: ToolType = 'none';
  private onToolChangeCallback?: (tool: ToolType) => void;
  
  constructor(containerId: string) {
    const element = document.getElementById(containerId);
    if (!element) {
      throw new Error(`Element with id ${containerId} not found`);
    }
    this.container = element;
  }
  
  setupTools(onToolChange: (tool: ToolType) => void): void {
    this.onToolChangeCallback = onToolChange;
    
    // Utiliser les boutons existants dans le HTML
    const stationBtn = document.getElementById('tool-station') as HTMLButtonElement;
    const lineBtn = document.getElementById('tool-line') as HTMLButtonElement;
    const deleteBtn = document.getElementById('tool-delete') as HTMLButtonElement;
    
    if (stationBtn) {
      stationBtn.addEventListener('click', () => this.selectTool('station'));
    }
    
    if (lineBtn) {
      lineBtn.addEventListener('click', () => this.selectTool('line'));
    }
    
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => this.selectTool('delete'));
    }
  }
  
  selectTool(tool: ToolType): void {
    this.currentTool = tool;
    this.updateButtonStates();
    
    if (this.onToolChangeCallback) {
      this.onToolChangeCallback(tool);
    }
  }
  
  getCurrentTool(): ToolType {
    return this.currentTool;
  }
  
  private updateButtonStates(): void {
    // Mettre à jour les classes des boutons
    const buttons = document.querySelectorAll('.tool-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (this.currentTool !== 'none') {
      const activeBtn = document.getElementById(`tool-${this.currentTool}`);
      if (activeBtn) {
        activeBtn.classList.add('active');
      }
    }
  }
}

