import React from 'react';
import { useAppContext } from '../../../context/AppContext';

const About: React.FC = () => {
  const { settings } = useAppContext();
  const whatsappPhone = settings.retailPhone.replace(/[^0-9]/g, "");

  return (
    <section id="about" className="about-section section-padding">
      <div className="container about-container">
        <div className="about-image-wrapper">
          <img src="/assets/images/hero_banner.png" alt="AACP Chicken Kitchen Display" className="about-img" />
          <div className="experience-badge">
            <span className="exp-number">25+</span>
            <span className="exp-text">Years of Trust</span>
          </div>
        </div>

        <div className="about-content">
          <span className="section-tag">About Us</span>
          <h2 className="section-title">A Legacy of Freshness, Quality & Unwavering Trust</h2>
          <p className="about-text-lead">
            Since our establishment, AACP Chicken has been a cornerstone in supplying high-quality, premium chicken
            products to restaurants, bulk wholesalers, and direct retail consumers.
          </p>
          <p className="about-text">
            We believe that clean, healthy food builds healthy communities. That is why we maintain rigorous quality
            standards at every single step of the supply chain—from procurement to processing and packaging. Every order
            is a commitment to food safety and freshness that you can taste in every bite.
          </p>

          <div className="about-stats">
            <div className="stat-item">
              <h4 className="stat-number">100%</h4>
              <p className="stat-label">Hygienic standard</p>
            </div>
            <div className="stat-item">
              <h4 className="stat-number">50+</h4>
              <p className="stat-label">Bulk Partners</p>
            </div>
            <div className="stat-item">
              <h4 className="stat-number">10k+</h4>
              <p className="stat-label">Happy Customers</p>
            </div>
          </div>

          <a href={`https://wa.me/${whatsappPhone}?text=Hello%20AACP%20Chicken,%20I%20would%20like%20to%20get%20in%20touch.`}
            target="_blank" rel="noreferrer" className="btn btn-primary">Get in Touch</a>
        </div>
      </div>
    </section>
  );
};

export default About;
