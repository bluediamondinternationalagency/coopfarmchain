
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setIsSent(true);
    }
    setIsProcessing(false);
  };

  if (isSent) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center animate-in zoom-in duration-500">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl">
            <i className="fas fa-paper-plane"></i>
          </div>
          <h2 className="text-3xl font-bold mb-4">Magic Link Sent</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            We've sent a login link to <strong>{email}</strong>. Check your inbox to securely access your steward dashboard.
          </p>
          <button onClick={onBack} className="text-xs font-black uppercase tracking-widest text-pasture">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-20 px-4 animate-in fade-in slide-in-from-bottom-8">
      <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
        <div className="w-20 h-20 bg-pasture/10 text-pasture rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-2xl">
          <i className="fas fa-user-shield"></i>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Steward Sign In</h2>
        <p className="text-gray-500 text-sm mb-10 leading-relaxed">
          Access your personalized wealth journey and cohort data using our secure passwordless login.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Work Email</label>
            <input
              required
              type="email"
              placeholder="name@example.com"
              className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-pasture/10 focus:border-pasture outline-none transition-all text-sm font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                <span>Send Magic Link</span>
                <i className="fas fa-bolt text-xs"></i>
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

export default Login;
