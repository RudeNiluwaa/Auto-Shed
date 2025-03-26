import mongoose from 'mongoose';

const presentationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  presenter: { type: String, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Confirmed, Cancelled
  user: {type : mongoose.Schema.Types.ObjectId, ref : 'User'}
});

export default mongoose.model('Presentation', presentationSchema);
