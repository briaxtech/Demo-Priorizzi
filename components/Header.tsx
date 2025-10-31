import React, { useState } from 'react';
import Link from 'next/link';

const NavLinks = () => (
  <>
    <Link href="/about" className="text-gray-600 hover:text-emerald-600 transition-colors">A Priorizzi</Link>
    <Link href="/solutions" className="text-gray-600 hover:text-emerald-600 transition-colors">Soluções</Link>
    <Link href="/courses" className="text-gray-600 hover:text-emerald-600 transition-colors">Cursos</Link>
    <Link href="/clients" className="text-gray-600 hover:text-emerald-600 transition-colors">Clientes</Link>
    <Link href="/blog" className="text-gray-600 hover:text-emerald-600 transition-colors">Blog</Link>
    <Link href="/contact" className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-all">Fale Conosco</Link>
  </>
);

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex flex-col">
            <h1 className="text-2xl font-bold text-emerald-700">PRIORIZZI®</h1>
            <p className="text-xs text-gray-500 tracking-tight">A Saúde Financeira de Sua Empresa</p>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <NavLinks />
          </nav>
          
          <div className="lg:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded"
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

        {isOpen && (
          <div className="lg:hidden mt-4" id="mobile-menu">
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
