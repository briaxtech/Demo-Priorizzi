import React from 'react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

const testimonialsData: Testimonial[] = [
  {
    quote: "A Priorizzi transformou nossa gestão financeira. Em 6 meses, vimos um aumento de 40% na nossa lucratividade. Essencial para qualquer clínica que busca crescimento sustentável.",
    name: "Dr. Carlos Almeida",
    role: "Diretor, Clínica Coração Vital",
    avatar: "https://randomuser.me/api/portraits/men/60.jpg"
  },
  {
    quote: "Tínhamos vazamentos financeiros que nem imaginávamos. O check-up gratuito da Priorizzi foi um divisor de águas. Hoje, temos total controle e previsibilidade sobre nossas finanças.",
    name: "Ana Júlia Ferreira",
    role: "Administradora, Hospital Bem Estar",
    avatar: "https://randomuser.me/api/portraits/women/47.jpg"
  }
];

const QuoteIcon = () => (
    <svg className="absolute top-0 left-0 w-16 h-16 text-emerald-100/50 transform -translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.983 3v7.391c0 2.908-2.35 5.259-5.258 5.259h-.001v-3.691h.001c.907 0 1.646-.738 1.646-1.646V3h3.611zM21.983 3v7.391c0 2.908-2.35 5.259-5.258 5.259h-.001v-3.691h.001c.907 0 1.646-.738 1.646-1.646V3h3.611z" />
    </svg>
)

const TestimonialCard: React.FC<Testimonial> = ({ quote, name, role, avatar }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative overflow-hidden">
    <QuoteIcon />
    <div className="relative z-10">
        <p className="text-gray-600 text-base leading-relaxed mb-6">"{quote}"</p>
        <div className="flex items-center">
        <img className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-emerald-200" src={avatar} alt={name} />
        <div>
            <p className="font-bold text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{role}</p>
        </div>
        </div>
    </div>
  </div>
);

const Testimonials: React.FC = () => {
  return (
    <section className="bg-emerald-50/50 py-20 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Histórias reais de empresas de saúde que transformaram suas finanças com a nossa ajuda.
          </p>
        </div>
        <div className="mt-16 grid md:grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;