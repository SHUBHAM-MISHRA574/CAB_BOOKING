import mongoose from 'mongoose';

const cabSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['Mini', 'Sedan', 'SUV', 'Luxury'] },
  name: { type: String, required: true },
  capacity: { type: Number, required: true, min: 1, max: 6 },
  pricePerKm: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, default: '' },
  available: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Cab', cabSchema);
