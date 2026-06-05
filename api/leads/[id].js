import bcrypt from 'bcryptjs';
import connectDB from '../_lib/db.js';
import { protectAdmin } from '../_lib/protect.js';
import Lead from '../../backend/models/Lead.js';
import allowCors from '../_lib/cors.js';

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
  if (allowCors(req, res)) return;

  const { id } = req.query;

  if (req.method === 'PUT') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    const { action } = req.body;

    try {
      await connectDB();
      const lead = await Lead.findById(id);

      if (!lead) return res.status(404).json({ message: 'Candidat introuvable' });

      if (action === 'activate') {
        if (lead.isActive) return res.status(400).json({ message: 'Ce compte est déjà activé' });

        const salt = await bcrypt.genSalt(10);
        lead.password = await bcrypt.hash(lead.phone, salt);
        lead.isActive = true;
        lead.status = 'inscrit';
        await lead.save();

        const siteUrl = process.env.VITE_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || 'https://classia-eight.vercel.app';
        const message = `Bonjour ${lead.name} ! 🎉\n\nVotre inscription à CLASSE IA a bien été validée.\nVous pouvez dès maintenant vous connecter à votre Espace Étudiant.\n\nLien : ${siteUrl}/login\nMot de passe par défaut : votre numéro de téléphone`;
        sendWaSenderMessage(lead.phone, message);

        return res.status(200).json({ message: 'Compte étudiant activé avec succès', lead });
      }

      if (action === 'deactivate') {
        lead.isActive = false;
        lead.status = 'nouveau';
        await lead.save();

        return res.status(200).json({ message: 'Compte étudiant désactivé avec succès', lead });
      }

      return res.status(400).json({ message: 'Action inconnue' });
    } catch (error) {
      console.error('PUT error:', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  if (req.method === 'DELETE') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      await connectDB();
      const lead = await Lead.findByIdAndDelete(id);

      if (!lead) return res.status(404).json({ message: 'Candidat introuvable' });

      return res.status(200).json({ message: 'Compte étudiant supprimé avec succès' });
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
