import connectDB from '../../_lib/db.js';
import { protectAdmin } from '../../_lib/protect.js';
import Prompt from '../../../backend/models/Prompt.js';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      await connectDB();
      const { id } = req.query;
      const deletedPrompt = await Prompt.findByIdAndDelete(id);
      
      if (!deletedPrompt) {
        return res.status(404).json({ message: 'Prompt non trouvé' });
      }

      return res.status(200).json({ message: 'Prompt supprimé' });
    } catch (error) {
      console.error('Delete prompt error:', error);
      return res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
