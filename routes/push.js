const express = require('express');
const router = express.Router();
const admin = require('../config/firebaseAdmin');
const PushToken = require('../models/PushToken');
const auth = require('../middleware/auth');

/*
  REGISTER DEVICE TOKEN
*/
router.post('/register', auth, async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Missing token' });
    }

    await PushToken.findOneAndUpdate(
      { token },
      { userId: req.userId },
      { upsert: true }
    );

    console.log('✅ Push token registered for user:', req.userId);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to register token' });
  }
});

/*
  TEST PUSH NOTIFICATION
*/
router.post('/test', auth, async (req, res) => {
  try {
    const records = await PushToken.find({ userId: req.userId });

    if (!records.length) {
      return res.status(404).json({ message: 'No push tokens found' });
    }

    const tokens = records.map(r => r.token);

    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: '🚀 Test Notification',
        body: 'Your backend push notification works!'
      },
      webpush: {
        fcmOptions: {
          link: '/'
        }
      }
    });

    res.json({
      success: true,
      sent: response.successCount,
      failed: response.failureCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Push send failed' });
  }
});

module.exports = router;
