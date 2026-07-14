import React from 'react';
import { MapPin } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const Hero: React.FC = () => {
  const { settings } = useAppContext();

  return (
    <section id="home" className="hero-section">
      <div className="hero-bg-overlay"></div>
      <div className="container hero-container">
        <div className="hero-content">
          <span className="badge">Premium Quality Meat</span>
          <h1 className="hero-title">Fresh & Quality Chicken Products - Retail & Wholesale</h1>
          <p className="hero-description">
            At AACP Chicken, we commit to delivering the freshest, hygienically processed, and premium grade chicken
            right to your business or kitchen. Taste the difference in quality and freshness.
          </p>
          <div className="hero-actions">
            <a href="#products" className="btn btn-primary btn-large">Explore Products</a>
            <a href="#wholesale" className="btn btn-secondary btn-large">Wholesale Rates</a>
            <a href={settings.mapsLink}
              target="_blank" rel="noreferrer" className="btn btn-outline-white btn-large">
              <MapPin size={20} style={{ marginRight: '8px' }} /> Store Location
            </a>
          </div>
        </div>
      </div>
      <div className="hero-wave">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z"
            fill="#fcfbf9"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
