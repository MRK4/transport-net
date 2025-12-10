# 🎮 Transport-Net - Règles du Jeu

## 🎯 Objectif du jeu

Créez et gérez un réseau de transport rentable en construisant des stations, en traçant des lignes et en optimisant vos revenus tout en maîtrisant vos coûts d'entretien.

---

## 💰 Système de revenus

### Génération d'argent

#### ✅ Stations connectées
- **Une station doit être reliée à au moins une ligne pour générer des revenus**
- Les stations isolées (non reliées) ne génèrent **aucun revenu**
- Plus une station est connectée à de lignes, plus elle peut être rentable

#### 🚆 Passage des trains
- **Chaque passage d'un train sur une ligne génère de l'argent**
- Le revenu dépend :
  - Du nombre de stations sur la ligne
  - Du niveau d'amélioration des stations traversées
  - De la fréquence des trains sur cette ligne
  - Du type de ligne (métro, tramway, etc.)

#### 📊 Calcul des revenus
```
Revenu par passage = (Nombre de stations × Niveau moyen des stations × Multiplicateur de ligne) / Distance
```

---

## 💸 Système de coûts

### Coûts d'entretien permanents

#### 🔧 Entretien général
- **Le joueur perd de l'argent chaque minute**
- Ces coûts couvrent :
  - L'entretien des trains
  - L'entretien des lignes
  - L'entretien des stations
  - Les salaires du personnel

#### 📈 Coûts progressifs

**Stations**
- Chaque station améliorée coûte **plus cher en entretien**
- Coût de base : 50 €/min par station
- Coût par niveau : +25 €/min par niveau d'amélioration

**Lignes**
- Chaque ligne nécessite un entretien régulier
- Coût de base : 100 €/min par ligne
- Coût additionnel : +10 €/min par station sur la ligne

**Trains**
- Plus de trains = plus de coûts d'entretien
- Coût de base : 75 €/min par train
- Chaque amélioration de train : +30 €/min

#### 💡 Exemple de coût total
```
Réseau avec :
- 5 stations (niveau 1) : 5 × 50 = 250 €/min
- 2 lignes avec 3 stations chacune : 2 × (100 + 30) = 260 €/min
- 3 trains : 3 × 75 = 225 €/min
───────────────────────────────────────
Coût total : 735 €/min
```

---

## 🛤️ Règles de construction

### Stations

#### Création
- **Coût de construction de base** : 1 000 € pour la première station
- **Coût progressif** : Chaque nouvelle station coûte plus cher que la précédente
  - Station 1 : 1 000 €
  - Station 2 : 1 100 € (+10%)
  - Station 3 : 1 210 € (+10%)
  - Station n : Coût précédent × 1.10
- Placement libre sur la carte
- Pas de limite de distance entre stations

> ⚠️ **Attention** : Plus vous construisez de stations, plus les suivantes deviennent chères !

#### Améliorations
- Niveau 1 : Station de base (100 €/s de revenu potentiel)
- Niveau 2 : +50% de capacité (+150 €/s)
- Niveau 3 : +100% de capacité (+200 €/s)
- Niveau 4 : +150% de capacité (+250 €/s)
- Niveau 5 : +200% de capacité (station terminus, +300 €/s)

#### Particularités
- Une station peut être connectée à **plusieurs lignes**
- Les stations de correspondance (2+ lignes) génèrent un **bonus de 25%**

---

### Lignes

#### Création
- **Coût de construction de base** : 500 € pour la première ligne
- **Coût progressif** : Chaque nouvelle ligne coûte plus cher que la précédente
  - Ligne 1 : 500 €
  - Ligne 2 : 550 € (+10%)
  - Ligne 3 : 605 € (+10%)
  - Ligne n : Coût précédent × 1.10
- Choix de la couleur pour différencier les lignes
- Nom personnalisable

> ⚠️ **Attention** : Plus vous construisez de lignes, plus les suivantes deviennent chères !

