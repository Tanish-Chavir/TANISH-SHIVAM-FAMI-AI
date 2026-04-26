const mongoose = require('mongoose');

const MarketSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  address: String,
  lat: Number,
  lng: Number,
  phone: String,
  state: String,
  district: String,
  crops: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Market', MarketSchema);
