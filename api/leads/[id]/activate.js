import bcrypt from 'bcryptjs';
import connectDB from '../../../_lib/db.js';
import { protectAdmin } from '../../../_lib/protect.js';
import mongoose from 'mongoose';

const getLeadModel = async () => {
  await connectDB();
  if (mongoose.models.Lead) return mongoose.models.Lead;
  const { default: Lead } = await import('../../../../backend/models/Lead.js');
  return Lead;
};

// Helper WaSender
const sendWaSenderMessage = async (to, text) => {
  try {
    const apiKey = process.env.WASENDER_API_KEY;
    if (!apiKey) return;

    let formattedPhone = to.replace(/[\s\-\(\)\+]/g, '');
    if (formattedPhone.startsWith('7') && formattedPhone.length === 9) {
      formattedPhone = '221' + formattedPhone;
    }

    const { default: axios } = await import('axios');
    await axios.post('https://www.wasenderapi.com/api/send-message', {
      to: formattedPhone,
      text
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('WaSender Error:', error.response?.data || error.message);
  }
};

export default async function handler(req, res) {
  const { id } = req.query;

  // PUT /api/leads/[id]/activate
  if (req.method === 'PUT') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      const Lead = await getLeadModel();
      const lead = await Lead.findById(id);

      if (!lead) return res.status(404).json({ message: 'Candidat introuvable' });
      if (lead.isActive) return res.status(400).json({ message: 'Ce compte est déjà activé' });

      const salt = await bcrypt.genSalt(10);
      lead.password = await bcrypt.hash(lead.phone, salt);
      lead.isActive = true;
      lead.status = 'inscrit';
      await lead.save();

      // Récupérer l'URL du site depuis les variables d'environnement ou utiliser une URL par défaut
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VITE_SITE_URL || 'https://classia.vercel.app';
      const message = `Bonjour ${lead.name} ! 🎉\n\nVotre inscription à CLASSE IA a bien été validée.\nVous pouvez dès maintenant vous connecter à votre Espace Étudiant.\n\nLien : ${siteUrl}/login\nMot de passe par défaut : votre numéro de téléphone`;
      sendWaSenderMessage(lead.phone, message);

      return res.status(200).json({ message: 'Compte étudiant activé avec succès', lead });
    } catch (error) {
      console.error('Activate error:', error);
      return res.status(500).json({ message: "Erreur lors de l'activation" });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
