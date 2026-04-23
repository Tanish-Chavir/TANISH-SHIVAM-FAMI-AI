// ============================================
// FARM AI BUILDER — Express Backend Server
// Nearby Markets & Live Prices API
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { MARKETPLACES } = require('./marketplaces-data');
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');
const mongoose = require('mongoose');
const Company = require('./models/Company');
const Request = require('./models/Request');

const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/farm-marketplace';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB (Marketplace)'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ── SEED MARKETPLACE DATA ──
const seedMarketplaceData = async () => {
  try {
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
      console.log('🌱 Seeded initial marketplace company data');
    }
  } catch (err) {
    console.warn('⚠️ Seeding failed:', err.message);
  }
};
seedMarketplaceData();

// ── In-Memory Cache ──
const cache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const entry = cache[key];
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  return null;
}

function setCache(key, data) {
  cache[key] = { data, timestamp: Date.now() };
}

// ── Haversine Distance (km) ──
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// ── Simulated Live Prices ──
const BASE_PRICES = {
  "Rice": 2183, "Wheat": 2275, "Maize": 2090, "Bajra": 2500, "Jowar": 3180,
  "Ragi": 3846, "Gram": 5440, "Mustard": 5650, "Soybean": 4600, "Cotton": 6620,
  "Sugarcane": 315, "Groundnut": 6377, "Onion": 1800, "Potato": 1200,
  "Tomato": 2500, "Banana": 2200, "Mango": 4500, "Apple": 12000,
  "Coconut": 2800, "Tea": 22000, "Coffee": 28000, "Turmeric": 15000,
  "Ginger": 18000, "Chilli": 12500, "Cumin": 32000, "Cardamom": 125000,
  "Pepper": 65000, "Rubber": 17500, "Jute": 5050, "Tobacco": 6500,
  "Castor": 6540, "Sunflower": 6760, "Barley": 1735, "Lentil": 6425,
  "Vegetables": 2800, "Fruits": 5500, "Flowers": 8500, "Spices": 15000,
  "Grains": 2400, "Pulses": 6200, "Oilseeds": 5800, "Fish": 22000,
  "Fennel": 14000, "Ajwain": 18000, "Isabgol": 12000, "Cashew": 85000,
  "Guava": 3500, "Litchi": 8000, "Pineapple": 3200, "Grapes": 8500,
  "Orange": 4000, "Basmati Rice": 3800, "Basmati": 3800, "Guar": 5500,
  "Moth": 7200, "Coriander": 8500, "Garlic": 6800, "Raisins": 18000,
  "Tapioca": 2800, "Jaggery": 4200, "Opium": 95000, "Organic Produce": 6500,
  "Stone Fruits": 9000, "Pomegranate": 11000, "Sapota": 4200, "Jackfruit": 3000,
  "Red Gram": 7000, "Black Gram": 6950, "Moong": 8558, "Safflower": 5700,
  "Arecanut": 55000, "Date Palm": 8500, "Oil Palm": 12000
};

function generateLivePrices(crops) {
  const now = new Date();
  return crops.map(crop => {
    const basePrice = BASE_PRICES[crop] || 3000;
    // Add small random variance ±8%
    const variance = basePrice * (Math.random() * 0.16 - 0.08);
    const price = Math.round(basePrice + variance);
    const change = ((price - basePrice) / basePrice * 100).toFixed(1);
    const trend = change > 1 ? 'up' : change < -1 ? 'down' : 'stable';

    // Random "last updated" within last 2 hours
    const updatedAt = new Date(now.getTime() - Math.random() * 7200000);

    return {
      crop,
      price,
      unit: '₹/quintal',
      trend,
      change: (change >= 0 ? '+' : '') + change + '%',
      lastUpdated: updatedAt.toISOString()
    };
  });
}

// ══════════════════════════════════════════
//  API ROUTES
// ══════════════════════════════════════════

