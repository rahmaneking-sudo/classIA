import connectDB from './_lib/db.js';
import { protectAdmin } from './_lib/protect.js';
import Prompt from '../backend/models/Prompt.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectDB();
      const prompts = await Prompt.find().sort({ createdAt: -1 });
      return res.status(200).json(prompts);
    } catch (error) {
      console.error('Fetch prompts error:', error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des prompts', error: error.message });
    }
  }

  if (req.method === 'POST') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      await connectDB();
      const { title, category, content, explanation, imageUrl } = req.body;

      const newPrompt = new Prompt({
        title,
        category,
        content,
        explanation,
        imageUrl
      });

      const savedPrompt = await newPrompt.save();
      return res.status(201).json(savedPrompt);
    } catch (error) {
      console.error('Create prompt error:', error);
      return res.status(500).json({ message: 'Erreur lors de la création du prompt', error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      await connectDB();
      const { id } = req.query;
      const deletedPrompt = await Prompt.findByIdAndDelete(id);
      
      if (!deletedPrompt) {
        return res.status(404).json({ message: 'Prompt non trouvé' });
      }

      return res.status(200).json({ message: 'Prompt supprimé' });
    } catch (error) {
      console.error('Delete prompt error:', error);
      return res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
