const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  farmerName: { type: String, required: true },
  crop: { type: String, required: true },
  quantity: { type: Number, required: true }, // in quintals
  expectedPrice: { type: Number, required: true }, // per quintal
  location: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  submissionDate: { type: Date, default: Date.now },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
