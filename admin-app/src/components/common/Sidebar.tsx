import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, DollarSign, ArrowDownCircle, Settings, X, TrendingUp } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleSidebar}
        ></div>
      )}
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">CryptoInvest</span>
          <button 
            onClick={toggleSidebar}
            className="sidebar-close-btn"
          >
            <X className="sidebar-icon" />
            <span className="sr-only">Close sidebar</span>
          </button>
        </div>
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <SidebarLink to="/admin" icon={<Home className="sidebar-icon" />}>Dashboard</SidebarLink>
            <SidebarLink to="/admin/users" icon={<Users className="sidebar-icon" />}>Users</SidebarLink>
            <SidebarLink to="/admin/subscription-investments" icon={<TrendingUp className="sidebar-icon" />}>Subscription Investments</SidebarLink>
            <SidebarLink to="/admin/deposits" icon={<DollarSign className="sidebar-icon" />}>Deposits</SidebarLink>
            <SidebarLink to="/admin/withdrawals" icon={<ArrowDownCircle className="sidebar-icon" />}>Withdrawals</SidebarLink>
            <SidebarLink to="/admin/crypto-settings" icon={<DollarSign className="sidebar-icon" />}>Crypto Settings</SidebarLink>
            <SidebarLink to="/admin/system-settings" icon={<Settings className="sidebar-icon" />}>System Settings</SidebarLink>
          </nav>
        </div>
      </div>
    </>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'sidebar-link',
          isActive ? 'sidebar-link-active' : ''
        ].join(' ')
      }
    >
      <span className="sidebar-link-icon">{icon}</span>
      {children}
    </NavLink>
  );
};

export default Sidebar; 