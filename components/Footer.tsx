
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1: Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-emerald-500">PRIORIZZI®</h3>
            <p className="text-sm text-gray-400 mt-1">A Saúde Financeira de Sua Empresa</p>
            <p className="mt-4 text-gray-400 max-w-md">
              Especialistas em gestão financeira para o setor da saúde, transformando números em decisões estratégicas que geram prosperidade.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">A Priorizzi</Link></li>
              <li><Link href="/solutions" className="hover:text-emerald-400 transition-colors">Soluções</Link></li>
              <li><Link href="/courses" className="hover:text-emerald-400 transition-colors">Cursos</Link></li>
              <li><Link href="/clients" className="hover:text-emerald-400 transition-colors">Clientes</Link></li>
              <li><Link href="/blog" className="hover:text-emerald-400 transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contato</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="mailto:contato@priorizzi.com.br" className="hover:text-emerald-400 transition-colors">contato@priorizzi.com.br</a></li>
              <li><a href="tel:+5511999999999" className="hover:text-emerald-400 transition-colors">+55 (11) 99999-9999</a></li>
              <li className="pt-2">
                <Link href="/contact" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Fale Conosco →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Priorizzi. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;