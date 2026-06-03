import connectDB from '../_lib/db.js';
import { protectAdmin } from '../_lib/protect.js';
import AgencyClient from '../../backend/models/AgencyClient.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
export default async function handler(req, res) {
  await connectDB();

  // GET /api/clients - Fetch all clients (Admin only)
  if (req.method === 'GET') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      const clients = await AgencyClient.find().select('-password').sort({ createdAt: -1 });
      return res.status(200).json(clients);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération des clients', error: error.message });
    }
  }

  // POST /api/clients - Create a new client, login or forgot-password
  if (req.method === 'POST') {
    const { action } = req.query;

    if (action === 'login') {
      try {
        const { email, password } = req.body;
        const client = await AgencyClient.findOne({ email });
        if (!client || !(await client.matchPassword(password))) {
          return res.status(401).json({ message: 'Identifiants invalides' });
        }

        const token = jwt.sign(
          { id: client._id, role: 'client' },
          process.env.JWT_SECRET || 'fallback_secret',
          { expiresIn: '30d' }
        );

        const clientData = client.toObject();
        delete clientData.password;

        return res.status(200).json({ token, client: clientData });
      } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
      }
    }

    if (action === 'forgot-password') {
      try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email requis' });

        const client = await AgencyClient.findOne({ email });
        if (!client) return res.status(404).json({ message: 'Aucun compte trouvé avec cet email.' });

        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
          return res.status(500).json({ message: 'Le service email n\\'est pas configuré sur le serveur.' });
        }

        const tempPassword = Math.random().toString(36).slice(-8);
        client.password = tempPassword;
        await client.save();

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a10; color: #fff; padding: 20px; border-radius: 10px;">
            <h2 style="color: #00d4ff;">Réinitialisation de votre mot de passe</h2>
            <p>Bonjour \${client.name},</p>
            <p>Voici votre nouveau mot de passe temporaire :</p>
            <div style="background: #1a1a2e; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 2px; border-radius: 5px; margin: 20px 0; border: 1px solid #00d4ff;">
              <strong>\${tempPassword}</strong>
            </div>
            <p>Nous vous conseillons de vous connecter dès maintenant avec ce mot de passe.</p>
          </div>
        `;

        await transporter.sendMail({
          from: \`"Support CLASSIA" <\${process.env.SMTP_USER}>\`,
          to: email,
          subject: 'Réinitialisation de votre mot de passe - CLASSIA',
          html: emailHtml
        });

        return res.status(200).json({ message: 'Un nouveau mot de passe a été envoyé à votre adresse email.' });
      } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la réinitialisation', error: error.message });
      }
    }

    // Default POST: create client
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      const { name, email, phone, plan, password, projectStatus, demoUrl, invoiceUrl } = req.body;

      const existingClient = await AgencyClient.findOne({ email });
      if (existingClient) {
        return res.status(400).json({ message: 'Un client avec cet email existe déjà' });
      }

      const client = new AgencyClient({
        name,
        email,
        phone,
        plan,
        password, // Pre-save hook will hash it
        projectStatus,
        demoUrl,
        invoiceUrl
      });

      await client.save();
      
      const createdClient = client.toObject();
      delete createdClient.password;

      return res.status(201).json(createdClient);
    } catch (error) {
      console.error('Create client error:', error);
      return res.status(500).json({ message: 'Erreur lors de la création du client', error: error.message });
    }
  }
  
  // PUT /api/clients - Update client status (Admin only)
  if (req.method === 'PUT') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      const { id, projectStatus, demoUrl, invoiceUrl } = req.body;
      
      const client = await AgencyClient.findById(id);
      if (!client) {
        return res.status(404).json({ message: 'Client non trouvé' });
      }

      if (projectStatus) client.projectStatus = projectStatus;
      if (demoUrl !== undefined) client.demoUrl = demoUrl;
      if (invoiceUrl !== undefined) client.invoiceUrl = invoiceUrl;

      await client.save();
      
      const updatedClient = client.toObject();
      delete updatedClient.password;

      return res.status(200).json(updatedClient);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
    }
  }
  
  // DELETE /api/clients - Delete client (Admin only)
  if (req.method === 'DELETE') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      const { id } = req.body;
      await AgencyClient.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Client supprimé' });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
