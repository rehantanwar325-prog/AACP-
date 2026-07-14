import React, { useState, useEffect } from 'react';
import LoginGate from './components/LoginGate';
import Sidebar from './components/Sidebar';
import CatalogTab from './tabs/CatalogTab';
import SettingsTab from './tabs/SettingsTab';

// Import Admin CSS if there's any specific styles.
// Assuming admin styles were merged or are in `admin.css`.
import '../../styles/admin.css';

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('catalog');

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
    <div className="dashboard-wrapper">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="main-content">
        <header className="top-header">
          <div className="header-title">
            <h1 id="tab-heading">
                {activeTab === 'catalog' && 'Product Catalog Management'}
                {activeTab === 'settings' && 'Platform Settings'}
            </h1>
            <p id="tab-subheading">Welcome back, Admin.</p>
          </div>
          <div className="header-actions">
            <a href="/" className="btn btn-outline-white" target="_blank" rel="noreferrer">
              View Live Website
            </a>
          </div>
        </header>
        
        {activeTab === 'catalog' && <CatalogTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
};

export default Admin;
