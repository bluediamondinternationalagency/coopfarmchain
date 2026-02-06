
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    Korapay: any;
  }
}

interface OnboardingProps {
  user: UserProfile;
  onFinish?: (pathId: string) => void;
}

interface PathOption {
  id: string;
  title: string;
  desc: string;
  icon: string;
  price: number;
  ownershipModel: string;
  cohortDate: string;
  wealthImpact: string;
}

const UNIFIED_CURRICULUM = [
  "Biological Compounding",
  "RFID-to-Blockchain (farmchain.uk)",
  "Common Facility Ranch (CFR)",
  "Algorand DeFi",
  "Global Logistics"
];

const PATH_OPTIONS: PathOption[] = [
  { 
    id: 'asset', 
    title: "Direct Tokenization", 
    desc: "1:1 Ownership. Your livestock is minted as a unique NFT on Algorand.", 
    icon: "fa-cow", 
    price: 2400000,
    ownershipModel: "Sole Steward",
    cohortDate: "Nov 15, 2024",
    wealthImpact: "100% ROI growth."
  },
  { 
    id: 'coop', 
    title: "Fractional Coop", 
    desc: "Shared Asset Pool. You and 9 partners share fractional tokens.", 
    icon: "fa-users", 
    price: 800000,
    ownershipModel: "DAO Cooperative",
    cohortDate: "Dec 01, 2024",
    wealthImpact: "Shared yields."
  },
  { 
    id: 'learn', 
    title: "Knowledge Entry", 
    desc: "Protocol certification. Build capital and earn Soulbound tokens.", 
    icon: "fa-graduation-cap", 
    price: 240000,
    ownershipModel: "Education Path",
    cohortDate: "Oct 30, 2024",
    wealthImpact: "Managed grants."
  }
];

interface CoopMember {
  name: string;
  email: string;
  amount: number;
}

