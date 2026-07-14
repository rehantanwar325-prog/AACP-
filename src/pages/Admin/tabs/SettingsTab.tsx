import React, { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const SettingsTab: React.FC = () => {
  const { settings, setSettings } = useAppContext();
  const [formData, setFormData] = useState(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(formData);
    alert("Website business settings updated successfully!");
  };

  return (
    <section className="tab-content active" id="tab-settings">
      <div className="dashboard-card">
        <div className="card-header">
          <h3><SettingsIcon size={18} /> Business Settings Configuration</h3>
        </div>
        <div className="card-body">
          <form className="admin-form settings-form" onSubmit={handleSaveSettings}>
            <h4 className="form-section-title">General Location & Identity</h4>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Operational Address</label>
                <input type="text" name="address" className="form-control" required value={formData.address} onChange={handleChange} />
              </div>
              <div className="form-group full-width">
                <label>Google Maps Embedded Link URL</label>
                <input type="url" name="mapsLink" className="form-control" required value={formData.mapsLink} onChange={handleChange} />
              </div>
            </div>

            <h4 className="form-section-title">Communication & Contacts</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Retail Support WhatsApp/Phone</label>
                <input type="text" name="retailPhone" className="form-control" required value={formData.retailPhone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Wholesale Dept. WhatsApp/Phone</label>
                <input type="text" name="wholesalePhone" className="form-control" required value={formData.wholesalePhone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Retail Contact Email</label>
                <input type="email" name="retailEmail" className="form-control" required value={formData.retailEmail} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Wholesale Corporate Email</label>
                <input type="email" name="wholesaleEmail" className="form-control" required value={formData.wholesaleEmail} onChange={handleChange} />
              </div>
            </div>

            <h4 className="form-section-title">Opening Hours Operation</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Monday to Friday Hours</label>
                <input type="text" name="hoursMonFri" className="form-control" required value={formData.hoursMonFri} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Saturday Hours</label>
                <input type="text" name="hoursSat" className="form-control" required value={formData.hoursSat} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Sunday Hours</label>
                <input type="text" name="hoursSun" className="form-control" required value={formData.hoursSun} onChange={handleChange} />
              </div>
            </div>

            <h4 className="form-section-title">Logistics & Delivery Pricing</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Flat Delivery Base Fee (₹)</label>
                <input type="number" name="deliveryFlatRate" className="form-control" required value={formData.deliveryFlatRate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Variable Rate per Kilometer (₹/Km)</label>
                <input type="number" name="deliveryRatePerKm" className="form-control" required value={formData.deliveryRatePerKm} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Free Delivery Min Order Value (₹)</label>
                <input type="number" name="freeDeliveryMinOrder" className="form-control" required value={formData.freeDeliveryMinOrder} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Free Delivery Max Distance Radius (Km)</label>
                <input type="number" step="0.1" name="freeDeliveryMaxDistance" className="form-control" required value={formData.freeDeliveryMaxDistance} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group mt-3">
              <button type="submit" className="btn btn-primary btn-large">Save All Settings Changes</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SettingsTab;
