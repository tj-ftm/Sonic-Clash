import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useGameData } from '../context/GameDataContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Gamepad2, Wallet, Store, Twitter, User, Menu, X, ChevronDown,
  Shield, Award, LogOut, CircleDollarSign, Sun, Moon
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { isConnected, address, balance, connectWallet, disconnectWallet } = useWallet();
  const { sonicPoints, userCards } = useGameData();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsDropdownOpen(false);
    closeMenu();
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: <Shield className="w-5 h-5" /> },
    { path: '/battle-arena', label: 'Battle Arena', icon: <Gamepad2 className="w-5 h-5" /> },
    { path: '/marketplace', label: 'Marketplace', icon: <Store className="w-5 h-5" /> },
    { path: '/shill-dashboard', label: 'Shill to Earn', icon: <Twitter className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-secondary-light dark:bg-secondary-dark border-b-2 border-accent-light dark:border-accent-dark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-accent-light dark:text-accent-dark" />
                <span className="ml-2 text-xl font-pixel text-text-light dark:text-text-dark">
                  Sonic Clash
                </span>
              </div>
            </Link>
            
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-3 py-2 text-sm font-pixel ${
                    location.pathname === link.path
                      ? 'text-accent-light dark:text-accent-dark border-b-2 border-accent-light dark:border-accent-dark'
                      : 'text-text-light dark:text-text-dark hover:text-accent-light dark:hover:text-accent-dark'
                  }`}
                >
                  {link.icon}
                  <span className="ml-1">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="mr-4 p-2 rounded-full hover:bg-secondary-dark dark:hover:bg-secondary-light transition"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-accent-dark" />
              ) : (
                <Moon className="h-5 w-5 text-accent-light" />
              )}
            </button>

            {/* Sonic Points */}
            {isConnected && (
              <div className="hidden md:flex items-center mr-4 bg-secondary-dark dark:bg-secondary-light px-3 py-1 rounded border border-accent-light dark:border-accent-dark">
                <CircleDollarSign className="h-4 w-4 text-accent-light dark:text-accent-dark mr-1" />
                <span className="text-xs font-pixel text-text-light dark:text-text-dark">
                  {sonicPoints} Points
                </span>
              </div>
            )}
            
            {/* Wallet Connection */}
            {isConnected ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center px-3 py-2 bg-neon-blue rounded-md border border-accent-light hover:bg-neon-purple transition"
                >
                  <Wallet className="h-4 w-4 text-black mr-1" />
                  <span className="text-xs font-pixel text-black hidden sm:block">
                    {truncateAddress(address || '')}
                  </span>
                  <span className="text-xs font-pixel text-black block sm:hidden">
                    Wallet
                  </span>
                  <ChevronDown className="h-3 w-3 ml-1 text-black" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-secondary-light dark:bg-secondary-dark border-2 border-accent-light dark:border-accent-dark rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-accent-light dark:border-accent-dark">
                        <p className="text-xs font-pixel text-text-light dark:text-text-dark">
                          {truncateAddress(address || '')}
                        </p>
                        <p className="text-xs font-pixel text-accent-light dark:text-accent-dark mt-1">
                          {balance ? `${parseFloat(balance).toFixed(2)} S` : 'Loading...'}
                        </p>
                      </div>

                      {/* NFTs Section */}
                      <div className="px-4 py-2 border-b border-accent-light dark:border-accent-dark">
                        <h3 className="text-xs font-pixel text-text-light dark:text-text-dark mb-2">
                          Your NFTs
                        </h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {userCards.length > 0 ? (
                            userCards.map((card) => (
                              <div key={card.tokenId} className="flex items-center">
                                <img src={card.image} alt={card.name} className="w-8 h-8 rounded mr-2" />
                                <span className="text-xs text-text-light dark:text-text-dark">{card.name}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-gray-500">No NFTs found</div>
                          )}
                        </div>
                      </div>

                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2 text-xs font-pixel text-text-light dark:text-text-dark hover:bg-secondary-dark dark:hover:bg-secondary-light"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <button 
                        onClick={handleDisconnect}
                        className="flex items-center w-full text-left px-4 py-2 text-xs font-pixel text-text-light dark:text-text-dark hover:bg-secondary-dark dark:hover:bg-secondary-light"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-3 py-2 bg-accent-light dark:bg-accent-dark text-white rounded-md text-xs font-pixel hover:bg-opacity-80 transition flex items-center"
              >
                <Wallet className="h-4 w-4 inline mr-1" />
                Connect Wallet
              </button>
            )}
            
            <div className="md:hidden ml-4">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-text-light dark:text-text-dark hover:text-accent-light dark:hover:text-accent-dark focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-accent-light dark:border-accent-dark bg-secondary-light dark:bg-secondary-dark">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 text-sm font-pixel ${
                  location.pathname === link.path
                    ? 'text-accent-light dark:text-accent-dark border-l-4 border-accent-light dark:border-accent-dark bg-secondary-dark dark:bg-secondary-light'
                    : 'text-text-light dark:text-text-dark hover:text-accent-light dark:hover:text-accent-dark'
                }`}
                onClick={closeMenu}
              >
                {link.icon}
                <span className="ml-2">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;