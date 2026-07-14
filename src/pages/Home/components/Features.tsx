import React from 'react';
import { ShieldCheck, Sparkles, Truck, Tags } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section id="why-choose-us" className="why-section section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-tag">Features</span>
          <h2 className="section-title">Why Choose AACP Chicken?</h2>
          <p className="section-subtitle">We set the gold standard in fresh meat sourcing, processing, and prompt logistics.</p>
        </div>

        <div className="why-grid">
          <div className="why-card card-hover">
            <div className="why-icon-container">
              <ShieldCheck className="why-icon" size={32} />
            </div>
            <h3 className="why-card-title">100% Fresh Quality</h3>
            <p className="why-card-desc">Sourced daily from selected healthy poultry farms to guarantee premium taste, tenderness, and safety.</p>
          </div>
          <div className="why-card card-hover">
            <div className="why-icon-container">
              <Sparkles className="why-icon" size={32} />
            </div>
            <h3 className="why-card-title">Hygienic Processing</h3>
            <p className="why-card-desc">Cleaned and packed under strict temperature-controlled sanitary standards. No chemical additives.</p>
          </div>
          <div className="why-card card-hover">
            <div className="why-icon-container">
              <Truck className="why-icon" size={32} />
            </div>
            <h3 className="why-card-title">Timely Delivery</h3>
            <p className="why-card-desc">Our temperature-controlled logistics network ensures orders arrive chilled and fresh at your doorstep.</p>
          </div>
          <div className="why-card card-hover">
            <div className="why-icon-container">
              <Tags className="why-icon" size={32} />
            </div>
            <h3 className="why-card-title">Competitive Prices</h3>
            <p className="why-card-desc">Get premium value for your money. Unbeatable wholesale prices and high-quality retail packs.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
