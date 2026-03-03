
import React, { useState, useEffect } from 'react';
import { UserProfile, ApprovalStatus } from '../types';
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

interface CurriculumDay {
  day: string;
  topic: string;
  detail: string;
}

interface CurriculumWeek {
  week: string;
  theme: string;
  days: CurriculumDay[];
}

interface PathOption {
  id: string;
  title: string;
  desc: string;
  icon: string;
  price: number;
  commitmentFee: number;
  ownershipModel: string;
  cohortDate: string;
  simpleExplain: string;
  benefits: string[];
  vibe: string;
  bestFor: string;
  curriculum: CurriculumWeek[];
}

const LAM_CURRICULUM: CurriculumWeek[] = [
  {
    week: "Week 1",
    theme: "The Architecture of Wealth",
    days: [
      { day: "Day 1", topic: "The New Asset Class", detail: "Why livestock outperforms traditional stocks and the Naira in an inflationary economy." },
      { day: "Day 2", topic: "The Biological Ledger", detail: "Understanding the 'Goat as a Bond'—how weight gain equals compounding interest." },
      { day: "Day 3", topic: "Digital Vaulting", detail: "Mastering the Blockchain dashboard. How to secure, track, and verify your assets from your phone." },
      { day: "Day 4", topic: "Risk Mitigation", detail: "The Science of Survival. How FarmChain manages mortality and disease to keep capital protected." },
      { day: "Day 5", topic: "The Fattening Formula", detail: "The math of Feed Conversion (FCR). Turning feed into premium protein and profit." },
      { day: "Day 6", topic: "Market Intelligence", detail: "Analyzing local demand vs. export standards. Knowing your 'Exit' before you start." },
      { day: "Day 7", topic: "Live Deployment", detail: "Virtual Barn Tour and matching your digital profile to your physical herd." }
    ]
  },
  {
    week: "Week 2",
    theme: "The DeFi & Scale Multiplier",
    days: [
      { day: "Day 8", topic: "Liquidity Without Selling", detail: "Intro to DeFi. How to keep your goats and still access cash for other needs." },
      { day: "Day 9", topic: "Collateralization 101", detail: "Using your 'growing' goats to secure loans for more livestock." },
      { day: "Day 10", topic: "Herd Velocity", detail: "Moving from a 'Single Unit' owner to a 'Portfolio Manager.' Strategy for doubling capacity." },
      { day: "Day 11", topic: "Tax & Structure", detail: "Structuring your livestock business for long-term wealth and intergenerational transfer." },
      { day: "Day 12", topic: "The Pipeline", detail: "Integrating into the FarmChain value chain—how we bypass middlemen to capture maximum profit." },
      { day: "Day 13", topic: "Portfolio Audit", detail: "Reviewing your initial fattening projections and setting your 120-day 'Harvest' goals." },
      { day: "Day 14", topic: "Commissioning", detail: "Official induction as a Certified Asset Manager in the FarmChain Coop." }
    ]
  }
];

