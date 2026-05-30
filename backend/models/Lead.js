import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['nouveau', 'contacté', 'inscrit'],
    default: 'nouveau',
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String, // will be populated when admin clicks "Activer"
  }
}, { timestamps: true });

const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
export default Lead;
