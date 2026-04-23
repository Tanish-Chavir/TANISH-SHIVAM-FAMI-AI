import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, TrendingUp, Package } from 'lucide-react';
import CompanyCard from './CompanyCard';
import { motion, AnimatePresence } from 'framer-motion';

const Marketplace = ({ onSelectCompany }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const crops = [
    { id: 'tomato', name: 'Tomato', icon: '🍅' },
    { id: 'soybean', name: 'Soybean', icon: '🌱' },
    { id: 'onion', name: 'Onion', icon: '🧅' },
    { id: 'jowar', name: 'Jowar', icon: '🌾' },
    { id: 'cotton', name: 'Cotton', icon: '☁️' },
    { id: 'wheat', name: 'Wheat', icon: '🌾' }
  ];

  useEffect(() => {
    fetchCompanies();
  }, [selectedCrop]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/companies${selectedCrop ? `?crop=${selectedCrop}` : ''}`);
      setCompanies(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load companies. Is the backend running?');
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-10 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Direct Trade Marketplace
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400"
          >
            Sell your crops directly to enterprises at better prices.
          </motion.p>
        </div>

        <div className="relative group min-w-[200px]">
          <label className="text-sm text-slate-500 mb-2 block ml-1">Filter by Crop</label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer"
          >
            <option value="">All Crops</option>
            {crops.map(crop => (
              <option key={crop.id} value={crop.id}>
                {crop.name}
              </option>
            ))}
          </select>
          <div className="absolute right-4 bottom-3.5 pointer-events-none text-slate-500">
            <Search size={20} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 animate-pulse">Scanning the market...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
          <p className="text-red-400">{error}</p>
          <button onClick={fetchCompanies} className="mt-4 text-emerald-400 font-medium underline">Try Again</button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode='popLayout'>
            {companies.length > 0 ? (
              companies.map((company, index) => (
                <CompanyCard 
                  key={company._id} 
                  company={company} 
                  index={index}
                  onClick={() => onSelectCompany(company)}
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center glass-card rounded-3xl"
              >
                <Package className="mx-auto text-slate-600 mb-4" size={48} />
                <h3 className="text-xl font-medium text-slate-300">No active buyers for this crop</h3>
                <p className="text-slate-500 mt-2">Try selecting a different crop or check back later.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Marketplace;
