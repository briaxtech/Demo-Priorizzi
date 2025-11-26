import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const NavLinks = () => (
    <>
      <a href="#home" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-emerald-600 transition-colors">{t.nav.about}</a>
      <a href="#solutions" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-emerald-600 transition-colors">{t.nav.solutions}</a>
      <a href="#contact" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-emerald-600 transition-colors">{t.nav.courses}</a>
      <a href="#clients" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-emerald-600 transition-colors">{t.nav.clients}</a>
      <a href="#contact" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-emerald-600 transition-colors">{t.nav.blog}</a>
      <a href="#contact" onClick={() => setIsOpen(false)} className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-all">{t.nav.contact}</a>
    </>
  );

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <a href="#home" className="flex flex-col">
            <h1 className="text-2xl font-bold text-emerald-700">Many BrIAx</h1>
            <p className="text-xs text-gray-500 tracking-tight">A Saúde Financeira de Sua Empresa</p>
          </a>

          <nav className="hidden lg:flex items-center space-x-6">
            <NavLinks />
          </nav>
          
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="ml-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Abrir menu principal</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>

        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}
          id="mobile-menu"
        >
          <nav className="flex flex-col items-center space-y-4 py-4 border-t border-gray-100 mt-2">
            <NavLinks />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;