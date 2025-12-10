import { Router } from 'express';
import { prisma } from '../db/prisma';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// Middleware d'authentification
router.use(isAuthenticated);

// Créer une ligne
router.post('/', async (req, res) => {
  try {
    const userId = (req.user as any).id;
    const { networkId, name, color, type } = req.body;

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

    const line = await prisma.line.create({
      data: {
        networkId,
        name,
        color: color || '#FF0000',
        type: type || 'metro'
      }
    });

    res.json(line);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la ligne' });
  }
});

// Ajouter une station à une ligne
router.post('/:id/stations', async (req, res) => {
  try {
    const userId = (req.user as any).id;
    const lineId = req.params.id;
    const { stationId } = req.body;

    // Vérifier que la ligne appartient à l'utilisateur
    const line = await prisma.line.findFirst({
      where: {
        id: lineId,
        network: {
          userId
        }
      },
      include: {
        stations: true
      }
    });

    if (!line) {
      return res.status(404).json({ error: 'Ligne non trouvée' });
    }

    // Vérifier que la station appartient au même réseau
    const station = await prisma.station.findFirst({
      where: {
        id: stationId,
        networkId: line.networkId
      }
    });

    if (!station) {
      return res.status(404).json({ error: 'Station non trouvée' });
    }

    // Ajouter la station à la ligne
    const order = line.stations.length;
    const lineStation = await prisma.lineStation.create({
      data: {
        lineId,
        stationId,
        order
      }
    });

    res.json(lineStation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la station à la ligne' });
  }
});

// Supprimer une ligne
router.delete('/:id', async (req, res) => {
  try {
    const userId = (req.user as any).id;
    const lineId = req.params.id;

    // Vérifier que la ligne appartient à l'utilisateur
    const line = await prisma.line.findFirst({
      where: {
        id: lineId,
        network: {
          userId
        }
      }
    });

    if (!line) {
      return res.status(404).json({ error: 'Ligne non trouvée' });
    }

    await prisma.line.delete({
      where: { id: lineId }
    });

    res.json({ message: 'Ligne supprimée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la ligne' });
  }
});

export { router as lineRouter };

