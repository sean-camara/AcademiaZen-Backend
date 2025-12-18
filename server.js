require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const dataRoutes = require('./routes/data');

const app = express();

// MUST be before routes (Base64 PDFs)
app.use(express.json({ limit: '50mb' }));

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://academia-zen.vercel.app'
  ],
  credentials: true
}));

// Routes
app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/data', dataRoutes);

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Health
app.get('/', (req, res) => {
  res.json({ status: 'AcademiaZen backend running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
