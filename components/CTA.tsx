import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="bg-emerald-600">
      <div className="container mx-auto px-6 py-20 lg:py-24 text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-white">
          Pronto para Transformar Suas Finanças?
        </h2>
        <p className="mt-4 text-lg text-emerald-100 max-w-2xl mx-auto">
          Não deixe mais dinheiro na mesa. Agende seu check-up financeiro gratuito hoje mesmo e descubra o potencial de lucro escondido em sua empresa.
        </p>
        <div className="mt-10">
          <a 
            href="#" 
            className="inline-block bg-white text-emerald-600 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-emerald-50 transform hover:scale-105 transition-all duration-300"
          >
            Quero Multiplicar Meus Lucros Agora
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;