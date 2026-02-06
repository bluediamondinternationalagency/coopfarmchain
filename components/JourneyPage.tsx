
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
      <section className="bg-pasture py-24 px-4 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-gold px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-gold/20">
            Roadmap for {user.name}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {content.headline}
          </h1>
          <p className="text-xl text-pasture-100 opacity-90 leading-relaxed max-w-2xl mx-auto">
            {content.subHeadline}
          </p>
        </div>
      </section>

      {/* Why Livestock & The System */}
      <section className="py-20 px-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center mr-3 text-sm"><i className="fas fa-question"></i></span>
              Why Livestock?
            </h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed">
              <p>{content.whyLivestock}</p>
            </div>
          </div>
          <div className="bg-earth p-8 rounded-3xl border border-pasture/10">
            <h3 className="text-xl font-bold text-pasture mb-4 flex items-center">
              <i className="fas fa-network-wired mr-3"></i> The Infrastructure
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {content.systemSummary}
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-xs font-semibold text-gray-700">
                <i className="fas fa-check-circle text-pasture mr-2"></i> Professional Common Facility Ranches
              </li>
              <li className="flex items-center text-xs font-semibold text-gray-700">
                <i className="fas fa-check-circle text-pasture mr-2"></i> Managed Cooperative Scale
              </li>
              <li className="flex items-center text-xs font-semibold text-gray-700">
                <i className="fas fa-check-circle text-pasture mr-2"></i> Real-time Traceability & Records
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-clay text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl"><i className="fas fa-chart-line"></i></div>
            <h3 className="text-2xl font-bold mb-4">Projected 3-Year Value</h3>
            <p className="text-clay-100 text-sm mb-6 opacity-80 leading-relaxed">
              Target asset equity inside our production system.
            </p>
            <div className="text-5xl font-bold text-gold mb-4">{content.visionRange}</div>
            <p className="text-xs text-clay-200 opacity-60 italic">
              * This path is a real exists—but only for those who decide to walk it. Growth depends on ambition and responsibility.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-microchip text-pasture mr-3"></i> The Innovation
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {content.innovationDetail}
            </p>
          </div>
        </div>
      </section>

      {/* The 3-Year Story */}
      <section className="bg-white py-24 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The 3-Year Transformation</h2>
            <p className="text-gray-500">Your transition from curious visitor to serious asset manager.</p>
          </div>

          <div className="space-y-12 relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-50 hidden md:block"></div>
            {content.narrative.map((item, idx) => (
              <div key={idx} className="relative md:pl-20 group">
                <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center text-sm font-bold text-gray-400 group-hover:border-pasture group-hover:text-pasture transition-all z-10 hidden md:flex">
                  {item.year}
                </div>
                <div className="bg-earth/30 p-8 rounded-[2rem] border border-transparent hover:border-pasture/20 hover:bg-white hover:shadow-xl transition-all">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Year {item.year}: {item.title}</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">{item.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Milestone Result:</span>
                    <span className="text-sm font-bold text-pasture">{item.outcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action & Agency */}
      <section className="py-24 px-4 bg-earth text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-pasture text-white rounded-3xl flex items-center justify-center mx-auto mb-8 text-2xl shadow-xl">
            <i className="fas fa-mountain"></i>
          </div>
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Your Choice Starts Here</h2>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed italic">
            "{content.agencyStatement}"
          </p>
          <div className="space-y-6">
            <button
              onClick={onNext}
              className="bg-pasture text-white px-12 py-6 rounded-2xl text-xl font-bold hover:shadow-2xl hover:scale-105 transition shadow-xl shadow-pasture/20 inline-flex flex-col items-center"
            >
              <span>Step Into the System</span>
              <span className="text-[10px] uppercase tracking-widest opacity-70 mt-1">What you build from here is up to you</span>
            </button>
            <p className="text-sm text-gray-400">
              This is not a promise of ease. It's an invitation to build seriously.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JourneyPage;
