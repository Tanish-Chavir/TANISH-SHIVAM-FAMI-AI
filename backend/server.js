require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Company = require('./models/Company');
const Request = require('./models/Request');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/farm-marketplace';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ── SEEDING DATA ──
const seedData = async () => {
  const count = await Company.countDocuments();
  if (count === 0) {
    const initialCompanies = [
      {
        name: "AgroCorp Solutions",
        location: "Mumbai, Maharashtra",
        crops: ["soybean", "cotton", "onion"],
        priceRange: "₹4500 - ₹5200",
        minQuantity: 50,
        description: "Leading agro-processor looking for bulk quality crops.",
        contactEmail: "procure@agrocorp.com"
      },
      {
        name: "EcoHarvest Exports",
        location: "Nashik, Maharashtra",
        crops: ["tomato", "onion", "grapes"],
        priceRange: "₹1800 - ₹2800",
        minQuantity: 20,
        description: "Focusing on organic and export-grade vegetables.",
        contactEmail: "info@ecoharvest.com"
      },
      {
        name: "Global Grains Ltd.",
        location: "Indore, Madhya Pradesh",
        crops: ["soybean", "wheat", "jowar"],
        priceRange: "₹2200 - ₹3500",
        minQuantity: 100,
        description: "Bulk buyers for grain processing units across India.",
        contactEmail: "buying@globalgrains.in"
      },
      {
        name: "FreshValley Organics",
        location: "Pune, Maharashtra",
        crops: ["tomato", "onion", "soybean"],
        priceRange: "₹3000 - ₹4000",
        minQuantity: 10,
        description: "Direct supply chain for premium retail markets.",
        contactEmail: "fresh@valley.com"
      }
    ];
    await Company.insertMany(initialCompanies);
    console.log('🌱 Seeded initial company data');
  }
};
seedData();

// ── API ROUTES ──

// GET /api/companies?crop=...
app.get('/api/companies', async (req, res) => {
  try {
    const { crop } = req.query;
    let query = {};
    if (crop) {
      query.crops = { $in: [crop.toLowerCase()] };
    }
    const companies = await Company.find(query);
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sell-request
app.post('/api/sell-request', async (req, res) => {
  try {
    const { farmerName, crop, quantity, expectedPrice, location, companyId } = req.body;
    
    if (!farmerName || !crop || !quantity || !expectedPrice || !location || !companyId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRequest = new Request({
      farmerName,
      crop,
      quantity,
      expectedPrice,
      location,
      companyId,
      status: 'pending'
    });

    await newRequest.save();
    res.status(201).json({ message: "Request submitted successfully", request: newRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/requests
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await Request.find().populate('companyId', 'name').sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── START SERVER ──
app.listen(PORT, () => {
  console.log(`\n🚀 Marketplace Backend running at http://localhost:${PORT}`);
});
