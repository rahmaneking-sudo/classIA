import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectDB from '../_lib/db.js';
import Lead from '../../backend/models/Lead.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { email, password } = req.body;

  try {
    await connectDB();
    const student = await Lead.findOne({ email });

    // Cas 1 : email inconnu → pas encore candidaté
    if (!student) {
      return res.status(401).json({ message: 'Compte étudiant introuvable' });
    }

    // Cas 2 : candidature soumise mais pas encore activée
    if (!student.isActive) {
      return res.status(401).json({ message: "Votre compte n'est pas encore activé" });
    }

    // Cas 3 : actif mais mauvais mot de passe
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
  } catch (error) {
    console.error('Student login error:', error);
    return res.status(500).json({ message: error.message || 'Erreur lors de la connexion' });
  }
}