#### Connexion des stations
- **Deux stations ne peuvent être reliées qu'une seule fois**
- On ne peut pas créer de doublons de connexion sur la même ligne
- On ne peut pas créer de boucles fermées (limitation actuelle)

#### Types de lignes
- **Métro** : Rapide, capacité élevée, coût élevé
- **Tramway** : Vitesse moyenne, capacité moyenne, coût moyen
- **Bus** : Lent, faible capacité, coût faible

#### Améliorations
- Augmentation de la fréquence des trains
- Augmentation de la vitesse
- Augmentation de la capacité

---

### Trains

#### Attributs
- **Vitesse** : Détermine le temps entre les passages
- **Capacité** : Détermine le revenu par passage
- **Fréquence** : Nombre de trains sur une ligne

#### Gestion
- 1 train minimum par ligne
- Jusqu'à 5 trains maximum par ligne
- Plus de trains = plus de revenus mais aussi plus de coûts

---

## 🎲 Mécaniques de jeu

### Équilibre Revenus/Coûts

#### Phase de démarrage
```
Argent de départ : 10 000 €
Objectif : Construire un réseau rentable rapidement
```

#### Expansion
- Construire de nouvelles stations
- Tracer de nouvelles lignes
- Relier les stations entre elles
- Équilibrer revenus et coûts d'entretien

#### Optimisation
- Améliorer les stations stratégiques
- Optimiser le nombre de trains
- Créer des lignes de correspondance
- Maximiser l'efficacité du réseau

### Faillite

#### ⚠️ Conditions de Game Over
- **Argent négatif pendant plus de 2 minutes**
- Impossibilité de payer les coûts d'entretien
- Le joueur doit supprimer des éléments ou abandonner la partie

#### 💡 Éviter la faillite
- Surveiller constamment le solde
- Ne pas construire trop rapidement
- Équilibrer construction et rentabilité
- Supprimer les lignes non rentables

---

## 📊 Statistiques & Objectifs

### Indicateurs clés

**Tableau de bord**
- 💰 **Argent disponible** : Solde actuel
- 📈 **Revenu/s** : Revenus générés par seconde
- 💸 **Coût/min** : Coûts d'entretien par minute
- 📊 **Bénéfice net** : Revenu - Coûts

**Performance du réseau**
- 🚉 Nombre de stations
- 🚆 Nombre de lignes
- 🚂 Nombre de trains
- 👥 Passagers transportés (futur)
- ⭐ Note de satisfaction (futur)

### Objectifs & Succès

#### Objectifs de base
- [ ] Créer votre premier réseau
- [ ] Construire 5 stations
- [ ] Tracer votre première ligne
- [ ] Relier 2 stations
- [ ] Atteindre 1 000 €/s de revenus

#### Objectifs intermédiaires
- [ ] Construire 10 stations
- [ ] Créer 3 lignes
- [ ] Avoir 50 000 € d'argent
- [ ] Créer une station de correspondance
- [ ] Atteindre 5 000 €/s de revenus

#### Objectifs avancés
- [ ] Construire 25 stations
- [ ] Créer 5 lignes
- [ ] Avoir 100 000 € d'argent
- [ ] Créer un réseau avec 3 correspondances
- [ ] Atteindre 10 000 €/s de revenus

---

## 🎓 Conseils & Stratégies

### Pour débutants

#### 1. Commencez petit
- Ne construisez pas trop vite
- Commencez avec 3-4 stations proches
- Créez une seule ligne au début
- **Attention aux coûts progressifs** : chaque station/ligne supplémentaire coûte 10% de plus !

#### 2. Surveillez vos finances
- Vérifiez toujours votre solde
- Ne construisez que si vous êtes rentable
- Gardez une marge de sécurité

#### 3. Optimisez avant d'agrandir
- Améliorez vos stations existantes
- Assurez-vous que toutes les stations sont connectées
- Optimisez le nombre de trains

### Pour joueurs avancés

#### 1. Créez des hubs de correspondance
- Reliez plusieurs lignes sur une station centrale
- Bonus de revenus important
- Optimise l'efficacité du réseau

