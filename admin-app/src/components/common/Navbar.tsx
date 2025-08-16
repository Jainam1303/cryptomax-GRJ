import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          {toggleSidebar && (
            <button 
              className="navbar-menu-btn"
              onClick={toggleSidebar}
            >
              <svg className="navbar-menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <div className="navbar-title-section">
            <h2 className="navbar-title">Admin Panel</h2>
            <p className="navbar-subtitle">Manage the platform and user accounts.</p>
          </div>
        </div>
        <div className="navbar-right">
          <button className="logout-btn" onClick={handleLogout} style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            marginLeft: '1rem'
          }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 