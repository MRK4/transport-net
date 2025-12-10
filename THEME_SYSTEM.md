# 🎨 Système de thèmes - Transport-Net

## Vue d'ensemble

Transport-Net dispose d'un système de thèmes clair/sombre complet avec :
- ✅ Basculement facile entre thèmes
- ✅ Sauvegarde de la préférence dans localStorage
- ✅ Variables CSS personnalisées pour une cohérence parfaite
- ✅ Transitions fluides entre thèmes
- ✅ Adaptation du jeu Phaser au thème

## 🎯 Utilisation

### Pour l'utilisateur

Un **bouton de thème** est disponible en haut à gauche de l'écran :
- 🌙 = Thème sombre (par défaut)
- ☀️ = Thème clair

Cliquez simplement dessus pour basculer entre les thèmes !

## 🏗️ Architecture technique

### 1. ThemeManager (`frontend/src/managers/ThemeManager.ts`)

Gestionnaire principal du système de thèmes :

```typescript
import { ThemeManager } from './managers/ThemeManager';

const themeManager = new ThemeManager();

// Changer de thème
themeManager.toggleTheme();
themeManager.setTheme('light');
themeManager.setTheme('dark');

// Obtenir le thème actuel
const currentTheme = themeManager.getCurrentTheme(); // 'light' | 'dark'
```

### 2. Variables CSS

Les couleurs sont définies via des variables CSS personnalisées dans `main.css` :

```css
:root.dark {
  --bg-primary: #0f172a;      /* Fond principal */
  --bg-secondary: #1e293b;    /* Fond secondaire (cartes) */
  --bg-tertiary: #334155;     /* Fond tertiaire (boutons) */
  --text-primary: #f1f5f9;    /* Texte principal */
  --text-secondary: #cbd5e1;  /* Texte secondaire */
  --text-tertiary: #94a3b8;   /* Texte tertiaire */
  --border-color: #475569;    /* Bordures */
  --success: #16c784;         /* Vert (succès) */
  --danger: #ea3943;          /* Rouge (erreur) */
  --warning: #f6b93b;         /* Jaune (avertissement) */
  --primary: #0ea5e9;         /* Bleu (primaire) */
}

:root.light {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-tertiary: #64748b;
  --border-color: #e2e8f0;
  /* Les autres couleurs restent identiques */
}
```

### 3. Utilisation dans les composants

#### Dans le CSS/Tailwind

```css
.mon-composant {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
```

#### Dans le HTML inline

```html
<div style="color: var(--text-primary);">
  Texte qui s'adapte au thème
</div>
```

#### Dans TypeScript

```typescript
// Obtenir une variable CSS
const bgColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--bg-primary');
```

## 🎮 Intégration Phaser

Le fond du jeu Phaser s'adapte automatiquement au thème :

```typescript
// Dans GameScene.ts
private updateBackgroundColor() {
  const isDark = document.documentElement.classList.contains('dark');
  const bgColor = isDark ? 0x1e4d3d : 0xa8d5ba; // Vert foncé ou clair
  this.cameras.main.setBackgroundColor(bgColor);
}
```

Un **MutationObserver** détecte les changements de thème et met à jour le fond automatiquement.

## 🎨 Palette de couleurs

### Thème sombre

| Élément | Couleur | Hex |
|---------|---------|-----|
| Fond principal | Bleu-gris très foncé | `#0f172a` |
| Fond cartes | Bleu-gris foncé | `#1e293b` |
| Fond boutons | Gris foncé | `#334155` |
| Texte principal | Blanc cassé | `#f1f5f9` |
| Texte secondaire | Gris clair | `#cbd5e1` |
| Texte tertiaire | Gris moyen | `#94a3b8` |

### Thème clair

| Élément | Couleur | Hex |
|---------|---------|-----|
| Fond principal | Blanc-gris | `#f8fafc` |
| Fond cartes | Blanc pur | `#ffffff` |
| Fond boutons | Gris très clair | `#f1f5f9` |
| Texte principal | Bleu-gris foncé | `#0f172a` |
| Texte secondaire | Gris foncé | `#334155` |
| Texte tertiaire | Gris moyen | `#64748b` |

