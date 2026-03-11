import 'dotenv/config';
import mongoose from 'mongoose';
import Cab from '../models/Cab.js';

const UBER_RIDES_IMAGE = 'https://mobile-content.uber.com/launch-experience/top_bar_rides_3d.png';

const cabs = [
  { type: 'Mini', name: 'Mini Go', capacity: 4, pricePerKm: 12, available: true, imageUrl: UBER_RIDES_IMAGE },
  { type: 'Mini', name: 'Mini Swift', capacity: 4, pricePerKm: 14, available: true, imageUrl: UBER_RIDES_IMAGE },
  { type: 'Sedan', name: 'Sedan Comfort', capacity: 4, pricePerKm: 18, available: true, imageUrl: UBER_RIDES_IMAGE },
  { type: 'Sedan', name: 'Sedan Prime', capacity: 4, pricePerKm: 22, available: true, imageUrl: UBER_RIDES_IMAGE },
  { type: 'SUV', name: 'SUV Family', capacity: 6, pricePerKm: 28, available: true, imageUrl: UBER_RIDES_IMAGE },
  { type: 'Luxury', name: 'Luxury Elite', capacity: 4, pricePerKm: 45, available: true, imageUrl: UBER_RIDES_IMAGE },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Cab.deleteMany({});
  await Cab.insertMany(cabs);
  console.log('Cabs seeded:', cabs.length);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
