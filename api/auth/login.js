import jwt from 'jsonwebtoken';
import connectDB from '../../_lib/db.js';
import Admin from '../../backend/models/Admin.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { username, password } = req.body;

  try {
    await connectDB();
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
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
