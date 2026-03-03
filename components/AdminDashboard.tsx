
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ApprovalStatus } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
}

interface StewardRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  age_band: string | null;
  approval_status: ApprovalStatus;
  commitment_note: string | null;
  created_at: string;
  updated_at: string;
  selected_path_id: string | null;
  has_paid: boolean;
  is_admin: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'stewards' | 'analytics'>('approvals');
  const [stewards, setStewards] = useState<StewardRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchStewards = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('stewards')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setStewards(data as StewardRecord[]);
    } else {
      setError(error?.message || 'Failed to load steward submissions.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStewards();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: ApprovalStatus) => {
    setActioningId(id);
    setNotice(null);
    setError(null);

    const { error } = await supabase
      .from('stewards')
      .update({ approval_status: newStatus })
      .eq('id', id);

    if (!error) {
      setStewards(prev => prev.map(s => s.id === id ? { ...s, approval_status: newStatus } : s));
      setNotice(`Submission status updated to ${newStatus}.`);
    } else {
      setError(error.message || 'Failed to update submission status.');
    }
    setActioningId(null);
  };

  const escapeCsvCell = (value: unknown) => {
    const stringValue = value === null || value === undefined ? '' : String(value);
    return `"${stringValue.replace(/"/g, '""')}"`;
  };

  const handleExportCsv = () => {
    if (!stewards.length) {
      setNotice('No submissions available to export.');
      return;
    }

    const header = [
      'id',
      'email',
      'name',
      'phone',
      'gender',
      'age_band',
      'selected_path_id',
      'approval_status',
      'has_paid',
      'commitment_note',
      'is_admin',
      'created_at',
      'updated_at'
    ];

    const rows = stewards.map((item) => [
      item.id,
      item.email,
      item.name,
      item.phone,
      item.gender,
      item.age_band,
      item.selected_path_id,
      item.approval_status,
      item.has_paid,
      item.commitment_note,
      item.is_admin,
      item.created_at,
      item.updated_at
    ]);

    const csv = [header, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stewards-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setNotice('Submission export downloaded.');
  };

  const stats = {
    pending: stewards.filter(s => s.approval_status === 'applied').length,
    approved: stewards.filter(s => s.approval_status === 'approved').length,
    enrolled: stewards.filter(s => s.approval_status === 'enrolled').length,
    total: stewards.length
  };

  const renderApprovals = () => {
    const pendingItems = stewards.filter(s => s.approval_status === 'applied');

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Vetting Queue</h1>
            <p className="text-gray-500 text-sm">Reviewing soft commitments and identity anchors for Cohort 24B.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchStewards}
              className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition"
            >
              Refresh
            </button>
            <button
              onClick={handleExportCsv}
              className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-pasture/20 bg-pasture/20 text-pasture hover:brightness-110 transition"
            >
              Export CSV
            </button>
            <span className="bg-pasture/20 text-pasture px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-pasture/20">
              {pendingItems.length} Pending Actions
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
        {notice && !error && (
          <div className="bg-pasture/10 border border-pasture/20 text-pasture text-xs px-4 py-3 rounded-xl">
            {notice}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <i className="fas fa-circle-notch animate-spin text-gray-700 text-3xl"></i>
          </div>
        ) : pendingItems.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-20 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
              <i className="fas fa-check-double text-2xl"></i>
            </div>
            <h3 className="text-white font-bold mb-2">Queue Clear</h3>
            <p className="text-gray-500 text-sm">All pending applications have been processed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingItems.map(item => (
              <div key={item.id} className="bg-gray-900 border border-gray-800 p-6 md:p-8 rounded-[2rem] hover:border-pasture/30 transition-all duration-300 group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start space-x-5">
                    <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center text-gray-500 shrink-0 border border-gray-700 font-bold">
                      {item.name.charAt(0)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-white font-bold text-lg">{item.name}</h4>
                        <span className="text-[9px] font-black text-gold uppercase tracking-widest bg-gold/5 px-2 py-0.5 rounded border border-gold/10">{item.age_band}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                        <span className="flex items-center"><i className="fas fa-envelope mr-1.5 text-pasture"></i> {item.email}</span>
                        <span className="flex items-center"><i className="fas fa-phone mr-1.5 text-pasture"></i> {item.phone}</span>
                        <span className="flex items-center"><i className="fas fa-calendar mr-1.5 text-pasture"></i> {new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      {item.commitment_note && (
                        <div className="mt-4 bg-black/40 p-4 rounded-xl border border-gray-800 italic text-gray-400 text-xs leading-relaxed">
                          "{item.commitment_note}"
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0 self-end lg:self-center">
                    <button 
                      disabled={actioningId === item.id}
                      onClick={() => handleUpdateStatus(item.id, 'pending')}
                      className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button 
                      disabled={actioningId === item.id}
                      onClick={() => handleUpdateStatus(item.id, 'approved')}
                      className="bg-pasture text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-pasture/20 transition-all disabled:opacity-50 flex items-center space-x-2"
                    >
                      {actioningId === item.id ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-check"></i>}
                      <span>Approve Steward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderStewards = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Protocol Registry</h1>
            <p className="text-gray-500 text-sm">Comprehensive list of all registered stewards across all lifecycle stages.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchStewards}
              className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition"
            >
              Refresh
            </button>
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-pasture/20 bg-pasture/20 text-pasture hover:brightness-110 transition"
            >
              Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
        {notice && !error && (
          <div className="bg-pasture/10 border border-pasture/20 text-pasture text-xs px-4 py-3 rounded-xl">
            {notice}
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/40 border-b border-gray-800">
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Steward</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Contact</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Path</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Payment</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Enrollment</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {stewards.map(s => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-700">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{s.name}</div>
                        <div className="text-[10px] text-gray-500 lowercase mt-0.5">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-[10px] text-gray-400 font-medium">
                    <div>{s.phone || '—'}</div>
                    <div className="uppercase tracking-widest text-[9px] text-gray-500 mt-1">{s.gender || s.age_band ? `${s.gender || '—'} / ${s.age_band || '—'}` : '—'}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                      s.approval_status === 'enrolled' ? 'bg-pasture/10 text-pasture border-pasture/20' :
                      s.approval_status === 'approved' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      s.approval_status === 'applied' ? 'bg-gold/10 text-gold border-gold/20' :
                      'bg-gray-800 text-gray-400 border-gray-700'
                    }`}>
                      {s.approval_status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {s.selected_path_id || 'Not Selected'}
                  </td>
                  <td className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">
                    <span className={s.has_paid ? 'text-pasture' : 'text-gray-500'}>
                      {s.has_paid ? 'Paid' : 'Not Paid'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-[10px] text-gray-500 font-medium">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 flex items-center gap-2">
                    <button
                      disabled={actioningId === s.id || s.approval_status === 'approved'}
                      onClick={() => handleUpdateStatus(s.id, 'approved')}
                      className="px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest text-pasture border border-pasture/20 hover:bg-pasture/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Approve
                    </button>
                    <button
                      disabled={actioningId === s.id || s.approval_status === 'pending'}
                      onClick={() => handleUpdateStatus(s.id, 'pending')}
                      className="px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-300 border border-gray-700 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Set Pending
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-950 flex flex-col animate-in fade-in zoom-in duration-300 overflow-hidden font-sans">
      <header className="h-20 border-b border-gray-900 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <div className="bg-pasture w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-pasture/20">
            <i className="fas fa-user-shield text-white text-sm"></i>
          </div>
          <div>
            <h2 className="text-white font-bold text-sm tracking-tight">Movement Command Center</h2>
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mt-0.5">Internal Admin System v2.0</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden lg:flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
             <div className="flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div><span>Mainnet Active</span></div>
             <div className="flex items-center space-x-2"><i className="fas fa-link text-pasture"></i><span>Algorand Sync 100%</span></div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-gray-500 hover:text-white transition border border-gray-800">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-72 border-r border-gray-900 p-8 space-y-6 bg-black/20">
          <div className="space-y-2">
            <h3 className="text-[9px] font-black text-gray-600 uppercase tracking-[0.25em] mb-4 ml-4">Main Menu</h3>
            <button 
              onClick={() => setActiveTab('approvals')}
              className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 flex items-center space-x-4 ${activeTab === 'approvals' ? 'bg-pasture text-white shadow-xl shadow-pasture/10' : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'}`}
            >
              <i className="fas fa-clipboard-check text-xs"></i>
              <span className="text-xs font-black uppercase tracking-widest">Approvals</span>
            </button>
            <button 
              onClick={() => setActiveTab('stewards')}
              className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 flex items-center space-x-4 ${activeTab === 'stewards' ? 'bg-pasture text-white shadow-xl shadow-pasture/10' : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'}`}
            >
              <i className="fas fa-id-card text-xs"></i>
              <span className="text-xs font-black uppercase tracking-widest">Steward List</span>
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 flex items-center space-x-4 ${activeTab === 'analytics' ? 'bg-pasture text-white shadow-xl shadow-pasture/10' : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'}`}
            >
              <i className="fas fa-chart-pie text-xs"></i>
              <span className="text-xs font-black uppercase tracking-widest">Analytics</span>
            </button>
          </div>

          <div className="pt-8 border-t border-gray-900">
            <h3 className="text-[9px] font-black text-gray-600 uppercase tracking-[0.25em] mb-4 ml-4">System Stats</h3>
            <div className="space-y-4 px-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase">Applied</span>
                <span className="text-xs text-white font-black">{stats.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase">Approved</span>
                <span className="text-xs text-white font-black">{stats.approved}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase">Enrolled</span>
                <span className="text-xs text-white font-black">{stats.enrolled}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto bg-[#030712] p-8 lg:p-12 custom-scrollbar">
          {activeTab === 'approvals' && renderApprovals()}
          {activeTab === 'stewards' && renderStewards()}
          {activeTab === 'analytics' && (
             <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in duration-700">
               <div className="w-24 h-24 bg-gold/5 text-gold rounded-[2rem] flex items-center justify-center text-4xl border border-gold/10">
                 <i className="fas fa-layer-group"></i>
               </div>
               <div className="space-y-2">
                 <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Aggregation in Progress</h2>
                 <p className="text-gray-500 text-sm max-w-sm">Generating biological performance metrics and financial leverage analytics for current cohort.</p>
               </div>
               <div className="flex items-center space-x-3 text-[9px] font-black text-pasture uppercase tracking-[0.2em] bg-pasture/5 px-6 py-3 rounded-full border border-pasture/10">
                  <i className="fas fa-circle-notch animate-spin"></i>
                  <span>Syncing RFID nodes</span>
               </div>
             </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
