import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const HomePage: NextPage = () => {
  return (
    <div className="bg-white min-h-screen text-gray-800">
      <Head>
        <title>PRIORIZZI® - A Saúde Financeira de Sua Empresa</title>
        <meta name="description" content="A professional landing page for Priorizzi, a financial management company specializing in the healthcare sector." />
      </Head>
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
