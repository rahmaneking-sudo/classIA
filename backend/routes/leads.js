import express from 'express';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import Lead from '../models/Lead.js';
import { protect } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Setup Rate Limiting for Lead Creation (Anti-Spam)
const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 2, // Limit each IP to 2 requests per `window` (here, per hour)
  message: { message: "Trop de requêtes depuis cette adresse IP, veuillez réessayer plus tard." },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// Helper function to send WaSender messages
const sendWaSenderMessage = async (to, text) => {
  try {
    const apiKey = process.env.WASENDER_API_KEY;
    if (!apiKey) return;
    
    // Format the phone number (remove spaces, +, -, etc.)
    let formattedPhone = to.replace(/[\s\-\(\)\+]/g, '');
    
    // If it's a Senegalese number without country code (starts with 7 and is 9 digits)
    if (formattedPhone.startsWith('7') && formattedPhone.length === 9) {
      formattedPhone = '221' + formattedPhone;
    }
    
    await axios.post('https://www.wasenderapi.com/api/send-message', {
      to: formattedPhone,
      text
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('WaSender Error:', error.response?.data || error.message);
  }
};

// @route   POST /api/leads
// @desc    Register a new lead
// @access  Public
router.post('/', leadLimiter, async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const lead = new Lead({ name, email, phone });
    await lead.save();

    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l\'enregistrement' });
  }
});

// @route   GET /api/leads
// @desc    Get all leads
// @access  Private (Admin only)
router.get('/', protect, async (req, res) => {
  try {
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   PUT /api/leads/:id/activate
// @desc    Activate a student and set their password to their phone number
// @access  Private (Admin only)
router.put('/:id/activate', protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ message: 'Candidat introuvable' });
    }

    if (lead.isActive) {
      return res.status(400).json({ message: 'Ce compte est déjà activé' });
    }

    // Use their phone number as the initial password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(lead.phone, salt);

    lead.isActive = true;
    lead.status = 'inscrit';
    lead.password = hashedPassword;
    
    await lead.save();

    // Send WhatsApp welcome message to Student
    const message = `Bonjour ${lead.name} ! 🎉\n\nVotre inscription à CLASSE IA a bien été validée.\nVous pouvez dès maintenant vous connecter à votre Espace Étudiant pour profiter des opportunités de l'IA.\n\nLien : http://localhost:5175/login\nMot de passe par défaut : ${lead.phone}`;
    sendWaSenderMessage(lead.phone, message);

    res.json({ message: 'Compte étudiant activé avec succès', lead });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'activation' });
  }
});

// @route   PUT /api/leads/:id/deactivate
// @desc    Deactivate a student
// @access  Private (Admin only)
router.put('/:id/deactivate', protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ message: 'Candidat introuvable' });
    }

    lead.isActive = false;
    lead.status = 'nouveau';
    
    await lead.save();

    res.json({ message: 'Compte étudiant désactivé avec succès', lead });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la désactivation' });
  }
});

export default router;
