import connectDB from '../_lib/db.js';
import { protectAdmin } from '../_lib/protect.js';
import Lead from '../../backend/models/Lead.js';

export default async function handler(req, res) {
  // GET /api/leads — liste des candidats (admin)
  if (req.method === 'GET') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      await connectDB();
      const leads = await Lead.find({}).sort({ createdAt: -1 });
      return res.status(200).json(leads);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // POST /api/leads — inscription d'un nouveau candidat
  if (req.method === 'POST') {
    const { name, email, phone } = req.body;
    try {
      await connectDB();

      // Vérifier si email déjà utilisé
      const existing = await Lead.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'Cet email est déjà enregistré.' });
      }

      const lead = new Lead({ name, email, phone });
      await lead.save();
      return res.status(201).json(lead);
    } catch (error) {
      console.error('Lead register error:', error);
      return res.status(400).json({ message: "Erreur lors de l'enregistrement" });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
