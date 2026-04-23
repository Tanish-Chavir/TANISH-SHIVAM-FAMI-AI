import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Marketplace from './components/Marketplace';
import RequestStatus from './components/RequestStatus';
import CompanyModal from './components/CompanyModal';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('market'); // 'market' or 'requests'
  const [selectedCompany, setSelectedCompany] = useState(null);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main>
        {activeTab === 'market' ? (
          <Marketplace onSelectCompany={(company) => setSelectedCompany(company)} />
        ) : (
          <RequestStatus />
        )}
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
  );
}

export default App;
