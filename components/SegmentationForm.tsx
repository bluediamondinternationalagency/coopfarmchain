
import React, { useState } from 'react';
import { UserProfile, Gender, AgeBand } from '../types';
import { supabase } from '../lib/supabase';

interface SegmentationFormProps {
  onComplete: (profile: UserProfile) => void;
}

const SegmentationForm: React.FC<SegmentationFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    email: '',
    gender: 'male',
    ageBand: '21-35'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    
    // Save temp data for state persistence during auth flow
    localStorage.setItem('temp_discovery_profile', JSON.stringify(formData));

    // Initiate Magic Link in background for verification
    try {
      await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      // Simulate "Calculating" for immersive UX before moving to destination
      setTimeout(() => {
        onComplete(formData);
        setIsSubmitting(false);
      }, 1200);
      
    } catch (error) {
      console.error("Auth error:", error);
      // Fail gracefully: proceed to destination so user isn't stuck
      onComplete(formData);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-100 max-w-xl mx-auto text-left">
      <div className="text-center mb-8 md:mb-10">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 uppercase tracking-tight">Initialize Path</h3>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Protocol Registration Phase</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Steward Name</label>
          <input
            required
            type="text"
            className="w-full px-5 py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:ring-4 focus:ring-pasture/10 focus:border-pasture outline-none transition-all text-base md:text-sm font-medium bg-gray-50"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Active Email</label>
          <input
            required
            type="email"
            className="w-full px-5 py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:ring-4 focus:ring-pasture/10 focus:border-pasture outline-none transition-all text-base md:text-sm font-medium bg-gray-50"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Gender</label>
            <select
              className="w-full px-4 py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:ring-4 focus:ring-pasture/10 outline-none text-base md:text-sm font-medium bg-gray-50 h-[58px]"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Age Band</label>
            <select
              className="w-full px-4 py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:ring-4 focus:ring-pasture/10 outline-none text-base md:text-sm font-medium bg-gray-50 h-[58px]"
              value={formData.ageBand}
              onChange={(e) => setFormData({ ...formData, ageBand: e.target.value as AgeBand })}
            >
              <option value="16-20">16 - 20</option>
              <option value="21-35">21 - 35</option>
              <option value="36-50">36 - 50</option>
              <option value="50+">50+</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group w-full bg-pasture text-white font-black uppercase tracking-widest text-[11px] py-5 rounded-xl md:rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-pasture/20 flex items-center justify-center space-x-2 disabled:opacity-70 mt-4 overflow-hidden"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-3 animate-in fade-in zoom-in duration-300">
              <i className="fas fa-circle-notch animate-spin text-sm"></i>
              <span className="tracking-[0.2em]">LOADING...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>CALCULATE WEALTH PATH</span>
              <i className="fas fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
            </div>
          )}
        </button>
        
        <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">
           {isSubmitting ? "Taking to destination..." : "Protocol Security Enabled"}
        </p>
      </form>
    </div>
  );
};

export default SegmentationForm;
