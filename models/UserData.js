const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },

  subjects: {
    type: Array,
    default: []
  },

  categories: {
    type: Array,
    default: []
  },

  libraryFiles: {
    type: Array,
    default: []
  },

  flashcards: {
    type: Array,
    default: []
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserData', UserDataSchema);
