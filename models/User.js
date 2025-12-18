const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  // Auth
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  // Profile
  displayName: {
    type: String,
    default: ''
  },

  photo: {
    type: String, // Base64 image
    default: ''
  },

  // =====================
  // APP DATA (IMPORTANT)
  // =====================

  subjects: {
    type: [Schema.Types.Mixed], // tasks, notes, files, PDFs
    default: []
  },

  categories: {
    type: [String],
    default: []
  },

  libraryFiles: {
    type: [Schema.Types.Mixed], // Base64 PDFs
    default: []
  },

  libraryFolders: {
    type: [Schema.Types.Mixed],
    default: []
  },

  flashcards: {
    type: [Schema.Types.Mixed],
    default: []
  },

  userProfile: {
    type: Schema.Types.Mixed, // displayName + photo snapshot
    default: {}
  }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
