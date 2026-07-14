import React, { useState, useEffect } from 'react';
import LoginGate from './components/LoginGate';
import Sidebar from './components/Sidebar';
import OverviewTab from './tabs/OverviewTab';
import CatalogTab from './tabs/CatalogTab';
import WholesaleTab from './tabs/WholesaleTab';
import SettingsTab from './tabs/SettingsTab';

// Import Admin CSS if there's any specific styles.
// Assuming admin styles were merged or are in `admin.css`.
import '../../styles/admin.css';

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check session storage for login status
    if (sessionStorage.getItem("salim_admin_logged_in") === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem("salim_admin_logged_in", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("salim_admin_logged_in");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginGate onLogin={handleLogin} />;
  }

  return (
    <div className="admin-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-title">
            <h2>{activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'catalog' && 'Product Catalog Management'}
                {activeTab === 'wholesale' && 'Wholesale Inquiries'}
                {activeTab === 'settings' && 'Platform Settings'}
            </h2>
          </div>
          <div className="topbar-actions">
            <a href="/" className="btn btn-outline" target="_blank" rel="noreferrer">
              View Live Website
            </a>
          </div>
        </header>
        
        <div className="admin-content-area">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'catalog' && <CatalogTab />}
          {activeTab === 'wholesale' && <WholesaleTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  );
};

export default Admin;
