import React, { useState } from 'react';
import { TrendingUp, Menu, X } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const Header: React.FC = () => {
  const { baseRate, activeOffer, settings } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const whatsappPhone = settings.retailPhone.replace(/[^0-9]/g, "");

  return (
    <div className="sticky-header-wrapper">
      <div className="live-ticker-bar" id="live-price-ticker">
        <div className="container ticker-container">
          <span className="ticker-alert"><TrendingUp size={16} /> Market Update:</span>
          <span className="ticker-text">Today's Live Chicken Mandi Rate is <strong>₹{baseRate}</strong>/Kg.</span>
        </div>
      </div>

      {activeOffer.enabled && activeOffer.percent > 0 && (
        <div id="offer-banner"
          style={{
            display: 'flex', background: 'linear-gradient(135deg, #ef4444, #f97316)', color: '#fff', 
            padding: '10px 16px', fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, 
            textAlign: 'center', alignItems: 'center', justifyContent: 'center', gap: '8px', 
            animation: 'pulse-glow 2s infinite', letterSpacing: '0.5px'
          }}>
          <span style={{ fontSize: '1.2rem' }}>🎉</span>
          <span>{activeOffer.text || `🔥 Today's Special: ${activeOffer.percent}% OFF on all items!`}</span>
          <span style={{ fontSize: '1.2rem' }}>🎉</span>
        </div>
      )}

      <header className="navbar-header">
        <div className="container navbar-container">
          <a href="#home" className="logo">
            <span className="logo-accent">AACP</span> Chicken
          </a>

          <nav className={`nav-menu ${menuOpen ? 'open' : ''}`} id="nav-menu">
            <a href="#home" className="nav-link active" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#about" className="nav-link" onClick={() => setMenuOpen(false)}>About Us</a>
            <a href="#why-choose-us" className="nav-link" onClick={() => setMenuOpen(false)}>Why Choose Us</a>
            <a href="#products" className="nav-link" onClick={() => setMenuOpen(false)}>Products</a>
            <a href="#wholesale" className="nav-link" onClick={() => setMenuOpen(false)}>Wholesale</a>
            <a href={`https://wa.me/${whatsappPhone}?text=Hello%20AACP%20Chicken,%20I%20want%20to%20place%20an%20order.`}
              target="_blank" rel="noreferrer" className="btn btn-primary nav-btn">Order Now</a>
          </nav>

          <button className={`mobile-menu-toggle ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Navigation Menu">
            {menuOpen ? <X className="menu-icon-close" /> : <Menu className="menu-icon-open" />}
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;
