import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from './models/Lead.js';

dotenv.config();

const removeLead = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    // Find and delete the lead with kayfess07
    const result = await Lead.deleteMany({ email: { $regex: 'kayfess07', $options: 'i' } });
    console.log(`Deleted ${result.deletedCount} leads matching kayfess07`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

removeLead();
