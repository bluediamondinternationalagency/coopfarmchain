
import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isLoggedIn, onLoginClick, onLogoutClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-pasture rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-pasture/20">
              <i className="fas fa-link text-white text-xs"></i>
            </div>
            <span className="font-bold text-lg md:text-xl tracking-tight text-gray-800 uppercase">
              Farmchain<span className="text-pasture">Coop</span>
            </span>
          </div>
          
          <nav className="hidden lg:flex space-x-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <a href="#" className="hover:text-pasture transition-colors">Philosophy</a>
            <a href="#" className="hover:text-pasture transition-colors">The System</a>
            <a href="#" className="hover:text-pasture transition-colors">CFR Facilities</a>
            <a href="https://www.farmchain.uk" target="_blank" className="hover:text-pasture transition-colors flex items-center">
              Mother Hub <i className="fas fa-external-link-alt ml-2 text-[8px]"></i>
            </a>
          </nav>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden sm:block">
              {isLoggedIn ? (
                <button 
                  onClick={onLogoutClick}
                  className="text-gray-400 hover:text-pasture text-[10px] font-black uppercase tracking-widest px-4 py-2 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="text-gray-400 hover:text-pasture text-[10px] font-black uppercase tracking-widest px-4 py-2 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
            
            {!isLoggedIn && (
              <button className="bg-pasture text-white px-5 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-opacity-90 transition shadow-xl shadow-pasture/20">
                Join
              </button>
            )}

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-400 hover:text-pasture"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-50 absolute w-full left-0 animate-in slide-in-from-top duration-300 shadow-xl">
            <div className="p-6 space-y-6 flex flex-col text-center uppercase tracking-widest font-black text-xs text-gray-500">
              <a href="#" onClick={() => setIsMobileMenuOpen(false)}>Philosophy</a>
              <a href="#" onClick={() => setIsMobileMenuOpen(false)}>The System</a>
              <a href="#" onClick={() => setIsMobileMenuOpen(false)}>CFR Facilities</a>
              <a href="https://www.farmchain.uk" target="_blank" className="text-pasture">Mother Hub</a>
              <div className="pt-4 border-t border-gray-100">
                {isLoggedIn ? (
                  <button onClick={() => { onLogoutClick?.(); setIsMobileMenuOpen(false); }} className="w-full text-clay py-4">Sign Out</button>
                ) : (
                  <button onClick={() => { onLoginClick?.(); setIsMobileMenuOpen(false); }} className="w-full text-pasture py-4">Sign In</button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 text-center md:text-left">
            <h4 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 uppercase tracking-tight">Farmchain Cooperative</h4>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto md:mx-0 mb-8">
              We are reimagining livestock as the ultimate modern asset class. Combining biological compounding with Algorand's digital infrastructure.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pasture transition-all"><i className="fab fa-twitter"></i></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pasture transition-all"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pasture transition-all"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-pasture mb-6">Infrastructure</h4>
            <ul className="text-gray-400 text-sm space-y-4">
              <li className="hover:text-white transition-colors cursor-pointer text-xs">Common Facility Ranches</li>
              <li className="hover:text-white transition-colors cursor-pointer text-xs">Managed Cooperatives</li>
              <li className="hover:text-white transition-colors cursor-pointer text-xs">Traceability Protocol</li>
              <li className="hover:text-white transition-colors cursor-pointer text-xs">Asset-Backed Finance</li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gold mb-6">Mother Platform</h4>
            <ul className="text-gray-400 text-sm space-y-4">
              <li><a href="https://www.farmchain.uk" target="_blank" className="hover:text-white transition-colors text-xs">Farmchain.uk</a></li>
              <li className="hover:text-white transition-colors cursor-pointer text-xs">Algorand Explorer</li>
              <li className="hover:text-white transition-colors cursor-pointer text-xs">DeFi Credit Portal</li>
              <li className="hover:text-white transition-colors cursor-pointer text-xs">NFT/ASA Ledger</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 md:mt-20 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest text-center">
            © {new Date().getFullYear()} Farmchain Cooperative. Built for the Next Generation.
          </p>
          <div className="flex space-x-6 text-[9px] font-bold uppercase tracking-widest text-gray-500">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
