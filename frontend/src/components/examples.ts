/**
 * Exemples d'utilisation des composants UI
 * Ce fichier contient des exemples pour vous aider à utiliser les composants
 */

import { Card, Button, StatItem, Modal, Notification, ToolButton } from './UIComponents';

// ========================================
// EXEMPLE 1 : Créer une carte
// ========================================
export function createExampleCard() {
  const card = new Card('min-w-[300px]');
  
  // Ajouter un en-tête
  card.addHeader('<h2 class="text-xl font-bold text-success">Ma Carte</h2>');
  
  // Ajouter un corps
  const body = card.addBody('');
  body.innerHTML = `
    <p class="text-gray-300">Contenu de la carte</p>
    <p class="text-gray-400 text-sm mt-2">Description détaillée</p>
  `;
  
  // Ajouter un pied de page (optionnel)
  card.addFooter('<button class="btn btn-primary">Action</button>');
  
  // Ajouter au DOM
  document.body.appendChild(card.element);
  
  return card;
}

// ========================================
// EXEMPLE 2 : Créer des boutons
// ========================================
export function createExampleButtons() {
  const container = document.createElement('div');
  container.className = 'flex gap-2 p-4';
  
  // Bouton primaire
  const btnPrimary = new Button('Primaire', 'primary', '🚀');
  btnPrimary.onClick(() => {
    Notification.show('Bouton primaire cliqué !', 'info');
  });
  
  // Bouton de succès
  const btnSuccess = new Button('Succès', 'success', '✅');
  btnSuccess.onClick(() => {
    Notification.show('Action réussie !', 'success');
  });
  
  // Bouton de danger
  const btnDanger = new Button('Danger', 'danger', '⚠️');
  btnDanger.onClick(() => {
    Notification.show('Attention !', 'warning');
  });
  
  // Bouton secondaire
  const btnSecondary = new Button('Secondaire', 'secondary');
  btnSecondary.onClick(() => {
    console.log('Secondaire cliqué');
  });
  
  // Ajouter au conteneur
  container.appendChild(btnPrimary.element);
  container.appendChild(btnSuccess.element);
  container.appendChild(btnDanger.element);
  container.appendChild(btnSecondary.element);
  
  return container;
}

// ========================================
// EXEMPLE 3 : Créer des statistiques
// ========================================
export function createExampleStats() {
  const container = document.createElement('div');
  container.className = 'card glass-effect p-4 space-y-2';
  
  // Statistique d'argent
  const moneyStat = new StatItem('Argent', '10 000 €', '💰');
  
  // Statistique de revenu
  const revenueStat = new StatItem('Revenu/s', '500 €/s', '📈');
  revenueStat.setColor('primary');
  
  // Statistique de stations
  const stationsStat = new StatItem('Stations', '15', '🚉');
  stationsStat.setColor('warning');
  
  // Ajouter au conteneur
  container.appendChild(moneyStat.element);
  container.appendChild(revenueStat.element);
  container.appendChild(stationsStat.element);
  
  // Mettre à jour dynamiquement
  setInterval(() => {
    const currentMoney = parseInt(moneyStat.valueElement.textContent?.replace(/[^\d]/g, '') || '0');
    moneyStat.setValue(`${(currentMoney + 500).toLocaleString('fr-FR')} €`);
  }, 1000);
  
  return container;
}

// ========================================
// EXEMPLE 4 : Créer une modale
// ========================================
export function createExampleModal() {
  const modal = new Modal();
  
  // Contenu de la modale
  const content = document.createElement('div');
  content.innerHTML = `
    <div class="card-header">
      <h2 class="text-xl font-bold text-gray-200">Titre de la modale</h2>
    </div>
    <div class="card-body">
      <p class="text-gray-300 mb-4">
        Ceci est le contenu de la modale. Vous pouvez y mettre n'importe quel contenu HTML.
      </p>
      <div class="flex gap-2">
        <button class="btn btn-primary" id="modal-confirm">Confirmer</button>
        <button class="btn btn-secondary" id="modal-cancel">Annuler</button>
      </div>
    </div>
  `;
  
  modal.setContent(content);
  
  // Gérer les boutons
  content.querySelector('#modal-confirm')?.addEventListener('click', () => {
    Notification.show('Action confirmée !', 'success');
    modal.hide();
  });
  
  content.querySelector('#modal-cancel')?.addEventListener('click', () => {
    modal.hide();
  });
  
  return modal;
}

