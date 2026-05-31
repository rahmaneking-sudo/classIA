import connectDB from '../_lib/db.js';
import AgencyClient from '../../backend/models/AgencyClient.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  await connectDB();

  try {
    const { email, password } = req.body;

    const client = await AgencyClient.findOne({ email });
    if (!client) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const isMatch = await client.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: client._id, role: 'client' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '30d' }
    );

    const clientData = client.toObject();
    delete clientData.password;

    return res.status(200).json({
      token,
      client: clientData
    });

  } catch (error) {
    console.error('Client login error:', error);
    return res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
  }
}
