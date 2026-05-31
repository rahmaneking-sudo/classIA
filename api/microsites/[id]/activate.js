import connectDB from '../../_lib/db.js';
import { protectAdmin } from '../../_lib/protect.js';
import MicroSite from '../../../backend/models/MicroSite.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      await connectDB();
      const site = await MicroSite.findById(id);
      
      if (!site) {
        return res.status(404).json({ message: 'Site non trouvé' });
      }

      // Toggle activation status
      site.isActive = !site.isActive;
      await site.save();

      return res.status(200).json({ 
        message: `Site ${site.isActive ? 'activé' : 'désactivé'} avec succès`,
        isActive: site.isActive 
      });
    } catch (error) {
      console.error('Activate microsite error:', error);
      return res.status(500).json({ message: 'Erreur lors de l\'activation', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
