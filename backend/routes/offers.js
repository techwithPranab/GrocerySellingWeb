const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');

// GET /api/offers - List all active offers
router.get('/', async (req, res) => {
  try {
    const currentDate = new Date();
    const offers = await Offer.find({ 
      isActive: true,
      validFrom: { $lte: currentDate },
      validUntil: { $gte: currentDate }
    })
    .sort({ createdAt: -1 })
    .limit(10);
    
    res.json({
      message: 'Offers retrieved successfully',
      offers
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch offers', error: err.message });
  }
});

// GET /api/offers/code/:code - Get offer by code
router.get('/code/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const currentDate = new Date();
    
    const offer = await Offer.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: currentDate },
      validUntil: { $gte: currentDate }
    });

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found or expired' });
    }

    res.json({
      message: 'Offer retrieved successfully',
      offer
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch offer', error: err.message });
  }
});

// GET /api/offers/:id - Get offer by ID
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.json(offer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch offer', error: err.message });
  }
});

// POST /api/offers - Create a new offer (admin only)
router.post('/', async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create offer', error: err.message });
  }
});

// PUT /api/offers/:id - Update an offer (admin only)
router.put('/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.json(offer);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update offer', error: err.message });
  }
});

// DELETE /api/offers/:id - Delete an offer (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.json({ message: 'Offer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete offer', error: err.message });
  }
});

module.exports = router;
