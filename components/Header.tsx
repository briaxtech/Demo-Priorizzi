
import React, { useState } from 'react';

const NavLinks = () => (
  <>
    <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">A Priorizzi</a>
    <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Soluções</a>
    <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Cursos</a>
    <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Clientes</a>
    <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Blog</a>
    <a href="#" className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-all">Fale Conosco</a>
  </>
);

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-emerald-700">PRIORIZZI®</h1>
            <p className="text-xs text-gray-500 tracking-tight">A Saúde Financeira de Sua Empresa</p>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            <NavLinks />
          </nav>
          
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden mt-4">
            <nav className="flex flex-col items-center space-y-4">
              <NavLinks />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
