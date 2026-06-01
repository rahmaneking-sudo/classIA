import connectDB from '../_lib/db.js';
import MicroSite from '../../backend/models/MicroSite.js';
import allowCors from '../_lib/cors.js';

export default async function handler(req, res) {
  if (allowCors(req, res)) return;
  await connectDB();

  if (req.method === 'POST') {
    try {
      const { slug, pinCode } = req.body;

      if (!slug || !pinCode) {
        return res.status(400).json({ message: 'Slug et Code PIN requis.' });
      }

      const site = await MicroSite.findOne({ slug });

      if (!site) {
        return res.status(404).json({ message: 'Ce site n\'existe pas.' });
      }

      if (site.pinCode !== pinCode) {
        return res.status(401).json({ message: 'Code PIN incorrect.' });
      }

      // PIN is correct, return the site data for editing
      return res.status(200).json(site);
    } catch (error) {
      console.error('Auth microsite error:', error);
      return res.status(500).json({ message: 'Erreur lors de l\'authentification', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
