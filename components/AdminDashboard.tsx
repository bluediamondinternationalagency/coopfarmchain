
import React, { useState } from 'react';
import { UserProfile, ApprovalStatus } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'cohorts' | 'system'>('approvals');

  const mockRequests = [
    { id: 1, name: "Sarah Chen", age: "21-35", type: "KYC Verification", status: "pending", time: "2h ago" },
    { id: 2, name: "Marcus Thorne", age: "16-20", type: "Asset Allocation", status: "pending", time: "4h ago" },
    { id: 3, name: "Elena Rodriguez", age: "36-50", type: "Cooperative Agreement", status: "pending", time: "1d ago" },
  ];

  const lifecycleStages = [
    { name: "Intake", desc: "Segmentation & Path Selection", owner: "Automated" },
    { name: "Verification", desc: "KYC & Identity Traceability", owner: "Risk Dept" },
    { name: "Asset Pairing", desc: "Linking Physical RFID to Digital Wallet", owner: "Ranch Manager" },
    { name: "Performance Audit", desc: "Quarterly Health & Growth Check", owner: "Vet/Manager" },
    { name: "Financial Leverage", desc: "Asset-Backed Credit Line Approval", owner: "Credit Committee" }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/95 flex flex-col animate-in fade-in zoom-in duration-300">
      <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900">
        <div className="flex items-center space-x-4">
          <div className="bg-pasture w-8 h-8 rounded flex items-center justify-center">
            <i className="fas fa-user-shield text-white text-xs"></i>
          </div>
          <h2 className="text-white font-bold">Movement Command Center <span className="text-gray-500 font-normal ml-2 text-xs">Internal Admin v1.2</span></h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition">
          <i className="fas fa-times"></i>
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 p-6 space-y-2">
          <button 
            onClick={() => setActiveTab('approvals')}
            className={`w-full text-left px-4 py-3 rounded-xl transition ${activeTab === 'approvals' ? 'bg-pasture text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <i className="fas fa-clipboard-check mr-3"></i> Pending Approvals
          </button>
          <button 
            onClick={() => setActiveTab('cohorts')}
            className={`w-full text-left px-4 py-3 rounded-xl transition ${activeTab === 'cohorts' ? 'bg-pasture text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <i className="fas fa-users mr-3"></i> Cohort Analytics
          </button>
          <button 
            onClick={() => setActiveTab('system')}
            className={`w-full text-left px-4 py-3 rounded-xl transition ${activeTab === 'system' ? 'bg-pasture text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <i className="fas fa-cogs mr-3"></i> System Health
          </button>
        </aside>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-950">
          {activeTab === 'approvals' && (
            <div className="space-y-8 max-w-5xl mx-auto">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Approval Queue</h1>
                  <p className="text-gray-500">Items requiring manual sign-off to advance the production cycle.</p>
                </div>
                <div className="flex space-x-2">
                  <span className="bg-pasture/20 text-pasture px-3 py-1 rounded-full text-xs font-bold">12 Active Tasks</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {mockRequests.map(req => (
                  <div key={req.id} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex items-center justify-between group hover:border-pasture/50 transition">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-500">
                        <i className="fas fa-user"></i>
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{req.name} <span className="text-gray-600 font-normal text-xs ml-2">({req.age})</span></h4>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                          <span className="flex items-center"><i className="fas fa-tag mr-1 text-gold"></i> {req.type}</span>
                          <span className="flex items-center"><i className="fas fa-clock mr-1"></i> {req.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-900/30 hover:text-red-400 transition">Reject</button>
                      <button className="bg-pasture text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-opacity-80 transition shadow-lg shadow-pasture/10">Approve</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-12 border-t border-gray-800">
                <h3 className="text-white font-bold text-xl mb-6">Program Lifecycle Flow</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {lifecycleStages.map((stage, idx) => (
                    <div key={idx} className="bg-gray-900 p-4 rounded-xl border border-gray-800 relative">
                      {idx < lifecycleStages.length - 1 && (
                        <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-gray-700">
                          <i className="fas fa-chevron-right"></i>
                        </div>
                      )}
                      <div className="text-[10px] font-bold text-gold uppercase mb-2">Stage {idx + 1}</div>
                      <h5 className="text-white font-bold text-sm mb-1">{stage.name}</h5>
                      <p className="text-[10px] text-gray-500 mb-3 leading-tight">{stage.desc}</p>
                      <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
                        <span className="text-[9px] text-gray-400 uppercase">Approver</span>
                        <span className="text-[9px] font-bold text-gray-300">{stage.owner}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cohorts' && (
            <div className="text-white text-center py-20">
              <i className="fas fa-chart-pie text-6xl text-gray-800 mb-4"></i>
              <h2 className="text-2xl font-bold">Analytics Loading</h2>
              <p className="text-gray-500">Gathering traceability data from active CFR facilities...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
