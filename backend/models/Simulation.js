import mongoose from 'mongoose';

const simulationSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['gemini', 'kling', 'claude']
  },
  title: {
    type: String,
    required: true
  },
  badPrompt: {
    type: String,
    required: true
  },
  badMediaUrl: {
    type: String,
    required: true
  },
  badMediaType: {
    type: String,
    required: true,
    enum: ['image', 'video', 'youtube'],
    default: 'image'
  },
  goodPrompt: {
    type: String,
    required: true
  },
  goodMediaUrl: {
    type: String,
    required: true
  },
  goodMediaType: {
    type: String,
    required: true,
    enum: ['image', 'video', 'youtube'],
    default: 'image'
  },
  explanation: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Simulation = mongoose.models.Simulation || mongoose.model('Simulation', simulationSchema);
export default Simulation;
