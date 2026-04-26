import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Map as MapIcon, 
  Calendar, 
  Search, 
  ChevronRight, 
  X,
  ArrowUpRight,
  ArrowDownRight,
  CloudRain,
  Snowflake,
  Sun
} from 'lucide-react';
import { STATES_DATA, MARKET_PRICES, SEASONS, CROP_CATEGORIES } from '../utils/agriData';
import { useLanguage } from '../utils/LanguageContext';

const StatCard = ({ icon: Icon, label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6 rounded-3xl flex items-center gap-4 border-slate-700/50"
  >
    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
      <Icon size={24} />
    </div>
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { t } = useLanguage();
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [pricePage, setPricePage] = useState(0);

  const stats = [
    { icon: MapIcon, label: t('states_covered'), value: Object.keys(STATES_DATA).length },
    { icon: Sun, label: t('crop_varieties'), value: '50+' },
    { icon: TrendingUp, label: t('live_prices'), value: MARKET_PRICES.length },
    { icon: Calendar, label: t('seasons'), value: 3 }
  ];

  const filteredStates = Object.entries(STATES_DATA).filter(([name, data]) => {
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || (data.crops[selectedCategory] && data.crops[selectedCategory].length > 0);
    return matchesSearch && matchesCategory;
  });

  const filteredPrices = MARKET_PRICES.filter(p => {
    const matchesSearch = p.crop.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeason = !selectedSeason || p.season === selectedSeason;
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesSeason && matchesCategory;
  });

  const currentPrices = filteredPrices.slice(pricePage * 5, (pricePage + 1) * 5);

  return (
    <div className="pt-28 pb-10 px-6 max-w-7xl mx-auto space-y-10">
      {/* Hero */}
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white"
        >
          {t('welcome').split('Farm AI')[0]}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Farm AI</span>
          {t('welcome').split('Farm AI')[1]}
        </motion.h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {t('hero_sub')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} delay={0.1 + i * 0.1} />
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-800/30 p-4 rounded-3xl border border-slate-700/50 sticky top-24 z-20 backdrop-blur-xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          {Object.entries(CROP_CATEGORIES).map(([id, cat]) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === id 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 text-white pl-11 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: States & Seasons */}
        <div className="lg:col-span-2 space-y-10">
          {/* Seasons */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="text-emerald-400" /> {t('farming_seasons')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(SEASONS).map(([id, season]) => (
                <button
                  key={id}
                  onClick={() => setSelectedSeason(selectedSeason === id ? null : id)}
                  className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden group ${
                    selectedSeason === id 
                    ? 'bg-slate-800 border-emerald-500 shadow-xl' 
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                    id === 'kharif' ? 'bg-emerald-500' : id === 'rabi' ? 'bg-blue-500' : 'bg-amber-500'
                  }`} />
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{season.icon}</div>
                  <div className="font-bold text-white">{season.name}</div>
                  <div className="text-xs text-slate-400">{season.period}</div>
                </button>
              ))}
            </div>
          </section>

          {/* States Grid */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <MapIcon className="text-emerald-400" /> {t('regional_data')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredStates.map(([name, data]) => (
                <motion.button
                  layoutId={`state-${name}`}
                  key={name}
                  onClick={() => setSelectedState(name)}
                  className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-left hover:bg-slate-700/50 transition-all group"
                >
                  <div className="text-white font-bold group-hover:text-emerald-400 transition-colors">{name}</div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      data.region === 'North' ? 'bg-blue-400' : 
                      data.region === 'South' ? 'bg-emerald-400' : 
                      data.region === 'West' ? 'bg-amber-400' : 'bg-purple-400'
                    }`} />
                    {data.region} India
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Price Ticker */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-emerald-400" /> {t('market_ticker')}
          </h2>
          <div className="glass-card rounded-3xl overflow-hidden border-slate-700/50">
            <div className="divide-y divide-slate-700/50">
              {currentPrices.map((item, i) => (
                <div key={item.crop} className="p-5 hover:bg-slate-700/20 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-white">{item.crop}</div>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                      item.trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                    }`}>
                      {item.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {item.change}
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-2xl font-black text-white">₹{item.price.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{t('per_quintal')}</div>
                  </div>
                </div>
              ))}
            </div>
            {filteredPrices.length > 5 && (
              <div className="p-4 bg-slate-900/50 flex justify-between items-center border-t border-slate-700/50">
                <button 
                  disabled={pricePage === 0}
                  onClick={() => setPricePage(p => p - 1)}
                  className="p-2 text-slate-400 disabled:opacity-30"
                >
                  <ChevronRight className="rotate-180" size={20} />
                </button>
                <span className="text-xs text-slate-500">Page {pricePage + 1}</span>
                <button 
                   disabled={(pricePage + 1) * 5 >= filteredPrices.length}
                   onClick={() => setPricePage(p => p + 1)}
                   className="p-2 text-slate-400 disabled:opacity-30"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* State Detail Modal */}
      <AnimatePresence>
        {selectedState && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedState(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              layoutId={`state-${selectedState}`}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Regional Insight</div>
                    <h2 className="text-3xl font-bold text-white">{selectedState}</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedState(null)}
                    className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-800/50">
                    <div className="text-xs text-slate-500 mb-1">Capital</div>
                    <div className="text-white font-medium">{STATES_DATA[selectedState].capital}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/50">
                    <div className="text-xs text-slate-500 mb-1">Climate</div>
                    <div className="text-white font-medium">{STATES_DATA[selectedState].avgTemp} Avg.</div>
                  </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-bold text-white text-sm uppercase tracking-wider">Top Crops by Season</h3>
                   <div className="space-y-3">
                     {Object.entries(STATES_DATA[selectedState].seasons).map(([season, crops]) => (
                       <div key={season} className="flex gap-4 items-center">
                         <div className="w-20 text-xs font-bold text-slate-500 uppercase">{season}</div>
                         <div className="flex flex-wrap gap-2">
                           {crops.map(crop => (
                             <span key={crop} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                               {crop}
                             </span>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                   <p className="text-sm text-slate-400 italic">"{STATES_DATA[selectedState].climate}"</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
