import { MapPin, TrendingUp, ChevronRight, CheckCircle2, ArrowUpRight, Scale } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../utils/LanguageContext';

const CompanyCard = ({ company, onClick, index }) => {
  const { t } = useLanguage();
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="glass-card p-8 rounded-[2.5rem] cursor-pointer group hover:bg-slate-800/80 relative overflow-hidden flex flex-col h-full border-slate-700/50 hover:border-emerald-500/30 shadow-xl hover:shadow-emerald-500/10"
    >
      {/* Background Accent */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />

      <div className="flex justify-between items-start mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-3xl text-white font-black shadow-lg shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
          {company.name[0]}
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-500/20 uppercase tracking-widest">
          <CheckCircle2 size={12} className="fill-emerald-500 text-white" />
          {t('verified').toUpperCase()}
        </div>
      </div>

      <div className="flex-grow">
        <h3 className="text-2xl font-black text-white mb-2 group-hover:text-emerald-400 transition-colors tracking-tight">
          {t(company.name.toLowerCase().replace(/\s+/g, '')) || company.name}
        </h3>
        
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 font-bold">
          <MapPin size={16} className="text-slate-600" />
          {company.location}
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-800/50">
          <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <TrendingUp size={14} className="text-emerald-400" /> {t('price_range')}
            </span>
            <span className="text-emerald-400 font-black text-sm">{company.priceRange}</span>
          </div>
          
          <div className="flex justify-between items-center px-2">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Scale size={14} /> {t('min_quantity')}
            </span>
            <span className="text-slate-200 font-black text-sm">{company.minQuantity} <span className="text-[10px] text-slate-500">{t('qntl')}</span></span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex -space-x-3">
          {company.crops.slice(0, 3).map((crop, i) => (
            <div 
              key={i} 
              className="w-10 h-10 rounded-full bg-slate-800 border-4 border-[#0f172a] flex items-center justify-center text-sm shadow-xl" 
              title={crop}
            >
              <span className="grayscale group-hover:grayscale-0 transition-all">{
                crop === 'tomato' ? '🍅' : 
                crop === 'onion' ? '🧅' : 
                crop === 'soybean' ? '🌱' : 
                crop === 'wheat' ? '🌾' : 
                crop === 'grapes' ? '🍇' : '📦'
              }</span>
            </div>
          ))}
          {company.crops.length > 3 && (
            <div className="w-10 h-10 rounded-full bg-emerald-500 border-4 border-[#0f172a] flex items-center justify-center text-[10px] font-black text-white">
              +{company.crops.length - 3}
            </div>
          )}
        </div>
        
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-emerald-500 hover:text-white text-emerald-400 font-black text-[10px] rounded-xl transition-all uppercase tracking-widest group/btn border border-emerald-500/10">
          {t('propose')} <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default CompanyCard;
