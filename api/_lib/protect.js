// Middleware JWT pour Vercel Serverless Functions
// Usage: const user = await protect(req); if (!user) return res.status(401).json({...})

import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import connectDB from './db.js';

// On réimporte les modèles ici pour éviter les problèmes de cache mongoose
const getLeadModel = async () => {
  await connectDB();
  // Réutilise le modèle si déjà défini
  if (mongoose.models.Lead) return mongoose.models.Lead;
  const { default: Lead } = await import('../../backend/models/Lead.js');
  return Lead;
};

const getAdminModel = async () => {
  await connectDB();
  if (mongoose.models.Admin) return mongoose.models.Admin;
  const { default: Admin } = await import('../../backend/models/Admin.js');
  return Admin;
};

export async function protectStudent(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const Lead = await getLeadModel();
    const user = await Lead.findById(decoded.id).select('-password');
    return user;
  } catch {
    return null;
  }
}

export async function protectAdmin(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const Admin = await getAdminModel();
    const user = await Admin.findById(decoded.id).select('-password');
    return user;
  } catch {
    return null;
  }
}
