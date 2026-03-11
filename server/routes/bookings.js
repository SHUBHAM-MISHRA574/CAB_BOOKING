import express from 'express';
import Booking from '../models/Booking.js';
import Cab from '../models/Cab.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', async (req, res) => {
  try {
    const { cabId, pickup, drop, distanceKm, scheduledAt } = req.body;
    if (!cabId || !pickup || !drop || distanceKm == null || !scheduledAt) {
      return res.status(400).json({
        message: 'cabId, pickup, drop, distanceKm and scheduledAt are required',
      });
    }
    const cab = await Cab.findById(cabId);
    if (!cab) return res.status(404).json({ message: 'Cab not found' });
    const fare = Math.round(cab.pricePerKm * Number(distanceKm));
    const booking = await Booking.create({
      user: req.user._id,
      cab: cabId,
      pickup,
      drop,
      distanceKm: Number(distanceKm),
      fare,
      scheduledAt: new Date(scheduledAt),
    });
    await booking.populate('cab', 'type name pricePerKm');
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Booking failed' });
  }
});

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('cab', 'type name pricePerKm')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch bookings' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('cab', 'type name pricePerKm');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch booking' });
  }
});

router.patch('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Already cancelled' });
    }
    booking.status = 'cancelled';
    await booking.save();
    await booking.populate('cab', 'type name pricePerKm');
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Cancel failed' });
  }
});

export default router;
