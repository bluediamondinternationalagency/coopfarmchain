
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import SegmentationForm from './components/SegmentationForm';
import JourneyPage from './components/JourneyPage';
import Onboarding from './components/Onboarding';
import StewardDashboard from './components/StewardDashboard';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import { UserProfile } from './types';
import { supabase } from './lib/supabase';

type Step = 'hero' | 'form' | 'journey' | 'onboarding' | 'dashboard' | 'login' | 'admin-login' | 'admin';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('hero');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isAdminUrlRequested =
    typeof window !== 'undefined' &&
    (
      new URLSearchParams(window.location.search).get('admin') === '1' ||
      window.location.pathname === '/admin'
    );

  const syncTempProfileToDatabase = async (
    userId: string,
    fallbackEmail?: string | null,
    userMetadata?: Record<string, any>
  ) => {
    const saved = localStorage.getItem('temp_discovery_profile');

    try {
      const tempProfile = saved ? (JSON.parse(saved) as Partial<UserProfile>) : {};
      const metadata = userMetadata || {};
      await supabase
        .from('stewards')
        .upsert(
          {
            id: userId,
            email: tempProfile.email || fallbackEmail || '',
            name: tempProfile.name || metadata.name || '',
            phone: tempProfile.phone || metadata.phone || null,
            gender: tempProfile.gender || metadata.gender || null,
            age_band: tempProfile.ageBand || metadata.age_band || metadata.ageBand || null,
          },
          { onConflict: 'id' }
        );
    } catch (error) {
      console.warn('Temp profile sync failed:', error);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await syncTempProfileToDatabase(session.user.id, session.user.email, session.user.user_metadata as Record<string, any>);
        await fetchStewardProfile(session.user.id);
      } else {
        const saved = localStorage.getItem('temp_discovery_profile');
        if (saved) {
          setUserProfile(JSON.parse(saved));
        }
        if (isAdminUrlRequested) {
          setCurrentStep('admin-login');
        }
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await syncTempProfileToDatabase(session.user.id, session.user.email, session.user.user_metadata as Record<string, any>);
        await fetchStewardProfile(session.user.id);
      } else {
        setUserProfile(null);
        setCurrentStep(isAdminUrlRequested ? 'admin-login' : 'hero');
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
      const profile: UserProfile = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        ageBand: data.age_band,
        selectedPathId: data.selected_path_id,
        hasPaid: data.has_paid,
        approvalStatus: data.approval_status,
        isAdmin: data.is_admin || data.email === 'admin@farmchain.coop' // Support explicit flag or specific email
      };
      setUserProfile(profile);
      
      if (profile.isAdmin) {
        setCurrentStep('admin');
      } else if (data.has_paid) {
        setCurrentStep('dashboard');
      } else if (data.selected_path_id || data.approval_status === 'applied' || data.approval_status === 'approved') {
        setCurrentStep('onboarding');
      } else {
        setCurrentStep('journey');
      }
    }
  };

  const handleStartForm = () => setCurrentStep('form');
  const handleGoToLogin = () => setCurrentStep('login');
  const handleGoToAdminLogin = () => setCurrentStep('admin-login');
  const handleBackToHero = () => setCurrentStep('hero');
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('temp_discovery_profile');
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
    
    if (userProfile) {
      const updatedProfile = { 
        ...userProfile, 
        selectedPathId: pathId, 
        hasPaid: true,
        approvalStatus: 'enrolled' as const
      };
      setUserProfile(updatedProfile);
      localStorage.setItem('temp_discovery_profile', JSON.stringify(updatedProfile));
      setCurrentStep('dashboard');
    }

    if (user) {
      await supabase
        .from('stewards')
        .upsert({
          id: user.id,
          email: userProfile?.email || user.email || '',
          name: userProfile?.name || '',
          phone: userProfile?.phone || null,
          gender: userProfile?.gender || null,
          age_band: userProfile?.ageBand || null,
          selected_path_id: pathId,
          has_paid: true,
          approval_status: 'enrolled'
        }, { onConflict: 'id' });
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
      isLoggedIn={!!userProfile && (currentStep === 'dashboard' || currentStep === 'admin')} 
      onLoginClick={handleGoToLogin}
      onLogoutClick={handleLogout}
    >
      {currentStep === 'hero' && (
        <section className="relative overflow-hidden bg-earth">
          <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-[#f5efe1] rounded-full blur-[100px] -mr-[10%] -mt-[10%] opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-[30%] h-[40%] bg-[#e9f2e8] rounded-full blur-[100px] -ml-[5%] -mb-[5%] opacity-50"></div>

          <div className="max-w-7xl mx-auto py-24 md:py-32 px-6 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              <div className="flex justify-center mb-8">
                <span className="inline-block bg-white border border-gray-100 text-gray-500 px-6 py-2 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] shadow-sm">
                  On-chain Real World Assets (RWA)
                </span>
              </div>

              <h1 className="text-5xl md:text-8xl font-bold text-[#0f172a] mb-8 leading-[1.1] md:leading-[1.1] tracking-tight">
                Build Real Wealth from <br className="hidden md:block" /> 
                <span className="text-pasture">Real Assets.</span>
              </h1>

              <div className="max-w-3xl mx-auto bg-white/40 backdrop-blur-sm border border-white/60 p-6 md:p-8 rounded-2xl md:rounded-3xl mb-12 shadow-sm">
                 <p className="text-lg md:text-xl text-[#334155] leading-relaxed font-medium">
                  Own productive livestock, grow your income in 120 days, and use digital finance to unlock more opportunities.
                </p>
              </div>

              <p className="text-sm md:text-base text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed italic">
                We’ve built the farms, the cooperatives, and the financial rails—so you can start small, grow fast, and build lasting wealth.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
                <button 
                  onClick={handleStartForm}
                  className="w-full sm:w-auto bg-[#244b1f] text-white px-10 py-5 rounded-2xl text-lg font-bold hover:brightness-110 hover:shadow-2xl hover:scale-105 transition shadow-xl shadow-[#244b1f]/20 uppercase tracking-tight"
                >
                  Discover Your ₦ Path
                </button>
                <div 
                  onClick={handleGoToLogin}
                  className="flex items-center space-x-3 text-gray-400 cursor-pointer hover:text-pasture transition-all group py-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-pasture/10 group-hover:text-pasture transition-colors">
                    <i className="fas fa-sign-in-alt text-lg"></i>
                  </div>
                  <span className="font-black uppercase tracking-[0.2em] text-[10px]">Sign In</span>
                </div>
              </div>
            </div>

            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { title: "Naira Liquidity", icon: "fa-money-bill-trend-up", color: "bg-blue-50 text-blue-600" },
                { title: "DAO Coops", icon: "fa-users-between-lines", color: "bg-orange-50 text-orange-600" },
                { title: "Smart Contracts", icon: "fa-code", color: "bg-green-50 text-green-600" },
                { title: "Mother Link", icon: "fa-external-link-alt", color: "bg-purple-50 text-purple-600" }
              ].map((f, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center">
                  <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-4 text-xl shadow-inner`}>
                    <i className={`fas ${f.icon}`}></i>
                  </div>
                  <h4 className="font-black text-[#1e293b] text-[10px] uppercase tracking-[0.15em]">{f.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {currentStep === 'login' && (
        <Login onBack={handleBackToHero} />
      )}

      {currentStep === 'admin-login' && (
        <AdminLogin onBack={handleBackToHero} />
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

      {currentStep === 'admin' && userProfile?.isAdmin && (
        <AdminDashboard onClose={() => setCurrentStep('hero')} />
      )}

      {currentStep === 'hero' && isAdminUrlRequested && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleGoToAdminLogin}
            className="bg-pasture text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-pasture/20 hover:brightness-110 transition"
          >
            Admin Login
          </button>
        </div>
      )}
    </Layout>
  );
};

export default App;
