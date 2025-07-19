const express = require('express');
const router = express.Router();
const ConfirmedParking = require('../models/ConfirmedParking');

// POST /api/confirmed-parking
router.post('/', async (req, res) => {
  try {
    const { userId, spotId, spotName, address, latitude, longitude, duration = 3600 } = req.body;

    const confirmedAt = new Date();
    const endsAt = new Date(confirmedAt.getTime() + duration * 1000);

    const newRecord = new ConfirmedParking({
      userId,
      spotId,
      spotName,
      address,
      latitude,
      longitude,
      duration,
      confirmedAt,
      endsAt,
      isActive: true,
    });

    await newRecord.save();
    console.log(' Session saved:', newRecord);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error(' POST failed in confirmedParkingRoutes:', err);
    res.status(500).json({ error: 'Failed to save parking confirmation.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId in query params.' });
    }
    const records = await ConfirmedParking.find({ userId, isActive: false }).sort({
      confirmedAt: -1,
    });

    res.status(200).json(records);
  } catch (err) {
    console.error('GET failed in confirmedParkingRoutes:', err);
    res.status(500).json({ error: 'Failed to retrieve history.' });
  }
});

router.get('/active', async (req, res) => {
  try {
    const { userId } = req.query;

    console.log(' Received /active request for userId:', userId);

    if (!userId) {
      console.warn('⚠️ Missing userId in query');
      return res.status(400).json({ error: 'Missing userId in query params.' });
    }

    const now = new Date();
    console.log('⏱ Current time:', now.toISOString());

    const activeRecord = await ConfirmedParking.findOne({
      userId,
      isActive: true,
      endsAt: { $gt: now },
    }).sort({ confirmedAt: -1 });

    if (activeRecord) {
      console.log(' Found active session:', activeRecord);
    } else {
      console.log('🔍 No active session found for user.');
    }

    res.status(200).json(activeRecord || null);
  } catch (err) {
    console.error(' GET /active failed:', err);
    res.status(500).json({ error: 'Failed to retrieve active parking session.' });
  }
});

// PATCH /api/confirmed-parking/:id/deactivate
router.patch('/:id/deactivate', async (req, res) => {
  try {
    const sessionId = req.params.id;
    console.log('🛑 Deactivating session:', sessionId);

    const updated = await ConfirmedParking.findByIdAndUpdate(
      sessionId,
      {
        isActive: false,
        endsAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      console.warn(' No session found with ID:', sessionId);
      return res.status(404).json({ error: 'Session not found' });
    }

    console.log(' Session deactivated:', updated);
    res.status(200).json(updated);
  } catch (err) {
    console.error(' PATCH /:id/deactivate failed:', err);
    res.status(500).json({ error: 'Failed to deactivate session.' });
  }
});

module.exports = router;
