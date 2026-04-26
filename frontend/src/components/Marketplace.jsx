import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, TrendingUp, Package, Filter, ChevronRight, Star, ArrowRight } from 'lucide-react';
import CompanyCard from './CompanyCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../utils/LanguageContext';

const Marketplace = ({ onSelectCompany }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  const crops = [
    { id: 'tomato', name: 'Tomato', icon: '🍅' },
    { id: 'soybean', name: 'Soybean', icon: '🌱' },
    { id: 'onion', name: 'Onion', icon: '🧅' },
    { id: 'wheat', name: 'Wheat', icon: '🌾' },
    { id: 'grapes', name: 'Grapes', icon: '🍇' },
    { id: 'cotton', name: 'Cotton', icon: '☁️' }
  ];

  useEffect(() => {
    fetchCompanies();
  }, [selectedCrop]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/companies${selectedCrop ? `?crop=${selectedCrop}` : ''}`);
      // Handle different response formats (Array or {value: Array})
      let data = res.data;
      if (data && data.value && Array.isArray(data.value)) {
        data = data.value;
      }
      setCompanies(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      setError('Failed to connect to marketplace server.');
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Hero Section */}
      <div className="relative mb-16 rounded-[3rem] overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-900 p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 0 L100 0 L100 100 Z" fill="white" />
          </svg>
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-100 text-xs font-bold mb-6 tracking-widest uppercase"
          >
            <Star size={14} className="fill-emerald-300 text-emerald-300" /> DIRECT TRADE ENABLED
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight"
          >
            Direct Trade <span className="text-emerald-300">Marketplace</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-emerald-100/80 text-lg mb-10 font-medium leading-relaxed"
          >
            Skip the middlemen. Connect directly with global food processors and exporters at verified premium rates.
          </motion.p>

          <div className="flex flex-wrap gap-4">
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-emerald-600 bg-slate-800 flex items-center justify-center overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                 </div>
               ))}
               <div className="w-10 h-10 rounded-full border-2 border-emerald-600 bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white">50+</div>
             </div>
             <div className="text-emerald-100/60 text-sm flex flex-col justify-center">
               <span className="font-bold text-white">Join 1,000+ Farmers</span>
               <span>Trading directly this month</span>
             </div>
          </div>
        </div>
      </div>

      {/* Filters Area */}
      <div className="sticky top-24 z-40 mb-12">
        <div className="glass-card p-4 rounded-[2.5rem] border-slate-700/50 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 px-8">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 lg:pb-0 w-full lg:w-auto">
            <button 
              onClick={() => setSelectedCrop('')}
              className={`px-6 py-2.5 rounded-2xl text-sm font-black transition-all whitespace-nowrap ${!selectedCrop ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              ALL CROPS
            </button>
            {crops.map(crop => (
              <button 
                key={crop.id}
                onClick={() => setSelectedCrop(crop.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-black transition-all whitespace-nowrap ${selectedCrop === crop.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                <span>{crop.icon}</span> {crop.name.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-slate-700/50 hidden lg:block" />

          <div className="relative w-full lg:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search companies..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-80 w-full bg-slate-800/30 animate-pulse rounded-[3rem] border border-slate-700/30" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-500/5 border border-red-500/20 p-12 rounded-[3rem] text-center">
          <p className="text-red-400 font-bold text-lg mb-4">{error}</p>
          <button onClick={fetchCompanies} className="px-8 py-3 bg-red-500 text-white rounded-2xl font-black text-xs hover:bg-red-600 transition-all">TRY RECONNECTING</button>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full py-32 text-center glass-card rounded-[3rem] border-slate-800/50"
              >
                <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-800">
                  <Package className="text-slate-700" size={48} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">No Buyers Found</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">We couldn't find any active companies for {selectedCrop ? selectedCrop : 'this category'} right now.</p>
                <button onClick={() => setSelectedCrop('')} className="mt-8 text-emerald-400 text-sm font-black underline hover:text-emerald-300">VIEW ALL DEALS</button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Trust Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 glass-card p-12 rounded-[4rem] border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-10 bg-emerald-500/[0.02]"
      >
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-3xl font-black text-white mb-4 leading-tight uppercase tracking-tight">Verified <span className="text-emerald-400 underline decoration-emerald-500/30">Enterprise</span> Buyers</h2>
          <p className="text-slate-500 font-medium">All companies in our marketplace are KYC-verified and bonded to ensure your payment security and crop quality protection.</p>
        </div>
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <div className="flex gap-8 justify-center">
             <div className="text-center">
               <div className="text-2xl font-black text-white tracking-tighter">100%</div>
               <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">SECURE PAY</div>
             </div>
             <div className="h-10 w-px bg-slate-800" />
             <div className="text-center">
               <div className="text-2xl font-black text-white tracking-tighter">24/7</div>
               <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">SUPPORT</div>
             </div>
          </div>
          <button className="px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-sm hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-white/5 uppercase tracking-widest flex items-center justify-center gap-3">
             Become a Buyer <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Marketplace;
