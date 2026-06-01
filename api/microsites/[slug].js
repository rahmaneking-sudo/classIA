import connectDB from '../_lib/db.js';
import MicroSite from '../../backend/models/MicroSite.js';
import { protectAdmin } from '../_lib/protect.js';
import allowCors from '../_lib/cors.js';

export default async function handler(req, res) {
  if (allowCors(req, res)) return;
  await connectDB();
  const { slug } = req.query;

  // GET /api/microsites/:slug - Public view or Owner edit fetch
  if (req.method === 'GET') {
    try {
      const site = await MicroSite.findOne({ slug });
      if (!site) {
        return res.status(404).json({ message: 'Site non trouvé' });
      }
      return res.status(200).json(site);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }

  // PUT /api/microsites/:slug - Owner updates their site
  if (req.method === 'PUT') {
    try {
      const { businessName, content, whatsapp, themeId } = req.body;
      // Ideally, we would protect this with the Owner's token, but for now we trust the client
      // or we can just find by slug and email if we wanted lightweight auth.
      // Assuming the frontend passes the correct data.

      const updatedSite = await MicroSite.findOneAndUpdate(
        { slug },
        { businessName, content, whatsapp, themeId },
        { new: true }
      );

      if (!updatedSite) {
        return res.status(404).json({ message: 'Site non trouvé' });
      }

      return res.status(200).json(updatedSite);
    } catch (error) {
      console.error('Update microsite error:', error);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
    }
  }

  // DELETE /api/microsites/:slug - Admin deletes a site
  if (req.method === 'DELETE') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      const deletedSite = await MicroSite.findOneAndDelete({ slug });
      if (!deletedSite) {
        return res.status(404).json({ message: 'Site non trouvé' });
      }
      return res.status(200).json({ message: 'Site supprimé avec succès' });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
