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

  let actionParams = req.query.action;

  // Sur Vercel, action peut être une string "id/activate"
  if (typeof actionParams === 'string') {
    actionParams = actionParams.split('/');
  }

  if (!Array.isArray(actionParams) || actionParams.length !== 2) {
    return res.status(404).json({ message: 'Ressource introuvable' });
  }

  const [id, methodAction] = actionParams;

  // PUT /api/leads/[id]/activate
  if (req.method === 'PUT' && methodAction === 'activate') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      await connectDB();
      const lead = await Lead.findById(id);

      if (!lead) return res.status(404).json({ message: 'Candidat introuvable' });
      if (lead.isActive) return res.status(400).json({ message: 'Ce compte est déjà activé' });

      const salt = await bcrypt.genSalt(10);
      lead.password = await bcrypt.hash(lead.phone, salt);
      lead.isActive = true;
      lead.status = 'inscrit';
      await lead.save();

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VITE_SITE_URL || 'https://classia.vercel.app';
      const message = `Bonjour ${lead.name} ! 🎉\n\nVotre inscription à CLASSE IA a bien été validée.\nVous pouvez dès maintenant vous connecter à votre Espace Étudiant.\n\nLien : ${siteUrl}/login\nMot de passe par défaut : votre numéro de téléphone`;
      sendWaSenderMessage(lead.phone, message);

      return res.status(200).json({ message: 'Compte étudiant activé avec succès', lead });
    } catch (error) {
      console.error('Activate error:', error);
      return res.status(500).json({ message: "Erreur lors de l'activation" });
    }
  }

  // PUT /api/leads/[id]/deactivate
  if (req.method === 'PUT' && methodAction === 'deactivate') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      await connectDB();
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
  // DELETE /api/leads/[id]/delete
  if (req.method === 'DELETE' && methodAction === 'delete') {
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
