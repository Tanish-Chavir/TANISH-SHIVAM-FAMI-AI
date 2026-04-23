import React, { useState } from 'react';
import { X, MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CompanyModal = ({ company, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    farmerName: '',
    crop: company.crops[0] || '',
    quantity: '',
    expectedPrice: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/sell-request', {
        ...formData,
        companyId: company._id
      });
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      alert('Error submitting request');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/50 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full z-10"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto">
          {/* Left Side: Info */}
          <div className="md:w-5/12 bg-emerald-500/5 p-8 border-r border-slate-800">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-3xl flex items-center justify-center text-3xl font-bold mb-6">
              {company.name[0]}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{company.name}</h2>
            <div className="flex items-center gap-2 text-emerald-400 text-sm mb-6">
              <CheckCircle size={14} /> Verified Enterprise
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              {company.description}
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <MapPin size={16} className="text-slate-500" />
                {company.location}
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <Mail size={16} className="text-slate-500" />
                {company.contactEmail}
              </div>
            </div>

            <div className="mt-10 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <span className="text-xs text-slate-500 uppercase tracking-widest block mb-1">Buying Prices</span>
              <span className="text-xl font-bold text-emerald-400">{company.priceRange}</span>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="md:w-7/12 p-8">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10"
                >
                  <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
                  <p className="text-slate-400">The company has been notified. You can track this in "My Requests".</p>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="text-xl font-bold text-white mb-6">Send Sell Request</h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block ml-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.farmerName}
                        onChange={(e) => setFormData({...formData, farmerName: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="Enter your name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block ml-1">Select Crop</label>
                        <select 
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                          value={formData.crop}
                          onChange={(e) => setFormData({...formData, crop: e.target.value})}
                        >
                          {company.crops.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block ml-1">Quantity (Qntl)</label>
                        <input 
                          required
                          type="number" 
                          value={formData.quantity}
                          onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                          placeholder="e.g. 25"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block ml-1">Expected Price (₹/Qntl)</label>
                      <input 
                        required
                        type="number" 
                        value={formData.expectedPrice}
                        onChange={(e) => setFormData({...formData, expectedPrice: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="e.g. 3200"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block ml-1">Your Location</label>
                      <input 
                        required
                        type="text" 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="City, State"
                      />
                    </div>

                    <button 
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending...' : (
                        <>Submit Request <Send size={18} /></>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyModal;