const Onboarding: React.FC<OnboardingProps> = ({ user, onFinish }) => {
  const [step, setStep] = useState(1);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(user.selectedPathId || null);
  const [isPaying, setIsPaying] = useState(false);
  const [showCurriculum, setShowCurriculum] = useState(false);
  
  const [coopMembers, setCoopMembers] = useState<CoopMember[]>([]);
  const [newMember, setNewMember] = useState<CoopMember>({ name: '', email: '', amount: 0 });

  useEffect(() => {
    const ensureProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const temp = localStorage.getItem('temp_discovery_profile');
        const discoveryData = temp ? JSON.parse(temp) : {};
        
        await supabase.from('stewards').upsert({
          id: session.user.id,
          email: session.user.email,
          name: user.name || discoveryData.name,
          gender: user.gender || discoveryData.gender,
          age_band: user.ageBand || discoveryData.ageBand,
        });
        
        localStorage.removeItem('temp_discovery_profile');
      }
    };
    ensureProfile();
  }, []);

  const selectedPath = PATH_OPTIONS.find(p => p.id === selectedPathId);
  const totalCoopContributed = coopMembers.reduce((sum, m) => sum + m.amount, 0);

  const steps = [
    { id: 1, title: "Identity", icon: "fa-user-check" },
    { id: 2, title: "Path", icon: "fa-map-signs" },
    { id: 3, title: "Group", icon: "fa-users-plus" },
    { id: 4, title: "Pay", icon: "fa-credit-card" },
    { id: 5, title: "End", icon: "fa-rocket" }
  ];

  const handleAddMember = () => {
    if (newMember.name && newMember.email && newMember.amount > 0) {
      setCoopMembers([...coopMembers, newMember]);
      setNewMember({ name: '', email: '', amount: 0 });
    }
  };

  const handlePayment = async () => {
    if (!selectedPath) return;
    setIsPaying(true);

    if (window.Korapay) {
      window.Korapay.initialize({
        key: "pk_test_placeholder_key",
        reference: `farmchain_${Date.now()}`,
        amount: selectedPath.price,
        currency: "NGN",
        customer: { name: user.name, email: user.email },
        onClose: () => setIsPaying(false),
        onSuccess: async () => {
          setIsPaying(false);
          setStep(5);
        },
        onFailed: () => {
          setIsPaying(false);
          alert("Payment failed. Please try again.");
        }
      });
    } else {
      setTimeout(() => {
        setIsPaying(false);
        setStep(5);
      }, 2000);
    }
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 px-2">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl md:text-3xl">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Identity Verified</h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Your profile is now permanently anchored to the <strong>Farmchain Mother Protocol</strong>.
            </p>
            <div className="pt-8">
              <button onClick={() => setStep(2)} className="w-full md:w-auto bg-pasture text-white px-12 py-4 rounded-xl font-bold hover:scale-105 transition shadow-lg shadow-pasture/20 uppercase text-xs tracking-widest">
                Continue
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 w-full">
            <div className="bg-pasture/5 p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-pasture/10 flex flex-col md:flex-row items-center justify-between gap-4 text-left">
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1 text-sm uppercase">Master Program</h4>
                <p className="text-[10px] text-gray-500 leading-tight">
                  Your choice determines how your <strong>Livestock Tokens (ASAs)</strong> are managed.
                </p>
              </div>
              <button 
                onClick={() => setShowCurriculum(!showCurriculum)}
                className="text-pasture text-[10px] font-black uppercase tracking-widest border-b-2 border-pasture/20 hover:border-pasture transition self-start md:self-center"
              >
                {showCurriculum ? 'Hide' : 'View Curriculum'}
              </button>
            </div>

            {showCurriculum && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in duration-300 text-left">
                {UNIFIED_CURRICULUM.map((item, i) => (
                  <div key={i} className="bg-white border border-gray-100 p-3 rounded-xl flex items-center space-x-3 shadow-sm">
                    <div className="text-pasture font-bold text-[10px]">0{i+1}</div>
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">{item}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {PATH_OPTIONS.map(path => (
                <div 
                  key={path.id} 
                  onClick={() => setSelectedPathId(path.id)}
                  className={`group p-6 rounded-3xl border-2 transition relative flex flex-col h-full cursor-pointer text-left ${selectedPathId === path.id ? 'border-pasture bg-pasture/5 shadow-xl shadow-pasture/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${selectedPathId === path.id ? 'bg-pasture text-white' : 'bg-gray-50 text-gray-400'}`}>
                    <i className={`fas ${path.icon} text-sm`}></i>
                  </div>
                  <h4 className="font-bold mb-1 text-gray-900 text-sm uppercase tracking-tight">{path.title}</h4>
                  <div className="text-pasture font-black text-lg mb-4">{formatNaira(path.price).split('.')[0]}</div>
                  <p className="text-[10px] text-gray-600 leading-relaxed mb-4 flex-grow">{path.desc}</p>
                  <div className={`w-full h-10 rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest ${selectedPathId === path.id ? 'bg-pasture text-white' : 'bg-gray-50 text-gray-300'}`}>
                    {selectedPathId === path.id ? 'Selected' : 'Select Path'}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <button 
                disabled={!selectedPathId}
                onClick={() => setStep(3)}
                className="w-full md:w-auto bg-pasture text-white px-16 py-5 rounded-2xl font-black uppercase tracking-widest text-xs disabled:opacity-50 hover:shadow-2xl hover:scale-[1.02] transition shadow-xl shadow-pasture/20"
              >
                Strategy Setup
              </button>
            </div>
          </div>
        );
      case 3:
        if (selectedPathId === 'coop') {
          return (
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 w-full px-2">
              <div className="text-center">
                <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest mb-4 inline-block">Cooperative Hub</span>
                <h3 className="text-xl md:text-2xl font-bold uppercase">Manage Shared Unit</h3>
                <p className="text-gray-500 text-[10px] max-w-md mx-auto leading-relaxed">
                  As the Farmchain Lead, log partners who will receive fractional tokens on-chain.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
                <div className="lg:col-span-5 bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100">
                  <h5 className="font-bold text-xs mb-6 uppercase tracking-widest flex items-center">
                    <i className="fas fa-plus-circle mr-2 text-pasture"></i> Log Partner
                  </h5>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Name</label>
                      <input 
                        type="text" 
                        placeholder="Michael Smith" 
                        className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-pasture/20 transition text-sm font-medium"
                        value={newMember.name}
                        onChange={e => setNewMember({...newMember, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email</label>
                      <input 
                        type="email" 
                        placeholder="michael@email.com" 
                        className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-pasture/20 transition text-sm font-medium"
                        value={newMember.email}
                        onChange={e => setNewMember({...newMember, email: e.target.value})}
                      />
                    </div>
                    <button 
                      onClick={handleAddMember}
                      className="w-full bg-pasture text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-opacity-90 shadow-lg shadow-pasture/10 transition mt-4"
                    >
                      Add Partner
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="flex justify-between items-end">
                    <h5 className="font-bold text-xs uppercase tracking-widest">Unit Partners ({coopMembers.length}/9)</h5>
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    {coopMembers.length === 0 ? (
                      <div className="py-12 text-center text-gray-300 italic text-xs border-2 border-dashed border-gray-100 rounded-3xl">
                        No partners logged yet.
                      </div>
                    ) : (
                      coopMembers.map((m, i) => (
                        <div key={i} className="bg-white border border-gray-50 p-4 rounded-2xl flex justify-between items-center shadow-sm">
                          <div>
                            <div className="font-bold text-[11px] text-gray-900 uppercase">{m.name}</div>
                            <div className="text-[9px] text-gray-400 lowercase">{m.email}</div>
                          </div>
                          <button className="text-red-300 hover:text-red-500"><i className="fas fa-trash-alt text-xs"></i></button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button onClick={() => setStep(4)} className="w-full md:w-auto bg-pasture text-white px-16 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-pasture/20 hover:scale-105 transition">
                  Confirm Group
                </button>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4 px-2">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto text-2xl md:text-3xl">
              <i className="fas fa-fingerprint"></i>
            </div>
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Protocol Sync</h3>
            <p className="text-gray-500 text-[10px] max-w-xs mx-auto leading-relaxed">
              Syncing your biological and digital twins at <strong>farmchain.uk</strong>.
            </p>
            <div className="p-10 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50 max-w-xs mx-auto flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-pasture animate-spin mb-4"></div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Finalizing Ledger...</span>
            </div>
            <div className="pt-4">
              <button onClick={() => setStep(4)} className="w-full md:w-auto bg-pasture text-white px-16 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-pasture/20 transition">
                Proceed to Payment
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 max-w-lg mx-auto animate-in fade-in slide-in-from-right-4 text-left px-2">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold uppercase tracking-tight">Secure Enrollment</h3>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">Capital Deployment Phase</p>
            </div>

            <div className="bg-gray-50 p-8 md:p-10 rounded-3xl border border-gray-100 mb-6 relative overflow-hidden shadow-inner">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest">Steward</span>
                  <span className="font-bold text-xs uppercase">{user.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest">On-chain Path</span>
                  <span className="font-bold text-xs text-pasture uppercase">{selectedPath?.title}</span>
                </div>
                
                <div className="h-px bg-gray-200 my-4"></div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-gray-900 font-black block text-xs uppercase tracking-tight">Total Fee</span>
                    <span className="text-[9px] text-gray-400 italic">Includes Protocol Certification</span>
                  </div>
                  <span className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter">{formatNaira(selectedPath?.price || 0).split('.')[0]}</span>
                </div>
              </div>
            </div>

            <button 
              disabled={isPaying}
              onClick={handlePayment}
              className="w-full bg-[#fa6338] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-3 hover:brightness-110 transition shadow-2xl shadow-orange-500/20"
            >
              {isPaying ? (
                <i className="fas fa-circle-notch animate-spin"></i>
              ) : (
                <><i className="fas fa-credit-card text-sm"></i><span>Pay with Naira</span></>
              )}
            </button>
            <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-6">Verified by Mother Protocol</p>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 animate-in zoom-in duration-500 w-full max-w-4xl text-center px-2">
            <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto text-3xl mb-6 shadow-inner ring-8 ring-gold/5">
              <i className="fas fa-rocket"></i>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">Protocol Live</h3>
            <p className="text-gray-500 max-w-lg mx-auto text-xs leading-relaxed uppercase tracking-wider font-bold">
              Your profile is now permanently whitelisted.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-10">
               <div className="bg-earth p-8 md:p-10 rounded-3xl border border-pasture/10 flex flex-col justify-between shadow-sm relative overflow-hidden text-left">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 uppercase text-xs">Command Center</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed mb-8">
                      Manage modules, cohort activities, and cooperative voting.
                    </p>
                  </div>
                  <button 
                    onClick={() => onFinish?.(selectedPathId || 'asset')}
                    className="w-full bg-pasture text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-pasture/20"
                  >
                    Enter
                  </button>
               </div>

               <div className="bg-gray-900 p-8 md:p-10 rounded-3xl text-white flex flex-col justify-between shadow-xl text-left">
                  <div>
                    <h4 className="font-bold mb-2 uppercase text-xs flex items-center">
                      Mother Farm <i className="fas fa-external-link-alt ml-2 text-[8px] text-cyan-400"></i>
                    </h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed mb-8">
                      Access the core Algorand ledger to view your tokens at farmchain.uk.
                    </p>
                  </div>
                  <a 
                    href="https://www.farmchain.uk" 
                    target="_blank"
                    className="w-full bg-white text-gray-900 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-center"
                  >
                    Blockchain Hub
                  </a>
               </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-12 md:py-20 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12 md:mb-20 relative px-2 md:px-24">
        <div className="absolute left-8 right-8 md:left-24 md:right-24 h-1 bg-gray-100 top-1/2 -translate-y-1/2 -z-10 rounded-full">
           <div 
             className="h-full bg-pasture transition-all duration-700 ease-in-out rounded-full" 
             style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
           ></div>
        </div>
        {steps.map(s => (
          <div key={s.id} className="flex flex-col items-center">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xs font-bold border-4 transition-all duration-500 ${step >= s.id ? 'bg-pasture text-white border-pasture scale-110 shadow-lg' : 'bg-white text-gray-200 border-gray-100'}`}>
              <i className={`fas ${s.icon}`}></i>
            </div>
            <span className={`hidden md:block text-[9px] mt-4 font-black uppercase tracking-[0.2em] ${step >= s.id ? 'text-pasture' : 'text-gray-300'}`}>{s.title}</span>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 md:p-20 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-gray-100 min-h-[500px] md:min-h-[650px] flex items-center justify-center overflow-hidden relative">
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