// ========================================
// EXEMPLE 5 : Afficher des notifications
// ========================================
export function showExampleNotifications() {
  // Notification de succès
  setTimeout(() => {
    Notification.show('Opération réussie !', 'success');
  }, 500);
  
  // Notification d'erreur
  setTimeout(() => {
    Notification.show('Une erreur est survenue', 'error');
  }, 1500);
  
  // Notification d'avertissement
  setTimeout(() => {
    Notification.show('Attention à cette action', 'warning');
  }, 2500);
  
  // Notification d'information
  setTimeout(() => {
    Notification.show('Information importante', 'info');
  }, 3500);
}

// ========================================
// EXEMPLE 6 : Créer des boutons d'outils
// ========================================
export function createExampleToolButtons() {
  const toolbar = document.createElement('div');
  toolbar.className = 'card glass-effect p-4 flex gap-3';
  
  const tools: Array<{ label: string; icon: string; id: string }> = [
    { label: 'Station', icon: '🚉', id: 'tool-station' },
    { label: 'Ligne', icon: '📍', id: 'tool-line' },
    { label: 'Éditer', icon: '✏️', id: 'tool-edit' },
    { label: 'Supprimer', icon: '🗑️', id: 'tool-delete' }
  ];
  
  const buttons: ToolButton[] = [];
  
  tools.forEach(tool => {
    const btn = new ToolButton(tool.label, tool.icon, tool.id);
    
    btn.onClick(() => {
      // Désactiver tous les autres boutons
      buttons.forEach(b => b.setActive(false));
      // Activer celui-ci
      btn.setActive(true);
      
      Notification.show(`Outil "${tool.label}" sélectionné`, 'info', 1500);
    });
    
    buttons.push(btn);
    toolbar.appendChild(btn.element);
  });
  
  return toolbar;
}

// ========================================
// EXEMPLE 7 : Créer un tableau de bord complet
// ========================================
export function createExampleDashboard() {
  const dashboard = document.createElement('div');
  dashboard.className = 'fixed top-5 right-5 card glass-effect min-w-[280px]';
  
  dashboard.innerHTML = `
    <div class="card-header">
      <h2 class="text-xl font-bold text-success flex items-center gap-2">
        <span>📊</span>
        <span>Tableau de bord</span>
      </h2>
    </div>
    <div class="card-body space-y-1" id="dashboard-stats">
    </div>
    <div class="card-footer">
      <button class="btn btn-primary w-full">Sauvegarder</button>
    </div>
  `;
  
  // Ajouter des statistiques
  const statsContainer = dashboard.querySelector('#dashboard-stats');
  if (statsContainer) {
    const stats = [
      new StatItem('Argent', '25 000 €', '💰'),
      new StatItem('Revenu/s', '1 250 €/s', '📈'),
      new StatItem('Stations', '12', '🚉'),
      new StatItem('Lignes', '3', '🚆'),
      new StatItem('Passagers', '5 432', '👥')
    ];
    
    stats[1].setColor('primary');
    stats[2].setColor('warning');
    stats[3].setColor('warning');
    stats[4].setColor('success');
    
    stats.forEach(stat => {
      statsContainer.appendChild(stat.element);
    });
  }
  
  return dashboard;
}

// ========================================
// EXEMPLE D'UTILISATION
// ========================================
export function runExamples() {
  // Pour tester les exemples, appelez cette fonction depuis votre code
  // Par exemple dans GameScene.ts après create()
  
  console.log('🎨 Exemples de composants UI disponibles :');
  console.log('- createExampleCard()');
  console.log('- createExampleButtons()');
  console.log('- createExampleStats()');
  console.log('- createExampleModal()');
  console.log('- showExampleNotifications()');
  console.log('- createExampleToolButtons()');
  console.log('- createExampleDashboard()');
  
  // Décommenter pour tester :
  // document.body.appendChild(createExampleDashboard());
  // showExampleNotifications();
}

