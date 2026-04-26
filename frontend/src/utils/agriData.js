// Complete Agricultural Data for Farm AI Platform

export const SEASONS = {
  kharif: { name: "Kharif", period: "June – October", icon: "🌧️", color: "#10b981" },
  rabi: { name: "Rabi", period: "November – April", icon: "❄️", color: "#3b82f6" },
  zaid: { name: "Zaid", period: "March – June", icon: "☀️", color: "#f59e0b" }
};

export const CROP_CATEGORIES = {
  all: { name: "All", icon: "🌐", color: "#94a3b8" },
  food: { name: "Food Crops", icon: "🌾", color: "#10b981" },
  cash: { name: "Cash Crops", icon: "💰", color: "#f59e0b" },
  plantation: { name: "Plantation Crops", icon: "🌴", color: "#8b5cf6" },
  horticulture: { name: "Horticulture", icon: "🍎", color: "#ef4444" }
};

export const STATES_DATA = {
  "Andhra Pradesh": {
    region: "South", capital: "Amaravati",
    climate: "Tropical & semi-arid; hot summers, moderate rainfall",
    avgTemp: "27°C", rainfall: "940 mm",
    seasons: {
      kharif: ["Rice", "Cotton", "Groundnut", "Red Gram", "Maize"],
      rabi: ["Bengal Gram", "Jowar", "Sunflower", "Black Gram"],
      zaid: ["Watermelon", "Cucumber", "Vegetables"]
    },
    crops: { food: ["Rice", "Jowar", "Maize"], cash: ["Cotton", "Tobacco", "Chilli"], plantation: ["Coconut", "Oil Palm"], horticulture: ["Mango", "Banana", "Citrus"] },
    mandis: [
      { name: "Guntur Mandi", location: "Guntur", speciality: "Chilli, Cotton" },
      { name: "Kurnool Mandi", location: "Kurnool", speciality: "Groundnut, Jowar" },
      { name: "Vijayawada Mandi", location: "Vijayawada", speciality: "Rice, Vegetables" }
    ]
  },
  "Bihar": {
    region: "East", capital: "Patna",
    climate: "Subtropical; extreme summers, good monsoon rainfall",
    avgTemp: "26°C", rainfall: "1200 mm",
    seasons: {
      kharif: ["Rice", "Maize", "Jute", "Sugarcane"],
      rabi: ["Wheat", "Barley", "Gram", "Lentil", "Mustard"],
      zaid: ["Moong", "Vegetables", "Watermelon"]
    },
    crops: { food: ["Rice", "Wheat", "Maize", "Lentil"], cash: ["Sugarcane", "Jute", "Tobacco"], plantation: ["Litchi Orchards"], horticulture: ["Litchi", "Mango", "Banana", "Guava"] },
    mandis: [
      { name: "Patna Mandi", location: "Patna", speciality: "Wheat, Rice" },
      { name: "Muzaffarpur Mandi", location: "Muzaffarpur", speciality: "Litchi, Banana" }
    ]
  },
  "Gujarat": {
    region: "West", capital: "Gandhinagar",
    climate: "Arid to semi-arid; hot summers, moderate monsoon",
    avgTemp: "28°C", rainfall: "800 mm",
    seasons: {
      kharif: ["Cotton", "Groundnut", "Rice", "Bajra", "Castor"],
      rabi: ["Wheat", "Mustard", "Cumin", "Gram"],
      zaid: ["Moong", "Watermelon", "Vegetables"]
    },
    crops: { food: ["Wheat", "Rice", "Bajra"], cash: ["Cotton", "Groundnut", "Castor", "Tobacco"], plantation: ["Coconut", "Date Palm"], horticulture: ["Mango", "Banana", "Sapota", "Pomegranate"] },
    mandis: [
      { name: "Rajkot Mandi", location: "Rajkot", speciality: "Groundnut, Cotton" },
      { name: "Unjha Mandi", location: "Unjha", speciality: "Cumin, Fennel" }
    ]
  },
  "Karnataka": {
    region: "South", capital: "Bengaluru",
    climate: "Tropical to semi-arid; varied across coastal & plateau",
    avgTemp: "26°C", rainfall: "1248 mm",
    seasons: {
      kharif: ["Rice", "Jowar", "Maize", "Ragi", "Cotton"],
      rabi: ["Wheat", "Gram", "Safflower", "Sunflower"],
      zaid: ["Vegetables", "Watermelon"]
    },
    crops: { food: ["Rice", "Ragi", "Jowar", "Maize"], cash: ["Coffee", "Sugarcane", "Cotton"], plantation: ["Coffee", "Cardamom", "Arecanut", "Coconut"], horticulture: ["Mango", "Grapes", "Banana", "Pomegranate"] },
    mandis: [
      { name: "Bengaluru APMC", location: "Bengaluru", speciality: "Vegetables, Flowers" },
      { name: "Mysuru Mandi", location: "Mysuru", speciality: "Coffee, Spices" }
    ]
  },
  "Madhya Pradesh": {
    region: "Central", capital: "Bhopal",
    climate: "Subtropical; hot summers, good monsoon, mild winters",
    avgTemp: "26°C", rainfall: "1160 mm",
    seasons: {
      kharif: ["Soybean", "Rice", "Maize", "Jowar", "Cotton"],
      rabi: ["Wheat", "Gram", "Lentil", "Mustard"],
      zaid: ["Moong", "Vegetables", "Watermelon"]
    },
    crops: { food: ["Wheat", "Rice", "Gram", "Maize"], cash: ["Soybean", "Cotton", "Sugarcane"], plantation: ["Teak", "Sal"], horticulture: ["Mango", "Guava", "Orange", "Banana"] },
    mandis: [
      { name: "Indore Mandi", location: "Indore", speciality: "Soybean, Wheat" },
      { name: "Neemuch Mandi", location: "Neemuch", speciality: "Garlic, Coriander" }
    ]
  },
  "Maharashtra": {
    region: "West", capital: "Mumbai",
    climate: "Tropical monsoon to semi-arid; variable rainfall",
    avgTemp: "27°C", rainfall: "1200 mm",
    seasons: {
      kharif: ["Rice", "Jowar", "Bajra", "Cotton", "Soybean", "Sugarcane"],
      rabi: ["Wheat", "Gram", "Safflower", "Sunflower"],
      zaid: ["Vegetables", "Watermelon"]
    },
    crops: { food: ["Rice", "Wheat", "Jowar", "Bajra"], cash: ["Sugarcane", "Cotton", "Soybean"], plantation: ["Coconut", "Cashew"], horticulture: ["Mango", "Grapes", "Pomegranate", "Orange", "Onion", "Banana"] },
    mandis: [
      { name: "Vashi APMC", location: "Navi Mumbai", speciality: "Vegetables, Fruits" },
      { name: "Lasalgaon Mandi", location: "Nashik", speciality: "Onion" }
    ]
  },
  "Punjab": {
    region: "North", capital: "Chandigarh",
    climate: "Semi-arid continental; extreme temperatures, moderate rain",
    avgTemp: "24°C", rainfall: "600 mm",
    seasons: {
      kharif: ["Rice", "Cotton", "Maize", "Sugarcane", "Bajra"],
      rabi: ["Wheat", "Barley", "Gram", "Mustard"],
      zaid: ["Moong", "Vegetables", "Fodder"]
    },
    crops: { food: ["Wheat", "Rice", "Maize", "Barley"], cash: ["Cotton", "Sugarcane"], plantation: [], horticulture: ["Kinnow", "Guava", "Pear", "Peach"] },
    mandis: [
      { name: "Khanna Mandi", location: "Khanna", speciality: "Wheat, Rice" },
      { name: "Bathinda Mandi", location: "Bathinda", speciality: "Cotton, Mustard" }
    ]
  },
  "Rajasthan": {
    region: "North", capital: "Jaipur",
    climate: "Arid to semi-arid; very hot summers, scanty rainfall",
    avgTemp: "26°C", rainfall: "530 mm",
    seasons: {
      kharif: ["Bajra", "Jowar", "Maize", "Groundnut", "Guar"],
      rabi: ["Wheat", "Barley", "Gram", "Mustard", "Cumin"],
      zaid: ["Moong", "Watermelon", "Vegetables"]
    },
    crops: { food: ["Wheat", "Bajra", "Barley", "Maize"], cash: ["Mustard", "Guar", "Cumin"], plantation: ["Date Palm"], horticulture: ["Mango", "Ber", "Pomegranate", "Kinnow"] },
    mandis: [
      { name: "Jaipur Mandi", location: "Jaipur", speciality: "Mustard, Gram" },
      { name: "Kota Mandi", location: "Kota", speciality: "Soybean, Coriander" }
    ]
  },
  "Tamil Nadu": {
    region: "South", capital: "Chennai",
    climate: "Tropical; hot & humid, northeast monsoon dominant",
    avgTemp: "29°C", rainfall: "945 mm",
    seasons: {
      kharif: ["Rice", "Cotton", "Sugarcane", "Groundnut"],
      rabi: ["Rice (Samba)", "Pulses", "Millets"],
      zaid: ["Vegetables", "Flowers"]
    },
    crops: { food: ["Rice", "Ragi", "Bajra", "Maize"], cash: ["Sugarcane", "Cotton", "Groundnut"], plantation: ["Tea", "Coffee", "Coconut", "Rubber"], horticulture: ["Banana", "Mango", "Coconut", "Jackfruit"] },
    mandis: [
      { name: "Koyambedu Market", location: "Chennai", speciality: "Vegetables, Fruits, Flowers" },
      { name: "Madurai Mandi", location: "Madurai", speciality: "Banana, Rice" }
    ]
  },
  "Uttar Pradesh": {
    region: "North", capital: "Lucknow",
    climate: "Subtropical; extreme summers & winters, good monsoon",
    avgTemp: "26°C", rainfall: "990 mm",
    seasons: {
      kharif: ["Rice", "Sugarcane", "Maize", "Bajra", "Jowar"],
      rabi: ["Wheat", "Barley", "Gram", "Mustard", "Peas"],
      zaid: ["Moong", "Watermelon", "Cucumber", "Vegetables"]
    },
    crops: { food: ["Wheat", "Rice", "Barley", "Maize", "Millets"], cash: ["Sugarcane", "Potato", "Mustard"], plantation: [], horticulture: ["Mango", "Guava", "Banana", "Aonla", "Potato"] },
    mandis: [
      { name: "Lucknow Mandi", location: "Lucknow", speciality: "Wheat, Rice" },
      { name: "Agra Mandi", location: "Agra", speciality: "Potato, Wheat" }
    ]
  }
};

