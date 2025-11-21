import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const PlayIcon: React.FC = () => (
    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
    </svg>
);

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="bg-emerald-50/50">
      <div className="container mx-auto px-6 py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-lg font-semibold text-emerald-600 uppercase tracking-wider">
              {t.hero.subtitle}
            </h2>
            <p className="mt-4 text-sm font-medium bg-emerald-100 text-emerald-800 inline-block px-4 py-1 rounded-full">
              {t.hero.tag}
            </p>
            <h1 className="mt-6 text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              {t.hero.title}
            </h1>
            <p className="mt-8 text-lg text-gray-600">
              {t.hero.description}
            </p>
            <div className="mt-12 flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
              <a href="#contact" className="w-full sm:w-auto bg-emerald-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-emerald-700 transform hover:scale-105 transition-all duration-300 text-center">
                {t.hero.cta_primary}
              </a>
              <a href="#solutions" className="w-full sm:w-auto flex items-center justify-center bg-white text-emerald-600 font-semibold px-8 py-4 rounded-lg border border-emerald-200 hover:bg-emerald-50 transform hover:scale-105 transition-all duration-300">
                <PlayIcon />
                {t.hero.cta_secondary}
              </a>
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba9996a?auto=format&fit=crop&q=80&w=1200&h=800" 
              alt="Healthcare professional analyzing financial data" 
              className="rounded-xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;