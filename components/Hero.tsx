import React from 'react';

const PlayIcon: React.FC = () => (
    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
    </svg>
);

const Hero: React.FC = () => {
  return (
    <section 
      className="relative bg-cover bg-center" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-emerald-900/70"></div>
      <div className="relative container mx-auto px-6 py-20 lg:py-32 text-center z-10">
        <h2 className="text-lg font-semibold text-emerald-300 uppercase tracking-wider">
          Priorizzi Healthcare Financial Management
        </h2>
        <p className="mt-4 text-sm font-medium bg-white/20 text-white inline-block px-4 py-1 rounded-full">
          +500 EMPRESAS DE SAÚDE JÁ MULTIPLICARAM SEUS LUCROS
        </p>
        <h1 className="mt-6 text-4xl lg:text-6xl font-extrabold text-white max-w-4xl mx-auto leading-tight">
          Pare de perder dinheiro: descubra onde estão os vazamentos financeiros da sua empresa de saúde
        </h1>
        <p className="mt-8 text-lg text-gray-200 max-w-2xl mx-auto">
          Você cuida dos pacientes, nós garantimos que sua empresa seja lucrativa e sustentável. Resultados comprovados em 90 dias ou menos.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
          <a href="#" className="w-full sm:w-auto bg-emerald-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-emerald-700 transform hover:scale-105 transition-all duration-300">
            Quero Multiplicar Meus Lucros Agora
          </a>
          <a href="#" className="w-full sm:w-auto flex items-center justify-center bg-white text-emerald-600 font-semibold px-8 py-4 rounded-lg border border-transparent hover:bg-emerald-50 transform hover:scale-105 transition-all duration-300">
            <PlayIcon />
            Ver Como Funciona (2 min)
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;