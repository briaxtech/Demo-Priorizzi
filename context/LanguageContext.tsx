import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { translations } from '../utils/translations';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['es'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inicializamos en español por defecto, pero el useEffect lo actualizará inmediatamente
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    // 1. Verificar si hay una preferencia guardada previamente
    const storedLang = localStorage.getItem('manybriax_lang') as Language;
    
    if (storedLang && ['es', 'en'].includes(storedLang)) {
      setLanguage(storedLang);
      document.documentElement.lang = storedLang;
    } else {
      // 2. Si no hay preferencia guardada, detectar el idioma del navegador
      const browserLang = navigator.language || (navigator.languages && navigator.languages[0]);
      
      if (browserLang && browserLang.toLowerCase().startsWith('en')) {
        setLanguage('en');
        document.documentElement.lang = 'en';
      } else {
        // Por defecto Español para 'es' y cualquier otro idioma no soportado
        setLanguage('es');
        document.documentElement.lang = 'es';
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('manybriax_lang', lang);
    document.documentElement.lang = lang;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};