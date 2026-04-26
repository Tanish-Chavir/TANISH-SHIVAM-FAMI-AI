import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import NearbyMarkets from './components/NearbyMarkets';
import Marketplace from './components/Marketplace';
import RequestStatus from './components/RequestStatus';
import CompanyModal from './components/CompanyModal';
import TraderRegister from './components/TraderRegister';
import { AnimatePresence } from 'framer-motion';

import { LanguageProvider } from './utils/LanguageContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [currentTrader, setCurrentTrader] = useState(JSON.parse(localStorage.getItem('traderData')));

  const handleTraderLogin = (trader) => {
    setCurrentTrader(trader);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('traderToken');
    localStorage.removeItem('traderData');
    setCurrentTrader(null);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'assistant': return <AIAssistant />;
      case 'market': return <Marketplace onSelectCompany={(company) => setSelectedCompany(company)} />;
      case 'requests': return <RequestStatus />;
      case 'nearby': return <NearbyMarkets />;
      case 'trader_join': return <TraderRegister onLoginSuccess={handleTraderLogin} />;
      default: return <Dashboard />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#0f172a] text-slate-200">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          currentTrader={currentTrader}
          onLogout={handleLogout}
        />
        
        <main>
          {renderContent()}
        </main>

        <AnimatePresence>
          {selectedCompany && (
            <CompanyModal 
              company={selectedCompany} 
              onClose={() => setSelectedCompany(null)}
              onSuccess={() => setActiveTab('requests')}
            />
          )}
        </AnimatePresence>

        {/* Decorative Background Elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full"></div>
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;
