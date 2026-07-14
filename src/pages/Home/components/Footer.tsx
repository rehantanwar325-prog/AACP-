import React from 'react';
import { MessageSquare, MapPin, Phone, Mail } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { settings } = useAppContext();
  const currentYear = new Date().getFullYear();
  const cleanPhoneForSms = settings.retailPhone.replace(/\s+/g, "");

  return (
    <footer className="main-footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <a href="#home" className="logo footer-logo">
            <span className="logo-accent">AACP</span> Chicken
          </a>
          <p className="footer-tagline">Providing clean, hygienic, and fresh premium grade poultry to kitchens and businesses since 2011.</p>
          <div className="social-links">
            <a href={`sms:${cleanPhoneForSms}?body=Hello%20AACP%20Chicken,%20I%20would%20like%20to%20inquire%20about%20your%20chicken%20products.`} 
               className="social-icon-link" aria-label="SMS">
              <MessageSquare size={20} />
            </a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-title">Quick Links</h4>
          <nav className="footer-nav">
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#why-choose-us">Why Choose Us</a>
            <a href="#products">Products</a>
            <a href="#wholesale">Wholesale</a>
          </nav>
        </div>

        <div className="footer-hours">
          <h4 className="footer-title">Operational Hours</h4>
          <ul className="hours-list">
            <li><span>Monday - Friday</span> <span>{settings.hoursMonFri}</span></li>
            <li><span>Saturday</span> <span>{settings.hoursSat}</span></li>
            <li><span>Sunday</span> <span>{settings.hoursSun}</span></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4 className="footer-title">Contact Us</h4>
          <ul className="footer-contact-list">
            <li className="footer-contact-item">
              <MapPin size={18} />
              <span>{settings.address}</span>
            </li>
            <li className="footer-contact-item">
              <Phone size={18} />
              <span>
                Retail: <a href={`tel:${settings.retailPhone.replace(/\s+/g, "")}`}>{settings.retailPhone}</a><br />
                Wholesale: <a href={`tel:${settings.wholesalePhone.replace(/\s+/g, "")}`}>{settings.wholesalePhone}</a>
              </span>
            </li>
            <li className="footer-contact-item">
              <Mail size={18} />
              <span>
                <a href={`mailto:${settings.retailEmail.trim()}`}>{settings.retailEmail}</a><br />
                <a href={`mailto:${settings.wholesaleEmail.trim()}`}>{settings.wholesaleEmail}</a>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="copyright">&copy; <span>{currentYear}</span> AACP Chicken. All rights reserved.</p>
          <p className="dev-credits">Designed for Freshness & Trust | <Link to="/admin" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.6, transition: 'opacity 0.2s' }} onMouseOver={(e) => (e.currentTarget.style.opacity = '1')} onMouseOut={(e) => (e.currentTarget.style.opacity = '0.6')}>Admin Dashboard</Link></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
