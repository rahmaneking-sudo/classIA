import connectDB from './_lib/db.js';
import { protectAdmin } from './_lib/protect.js';
import Simulation from '../backend/models/Simulation.js';

export default async function handler(req, res) {
  // GET /api/simulations
  if (req.method === 'GET') {
    try {
      await connectDB();
      const simulations = await Simulation.find().sort({ createdAt: 1 });
      return res.status(200).json(simulations);
    } catch (error) {
      console.error('Fetch simulations error:', error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des cours', error: error.message });
    }
  }

  // POST /api/simulations
  if (req.method === 'POST') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      await connectDB();
      const {
        category,
        title,
        prompt,
        mediaUrl,
        mediaType,
        explanation
      } = req.body;

      const simulation = new Simulation({
        category,
        title,
        prompt,
        mediaUrl,
        mediaType,
        explanation
      });

      const createdSimulation = await simulation.save();
      return res.status(201).json(createdSimulation);
    } catch (error) {
      console.error('Create simulation error:', error);
      return res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
    }
  }

  // DELETE /api/simulations?id=XYZ
  if (req.method === 'DELETE') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      await connectDB();
      const { id } = req.query;
      const simulation = await Simulation.findById(id);

      if (!simulation) {
        return res.status(404).json({ message: 'Cours non trouvé' });
      }

      await Simulation.deleteOne({ _id: id });
      return res.status(200).json({ message: 'Cours supprimé avec succès' });
    } catch (error) {
      console.error('Delete simulation error:', error);
      return res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
