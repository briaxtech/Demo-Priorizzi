import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1: Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-emerald-500">PRIORIZZI®</h3>
            <p className="text-sm text-gray-400 mt-1">A Saúde Financeira de Sua Empresa</p>
            <p className="mt-4 text-gray-400 max-w-md">
              {t.footer.description}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t.footer.quick_links}</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="hover:text-emerald-400 transition-colors">{t.nav.about}</a></li>
              <li><a href="#solutions" className="hover:text-emerald-400 transition-colors">{t.nav.solutions}</a></li>
              <li><a href="#contact" className="hover:text-emerald-400 transition-colors">{t.nav.courses}</a></li>
              <li><a href="#clients" className="hover:text-emerald-400 transition-colors">{t.nav.clients}</a></li>
              <li><a href="#contact" className="hover:text-emerald-400 transition-colors">{t.nav.blog}</a></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div id="contact">
            <h4 className="text-lg font-semibold text-white mb-4">{t.footer.contact}</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="mailto:contato@priorizzi.com.br" className="hover:text-emerald-400 transition-colors">contato@priorizzi.com.br</a></li>
              <li><a href="tel:+5511999999999" className="hover:text-emerald-400 transition-colors">+55 (11) 99999-9999</a></li>
              <li className="pt-2">
                <a href="#contact" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                  {t.nav.contact} →
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Priorizzi. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
};

export default Footer;