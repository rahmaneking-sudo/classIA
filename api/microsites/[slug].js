import connectDB from '../_lib/db.js';
import MicroSite from '../../backend/models/MicroSite.js';
import { protectAdmin } from '../_lib/protect.js';
import allowCors from '../_lib/cors.js';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (allowCors(req, res)) return;
  await connectDB();
  const { slug } = req.query;

  // CONSOLIDATION FOR VERCEL 12 FUNCTIONS LIMIT
  if (slug === 'auth' && req.method === 'POST') {
    try {
      const { slug: siteSlug, pinCode } = req.body;
      if (!siteSlug || !pinCode) return res.status(400).json({ message: 'Slug et Code PIN requis.' });
      const site = await MicroSite.findOne({ slug: siteSlug });
      if (!site) return res.status(404).json({ message: 'Ce site n\'existe pas.' });
      if (site.pinCode !== pinCode) return res.status(401).json({ message: 'Code PIN incorrect.' });
      return res.status(200).json(site);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur', error: error.message });
    }
  }

  if (slug === 'forgot-pin' && req.method === 'POST') {
    try {
      const { ownerEmail } = req.body;
      if (!ownerEmail) return res.status(400).json({ message: 'Email requis.' });
      
      const cleanEmail = ownerEmail.trim();
      const safeEmailRegex = cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special chars
      const sites = await MicroSite.find({ ownerEmail: new RegExp(`^\\s*${safeEmailRegex}\\s*$`, 'i') });
      
      if (!sites || sites.length === 0) {
        return res.status(404).json({ message: 'Aucun site trouvé avec cette adresse email.' });
      }

      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return res.status(500).json({ message: 'Le service email n\'est pas configuré.' });
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      let emailHtml = `<p>Bonjour,</p><p>Voici les codes secrets (PIN) pour vos sites web CLASSIA :</p><ul>`;
      sites.forEach(site => {
        emailHtml += `<li>Site <strong>${site.businessName}</strong> (classia.com/site/${site.slug}) : <strong>${site.pinCode}</strong></li>`;
      });
      emailHtml += `</ul><p>Gardez ces informations précieusement !</p>`;

      await transporter.sendMail({
        from: `"CLASSIA Builder" <${process.env.SMTP_USER}>`,
        to: ownerEmail,
        subject: 'Récupération de vos Codes PIN - CLASSIA',
        html: emailHtml
      });

      return res.status(200).json({ message: 'Les Codes PIN ont été envoyés à votre adresse.' });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur email', error: error.message });
    }
  }

  // GET /api/microsites/:slug - Public view or Owner edit fetch
  if (req.method === 'GET') {
    try {
      const site = await MicroSite.findOne({ slug });
      if (!site) {
        return res.status(404).json({ message: 'Site non trouvé' });
      }
      return res.status(200).json(site);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }

  // PUT /api/microsites/[slug] - Edit site
  if (req.method === 'PUT') {
    try {
      const { pinCode, businessName, whatsapp, ownerEmail, address, content, themeId } = req.body;
      
      const site = await MicroSite.findOne({ slug });
      if (!site) return res.status(404).json({ message: 'Site non trouvé' });

      if (site.pinCode !== pinCode) {
        return res.status(401).json({ message: 'Code PIN incorrect' });
      }

      site.businessName = businessName || site.businessName;
      site.whatsapp = whatsapp || site.whatsapp;
      site.ownerEmail = ownerEmail || site.ownerEmail;
      site.address = address || site.address;
      site.content = content || site.content;
      site.themeId = themeId || site.themeId;

      const updatedSite = await site.save();
      return res.status(200).json(updatedSite);
    } catch (error) {
      console.error('Update microsite error:', error);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
    }
  }

  // DELETE /api/microsites/:slug - Admin deletes a site
  if (req.method === 'DELETE') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      const deletedSite = await MicroSite.findOneAndDelete({ slug });
      if (!deletedSite) {
        return res.status(404).json({ message: 'Site non trouvé' });
      }
      return res.status(200).json({ message: 'Site supprimé avec succès' });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
