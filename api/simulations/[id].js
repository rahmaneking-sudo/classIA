import connectDB from '../../_lib/db.js';
import { protectAdmin } from '../../_lib/protect.js';
import Simulation from '../../backend/models/Simulation.js';

export default async function handler(req, res) {
  const { id } = req.query;

  // DELETE /api/simulations/:id — Supprimer une simulation
  if (req.method === 'DELETE') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      await connectDB();
      const simulation = await Simulation.findById(id);
      
      if (simulation) {
        await Simulation.deleteOne({ _id: id });
        return res.status(200).json({ message: 'Simulation supprimée' });
      } else {
        return res.status(404).json({ message: 'Simulation non trouvée' });
      }
    } catch (error) {
      console.error('Delete simulation error:', error);
      return res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
