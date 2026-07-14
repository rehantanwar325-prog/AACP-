import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import ProductGrid from './components/ProductGrid';
import Wholesale from './components/Wholesale';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import WhatsAppFloat from './components/WhatsAppFloat';

const Home: React.FC = () => {
  useEffect(() => {
    // Add logic to hide cart when scrolling maybe, 
    // or just let it render statically.
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <About />
        <ProductGrid />
        <Wholesale />
      </main>
      <Footer />
      <CartModal />
      <WhatsAppFloat />
    </>
  );
};

export default Home;
