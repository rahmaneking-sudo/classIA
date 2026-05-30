import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Delete existing admins to avoid duplicates in test mode
    await Admin.deleteMany();

    const admin = await Admin.create({
      username: 'admin',
      password: 'ClasseIA2026',
    });

    console.log('✅ Admin user created successfully');
    console.log(`Username: ${admin.username}`);
    console.log('Password: ClasseIA2026');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