#### 2. Planifiez votre réseau
- Anticipez l'expansion future
- Laissez de l'espace entre les stations
- Créez des lignes complémentaires
- **Optimisez l'ordre de construction** : avec les coûts progressifs (+10%), construisez stratégiquement

#### 3. Gérez la croissance
- N'ajoutez une ligne que si nécessaire
- Équilibrez le nombre de trains
- Supprimez les éléments non rentables

---

## ⚙️ Paramètres & Valeurs

### Coûts de construction
| Élément | Coût initial | Progression | Temps de construction |
|---------|--------------|-------------|----------------------|
| Station | 1 000 € | +10% par station | Instantané |
| Ligne | 500 € | +10% par ligne | Instantané |
| Train | 2 000 € | Fixe | Instantané |

**Formule de coût progressif :**
- Coût station n = 1 000 × (1.10)^(n-1)
- Coût ligne n = 500 × (1.10)^(n-1)

**Exemples :**
- 5ème station : 1 000 × 1.10⁴ = 1 464 €
- 10ème station : 1 000 × 1.10⁹ = 2 358 €
- 5ème ligne : 500 × 1.10⁴ = 732 €
- 10ème ligne : 500 × 1.10⁹ = 1 179 €

### Coûts d'entretien (par minute)
| Élément | Coût de base | Par amélioration |
|---------|--------------|------------------|
| Station | 50 €/min | +25 €/min |
| Ligne | 100 €/min | +10 €/min par station |
| Train | 75 €/min | +30 €/min |

### Revenus (par seconde)
| Type de station | Revenu de base | Avec ligne |
|-----------------|----------------|------------|
| Niveau 1 | 0 €/s | 100 €/s |
| Niveau 2 | 0 €/s | 150 €/s |
| Niveau 3 | 0 €/s | 200 €/s |
| Niveau 4 | 0 €/s | 250 €/s |
| Niveau 5 | 0 €/s | 300 €/s |

### Bonus
| Type | Bonus |
|------|-------|
| Correspondance (2 lignes) | +25% |
| Correspondance (3 lignes) | +50% |
| Correspondance (4+ lignes) | +75% |

---

## 🔮 Fonctionnalités futures

### En développement
- 👥 Système de passagers détaillé
- 🌆 Différents types de zones (résidentiel, commercial, industriel)
- 🎯 Missions et défis quotidiens
- 📈 Graphiques de performance détaillés
- 🏆 Système de succès et récompenses

### Prévu
- 🌍 Cartes de villes réelles
- 🚇 Plus de types de transport (bus, ferry, etc.)
- 🎨 Personnalisation visuelle avancée
- 👥 Mode multijoueur coopératif
- 📊 Classements et compétitions

---

## ❓ FAQ

**Q: Que se passe-t-il si je n'ai plus d'argent ?**  
R: Vous avez 2 minutes pour remonter la pente. Après, c'est le Game Over.

**Q: Puis-je supprimer une station ou une ligne ?**  
R: Oui, utilisez l'outil "Supprimer". Vous récupérerez 50% du coût de construction.

**Q: Combien de stations maximum ?**  
R: Pas de limite technique, mais attention aux coûts d'entretien ET aux coûts progressifs (+10% par station) !

**Q: Pourquoi ma nouvelle station coûte plus cher que la première ?**  
R: Le coût de construction augmente de 10% à chaque nouvelle station et ligne. C'est une mécanique de jeu pour équilibrer la progression.

**Q: Mes stations ne génèrent pas d'argent, pourquoi ?**  
R: Vérifiez qu'elles sont bien reliées à au moins une ligne avec des trains.

**Q: Comment améliorer une station ?**  
R: Cliquez sur une station existante et choisissez "Améliorer" (fonctionnalité à venir).

---

## 🎮 Bon jeu !

Amusez-vous bien à construire votre empire de transport ! 🚇✨

*Ces règles sont susceptibles d'évoluer avec les mises à jour du jeu.*

