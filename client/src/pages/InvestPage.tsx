import React, { useState } from 'react';
import CryptoList from '../components/invest/CryptoList';
import Sidebar from '../components/common/Sidebar';

const InvestPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-100 mb-4">
            Cryptocurrency <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Market</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Discover top cryptocurrencies and build your investment portfolio with real-time market data.
          </p>
        </div>
        
        <CryptoList />
      </div>
    </div>
  );
};

export default InvestPage;