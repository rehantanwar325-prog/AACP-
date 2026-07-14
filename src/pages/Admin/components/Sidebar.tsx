import React from 'react';
import { ShoppingBag, Settings as SettingsIcon, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="logo-accent">AACP</span> Chicken
        <span className="sidebar-tag">Admin</span>
      </div>

      <nav className="sidebar-nav">
        <button className={`nav-item ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>
          <ShoppingBag size={20} />
          <span>Manage Catalog</span>
        </button>

        <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <SettingsIcon size={20} />
          <span>Manage Settings</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={onLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
