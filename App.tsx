
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import SegmentationForm from './components/SegmentationForm';
import JourneyPage from './components/JourneyPage';
import Onboarding from './components/Onboarding';
import StewardDashboard from './components/StewardDashboard';
import Login from './components/Login';
import { UserProfile } from './types';
import { supabase } from './lib/supabase';

type Step = 'hero' | 'form' | 'journey' | 'onboarding' | 'dashboard' | 'login';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('hero');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchStewardProfile(session.user.id);
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchStewardProfile(session.user.id);
      } else {
        setUserProfile(null);
        setCurrentStep('hero');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchStewardProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('stewards')
      .select('*')
      .eq('id', userId)
      .single();

    if (data && !error) {
      setUserProfile({
        name: data.name,
        email: data.email,
        gender: data.gender,
        ageBand: data.age_band,
        selectedPathId: data.selected_path_id,
        hasPaid: data.has_paid
      });
      
      if (data.has_paid) {
        setCurrentStep('dashboard');
      } else if (data.selected_path_id) {
        setCurrentStep('onboarding');
      } else {
        setCurrentStep('journey');
      }
    }
  };

  const handleStartForm = () => setCurrentStep('form');
  const handleGoToLogin = () => setCurrentStep('login');
  const handleBackToHero = () => setCurrentStep('hero');
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    setCurrentStep('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentStep('journey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJourneyNext = () => {
    setCurrentStep('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOnboardingComplete = async (pathId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && userProfile) {
      const { error } = await supabase
        .from('stewards')
        .update({
          selected_path_id: pathId,
          has_paid: true
        })
        .eq('id', user.id);

      if (!error) {
        setUserProfile({ 
          ...userProfile, 
          selectedPathId: pathId, 
          hasPaid: true 
        });
        setCurrentStep('dashboard');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-earth flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-12 h-12 border-4 border-pasture/20 border-t-pasture rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Syncing Protocol...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      isLoggedIn={!!userProfile && currentStep === 'dashboard'} 
      onLoginClick={handleGoToLogin}
      onLogoutClick={handleLogout}
    >
      {currentStep === 'hero' && (
        <section className="relative overflow-hidden px-4">
          <div className="absolute -top-24 -right-24 w-64 md:w-96 h-64 md:h-96 bg-gold opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-48 md:w-64 h-48 md:h-64 bg-pasture opacity-10 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto py-16 md:py-32 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block bg-pasture/5 text-pasture px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 border border-pasture/10">
                On-chain Real World Assets (RWA)
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 md:mb-8 leading-tight">
                Build Real Wealth from <span className="text-pasture">Real Assets</span>.
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-4 md:mb-6 max-w-2xl mx-auto leading-relaxed font-medium">
                Own productive livestock, grow your income in 120 days, and use digital finance to unlock more opportunities.
              </p>
              <p className="text-sm md:text-base text-gray-500 mb-8 md:mb-12 max-w-xl mx-auto leading-relaxed italic">
                We’ve built the farms, the cooperatives, and the financial rails—so you can start small, grow fast, and build lasting wealth.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button 
                  onClick={handleStartForm}
                  className="w-full sm:w-auto bg-pasture text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl text-base md:text-lg font-bold hover:shadow-2xl hover:scale-105 transition shadow-xl shadow-pasture/20"
                >
                  Discover Your ₦ Path
                </button>
                <div 
                  onClick={handleGoToLogin}
                  className="flex items-center space-x-2 text-sm text-gray-400 cursor-pointer hover:text-pasture transition-colors py-2"
                >
                  <i className="fas fa-sign-in-alt text-pasture text-xl"></i>
                  <span className="font-bold uppercase tracking-widest text-[10px]">Sign In</span>
                </div>
              </div>
            </div>

            <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center md:text-left">
              {[
                { title: "Naira Liquidity", icon: "fa-money-bill-trend-up", color: "bg-blue-50 text-blue-600" },
                { title: "DAO Coops", icon: "fa-users-between-lines", color: "bg-orange-50 text-orange-600" },
                { title: "Smart Contracts", icon: "fa-code", color: "bg-green-50 text-green-600" },
                { title: "Mother Link", icon: "fa-external-link-alt", color: "bg-purple-50 text-purple-600" }
              ].map((f, i) => (
                <div key={i} className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col items-center md:items-start">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${f.color} rounded-xl flex items-center justify-center mb-3 md:mb-4 text-base md:text-xl`}>
                    <i className={`fas ${f.icon}`}></i>
                  </div>
                  <h4 className="font-bold text-gray-800 text-xs md:text-sm uppercase tracking-wider">{f.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {currentStep === 'login' && (
        <Login onBack={handleBackToHero} />
      )}

      {currentStep === 'form' && (
        <section className="py-12 md:py-24 bg-gray-50 px-4">
          <SegmentationForm onComplete={handleFormComplete} />
        </section>
      )}

      {currentStep === 'journey' && userProfile && (
        <JourneyPage user={userProfile} onNext={handleJourneyNext} />
      )}

      {currentStep === 'onboarding' && userProfile && (
        <section className="bg-gray-50">
          <Onboarding user={userProfile} onFinish={handleOnboardingComplete} />
        </section>
      )}

      {currentStep === 'dashboard' && userProfile && (
        <StewardDashboard user={userProfile} />
      )}
    </Layout>
  );
};

export default App;
