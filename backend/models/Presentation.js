import mongoose from 'mongoose';

const presentationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  presenter: { type: String, required: true },
  timeSlot: { type: String, required: true },
  date: { type: Date, required: true }, 
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Cancelled'], 
    default: 'Pending' 
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  examiner: { type: mongoose.Schema.Types.ObjectId, ref: 'examiner', required: true }, 
  moduleCode: { type: String, required: true }, 
});

export default mongoose.model('Presentation', presentationSchema);
