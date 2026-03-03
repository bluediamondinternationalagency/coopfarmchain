import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AdminLoginProps {
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    const normalizedUsername = username.trim().toLowerCase();

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedUsername,
      password,
    });

    if (error) {
      setError(error.message || 'Invalid admin credentials.');
    }

    setIsProcessing(false);
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4 animate-in fade-in slide-in-from-bottom-8">
      <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
        <div className="w-20 h-20 bg-pasture/10 text-pasture rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-2xl">
          <i className="fas fa-user-lock"></i>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h2>
        <p className="text-gray-500 text-sm mb-10 leading-relaxed">
          Enter your admin username and password to access submission approvals and exports.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Username</label>
            <input
              required
              type="text"
              placeholder="admin@farmchain.coop"
              className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-pasture/10 focus:border-pasture outline-none transition-all text-sm font-medium"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="text-left">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Password</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-pasture/10 focus:border-pasture outline-none transition-all text-sm font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-[10px] font-bold p-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-pasture text-white font-bold py-5 rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-pasture/20 flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            {isProcessing ? (
              <i className="fas fa-circle-notch animate-spin"></i>
            ) : (
              <>
                <span>Sign In as Admin</span>
                <i className="fas fa-shield-halved text-xs"></i>
              </>
            )}
          </button>
        </form>

        <button
          onClick={onBack}
          className="mt-8 text-xs font-bold text-gray-400 hover:text-pasture transition-colors uppercase tracking-widest"
        >
          Cancel & Return
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
