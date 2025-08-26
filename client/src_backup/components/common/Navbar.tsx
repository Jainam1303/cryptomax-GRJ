import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Wallet, LogOut, Menu, X } from 'lucide-react';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Don't show navbar on home page since it has its own navigation
  if (window.location.pathname === '/') {
    return null;
  }

  return (
    <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-white">CryptoMax</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/invest"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Invest
                </Link>
                <Link
                  to="/portfolio"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Portfolio
                </Link>
                <Link
                  to="/wallet"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Wallet className="w-4 h-4 inline mr-1" />
                  Wallet
                </Link>
                {/* Admin Panel Link - Only for admins */}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-purple-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors border border-purple-400"
                  >
                    Admin Panel
                  </Link>
                )}
                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <div className="text-gray-300 text-sm">
                    Welcome, {user?.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white p-2 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/40 backdrop-blur-sm rounded-lg mt-2 border border-white/10">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/invest"
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Invest
                  </Link>
                  <Link
                    to="/portfolio"
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Portfolio
                  </Link>
                  <Link
                    to="/wallet"
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Wallet className="w-4 h-4 inline mr-1" />
                    Wallet
                  </Link>
                  {/* Admin Panel Link - Only for admins */}
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-purple-400 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors border border-purple-400"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-white/10 pt-4 mt-4">
                    <div className="text-gray-300 px-3 py-2 text-sm">
                      Welcome, {user?.name}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4 inline mr-1" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-purple-600 hover:bg-purple-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;