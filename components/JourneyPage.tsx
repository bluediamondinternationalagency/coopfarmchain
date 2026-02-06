
import React from 'react';
import { UserProfile } from '../types';
import { JOURNEY_DATA } from '../constants';

interface JourneyPageProps {
  user: UserProfile;
  onNext: () => void;
}

const JourneyPage: React.FC<JourneyPageProps> = ({ user, onNext }) => {
  const content = JOURNEY_DATA[user.ageBand];

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="bg-pasture py-24 px-4 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <i className="fas fa-link absolute top-10 left-10 text-9xl"></i>
          <i className="fas fa-shield-halved absolute bottom-10 right-10 text-9xl"></i>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block bg-gold px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-gold/20">
            STRATEGIC ROADMAP FOR {user.name.toUpperCase()}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {content.headline}
          </h1>
          <p className="text-xl text-pasture-100 opacity-90 leading-relaxed max-w-2xl mx-auto font-medium">
            {content.subHeadline}
          </p>
        </div>
      </section>

      {/* Why This Works & Projected Value */}
      <section className="py-20 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center mr-4 text-sm"><i className="fas fa-check-double"></i></span>
              Why This Works
            </h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed">
              <p className="font-medium text-lg text-gray-800 mb-4">{content.whyLivestock}</p>
              <p>{content.systemSummary}</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <i className="fas fa-microchip text-pasture mr-3"></i> The Tech Advantage
            </h3>
            <div className="space-y-6">
              <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <i className="fas fa-shield-halved text-xs"></i>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-1">Proof of Life (PoL)</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    We solved the trust problem. Every animal is verified by a <strong>Vet Oracle</strong> who stakes digital collateral on health and growth data.
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <i className="fas fa-money-bill-transfer text-xs"></i>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-1">Real Asset Liquidity</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Your livestock is a financial instrument. Unlock Naira financing via DeFi rails without forcing a premature sale.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-gray-900 text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl transition-transform group-hover:scale-110"><i className="fas fa-chart-line"></i></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-pasture mb-2">Projected 3-Year Value</h3>
            <p className="text-gray-400 text-xs mb-8 leading-relaxed">
              Target asset equity inside our production system through reinvestment and scale.
            </p>
            <div className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">{content.visionRange}</div>
            <div className="pt-6 border-t border-gray-800">
              <p className="text-[10px] text-gray-500 leading-relaxed italic">
                * {content.agencyStatement}
              </p>
            </div>
          </div>
          
          <div className="bg-earth p-8 rounded-3xl border border-pasture/10">
            <h3 className="text-lg font-bold text-pasture mb-4">Infrastructure of Trust</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <i className="fas fa-check-circle text-pasture mt-1 text-sm"></i>
                <span className="text-xs font-bold text-gray-700 leading-relaxed">Visibility for Professionals: Real-time biological metadata accessible from anywhere in the world.</span>
              </li>
              <li className="flex items-start space-x-3">
                <i className="fas fa-check-circle text-pasture mt-1 text-sm"></i>
                <span className="text-xs font-bold text-gray-700 leading-relaxed">Cooperative Advantage: Scaled margins and market stability handled for you by pros.</span>
              </li>
              <li className="flex items-start space-x-3">
                <i className="fas fa-check-circle text-pasture mt-1 text-sm"></i>
                <span className="text-xs font-bold text-gray-700 leading-relaxed">Inflation Hedge: Biological assets hold value even when currency softens.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* The 3-Year Path */}
      <section className="bg-white py-24 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The 3-Year Transformation</h2>
            <p className="text-gray-500 uppercase tracking-widest text-[10px] font-black">From curious observer to serious portfolio manager</p>
          </div>

          <div className="space-y-8 relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-50 hidden md:block"></div>
            {content.narrative.map((item, idx) => (
              <div key={idx} className="relative md:pl-20 group">
                <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center text-sm font-bold text-gray-400 group-hover:border-pasture group-hover:text-pasture transition-all z-10 hidden md:flex">
                  {item.year}
                </div>
                <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-transparent hover:border-pasture/10 hover:bg-white hover:shadow-2xl transition-all duration-500">
                  <h4 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-tight">Year {item.year}: {item.title}</h4>
                  <p className="text-gray-600 mb-8 leading-relaxed font-medium">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Milestone:</span>
                      <span className="text-[10px] font-black text-pasture uppercase bg-pasture/5 px-3 py-1 rounded-full">{item.outcome}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 px-4 bg-earth text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-pasture text-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 text-3xl shadow-2xl shadow-pasture/20">
            <i className="fas fa-door-open"></i>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 tracking-tight">Build Seriously.</h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed italic font-medium px-4">
            "Your results depend on discipline, reinvestment, and scale. The system is built. How far you go is your choice."
          </p>
          <div className="space-y-8">
            <button
              onClick={onNext}
              className="bg-pasture text-white px-16 py-7 rounded-[2rem] text-xl font-black hover:shadow-2xl hover:scale-105 transition-all shadow-xl shadow-pasture/20 inline-flex flex-col items-center uppercase tracking-tighter"
            >
              <span>Secure Your Pilot Slot</span>
              <span className="text-[10px] uppercase tracking-[0.3em] opacity-70 mt-2">120-Day Launchpad Enrollment</span>
            </button>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              Limited slots available for the upcoming cohort.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JourneyPage;