export const MARKET_PRICES = [
  { crop: "Rice (Paddy)", price: 2183, trend: "up", change: "+3.2%", category: "food", season: "kharif" },
  { crop: "Wheat", price: 2275, trend: "up", change: "+2.8%", category: "food", season: "rabi" },
  { crop: "Maize", price: 2090, trend: "down", change: "-1.5%", category: "food", season: "kharif" },
  { crop: "Bajra", price: 2500, trend: "up", change: "+4.1%", category: "food", season: "kharif" },
  { crop: "Gram (Chana)", price: 5440, trend: "up", change: "+3.7%", category: "food", season: "rabi" },
  { crop: "Cotton", price: 6620, trend: "up", change: "+5.5%", category: "cash", season: "kharif" },
  { crop: "Mustard", price: 5650, trend: "down", change: "-1.8%", category: "cash", season: "rabi" },
  { crop: "Soybean", price: 4600, trend: "up", change: "+3.9%", category: "cash", season: "kharif" },
  { crop: "Onion", price: 1800, trend: "up", change: "+18.5%", category: "horticulture", season: "rabi" },
  { crop: "Tomato", price: 2500, trend: "up", change: "+22.3%", category: "horticulture", season: "kharif" }
];

export const AI_RESPONSES = {
  greetings: [
    "Namaste! 🙏 I'm your Farm AI Assistant. I can help you with crop recommendations, pest management, soil health, and more.",
    "Hello farmer! 🌾 Welcome to Farm AI. Ask me anything about farming — from crop selection to market prices."
  ],
  pest: "🐛 **Pest Management Tips:**\n\n1. **Neem Oil Spray** — Mix 5ml neem oil per litre. Effective against aphids and whiteflies.\n2. **Crop Rotation** — Break pest cycles by rotating crops.\n3. **Biological Control** — Use natural predators like ladybugs.",
  fertilizer: "🧪 **Fertilizer Tips:**\n\n- Rice: DAP 100 kg/ha + MOP 60 kg/ha basal.\n- Wheat: Urea top-dress at 21 and 45 days.\n- Organic: Use vermicompost (5 tonnes/ha) for long-term soil health.",
  soil: "🌍 **Soil Health:**\n\n- Test your soil pH (ideal 6.0-7.5).\n- Add organic matter to improve water retention.\n- Use biofertilizers like Azotobacter.",
  default: "🌾 I can help with many farming topics! Try asking about pests, fertilizers, soil health, or government schemes."
};
