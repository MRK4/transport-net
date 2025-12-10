import { Router } from 'express';
import { prisma } from '../db/prisma';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// Middleware d'authentification
router.use(isAuthenticated);

// Créer une station
router.post('/', async (req, res) => {
  try {
    const userId = (req.user as any).id;
    const { networkId, name, x, y, type, cost } = req.body;

    // Vérifier que le réseau appartient à l'utilisateur
    const network = await prisma.network.findFirst({
      where: {
        id: networkId,
        userId
      }
    });

    if (!network) {
      return res.status(404).json({ error: 'Réseau non trouvé' });
    }

    // Vérifier que l'utilisateur a assez d'argent
    if (network.money < cost) {
      return res.status(400).json({ error: 'Pas assez d\'argent' });
    }

    // Créer la station
    const station = await prisma.station.create({
      data: {
        networkId,
        name,
        x,
        y,
        type: type || 'metro',
        cost: cost || 1000,
        revenue: 100
      }
    });

    // Déduire l'argent
    await prisma.network.update({
      where: { id: networkId },
      data: { money: network.money - cost }
    });

    res.json(station);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la station' });
  }
});

// Supprimer une station
router.delete('/:id', async (req, res) => {
  try {
    const userId = (req.user as any).id;
    const stationId = req.params.id;

    // Vérifier que la station appartient à l'utilisateur
    const station = await prisma.station.findFirst({
      where: {
        id: stationId,
        network: {
          userId
        }
      }
    });

    if (!station) {
      return res.status(404).json({ error: 'Station non trouvée' });
    }

    await prisma.station.delete({
      where: { id: stationId }
    });

    res.json({ message: 'Station supprimée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la station' });
  }
});

export { router as stationRouter };

