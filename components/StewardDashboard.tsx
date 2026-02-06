
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface StewardDashboardProps {
  user: UserProfile;
}

type Tab = 'overview' | 'assets' | 'learning' | 'finance' | 'community';

const StewardDashboard: React.FC<StewardDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [assetPulse, setAssetPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setAssetPulse(prev => !prev), 2000);
    return () => clearInterval(interval);
  }, []);

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Equity</span>
                <h3 className="text-2xl font-black text-gray-900">{formatNaira(2400000).split('.')[0]}</h3>
                <div className="mt-4 flex items-center text-[10px] font-black text-pasture uppercase">
                  <i className="fas fa-chart-line mr-1"></i> Track at Mother
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Level</span>
                <h3 className="text-2xl font-black text-gray-900">Module 2</h3>
                <div className="mt-4 flex items-center text-[10px] font-black text-gold uppercase">
                  <i className="fas fa-graduation-cap mr-1"></i> Certification Active
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Asset Health</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full bg-green-500 ${assetPulse ? 'animate-ping' : ''}`}></div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase">Optimal</h3>
                </div>
                <div className="mt-4 flex items-center text-[10px] font-black text-gray-400 uppercase">
                  <i className="fas fa-satellite mr-1"></i> RFID Synced
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 text-left">
              <div className="lg:col-span-3 bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-sm uppercase tracking-widest">Program Progress</h4>
                  <span className="text-[10px] font-black text-pasture bg-pasture/5 px-2 py-1 rounded-full uppercase">15% Done</span>
                </div>
                <div className="space-y-3">
                  {[
                    { title: "Livestock-to-Digital", status: "completed" },
                    { title: "Biological Growth", status: "active" },
                    { title: "Cooperative Voting", status: "pending" },
                    { title: "Defi Credit Line", status: "pending" }
                  ].map((mod, i) => (
                    <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${mod.status === 'active' ? 'border-pasture bg-pasture/5' : 'border-gray-50 opacity-60'}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${mod.status === 'completed' ? 'bg-pasture text-white' : mod.status === 'active' ? 'bg-pasture/20 text-pasture' : 'bg-gray-100 text-gray-300'}`}>
                          {mod.status === 'completed' ? <i className="fas fa-check"></i> : <span>0{i+1}</span>}
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-tight">{mod.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-gray-900 text-white p-8 rounded-3xl md:rounded-[2.5rem] shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pasture opacity-20 blur-3xl -mr-16 -mt-16"></div>
                  <div>
                    <h4 className="font-bold text-sm mb-4 uppercase tracking-widest flex items-center">
                      <i className="fas fa-external-link-alt text-cyan-400 mr-2 text-xs"></i> Mother Hub
                    </h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed mb-8">
                      For full Algorand ledger details and real-time biological metadata.
                    </p>
                  </div>
                  <a 
                    href="https://www.farmchain.uk" 
                    target="_blank" 
                    className="w-full bg-white text-gray-900 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-center shadow-xl hover:scale-[1.02] transition"
                  >
                    View Hub
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      case 'assets':
        return (
          <div className="space-y-8 animate-in fade-in duration-500 text-left">
            <h3 className="text-xl md:text-2xl font-black uppercase">Livestock Units</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: "ASA-77421", type: "Boran Heifer", weight: "245kg", val: 1200000 },
                { id: "ASA-88912", type: "Boran Heifer", weight: "210kg", val: 1200000 }
              ].map((asset, i) => (
                <div key={i} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm group">
                  <div className="h-40 bg-gray-100 relative">
                    <img 
                      src={`https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=400&auto=format&fit=crop`} 
                      alt="Asset" 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-700"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-gray-900">{asset.type}</span>
                      <span className="text-[8px] font-black text-pasture bg-pasture/5 px-2 py-0.5 rounded uppercase">Synced</span>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-left">
                        <span className="text-[8px] font-bold text-gray-400 uppercase block">Weight</span>
                        <span className="text-xs font-black">{asset.weight}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] font-bold text-gray-400 uppercase block">Equity</span>
                        <span className="text-xs font-black text-pasture">{formatNaira(asset.val).split('.')[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40 px-4">
            <i className="fas fa-people-group text-5xl mb-4"></i>
            <h3 className="text-lg font-black uppercase tracking-widest">Cooperative DAO</h3>
            <p className="text-xs mt-2 max-w-xs leading-relaxed uppercase font-bold tracking-tight">Voting and unit governance protocols coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-x-hidden px-4 md:px-0">
      <div className="bg-white border-b border-gray-100 pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
            <div className="flex items-center space-x-4 md:space-x-6">
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-pasture text-white flex items-center justify-center text-2xl md:text-3xl font-black shadow-xl">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-black text-gray-900 leading-tight uppercase tracking-tight">Steward Control</h1>
                <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">
                  <span className="text-pasture">{user.name}</span>
                  <span className="opacity-30">•</span>
                  <span>Cohort 24B</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-white border border-gray-100 p-2 px-3 rounded-xl flex items-center space-x-2 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Mother Sync Active</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-6 md:space-x-8 mt-10 overflow-x-auto no-scrollbar pb-1 border-b border-transparent">
            {[
              { id: 'overview', icon: 'fa-gauge-high', label: 'Overview' },
              { id: 'assets', icon: 'fa-cow', label: 'Units' },
              { id: 'learning', icon: 'fa-graduation-cap', label: 'Learn' },
              { id: 'finance', icon: 'fa-money-bill-transfer', label: 'Finance' },
              { id: 'community', icon: 'fa-people-group', label: 'Coop' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center space-x-2 pb-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-pasture text-pasture' : 'border-transparent text-gray-300 hover:text-gray-500'}`}
              >
                <i className={`fas ${tab.icon} text-xs`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8 md:mt-10">
        {renderContent()}
      </div>
    </div>
  );
};

export default StewardDashboard;
