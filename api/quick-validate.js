import bcrypt from 'bcryptjs';
import axios from 'axios';
import connectDB from './_lib/db.js';
import Lead from '../backend/models/Lead.js';
import MicroSite from '../backend/models/MicroSite.js';

// Helper WaSender
const sendWaSenderMessage = async (to, text) => {
  try {
    const apiKey = process.env.WASENDER_API_KEY;
    if (!apiKey) return;

    let formattedPhone = to.replace(/[\s\-\(\)\+]/g, '');
    if (formattedPhone.startsWith('7') && formattedPhone.length === 9) {
      formattedPhone = '221' + formattedPhone;
    }

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
  if (req.method !== 'GET') {
    return res.status(405).send('Méthode non autorisée');
  }

  const { type, id, token } = req.query;

  // Sécurité: vérifier que le token correspond bien au bot Telegram configuré
  if (token !== process.env.TELEGRAM_BOT_TOKEN) {
    return res.status(401).send(`
      <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
        <h1 style="color: red;">❌ Accès refusé</h1>
        <p>Lien invalide ou expiré.</p>
      </div>
    `);
  }

  if (!id) {
    return res.status(400).send('ID manquant');
  }

  try {
    await connectDB();
    const siteDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'classia-eight.vercel.app';
    const siteUrl = siteDomain.startsWith('http') ? siteDomain : `https://${siteDomain}`;

    if (type === 'course') {
      const lead = await Lead.findById(id);
      if (!lead) return res.status(404).send('Étudiant introuvable');
      
      if (lead.isActive) {
        return res.status(200).send(`
          <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
            <h1 style="color: #ea580c;">⚠️ Déjà activé</h1>
            <p>Cet étudiant a déjà été validé.</p>
          </div>
        `);
      }

      // Activation
      const salt = await bcrypt.genSalt(10);
      lead.password = await bcrypt.hash(lead.phone, salt);
      lead.isActive = true;
      lead.status = 'inscrit';
      await lead.save();

      // Envoi du message WhatsApp
      const message = `Bonjour ${lead.name} ! 🎉\n\nVotre inscription à CLASSE IA a bien été validée.\nVous pouvez dès maintenant vous connecter à votre Espace Étudiant.\n\nLien : ${siteUrl}/login\nMot de passe par défaut : votre numéro de téléphone`;
      await sendWaSenderMessage(lead.phone, message);

      return res.status(200).send(`
        <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
          <h1 style="color: #16a34a;">✅ Étudiant Validé !</h1>
          <p>Le compte de <b>${lead.name}</b> a été activé et le message WhatsApp a été envoyé avec succès.</p>
        </div>
      `);

    } else if (type === 'site') {
      const site = await MicroSite.findById(id);
      if (!site) return res.status(404).send('Site introuvable');

      if (site.isActive) {
        return res.status(200).send(`
          <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
            <h1 style="color: #ea580c;">⚠️ Déjà activé</h1>
            <p>Ce site web a déjà été validé.</p>
          </div>
        `);
      }

      // Activation
      site.isActive = true;
      await site.save();

      if (site.whatsapp) {
        const message = `Bonjour ! 🎉\n\nVotre site web "${site.businessName}" vient d'être activé avec succès suite à la validation de votre paiement.\nVous pouvez le consulter dès maintenant et utiliser votre code PIN secret pour le modifier.\n\nLien du site : ${siteUrl}/site/${site.slug}\n\nMerci de votre confiance en CLASSE IA.`;
        await sendWaSenderMessage(site.whatsapp, message);
      }

      return res.status(200).send(`
        <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
          <h1 style="color: #16a34a;">✅ Site Web Validé !</h1>
          <p>Le site <b>${site.businessName}</b> a été activé et le code PIN a été envoyé sur WhatsApp avec succès.</p>
        </div>
      `);
    } else {
      return res.status(400).send('Type inconnu');
    }

  } catch (error) {
    console.error('Erreur lors de la validation rapide:', error);
    return res.status(500).send(`
      <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
        <h1 style="color: red;">❌ Erreur Serveur</h1>
        <p>Impossible de valider en raison d'une erreur interne.</p>
      </div>
    `);
  }
}
