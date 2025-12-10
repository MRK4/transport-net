import { Router } from 'express';
import { prisma } from '../db/prisma';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// Middleware d'authentification
router.use(isAuthenticated);

// Récupérer les réseaux de l'utilisateur
router.get('/', async (req, res) => {
  try {
    const userId = (req.user as any).id;
    const networks = await prisma.network.findMany({
      where: { userId },
      include: {
        stations: true,
        lines: {
          include: {
            stations: {
              include: {
                station: true
              }
            }
          }
        }
      }
    });
    res.json(networks);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des réseaux' });
  }
});

// Récupérer un réseau spécifique
router.get('/:id', async (req, res) => {
  try {
    const userId = (req.user as any).id;
    const network = await prisma.network.findFirst({
      where: {
        id: req.params.id,
        userId
      },
      include: {
        stations: true,
        lines: {
          include: {
            stations: {
              include: {
                station: true
              },
              orderBy: {
                order: 'asc'
              }
            }
          }
        }
      }
    });

    if (!network) {
      return res.status(404).json({ error: 'Réseau non trouvé' });
    }

    res.json(network);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du réseau' });
  }
});

// Créer un nouveau réseau
router.post('/', async (req, res) => {
  try {
    const userId = (req.user as any).id;
    const { name } = req.body;

    const network = await prisma.network.create({
      data: {
        userId,
        name: name || 'Nouveau réseau',
        money: 10000
      }
    });

    res.json(network);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du réseau' });
  }
});

// Mettre à jour l'argent du réseau
router.patch('/:id/money', async (req, res) => {
  try {
    const userId = (req.user as any).id;
    const { money } = req.body;

    const network = await prisma.network.findFirst({
      where: {
        id: req.params.id,
        userId
      }
    });

    if (!network) {
      return res.status(404).json({ error: 'Réseau non trouvé' });
    }

    const updated = await prisma.network.update({
      where: { id: req.params.id },
      data: { money }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du réseau' });
  }
});

export { router as networkRouter };

