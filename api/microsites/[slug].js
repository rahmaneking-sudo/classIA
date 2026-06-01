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
      const { slug: siteSlug, ownerEmail } = req.body;
      if (!siteSlug || !ownerEmail) return res.status(400).json({ message: 'Slug et Email requis.' });
      const site = await MicroSite.findOne({ slug: siteSlug });
      if (!site) return res.status(404).json({ message: 'Ce site n\'existe pas.' });
      if (site.ownerEmail.toLowerCase() !== ownerEmail.toLowerCase()) return res.status(401).json({ message: 'Email invalide.' });

      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return res.status(500).json({ message: 'Le service email n\'est pas configuré.' });
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      await transporter.sendMail({
        from: `"CLASSIA Builder" <${process.env.SMTP_USER}>`,
        to: site.ownerEmail,
        subject: 'Récupération de votre Code PIN - CLASSIA',
        html: `<p>Votre site: ${site.businessName}</p><p>Votre Code PIN : <strong>${site.pinCode}</strong></p>`
      });

      return res.status(200).json({ message: 'Le Code PIN a été envoyé.' });
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
