import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Simulation from '../models/Simulation.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log('Suppression de toutes les simulations...');
    await Simulation.deleteMany({});
    console.log('✅ Base de données vidée avec succès !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  });
