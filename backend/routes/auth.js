import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import Lead from '../models/Lead.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/login
// @desc    Auth admin & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Identifiants invalides' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/auth/student-login
// @desc    Auth student & get token
// @access  Public
router.post('/student-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Lead.findOne({ email });

    // Case 1: No account found → they haven't applied yet
    if (!student) {
      return res.status(401).json({ message: 'Compte étudiant introuvable' });
    }

    // Case 2: Account found but not activated yet by admin
    if (!student.isActive) {
      return res.status(401).json({ message: 'Votre compte n\'est pas encore activé' });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (isMatch) {
      res.json({
        _id: student._id,
        name: student.name,
        email: student.email,
        token: generateToken(student._id),
      });
    } else {
      // Case 3: Account exists, is active, but wrong password
      res.status(401).json({ message: 'Mot de passe incorrect' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// @route   PUT /api/auth/student/change-password
// @desc    Change student password
// @access  Private (Student)
router.put('/student/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const student = await Lead.findById(req.user._id);

    if (!student || !student.isActive) {
      return res.status(404).json({ message: 'Étudiant introuvable' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(newPassword, salt);
    
    await student.save();

    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Erreur lors du changement de mot de passe' });
  }
});

export default router;
