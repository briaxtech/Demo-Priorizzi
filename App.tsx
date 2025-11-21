import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import GeminiAgent from './components/GeminiAgent';
import { LanguageProvider } from './context/LanguageContext';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <div className="bg-white min-h-screen text-gray-800 relative">
        <Header />
        <main>
          <Hero />
          <Features />
          <Testimonials />
          <CTA />
        </main>
        <Footer />
        <GeminiAgent />
      </div>
    </LanguageProvider>
  );
};

export default App;