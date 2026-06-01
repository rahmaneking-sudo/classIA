import mongoose from 'mongoose';

const microSiteSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  businessName: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
    default: '0000'
  },
  ownerEmail: {
    type: String,
    required: true,
  },
  whatsapp: {
    type: String,
    required: true,
  },
  themeId: {
    type: String,
    required: true, // e.g., 'basic-dark', 'standard-minimal', 'premium-3d'
  },
  tier: {
    type: String,
    required: true,
    enum: ['Basique', 'Standard', 'Premium'],
  },
  isActive: {
    type: Boolean,
    default: false, // Remains false until admin receives payment and activates it
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

const MicroSite = mongoose.models.MicroSite || mongoose.model('MicroSite', microSiteSchema);
export default MicroSite;
