import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const agencyClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    required: true,
    enum: ['Standard', 'Premium', 'Sur-mesure'],
  },
  projectStatus: {
    type: String,
    default: 'En conception',
    enum: ['En attente', 'En conception', 'En révision', 'Terminé'],
  },
  demoUrl: {
    type: String,
    default: '',
  },
  invoiceUrl: {
    type: String,
    default: '',
  }
}, { timestamps: true });

// Hash password before saving
agencyClientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
agencyClientSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const AgencyClient = mongoose.models.AgencyClient || mongoose.model('AgencyClient', agencyClientSchema);
export default AgencyClient;
