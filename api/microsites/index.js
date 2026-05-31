import connectDB from '../_lib/db.js';
import { protectAdmin } from '../_lib/protect.js';
import MicroSite from '../../backend/models/MicroSite.js';

export default async function handler(req, res) {
  await connectDB();

  // GET /api/microsites - Admin fetch all microsites
  if (req.method === 'GET') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      const sites = await MicroSite.find().sort({ createdAt: -1 });
      return res.status(200).json(sites);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération des sites', error: error.message });
    }
  }

  // POST /api/microsites - User creates a new microsite
  if (req.method === 'POST') {
    try {
      const { slug, businessName, ownerEmail, whatsapp, themeId, tier, content } = req.body;

      // Check if slug already exists
      const existing = await MicroSite.findOne({ slug });
      if (existing) {
        return res.status(400).json({ message: 'Ce nom de lien (slug) est déjà utilisé. Veuillez en choisir un autre.' });
      }

      const newSite = new MicroSite({
        slug,
        businessName,
        ownerEmail,
        whatsapp,
        themeId,
        tier,
        content,
        isActive: false // By default, pending payment
      });

      const savedSite = await newSite.save();
      return res.status(201).json(savedSite);
    } catch (error) {
      console.error('Create microsite error:', error);
      return res.status(500).json({ message: 'Erreur lors de la création du site', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
