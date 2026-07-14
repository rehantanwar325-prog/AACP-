import React, { useState } from 'react';
import { ShoppingBag, FileText, TrendingUp, Sparkles, Key } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const OverviewTab: React.FC = () => {
  const { products, inquiries, baseRate, setBaseRate, activeOffer, setActiveOffer } = useAppContext();
  
  const [rateInput, setRateInput] = useState(baseRate.toString());
  const [offerEnabled, setOfferEnabled] = useState(activeOffer.enabled);
  const [offerPercent, setOfferPercent] = useState(activeOffer.percent.toString());
  const [offerText, setOfferText] = useState(activeOffer.text);
  const [ghToken, setGhToken] = useState(localStorage.getItem("salim_github_token") || "");

  const handleUpdateRate = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseInt(rateInput);
    if (!isNaN(rate) && rate > 0) {
      setBaseRate(rate);
      alert(`Base rate updated locally to ₹${rate}`);
      // GitHub sync logic is mocked here, would be a fetch in reality
    }
  };

  const handleSaveOffer = () => {
    setActiveOffer({
      enabled: offerEnabled,
      percent: parseInt(offerPercent) || 0,
      text: offerText
    });
    alert("Offer saved and activated!");
  };

  const handleSaveGhToken = () => {
    localStorage.setItem("salim_github_token", ghToken);
    alert("GitHub token saved!");
  };

  const pendingInquiries = inquiries.filter(i => i.status === "Pending").length;
  const recentInquiries = [...inquiries].reverse().slice(0, 5);

  return (
    <section className="tab-content active" id="tab-overview">
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon bg-red"><ShoppingBag size={24} color="#fff" /></div>
          <div className="metric-info">
            <h3>{products.length}</h3>
            <p>Products Listed</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon bg-gold"><FileText size={24} color="#fff" /></div>
          <div className="metric-info">
            <h3>{pendingInquiries}</h3>
            <p>Pending Inquiries</p>
          </div>
        </div>
      </div>

      <div className="dashboard-split-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3><TrendingUp size={18} /> Daily Mandi Base Rate</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleUpdateRate} className="admin-form">
              <div className="form-group">
                <label>Chicken Mandi Rate (₹/Kg)</label>
                <div className="inline-input-group">
                  <div className="input-with-prefix">
                    <span className="currency-prefix">₹</span>
                    <input type="number" className="form-control" required min="1" value={rateInput} onChange={e => setRateInput(e.target.value)} />
                  </div>
                  <button type="submit" className="btn btn-primary">Update Rate</button>
                </div>
              </div>
            </form>
            <p className="rate-hint">All dynamic pricing products will be recalculated automatically using this base mandi rate multiplied by their individual product multipliers.</p>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3><Sparkles size={18} /> Promotions & Offers</h3>
          </div>
          <div className="card-body">
            <div className="form-group toggle-group">
              <label className="checkbox-toggle">
                <input type="checkbox" checked={offerEnabled} onChange={e => setOfferEnabled(e.target.checked)} />
                <span className="toggle-slider"></span>
                <span>Enable Offer Discount Banner</span>
              </label>
            </div>
            
            {offerEnabled && (
              <div style={{ marginTop: '15px' }}>
                <div className="form-group">
                  <label>Offer Discount Percentage (%)</label>
                  <input type="number" className="form-control" min="1" max="90" value={offerPercent} onChange={e => setOfferPercent(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Banner Promotion Text</label>
                  <input type="text" className="form-control" value={offerText} onChange={e => setOfferText(e.target.value)} placeholder="🔥 Today's Special: 10% OFF on all items!" />
                </div>
                <button type="button" className="btn btn-secondary" onClick={handleSaveOffer}>Save & Activate Offer</button>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3><Key size={18} /> Live Rate Sync (GitHub Token)</h3>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Paste your GitHub Personal Access Token here to enable live rate syncing.</p>
            <div className="form-group">
              <label>GitHub Token</label>
              <input type="password" className="form-control" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" value={ghToken} onChange={e => setGhToken(e.target.value)} />
            </div>
            <button type="button" className="btn btn-secondary" onClick={handleSaveGhToken}>Save Token</button>
          </div>
        </div>
      </div>

      <div className="dashboard-split-grid" style={{ marginTop: '30px' }}>
        <div className="dashboard-card">
          <div className="card-header">
            <h3><FileText size={18} /> Recent Wholesale Queries</h3>
          </div>
          <div className="card-body scroll-table-wrapper">
            <table className="admin-table table-compact">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Business</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.length === 0 ? (
                  <tr><td colSpan={5} className="text-center" style={{ color: 'var(--text-muted)' }}>No wholesale queries received yet.</td></tr>
                ) : (
                  recentInquiries.map(inq => (
                    <tr key={inq.id}>
                      <td>{inq.date.split(',')[0]}</td>
                      <td><strong>{inq.name}</strong></td>
                      <td>{inq.product}</td>
                      <td>{inq.quantity} kg</td>
                      <td><span className={`badge-status ${inq.status === 'Pending' ? 'pending' : 'responded'}`}>{inq.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewTab;