const PATH_OPTIONS: PathOption[] = [
  { 
    id: 'asset', 
    title: "The Sovereign Owner", 
    desc: "Full ownership. Full profit. Full control.", 
    icon: "fa-crown", 
    price: 2400000,
    commitmentFee: 240000,
    ownershipModel: "Full Ownership",
    cohortDate: "Nov 15, 2024",
    vibe: "Independence & Maximum Yield",
    simpleExplain: "This is for the investor ready to take full control of their financial future. You acquire a full livestock unit (one goat) dedicated solely to your portfolio. You get the 14-day intensive mastery training, the 120-day professional fattening management, and 100% of the returns upon exit.",
    bestFor: "Individuals looking to build a personal livestock empire and maximize their DeFi borrowing power.",
    benefits: ["100% of Returns", "Maximum DeFi Borrowing Power", "Direct Portfolio Control"],
    curriculum: LAM_CURRICULUM
  },
  { 
    id: 'coop', 
    title: "The Syndicate", 
    desc: "Co-Ownership (Fractional Entry). Growth through community.", 
    icon: "fa-users-line", 
    price: 800000,
    commitmentFee: 80000,
    ownershipModel: "Collective Ownership",
    cohortDate: "Dec 01, 2024",
    vibe: "Community & Collaboration",
    simpleExplain: "Wealth is better built together. This pathway allows you to split the cost and ownership of a livestock unit with a friend or partner. You both get access to the cohort education and track the same asset on your dashboards. It’s the perfect 'low-friction' entry to test the system and grow your confidence.",
    bestFor: "First-timers, students, or friends who want to 'learn the ropes' with shared risk.",
    benefits: ["Lower Entry Barrier", "Shared Risk Management", "Collaborative Growth Track"],
    curriculum: LAM_CURRICULUM
  },
  { 
    id: 'learn', 
    title: "The Learner Track", 
    desc: "Foundational Access. Focus on strategy before deployment.", 
    icon: "fa-book-open-reader", 
    price: 240000,
    commitmentFee: 24000,
    ownershipModel: "Education Only",
    cohortDate: "Oct 30, 2024",
    vibe: "Knowledge & Readiness",
    simpleExplain: "You aren't ready to manage a physical asset yet, but you recognize that knowledge is the ultimate leverage. You get full access to the 14-day Livestock Asset Manager (LAM) curriculum. You’ll learn the DeFi strategies, the fattening science, and the market mechanics so that when you are ready to deploy capital, you hit the ground running.",
    bestFor: "Those currently building up capital or curious skeptics who want to see 'proof of concept' before investing.",
    benefits: ["Full Mastery Curriculum", "Future Capital Priority", "DeFi Strategy Certification"],
    curriculum: LAM_CURRICULUM
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ user, onFinish }) => {
  const [step, setStep] = useState(1);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(user.selectedPathId || null);
  const [commitmentNote, setCommitmentNote] = useState('');
  const [status, setStatus] = useState<ApprovalStatus>(user.approvalStatus || 'pending');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [detailPath, setDetailPath] = useState<PathOption | null>(null);
  const [curriculumPath, setCurriculumPath] = useState<PathOption | null>(null);

  useEffect(() => {
    if (user.approvalStatus === 'applied') setStep(4);
    if (user.approvalStatus === 'approved') setStep(5);
    if (user.selectedPathId && !user.approvalStatus) setStep(3);
  }, [user.approvalStatus, user.selectedPathId]);

  const selectedPath = PATH_OPTIONS.find(p => p.id === selectedPathId);

  const steps = [
    { id: 1, title: "Identity", icon: "fa-user-check" },
    { id: 2, title: "Select Path", icon: "fa-map-signs" },
    { id: 3, title: "Apply", icon: "fa-file-signature" },
    { id: 4, title: "Vetting", icon: "fa-shield-halved" },
    { id: 5, title: "Enroll", icon: "fa-credit-card" }
  ];

  const handleApply = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const tempProfile = JSON.parse(localStorage.getItem('temp_discovery_profile') || '{}');
        await supabase.from('stewards').upsert({
          id: authUser.id,
          email: authUser.email || user.email,
          name: tempProfile.name || user.name,
          phone: tempProfile.phone || user.phone,
          gender: tempProfile.gender || user.gender,
          age_band: tempProfile.ageBand || user.ageBand,
          selected_path_id: selectedPathId,
          commitment_note: commitmentNote,
          approval_status: 'applied'
        }, { onConflict: 'id' });
      }
    } catch (e) {
      console.warn("Sync deferred.");
    }
    setStatus('applied');
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
    }, 1500);
  };

  const handleSimulateApproval = () => {
    setStatus('approved');
    setStep(5);
  };

  const loadKorapaySdk = async () => {
    if (window.Korapay) return true;

    return new Promise<boolean>((resolve) => {
      const existingScript = document.querySelector('script[data-korapay-sdk="true"]') as HTMLScriptElement | null;
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true), { once: true });
        existingScript.addEventListener('error', () => resolve(false), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.korapay.com/v1/korapay.min.js';
      script.async = true;
      script.dataset.korapaySdk = 'true';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (isFull: boolean) => {
    if (!selectedPath) return;
    setIsPaying(true);
    const amount = isFull ? selectedPath.price : selectedPath.commitmentFee;

    const processSuccess = () => {
      setIsPaying(false);
      setShowSuccess(true);
      setTimeout(() => {
        onFinish?.(selectedPathId!);
      }, 2500);
    };

    const hasKorapay = await loadKorapaySdk();

    if (hasKorapay && window.Korapay) {
      window.Korapay.initialize({
        key: "pk_test_placeholder_key",
        reference: `FC_${Date.now()}`,
        amount,
        currency: "NGN",
        customer: { name: user.name, email: user.email },
        onSuccess: processSuccess,
        onClose: () => setIsPaying(false)
      });
    } else {
      setTimeout(processSuccess, 1500);
    }
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };

  const renderDetailModal = () => {
    if (!detailPath) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setDetailPath(null)}></div>
        <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
          <div className="p-8 md:p-12">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-pasture/10 text-pasture rounded-2xl flex items-center justify-center text-2xl">
                <i className={`fas ${detailPath.icon}`}></i>
              </div>
              <button onClick={() => setDetailPath(null)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="mb-2">
              <span className="text-[10px] font-black text-pasture uppercase tracking-widest bg-pasture/5 px-3 py-1 rounded-full">{detailPath.vibe}</span>
            </div>
            <h3 className="text-2xl font-bold uppercase mb-4 tracking-tight">{detailPath.title}</h3>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">{detailPath.simpleExplain}</p>
            
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-8">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Best For</h4>
              <p className="text-[11px] font-bold text-gray-800 leading-tight">{detailPath.bestFor}</p>
            </div>

            <div className="space-y-3 mb-8">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-pasture">Key Benefits</h4>
              {detailPath.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-[8px] text-green-600">
                    <i className="fas fa-check"></i>
                  </div>
                  <span className="text-xs font-bold text-gray-800">{benefit}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { setSelectedPathId(detailPath.id); setDetailPath(null); }} className="w-full bg-pasture text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:brightness-110 transition shadow-xl shadow-pasture/20">Choose this Path</button>
          </div>
        </div>
      </div>
    );
  };

  const renderCurriculumModal = () => {
    if (!curriculumPath) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto pt-10 pb-10">
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setCurriculumPath(null)}></div>
        <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in slide-in-from-bottom duration-400">
          <div className="p-8 md:p-12">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl font-bold uppercase tracking-tight">LAM Mastery Program</h3>
                <p className="text-[10px] font-black text-pasture uppercase tracking-widest mt-1">Livestock Asset Manager Certification</p>
              </div>
              <button onClick={() => setCurriculumPath(null)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="space-y-12">
              {curriculumPath.curriculum.map((week, wIdx) => (
                <div key={wIdx} className="space-y-6">
                  <div className="flex items-center space-x-4 border-b border-gray-100 pb-2">
                    <span className="bg-pasture text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{week.week}</span>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{week.theme}</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {week.days.map((day, dIdx) => (
                      <div key={dIdx} className="flex space-x-4 items-start group">
                        <div className="text-[10px] font-black text-gold/60 w-12 shrink-0 pt-1 group-hover:text-gold transition-colors">{day.day}</div>
                        <div>
                          <h5 className="text-[11px] font-bold text-gray-800 uppercase tracking-tight mb-1">{day.topic}</h5>
                          <p className="text-[10px] text-gray-500 leading-relaxed">{day.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="bg-pasture/5 p-8 rounded-[2rem] border-2 border-dashed border-pasture/20">
                <h4 className="text-xs font-black text-pasture uppercase tracking-widest mb-4 flex items-center">
                  <i className="fas fa-hand-holding-heart mr-3"></i>
                  The 120-Day "Hand-Holding" Promise
                </h4>
                <div className="space-y-4">
                  <p className="text-[11px] text-gray-700 leading-relaxed italic">
                    "After the 14-day intensive, we don't leave you. We hold your hand through the entire **90-120 day fattening window.** You’ll receive bi-weekly growth reports, real-time data, and strategic advisory until your asset hits the market and the profit hits your wallet."
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
               <button 
                 onClick={() => setCurriculumPath(null)}
                 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-200 hover:text-pasture hover:border-pasture transition-all pb-1"
               >
                 Close Curriculum
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 py-20 animate-in zoom-in duration-500 text-center px-4">
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-green-500 text-white rounded-full flex items-center justify-center text-4xl md:text-5xl shadow-2xl animate-bounce">
            <i className="fas fa-check"></i>
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-25"></div>
        </div>
        <div className="space-y-4">
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-gray-900">Payment Verified</h3>
          <p className="text-gray-500 text-sm md:text-base font-medium max-w-sm mx-auto">
            Securely minting your digital assets on Algorand... <br/> 
            Building your Steward Dashboard.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-[10px] font-black text-pasture uppercase tracking-[0.2em] bg-pasture/5 px-6 py-3 rounded-full">
           <i className="fas fa-circle-notch animate-spin"></i>
           <span>Initializing Mother Sync</span>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 px-2">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl md:text-3xl">
              <i className="fas fa-id-card"></i>
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-tight">Identity Anchored</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
              Welcome back, {user.name.split(' ')[0]}. Your identity protocol is active.
            </p>
            <button onClick={() => setStep(2)} className="w-full md:w-auto bg-pasture text-white px-12 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition shadow-xl shadow-pasture/10">
              Pick Strategy
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 w-full px-2">
            <div className="text-center">
              <h3 className="text-2xl font-bold uppercase mb-2">Select Your Path</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Only approved stewards can deploy capital</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PATH_OPTIONS.map(path => (
                <div 
                  key={path.id} 
                  className={`p-6 rounded-3xl border-2 transition text-left flex flex-col h-full group ${selectedPathId === path.id ? 'border-pasture bg-pasture/5 shadow-xl' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedPathId === path.id ? 'bg-pasture text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100 transition-colors'}`}>
                      <i className={`fas ${path.icon} text-sm`}></i>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setDetailPath(path); }}
                        className="text-[8px] font-black uppercase tracking-widest text-pasture/60 hover:text-pasture transition-colors bg-pasture/5 hover:bg-pasture/10 px-2 py-1.5 rounded-lg flex items-center space-x-1.5"
                      >
                        <i className="fas fa-info-circle text-[7px]"></i>
                        <span>What is this?</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setCurriculumPath(path); }}
                        className="text-[8px] font-black uppercase tracking-widest text-gold/80 hover:text-gold transition-colors bg-gold/5 hover:bg-gold/10 px-2 py-1.5 rounded-lg flex items-center space-x-1.5"
                      >
                        <i className="fas fa-graduation-cap text-[7px]"></i>
                        <span>LAM Roadmap</span>
                      </button>
                    </div>
                  </div>
                  <div className="cursor-pointer flex-grow" onClick={() => setSelectedPathId(path.id)}>
                    <div className="mb-2">
                       <span className={`text-[8px] font-black uppercase tracking-widest ${selectedPathId === path.id ? 'text-pasture' : 'text-gray-400'}`}>{path.vibe}</span>
                    </div>
                    <h4 className="font-bold mb-1 text-sm uppercase tracking-tight">{path.title}</h4>
                    <div className="text-pasture font-black text-lg mb-4">{formatNaira(path.price).split('.')[0]}</div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">{path.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button disabled={!selectedPathId} onClick={() => setStep(3)} className="w-full md:w-auto bg-pasture text-white px-16 py-5 rounded-2xl font-black uppercase tracking-widest text-xs disabled:opacity-50 transition">
                Continue to Application
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 max-w-xl mx-auto animate-in fade-in slide-in-from-right-4 text-left px-2">
            <div className="text-center">
              <h3 className="text-2xl font-bold uppercase">Soft Commitment</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Tell us why you want to be a Steward</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-earth rounded-2xl border border-pasture/10">
                <span className="text-[10px] font-black text-pasture uppercase tracking-widest">Protocol Question</span>
                <p className="text-xs font-bold text-gray-800 mt-1">What is your 120-day goal for this cohort?</p>
              </div>
              <textarea 
                className="w-full p-6 rounded-3xl border border-gray-200 outline-none focus:ring-4 focus:ring-pasture/5 text-sm h-40 resize-none font-medium"
                placeholder="Ex: I want to build a compounding herd of 5 Boran heifers..."
                value={commitmentNote}
                onChange={e => setCommitmentNote(e.target.value)}
              />
              <button 
                onClick={handleApply}
                disabled={!commitmentNote || isSubmitting}
                className="w-full bg-pasture text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-pasture/20 hover:brightness-110 active:scale-95 transition-all overflow-hidden"
              >
                {isSubmitting ? <div className="flex items-center justify-center space-x-3"><i className="fas fa-circle-notch animate-spin"></i><span>LOGGING COMMITMENT...</span></div> : "Submit Commitment"}
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 text-center animate-in fade-in duration-700 px-4">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner animate-pulse">
                <i className="fas fa-shield-halved"></i>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">
                <i className="fas fa-search text-[10px]"></i>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold uppercase">Application Under Review</h3>
              <p className="text-gray-500 text-xs max-w-sm mx-auto leading-relaxed">
                The Farmchain Council is reviewing your commitment. We'll follow up on <strong>{user.phone || "your phone number"}</strong> shortly.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200 max-w-xs mx-auto">
                 <div className="flex items-center space-x-3 text-left">
                    <div className="w-1.5 h-1.5 bg-pasture rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Checking Protocol Whitelist...</span>
                 </div>
              </div>
              <a href={`https://wa.me/2340000000000?text=Hi Farmchain, I just applied as a steward! My name is ${user.name}`} target="_blank" className="inline-flex items-center space-x-3 bg-green-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-green-500/10 hover:brightness-110 transition">
                <i className="fab fa-whatsapp text-lg"></i><span>Speed up Approval</span>
              </a>
            </div>
            <div className="pt-4">
              <button onClick={handleSimulateApproval} className="text-[10px] font-black text-pasture/40 uppercase tracking-widest border-b-2 border-pasture/10 hover:text-pasture transition pb-1">(Dev Mode: Force Approval)</button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 text-left px-4">
            <div className="bg-green-500 text-white p-6 rounded-[2rem] flex items-center justify-between shadow-xl shadow-green-500/10">
              <div className="flex items-center space-x-4">
                <i className="fas fa-check-circle text-2xl"></i>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-widest">Status: Approved</h4>
                  <p className="text-[10px] opacity-80 uppercase font-bold">You are cleared for Enrollment</p>
                </div>
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Cohort 24B</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border-2 border-pasture shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 bg-pasture text-white text-[9px] font-black uppercase px-4 py-1.5 rounded-bl-xl">Recommended</div>
                <div>
                  <h5 className="font-bold text-gray-900 mb-2 uppercase text-sm">Strategic Start</h5>
                  <p className="text-[10px] text-gray-500 leading-relaxed mb-6">Pay a commitment fee to secure your spot and start the curriculum immediately.</p>
                  <div className="text-2xl font-black text-pasture mb-6">{formatNaira(selectedPath?.commitmentFee || 0).split('.')[0]}</div>
                </div>
                <button disabled={isPaying} onClick={() => handlePayment(false)} className="w-full bg-pasture text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition shadow-lg shadow-pasture/10">
                  {isPaying ? <i className="fas fa-circle-notch animate-spin"></i> : "Start Now"}
                </button>
              </div>
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-gray-900 mb-2 uppercase text-sm">Full Enrollment</h5>
                  <p className="text-[10px] text-gray-500 leading-relaxed mb-6">Settle the full protocol fee now and unlock your Digital Asset Dashboard instantly.</p>
                  <div className="text-2xl font-black text-gray-900 mb-6">{formatNaira(selectedPath?.price || 0).split('.')[0]}</div>
                </div>
                <button disabled={isPaying} onClick={() => handlePayment(true)} className="w-full bg-gray-900 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition">
                  {isPaying ? <i className="fas fa-circle-notch animate-spin"></i> : "Full Access"}
                </button>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="py-12 md:py-20 px-4 max-w-7xl mx-auto">
      {renderDetailModal()}
      {renderCurriculumModal()}
      <div className="flex justify-between items-center mb-12 md:mb-20 relative px-2 md:px-24">
        <div className="absolute left-8 right-8 md:left-24 md:right-24 h-1 bg-gray-100 top-1/2 -translate-y-1/2 -z-10 rounded-full">
           <div className="h-full bg-pasture transition-all duration-700 ease-in-out rounded-full" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>
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
      <div className="bg-white p-6 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-gray-100 min-h-[500px] flex items-center justify-center relative overflow-hidden">
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
