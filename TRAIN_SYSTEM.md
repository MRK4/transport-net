# 🚂 Système de trains - Transport-Net

## Vue d'ensemble

Le système de revenus de Transport-Net est basé sur le **passage des trains**. Chaque fois qu'un train arrive à une station, il génère des revenus pour le joueur.

## 🎮 Fonctionnement

### Génération automatique des trains

- **1 train automatique** par ligne créée
- Les trains se créent automatiquement quand vous tracez une ligne entre 2 stations
- Vitesse : 100 pixels/seconde par défaut
- Déplacement continu en boucle sur la ligne

### Mouvement des trains

```
Station A → Station B → Station C → Station A (boucle)
```

1. Le train part de la première station
2. Se déplace vers la station suivante
3. Arrive et génère des revenus
4. Repart vers la station suivante
5. Boucle indéfiniment

## 💰 Système de revenus

### Calcul par arrivée

Chaque arrivée en station génère :

```
Revenu = 50€ (base) 
       + (nombre de stations sur la ligne × 10€)
       + bonus de correspondance
```

### Exemples

**Ligne simple (2 stations) :**
```
50€ + (2 × 10€) = 70€ par arrivée
```

**Ligne moyenne (5 stations) :**
```
50€ + (5 × 10€) = 100€ par arrivée
```

**Station de correspondance (2 lignes) :**
```
100€ × 1.25 = 125€ par arrivée (+25%)
```

**Station de correspondance (3 lignes) :**
```
100€ × 1.50 = 150€ par arrivée (+50%)
```

### Affichage des revenus

- **Indicateur visuel** : Un texte `+XXX€` apparaît et monte à chaque arrivée
- **Tableau de bord** : Affiche `~XXX €/s` (estimation)
- Le `~` indique que c'est une **estimation** basée sur la fréquence moyenne des trains

## 🎨 Représentation visuelle

### Trains
- **Forme** : Petit carré coloré (8×8 pixels)
- **Couleur** : Même couleur que la ligne
- **Bordure** : Blanche pour visibilité
- **Ombre** : Légère ombre portée
- **Point central** : Point blanc au centre

### Animation
- **Déplacement fluide** entre les stations
- **Vitesse constante** : 100 px/s
- **Interpolation linéaire** pour un mouvement smooth

## 📊 Impact sur le gameplay

### Différences avec le système par seconde

**Avant (par seconde) :**
- Revenus constants et prévisibles
- Moins d'interaction visuelle
- Système simple

**Maintenant (par passage) :**
- ✅ Revenus visuels et satisfaisants
- ✅ Feedback immédiat à chaque arrivée
- ✅ Plus de trains = plus de revenus
- ✅ Encourages les longues lignes
- ✅ Bonus pour les correspondances visibles

### Stratégies

#### Maximiser les revenus

1. **Créer des lignes longues** : Plus de stations = plus de revenus par passage
2. **Créer des correspondances** : Bonus de 25-75%
3. **Ajouter plus de trains** (futur) : Plus de passages = plus de revenus
4. **Optimiser les trajets** : Lignes en boucle efficaces

#### Optimiser les coûts

1. **Équilibrer longueur et coûts d'entretien**
2. **Ne pas sur-construire** : Coûts progressifs +10%
3. **Créer des hubs centraux** : Maximiser les correspondances
4. **Supprimer les lignes non rentables** : Mais seulement 10% de remboursement !

## 🔢 Formules

### Revenu de base par arrivée
```
R_base = 50€
```

### Bonus stations
```
R_stations = nombre_stations × 10€
```

### Bonus correspondance
```
Multiplicateur = 1 + (nombre_lignes - 1) × 0.25

2 lignes : ×1.25 (+25%)
3 lignes : ×1.50 (+50%)
4 lignes : ×1.75 (+75%)
```

### Revenu total par arrivée
```
R_total = (R_base + R_stations) × Multiplicateur_correspondance
```

### Estimation revenu/seconde
```
R/s = (Revenu_total × Nombre_trains) / Temps_moyen_entre_arrivées
```

En supposant un train arrive toutes les 5 secondes :
```
R/s = Revenu_total / 5
```

## 🎯 Mécaniques futures

### Améliorations prévues

- **🚂 Plusieurs trains par ligne** : Augmenter la fréquence
- **⚡ Vitesse des trains** : Améliorer pour des passages plus rapides
- **💪 Capacité des trains** : Plus de revenus par passage
- **🎯 Types de trains** : Métro rapide, tramway lent mais capacité élevée, etc.
- **⏱️ Horaires** : Trains aux heures de pointe = plus de revenus
- **🌐 Réseau interconnecté** : Bonus pour réseaux complexes

### Fonctionnalités avancées

- **📊 Statistiques par ligne** : Revenus par ligne, rentabilité
- **🎮 Gestion manuelle** : Ajouter/retirer des trains
- **🔧 Maintenance** : Trains en panne occasionnellement
- **👥 Passagers** : Système de passagers détaillé
- **📈 Graphiques** : Visualisation des revenus par ligne

## 🐛 Debugging

### Voir les trains

Si vous ne voyez pas les trains :
1. Vérifiez que vous avez créé au moins une ligne
2. La ligne doit avoir au moins 2 stations
3. Les trains sont de petits carrés colorés se déplaçant sur les lignes

### Logs utiles

```typescript
console.log('Nombre de trains:', trainManager.getTrains().length);
console.log('Trains actifs:', trainManager.getTrains().map(t => t.id));
```

### Performance

- Les trains utilisent la méthode `update()` de Phaser
- Optimisé pour des dizaines de trains simultanément
- Pas d'impact significatif sur les performances

## 📝 Code d'exemple

### Créer un train manuellement

```typescript
const train = new Train({
  id: 'train-1',
  line: myLine,
  speed: 150, // Plus rapide
  color: 0xFF0000 // Rouge
});
```

### Écouter les arrivées

```typescript
trainManager.update(delta, (train, station) => {
  console.log(`Train ${train.id} est arrivé à ${station.name}`);
  // Générer des revenus
  money += calculateRevenue(train, station);
});
```

## 🎉 Résultat

Le système de trains rend le jeu :
- ✅ **Plus vivant** : Mouvement constant sur la carte
- ✅ **Plus satisfaisant** : Feedback visuel des revenus
- ✅ **Plus stratégique** : Optimiser les lignes pour maximiser les passages
- ✅ **Plus engageant** : Observer les trains circuler
- ✅ **Plus évolutif** : Base solide pour futures fonctionnalités

Amusez-vous bien à regarder vos trains circuler ! 🚂✨

