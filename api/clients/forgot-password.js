import connectDB from '../_lib/db.js';
import AgencyClient from '../../backend/models/AgencyClient.js';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    await connectDB();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    const client = await AgencyClient.findOne({ email });
    if (!client) {
      // Pour des raisons de sécurité, on ne dit pas si le compte existe ou non.
      // Mais pour l'UX d'une plateforme de cours, il vaut souvent mieux le dire.
      return res.status(404).json({ message: 'Aucun compte trouvé avec cet email.' });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({ message: 'Le service email n\'est pas configuré sur le serveur.' });
    }

    // Générer un mot de passe temporaire de 8 caractères
    const tempPassword = Math.random().toString(36).slice(-8);

    // Mettre à jour le mot de passe (le pre-save hook dans AgencyClient va le hasher)
    client.password = tempPassword;
    await client.save();

    // Configuration de nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a10; color: #fff; padding: 20px; border-radius: 10px;">
        <h2 style="color: #00d4ff;">Réinitialisation de votre mot de passe</h2>
        <p>Bonjour ${client.name},</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe pour le portail client CLASSIA.</p>
        <p>Voici votre nouveau mot de passe temporaire :</p>
        <div style="background: #1a1a2e; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 2px; border-radius: 5px; margin: 20px 0; border: 1px solid #00d4ff;">
          <strong>${tempPassword}</strong>
        </div>
        <p>Nous vous conseillons de vous connecter dès maintenant avec ce mot de passe.</p>
        <p style="color: #888; font-size: 12px; margin-top: 40px;">Si vous n'avez pas fait cette demande, veuillez ignorer cet email.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Support CLASSIA" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Réinitialisation de votre mot de passe - CLASSIA',
      html: emailHtml
    });

    return res.status(200).json({ message: 'Un nouveau mot de passe a été envoyé à votre adresse email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Erreur lors de la réinitialisation', error: error.message });
  }
}
