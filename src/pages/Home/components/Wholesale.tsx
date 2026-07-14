import React from 'react';
import { ShoppingBag, Truck, Thermometer, FileText, Info } from 'lucide-react';

const Wholesale: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In original code, it doesn't do much or sends email/WhatsApp? It just has action="#"
    alert("Thank you for your wholesale inquiry! Our team will contact you soon.");
  };

  return (
    <section id="wholesale" className="wholesale-section section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-tag tag-light">Wholesale Division</span>
          <h2 className="section-title text-white">Wholesale Rates & Bulk Ordering</h2>
          <p className="section-subtitle text-white-muted">Partner with AACP Chicken for steady, premium poultry supply at low commercial pricing.</p>
        </div>

        <div className="wholesale-container">
          <div className="wholesale-info-card">
            <h3 className="wholesale-card-title">Bulk Purchase Details</h3>
            <p className="wholesale-card-lead">We offer customized packaging and logistics solutions for hotels, restaurants, caterers, and cold chain distributors.</p>

            <div className="wholesale-specs">
              <div className="spec-row">
                <span className="spec-label"><ShoppingBag className="spec-icon" size={18} /> Minimum Order Quantity (MOQ):</span>
                <span className="spec-value">20 Kilograms (Kg)</span>
              </div>
              <div className="spec-row">
                <span className="spec-label"><Truck className="spec-icon" size={18} /> Delivery Timeline:</span>
                <span className="spec-value">Same-day / Next-day morning</span>
              </div>
              <div className="spec-row">
                <span className="spec-label"><Thermometer className="spec-icon" size={18} /> Logistics Cold-Chain:</span>
                <span className="spec-value">Below 4°C chilled transit</span>
              </div>
              <div className="spec-row">
                <span className="spec-label"><FileText className="spec-icon" size={18} /> Food Certification:</span>
                <span className="spec-value">100% Halal Certified</span>
              </div>
            </div>

            <div className="wholesale-alert">
              <Info className="alert-icon" size={20} />
              <p className="alert-text"><strong>Please Note:</strong> Wholesale rates fluctuate based on market conditions. Contact our sales department directly to get the current day's price list.</p>
            </div>
          </div>

          <div className="wholesale-form-card">
            <h3 className="wholesale-form-title">Request a Bulk Quote</h3>
            <p className="wholesale-form-subtitle">Fill out the quick query and our wholesale manager will reach out within 2 hours.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="ws-name">Business / Individual Name</label>
                <input type="text" id="ws-name" className="form-control" placeholder="E.g. Spice Garden Restaurant" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ws-phone">Phone Number</label>
                  <input type="tel" id="ws-phone" className="form-control" placeholder="E.g. 9876543210" required />
                </div>
                <div className="form-group">
                  <label htmlFor="ws-product">Primary Product Interest</label>
                  <select id="ws-product" className="form-control" required defaultValue="">
                    <option value="" disabled>Select Product</option>
                    <option value="Whole Chicken">Whole Chicken</option>
                    <option value="Chicken Breast">Chicken Breast</option>
                    <option value="Chicken Legs">Chicken Legs</option>
                    <option value="Chicken Wings">Chicken Wings</option>
                    <option value="Boneless Chicken">Boneless Cubes</option>
                    <option value="Chicken Mince">Chicken Mince / Qeema</option>
                    <option value="Multiple Products">Multiple / Others</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="ws-quantity">Estimated Daily/Weekly Volume (kg)</label>
                <input type="number" id="ws-quantity" className="form-control" placeholder="Minimum 20 kg" min="20" required />
              </div>
              <div className="form-group">
                <label htmlFor="ws-message">Delivery Requirements / Notes</label>
                <textarea id="ws-message" className="form-control" rows={3} placeholder="Tell us about special cuts or logistics timing needs..."></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-full">Submit Wholesale Inquiry</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Wholesale;
