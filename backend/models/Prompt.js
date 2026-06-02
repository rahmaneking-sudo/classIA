import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Prompt = mongoose.models.Prompt || mongoose.model('Prompt', promptSchema);
export default Prompt;
