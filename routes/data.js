const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

/*
  GET /api/data
  Load all persisted user data
*/
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      subjects: user.subjects || [],
      categories: user.categories || [],
      libraryFiles: user.libraryFiles || [],
      libraryFolders: user.libraryFolders || [],
      flashcards: user.flashcards || [],
      userProfile: user.userProfile || {
        displayName: user.displayName,
        photo: user.photo
      }
    });

  } catch (err) {
    console.error('Load data error:', err);
    res.status(500).json({ message: 'Failed to load user data' });
  }
});

/*
  POST /api/data
  Persist all frontend state
*/
router.post('/', auth, async (req, res) => {
  try {
    const {
      subjects = [],
      categories = [],
      libraryFiles = [],
      libraryFolders = [],
      flashcards = [],
      userProfile = {}
    } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Persist everything
    user.subjects = subjects;
    user.categories = categories;
    user.libraryFiles = libraryFiles;
    user.libraryFolders = libraryFolders;
    user.flashcards = flashcards;
    user.userProfile = userProfile;

    // Keep profile fields in sync
    if (userProfile.displayName) {
      user.displayName = userProfile.displayName;
    }
    if (userProfile.photo) {
      user.photo = userProfile.photo;
    }

    await user.save();

    res.json({ success: true });

  } catch (err) {
    console.error('Save data error:', err);
    res.status(500).json({ message: 'Failed to save user data' });
  }
});

module.exports = router;
