import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LogoCarousel: React.FC = () => {
  const { t } = useLanguage();

  // Generic Healthcare/Financial Logos SVGs
  const logos = [
    {
      name: "MediCorp",
      svg: (
        <svg className="h-10 text-gray-400 group-hover:text-emerald-600 transition-colors duration-300" viewBox="0 0 150 50" fill="currentColor">
          <path d="M20,25 h-10 v-10 h-5 v10 h-10 v5 h10 v10 h5 v-10 h10 z M40,15 h10 v20 h-10 z M60,15 h20 v5 h-15 v2 h10 v5 h-10 v3 h15 v5 h-20 z" />
          <text x="50" y="32" fontFamily="sans-serif" fontSize="20" fontWeight="bold">MediCorp</text>
        </svg>
      )
    },
    {
      name: "HealthFin",
      svg: (
        <svg className="h-10 text-gray-400 group-hover:text-emerald-600 transition-colors duration-300" viewBox="0 0 160 50" fill="currentColor">
          <path d="M10,25 l10,-15 l10,15 l-5,0 l-5,-8 l-5,8 z" />
          <text x="40" y="32" fontFamily="sans-serif" fontSize="20" fontWeight="bold">HealthFin</text>
        </svg>
      )
    },
    {
      name: "BioCapital",
      svg: (
        <svg className="h-10 text-gray-400 group-hover:text-emerald-600 transition-colors duration-300" viewBox="0 0 160 50" fill="currentColor">
           <circle cx="20" cy="25" r="10" />
           <text x="40" y="32" fontFamily="sans-serif" fontSize="20" fontWeight="bold">BioCapital</text>
        </svg>
      )
    },
    {
      name: "Clinic+",
      svg: (
        <svg className="h-10 text-gray-400 group-hover:text-emerald-600 transition-colors duration-300" viewBox="0 0 150 50" fill="currentColor">
          <rect x="10" y="15" width="20" height="20" rx="5" />
          <text x="40" y="32" fontFamily="sans-serif" fontSize="20" fontWeight="bold">Clinic+</text>
        </svg>
      )
    },
    {
      name: "PharmaGrowth",
      svg: (
        <svg className="h-10 text-gray-400 group-hover:text-emerald-600 transition-colors duration-300" viewBox="0 0 200 50" fill="currentColor">
          <path d="M25,10 q15,15 0,30" stroke="currentColor" strokeWidth="5" fill="none" />
          <text x="40" y="32" fontFamily="sans-serif" fontSize="20" fontWeight="bold">PharmaGro</text>
        </svg>
      )
    },
    {
      name: "DoctorAlliance",
      svg: (
        <svg className="h-10 text-gray-400 group-hover:text-emerald-600 transition-colors duration-300" viewBox="0 0 200 50" fill="currentColor">
          <path d="M10,25 h20 M20,15 v20" stroke="currentColor" strokeWidth="4" />
          <text x="40" y="32" fontFamily="sans-serif" fontSize="20" fontWeight="bold">DrAlliance</text>
        </svg>
      )
    }
  ];

  return (
    <section className="bg-white py-12 border-b border-gray-100 overflow-hidden">
      <div className="container mx-auto px-6 mb-8 text-center">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {t.trusted.title}
        </p>
      </div>
      
      <div className="relative w-full overflow-hidden group">
        {/* Left Fade Gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        {/* Right Fade Gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling Wrapper */}
        <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
          {/* First Set of Logos */}
          <div className="flex space-x-16 mx-8 items-center">
            {logos.map((logo, index) => (
              <div key={`logo-1-${index}`} className="opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                {logo.svg}
              </div>
            ))}
          </div>
          
          {/* Duplicate Set for Seamless Loop */}
          <div className="flex space-x-16 mx-8 items-center">
            {logos.map((logo, index) => (
              <div key={`logo-2-${index}`} className="opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                {logo.svg}
              </div>
            ))}
          </div>

          {/* Triplicate Set to ensure coverage on wide screens */}
           <div className="flex space-x-16 mx-8 items-center">
            {logos.map((logo, index) => (
              <div key={`logo-3-${index}`} className="opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                {logo.svg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoCarousel;
