import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cab: { type: mongoose.Schema.Types.ObjectId, ref: 'Cab', required: true },
  pickup: { type: String, required: true },
  drop: { type: String, required: true },
  distanceKm: { type: Number, required: true, min: 0 },
  fare: { type: Number, required: true, min: 0 },
  scheduledAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'confirmed',
  },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
