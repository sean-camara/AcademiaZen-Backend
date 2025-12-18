const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

/*
  POST /api/user/profile
  Update display name and profile photo
*/
router.post('/profile', auth, async (req, res) => {
  try {
    const { displayName, photo } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (typeof displayName === 'string') {
      user.displayName = displayName;
    }

    if (typeof photo === 'string') {
      user.photo = photo; // Base64 string
    }

    await user.save();

    res.json({
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      photo: user.photo
    });

  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Failed to save profile changes' });
  }
});

module.exports = router;
