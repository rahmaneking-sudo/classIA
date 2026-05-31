import connectDB from '../_lib/db.js';
import { protectAdmin } from '../_lib/protect.js';
import Product from '../../backend/models/Product.js';

export default async function handler(req, res) {
  const { id } = req.query;

  // DELETE /api/shop/:id - Supprimer un produit
  if (req.method === 'DELETE') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      await connectDB();
      const product = await Product.findById(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }

      await Product.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
      console.error('Delete product error:', error);
      return res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
