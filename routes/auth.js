const express = require('express');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebaseAdmin');
const User = require('../models/User');

const router = express.Router();

/*
  POST /auth/firebase-login
*/
router.post('/firebase-login', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Missing Firebase ID token' });
    }

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);

    if (!decoded.email_verified) {
      return res.status(403).json({ message: 'Email not verified' });
    }

    const { uid, email, name, picture } = decoded;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // First login → create user
      user = await User.create({
        firebaseUid: uid,
        email,
        displayName: name || '',
        photo: picture || ''
      });
    }

    // 🔽 IMPORTANT:
    // Return DB values (custom name/photo override Firebase defaults)
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        photo: user.photo
      }
    });

  } catch (err) {
    console.error('Firebase login error:', err);
    res.status(401).json({ message: 'Invalid Firebase token' });
  }
});

module.exports = router;
