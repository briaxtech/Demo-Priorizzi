
import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const CheckupIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.917L12 23l9-2.083c.133-.306.223-.63.297-.97A12.02 12.02 0 0021 7.984a11.955 11.955 0 01-2.382-3.001z" />
    </svg>
);

const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col items-start">
    <div className="bg-emerald-100 p-3 rounded-full mb-5">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 text-base leading-relaxed">{description}</p>
  </div>
);

const Features: React.FC = () => {
  const featuresData = [
    {
      icon: <CheckupIcon />,
      title: 'Check-up Financeiro Gratuito',
      description: 'Em apenas 48 horas, revelamos exatamente onde você está perdendo dinheiro e entregamos um plano de ação para recuperar até 30% de margem. Zero compromisso, resultados reais.',
    },
    {
      icon: <ShieldIcon />,
      title: 'Consultoria Estratégica Blindada',
      description: 'Implantamos sistemas à prova de falhas que eliminam desperdícios e maximizam seu lucro. Nossos clientes aumentam em média 47% sua rentabilidade nos primeiros 6 meses.',
    },
    {
      icon: <BriefcaseIcon />,
      title: 'CFO Terceirizado Saúde+',
      description: 'Tenha um diretor financeiro de elite sem os custos de um executivo interno. Você foca em salvar vidas, nós garantimos que seu negócio seja altamente lucrativo e previsível.',
    },
  ];

  return (
    <section className="bg-gray-50 py-20 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
            3 Formas Comprovadas de Dobrar Seu Lucro
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Escolha o caminho ideal para transformar sua empresa de saúde em uma máquina de gerar resultados previsíveis
          </p>
        </div>
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
