const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  crops: [{ type: String }], // Crops they are interested in buying
  priceRange: { type: String }, // e.g. "₹2000 - ₹2500 per quintal"
  minQuantity: { type: Number }, // in quintals
  description: { type: String },
  contactEmail: { type: String },
  logo: { type: String }, // URL or placeholder
  isVerified: { type: Boolean, default: false },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending' 
  },
  businessLicense: { type: String }, // URL or reference
  gstNumber: { type: String }
}, { timestamps: true });

// Hash password before saving
companySchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
companySchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Company', companySchema);
