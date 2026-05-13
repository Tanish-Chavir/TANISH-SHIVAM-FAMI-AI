import React, { useState } from 'react';
import { X, MapPin, TrendingUp, ShieldCheck, Mail, Send, ChevronRight, Package, Scale, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useLanguage } from '../utils/LanguageContext';

const CompanyModal = ({ company, onClose }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    farmerName: '',
    crop: company.crops[0] || '',
    quantity: '',
    expectedPrice: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/requests', { ...formData, companyId: company._id });
      if (res.data) {
        setSuccess(true);
        setTimeout(onClose, 2000);
      }
    } catch (err) {
      setError(t('request_failed'));
    } finally {
      setLoading(false);
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
            
            <div className="flex-1 mb-6">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest mb-1">
                <ShieldCheck size={14} /> {t('verified_partner')}
              </div>
              <h2 className="text-3xl font-black text-white leading-tight">{t(company.name.toLowerCase().replace(/\s+/g, '')) || company.name}</h2>
            </div>

            <div className="bg-slate-800/30 p-6 rounded-[2rem] border border-slate-800 mb-8">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2 uppercase text-xs tracking-widest">
                <Package size={16} className="text-emerald-400" /> {t('about_buyer')}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t('desc_' + company.name.toLowerCase().replace(/\s+/g, '')) || company.description}
              </p>
            </div>

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
          </div>

          {/* Right Side: Form */}
          <div className="md:w-7/12">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10 px-8"
                >
                  <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t('request_sent')}</h3>
                  <p className="text-slate-400">{t('request_success_desc')}</p>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">{t('sell_proposal')}</h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('select_crop')}</label>
                        <select 
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                          value={formData.crop}
                          onChange={(e) => setFormData({...formData, crop: e.target.value})}
                        >
                          {company.crops.map(crop => (
                            <option key={crop} value={crop}>{t(crop)}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('quantity')} ({t('qntl')})</label>
                        <input 
                          type="number"
                          placeholder={company.minQuantity?.toString() || "25"}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                          onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('expected_price')} (₹/{t('qntl')})</label>
                      <div className="relative">
                        <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          type="number"
                          placeholder="e.g. 4500"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                          onChange={(e) => setFormData({...formData, expectedPrice: e.target.value})}
                        />
                      </div>
                    </div>

                    {error && <p className="text-red-400 text-xs">{error}</p>}

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-widest flex items-center justify-center gap-3"
                    >
                      {loading ? t('sending') : t('submit_proposal')} <ChevronRight size={18} />
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
