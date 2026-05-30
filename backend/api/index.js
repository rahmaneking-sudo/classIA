import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from '../routes/auth.js';
import leadRoutes from '../routes/leads.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Root Endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'ClassIA API is running ✅' });
});

// Connect to MongoDB (réutilise la connexion si déjà établie)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log('✅ Connected to MongoDB Atlas');
};

// Handler Vercel serverless
export default async function handler(req, res) {
  await connectDB();
  app(req, res);
}
