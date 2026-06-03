import connectDB from '../_lib/db.js';
import { protectAdmin } from '../_lib/protect.js';
import MicroSite from '../../backend/models/MicroSite.js';
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
      const { slug, businessName, ownerEmail, whatsapp, address, themeId, tier, content } = req.body;

      // Check if slug already exists
      const existing = await MicroSite.findOne({ slug });
      if (existing) {
        return res.status(400).json({ message: 'Ce nom de lien (slug) est déjà utilisé. Veuillez en choisir un autre.' });
      }

      // Generate a random 4-digit pin
      const pinCode = Math.floor(1000 + Math.random() * 9000).toString();

      const newSite = new MicroSite({
        slug,
        businessName,
        ownerEmail,
        whatsapp,
        address,
        themeId,
        tier,
        content,
        pinCode,
        isActive: false // By default, pending payment
      });

      const savedSite = await newSite.save();
      return res.status(201).json({ ...savedSite.toObject(), pinCode });
    } catch (error) {
      console.error('Create microsite error:', error);
      return res.status(500).json({ message: 'Erreur lors de la création du site', error: error.message });
    }
  }

  // PUT /api/microsites - Admin activates a microsite (moved here to avoid Vercel conflict with [slug].js)
  if (req.method === 'PUT') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ message: 'ID manquant' });

      const site = await MicroSite.findById(id);
      
      if (!site) {
        return res.status(404).json({ message: 'Site non trouvé' });
      }

      // Toggle activation status
      site.isActive = !site.isActive;
      await site.save();

      if (site.isActive && site.whatsapp) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VITE_SITE_URL || 'https://classia.vercel.app';
        const message = `Bonjour ! 🎉\n\nVotre site web "${site.businessName}" vient d'être activé avec succès suite à la validation de votre paiement.\nVous pouvez le consulter dès maintenant et utiliser votre code PIN secret pour le modifier.\n\nLien du site : ${siteUrl}/site/${site.slug}\n\nMerci de votre confiance en CLASSE IA.`;
        sendWaSenderMessage(site.whatsapp, message);
      }

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
