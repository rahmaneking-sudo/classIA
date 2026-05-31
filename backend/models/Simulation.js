import mongoose from 'mongoose';

const simulationSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  mediaUrl: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    required: true,
    enum: ['image', 'video', 'youtube'],
    default: 'youtube'
  },
  explanation: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Simulation = mongoose.models.Simulation || mongoose.model('Simulation', simulationSchema);
export default Simulation;
