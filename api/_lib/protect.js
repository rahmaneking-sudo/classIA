// Middleware JWT pour Vercel Serverless Functions
// Usage: const user = await protect(req); if (!user) return res.status(401).json({...})

import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import connectDB from './db.js';

import Lead from '../../backend/models/Lead.js';
import Admin from '../../backend/models/Admin.js';

export async function protectStudent(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();
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
    await connectDB();
    const user = await Admin.findById(decoded.id).select('-password');
    return user;
  } catch {
    return null;
  }
}
