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
    // We store all dynamic content as a flexible JSON object
    description: String,
    heroImage: String,
    services: [{
      title: String,
      description: String,
      price: String,
      icon: String
    }],
    aboutUs: String,
    socialLinks: {
      instagram: String,
      facebook: String,
      linkedin: String
    },
    customColors: {
      primary: String,
      secondary: String
    }
  }
}, { timestamps: true });

const MicroSite = mongoose.models.MicroSite || mongoose.model('MicroSite', microSiteSchema);
export default MicroSite;
