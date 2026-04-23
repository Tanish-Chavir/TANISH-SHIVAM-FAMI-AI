import React from 'react';
import { MapPin, TrendingUp, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CompanyCard = ({ company, onClick, index }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="glass-card p-6 rounded-3xl cursor-pointer group hover:bg-slate-800/80"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          {company.name[0]}
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <CheckCircle2 size={12} />
          VERIFIED BUYER
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
        {company.name}
      </h3>
      
      <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
        <MapPin size={14} className="text-slate-500" />
        {company.location}
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-700/50">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 flex items-center gap-2">
            <TrendingUp size={14} /> Price Range
          </span>
          <span className="text-emerald-400 font-bold">{company.priceRange}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Min. Quantity</span>
          <span className="text-slate-200 font-medium">{company.minQuantity} Quintals</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex -space-x-2">
          {company.crops.map((crop, i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-xs" title={crop}>
              {crop[0].toUpperCase()}
            </div>
          ))}
        </div>
        <button className="flex items-center gap-1 text-emerald-400 font-bold text-sm group-hover:gap-2 transition-all">
          Details <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default CompanyCard;
