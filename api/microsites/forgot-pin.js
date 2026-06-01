import connectDB from '../_lib/db.js';
import MicroSite from '../../backend/models/MicroSite.js';
import allowCors from '../_lib/cors.js';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (allowCors(req, res)) return;
  await connectDB();

  if (req.method === 'POST') {
    try {
      const { slug, ownerEmail } = req.body;

      if (!slug || !ownerEmail) {
        return res.status(400).json({ message: 'Slug et Email requis.' });
      }

      const site = await MicroSite.findOne({ slug });

      if (!site) {
        return res.status(404).json({ message: 'Ce site n\'existe pas.' });
      }

      if (site.ownerEmail.toLowerCase() !== ownerEmail.toLowerCase()) {
        return res.status(401).json({ message: 'L\'email ne correspond pas au propriétaire de ce site.' });
      }

      // If SMTP is not configured, we cannot send the email
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return res.status(500).json({ 
          message: 'Le service email n\'est pas configuré sur le serveur (SMTP_USER / SMTP_PASS manquants).' 
        });
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"CLASSIA Builder" <${process.env.SMTP_USER}>`,
        to: site.ownerEmail,
        subject: 'Récupération de votre Code PIN - CLASSIA',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a10; color: #fff; padding: 30px; border-radius: 10px; border: 1px solid #7b2ff7;">
            <h2 style="color: #00d4ff; text-transform: uppercase; letter-spacing: 2px;">Votre Code PIN CLASSIA</h2>
            <p style="color: #ccc; font-size: 16px;">Bonjour,</p>
            <p style="color: #ccc; font-size: 16px;">Vous avez demandé la récupération du Code PIN secret pour modifier votre site <strong>${site.businessName}</strong> (classia.com/site/${site.slug}).</p>
            
            <div style="background-color: rgba(186,85,211,0.1); padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center; border: 1px dashed rgba(186,85,211,0.5);">
              <p style="margin: 0; color: #888; font-size: 14px;">Votre Code PIN :</p>
              <h1 style="color: #7b2ff7; font-size: 48px; letter-spacing: 10px; margin: 10px 0;">${site.pinCode}</h1>
            </div>

            <p style="color: #ccc; font-size: 14px;">Gardez ce code secret. Il vous permettra de vous connecter et de mettre à jour le contenu de votre site.</p>
            <p style="color: #888; font-size: 12px; margin-top: 40px;">L'équipe CLASSIA.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({ message: 'Le Code PIN a été envoyé à votre adresse email avec succès.' });
    } catch (error) {
      console.error('Forgot PIN error:', error);
      return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