### Couleurs d'accentuation (identiques)

| Type | Couleur | Hex |
|------|---------|-----|
| Success | Vert | `#16c784` |
| Danger | Rouge | `#ea3943` |
| Warning | Jaune | `#f6b93b` |
| Primary | Bleu | `#0ea5e9` |

## 🔄 Persistance

La préférence de thème est **automatiquement sauvegardée** dans `localStorage` :

```typescript
localStorage.setItem('theme', 'dark'); // ou 'light'
```

Au prochain chargement de la page, le thème sauvegardé est restauré.

## 🎯 Composants adaptés

Tous les composants suivants s'adaptent automatiquement au thème :

- ✅ **Dashboard** - Tableau de bord avec infos utilisateur
- ✅ **LoginModal** - Modale de connexion
- ✅ **Notifications** - Notifications toast
- ✅ **Toolbar** - Barre d'outils
- ✅ **Buttons** - Tous les boutons
- ✅ **Cards** - Toutes les cartes
- ✅ **Phaser Game** - Fond du jeu

## 📝 Ajouter un nouveau composant avec support thème

### Méthode 1 : Utiliser les variables CSS (recommandé)

```typescript
const element = document.createElement('div');
element.style.backgroundColor = 'var(--bg-secondary)';
element.style.color = 'var(--text-primary)';
element.style.border = '1px solid var(--border-color)';
```

### Méthode 2 : Classes CSS avec variables

```css
.mon-nouveau-composant {
  @apply rounded-lg p-4 transition-colors duration-200;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}
```

### Méthode 3 : Classes conditionnelles

```css
:root.dark .mon-composant {
  background-color: #1e293b;
}

:root.light .mon-composant {
  background-color: #ffffff;
}
```

## 🚀 Performance

- **Transitions fluides** : `transition-colors duration-200`
- **Pas de flash** : Le thème est appliqué avant le premier rendu
- **Optimisé** : Utilise les variables CSS natives du navigateur
- **Léger** : ~2KB de CSS supplémentaire

## 🔧 Configuration avancée

### Ajouter une nouvelle variable

1. Dans `main.css`, ajoutez votre variable dans les deux thèmes :

```css
:root.dark {
  --ma-couleur: #123456;
}

:root.light {
  --ma-couleur: #abcdef;
}
```

2. Utilisez-la dans votre code :

```css
.mon-element {
  color: var(--ma-couleur);
}
```

### Écouter les changements de thème

```typescript
// Observer les changements
const observer = new MutationObserver(() => {
  const isDark = document.documentElement.classList.contains('dark');
  console.log('Thème changé:', isDark ? 'sombre' : 'clair');
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class']
});
```

## 🎓 Best Practices

1. ✅ **Toujours utiliser les variables CSS** plutôt que des couleurs en dur
2. ✅ **Ajouter `transition-colors duration-200`** pour des transitions fluides
3. ✅ **Tester dans les deux thèmes** avant de valider
4. ✅ **Utiliser `var(--variable, fallback)`** pour une valeur de secours
5. ✅ **Préférer les variables sémantiques** (`--text-primary`) aux valeurs directes

## 🐛 Dépannage

### Le thème ne change pas
- Vérifiez que `ThemeManager` est bien initialisé dans `index.ts`
- Vérifiez la console pour les erreurs
- Effacez le localStorage et rechargez

### Les couleurs ne s'appliquent pas
- Assurez-vous d'utiliser `var(--variable)` et non `--variable`
- Vérifiez que la variable existe dans `main.css`
- Inspectez l'élément avec DevTools pour voir les valeurs

### Les transitions sont saccadées
- Ajoutez `transition-colors duration-200` à vos éléments
- Évitez d'animer trop de propriétés en même temps

## 📚 Ressources

- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [MutationObserver (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [Tailwind CSS Variables](https://tailwindcss.com/docs/customizing-colors)

