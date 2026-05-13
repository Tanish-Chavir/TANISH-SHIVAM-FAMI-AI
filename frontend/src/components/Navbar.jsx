import React from 'react';
import { Sprout, BarChart2, History, Globe, User, LogOut } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

const Navbar = ({ activeTab, setActiveTab, currentTrader, onLogout }) => {
  const { lang, setLang, t, LANGUAGES } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card mx-4 my-4 rounded-2xl px-6 py-4 flex items-center justify-between border-none shadow-2xl">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
        <div className="p-2 bg-emerald-500/20 rounded-lg">
          <Sprout className="text-emerald-400" size={24} />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
          FarmMarket
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {[
            { id: 'dashboard', label: t('dashboard'), icon: BarChart2 },
            { id: 'assistant', label: t('ai_assistant'), icon: Sprout },
            { id: 'market', label: t('direct_trade'), icon: History },
            { id: 'nearby', label: t('markets'), icon: BarChart2 }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon size={18} />
              <span className="hidden xl:inline">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="h-8 w-px bg-slate-800 mx-2" />

        <div className="flex items-center gap-3">
          {currentTrader ? (
            <div className="flex items-center gap-4 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 pl-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                  {currentTrader.name[0]}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-white leading-none">{currentTrader.name}</div>
                  <div className="text-[10px] text-emerald-400 uppercase tracking-tighter">{t('verified_badge')}</div>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setActiveTab('trader_join')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition-all uppercase tracking-widest ${
                activeTab === 'trader_join'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-slate-900 hover:bg-emerald-500 hover:text-white'
              }`}
            >
              <User size={16} /> {t('trader_portal').toUpperCase()}
            </button>
          )}

          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl text-slate-300 transition-all border border-slate-700/50">
              <Globe size={18} className="text-emerald-400" />
              <span className="hidden sm:inline font-medium uppercase text-[10px]">{lang}</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60] max-h-96 overflow-y-auto custom-scrollbar">
              <div className="p-2 grid grid-cols-1 gap-1">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all ${
                      lang === l.code 
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{l.native}</span>
                    <span className="text-[10px] uppercase opacity-40">{l.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
