import connectDB from '../_lib/db.js';
import { protectAdmin } from '../_lib/protect.js';
import AgencyClient from '../../backend/models/AgencyClient.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await connectDB();

  // GET /api/clients - Fetch all clients (Admin only)
  if (req.method === 'GET') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      const clients = await AgencyClient.find().select('-password').sort({ createdAt: -1 });
      return res.status(200).json(clients);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération des clients', error: error.message });
    }
  }

  // POST /api/clients - Create a new client (Admin only)
  if (req.method === 'POST') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      const { name, email, phone, plan, password, projectStatus, demoUrl, invoiceUrl } = req.body;

      const existingClient = await AgencyClient.findOne({ email });
      if (existingClient) {
        return res.status(400).json({ message: 'Un client avec cet email existe déjà' });
      }

      const client = new AgencyClient({
        name,
        email,
        phone,
        plan,
        password, // Pre-save hook will hash it
        projectStatus,
        demoUrl,
        invoiceUrl
      });

      await client.save();
      
      const createdClient = client.toObject();
      delete createdClient.password;

      return res.status(201).json(createdClient);
    } catch (error) {
      console.error('Create client error:', error);
      return res.status(500).json({ message: 'Erreur lors de la création du client', error: error.message });
    }
  }
  
  // PUT /api/clients - Update client status (Admin only)
  if (req.method === 'PUT') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      const { id, projectStatus, demoUrl, invoiceUrl } = req.body;
      
      const client = await AgencyClient.findById(id);
      if (!client) {
        return res.status(404).json({ message: 'Client non trouvé' });
      }

      if (projectStatus) client.projectStatus = projectStatus;
      if (demoUrl !== undefined) client.demoUrl = demoUrl;
      if (invoiceUrl !== undefined) client.invoiceUrl = invoiceUrl;

      await client.save();
      
      const updatedClient = client.toObject();
      delete updatedClient.password;

      return res.status(200).json(updatedClient);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
    }
  }
  
  // DELETE /api/clients - Delete client (Admin only)
  if (req.method === 'DELETE') {
    const admin = await protectAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Non autorisé' });

    try {
      const { id } = req.body;
      await AgencyClient.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Client supprimé' });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
