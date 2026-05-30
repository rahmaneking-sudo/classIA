import bcrypt from 'bcryptjs';
import connectDB from '../../../_lib/db.js';
import { protectStudent } from '../../../_lib/protect.js';
import mongoose from 'mongoose';

const getLeadModel = async () => {
  await connectDB();
  if (mongoose.models.Lead) return mongoose.models.Lead;
  const { default: Lead } = await import('../../../backend/models/Lead.js');
  return Lead;
};

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const user = await protectStudent(req);
  if (!user) {
    return res.status(401).json({ message: 'Non autorisé' });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    const Lead = await getLeadModel();
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
  } catch (error) {
    console.error('Password change error:', error);
    return res.status(500).json({ message: 'Erreur lors du changement de mot de passe' });
  }
}
