import connectDB from './_lib/db.js';
import { protectAdmin } from './_lib/protect.js';
import Product from '../backend/models/Product.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectDB();
      const products = await Product.find().sort({ createdAt: -1 });
      return res.status(200).json(products);
    } catch (error) {
      console.error('Fetch products error:', error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des produits', error: error.message });
    }
  }

  if (req.method === 'POST') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      await connectDB();
      const {
        title,
        description,
        price,
        previewUrl,
        demoUrl,
        features,
        category
      } = req.body;

      const product = new Product({
        title,
        description,
        price,
        previewUrl,
        demoUrl,
        features,
        category
      });

      const createdProduct = await product.save();
      return res.status(201).json(createdProduct);
    } catch (error) {
      console.error('Create product error:', error);
      return res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      await connectDB();
      const { id } = req.query;
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }

      await Product.deleteOne({ _id: id });
      return res.status(200).json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
      console.error('Delete product error:', error);
      return res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