// GET /api/nearby-markets
app.get('/api/nearby-markets', (req, res) => {
  const { lat, lng, radius = 100 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      status: 'error',
      message: 'lat and lng query parameters are required'
    });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const maxRadius = parseFloat(radius);

  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid lat/lng values'
    });
  }

  // Check cache
  const cacheKey = `markets_${userLat.toFixed(2)}_${userLng.toFixed(2)}_${maxRadius}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  // Calculate distances and filter
  const marketsWithDistance = MARKETPLACES
    .map(market => {
      const distance = haversineDistance(userLat, userLng, market.lat, market.lng);
      return { ...market, distance: Math.round(distance * 10) / 10 };
    })
    .filter(m => m.distance <= maxRadius)
    .sort((a, b) => a.distance - b.distance);

  const result = {
    status: 'ok',
    userLocation: { lat: userLat, lng: userLng },
    radius: maxRadius,
    total: marketsWithDistance.length,
    markets: marketsWithDistance,
    timestamp: new Date().toISOString()
  };

  setCache(cacheKey, result);
  res.json(result);
});

// GET /api/live-prices
app.get('/api/live-prices', (req, res) => {
  const { market } = req.query;

  if (!market) {
    return res.status(400).json({
      status: 'error',
      message: 'market query parameter is required'
    });
  }

  // Check cache
  const cacheKey = `prices_${market}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  // Find the marketplace
  const marketplace = MARKETPLACES.find(m =>
    m.id === market || m.name.toLowerCase() === market.toLowerCase()
  );

  if (!marketplace) {
    return res.status(404).json({
      status: 'error',
      message: 'Marketplace not found'
    });
  }

  const prices = generateLivePrices(marketplace.crops);

  const result = {
    status: 'ok',
    market: {
      id: marketplace.id,
      name: marketplace.name,
      address: marketplace.address
    },
    prices,
    total: prices.length,
    timestamp: new Date().toISOString()
  };

  setCache(cacheKey, result);
  res.json(result);
});

// GET /api/maps-key (return API key for frontend)
app.get('/api/maps-key', (req, res) => {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key || key === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    return res.json({ status: 'no_key', key: null });
  }
  res.json({ status: 'ok', key });
});

// GET /api/all-markets (return all markets, no location needed)
app.get('/api/all-markets', (req, res) => {
  res.json({
    status: 'ok',
    total: MARKETPLACES.length,
    markets: MARKETPLACES,
    timestamp: new Date().toISOString()
  });
});

