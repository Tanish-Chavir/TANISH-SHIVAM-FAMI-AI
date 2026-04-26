import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, MapPin, Briefcase, FileText, CheckCircle, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

const TraderRegister = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    crops: '',
    description: '',
    gstNumber: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isLogin ? '/api/trader/login' : '/api/trader/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { ...formData, crops: formData.crops.split(',').map(c => c.trim()) };

      const res = await axios.post(endpoint, payload);
      
      localStorage.setItem('traderToken', res.data.token);
      localStorage.setItem('traderData', JSON.stringify(res.data.trader));
      
      if (!isLogin) {
        setSuccess('Registration successful! Your account is pending verification.');
        setTimeout(() => onLoginSuccess(res.data.trader), 2000);
      } else {
        onLoginSuccess(res.data.trader);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        
        {/* Left Side: Branding/Info */}
        <div className="lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold mb-6 tracking-widest uppercase border border-emerald-500/20">
              <CheckCircle size={14} /> Official Trader Portal
            </div>
            <h1 className="text-5xl font-black text-white mb-6 leading-tight">
              Grow Your <span className="text-emerald-400">Agri-Business</span> With Us
            </h1>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
              Join India's largest direct-trade platform. Connect with thousands of verified farmers and streamline your procurement process.
            </p>

            <div className="space-y-6">
              {[
                { icon: CheckCircle, title: 'Verified Badge', desc: 'Get a blue checkmark for trust' },
                { icon: Briefcase, title: 'Direct Sourcing', desc: 'Buy directly from the source' },
                { icon: FileText, title: 'GST Integrated', desc: 'Simplified tax compliance' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0 border border-slate-700/50">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:w-1/2 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 rounded-[3rem] border-slate-700/50 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
            
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${!isLogin ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}
              >
                REGISTER
              </button>
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${isLogin ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}
              >
                LOGIN
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold">
                    <AlertCircle size={16} /> {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs font-bold">
                    <CheckCircle size={16} /> {success}
                  </motion.div>
                )}
              </AnimatePresence>

              {!isLogin && (
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-2">Business Name</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      required name="name" type="text" placeholder="e.g. Sahyadri Agri Exports" 
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-2">Business Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    required name="email" type="email" placeholder="contact@business.com" 
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    required name="password" type="password" placeholder="••••••••" 
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-2">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                        <input 
                          required name="location" type="text" placeholder="Pune, MH" 
                          onChange={handleChange}
                          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-2">GST Number</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                        <input 
                          required name="gstNumber" type="text" placeholder="27AAAAA0000A1Z5" 
                          onChange={handleChange}
                          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-2">Interested Crops (Comma separated)</label>
                    <input 
                      required name="crops" type="text" placeholder="Tomato, Onion, Soybean" 
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm font-medium"
                    />
                  </div>
                </>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-5 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50 mt-4 uppercase tracking-widest text-xs"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    {isLogin ? 'LOG IN' : 'CREATE ACCOUNT'} <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TraderRegister;
