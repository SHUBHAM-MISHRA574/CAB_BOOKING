import express from 'express';
import Cab from '../models/Cab.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { type, available } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (available !== undefined) filter.available = available === 'true';
    const cabs = await Cab.find(filter).sort({ type: 1, pricePerKm: 1 });
    res.json(cabs);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch cabs' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cab = await Cab.findById(req.params.id);
    if (!cab) return res.status(404).json({ message: 'Cab not found' });
    res.json(cab);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch cab' });
  }
});

export default router;
