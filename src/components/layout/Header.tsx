import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Menu, X, UserCircle, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <header className="bg-black bg-opacity-95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-6 w-6 text-black" />
                </div>
                <span className="ml-3 text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">ReviewHub</span>
              </Link>
            </div>

            <nav className="hidden sm:ml-8 sm:flex sm:space-x-1">
              <Link to="/" className="text-gray-300 hover:text-primary hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                Home
              </Link>

              {isAuthenticated && (
                <>
                  <Link to="/dashboard" className="text-gray-300 hover:text-primary hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                    Dashboard
                  </Link>
                  <Link to="/campaigns" className="text-gray-300 hover:text-primary hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                    Campaigns
                  </Link>
                  <Link to="/wallet" className="text-gray-300 hover:text-primary hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                    Wallet
                  </Link>
                </>
              )}
            </nav>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center text-sm focus:outline-none bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 transition-all duration-300"
                >
                  <Avatar
                    name={user?.name}
                    src={user?.avatar}
                    size="sm"
                  />
                  <span className="ml-2 text-white font-medium">{user?.name}</span>
                </button>

                {userMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-gray-900 border border-gray-700 focus:outline-none"
                  >
                    <div className="py-2">
                      <div className="px-4 py-3 text-sm text-gray-400 border-b border-gray-700">
                        Signed in as<br />
                        <span className="font-medium text-white">{user?.email}</span>
                      </div>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-primary transition-all duration-300"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-all duration-300"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:border-primary hover:text-primary">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-primary hover:bg-primary-600 text-black font-semibold">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-primary hover:bg-gray-800 focus:outline-none transition-all duration-300"
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-gray-900 border-t border-gray-800">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link
              to="/"
              className="block px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary transition-all duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/campaigns"
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Campaigns
                </Link>
                <Link
                  to="/wallet"
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Wallet
                </Link>
              </>
            )}
          </div>

          {isAuthenticated ? (
            <div className="pt-4 pb-3 border-t border-gray-800">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <Avatar
                    name={user?.name}
                    src={user?.avatar}
                    size="md"
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-400">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-4">
                <Link
                  to="/settings"
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-all duration-300"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-800">
              <div className="flex flex-col space-y-3 px-4">
                <Link
                  to="/login"
                  className="w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  <Button variant="outline" fullWidth className="border-gray-600 text-gray-300 hover:border-primary hover:text-primary">
                    Log in
                  </Button>
                </Link>
                <Link
                  to="/register"
                  className="w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  <Button fullWidth className="bg-primary hover:bg-primary-600 text-black font-semibold">
                    Sign up
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};