require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. Allow large files (PDFs) up to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// 2. Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Backend connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 3. Define Data Structure
const DataSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    subjects: { type: Array, default: [] },
    categories: { type: Array, default: [] },
    libraryFiles: { type: Array, default: [] },
    flashcards: { type: Array, default: [] },
    lastUpdated: { type: Date, default: Date.now }
});
const UserData = mongoose.model('UserData', DataSchema);

// 4. API Routes

// GET Data
app.get('/api/data/:userId', async (req, res) => {
    try {
        const data = await UserData.findOne({ userId: req.params.userId });
        if (!data) return res.json({}); // Return empty if new user
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SAVE Data
app.post('/api/data', async (req, res) => {
    try {
        const { userId, subjects, categories, libraryFiles, flashcards } = req.body;
        const updated = await UserData.findOneAndUpdate(
            { userId },
            { subjects, categories, libraryFiles, flashcards, lastUpdated: Date.now() },
            { new: true, upsert: true } // Create if doesn't exist
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Save failed" });
    }
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));