import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectDB from '../_lib/db.js';
import { protectStudent } from '../_lib/protect.js';
import Admin from '../../backend/models/Admin.js';
import Lead from '../../backend/models/Lead.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export default async function handler(req, res) {
  // CORS handling
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';

  try {
    await connectDB();

    // POST /api/auth/student-login
    if (req.method === 'POST' && url.includes('student-login')) {
      const { email, password } = req.body;
      const student = await Lead.findOne({ email });

      if (!student) {
        return res.status(401).json({ message: 'Compte étudiant introuvable' });
      }
      if (!student.isActive) {
        return res.status(401).json({ message: "Votre compte n'est pas encore activé" });
      }

      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }

      return res.status(200).json({
        _id: student._id,
        name: student.name,
        email: student.email,
        token: generateToken(student._id),
      });
    }

    // POST /api/auth/student-forgot-password
    if (req.method === 'POST' && url.includes('student-forgot-password')) {
      const { email } = req.body;
      const student = await Lead.findOne({ email });

      if (!student) {
        return res.status(404).json({ message: 'Aucun compte étudiant trouvé avec cet email.' });
      }

      if (!student.isActive) {
        return res.status(401).json({ message: "Votre compte n'est pas encore activé." });
      }

      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return res.status(500).json({ message: "Le service email n'est pas configuré sur le serveur." });
      }

      // Générer un mot de passe temporaire de 8 caractères
      const tempPassword = Math.random().toString(36).slice(-8);

      // Hasher et sauvegarder
      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash(tempPassword, salt);
      await student.save();

      // Envoi d'email
      const nodemailer = (await import('nodemailer')).default;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a10; color: #fff; padding: 20px; border-radius: 10px;">
          <h2 style="color: #00d4ff;">Réinitialisation de votre mot de passe</h2>
          <p>Bonjour ${student.name},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe pour la formation CLASSIA.</p>
          <p>Voici votre nouveau mot de passe temporaire :</p>
          <div style="background: #1a1a2e; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 2px; border-radius: 5px; margin: 20px 0; border: 1px solid #00d4ff;">
            <strong>${tempPassword}</strong>
          </div>
          <p>Nous vous conseillons de vous connecter dès maintenant et de le modifier dans votre tableau de bord.</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"Support CLASSIA" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Nouveau mot de passe - Formation CLASSIA',
        html: emailHtml
      });

      return res.status(200).json({ message: 'Un nouveau mot de passe a été envoyé à votre adresse email.' });
    }

    // POST /api/auth/login
    if (req.method === 'POST' && url.includes('login')) {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });

      if (admin && (await admin.matchPassword(password))) {
        return res.status(200).json({
          _id: admin._id,
          username: admin.username,
          token: generateToken(admin._id),
        });
      } else {
        return res.status(401).json({ message: 'Identifiants invalides' });
      }
    }

    // PUT /api/auth/student/change-password
    if (req.method === 'PUT' && url.includes('change-password')) {
      const user = await protectStudent(req);
      if (!user) {
        return res.status(401).json({ message: 'Non autorisé' });
      }

      const { currentPassword, newPassword } = req.body;
      const student = await Lead.findById(user._id);

      if (!student || !student.isActive) {
        return res.status(404).json({ message: 'Étudiant introuvable' });
      }

      const isMatch = await bcrypt.compare(currentPassword, student.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash(newPassword, salt);
      await student.save();

      return res.status(200).json({ message: 'Mot de passe modifié avec succès' });
    }

    return res.status(405).json({ 
      message: 'Méthode non autorisée ou chemin introuvable',
      debug: {
        method: req.method,
        url: req.url,
        query: req.query,
        pathParsed: path
      }
    });

  } catch (error) {
    console.error('Auth API error:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