// GET /api/weather (fetch weather for lat/lng)
app.get('/api/weather', async (req, res) => {
  const { lat, lng } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!lat || !lng) {
    return res.status(400).json({ status: 'error', message: 'lat and lng required' });
  }

  // Check cache
  const cacheKey = `weather_${parseFloat(lat).toFixed(2)}_${parseFloat(lng).toFixed(2)}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  try {
    if (!apiKey || apiKey === 'YOUR_OPENWEATHER_API_KEY_HERE') {
      // Mock data if no API key
      const result = {
        status: 'ok',
        mock: true,
        data: {
          temp: Math.round(25 + Math.random() * 10), // 25-35 C
          humidity: Math.round(40 + Math.random() * 40), // 40-80%
          rainProbability: Math.round(Math.random() * 30), // 0-30%
          condition: 'Clear'
        },
        timestamp: new Date().toISOString()
      };
      setCache(cacheKey, result);
      return res.json(result);
    }

    // Real OpenWeatherMap API call
    // Note: using native fetch, requires Node 18+
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`);
    if (!response.ok) throw new Error('Weather API failed');
    
    const data = await response.json();
    
    const result = {
      status: 'ok',
      data: {
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        rainProbability: data.clouds ? data.clouds.all : 0, // Approx rain prob based on clouds
        condition: data.weather[0].main
      },
      timestamp: new Date().toISOString()
    };
    
    setCache(cacheKey, result);
    res.json(result);

  } catch (err) {
    console.error('Weather API Error:', err.message);
    res.status(500).json({ status: 'error', message: 'Failed to fetch weather data' });
  }
});
// POST /api/detect-disease (AI Crop Disease Scanner)
app.post('/api/detect-disease', upload.single('image'), async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    // Return mock response for demo/testing
    console.log('⚠️ No Gemini API key — returning mock disease result');
    return res.json({
      disease: "Late Blight (Phytophthora infestans)",
      confidence: "85%",
      symptoms: [
        "Dark brown/black spots on leaves",
        "White fuzzy growth on leaf underside",
        "Wilting and yellowing of leaves",
        "Water-soaked lesions on stems"
      ],
      causes: [
        "Fungal pathogen Phytophthora infestans",
        "Cool and humid weather (15-25°C)",
        "Poor air circulation in dense crops",
        "Overhead irrigation spreading spores"
      ],
      treatment: [
        "Remove and destroy all infected plant parts immediately",
        "Apply Mancozeb 75% WP @ 2g/litre of water as foliar spray",
        "Use Metalaxyl + Mancozeb (Ridomil Gold) @ 2.5g/litre for severe cases",
        "Repeat spray every 7-10 days during rainy season",
        "Ensure proper spacing between plants for air flow"
      ],
      prevention: [
        "Use disease-resistant crop varieties",
        "Practice crop rotation every 2-3 years",
        "Avoid overhead watering — use drip irrigation",
        "Apply preventive fungicide before monsoon season",
        "Remove crop debris after harvest"
      ],
      _mock: true
    });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded.' });
  }

  const { language = 'English', location = '{}' } = req.body;
  let locationData = {};
  try {
    locationData = JSON.parse(location);
  } catch (e) {}

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are an expert agricultural AI assistant.
      Analyze this crop image and identify any disease or pest issue.
      If it's a healthy crop, state so clearly.
      If the image is not of a crop, plant, or leaf, or is too blurry to tell, respond with disease as "Unclear Image".

      Consider the following context if provided:
      User Location: ${locationData.lat ? locationData.lat + ', ' + locationData.lng : 'Unknown'}
      Requested Language: ${language} (You MUST reply in this language)

      Return a raw JSON object with the exact following schema. Do not include markdown code blocks or any extra text outside the JSON.
      {
        "disease": "Name of the disease or 'Healthy' or 'Unclear Image'",
        "confidence": "Percentage e.g., '95%'",
        "symptoms": ["Symptom 1", "Symptom 2"],
        "causes": ["Cause 1", "Cause 2"],
        "treatment": ["Step 1", "Step 2"],
        "prevention": ["Prevention tip 1", "Prevention tip 2"]
      }
    `;

    const contentPayload = [
      {
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: req.file.mimetype,
              data: req.file.buffer.toString("base64")
            }
          }
        ]
      }
    ];

    // Try multiple models as fallback
    const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash'];
    let response = null;
    let lastError = null;

    for (const modelName of models) {
      try {
        console.log(`🔄 Trying model: ${modelName}`);
        response = await ai.models.generateContent({
          model: modelName,
          contents: contentPayload
        });
        console.log(`✅ Success with model: ${modelName}`);
        break; // success
      } catch (modelErr) {
        console.warn(`⚠️ Model ${modelName} failed: ${modelErr.message}`);
        lastError = modelErr;
      }
    }

    if (!response) {
      throw lastError || new Error('All models failed');
    }

    const outputText = response.text;
    
    // Attempt to parse JSON from output
    let parsedJson = {};
    try {
      // Clean markdown formatting if model wrapped it in code blocks
      let cleanedText = outputText.replace(/^\s*```json\s*/i, '').replace(/\s*```\s*$/, '').trim();
      parsedJson = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini output:', outputText);
      return res.status(500).json({ error: 'Failed to process AI response format.' });
    }

    res.json(parsedJson);
  } catch (err) {
    console.error('Gemini API Error:', err.message);
    res.status(500).json({ error: 'AI service is temporarily busy. Please try again in a moment.' });
  }
});


// ── B2B MARKETPLACE ROUTES ──

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
      farmerName, crop, quantity, expectedPrice, location, companyId, status: 'pending'
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

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`\n🌾 Farm AI Builder Server running at http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   GET /api/nearby-markets?lat=28.61&lng=77.20&radius=100`);
  console.log(`   GET /api/live-prices?market=azadpur`);
  console.log(`   GET /api/weather?lat=28.61&lng=77.20`);
  console.log(`   GET /api/maps-key`);
  console.log(`   GET /api/all-markets`);
  console.log(`   GET /api/companies?crop=...`);
  console.log(`   GET /api/requests\n`);
});
