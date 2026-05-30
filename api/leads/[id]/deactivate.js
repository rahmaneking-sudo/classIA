import connectDB from '../../../_lib/db.js';
import { protectAdmin } from '../../../_lib/protect.js';
import mongoose from 'mongoose';

const getLeadModel = async () => {
  await connectDB();
  if (mongoose.models.Lead) return mongoose.models.Lead;
  const { default: Lead } = await import('../../../backend/models/Lead.js');
  return Lead;
};

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const admin = await protectAdmin(req);
  if (!admin) return res.status(401).json({ message: 'Non autorisé' });

  try {
    const Lead = await getLeadModel();
    const lead = await Lead.findById(id);

    if (!lead) return res.status(404).json({ message: 'Candidat introuvable' });

    lead.isActive = false;
    lead.status = 'nouveau';
    await lead.save();

    return res.status(200).json({ message: 'Compte étudiant désactivé avec succès', lead });
  } catch (error) {
    console.error('Deactivate error:', error);
    return res.status(500).json({ message: 'Erreur lors de la désactivation' });
  }
}
