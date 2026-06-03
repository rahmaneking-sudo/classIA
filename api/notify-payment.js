import axios from 'axios';
import allowCors from './_lib/cors.js';

export default async function handler(req, res) {
  if (allowCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { type, id, name, identifier, amount } = req.body;

  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn("TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID manquants dans .env");
      // On retourne un succès quand même pour ne pas bloquer l'utilisateur côté frontend
      return res.status(200).json({ message: 'Paiement notifié (simulation, Telegram non configuré)' });
    }

    let messageText = `🟢 *NOUVEAU PAIEMENT REÇU* 🟢\n\n`;
    
    const siteDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'classia-eight.vercel.app';
    const siteUrl = siteDomain.startsWith('http') ? siteDomain : `https://${siteDomain}`;
    const validationUrl = `${siteUrl}/api/quick-validate?type=${type}&id=${id}&token=${botToken}`;

    if (type === 'course') {
      messageText += `*Type:* Inscription Étudiant (Formation IA)\n`;
      messageText += `*Nom:* ${name}\n`;
      messageText += `*Email/Tel:* ${identifier}\n`;
      messageText += `*Montant:* ${amount} FCFA\n\n`;
      messageText += `✅ *[VALIDER CET ÉTUDIANT](${validationUrl})*\n\n`;
      messageText += `_Cliquez sur le lien pour l'activer automatiquement et lui envoyer son accès par WhatsApp._`;
    } else if (type === 'site') {
      messageText += `*Type:* Création de Site Web\n`;
      messageText += `*Nom/Business:* ${name}\n`;
      messageText += `*Slug:* ${identifier}\n`;
      messageText += `*Montant:* ${amount} FCFA\n\n`;
      messageText += `✅ *[VALIDER CE SITE](${validationUrl})*\n\n`;
      messageText += `_Cliquez sur le lien pour l'activer automatiquement et envoyer le code PIN par WhatsApp._`;
    } else {
      messageText += `Détails: ${name} - ${identifier} (${amount} FCFA)`;
    }

    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: messageText,
      parse_mode: 'Markdown'
    });

    return res.status(200).json({ message: 'Notification envoyée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la notification Telegram:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Erreur serveur lors de la notification' });
  }
}
