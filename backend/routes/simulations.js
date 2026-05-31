import express from 'express';
import Simulation from '../models/Simulation.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/simulations
// @desc    Get all simulations
// @access  Public (pour que les étudiants puissent voir les cours sans être loggés en Admin)
router.get('/', async (req, res) => {
  try {
    const simulations = await Simulation.find().sort({ createdAt: 1 });
    res.json(simulations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des simulations', error: error.message });
  }
});

// @route   POST /api/simulations
// @desc    Create a new simulation
// @access  Private (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    const {
      category,
      title,
      badPrompt,
      badMediaUrl,
      badMediaType,
      goodPrompt,
      goodMediaUrl,
      goodMediaType,
      explanation
    } = req.body;

    const simulation = new Simulation({
      category,
      title,
      badPrompt,
      badMediaUrl,
      badMediaType,
      goodPrompt,
      goodMediaUrl,
      goodMediaType,
      explanation
    });

    const createdSimulation = await simulation.save();
    res.status(201).json(createdSimulation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
  }
});

// @route   DELETE /api/simulations/:id
// @desc    Delete a simulation
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const simulation = await Simulation.findById(req.params.id);
    
    if (simulation) {
      await Simulation.deleteOne({ _id: req.params.id });
      res.json({ message: 'Simulation supprimée' });
    } else {
      res.status(404).json({ message: 'Simulation non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
});

export default router;
