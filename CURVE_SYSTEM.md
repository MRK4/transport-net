# Système de courbes pour les lignes de métro

## Vue d'ensemble

Les lignes de métro utilisent des courbes de Bézier quadratiques au lieu de lignes droites pour créer un rendu plus réaliste et visuellement agréable. Les virages à 90° ne sont plus possibles.

## Implémentation technique

### Courbes de Bézier quadratiques

Chaque segment entre deux stations utilise une courbe de Bézier quadratique définie par :
- **Point de départ (P0)** : Position de la station source
- **Point de contrôle (P1)** : Point calculé perpendiculairement au milieu du segment
- **Point d'arrivée (P2)** : Position de la station destination

### Calcul du point de contrôle

Le point de contrôle est calculé avec `calculateCurveControlPoint()` :

```typescript
private calculateCurveControlPoint(
  x1: number, y1: number,
  x2: number, y2: number,
  segmentIndex: number,
  totalSegments: number
): { x: number, y: number }
```

**Algorithme** :
1. Calcul du point milieu entre les deux stations
2. Calcul du vecteur perpendiculaire (normal) à la direction du segment
3. Décalage du point milieu perpendiculairement avec une intensité de 15% de la distance
4. Alternance de la direction (gauche/droite) selon l'index du segment pour créer un effet sinueux

### Rendu des courbes

Les courbes sont dessinées en approximant la courbe de Bézier avec 20 segments linéaires via `drawQuadraticCurve()` :

```typescript
private drawQuadraticCurve(
  graphics: Phaser.GameObjects.Graphics,
  x0: number, y0: number,  // Point de départ
  x1: number, y1: number,  // Point de contrôle
  x2: number, y2: number   // Point d'arrivée
): void
```

**Formule de Bézier quadratique** :
```
B(t) = (1-t)²·P0 + 2(1-t)t·P1 + t²·P2
```
où `t` varie de 0 à 1.

## Mouvement des trains

Les trains suivent également les courbes de Bézier lors de leur déplacement :

1. **Calcul de la progression** : Le paramètre `t` (0 à 1) représente la position du train sur la courbe
2. **Interpolation** : La position (x, y) du train est calculée avec la formule de Bézier quadratique
3. **Vitesse constante** : La vitesse est ajustée en fonction de la distance entre les stations

### Code dans Train.ts

```typescript
// Interpoler la position le long de la courbe de Bézier quadratique
const t = this.progress;
const oneMinusT = 1 - t;

this.x = oneMinusT * oneMinusT * currentStation.x +
         2 * oneMinusT * t * controlPoint.x +
         t * t * nextStation.x;
         
this.y = oneMinusT * oneMinusT * currentStation.y +
         2 * oneMinusT * t * controlPoint.y +
         t * t * nextStation.y;
```

## Ligne temporaire

Lors de la création d'une ligne, une ligne temporaire verte semi-transparente suit le curseur de la souris depuis la première station sélectionnée. Cette ligne utilise également une courbe de Bézier pour prévisualiser le tracé final.

## Paramètres configurables

- **Intensité de courbure** : `distance * 0.15` (15% de la distance entre stations)
- **Nombre de segments** : `20` pour l'approximation de la courbe
- **Alternance de direction** : `segmentIndex % 2` pour alterner gauche/droite
- **Épaisseur de ligne** : `6px` (normal) ou `10px` (mode suppression)

## Bénéfices

✅ Aspect visuel plus réaliste et professionnel
✅ Transitions douces entre les segments
✅ Effet sinueux naturel sur les longues lignes
✅ Pas de virages brusques à 90°
✅ Trains suivant des trajectoires fluides

