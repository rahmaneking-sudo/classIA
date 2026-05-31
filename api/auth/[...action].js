import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectDB from '../_lib/db.js';
import { protectStudent } from '../_lib/protect.js';
import Admin from '../../backend/models/Admin.js';
import Lead from '../../backend/models/Lead.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export default async function handler(req, res) {
  const { action } = req.query; // array of path segments

  const path = Array.isArray(action) ? action.join('/') : action;

  try {
    await connectDB();

    // POST /api/auth/login
    if (req.method === 'POST' && path === 'login') {
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

    // POST /api/auth/student-login
    if (req.method === 'POST' && path === 'student-login') {
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

    // PUT /api/auth/student/change-password
    if (req.method === 'PUT' && path === 'student/change-password') {
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

    return res.status(405).json({ message: 'Méthode non autorisée ou chemin introuvable' });

  } catch (error) {
    console.error('Auth API error:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
