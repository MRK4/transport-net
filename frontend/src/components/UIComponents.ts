/**
 * Composants UI réutilisables pour Transport-Net
 */

export class Card {
  element: HTMLDivElement;
  
  constructor(className: string = '') {
    this.element = document.createElement('div');
    this.element.className = `card glass-effect ${className}`;
  }
  
  addHeader(content: string | HTMLElement): void {
    const header = document.createElement('div');
    header.className = 'card-header';
    
    if (typeof content === 'string') {
      header.innerHTML = content;
    } else {
      header.appendChild(content);
    }
    
    this.element.appendChild(header);
  }
  
  addBody(content: string | HTMLElement): HTMLDivElement {
    const body = document.createElement('div');
    body.className = 'card-body';
    
    if (typeof content === 'string') {
      body.innerHTML = content;
    } else {
      body.appendChild(content);
    }
    
    this.element.appendChild(body);
    return body;
  }
  
  addFooter(content: string | HTMLElement): void {
    const footer = document.createElement('div');
    footer.className = 'card-footer';
    
    if (typeof content === 'string') {
      footer.innerHTML = content;
    } else {
      footer.appendChild(content);
    }
    
    this.element.appendChild(footer);
  }
}

export class Button {
  element: HTMLButtonElement;
  
  constructor(
    text: string,
    variant: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' = 'primary',
    icon?: string
  ) {
    this.element = document.createElement('button');
    this.element.className = `btn btn-${variant}`;
    
    if (icon) {
      const iconSpan = document.createElement('span');
      iconSpan.textContent = icon;
      iconSpan.className = 'text-xl';
      this.element.appendChild(iconSpan);
    }
    
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    this.element.appendChild(textSpan);
  }
  
  onClick(callback: () => void): void {
    this.element.addEventListener('click', callback);
  }
  
  setActive(active: boolean): void {
    if (active) {
      this.element.classList.add('active');
    } else {
      this.element.classList.remove('active');
    }
  }
  
  setDisabled(disabled: boolean): void {
    this.element.disabled = disabled;
    if (disabled) {
      this.element.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      this.element.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  }
}

export class StatItem {
  element: HTMLDivElement;
  labelElement: HTMLSpanElement;
  valueElement: HTMLSpanElement;
  
  constructor(label: string, value: string, icon?: string) {
    this.element = document.createElement('div');
    this.element.className = 'stat-item';
    
    this.labelElement = document.createElement('span');
    this.labelElement.className = 'stat-label';
    this.labelElement.textContent = icon ? `${icon} ${label}` : label;
    
    this.valueElement = document.createElement('span');
    this.valueElement.className = 'stat-value';
    this.valueElement.textContent = value;
    
    this.element.appendChild(this.labelElement);
    this.element.appendChild(this.valueElement);
  }
  
  setValue(value: string): void {
    this.valueElement.textContent = value;
  }
  
  setLabel(label: string): void {
    this.labelElement.textContent = label;
  }
  
  setColor(color: 'success' | 'primary' | 'warning' | 'danger'): void {
    this.valueElement.className = `stat-value text-${color}`;
  }
}

export class Modal {
  element: HTMLDivElement;
  contentElement: HTMLDivElement;
  
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'fixed inset-0 z-50 hidden items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto';
    
    this.contentElement = document.createElement('div');
    this.contentElement.className = 'card max-w-md w-full mx-4 transform transition-all';
    
    this.element.appendChild(this.contentElement);
    document.body.appendChild(this.element);
    
    // Fermer en cliquant à l'extérieur
    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) {
        this.hide();
      }
    });
  }
  
  setContent(content: string | HTMLElement): void {
    this.contentElement.innerHTML = '';
    
    if (typeof content === 'string') {
      this.contentElement.innerHTML = content;
    } else {
      this.contentElement.appendChild(content);
    }
  }
  
  show(): void {
    this.element.classList.remove('hidden');
    this.element.classList.add('flex');
  }
  
  hide(): void {
    this.element.classList.remove('flex');
    this.element.classList.add('hidden');
  }
}

export class Notification {
  static show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 3000): void {
    const notification = document.createElement('div');
    
    const colors = {
      success: 'border-l-4 border-success',
      error: 'border-l-4 border-danger',
      warning: 'border-l-4 border-warning',
      info: 'border-l-4 border-primary-500'
    };
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    // Utiliser className pour ajouter plusieurs classes en une fois
    notification.className = `fixed top-5 right-5 z-50 card p-4 min-w-[300px] transform transition-all pointer-events-auto ${colors[type]}`;
    notification.innerHTML = `
      <div class="flex items-start gap-3">
        <span class="text-2xl">${icons[type]}</span>
        <p class="text-gray-200 flex-1">${message}</p>
        <button class="text-gray-400 hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
}

export class ToolButton {
  element: HTMLButtonElement;
  
  constructor(label: string, icon: string, id?: string) {
    this.element = document.createElement('button');
    this.element.className = 'tool-btn flex items-center gap-2';
    if (id) this.element.id = id;
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'text-xl';
    iconSpan.textContent = icon;
    
    const labelSpan = document.createElement('span');
    labelSpan.textContent = label;
    
    this.element.appendChild(iconSpan);
    this.element.appendChild(labelSpan);
  }
  
  onClick(callback: () => void): void {
    this.element.addEventListener('click', callback);
  }
  
  setActive(active: boolean): void {
    if (active) {
      this.element.classList.add('active');
    } else {
      this.element.classList.remove('active');
    }
  }
}

