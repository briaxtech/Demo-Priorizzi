import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const CTA: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-emerald-600">
      <div className="container mx-auto px-6 py-20 lg:py-24 text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-white">
          {t.cta.title}
        </h2>
        <p className="mt-4 text-lg text-emerald-100 max-w-2xl mx-auto">
          {t.cta.description}
        </p>
        <div className="mt-10">
          <a 
            href="#contact" 
            className="inline-block bg-white text-emerald-600 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-emerald-50 transform hover:scale-105 transition-all duration-300"
          >
            {t.cta.button}
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;