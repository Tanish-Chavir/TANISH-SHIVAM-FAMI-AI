require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Company = require('./models/Company');
const Request = require('./models/Request');
const Market = require('./models/Market');
const { MARKETPLACES } = require('./marketplaces-data');

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/farm-marketplace';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ── SEEDING DATA ──
const seedData = async () => {
  try {
    // Seed Companies
    const companyCount = await Company.countDocuments();
    if (companyCount === 0) {
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
          name: "Pune Agri Processor",
          location: "Pune, Maharashtra",
          crops: ["soybean", "wheat", "onion", "tomato"],
          priceRange: "₹2500 - ₹4500",
          minQuantity: 15,
          description: "Local Pune buyer looking for direct farm supply.",
          contactEmail: "pune@agri.in"
        },
        {
          name: "Sahyadri Farmers",
          location: "Pune, Maharashtra",
          crops: ["grapes", "tomato", "pomegranate"],
          priceRange: "₹5000 - ₹8000",
          minQuantity: 30,
          description: "Specialized in fruit procurement for export.",
          contactEmail: "sahyadri@farmers.co.in"
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

    // Seed Markets
    const marketCount = await Market.countDocuments();
    if (marketCount === 0) {
      await Market.insertMany(MARKETPLACES);
      console.log('🌱 Seeded market data into MongoDB');
    }
  } catch (err) {
    console.error('Seeding Error:', err);
  }
};
seedData();

// Distance Utility (Haversine Formula)
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return Math.round(R * c * 10) / 10;
}

// ── API ROUTES ──

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// GET /api/companies?crop=...
app.get('/api/companies', async (req, res) => {
  try {
    const { crop } = req.query;
    let query = {};
    if (crop) {
      query.crops = { $in: [crop.toLowerCase()] };
    }
    const companies = await Company.find(query).lean();
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

// ── TRADER AUTH ROUTES ──

// POST /api/trader/register
app.post('/api/trader/register', async (req, res) => {
  try {
    const { name, email, password, location, crops, description, contactEmail, gstNumber } = req.body;
    
    // Check if trader already exists
    const existing = await Company.findOne({ email });
    if (existing) return res.status(400).json({ error: "Trader with this email already exists" });

    const trader = new Company({
      name,
      email,
      password,
      location,
      crops,
      description,
      contactEmail,
      gstNumber,
      verificationStatus: 'pending'
    });

    await trader.save();
    
    const token = jwt.sign({ id: trader._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: "Registration successful. Verification pending.", token, trader });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/trader/login
app.post('/api/trader/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const trader = await Company.findOne({ email });
    if (!trader) return res.status(404).json({ error: "Trader not found" });

    const isMatch = await trader.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: trader._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, trader });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADDITIONAL AGRI ROUTES ──

// GET /api/nearby-markets
app.get('/api/nearby-markets', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'lat/lng required' });
    
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    
    // Fetch all markets from MongoDB
    const markets = await Market.find();
    
    const nearby = markets.map(m => {
      const distance = getDistanceKm(userLat, userLng, m.lat, m.lng);
      
      // Simulate live prices for the crops
      const livePrices = m.crops.map(crop => ({
        crop,
        price: 1500 + Math.floor(Math.random() * 2000), // Random price between 1500 and 3500
        trend: Math.random() > 0.5 ? 'up' : 'down'
      }));

      return { ...m._doc, distance, livePrices };
    })
    .filter(m => m.distance <= parseFloat(radius))
    .sort((a, b) => a.distance - b.distance);
    
    res.json({ markets: nearby });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/weather
app.get('/api/weather', (req, res) => {
  res.json({
    temp: 28 + Math.floor(Math.random() * 5),
    humidity: 60 + Math.floor(Math.random() * 20),
    condition: 'Partly Cloudy'
  });
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

// ── AI ASSISTANT ROUTES ──

// POST /api/ai/chat
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history, language = 'English' } = req.body;
    
    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const promptWithLanguage = `[Selected Language: ${language}] Respond to the following message in the specified language: ${message}`;
    const result = await chat.sendMessage(promptWithLanguage);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (err) {
    console.error('AI Chat Error:', err);
    res.status(500).json({ error: "AI Assistant is currently unavailable." });
  }
});

// POST /api/ai/scan
app.post('/api/ai/scan', async (req, res) => {
  try {
    const { image, language = 'English' } = req.body; // base64 string
    if (!image) return res.status(400).json({ error: "Image is required" });

    // Extract base64 data
    const base64Data = image.split(',')[1];
    
    const prompt = `Analyze this crop image and provide:
    1. Disease Name (if any)
    2. Confidence Level
    3. Detailed Treatment Steps (bullet points)
    
    CRITICAL: You MUST provide all text descriptions in the following language: ${language}.
    
    Format as JSON: { "disease": "...", "confidence": "...", "treatment": ["...", "..."] }
    If no disease is found, indicate "Healthy" (translated) and provide general maintenance tips.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean JSON from response (sometimes Gemini wraps it in code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const resultJson = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse AI response" };

    res.json(resultJson);
  } catch (err) {
    console.error('AI Scan Error:', err);
    res.status(500).json({ error: "Image analysis failed." });
  }
});

// ── START SERVER ──
app.listen(PORT, () => {
  console.log(`\n🚀 Marketplace Backend running at http://localhost:${PORT}`);
});
