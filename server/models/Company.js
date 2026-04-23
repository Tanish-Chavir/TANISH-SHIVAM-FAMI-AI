const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  crops: [{ type: String }], // Crops they are interested in buying
  priceRange: { type: String }, // e.g. "₹2000 - ₹2500 per quintal"
  minQuantity: { type: Number }, // in quintals
  description: { type: String },
  contactEmail: { type: String },
  logo: { type: String } // URL or placeholder
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
