const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected Successfully!'))
  .catch((err) => console.log('DB Connection Error:', err));

// Schema & Models Example (Placement / Daily Entries)
const placementSchema = new mongoose.Schema({
  batchId: String,
  shed: String,
  totalBirds: Number,
  placementDate: { type: Date, default: Date.now }
});
const Placement = mongoose.model('Placement', placementSchema);

// API Routes
app.get('/api/placements', async (req, res) => {
  try {
    const data = await Placement.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/placements', async (req, res) => {
  try {
    const newPlacement = new Placement(req.body);
    await newPlacement.save();
    res.status(201).json({ message: 'Batch Placed Successfully!', newPlacement });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));