import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  previewUrl: {
    type: String,
    required: true
  },
  demoUrl: {
    type: String,
    required: false
  },
  features: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    default: 'Site Web'
  }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
